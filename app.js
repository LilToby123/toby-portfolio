(function () {
  var RECIPIENT = "1595314539947499525";
  var theme = "dark";
  var toastTimer;

  function dmUrl(text) {
    return "https://x.com/messages/compose?recipient_id=" + RECIPIENT + "&text=" + encodeURIComponent(text);
  }

  function showToast(message) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("show");
      toastTimer = setTimeout(function () { el.hidden = true; }, 280);
    }, 2400);
  }

  function openDm(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast("Message copied. Paste it in the DM if the box is empty.");
      }).catch(function () {});
    }
    window.open(dmUrl(text), "_blank", "noopener,noreferrer");
  }

  document.querySelectorAll("[data-dm]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var text = el.getAttribute("data-dm");
      if (!text) return;
      e.preventDefault();
      el.setAttribute("href", dmUrl(text));
      openDm(text);
    });
  });

  var themeBtn = document.getElementById("themeToggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(next) {
    theme = next;
    document.documentElement.setAttribute("data-theme", next);
    if (themeMeta) themeMeta.setAttribute("content", next === "light" ? "#f6f4f1" : "#09080c");
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", next === "light" ? "Switch to dark theme" : "Switch to light theme");
    }
  }

  applyTheme("dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(theme === "dark" ? "light" : "dark");
    });
  }

  var toggle = document.getElementById("navToggle");
  var overlay = document.getElementById("navOverlay");
  if (toggle && overlay) {
    function setOpen(open) {
      overlay.classList.toggle("open", open);
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () {
      setOpen(!overlay.classList.contains("open"));
    });
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  document.querySelectorAll(".faq-item button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (el) {
        el.classList.remove("open");
        el.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    nodes.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  nodes.forEach(function (el) { io.observe(el); });
})();
