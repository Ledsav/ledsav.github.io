/* Hero background is animated entirely in CSS (breathing via an @property
   custom prop + a scale-in entrance), no per-frame JS, so nothing thrashes
   the inline style attribute. JS here only handles:
     1. a subtle, idle-stopping mouse parallax on the name block, and
     2. the dev-only color panel (edits CSS color vars, not per frame). */
(function () {
  var el = document.getElementById("heroBg");
  if (!el) return;

  var PRESETS = {
    Ember: ["#0A0A0A", "#3D0C02", "#7A1500", "#C1440E", "#FF6D00", "#FF9E00", "#FFD23F"],
    Spectrum: ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"],
    Sunset: ["#0A0A0A", "#4A1D6A", "#B5179E", "#F72585", "#FF6D00", "#FFB703", "#FFD166"],
    Ocean: ["#05070A", "#023E58", "#0077B6", "#00B4D8", "#48CAE4", "#90E0EF", "#CAF0F8"],
  };
  var DEFAULTS = PRESETS.Ember;

  function applyColors(cols) {
    for (var i = 0; i < cols.length; i++) {
      el.style.setProperty("--c" + (i + 1), cols[i]);
    }
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Subtle mouse parallax on the name block (idle-stopping) --------- */
  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    var hero = document.getElementById("home");
    var center = document.querySelector(".hero-center");
    if (hero && center) {
      var tx = 0, ty = 0, cx = 0, cy = 0;
      var lastX = null, lastY = null, running = false;

      function loop() {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        var nx = +cx.toFixed(2), ny = +cy.toFixed(2);
        if (nx !== lastX || ny !== lastY) {
          center.style.transform = "translate(" + nx + "px," + ny + "px)";
          lastX = nx;
          lastY = ny;
        }
        // Stop the rAF loop once we've essentially reached the target, no
        // idle per-frame writes. It restarts on the next mousemove.
        if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05) {
          running = false;
          return;
        }
        requestAnimationFrame(loop);
      }
      function kick() {
        if (!running) {
          running = true;
          requestAnimationFrame(loop);
        }
      }

      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 16; // ~±8px
        ty = ((e.clientY - r.top) / r.height - 0.5) * 12; // ~±6px
        kick();
      });
      hero.addEventListener("mouseleave", function () {
        tx = 0;
        ty = 0;
        kick();
      });
    }
  }

  /* ---- Controls (dev-only) -------------------------------------------- */
  // Hidden for normal visitors. Add #gradient (or ?edit) to the URL to enable.
  var devMode =
    /gradient/.test(location.hash) || /(?:\?|&)edit\b/.test(location.search);
  var controls = document.getElementById("gradientControls");
  if (!devMode) {
    if (controls) controls.remove();
    return;
  }

  var toggle = document.getElementById("gcToggle");
  var panel = document.getElementById("gcPanel");
  var swatches = document.getElementById("gcSwatches");
  var presetsEl = document.getElementById("gcPresets");
  var breathingEl = document.getElementById("gcBreathing");
  var resetEl = document.getElementById("gcReset");
  if (!toggle || !panel || !swatches) return;

  var colors = DEFAULTS.slice();

  function renderSwatches() {
    swatches.innerHTML = "";
    colors.forEach(function (c, i) {
      var wrap = document.createElement("label");
      wrap.className = "gc-swatch";
      wrap.style.background = c;
      var input = document.createElement("input");
      input.type = "color";
      input.value = c;
      input.addEventListener("input", function () {
        colors[i] = input.value;
        wrap.style.background = input.value;
        el.style.setProperty("--c" + (i + 1), input.value);
      });
      wrap.appendChild(input);
      swatches.appendChild(wrap);
    });
  }

  Object.keys(PRESETS).forEach(function (name) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "gc-preset";
    b.title = name;
    b.style.background =
      "linear-gradient(90deg," + PRESETS[name].slice(1).join(",") + ")";
    b.addEventListener("click", function () {
      colors = PRESETS[name].slice();
      applyColors(colors);
      renderSwatches();
    });
    presetsEl.appendChild(b);
  });

  breathingEl.addEventListener("change", function () {
    el.style.animationPlayState = breathingEl.checked ? "" : "paused";
  });

  resetEl.addEventListener("click", function () {
    colors = DEFAULTS.slice();
    applyColors(colors);
    renderSwatches();
    breathingEl.checked = true;
    el.style.animationPlayState = "";
  });

  toggle.addEventListener("click", function () {
    var open = panel.hasAttribute("hidden");
    if (open) panel.removeAttribute("hidden");
    else panel.setAttribute("hidden", "");
    toggle.setAttribute("aria-expanded", String(open));
  });

  renderSwatches();
})();
