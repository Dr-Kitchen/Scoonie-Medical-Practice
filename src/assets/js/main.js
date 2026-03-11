// Skip to content - no extra code needed (CSS handles it)

// Alert banner dismiss
(function () {
  const banner = document.querySelector('[data-alert-banner]');
  const dismissBtn = document.querySelector('[data-alert-dismiss]');
  if (!banner || !dismissBtn) return;

  const STORAGE_KEY = 'alert_dismissed_' + banner.dataset.alertBanner;

  if (sessionStorage.getItem(STORAGE_KEY)) {
    banner.remove();
    return;
  }

  dismissBtn.addEventListener('click', function () {
    banner.remove();
    sessionStorage.setItem(STORAGE_KEY, '1');
  });
})();

// Mobile navigation toggle
(function () {
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', function () {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('hidden');
  });

  // Close on click outside
  document.addEventListener('click', function (e) {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.add('hidden');
    }
  });

  // Sub-menu toggles
  document.querySelectorAll('[data-submenu-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const submenu = document.getElementById(btn.getAttribute('aria-controls'));
      if (submenu) submenu.classList.toggle('hidden');
    });
  });
})();

// Collapsible sections
(function () {
  document.querySelectorAll('[data-collapsible]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const content = document.getElementById(btn.getAttribute('aria-controls'));
      if (content) content.classList.toggle('is-open');
    });
  });
})();

// Highlight today in opening hours tables
(function () {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  document.querySelectorAll('[data-day]').forEach(function (row) {
    if (row.dataset.day === today) {
      row.classList.add('today');
    }
  });
})();
