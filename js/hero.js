/* Hero bitmap portrait. The profile image is dithered into off-white pixels
   on a canvas (Atkinson error diffusion), with the peach backdrop removed so
   only the head remains. An orange scan line sweeps hair to chin, pauses,
   and repeats, redrawn at 10 fps and only while the hero is on screen.
   With reduced motion the line rests across the eyes and nothing animates. */
(function () {
  var canvas = document.getElementById("heroCanvas");
  var hero = document.getElementById("home");
  var title = document.getElementById("heroTitle");
  if (!canvas || !hero || !title || !canvas.getContext) return;

  var BG = [14, 15, 17];
  var INK = [233, 231, 226];
  var ACCENT = [255, 92, 51];
  // data-across / data-src on the canvas let the design/social renders
  // (OG image) reuse this file with coarser pixels and their own image path.
  var ACROSS = +canvas.dataset.across || 460; // pixels across the hero on landscape screens
  var ACROSS_PORTRAIT = 276; // phones: fewer, larger pixels so it still reads as a bitmap
  var SCAN_PERIOD = 4; // seconds: 3 s sweep, then 1 s with no line
  var SCAN_SWEEP = 0.75;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var portraitMq = window.matchMedia("(orientation: portrait)");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  var st = null;

  // Deterministic noise, so pixels don't shimmer between rebuilds.
  function hash(x, y) {
    var h = (x * 374761393 + y * 668265263 + 2 * 982451653) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  }

  function boxBlur(a, cols, rows, r) {
    var t = new Float32Array(a.length), o = new Float32Array(a.length);
    var x, y, k, s, c;
    for (y = 0; y < rows; y++) {
      for (x = 0; x < cols; x++) {
        s = 0; c = 0;
        for (k = -r; k <= r; k++) {
          if (x + k >= 0 && x + k < cols) { s += a[y * cols + x + k]; c++; }
        }
        t[y * cols + x] = s / c;
      }
    }
    for (y = 0; y < rows; y++) {
      for (x = 0; x < cols; x++) {
        s = 0; c = 0;
        for (k = -r; k <= r; k++) {
          if (y + k >= 0 && y + k < rows) { s += t[(y + k) * cols + x]; c++; }
        }
        o[y * cols + x] = s / c;
      }
    }
    return o;
  }

  /* Sample the image onto the grid. The backdrop is found by flood-filling
     peach-coloured cells from the grid border, so the teeth and eye whites
     (enclosed by the face) are kept. */
  function sample(cols, rows, cx, cy, size) {
    var c = document.createElement("canvas");
    c.width = cols;
    c.height = rows;
    var x = c.getContext("2d", { willReadFrequently: true });
    x.imageSmoothingQuality = "high";
    x.drawImage(img, cx - size / 2, cy - size / 2, size, size);
    var d = x.getImageData(0, 0, cols, rows).data;
    var n = cols * rows, lum = new Float32Array(n), bg = new Uint8Array(n), i;
    for (i = 0; i < n; i++) {
      var r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      lum[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      bg[i] = d[i * 4 + 3] < 128 || (r > 200 && g > 165 && b > 145 && r - b > 10) ? 1 : 0;
    }
    var seen = new Uint8Array(n), stack = [], k;
    for (k = 0; k < cols; k++) stack.push(k, (rows - 1) * cols + k);
    for (k = 0; k < rows; k++) stack.push(k * cols, k * cols + cols - 1);
    while (stack.length) {
      i = stack.pop();
      if (seen[i] || !bg[i]) continue;
      seen[i] = 1;
      var col = i % cols;
      if (col > 0) stack.push(i - 1);
      if (col < cols - 1) stack.push(i + 1);
      if (i >= cols) stack.push(i - cols);
      if (i < n - cols) stack.push(i + cols);
    }
    var mask = new Float32Array(n);
    for (i = 0; i < n; i++) mask[i] = seen[i] ? 0 : 1;
    return { lum: lum, mask: boxBlur(mask, cols, rows, Math.max(1, Math.round(cols / 70))) };
  }

  // Atkinson dithering; bright areas become pixels. Edges of the head get
  // extra noise so it breaks up instead of ending on a hard outline.
  function dither(f, cols, rows) {
    var n = cols * rows, v = new Float32Array(n), bits = new Uint8Array(n), x, y, i;
    for (y = 0; y < rows; y++) {
      for (x = 0; x < cols; x++) {
        i = y * cols + x;
        var m = f.mask[i];
        var t = Math.pow(Math.min(1, f.lum[i] / 0.85), 0.8) * m;
        if (m > 0.02) t += (hash(x, y) - 0.5) * (0.16 + m * (1 - m) * 2.4);
        v[i] = t;
      }
    }
    function spread(xx, yy, e) {
      if (xx >= 0 && xx < cols && yy < rows) v[yy * cols + xx] += e;
    }
    for (y = 0; y < rows; y++) {
      for (x = 0; x < cols; x++) {
        i = y * cols + x;
        bits[i] = v[i] > 0.5 ? 1 : 0;
        var e = (v[i] - bits[i]) / 8;
        spread(x + 1, y, e); spread(x + 2, y, e); spread(x - 1, y + 1, e);
        spread(x, y + 1, e); spread(x + 1, y + 1, e); spread(x, y + 2, e);
      }
    }
    return bits;
  }

  function build() {
    var W = hero.clientWidth, H = hero.clientHeight;
    if (!W || !H) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var portrait = portraitMq.matches;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    // Round down a touch eagerly so 2.5px cells land on 2 device pixels.
    var cs = Math.max(1, Math.floor((W / (portrait ? ACROSS_PORTRAIT : ACROSS)) * dpr + 0.25));
    var cols = Math.ceil(canvas.width / cs), rows = Math.ceil(canvas.height / cs);

    // Layout box of the name (offsets ignore its entrance transform).
    var main = title.offsetParent;
    var tLeft = main.offsetLeft + title.offsetLeft;
    var tRight = tLeft + title.offsetWidth;
    var tBottom = main.offsetTop + title.offsetTop + title.offsetHeight;

    // Placement in CSS px. The head spans roughly 12%..90% of the image
    // height and 18%..82% of its width.
    var size, cx, cy;
    if (portrait) {
      // The portrait fills the space down to the barcode at the foot.
      var code = hero.querySelector(".hero-barcode");
      var floor = code && code.offsetParent ? main.offsetTop + code.offsetTop - 8 : H * 0.85;
      size = Math.min((floor - tBottom) / 0.78, W * 1.3);
      cx = W / 2;
      cy = tBottom - 0.12 * size + size / 2;
    } else {
      size = Math.min(1.22, (W / H) * 0.85) * H;
      cx = Math.max(0.7 * W, tRight + 24 + 0.32 * size);
      cy = 0.55 * H;
    }

    // CSS px -> grid cells
    var k = cols / W;
    var f = sample(cols, rows, cx * k, cy * k, size * k);
    var small = document.createElement("canvas");
    small.width = cols;
    small.height = rows;
    var sctx = small.getContext("2d");
    st = {
      cols: cols, rows: rows, cs: cs, f: f,
      bits: dither(f, cols, rows),
      top: (cy - 0.38 * size) * k, // hair
      bottom: (cy + 0.48 * size) * k, // chin and collar
      eyes: (cy - 0.07 * size) * k,
      band: Math.max(2, Math.round(rows * 0.035)),
      small: small, sctx: sctx, id: sctx.createImageData(cols, rows)
    };
    draw(now());
    canvas.classList.add("is-ready");
  }

  function easeInOut(p) {
    return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  }

  function draw(t) {
    if (!st) return;
    var cols = st.cols, rows = st.rows, d = st.id.data, bits = st.bits, mask = st.f.mask;
    var line;
    if (reduce) {
      line = Math.round(st.eyes);
    } else {
      var p = (t % SCAN_PERIOD) / SCAN_PERIOD;
      line = p < SCAN_SWEEP ? Math.round(st.top + (st.bottom - st.top) * easeInOut(p / SCAN_SWEEP)) : -999;
    }
    for (var y = 0; y < rows; y++) {
      var inBand = Math.abs(y - line) <= st.band;
      for (var x = 0; x < cols; x++) {
        var i = y * cols + x, c = BG;
        if (y === line && mask[i] > 0.5) c = ACCENT;
        else if (bits[i]) c = inBand ? ACCENT : INK;
        d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255;
      }
    }
    st.sctx.putImageData(st.id, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(st.small, 0, 0, cols * st.cs, rows * st.cs);
  }

  /* ---- Scan loop: 10 fps, only while the hero is visible ------------- */
  var t0 = performance.now(), last = 0, raf = 0, visible = true;
  function now() {
    return (performance.now() - t0) / 1000;
  }
  function tick(ms) {
    raf = 0;
    if (!visible) return;
    if (ms - last >= 100) {
      last = ms;
      draw(now());
    }
    raf = requestAnimationFrame(tick);
  }
  function kick() {
    if (!reduce && visible && !raf) raf = requestAnimationFrame(tick);
  }

  img.onload = function () {
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    // The name's width decides where the portrait goes, so wait for the fonts.
    fonts.then(function () {
      build();
      kick();

      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          kick();
        }).observe(hero);
      }

      var pending = 0;
      var rebuild = function () {
        clearTimeout(pending);
        pending = setTimeout(build, 150);
      };
      if ("ResizeObserver" in window) new ResizeObserver(rebuild).observe(hero);
      else window.addEventListener("resize", rebuild);
    });
  };
  img.src = canvas.dataset.src || "assets/images/about/profile.webp";
})();
