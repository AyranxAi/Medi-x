#!/usr/bin/env python3
"""Hand-crafted single-tint SVG wordmarks for the Medi-X press marquee.

Pipeline: HarfBuzz shapes each run (kerning included), fontTools pens emit
the glyph outlines as SVG path data. Every mark: fill=currentColor, tight
viewBox, real vector paths. MADAME's letterforms are drawn from scratch as
parametric high-contrast geometry (no free font matches that mark).
"""
import json, math, os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

FDIR = "fonts"
_cache = {}

def fonts(key):
    if key not in _cache:
        path = os.path.join(FDIR, key + ".ttf")
        blob = hb.Blob.from_file_path(path)
        face = hb.Face(blob)
        hbfont = hb.Font(face)
        tt = TTFont(path)
        _cache[key] = (hbfont, tt, face.upem)
    return _cache[key]

def shape(key, text, size, ls=0.0):
    """Shape text; returns list of (glyphName, xOffsetPx) and total advance px."""
    hbfont, tt, upem = fonts(key)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": False})
    order = tt.getGlyphOrder()
    s = size / upem
    out, x = [], 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        gname = order[info.codepoint]
        out.append((gname, x + pos.x_offset * s, pos.y_offset * s))
        x += pos.x_advance * s + ls * size
    if text:
        x -= ls * size  # no trailing letterspace
    return out, x

def r2(v):
    v = round(v * 100) / 100
    return int(v) if v == int(v) else v

class Run:
    def __init__(self, d, bbox):
        self.d, self.bbox = d, bbox

def set_text(key, text, size, x, y, ls=0.0):
    """Typeset text at (x, y baseline), y-down SVG coords. Returns Run."""
    hbfont, tt, upem = fonts(key)
    glyphset = tt.getGlyphSet()
    placed, _ = shape(key, text, size, ls)
    s = size / upem
    ds, bb = [], [1e30, 1e30, -1e30, -1e30]
    for gname, gx, gy in placed:
        t = Transform().translate(x + gx, y - gy).scale(s, -s)
        pen = SVGPathPen(glyphset, ntos=lambda v: str(r2(v)))
        glyphset[gname].draw(TransformPen(pen, t))
        d = pen.getCommands()
        if d:
            ds.append(d)
        bp = BoundsPen(glyphset)
        glyphset[gname].draw(TransformPen(bp, t))
        if bp.bounds:
            x1, y1, x2, y2 = bp.bounds
            bb = [min(bb[0], x1), min(bb[1], y1), max(bb[2], x2), max(bb[3], y2)]
    return Run("".join(ds), bb)

def adv(key, text, size, ls=0.0):
    return shape(key, text, size, ls)[1]

def merge(bbs):
    return [min(b[0] for b in bbs), min(b[1] for b in bbs),
            max(b[2] for b in bbs), max(b[3] for b in bbs)]

def emit(fname, label, pieces):
    """pieces: list of (Run, opacity|None)"""
    bb = merge([p.bbox for p, _ in pieces])
    vb = (r2(bb[0]), r2(bb[1]), r2(bb[2] - bb[0]), r2(bb[3] - bb[1]))
    def path_el(p, op):
        opac = ' opacity="%s"' % op if op else ""
        return '  <path fill="currentColor"%s d="%s"/>' % (opac, p.d)
    paths = "\n".join(path_el(p, op) for p, op in pieces)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}"'
           f' role="img" aria-label="{label}">\n{paths}\n</svg>\n')
    os.makedirs("out", exist_ok=True)
    with open("out/" + fname, "w") as f:
        f.write(svg)
    print(f"{fname:34s} viewBox {vb[0]} {vb[1]} {vb[2]} {vb[3]}  ratio {(vb[2]/vb[3]):.2f}")

# ---------------------------------------------------------------- MADAME geometry
def x_at_y(x1, y1, x2, y2):
    k = (x2 - x1) / (y2 - y1)
    return lambda y: x1 + (y - y1) * k

def isect(l1, l2, lo=-60.0, hi=760.0):
    a, b = lo, hi
    fa = l1(a) - l2(a)
    for _ in range(90):
        m = (a + b) / 2
        fm = l1(m) - l2(m)
        if (fm < 0) == (fa < 0):
            a, fa = m, fm
        else:
            b = m
    y = (a + b) / 2
    return (l1(y), y)

def poly(pts):
    return "M" + "L".join(f"{r2(px)} {r2(py)}" for px, py in pts) + "Z"

def madame_mark():
    H = 700.0          # cap height, baseline y=700
    pk = 26.0          # apex point rise
    thick, thin = 118.0, 26.0
    hT, ht = thick / 2, thin / 2

    def glyph_A():
        w = 470.0; ax = w * 0.5; f1, f2 = 54.0, w - 8.0
        sLm = x_at_y(ax - ht, 0, f1 - ht, H); sLp = x_at_y(ax + ht, 0, f1 + ht, H)
        sRm = x_at_y(ax - hT, 0, f2 - hT, H); sRp = x_at_y(ax + hT, 0, f2 + hT, H)
        J = isect(sRm, sLp, 40, H)
        body = [ (sLm(0), 0), (ax, -pk), (sRp(0), 0), (sRp(H), H), (sRm(H), H),
                 J, (sLp(H), H), (sLm(H), H) ]
        cy, cb = 478.0, 26.0
        bar = [ (sLp(cy), cy), (sRm(cy), cy), (sRm(cy + cb), cy + cb), (sLp(cy + cb), cy + cb) ]
        return w, lambda dx: [poly([(px + dx, py) for px, py in body]),
                              poly([(px + dx, py) for px, py in bar])]

    def glyph_M():
        w = 660.0
        q0, a1, v, a2, q4 = 48.0, w * 0.295, w * 0.50, w * 0.705, w - 48.0
        # thick outer strokes, thin inner V  (reference: heavy legs, hairline valley)
        s1m = x_at_y(q0 - hT, H, a1 - hT, 0); s1p = x_at_y(q0 + hT, H, a1 + hT, 0)
        s2m = x_at_y(a1 - ht, 0, v - ht, H);  s2p = x_at_y(a1 + ht, 0, v + ht, H)
        s3m = x_at_y(v - ht, H, a2 - ht, 0);  s3p = x_at_y(v + ht, H, a2 + ht, 0)
        s4m = x_at_y(a2 - hT, 0, q4 - hT, H); s4p = x_at_y(a2 + hT, 0, q4 + hT, H)
        Jv = isect(s2p, s3m, 60, H + 40)   # bottom point of the white V
        J1 = isect(s2m, s1p, 30, H)        # notch under apex1
        J2 = isect(s4m, s3p, 30, H)        # notch under apex2
        body = [ (s1m(0), 0), (a1, -pk), (s2p(0), 0), Jv, (s3m(0), 0), (a2, -pk),
                 (s4p(0), 0), (s4p(H), H), (s4m(H), H), J2, (s3p(H), H),
                 (s2m(H), H), J1, (s1p(H), H), (s1m(H), H) ]
        return w, lambda dx: [poly([(px + dx, py) for px, py in body])]

    def glyph_D():
        w = 500.0; stem = 116.0; tb = 26.0; bowlT = 112.0; sh = 0.52 * w
        ix = w - bowlT; sh2 = sh + 6
        def outer(dx):
            return (f"M{r2(dx)} 0L{r2(sh+dx)} 0"
                    f"C{r2(w*0.84+dx)} 0 {r2(w+dx)} {r2(0.19*H)} {r2(w+dx)} {r2(0.5*H)}"
                    f"C{r2(w+dx)} {r2(0.81*H)} {r2(w*0.84+dx)} {r2(H)} {r2(sh+dx)} {r2(H)}"
                    f"L{r2(dx)} {r2(H)}Z")
        def inner(dx):
            # drawn counterclockwise so nonzero fill leaves the counter open
            return (f"M{r2(stem+dx)} {r2(tb)}L{r2(stem+dx)} {r2(H-tb)}L{r2(sh2+dx)} {r2(H-tb)}"
                    f"C{r2(ix-26+dx)} {r2(H-tb)} {r2(ix+dx)} {r2(0.77*H)} {r2(ix+dx)} {r2(0.5*H)}"
                    f"C{r2(ix+dx)} {r2(0.23*H)} {r2(ix-26+dx)} {r2(tb)} {r2(sh2+dx)} {r2(tb)}Z")
        return w, lambda dx: [outer(dx), inner(dx)]

    def glyph_E():
        w = 360.0; stem = 116.0; arm = 34.0
        parts = [ [(0,0),(stem,0),(stem,H),(0,H)],
                  [(stem-1,0),(w,0),(w,arm),(stem-1,arm)],
                  [(stem-1,326),(w*0.80,326),(w*0.80,326+arm),(stem-1,326+arm)],
                  [(stem-1,H-arm),(w,H-arm),(w,H),(stem-1,H)] ]
        return w, lambda dx: [poly([(px+dx,py) for px,py in p]) for p in parts]

    G = {"A": glyph_A(), "M": glyph_M(), "D": glyph_D(), "E": glyph_E()}
    gap = 92.0
    x, subs = 0.0, []
    for ch in "MADAME":
        w, fn = G[ch]
        subs.extend(fn(x))
        x += w + gap
    total = x - gap
    main = Run("".join(subs), [0, -pk, total, H])

    a_size, a_ls = 200.0, 0.06
    a_adv = adv("montserrat-700", "ARABIA", a_size, a_ls)
    arabia = set_text("montserrat-700", "ARABIA", a_size, total - a_adv, H + 215, a_ls)
    emit("madame-arabia.svg", "Madame Arabia", [(main, None), (arabia, None)])

# ---------------------------------------------------------------- Bazaar
def bazaar(font="bodoni-800", fname="harpers-bazaar.svg"):
    size, ls = 400.0, -0.015
    main = set_text(font, "BAZAAR", size, 0, 400, ls)
    h_size = size * 0.16
    h_adv = adv("bodoni-600", "Harper's", h_size)
    cap_top = main.bbox[1]
    hx = main.bbox[0] + (main.bbox[2] - main.bbox[0]) * 0.71 - h_adv / 2
    harpers = set_text("bodoni-600", "Harper's", h_size, hx, cap_top - size * 0.075)
    emit(fname, "Harper's Bazaar", [(main, None), (harpers, None)])

# ---------------------------------------------------------------- Global Trend Monitor
def gtm(font="tinos-400", fname="global-trend-monitor.svg"):
    size = 300.0
    title = set_text(font, "Global Trend Monitor", size, 0, 300)
    s_size, s_ls = 86.0, 0.30
    sub = "Contemporary Trends for Decision Makers"
    s_adv = adv("tinos-400", sub, s_size, s_ls)
    tw = title.bbox[2] - title.bbox[0]
    subr = set_text("tinos-400", sub, s_size, title.bbox[0] + (tw - s_adv) / 2, 500, s_ls)
    emit(fname, "Global Trend Monitor", [(title, None), (subr, 0.55)])

# ---------------------------------------------------------------- Russian Emirates
def emirates(fname="russian-emirates.svg"):
    size, ls = 330.0, 0.10
    title = set_text("prata-cyr", "РУССКИЕ ЭМИРАТЫ", size, 0, 330, ls)
    s_size, s_ls = 96.0, 0.42
    sub = "ABOUT THE EMIRATES IN RUSSIAN"
    s_adv = adv("jost-400", sub, s_size, s_ls)
    tw = title.bbox[2] - title.bbox[0]
    subr = set_text("jost-400", sub, s_size, title.bbox[0] + (tw - s_adv) / 2, 520, s_ls)
    emit(fname, "Russian Emirates", [(title, None), (subr, None)])

# ---------------------------------------------------------------- Driven
def driven(font="dancing-700", fname="driven-magazine.svg"):
    t = set_text(font, "Driven Magazine", 340.0, 0, 340)
    emit(fname, "Driven Magazine", [(t, None)])

if __name__ == "__main__":
    bazaar("bodoni-900", "harpers-bazaar.svg")
    bazaar("bodoni-700", "v-bazaar-700.svg")
    bazaar("bodoni-900", "v-bazaar-900.svg")
    bazaar("gfs-didot", "v-bazaar-gfs.svg")
    madame_mark()
    gtm()
    gtm("pt-serif-400", "v-gtm-ptserif.svg")
    gtm("playfair-400", "v-gtm-playfair.svg")
    emirates()
    driven("dancing-700", "driven-magazine.svg")
    driven("dancing-600", "v-driven-d600.svg")
    driven("kaushan", "v-driven-kaushan.svg")
    driven("great-vibes", "v-driven-gv.svg")
    driven("sacramento", "v-driven-sacramento.svg")
    print("OK")

# ---------------------------------------------------------------- Sublime
def sublime(font="mr-dafoe", fname="sublime.svg"):
    t = set_text(font, "Sublime", 400.0, 0, 400)
    emit(fname, "Sublime", [(t, None)])

sublime("mr-dafoe", "sublime.svg")
sublime("norican", "v-sublime-norican.svg")
sublime("yesteryear", "v-sublime-yesteryear.svg")
