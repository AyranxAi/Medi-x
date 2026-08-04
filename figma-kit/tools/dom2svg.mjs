// DOM → SVG serializer for Figma import.
// Walks the rendered page and emits per-section SVGs with real <text>, vector
// rects/gradients, embedded raster images, and verbatim inline SVG icons.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'http://127.0.0.1:8321';
const REPO = '/home/user/Medi-x';
const OUT = process.argv[2] || 'svg-out';
const CACHE = path.join(OUT, '.imgcache');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

// ---------- image conversion (webp/png → jpeg|png data URI, downscaled) ----
const imgCache = new Map();
function embedImage(urlPath, dispW, brightness) {
  const maxW = Math.min(1600, Math.max(800, Math.round((dispW || 800) * 2)));
  const bright = brightness || 1;
  const cacheKey = `${urlPath}|${maxW}|${bright}`;
  if (imgCache.has(cacheKey)) return imgCache.get(cacheKey);
  const rel = decodeURIComponent(urlPath.replace(SITE, '').replace(/^\//, '').split('?')[0]);
  const src = path.join(REPO, rel);
  let dataUri = '';
  if (fs.existsSync(src)) {
    const key = `${rel}_${maxW}_${bright}`.replace(/[^a-zA-Z0-9.]/g, '_');
    const outBase = path.join(CACHE, key);
    try {
      const fmt = execFileSync('python3', ['-c', `
from PIL import Image, ImageEnhance
im = Image.open(${JSON.stringify(src)})
im.load()
has_alpha = im.mode in ('RGBA','LA','PA') and im.getextrema()[-1][0] < 255
if im.width > ${maxW}:
    im = im.resize((${maxW}, int(im.height*${maxW}/im.width)), Image.LANCZOS)
if abs(${bright} - 1) > 0.01:
    im = ImageEnhance.Brightness(im.convert('RGBA' if has_alpha else 'RGB')).enhance(${bright})
if has_alpha:
    im.save(${JSON.stringify(outBase)} + '.png', optimize=True); print('png')
else:
    im.convert('RGB').save(${JSON.stringify(outBase)} + '.jpg', quality=82, optimize=True); print('jpg')
`]).toString().trim();
      const f = outBase + (fmt === 'png' ? '.png' : '.jpg');
      const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
      dataUri = `data:${mime};base64,${fs.readFileSync(f).toString('base64')}`;
    } catch (e) { console.error('img convert failed', rel, e.message.slice(0, 200)); }
  } else console.error('img missing on disk:', rel);
  imgCache.set(cacheKey, dataUri);
  return dataUri;
}

// ---------- browser-side serializer ----------------------------------------
const SERIALIZER = `
window.__ser = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const r2 = n => Math.round(n * 100) / 100;
  const canvas = document.createElement('canvas');
  const cctx = canvas.getContext('2d');

  function pageRect(el) {
    const r = el.getBoundingClientRect();
    return { left: r.left + scrollX, top: r.top + scrollY, width: r.width, height: r.height };
  }
  function parseColor(c) {
    if (!c || c === 'none') return null;
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return { css: c, a: 1 };
    const p = m[1].split(',').map(s => parseFloat(s));
    const a = p.length > 3 ? p[3] : 1;
    if (a === 0) return null;
    return { css: 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')', a };
  }
  function roundedPath(x, y, w, h, tl, tr, br, bl) {
    const mx = Math.min(w, h) / 2;
    tl = Math.min(tl, mx); tr = Math.min(tr, mx); br = Math.min(br, mx); bl = Math.min(bl, mx);
    return 'M' + r2(x+tl) + ' ' + r2(y)
      + 'H' + r2(x+w-tr) + 'A' + r2(tr) + ' ' + r2(tr) + ' 0 0 1 ' + r2(x+w) + ' ' + r2(y+tr)
      + 'V' + r2(y+h-br) + 'A' + r2(br) + ' ' + r2(br) + ' 0 0 1 ' + r2(x+w-br) + ' ' + r2(y+h)
      + 'H' + r2(x+bl) + 'A' + r2(bl) + ' ' + r2(bl) + ' 0 0 1 ' + r2(x) + ' ' + r2(y+h-bl)
      + 'V' + r2(y+tl) + 'A' + r2(tl) + ' ' + r2(tl) + ' 0 0 1 ' + r2(x+tl) + ' ' + r2(y)
      + 'Z';
  }
  function radii(cs, w, h) {
    const p = v => { const n = parseFloat(v) || 0; return v.includes('%') ? n / 100 * Math.min(w, h) : n; };
    return [p(cs.borderTopLeftRadius), p(cs.borderTopRightRadius),
            p(cs.borderBottomRightRadius), p(cs.borderBottomLeftRadius)];
  }
  function shapeEl(x, y, w, h, rad, attrs) {
    const [tl, tr, br, bl] = rad;
    if (tl || tr || br || bl) {
      if (tl === tr && tr === br && br === bl)
        return '<rect x="'+r2(x)+'" y="'+r2(y)+'" width="'+r2(w)+'" height="'+r2(h)+'" rx="'+r2(tl)+'" '+attrs+'/>';
      return '<path d="'+roundedPath(x, y, w, h, tl, tr, br, bl)+'" '+attrs+'/>';
    }
    return '<rect x="'+r2(x)+'" y="'+r2(y)+'" width="'+r2(w)+'" height="'+r2(h)+'" '+attrs+'/>';
  }

  // split top-level comma list (not inside parens)
  function splitList(s) {
    const out = []; let d = 0, cur = '';
    for (const ch of s) {
      if (ch === '(') d++; if (ch === ')') d--;
      if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function parseStops(parts) {
    const stops = [];
    for (const p of parts) {
      const cm = p.match(/(rgba?\\([^)]*\\)|#[0-9a-fA-F]+|[a-zA-Z]+)\\s*(.*)/);
      if (!cm) continue;
      const col = parseColor(cm[1]);
      const posns = (cm[2] || '').trim().split(/\\s+/).filter(Boolean)
        .map(v => v.endsWith('%') ? parseFloat(v) / 100 : null);
      if (posns.length === 0) posns.push(null);
      for (const pos of posns)
        stops.push({ c: col ? col.css : 'rgb(0,0,0)', a: col ? col.a : 0, pos });
    }
    // fill null positions by interpolation
    if (stops.length) {
      if (stops[0].pos == null) stops[0].pos = 0;
      if (stops[stops.length-1].pos == null) stops[stops.length-1].pos = 1;
      for (let i = 1; i < stops.length; i++) {
        if (stops[i].pos == null) {
          let j = i; while (stops[j].pos == null) j++;
          const span = (stops[j].pos - stops[i-1].pos) / (j - i + 1);
          for (let k = i; k < j; k++) stops[k].pos = stops[k-1].pos + span;
        }
        if (stops[i].pos < stops[i-1].pos) stops[i].pos = stops[i-1].pos;
      }
    }
    return stops;
  }
  const defs = [];
  function linearGradientDef(body, x, y, w, h) {
    const parts = splitList(body);
    let angle = 180;
    if (/^-?[\\d.]+deg/.test(parts[0])) angle = parseFloat(parts.shift());
    else if (parts[0].startsWith('to ')) {
      const d = parts.shift().slice(3).trim();
      angle = { top:0,'right':90,'bottom':180,'left':270,'top right':45,'right top':45,
        'bottom right':135,'right bottom':135,'bottom left':225,'left bottom':225,
        'top left':315,'left top':315 }[d] ?? 180;
    }
    const stops = parseStops(parts);
    if (!stops.length) return null;
    const rad = angle * Math.PI / 180;
    const L = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
    const cx = x + w / 2, cy = y + h / 2;
    const dx = Math.sin(rad) * L / 2, dy = -Math.cos(rad) * L / 2;
    const id = 'g' + (++uid);
    defs.push('<linearGradient id="'+id+'" gradientUnits="userSpaceOnUse" x1="'+r2(cx-dx)+'" y1="'+r2(cy-dy)+'" x2="'+r2(cx+dx)+'" y2="'+r2(cy+dy)+'">'
      + stops.map(s => '<stop offset="'+r2(s.pos*100)+'%" stop-color="'+s.c+'" stop-opacity="'+r2(s.a)+'"/>').join('')
      + '</linearGradient>');
    return id;
  }
  function radialGradientDef(body, x, y, w, h) {
    const parts = splitList(body);
    let prelude = '';
    if (!/^(rgba?\\(|#|[a-z]+\\s+-?[\\d.]|transparent)/.test(parts[0]) || /\\bat\\b|circle|ellipse|farthest|closest/.test(parts[0])) {
      if (!/rgba?\\(|#/.test(parts[0].split(' ')[0])) prelude = parts.shift();
    }
    const stops = parseStops(parts);
    if (!stops.length) return null;
    let fx = 0.5, fy = 0.5;
    const pm = prelude.match(/at\\s+([\\d.]+)%\\s+([\\d.]+)%/);
    if (pm) { fx = parseFloat(pm[1]) / 100; fy = parseFloat(pm[2]) / 100; }
    const circle = /circle/.test(prelude);
    const cx = x + w * fx, cy = y + h * fy;
    const id = 'g' + (++uid);
    if (circle) {
      const dx = Math.max(fx, 1 - fx) * w, dy = Math.max(fy, 1 - fy) * h;
      const rr = Math.sqrt(dx*dx + dy*dy);
      defs.push('<radialGradient id="'+id+'" gradientUnits="userSpaceOnUse" cx="'+r2(cx)+'" cy="'+r2(cy)+'" r="'+r2(rr)+'">'
        + stops.map(s => '<stop offset="'+r2(s.pos*100)+'%" stop-color="'+s.c+'" stop-opacity="'+r2(s.a)+'"/>').join('')
        + '</radialGradient>');
    } else {
      // farthest-corner ellipse
      const rx = Math.max(fx, 1 - fx) * w * Math.SQRT2;
      const ry = Math.max(fy, 1 - fy) * h * Math.SQRT2;
      defs.push('<radialGradient id="'+id+'" gradientUnits="userSpaceOnUse" cx="'+r2(cx)+'" cy="'+r2(cy)+'" r="'+r2(rx)+'" gradientTransform="translate('+r2(cx)+' '+r2(cy)+') scale(1 '+r2(ry/rx)+') translate('+r2(-cx)+' '+r2(-cy)+')">'
        + stops.map(s => '<stop offset="'+r2(s.pos*100)+'%" stop-color="'+s.c+'" stop-opacity="'+r2(s.a)+'"/>').join('')
        + '</radialGradient>');
    }
    return id;
  }

  function fontAscent(cs) {
    cctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    const m = cctx.measureText('Hg');
    return m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8;
  }
  function firstFamily(ff) {
    return splitList(ff)[0].replace(/^["']|["']$/g, '');
  }
  function transformText(t, tt) {
    if (tt === 'uppercase') return t.toUpperCase();
    if (tt === 'lowercase') return t.toLowerCase();
    if (tt === 'capitalize') return t.replace(/\\b\\w/g, c => c.toUpperCase());
    return t;
  }

  function serializeTextNode(node, cs, fx, fy, out) {
    const text = node.textContent;
    if (!text.trim()) return;
    const range = document.createRange();
    const lines = [];
    let cur = null;
    for (let i = 0; i < text.length; i++) {
      range.setStart(node, i); range.setEnd(node, i + 1);
      const rects = range.getClientRects();
      if (!rects.length) continue;
      const r = rects[0];
      if (r.width === 0 && text[i] === ' ') { if (cur) cur.text += ' '; continue; }
      if (r.width === 0 && (text[i] === '\\n' || text[i] === '\\t')) continue;
      const top = Math.round(r.top + scrollY);
      if (!cur || Math.abs(top - cur.top) > 2) {
        cur = { top, left: r.left + scrollX, text: text[i], h: r.height };
        lines.push(cur);
      } else {
        cur.text += text[i];
      }
    }
    const asc = fontAscent(cs);
    const fill = parseColor(cs.color);
    for (const ln of lines) {
      let t = transformText(ln.text, cs.textTransform);
      if (!t.trim()) continue;
      const attrs = ['x="'+r2(ln.left - fx)+'"', 'y="'+r2(ln.top - fy + asc)+'"',
        'font-family="'+esc(firstFamily(cs.fontFamily))+'"',
        'font-size="'+parseFloat(cs.fontSize)+'"'];
      if (cs.fontWeight !== '400') attrs.push('font-weight="'+cs.fontWeight+'"');
      if (cs.fontStyle !== 'normal') attrs.push('font-style="'+cs.fontStyle+'"');
      if (cs.letterSpacing !== 'normal') attrs.push('letter-spacing="'+parseFloat(cs.letterSpacing)+'"');
      if (fill) { attrs.push('fill="'+fill.css+'"'); if (fill.a < 1) attrs.push('fill-opacity="'+r2(fill.a)+'"'); }
      if (cs.textDecorationLine && cs.textDecorationLine !== 'none')
        attrs.push('text-decoration="'+cs.textDecorationLine+'"');
      out.push('<text xml:space="preserve" '+attrs.join(' ')+'>'+esc(t)+'</text>');
    }
  }

  function serializeInlineSvg(el, x, y, w, h, out) {
    const clone = el.cloneNode(true);
    const origEls = [el, ...el.querySelectorAll('*')];
    const cloneEls = [clone, ...clone.querySelectorAll('*')];
    for (let i = 0; i < origEls.length; i++) {
      const ocs = getComputedStyle(origEls[i]);
      const c = cloneEls[i];
      if (!c.getAttribute) continue;
      for (const prop of ['fill', 'stroke']) {
        const v = c.getAttribute(prop);
        if (v === 'currentColor' || (!v && !c.style[prop])) {
          const comp = ocs[prop];
          if (comp && comp !== 'none') c.setAttribute(prop, comp);
        }
      }
      c.removeAttribute('class');
    }
    clone.setAttribute('x', r2(x)); clone.setAttribute('y', r2(y));
    clone.setAttribute('width', r2(w)); clone.setAttribute('height', r2(h));
    if (!clone.getAttribute('viewBox') && el.viewBox && el.viewBox.baseVal.width)
      clone.setAttribute('viewBox', [el.viewBox.baseVal.x, el.viewBox.baseVal.y,
        el.viewBox.baseVal.width, el.viewBox.baseVal.height].join(' '));
    clone.removeAttribute('style');
    out.push(clone.outerHTML);
  }

  const rasterJobs = [];
  const skippedEffects = [];
  function onlyBrightness(filter) {
    if (!filter || filter === 'none') return 1;
    const m = filter.match(/^brightness\\(([\\d.]+)\\)$/);
    return m ? parseFloat(m[1]) : null;
  }
  function ignorableFilter(filter) {
    if (!filter || filter === 'none') return true;
    if (onlyBrightness(filter) != null) return true;
    // pure drop-shadow chains: subtle, skip rather than rasterize.
    // strip nested color functions first so paren matching works
    const flat = filter.replace(/rgba?\\([^)]*\\)/g, 'C');
    return /^(drop-shadow\\([^)]*\\)\\s*)+$/.test(flat);
  }
  function needsRaster(el, cs, rect) {
    const small = rect.width * rect.height <= 200000;
    const isImg = el.tagName === 'IMG';
    if (cs.backgroundImage.includes('conic-gradient')) return small;
    if (cs.mixBlendMode && cs.mixBlendMode !== 'normal') {
      if (small || isImg) return true;
      skippedEffects.push('blend ' + cs.mixBlendMode + ' on ' + layerName(el)); return false;
    }
    if (cs.filter && cs.filter !== 'none' && !ignorableFilter(cs.filter)) {
      if (small || isImg) return true;
      skippedEffects.push('filter ' + cs.filter.slice(0, 40) + ' on ' + layerName(el)); return false;
    }
    if (cs.transform && cs.transform !== 'none') {
      const m = cs.transform.match(/matrix\\(([^)]+)\\)/);
      if (m) {
        const p = m[1].split(',').map(Number);
        if (Math.abs(p[1]) > 0.01 || Math.abs(p[2]) > 0.01) {
          if (small) return true;
          skippedEffects.push('rotation on ' + layerName(el)); return false;
        }
      }
    }
    return false;
  }

  function paintBackground(el, cs, rect, fx, fy, out) {
    const x = rect.left - fx, y = rect.top - fy, w = rect.width, h = rect.height;
    if (w < 0.5 || h < 0.5) return;
    const rad = radii(cs, w, h);
    const bg = parseColor(cs.backgroundColor);
    if (bg) {
      let a = bg.a;
      // backdrop-blur frosted glass: emulate the darkening with extra alpha
      const bf = cs.backdropFilter || cs.webkitBackdropFilter;
      if (bf && bf !== 'none' && bf.includes('blur') && a < 1) a = Math.min(1, a + 0.25);
      out.push(shapeEl(x, y, w, h, rad,
        'fill="'+bg.css+'"' + (a < 1 ? ' fill-opacity="'+r2(a)+'"' : '')));
    }
    if (cs.backgroundImage && cs.backgroundImage !== 'none') {
      const layers = splitList(cs.backgroundImage).reverse();
      const sizes = splitList(cs.backgroundSize || 'auto');
      for (let li = 0; li < layers.length; li++) {
        const layer = layers[li];
        let m;
        if ((m = layer.match(/^linear-gradient\\((.*)\\)$/s))) {
          const id = linearGradientDef(m[1], x, y, w, h);
          if (id) out.push(shapeEl(x, y, w, h, rad, 'fill="url(#'+id+')"'));
        } else if ((m = layer.match(/^radial-gradient\\((.*)\\)$/s))) {
          const id = radialGradientDef(m[1], x, y, w, h);
          if (id) out.push(shapeEl(x, y, w, h, rad, 'fill="url(#'+id+')"'));
        } else if ((m = layer.match(/^url\\("?([^")]+)"?\\)$/))) {
          const size = sizes[Math.min(li, sizes.length-1)] || 'auto';
          const url = m[1];
          const dims = (window.__bgDims || {})[url];
          const cid = 'c' + (++uid);
          defs.push('<clipPath id="'+cid+'"><path d="'+roundedPath(x, y, w, h, ...rad)+'"/></clipPath>');
          if (dims && (size === 'cover' || size === 'contain')) {
            // exact painted rect honoring background-position
            const [iw, ih] = dims;
            const scale = size === 'cover' ? Math.max(w / iw, h / ih) : Math.min(w / iw, h / ih);
            const pw = iw * scale, ph = ih * scale;
            let px = 0.5, py = 0.5;
            const pm = (cs.backgroundPosition || '').match(/(-?[\\d.]+)%\\s+(-?[\\d.]+)%/);
            if (pm) { px = parseFloat(pm[1]) / 100; py = parseFloat(pm[2]) / 100; }
            const ix = x + (w - pw) * px, iy = y + (h - ph) * py;
            out.push('<image clip-path="url(#'+cid+')" x="'+r2(ix)+'" y="'+r2(iy)+'" width="'+r2(pw)+'" height="'+r2(ph)+'" preserveAspectRatio="none" href="@@IMG:'+esc(url)+'|'+Math.round(pw)+'|1@@"/>');
          } else {
            const par = size === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice';
            out.push('<image clip-path="url(#'+cid+')" x="'+r2(x)+'" y="'+r2(y)+'" width="'+r2(w)+'" height="'+r2(h)+'" preserveAspectRatio="'+par+'" href="@@IMG:'+esc(url)+'|'+Math.round(w)+'|1@@"/>');
          }
        }
      }
    }
    // borders
    const bw = ['Top', 'Right', 'Bottom', 'Left'].map(s => parseFloat(cs['border'+s+'Width']) || 0);
    const bs = ['Top', 'Right', 'Bottom', 'Left'].map(s => cs['border'+s+'Style']);
    const bc = ['Top', 'Right', 'Bottom', 'Left'].map(s => parseColor(cs['border'+s+'Color']));
    const solid = bs.map((s, i) => (s === 'solid' || s === 'double') && bw[i] > 0 && bc[i]);
    if (solid.every(Boolean) && bw.every(v => v === bw[0]) &&
        bc.every(c => c && c.css === bc[0].css && c.a === bc[0].a)) {
      out.push(shapeEl(x + bw[0]/2, y + bw[0]/2, w - bw[0], h - bw[0], rad.map(r => Math.max(0, r - bw[0]/2)),
        'fill="none" stroke="'+bc[0].css+'" stroke-width="'+bw[0]+'"' + (bc[0].a < 1 ? ' stroke-opacity="'+r2(bc[0].a)+'"' : '')));
    } else {
      const sides = [[x, y, w, bw[0]], [x+w-bw[1], y, bw[1], h], [x, y+h-bw[2], w, bw[2]], [x, y, bw[3], h]];
      for (let i = 0; i < 4; i++) if (solid[i])
        out.push('<rect x="'+r2(sides[i][0])+'" y="'+r2(sides[i][1])+'" width="'+r2(sides[i][2])+'" height="'+r2(sides[i][3])+'" fill="'+bc[i].css+'"' + (bc[i].a < 1 ? ' fill-opacity="'+r2(bc[i].a)+'"' : '') + '/>');
    }
  }

  function paintPseudo(el, rect, pe, fx, fy, out) {
    let ps;
    try { ps = getComputedStyle(el, pe); } catch (e) { return; }
    if (!ps || ps.content === 'none' || ps.display === 'none') return;
    const w = parseFloat(ps.width), h = parseFloat(ps.height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;
    const op = parseFloat(ps.opacity);
    if (op === 0) return;
    let x, y;
    if (ps.position === 'absolute' || ps.position === 'fixed') {
      x = rect.left + (ps.left !== 'auto' ? parseFloat(ps.left)
        : (ps.right !== 'auto' ? rect.width - parseFloat(ps.right) - w : 0));
      y = rect.top + (ps.top !== 'auto' ? parseFloat(ps.top)
        : (ps.bottom !== 'auto' ? rect.height - parseFloat(ps.bottom) - h : 0));
    } else {
      // inline decorative (e.g. kicker underline): sits at the end of the
      // parent's inline content, vertically centered on the line
      x = rect.left + rect.width - w - (parseFloat(ps.marginRight) || 0);
      y = rect.top + rect.height / 2 - h / 2;
    }
    const pr = { left: x, top: y, width: w, height: h };
    const frag = [];
    paintBackground(el, ps, pr, fx, fy, frag);
    const txt = (ps.content || '').replace(/^["']|["']$/g, '');
    if (txt && txt !== 'none' && !txt.startsWith('url(')) {
      const col = parseColor(ps.color);
      if (col) {
        cctx.font = ps.fontStyle + ' ' + ps.fontWeight + ' ' + ps.fontSize + ' ' + ps.fontFamily;
        const tw = cctx.measureText(txt).width;
        const asc = cctx.measureText('Hg').fontBoundingBoxAscent || parseFloat(ps.fontSize) * 0.8;
        frag.push('<text x="'+r2(x - fx + w/2 - tw/2)+'" y="'+r2(y - fy + h/2 + asc/2 - parseFloat(ps.fontSize)*0.35)+'" font-family="'+esc(firstFamily(ps.fontFamily))+'" font-size="'+parseFloat(ps.fontSize)+'"'
          + (ps.fontWeight !== '400' ? ' font-weight="'+ps.fontWeight+'"' : '')
          + ' fill="'+col.css+'"'+(col.a < 1 ? ' fill-opacity="'+r2(col.a)+'"' : '')+'>'+esc(txt)+'</text>');
      }
    }
    if (!frag.length) return;
    if (op < 1) out.push('<g opacity="'+r2(op)+'">'+frag.join('')+'</g>');
    else out.push(...frag);
  }

  function layerName(el) {
    let n = el.id || (el.className && typeof el.className === 'string' && el.className.split(' ')[0]) || el.tagName.toLowerCase();
    return n.replace(/[^a-zA-Z0-9_-]/g, '') || 'g';
  }

  function walk(el, fx, fy, fw, fh, out, depth) {
    if (depth > 60) return;
    const tag = el.tagName;
    if (['SCRIPT','STYLE','LINK','META','NOSCRIPT','TEMPLATE','TITLE'].includes(tag)) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const op = parseFloat(cs.opacity);
    if (op === 0) return;
    const rect = pageRect(el);
    const isLeafVisual = tag === 'IMG' || el instanceof SVGSVGElement;
    // skip leaf visuals fully outside the frame
    if (isLeafVisual && (rect.left - fx > fw + 4 || rect.top - fy > fh + 4 ||
        rect.left - fx + rect.width < -4 || rect.top - fy + rect.height < -4)) return;

    const grpAttrs = [];
    grpAttrs.push('id="' + layerName(el) + '_' + (++uid) + '"');
    if (op < 1) grpAttrs.push('opacity="' + r2(op) + '"');

    if (needsRaster(el, cs, rect) && rect.width > 0 && rect.height > 0) {
      const jid = 'rj' + (++uid);
      rasterJobs.push({ id: jid, left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      out.push('<image id="'+layerName(el)+'_'+uid+'" x="'+r2(rect.left-fx)+'" y="'+r2(rect.top-fy)+'" width="'+r2(rect.width)+'" height="'+r2(rect.height)+'" href="@@RASTER:'+jid+'@@"/>');
      return;
    }

    const inner = [];
    if (el instanceof SVGSVGElement) {
      serializeInlineSvg(el, rect.left - fx, rect.top - fy, rect.width, rect.height, inner);
      out.push('<g ' + grpAttrs.join(' ') + '>' + inner.join('') + '</g>');
      return;
    }

    paintBackground(el, cs, rect, fx, fy, inner);

    if (tag === 'CANVAS' && rect.width > 0) {
      try {
        const du = el.toDataURL('image/png');
        if (du.length > 200)
          inner.push('<image x="'+r2(rect.left-fx)+'" y="'+r2(rect.top-fy)+'" width="'+r2(rect.width)+'" height="'+r2(rect.height)+'" href="'+du+'"/>');
      } catch (e) {
        const jid = 'rj' + (++uid);
        rasterJobs.push({ id: jid, left: rect.left, top: rect.top, width: rect.width, height: rect.height });
        inner.push('<image x="'+r2(rect.left-fx)+'" y="'+r2(rect.top-fy)+'" width="'+r2(rect.width)+'" height="'+r2(rect.height)+'" href="@@RASTER:'+jid+'@@"/>');
      }
    }

    if (tag === 'IMG' && el.currentSrc) {
      const rad = radii(cs, rect.width, rect.height);
      const x = rect.left - fx, y = rect.top - fy;
      const iw = el.naturalWidth, ih = el.naturalHeight;
      const bright = onlyBrightness(cs.filter) || 1;
      let imgTag;
      if ((cs.objectFit === 'cover' || cs.objectFit === 'contain') && iw && ih) {
        // exact painted rect honoring object-position, clipped to the element
        const scale = cs.objectFit === 'cover'
          ? Math.max(rect.width / iw, rect.height / ih)
          : Math.min(rect.width / iw, rect.height / ih);
        const pw = iw * scale, ph = ih * scale;
        let px = 0.5, py = 0.5;
        const pm = cs.objectPosition.match(/([\\d.]+)%\\s+([\\d.]+)%/);
        if (pm) { px = parseFloat(pm[1]) / 100; py = parseFloat(pm[2]) / 100; }
        const ix = x + (rect.width - pw) * px, iy = y + (rect.height - ph) * py;
        const cid = 'c' + (++uid);
        defs.push('<clipPath id="'+cid+'"><path d="'+roundedPath(x, y, rect.width, rect.height, ...rad)+'"/></clipPath>');
        imgTag = '<image clip-path="url(#'+cid+')" x="'+r2(ix)+'" y="'+r2(iy)+'" width="'+r2(pw)+'" height="'+r2(ph)+'" preserveAspectRatio="none" href="@@IMG:'+esc(el.currentSrc)+'|'+Math.round(pw)+'|'+bright+'@@"/>';
      } else {
        let clip = '';
        if (rad.some(r => r > 0)) {
          const cid = 'c' + (++uid);
          defs.push('<clipPath id="'+cid+'"><path d="'+roundedPath(x, y, rect.width, rect.height, ...rad)+'"/></clipPath>');
          clip = ' clip-path="url(#'+cid+')"';
        }
        imgTag = '<image'+clip+' x="'+r2(x)+'" y="'+r2(y)+'" width="'+r2(rect.width)+'" height="'+r2(rect.height)+'" preserveAspectRatio="none" href="@@IMG:'+esc(el.currentSrc)+'|'+Math.round(rect.width)+'|'+bright+'@@"/>';
      }
      inner.push(imgTag);
    }

    if ((tag === 'INPUT' || tag === 'TEXTAREA') && !el.value && el.placeholder) {
      let pc = null;
      try { pc = parseColor(getComputedStyle(el, '::placeholder').color); } catch (e) {}
      const asc = fontAscent(cs);
      const px = rect.left - fx + (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.borderLeftWidth) || 0);
      const py = rect.top - fy + rect.height / 2 + asc / 2 - parseFloat(cs.fontSize) * 0.35;
      inner.push('<text x="'+r2(px)+'" y="'+r2(py)+'" font-family="'+esc(firstFamily(cs.fontFamily))+'" font-size="'+parseFloat(cs.fontSize)+'"'
        + (cs.letterSpacing !== 'normal' ? ' letter-spacing="'+parseFloat(cs.letterSpacing)+'"' : '')
        + ' fill="'+(pc ? pc.css : '#999')+'"'+(pc && pc.a < 1 ? ' fill-opacity="'+r2(pc.a)+'"' : '')+'>'
        + esc(transformText(el.placeholder, cs.textTransform)) + '</text>');
    }

    // children: pseudos + elements + text nodes, sorted by z-index (stable)
    const kids = [];
    const pz = pe => {
      try { const s = getComputedStyle(el, pe); return s.zIndex === 'auto' ? 0 : (parseInt(s.zIndex) || 0); }
      catch (e) { return 0; }
    };
    kids.push({ type: 'pb', z: pz('::before') });
    for (const n of el.childNodes) {
      if (n.nodeType === 3) kids.push({ type: 't', n, z: 0 });
      else if (n.nodeType === 1) {
        const zc = getComputedStyle(n).zIndex;
        kids.push({ type: 'e', n, z: zc === 'auto' ? 0 : (parseInt(zc) || 0) });
      }
    }
    kids.push({ type: 'pa', z: pz('::after') });
    kids.sort((a, b) => a.z - b.z || 0); // stable in modern JS
    let clipped = false;
    if ((cs.overflow !== 'visible' || cs.overflowX !== 'visible') && rect.width > 0 && rect.height > 0) {
      const rad = radii(cs, rect.width, rect.height);
      const cid = 'c' + (++uid);
      defs.push('<clipPath id="'+cid+'"><path d="'+roundedPath(rect.left-fx, rect.top-fy, rect.width, rect.height, ...rad)+'"/></clipPath>');
      inner.push('<g clip-path="url(#'+cid+')">');
      clipped = true;
    }
    for (const k of kids) {
      if (k.type === 't') serializeTextNode(k.n, cs, fx, fy, inner);
      else if (k.type === 'pb') paintPseudo(el, rect, '::before', fx, fy, inner);
      else if (k.type === 'pa') paintPseudo(el, rect, '::after', fx, fy, inner);
      else walk(k.n, fx, fy, fw, fh, inner, depth + 1);
    }
    if (clipped) inner.push('</g>');

    if (inner.length) out.push('<g ' + grpAttrs.join(' ') + '>' + inner.join('') + '</g>');
  }

  function serializeFrame(selectors, fx, fy, fw, fh) {
    defs.length = 0; rasterJobs.length = 0; skippedEffects.length = 0;
    const out = [];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) { console.warn('missing', sel); continue; }
      walk(el, fx, fy, fw, fh, out, 0);
    }
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="'+fw+'" height="'+fh+'" viewBox="0 0 '+fw+' '+fh+'">'
      + '<defs>' + defs.join('') + '</defs>' + out.join('') + '</svg>';
    return { svg, rasterJobs: [...rasterJobs], skippedEffects: [...skippedEffects] };
  }
  return { serializeFrame };
})();
`;

// ---------- driver ----------------------------------------------------------
async function preparePage(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important;caret-color:transparent!important}' });
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 600));
  });
  await page.waitForTimeout(800);
  // preload natural dimensions of all CSS background images
  await page.evaluate(async () => {
    window.__bgDims = {};
    const urls = new Set();
    for (const el of document.querySelectorAll('*')) {
      const bi = getComputedStyle(el).backgroundImage;
      if (bi && bi.includes('url(')) {
        for (const m of bi.matchAll(/url\("?([^")]+)"?\)/g)) urls.add(m[1]);
      }
    }
    await Promise.allSettled([...urls].map(u => new Promise(res => {
      const im = new Image();
      im.onload = () => { window.__bgDims[u] = [im.naturalWidth, im.naturalHeight]; res(); };
      im.onerror = res;
      im.src = u;
    })));
  });
  await page.evaluate(SERIALIZER);
}

async function exportFrames(page, frames, prefix, dsf) {
  for (const f of frames) {
    // scroll the section into view so reveal-on-scroll state is active
    await page.evaluate(y => window.scrollTo(0, y), f.y);
    await page.waitForTimeout(450);
    const res = await page.evaluate(
      ([sels, x, y, w, h]) => window.__ser.serializeFrame(sels, x, y, w, h),
      [f.selectors, f.x, f.y, f.w, f.h]);
    let svg = res.svg;
    if (res.skippedEffects.length) console.log('  skipped effects:', res.skippedEffects.join('; '));
    // raster jobs: hide nothing, straight clip screenshots
    for (const job of res.rasterJobs) {
      const pageDims = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.body.scrollHeight }));
      const cx = Math.max(0, job.left), cy = Math.max(0, job.top);
      const cw = Math.min(job.width - (cx - job.left), pageDims.w - cx);
      const ch = Math.min(job.height - (cy - job.top), pageDims.h - cy);
      if (cw < 1 || ch < 1) { svg = svg.replace('@@RASTER:' + job.id + '@@', ''); continue; }
      const buf = await page.screenshot({ fullPage: true,
        clip: { x: cx, y: cy, width: cw, height: ch } });
      svg = svg.replace('@@RASTER:' + job.id + '@@', 'data:image/png;base64,' + buf.toString('base64'));
    }
    // image placeholders: @@IMG:url|dispW|brightness@@
    svg = svg.replace(/@@IMG:([^@]+)@@/g, (_, spec) => {
      const [url, w, b] = spec.split('|');
      return embedImage(url.replace(/&amp;/g, '&'), parseFloat(w), parseFloat(b));
    });
    const file = path.join(OUT, `${prefix}-${f.name}.svg`);
    fs.writeFileSync(file, svg);
    console.log(`${prefix}-${f.name}.svg  ${(fs.statSync(file).size / 1024).toFixed(0)}kB  jobs=${res.rasterJobs.length}`);
  }
}

async function measureFrames(page) {
  return page.evaluate(() => {
    const f = [];
    const px = el => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), h: Math.round(r.height) }; };
    const names = { s1: '01-hero', s2: '02-solutions', s3: '03-conversation', s4: '04-pathways',
      s5: '05-team', s6: '06-products', s7: '07-events', s8: '08-press' };
    for (const id of Object.keys(names)) {
      const el = document.getElementById(id);
      if (el) { const r = px(el); f.push({ name: names[id], sel: '#' + id, top: r.top, h: r.h }); }
    }
    const sband = document.querySelector('.sband');
    if (sband) { const r = px(sband); f.push({ name: '09-sponsors', sel: '.sband', top: r.top, h: r.h }); }
    // the page footer is the tallest <footer> (blockquotes have small ones)
    let foot = null;
    for (const el of document.querySelectorAll('footer'))
      if (!foot || el.getBoundingClientRect().height > foot.getBoundingClientRect().height) foot = el;
    if (foot) {
      foot.setAttribute('data-frame', 'pagefooter');
      const r = px(foot);
      f.push({ name: '10-footer', sel: '[data-frame="pagefooter"]', top: r.top, h: r.h });
    }
    return f;
  });
}

const browser = await chromium.launch();
for (const vp of [
  { tag: 'desktop', width: 1440, height: 900, mobile: false },
  { tag: 'mobile', width: 390, height: 844, mobile: true },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2, isMobile: vp.mobile, hasTouch: vp.mobile,
  });
  const page = ctx.newPage ? await ctx.newPage() : null;
  await preparePage(page, SITE + '/index.html');
  const secs = await measureFrames(page);
  const frames = secs.map(s => ({
    name: s.name,
    selectors: s.name === '01-hero' ? ['#' + 's1', 'header.hdr', '#ask'] : [s.sel],
    x: 0, y: s.top, w: vp.width, h: s.h,
  }));
  console.log(`--- ${vp.tag}: ${frames.length} frames`);
  await exportFrames(page, frames, vp.tag, 2);
  // reference screenshots for comparison
  for (const f of frames) {
    await page.evaluate(y => window.scrollTo(0, y), f.y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await ctx.close();
}
await browser.close();
console.log('done');
