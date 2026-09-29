// Surya Yogananthan — portfolio
// Theme toggle, mobile menu, active nav link, scroll reveal, contact form, Tableau click-to-load.

(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  // ---------- Theme ----------
  function currentTheme() {
    const set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
    });
  });

  // ---------- Header border on scroll ----------
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------- Mobile menu ----------
  const menuBtn = document.querySelector("[data-menu-toggle]");
  const links = document.querySelector(".nav-links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- Active nav link ----------
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.remove("active"));
        const link = byId.get(entry.target.id);
        if (link) link.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          ro.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // ---------- Footer year ----------
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // ---------- Tableau click-to-load ----------
  // Tableau embeds are heavy, so each one loads only when the visitor asks for it.
  document.querySelectorAll("[data-embed-src]").forEach((frame) => {
    const btn = frame.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = frame.getAttribute("data-embed-src");
      iframe.title = frame.getAttribute("data-embed-title") || "Embedded visualization";
      iframe.allowFullscreen = true;
      frame.innerHTML = "";
      frame.appendChild(iframe);
    });
  });

  // ---------- Contact form (Web3Forms) ----------
  const form = document.getElementById("contactForm");
  if (form) {
    const status = form.querySelector(".form-status");
    const submit = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      submit.disabled = true;
      status.textContent = "Sending…";
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          form.reset();
          status.textContent = "Thanks — your message is on its way. I'll reply soon.";
        } else {
          status.textContent = json.message || "Something went wrong. Please email me directly.";
        }
      } catch (err) {
        status.textContent = "Couldn't send right now. Please email me directly.";
      } finally {
        submit.disabled = false;
      }
    });
  }
})();
