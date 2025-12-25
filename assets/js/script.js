'use strict';

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebarBtn && sidebar) sidebarBtn.addEventListener('click', () => sidebar.classList.toggle('active'));

/* Theme */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
html.setAttribute('data-theme', localStorage.getItem('theme') || 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* Nav */
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

function navigateToPage(targetPage) {
  pages.forEach(p => p.classList.remove('active'));
  navigationLinks.forEach(l => l.classList.remove('active'));

  const target = document.querySelector(`[data-page="${targetPage}"]`);
  if (target) target.classList.add('active');

  navigationLinks.forEach(link => {
    if (link.innerHTML.toLowerCase() === targetPage) link.classList.add('active');
  });

  window.scrollTo(0, 0);
  localStorage.setItem('currentPage', targetPage);
}

navigationLinks.forEach(link => link.addEventListener('click', () => navigateToPage(link.innerHTML.toLowerCase())));

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('currentPage');
  if (saved) navigateToPage(saved);
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* Scroll-to-top */
const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
  if (!scrollToTopBtn) return;
  scrollToTopBtn.classList.toggle('active', window.scrollY > 400);
});
if (scrollToTopBtn) scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Filters + Search */
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const projectItems = document.querySelectorAll('.project-item');
const noResults = document.getElementById('noResults');
const projectSearch = document.getElementById('projectSearch');

function applyProjectVisibility() {
  const activeBtn = document.querySelector('[data-filter-btn].active');
  const filterValue = activeBtn ? activeBtn.getAttribute('data-filter-btn') : 'all';
  const q = (projectSearch?.value || '').trim().toLowerCase();

  let shown = 0;
  projectItems.forEach(item => {
    const category = item.getAttribute('data-category') || '';
    const title = (item.getAttribute('data-title') || '').toLowerCase();
    const tools = (item.getAttribute('data-tools') || '').toLowerCase();
    const text = (item.innerText || '').toLowerCase();

    const matchFilter = (filterValue === 'all' || category === filterValue);
    const matchSearch = (!q || title.includes(q) || tools.includes(q) || text.includes(q));

    const show = matchFilter && matchSearch;
    item.classList.toggle('active', show);
    if (show) shown += 1;
  });

  if (noResults) noResults.hidden = shown !== 0;
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyProjectVisibility();
  });
});
if (projectSearch) projectSearch.addEventListener('input', applyProjectVisibility);
applyProjectVisibility();

/* Modal */
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalProblem = document.getElementById('modalProblem');
const modalBullets = document.getElementById('modalBullets');
const modalOutcome = document.getElementById('modalOutcome');
const modalTools = document.getElementById('modalTools');
const modalLink1 = document.getElementById('modalLink1');
const modalLink2 = document.getElementById('modalLink2');

function openModalFromItem(item) {
  if (!modal) return;

  modalTitle.textContent = item.getAttribute('data-title') || 'Project';
  modalSubtitle.textContent = item.getAttribute('data-subtitle') || '';
  modalProblem.textContent = item.getAttribute('data-problem') || '';
  modalOutcome.textContent = item.getAttribute('data-outcome') || '';

  // bullets
  modalBullets.innerHTML = '';
  (item.getAttribute('data-bullets') || '')
    .split(';').map(s => s.trim()).filter(Boolean)
    .forEach(b => {
      const li = document.createElement('li');
      li.textContent = b;
      modalBullets.appendChild(li);
    });

  // tools
  modalTools.innerHTML = '';
  (item.getAttribute('data-tools') || '')
    .split(',').map(s => s.trim()).filter(Boolean)
    .forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      modalTools.appendChild(span);
    });

  modalLink1.href = item.getAttribute('data-link1') || '#';
  modalLink2.href = item.getAttribute('data-link2') || '#';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const openBtn = e.target.closest('[data-open-modal]');
  if (openBtn) {
    const item = openBtn.closest('.project-item');
    if (item) openModalFromItem(item);
  }
  if (e.target.closest('[data-modal-close]')) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* Copy email */
const copyEmailBtn = document.getElementById('copyEmailBtn');
const toast = document.getElementById('toast');

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 1200);
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = 'surya@email.com';
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Email copied');
    }
  });
}

/* Reveal */
const revealEls = document.querySelectorAll(".service-item, .project-card, .timeline-item, .skill-group, .contact-card");
revealEls.forEach(el => el.classList.add("reveal"));
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); });
}, { threshold: 0.12 });
revealEls.forEach(el => obs.observe(el));
