# -*- coding: utf-8 -*-
"""Pull the Ethiopian-only books out of the English source into a translation queue."""
import json
import os
import re
from pathlib import Path

from docx import Document

ROOT = Path(r"C:\Users\HP\OneDrive\Desktop\gnostikai-main")
OUT = ROOT / "Biblija" / "etiopijos-src" / "queue.json"
SRC_CANDIDATES = [
    Path(os.environ.get("TEMP", "")) / "etiopijos_copy.docx",
    ROOT / "Biblija" / "Etiopijos_Biblija.docx",
]

BOOKS = [
    ("manasseh", "Manaso malda", "The Prayer of Manasses",
     "Penitential Prayer of Manasseh. Literary biblical Lithuanian. Traditional names: Abraomas, Izaokas, Jokūbas, Dovydas, Mozė. Keep every ⟦12⟧ token exactly."),
    ("jubilees", "Jubiliejų knyga", "The Book of Jubilees, or The Little Genesis",
     "Book of Jubilees, a retelling of Genesis. Literary biblical Lithuanian. Names: Mozė, Adomas, Ieva, Nojus, Henochas, Abraomas. Keep every ⟦12⟧ token exactly. Keep bracketed year notes."),
    ("1enoch", "Henochas (1 Henochas)", "The Book of Enoch",
     "First Book of Enoch, an apocalypse. Literary biblical Lithuanian. Keep every ⟦12⟧ token and the editorial signs ⌈⌉ [] () † exactly."),
    ("2enoch", "Antrasis Henochas (slavų)", "The Second Book of Enoch, or Slavonic Enoch, or The Book of the Secrets of Enoch",
     "Slavonic 2 Enoch. Literary biblical Lithuanian. Names: Henochas, Adomas, Nojus, Mozė. Keep every ⟦12⟧ token exactly."),
    ("1ezra", "Pirmoji Ezdro, Ezra Kali", "The First Book of Esdras, or Ezra Kali",
     "First book of Esdras, also called Ezra Kali. Literary biblical Lithuanian. Names: Ezdras, Zorobabelis, Darius, Kyras, Jeremijas. Keep every ⟦12⟧ token exactly."),
    ("2ezra", "Antroji Ezdro, Ezra Sutu’elis", "The Second Book of Esdras, or Ezra Sutu'el",
     "Second book of Esdras, the apocalypse also called Ezra Sutuel. Literary biblical Lithuanian. Names: Ezdras, Urielis. Keep every ⟦12⟧ token exactly."),
    ("meq1", "Mekabjanų I knyga", "The Book of Meqabyan I",
     "Ethiopian Meqabyan I. The English is grammatically broken and overly literal. Translate the intended meaning into clear, grammatical literary Lithuanian. Do not copy the broken grammar. Keep unusual personal names in Latin letters. JAH stays JAH. Biblical names: Izaokas, Abraomas, Jokūbas, Saliamonas, Dovydas, Benjaminas. Keep every ⟦12⟧ token exactly."),
    ("meq2", "Mekabjanų II knyga", "The Book of Meqabyan II",
     "Ethiopian Meqabyan II. The English is grammatically broken and overly literal. Translate the intended meaning into clear, grammatical literary Lithuanian. Do not copy the broken grammar. Keep unusual personal names in Latin letters. JAH stays JAH. Keep every ⟦12⟧ token exactly."),
    ("meq3", "Mekabjanų III knyga", "The Book of Meqabyan III",
     "Ethiopian Meqabyan III. The English is grammatically broken and overly literal. Translate the intended meaning into clear, grammatical literary Lithuanian. Do not copy the broken grammar. Keep unusual personal names in Latin letters. JAH stays JAH. Keep every ⟦12⟧ token exactly."),
    ("ps151", "151 psalmė", "Psalm 151",
     "Psalm 151, David's song before the fight with Goliath. Literary biblical Lithuanian. Names: Dovydas, Galijotas. Keep every ⟦12⟧ token exactly."),
    ("4baruch", "4 Baruchas", "4 Baruch, or Paralipomena of Jeremiah",
     "4 Baruch, the Paralipomena of Jeremiah. Literary biblical Lithuanian. Names: Jeremijas, Baruchas, Abimelechas, Babilonas, Jeruzalė. Keep every ⟦12⟧ token exactly."),
    ("1clement", "Pirmasis Klemenso laiškas korintiečiams", "The First Epistle of Clement to the Corinthians",
     "First Epistle of Clement to the Corinthians. Literary biblical Lithuanian. Names: Klemensas, Petras, Paulius, Kainas, Abelis. Keep every ⟦12⟧ token exactly."),
]

VERSE_RE = re.compile(r"(\d+)[\u00a0\u202f\u2007]")
LETTER_RE = re.compile(r"[A-Za-z]")
LIMIT = 3200


def source_path() -> Path:
    for path in SRC_CANDIDATES:
        if path.is_file() and path.stat().st_size > 1000:
            try:
                with path.open("rb") as handle:
                    handle.read(4)
                return path
            except OSError:
                continue
    raise SystemExit("Nepavyko atidaryti Etiopijos_Biblija.docx")


def protect(text: str) -> str:
    return VERSE_RE.sub(lambda match: f"⟦{match.group(1)}⟧ ", text)


def split_long(segment: str) -> list[str]:
    if len(segment) <= LIMIT:
        return [segment]
    sentences = re.split(r"(?<=[.?!])\s+", segment)
    chunks: list[str] = []
    current = ""
    for sentence in sentences:
        if len(sentence) > LIMIT:
            if current:
                chunks.append(current)
                current = ""
            for start in range(0, len(sentence), LIMIT):
                chunks.append(sentence[start : start + LIMIT])
            continue
        if current and len(current) + 1 + len(sentence) > LIMIT:
            chunks.append(current)
            current = sentence
        else:
            current = f"{current} {sentence}".strip() if current else sentence
    if current:
        chunks.append(current)
    return chunks


def chunk_text(text: str) -> list[str]:
    protected = protect(text)
    if "⟦" in text or "⟧" in text:
        raise SystemExit("Šaltinyje jau yra ⟦ ⟧ ženklų, reikia kito žymeklio")
    if len(protected) <= LIMIT:
        return [protected]
    bits = re.split(r"(⟦\d+⟧ )", protected)
    segments: list[str] = []
    if bits[0]:
        segments.append(bits[0])
    for index in range(1, len(bits), 2):
        marker = bits[index]
        rest = bits[index + 1] if index + 1 < len(bits) else ""
        segments.append(marker + rest)
    chunks: list[str] = []
    current = ""
    for segment in segments:
        pieces = split_long(segment) if len(segment) > LIMIT else [segment]
        for piece in pieces:
            if current and len(current) + len(piece) > LIMIT:
                chunks.append(current)
                current = piece
            else:
                current += piece
    if current:
        chunks.append(current)
    return chunks


def main() -> None:
    path = source_path()
    wanted = {title: (slug, lt, context) for slug, lt, title, context in BOOKS}
    document = Document(str(path))
    found: dict[str, list[dict[str, str]]] = {title: [] for title in wanted}
    current: str | None = None
    paragraph_index = 0
    for paragraph in document.paragraphs:
        style = paragraph.style.name if paragraph.style else ""
        text = paragraph.text.strip()
        if style == "Heading 1":
            current = text if text in wanted else None
            paragraph_index = 0
            continue
        if current is None or not text:
            continue
        kind = {"Heading 2": "h2", "Heading 3": "h3"}.get(style, "body")
        found[current].append({"kind": kind, "text": text, "para": str(paragraph_index)})
        paragraph_index += 1

    missing = [title for title, blocks in found.items() if not blocks]
    if missing:
        raise SystemExit("Nerasta: " + " | ".join(missing))

    queue = []
    for slug, title_lt, title_en, context in BOOKS:
        units = []
        chars = 0
        for block in found[title_en]:
            kind = block["kind"]
            raw = block["text"]
            if kind == "h3" and re.fullmatch(r"\d+", raw):
                units.append({
                    "id": f"{slug}-{int(block['para']):05d}",
                    "kind": "chapter",
                    "text": raw,
                    "skip": True,
                })
                continue
            if not LETTER_RE.search(raw):
                units.append({
                    "id": f"{slug}-{int(block['para']):05d}",
                    "kind": kind,
                    "text": raw,
                    "skip": True,
                })
                continue
            parts = chunk_text(raw) if kind == "body" else [raw]
            for part_index, part in enumerate(parts):
                units.append({
                    "id": f"{slug}-{int(block['para']):05d}-{part_index}",
                    "kind": kind,
                    "text": part,
                    "skip": False,
                })
                chars += len(part)
        queue.append({
            "slug": slug,
            "titleLt": title_lt,
            "titleEn": title_en,
            "context": context,
            "chars": chars,
            "units": units,
        })
        print(f"{slug:10} units={len(units):4} chars={chars:7}  {title_lt}")

    total = sum(book["chars"] for book in queue)
    print(f"TOTAL chars={total}")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(queue, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
