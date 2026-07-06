/* Scroll-triggered section reveals.
   Classes are added here (not in HTML) so that with JS disabled nothing is
   ever hidden. All revealed content sits below the hero, so applying the
   hidden state on load causes no visible flash. */
(function () {
  var q = function (s, r) {
    return (r || document).querySelector(s);
  };
  var qa = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  function mark(el, variant, delay) {
    if (!el) return;
    el.classList.add("reveal");
    if (variant) el.classList.add(variant);
    if (delay) el.style.setProperty("--reveal-delay", delay + "s");
  }

  // About, title rises, body + skill groups stagger up.
  mark(q(".about-title"), "", 0);
  mark(q(".about-bio"), "", 0.08);
  qa(".about-meta > div").forEach(function (el, i) {
    mark(el, "", 0.12 + i * 0.08);
  });

  // Section headers (Experience / Projects) slide in from the left.
  qa(".big-title").forEach(function (el) {
    mark(el, "from-left", 0);
  });
  qa(".section-sub").forEach(function (el) {
    mark(el, "", 0.1);
  });

  // Experience rows cascade.
  qa(".exp-row").forEach(function (el, i) {
    mark(el, "", i * 0.08);
  });

  // Projects, image and text converge from opposite sides (mirrored on
  // the alternating "reverse" rows).
  qa(".proj-row").forEach(function (row) {
    var rev = row.classList.contains("reverse");
    mark(row.querySelector(".proj-frame"), rev ? "from-right" : "from-left", 0);
    mark(row.querySelector(".proj-info"), rev ? "from-left" : "from-right", 0.08);
  });

  // Contact, lead fades up, the giant CTA scales in, footer follows.
  mark(q(".contact-lead"), "", 0);
  mark(q(".contact-cta"), "from-scale", 0.08);
  mark(q(".footer"), "", 0.05);

  var targets = qa(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("in");
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach(function (el) {
    io.observe(el);
  });
})();
