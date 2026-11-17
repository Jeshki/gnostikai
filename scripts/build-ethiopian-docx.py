# -*- coding: utf-8 -*-
"""Build the Lithuanian docx from DeepL output."""
import json
import re
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(r"C:\Users\HP\OneDrive\Desktop\gnostikai-main")
QUEUE = ROOT / "Biblija" / "etiopijos-src" / "queue.json"
LT_DIR = ROOT / "Biblija" / "etiopijos-lt"
OUT = ROOT / "Biblija" / "Etiopijos_papildomos_knygos_LT.docx"
VERSE_RE = re.compile(r"(\d+\u00a0)")


def set_run_font(run, size, bold=False):
    run.font.name = "Times New Roman"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
    run.font.size = Pt(size)
    run.bold = bold
    run.font.color.rgb = RGBColor(0, 0, 0)
    rpr = run._element.get_or_add_rPr()
    lang = rpr.find(qn("w:lang"))
    if lang is None:
        lang = OxmlElement("w:lang")
        rpr.append(lang)
    lang.set(qn("w:val"), "lt-LT")


def add_page_number(paragraph):
    run = paragraph.add_run()
    set_run_font(run, 10)
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    run._r.append(begin)
    run._r.append(instr)
    run._r.append(separate)
    shown = OxmlElement("w:t")
    shown.text = "1"
    run._r.append(shown)
    run._r.append(end)


def style_heading(document, name, size, before, after):
    style = document.styles[name]
    style.font.name = "Times New Roman"
    style.font.size = Pt(size)
    style.font.bold = True
    style.font.color.rgb = RGBColor(0, 0, 0)
    style.font.italic = False
    pf = style.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    pf.line_spacing = 1.15


def add_body(document, text):
    paragraph = document.add_paragraph()
    paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    paragraph.paragraph_format.space_after = Pt(8)
    paragraph.paragraph_format.space_before = Pt(0)
    paragraph.paragraph_format.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
    paragraph.paragraph_format.line_spacing = 1.15
    parts = VERSE_RE.split(text)
    for part in parts:
        if not part:
            continue
        run = paragraph.add_run(part)
        is_verse = VERSE_RE.fullmatch(part) is not None
        set_run_font(run, 11 if is_verse else 12, bold=is_verse)


def main():
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))
    document = Document()
    section = document.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(2.0)
    section.bottom_margin = Cm(2.0)
    section.left_margin = Cm(2.2)
    section.right_margin = Cm(2.2)

    normal = document.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal.font.size = Pt(12)
    normal.font.color.rgb = RGBColor(0, 0, 0)
    style_heading(document, "Heading 1", 20, 0, 12)
    style_heading(document, "Heading 2", 14, 16, 6)
    style_heading(document, "Heading 3", 13, 14, 6)

    header = section.header.paragraphs[0]
    header.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = header.add_run("Etiopijos kanono papildymas")
    set_run_font(run, 10)
    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_page_number(footer)

    finished = []
    unfinished = []
    books = []
    for book in queue:
        path = LT_DIR / f"{book['slug']}.json"
        if not path.exists():
            unfinished.append((book["titleLt"], "nepradėta"))
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        translated = {unit["id"]: unit["lt"] for unit in data["units"]}
        missing = [unit for unit in book["units"] if unit["id"] not in translated]
        books.append((book, translated, missing))
        if missing:
            done_chapters = 0
            seen = {unit["id"] for unit in data["units"]}
            for index, unit in enumerate(book["units"]):
                if unit["kind"] != "chapter":
                    continue
                nxt = next((item for item in book["units"][index + 1 :] if not item.get("skip")), None)
                if nxt and nxt["id"] in seen:
                    done_chapters += 1
            unfinished.append((book["titleLt"], f"išversta skyrių: {done_chapters}"))
        else:
            finished.append(book["titleLt"])

    intro = document.add_paragraph()
    intro.alignment = WD_ALIGN_PARAGRAPH.LEFT
    note = intro.add_run(
        "DeepL vertimas iš angliško teksto dokumente „Etiopijos Biblija“. "
        "Mašininis vertimas, ne bažnytinis leidimas. Eilučių numeriai palikti tose pačiose vietose kaip šaltinyje."
    )
    set_run_font(note, 11)
    if unfinished:
        tail = document.add_paragraph()
        run = tail.add_run(
            "Dar nebaigta: " + "; ".join(f"{title} ({state})" for title, state in unfinished) + "."
        )
        set_run_font(run, 11)

    first = True
    for book, translated, missing in books:
        if not translated:
            continue
        heading = document.add_paragraph(book["titleLt"], style="Heading 1")
        if not first:
            heading.paragraph_format.page_break_before = True
        first = False
        rendered = []
        for unit in book["units"]:
            if unit["id"] not in translated:
                break
            rendered.append(unit)
        while rendered and rendered[-1]["kind"] == "chapter":
            rendered.pop()
        stopped_early = len(rendered) < len(book["units"])
        for unit in rendered:
            text = translated[unit["id"]]
            kind = unit["kind"]
            if kind == "chapter":
                label = text if book["slug"] == "ps151" else f"{text} skyrius"
                document.add_paragraph(label, style="Heading 3")
            elif kind == "h2":
                document.add_paragraph(text, style="Heading 2")
            elif kind == "h3":
                document.add_paragraph(text, style="Heading 3")
            else:
                add_body(document, text)
        if stopped_early:
            stop = document.add_paragraph()
            run = stop.add_run(
                "Čia DeepL mėnesio kvota baigėsi. Tolesnis šios knygos tekstas dar neišverstas."
            )
            set_run_font(run, 12, bold=True)

    document.save(OUT)
    print(f"wrote {OUT}")
    print("finished", len(finished))
    print("unfinished", unfinished)


if __name__ == "__main__":
    main()
