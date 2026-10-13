/* Projects index: each row is a disclosure that opens in place (one at a
   time). With a precise pointer, a tilted preview follows the cursor with a
   critically damped lerp and stops its rAF loop once it settles. */
(function () {
  var list = document.getElementById("pindex");
  if (!list) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll(".pi"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setOpen(row, open) {
    row.classList.toggle("is-open", open);
    row.querySelector(".pi-head").setAttribute("aria-expanded", String(open));
  }

  rows.forEach(function (row) {
    var head = row.querySelector(".pi-head");
    head.addEventListener("click", function () {
      var open = !row.classList.contains("is-open");
      rows.forEach(function (r) {
        if (r !== row && r.classList.contains("is-open")) setOpen(r, false);
      });
      setOpen(row, open);
      hideFloat();
      // Closing a row above can pull this one under the top bar; bring it back.
      if (open) {
        requestAnimationFrame(function () {
          var top = head.getBoundingClientRect().top;
          if (top < 60) {
            window.scrollBy({ top: top - 64, behavior: reduce ? "auto" : "smooth" });
          }
        });
      }
    });
  });

  /* ---- Floating preview, precise pointers only ------------------------ */
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var float = document.getElementById("piFloat");
  var wrap = list.parentElement;
  if (!float || !wrap) return;
  var img = float.querySelector("img");

  var tx = 0, ty = 0, x = 0, y = 0, running = false, placed = false;

  function render() {
    float.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
  }
  function loop() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    render();
    if (Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3) {
      running = false;
      return;
    }
    requestAnimationFrame(loop);
  }

  function hideFloat() {
    float.classList.remove("is-on");
  }

  list.addEventListener("pointermove", function (e) {
    var r = wrap.getBoundingClientRect();
    tx = e.clientX - r.left + 28;
    ty = e.clientY - r.top - float.offsetHeight / 2;
    // First appearance: start at the cursor instead of sliding in from 0,0.
    if (!placed || reduce) {
      x = tx;
      y = ty;
      placed = true;
      render();
      return;
    }
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  });

  rows.forEach(function (row) {
    var head = row.querySelector(".pi-head");
    head.addEventListener("pointerenter", function () {
      if (row.classList.contains("is-open")) return hideFloat();
      var src = head.getAttribute("data-preview");
      if (img.getAttribute("src") !== src) img.setAttribute("src", src);
      float.classList.toggle("is-phone", !!row.querySelector(".pi-shot--phone"));
      float.classList.add("is-on");
    });
    head.addEventListener("pointerleave", hideFloat);
  });

  list.addEventListener("pointerleave", function () {
    hideFloat();
    placed = false;
  });
})();
