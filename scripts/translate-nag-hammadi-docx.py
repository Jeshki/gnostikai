"""Translate Nag Hammadi Library.docx EN to LT via Google Cloud Translation."""

from __future__ import annotations

import html
import json
import re
import shutil
import sys
import time
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

import requests
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from docx.text.paragraph import Paragraph

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "Biblija" / "_nag_src.docx"
CACHE = ROOT / "Biblija" / "nag-hammadi-lt" / "cache.json"
LOCAL_OUT = ROOT / "Biblija" / "nag-hammadi-lt" / "Nag_Hammadi_Library_LT.docx"
OUT = Path(r"C:\Users\HP\OneDrive\Desktop\Nag_Hammadi_Library_LT.docx")
ENDPOINT = "https://translation.googleapis.com/language/translate/v2"
FONT = "Times New Roman"

NOTE = (
    "Visas dokumentas i\u0161verstas ma\u0161ininiu b\u016bdu i\u0161 angl\u0173 kalbos "
    "(Google Cloud Translation). \u0160altinis: James M. Robinson, red., "
    "The Nag Hammadi Library."
)
HEADER = "Nag Hammadi biblioteka"
FOOTER = "Ma\u0161ininis vertimas  \u00b7  "

STYLE_META = {
    "Antrat1": {"kind": "h1", "size": 18, "bold": True, "before": 18, "after": 8},
    "Antrat2": {"kind": "h2", "size": 14, "bold": True, "before": 14, "after": 6},
    "Antrat3": {"kind": "h3", "size": 12, "bold": True, "before": 12, "after": 4},
    "ContentsCodex": {"kind": "h2", "size": 14, "bold": True, "before": 12, "after": 4},
    "CodexLabel": {"kind": "h2", "size": 14, "bold": True, "before": 16, "after": 6, "center": True},
    "ContentsEntry": {"kind": "body", "size": 12, "before": 0, "after": 2, "left": 0.75},
    "Normal": {"kind": "body", "size": 12, "before": 0, "after": 8},
    "Translator": {"kind": "note", "size": 11, "italic": True, "before": 2, "after": 2, "color": "333333"},
    "SourceNote": {"kind": "note", "size": 10, "italic": True, "before": 0, "after": 10, "color": "555555"},
    "Citata": {"kind": "quote", "size": 12, "italic": True, "before": 6, "after": 6, "left": 1.25},
    "Prayer": {"kind": "poetry", "size": 12, "italic": True, "before": 0, "after": 0, "left": 1.0},
    "Poetry": {"kind": "poetry", "size": 12, "italic": True, "before": 0, "after": 0, "left": 1.25},
    "CrossRef": {"kind": "note", "size": 10, "italic": True, "before": 2, "after": 2, "color": "555555"},
    "CenteredLine": {"kind": "body", "size": 12, "before": 2, "after": 2, "center": True},
    "LargeText": {"kind": "body", "size": 14, "before": 8, "after": 4, "center": True},
    "Endnote": {"kind": "note", "size": 10, "before": 2, "after": 2, "color": "444444"},
}


def log(message: str) -> None:
    print(message, flush=True)


def load_env() -> None:
    import os

    for name in (".env.local", ".env"):
        file = ROOT / name
        if not file.exists():
            continue
        for line in file.read_text(encoding="utf-8").splitlines():
            match = re.match(r"^([A-Z0-9_]+)\s*=\s*(.*)$", line)
            if not match or match.group(1) in os.environ:
                continue
            os.environ[match.group(1)] = match.group(2).strip().strip("\"'")


def rgb(value: str) -> RGBColor:
    return RGBColor(int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16))


def flag_on(element: ET.Element | None) -> bool:
    if element is None:
        return False
    return element.get(f"{W}val") not in ("0", "false", "off")


def run_html(run: ET.Element) -> str:
    props = run.find(f"{W}rPr")
    bold = italic = False
    if props is not None:
        bold = flag_on(props.find(f"{W}b"))
        italic = flag_on(props.find(f"{W}i"))
    chunks: list[str] = []
    for child in run:
        if child.tag == f"{W}t":
            chunks.append(html.escape(child.text or ""))
        elif child.tag == f"{W}tab":
            chunks.append(" ")
        elif child.tag in (f"{W}br", f"{W}cr"):
            chunks.append("<br/>")
    text = "".join(chunks)
    if not text:
        return ""
    if bold and italic:
        return f"<b><i>{text}</i></b>"
    if bold:
        return f"<b>{text}</b>"
    if italic:
        return f"<i>{text}</i>"
    return text


def paragraph_html(paragraph: ET.Element) -> str:
    parts: list[str] = []
    for child in paragraph:
        if child.tag == f"{W}r":
            parts.append(run_html(child))
        elif child.tag in (f"{W}hyperlink", f"{W}ins", f"{W}smartTag"):
            for run in child.findall(f".//{W}r"):
                parts.append(run_html(run))
    return "".join(parts)


def paragraph_record(paragraph: ET.Element) -> dict:
    style_el = paragraph.find(f"{W}pPr/{W}pStyle")
    align_el = paragraph.find(f"{W}pPr/{W}jc")
    return {
        "style": style_el.get(f"{W}val") if style_el is not None else "Normal",
        "align": align_el.get(f"{W}val") if align_el is not None else None,
        "html": paragraph_html(paragraph),
    }


def extract_blocks() -> list[dict]:
    root = ET.fromstring(zipfile.ZipFile(SRC).read("word/document.xml"))
    body = root.find(f"{W}body")
    blocks: list[dict] = []
    for child in list(body):
        if child.tag == f"{W}p":
            blocks.append({"type": "p", **paragraph_record(child)})
        elif child.tag == f"{W}tbl":
            rows = []
            for tr in child.findall(f"{W}tr"):
                rows.append([[paragraph_record(p) for p in tc.findall(f"{W}p")] for tc in tr.findall(f"{W}tc")])
            blocks.append({"type": "tbl", "rows": rows})
    return blocks


def needs_translation(text: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", text)
    return bool(re.search(r"[A-Za-z]", plain))


def pack(items: list[str], max_chars: int = 8000, max_items: int = 30) -> list[list[str]]:
    batches: list[list[str]] = []
    current: list[str] = []
    size = 0
    for item in items:
        if current and (len(current) >= max_items or size + len(item) > max_chars):
            batches.append(current)
            current = []
            size = 0
        current.append(item)
        size += len(item)
    if current:
        batches.append(current)
    return batches


def translate_batch(texts: list[str], key: str) -> list[str]:
    response = requests.post(
        ENDPOINT,
        headers={"Content-Type": "application/json", "X-Goog-Api-Key": key},
        json={"q": texts, "source": "en", "target": "lt", "format": "html", "model": "nmt"},
        timeout=120,
    )
    if response.status_code == 429:
        wait = int(response.headers.get("retry-after") or 8)
        error = RuntimeError("429")
        error.retry_after = wait  # type: ignore[attr-defined]
        raise error
    if not response.ok:
        detail = response.text[:500]
        try:
            detail = response.json()["error"]["message"]
        except Exception:
            pass
        raise RuntimeError(f"Google Translate {response.status_code}: {detail}")
    translations = response.json().get("data", {}).get("translations", [])
    if len(translations) != len(texts):
        raise RuntimeError(f"Google Translate returned {len(translations)} of {len(texts)}")
    return [item.get("translatedText") or "" for item in translations]


def translate_resilient(batch: list[str], key: str) -> list[str]:
    last: Exception | None = None
    for attempt in range(6):
        try:
            return translate_batch(batch, key)
        except RuntimeError as error:
            last = error
            wait = getattr(error, "retry_after", None)
            if wait:
                log(f"  429 wait {wait}s")
                time.sleep(int(wait) + 1)
                continue
            message = str(error)
            if len(batch) > 1 and ("400" in message or attempt >= 3):
                mid = max(1, len(batch) // 2)
                log(f"  split {len(batch)}: {message[:180]}")
                return translate_resilient(batch[:mid], key) + translate_resilient(batch[mid:], key)
            if attempt == 5:
                raise
            log(f"  retry: {message[:180]}")
            time.sleep(3 * (attempt + 1))
    raise last or RuntimeError("translate failed")


def save_cache(cache: dict[str, str]) -> None:
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    temp = CACHE.with_suffix(".json.tmp")
    temp.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
    temp.replace(CACHE)


def translate_all(texts: list[str], key: str, cache: dict[str, str]) -> None:
    pending = [text for text in texts if not str(cache.get(text, "")).strip()]
    batches = pack(pending)
    billed = sum(len(text) for text in pending)
    log(f"unique {len(texts)} cached {len(texts) - len(pending)} batches {len(batches)} chars {billed}")
    done = 0
    for index, batch in enumerate(batches, start=1):
        translated = translate_resilient(batch, key)
        for source, target in zip(batch, translated):
            cache[source] = target
        done += len(batch)
        if index == 1 or index % 5 == 0 or index == len(batches):
            save_cache(cache)
            log(f"  batch {index}/{len(batches)} fragments {done}/{len(pending)}")
        time.sleep(0.12)
    save_cache(cache)


TAG_SPLIT = re.compile(r"(</?(?:b|i|em|strong)\s*/?>)", re.I)


def html_to_runs(value: str) -> list[tuple[str, bool, bool]]:
    text = html.unescape(value or "")
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</?span\b[^>]*>", "", text, flags=re.I)
    bold = italic = False
    runs: list[tuple[str, bool, bool]] = []
    for part in TAG_SPLIT.split(text):
        low = part.lower()
        if low.startswith("<b") or low.startswith("<strong"):
            bold = not low.startswith("</")
            continue
        if low.startswith("<i") or low.startswith("<em"):
            italic = not low.startswith("</")
            continue
        plain = re.sub(r"<[^>]+>", "", part)
        if plain:
            runs.append((plain, bold, italic))
    return runs or [("", False, False)]


def apply_font(run, size: int, bold: bool, italic: bool, color: str | None) -> None:
    run.font.name = FONT
    run._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color:
        run.font.color.rgb = rgb(color)


def add_runs(paragraph, translated: str, meta: dict) -> None:
    base_italic = bool(meta.get("italic"))
    base_bold = bool(meta.get("bold"))
    for text, bold, italic in html_to_runs(translated):
        pieces = text.split("\n")
        for index, piece in enumerate(pieces):
            if index:
                paragraph.add_run().add_break()
            if not piece:
                continue
            run = paragraph.add_run(piece)
            apply_font(run, meta["size"], base_bold or bold, base_italic or italic, meta.get("color"))


def configure_styles(document: Document) -> None:
    normal = document.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(12)
    normal.font.color.rgb = RGBColor(0, 0, 0)
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    for style_name, size in (("Heading 1", 18), ("Heading 2", 14), ("Heading 3", 12)):
        style = document.styles[style_name]
        style.font.name = FONT
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.italic = False
        style.font.color.rgb = RGBColor(0, 0, 0)
        style._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)


def format_paragraph(paragraph, meta: dict, align: str | None) -> None:
    fmt = paragraph.paragraph_format
    fmt.space_before = Pt(meta["before"])
    fmt.space_after = Pt(meta["after"])
    fmt.line_spacing_rule = WD_LINE_SPACING.SINGLE
    if meta.get("left"):
        fmt.left_indent = Cm(meta["left"])
    if meta.get("center") or align == "center":
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif align == "both":
        paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    elif meta["kind"] == "body":
        paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY


def fill_paragraph(paragraph, record: dict, cache: dict[str, str], use_heading: bool = False) -> None:
    meta = STYLE_META.get(record["style"], STYLE_META["Normal"])
    if use_heading:
        style_name = {"h1": "Heading 1", "h2": "Heading 2", "h3": "Heading 3"}.get(meta["kind"])
        if style_name:
            paragraph.style = style_name
    format_paragraph(paragraph, meta, record.get("align"))
    source = record["html"]
    if source.strip():
        add_runs(paragraph, cache.get(source, source), meta)


def add_page_field(paragraph) -> None:
    begin = paragraph.add_run()
    apply_font(begin, 9, False, False, "666666")
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    begin._r.append(fld_begin)
    instr_run = paragraph.add_run()
    apply_font(instr_run, 9, False, False, "666666")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    instr_run._r.append(instr)
    end = paragraph.add_run()
    apply_font(end, 9, False, False, "666666")
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    end._r.append(fld_end)


def build_docx(blocks: list[dict], cache: dict[str, str]) -> None:
    document = Document()
    configure_styles(document)
    for section in document.sections:
        section.page_width = Cm(21.0)
        section.page_height = Cm(29.7)
        section.top_margin = Cm(2.0)
        section.bottom_margin = Cm(2.0)
        section.left_margin = Cm(2.2)
        section.right_margin = Cm(2.2)
        header = section.header.paragraphs[0]
        header.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        apply_font(header.add_run(HEADER), 9, False, True, "666666")
        footer = section.footer.paragraphs[0]
        footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
        apply_font(footer.add_run(FOOTER), 9, False, False, "666666")
        add_page_field(footer)

    note = document.add_paragraph()
    note.paragraph_format.space_after = Pt(12)
    apply_font(note.add_run(NOTE), 10, False, True, "555555")

    for block in blocks:
        if block["type"] == "p":
            paragraph = document.add_paragraph()
            fill_paragraph(paragraph, block, cache, use_heading=True)
            continue
        rows = block["rows"]
        cols = max((len(row) for row in rows), default=1)
        table = document.add_table(rows=len(rows), cols=cols)
        table.style = "Table Grid"
        for r_index, row in enumerate(rows):
            for c_index in range(cols):
                cell = table.cell(r_index, c_index)
                paras = row[c_index] if c_index < len(row) else []
                if not paras:
                    continue
                fill_paragraph(cell.paragraphs[0], paras[0], cache)
                for record in paras[1:]:
                    new_p = OxmlElement("w:p")
                    cell._tc.append(new_p)
                    fill_paragraph(Paragraph(new_p, cell), record, cache)

    document.core_properties.title = HEADER
    document.core_properties.subject = "Google Cloud Translation NMT en-lt"
    LOCAL_OUT.parent.mkdir(parents=True, exist_ok=True)
    document.save(LOCAL_OUT)
    try:
        shutil.copyfile(LOCAL_OUT, OUT)
    except OSError as error:
        log(f"desktop copy failed: {error}")
        raise
    log(f"saved {OUT}")
    log(f"saved {LOCAL_OUT}")


def main() -> None:
    import os

    load_env()
    key = os.environ.get("GOOGLE_TRANSLATE_API_KEY", "").strip()
    if not key:
        raise SystemExit("missing GOOGLE_TRANSLATE_API_KEY")
    if not SRC.exists():
        raise SystemExit(f"missing source {SRC}")
    blocks = extract_blocks()
    texts: list[str] = []
    seen: set[str] = set()

    def collect(record: dict) -> None:
        html_text = record["html"]
        if needs_translation(html_text) and html_text not in seen:
            seen.add(html_text)
            texts.append(html_text)

    for block in blocks:
        if block["type"] == "p":
            collect(block)
        else:
            for row in block["rows"]:
                for cell in row:
                    for record in cell:
                        collect(record)

    plain_chars = sum(len(re.sub(r"<[^>]+>", "", text)) for text in texts)
    log(f"blocks {len(blocks)} fragments {len(texts)} plain_chars {plain_chars}")
    cache: dict[str, str] = {}
    if CACHE.exists():
        cache = json.loads(CACHE.read_text(encoding="utf-8"))
        log(f"resume cache {len(cache)}")
    translate_all(texts, key, cache)
    missing = [text for text in texts if not str(cache.get(text, "")).strip()]
    if missing:
        raise SystemExit(f"missing translations {len(missing)}")
    build_docx(blocks, cache)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        log(f"ERROR: {error}")
        sys.exit(1)
