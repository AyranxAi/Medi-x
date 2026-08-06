#!/usr/bin/env python3
"""Build the distributable handover package for the Medi-X landing page.

Produces dist/medi-x-landing-<version>.zip containing:
  index.html   — comments replaced with a curated set of neutral engineering notes
  README.md    — the repo README minus the repo-only section
  fonts/       — every referenced typeface
  images/      — only files the page actually references
  favicon.svg / favicon.ico

The repository itself keeps the full annotated index.html; this script never
modifies tracked files. Usage:  python3 tools/build_handover.py [version]
"""
import re, sys, shutil, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION = sys.argv[1] if len(sys.argv) > 1 else "1.0"
STAGE = ROOT / "dist" / f"medi-x-landing-{VERSION}"

# ── 1. collect the file set the page references ──────────────────────────────
html = (ROOT / "index.html").read_text()

refs = set()
# attribute-scoped references (src/srcset/href/poster), never bare filename mentions
for attr_val in re.findall(r'(?:src|srcset|href|poster)="([^"]+)"', html):
    for part in attr_val.split(","):
        cand = part.strip().split(" ")[0]
        if cand and not cand.startswith(("http", "#", "data:", "mailto:", "tel:")):
            refs.add(cand)
# CSS url(...) references
for u in re.findall(r'url\((["\']?)([^)"\']+)\1\)', html):
    if not u[1].startswith(("http", "data:", "#", "%23")):
        refs.add(u[1])

files = sorted(r for r in refs if (ROOT / r).is_file())
missing = sorted(r for r in refs if not (ROOT / r).is_file())
if missing:
    sys.exit(f"ABORT — referenced but not on disk: {missing}")

# ── 2. strip commentary, then re-insert curated notes ────────────────────────
stripped = re.sub(r'[ \t]*/\*.*?\*/\n?', "", html, flags=re.S)
stripped = re.sub(r'[ \t]*<!--.*?-->\n?', "", stripped, flags=re.S)
# JS line comments (only full-line ones; never touches URLs since // there is preceded by ':')
stripped = re.sub(r'^[ \t]*//[^\n]*\n', "", stripped, flags=re.M)
stripped = re.sub(r'\n{3,}', "\n\n", stripped)

# sanity: no comment openers may survive outside string context
for tok in ("/*", "<!--"):
    if tok in stripped:
        sys.exit(f"ABORT — '{tok}' survived the strip; inspect before shipping")

NOTES = [
    # (anchor that must exist exactly once, note inserted BEFORE it)
    ('@font-face{font-family:"MediGyn NOW"',
     "/* All typefaces are self-hosted. The Playfair/Cormorant blocks mirror\n"
     "   Google Fonts' serving CSS including unicode-range subsetting (cyrillic\n"
     "   kept: Russian headlines render in Playfair). Do not replace with a\n"
     "   remote stylesheet — see README, Typography. */"),
    (':root{',
     "/* Single source of truth for the palette. --logo-red is sampled from the\n"
     "   wordmark artwork (median of its opaque pixels), not chosen by eye. */"),
    ('.cta{',
     "/* Primary button material: brand red at 85% over backdrop blur; phones\n"
     "   firm the fill (media query below). Label contrast is measured against\n"
     "   the composited fill — re-measure before changing fill, blur or hue.\n"
     "   Three buttons opt out of this material on purpose (hero secondary,\n"
     "   chapter-07 globe, chapter-08 press); each carries its own note. */"),
    ('.pw__scrim{',
     "/* Pathway scrim gradients: the alpha stops are measured minimums — ivory\n"
     "   copy clears 4.5:1 at the worst-case pixel of the brightest panel at\n"
     "   exactly these values. Lightening any stop requires re-measuring on the\n"
     "   real plates. */"),
    ('.reveal{',
     "/* Section reveal: IntersectionObserver adds .in on the section. */"),
    ('function setText(el,val){',
     "/* i18n note: values containing markup replace innerHTML wholesale; plain\n"
     "   strings replace only the first text node so sibling icons survive. An\n"
     "   element left holding a <br> from an English lockup is reset first —\n"
     "   English headline lockups are deliberate; other languages wrap fluidly. */"),
]
out = stripped
for anchor, note in NOTES:
    if out.count(anchor) < 1:
        sys.exit(f"ABORT — curated-note anchor missing: {anchor[:40]}")
    out = out.replace(anchor, note + "\n" + anchor, 1)

# ── 3. stage + zip ───────────────────────────────────────────────────────────
if STAGE.exists():
    shutil.rmtree(STAGE)
STAGE.mkdir(parents=True)
(STAGE / "index.html").write_text(out)

readme = (ROOT / "README.md").read_text()
readme = re.sub(r'<!-- repo-only -->.*?<!-- /repo-only -->\n?', "", readme, flags=re.S).rstrip() + "\n"
(STAGE / "README.md").write_text(readme)

for rel in files:
    dest = STAGE / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / rel, dest)

zip_path = ROOT / "dist" / f"medi-x-landing-{VERSION}.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for p in sorted(STAGE.rglob("*")):
        if p.is_file():
            z.write(p, p.relative_to(STAGE.parent))

total = sum(p.stat().st_size for p in STAGE.rglob("*") if p.is_file())
print(f"staged {len(files)} referenced assets + index.html + README.md")
print(f"package: {zip_path}  ({zip_path.stat().st_size/1e6:.1f} MB zipped, {total/1e6:.1f} MB unpacked)")
