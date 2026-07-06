/* Hero animated gradient background + live color controls.
   Vanilla port of the AnimatedGradientBackground component:
   a radial gradient that slowly "breathes", with a scale-in entrance. */
(function () {
  var el = document.getElementById("heroBg");
  if (!el) return;

  var STOPS = [35, 50, 60, 70, 80, 90, 100];
  var PRESETS = {
    Ember: ["#0A0A0A", "#3D0C02", "#7A1500", "#C1440E", "#FF6D00", "#FF9E00", "#FFD23F"],
    Spectrum: ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"],
    Sunset: ["#0A0A0A", "#4A1D6A", "#B5179E", "#F72585", "#FF6D00", "#FFB703", "#FFD166"],
    Ocean: ["#05070A", "#023E58", "#0077B6", "#00B4D8", "#48CAE4", "#90E0EF", "#CAF0F8"],
  };
  var DEFAULTS = PRESETS.Ember;

  var startingGap = 125;
  var breathingRange = 5;
  var animationSpeed = 0.02;
  var topOffset = 0;

  var colors = DEFAULTS.slice();
  var breathing = true;
  var width = startingGap;
  var dir = 1;

  function gradient(w) {
    var stops = STOPS.map(function (stop, i) {
      return colors[i] + " " + stop + "%";
    }).join(", ");
    return (
      "radial-gradient(" + w + "% " + (w + topOffset) + "% at 50% 20%, " + stops + ")"
    );
  }
  function paint() {
    el.style.background = gradient(width);
  }

  paint();

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduce) {
    // Entrance: fade + scale from 1.5 -> 1 over 2s.
    el.style.opacity = "0";
    el.style.transform = "scale(1.5)";
    el.style.transition =
      "opacity 2s cubic-bezier(0.25,0.1,0.25,1), transform 2s cubic-bezier(0.25,0.1,0.25,1)";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
      });
    });

    // Breathing loop.
    (function tick() {
      if (width >= startingGap + breathingRange) dir = -1;
      if (width <= startingGap - breathingRange) dir = 1;
      if (breathing) width += dir * animationSpeed;
      paint();
      requestAnimationFrame(tick);
    })();
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
        if (reduce) paint();
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
      renderSwatches();
      paint();
    });
    presetsEl.appendChild(b);
  });

  breathingEl.addEventListener("change", function () {
    breathing = breathingEl.checked;
  });

  resetEl.addEventListener("click", function () {
    colors = DEFAULTS.slice();
    width = startingGap;
    breathing = true;
    breathingEl.checked = true;
    renderSwatches();
    paint();
  });

  toggle.addEventListener("click", function () {
    var open = panel.hasAttribute("hidden");
    if (open) panel.removeAttribute("hidden");
    else panel.setAttribute("hidden", "");
    toggle.setAttribute("aria-expanded", String(open));
  });

  renderSwatches();
})();
