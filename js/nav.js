/* Top bar: slides in once the hero's own header has scrolled out of view,
   and marks the link for the section currently in view (wayfinding). */
(function () {
  var bar = document.getElementById("topbar");
  var heroTop = document.querySelector(".hero-top");
  if (!bar || !heroTop || !("IntersectionObserver" in window)) return;

  // Keep it out of the tab order while hidden.
  function setVisible(on) {
    bar.classList.toggle("is-visible", on);
    if (on) bar.removeAttribute("inert");
    else bar.setAttribute("inert", "");
  }
  setVisible(false);

  new IntersectionObserver(function (entries) {
    setVisible(!entries[0].isIntersecting);
  }).observe(heroTop);

  var links = Array.prototype.slice.call(bar.querySelectorAll('.topbar-links a[href^="#"]'));
  var byId = {};
  links.forEach(function (a) {
    byId[a.getAttribute("href").slice(1)] = a;
  });

  function setCurrent(id) {
    links.forEach(function (a) {
      if (a === byId[id]) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  // A thin band across the middle of the viewport decides the active section.
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setCurrent(e.target.id);
      });
    },
    { rootMargin: "-45% 0px -54% 0px" }
  );
  ["home"].concat(Object.keys(byId)).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) io.observe(el);
  });
})();
