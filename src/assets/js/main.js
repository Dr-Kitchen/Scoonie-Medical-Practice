// Cookie consent
(function () {
  var COOKIE_KEY = 'cookie_consent';
  var banner = document.getElementById('cookie-consent');
  var acceptBtn = document.getElementById('cookie-accept');
  if (!banner || !acceptBtn) return;

  if (!localStorage.getItem(COOKIE_KEY)) {
    banner.classList.remove('is-hidden');
  }

  acceptBtn.addEventListener('click', function () {
    localStorage.setItem(COOKIE_KEY, '1');
    banner.classList.add('is-hidden');
  });
})();

// Email obfuscation — reveal on click/hover
(function () {
  document.querySelectorAll('[data-email]').forEach(function (el) {
    var parts = el.dataset.email.split('|');
    var addr = parts[0] + '@' + parts[1];
    el.textContent = addr;
    el.href = 'mailto:' + addr;
  });
})();

// Alert banner dismiss — supports multiple alerts
(function () {
  document.querySelectorAll('[data-alert-banner]').forEach(function (banner) {
    var slug = banner.dataset.alertBanner;
    var STORAGE_KEY = 'alert_dismissed_' + slug;

    if (sessionStorage.getItem(STORAGE_KEY)) {
      banner.remove();
      return;
    }

    var dismissBtn = banner.querySelector('[data-alert-dismiss]');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        banner.remove();
        sessionStorage.setItem(STORAGE_KEY, '1');
      });
    }
  });
})();

// Desktop dropdown keyboard accessibility
(function () {
  var dropdownBtns = document.querySelectorAll('nav[aria-label="Main navigation"] button[aria-haspopup]');
  dropdownBtns.forEach(function (btn) {
    var parent = btn.closest('.group');
    if (!parent) return;
    var dropdown = parent.querySelector('[class*="absolute"]');
    if (!dropdown) return;

    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      closeAllDropdowns();
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
      }
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        btn.setAttribute('aria-expanded', 'false');
        dropdown.style.opacity = '';
        dropdown.style.visibility = '';
        btn.focus();
      }
    });

    dropdown.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        btn.setAttribute('aria-expanded', 'false');
        dropdown.style.opacity = '';
        dropdown.style.visibility = '';
        btn.focus();
      }
    });
  });

  function closeAllDropdowns() {
    dropdownBtns.forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      var p = b.closest('.group');
      if (p) {
        var d = p.querySelector('[class*="absolute"]');
        if (d) { d.style.opacity = ''; d.style.visibility = ''; }
      }
    });
  }

  document.addEventListener('click', function (e) {
    var inDropdown = false;
    dropdownBtns.forEach(function (b) {
      if (b.closest('.group') && b.closest('.group').contains(e.target)) inDropdown = true;
    });
    if (!inDropdown) closeAllDropdowns();
  });
})();

// Mobile navigation toggle
(function () {
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', function () {
    var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', function (e) {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.add('hidden');
    }
  });

  document.querySelectorAll('[data-submenu-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      var submenu = document.getElementById(btn.getAttribute('aria-controls'));
      if (submenu) submenu.classList.toggle('hidden');
    });
  });
})();

// Collapsible sections
(function () {
  document.querySelectorAll('[data-collapsible]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      var content = document.getElementById(btn.getAttribute('aria-controls'));
      if (content) content.classList.toggle('is-open');
    });
  });
})();

// Highlight today in opening hours tables
(function () {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var today = days[new Date().getDay()];
  document.querySelectorAll('[data-day]').forEach(function (row) {
    if (row.dataset.day === today) {
      row.classList.add('today');
    }
  });
})();

// Open/Closed indicator
(function () {
  var indicator = document.getElementById('open-closed-indicator');
  if (!indicator || !window.__SITE_DATA__) return;

  var data = window.__SITE_DATA__;
  var now = new Date();
  var dayIndex = now.getDay();
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var todayName = days[dayIndex];
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var currentMinutes = hours * 60 + minutes;

  // Check if today is a planned closure
  var todayStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  var closure = null;
  if (data.plannedClosures) {
    for (var i = 0; i < data.plannedClosures.length; i++) {
      if (data.plannedClosures[i].date === todayStr) {
        closure = data.plannedClosures[i];
        break;
      }
    }
  }

  // Find today's opening hours
  var todayHours = null;
  if (data.openingHours) {
    for (var j = 0; j < data.openingHours.length; j++) {
      if (data.openingHours[j].day === todayName) {
        todayHours = data.openingHours[j];
        break;
      }
    }
  }

  // Handle PLT days (closing at 1pm) — tolerate "1pm", "1 pm", "1:00pm", "1.00 pm"
  if (closure && closure.details && /1(?:[:.]?00)?\s*pm/i.test(closure.details)) {
    var pltClose = 13 * 60; // 1pm
    if (currentMinutes < pltClose) {
      indicator.textContent = 'Closing at 1pm today';
      indicator.className = 'status-indicator status-indicator--closing';
    } else {
      indicator.textContent = 'Currently closed';
      indicator.className = 'status-indicator status-indicator--closed';
    }
    return;
  }

  // Full-day closure
  if (closure) {
    indicator.textContent = 'Currently closed';
    indicator.className = 'status-indicator status-indicator--closed';
    return;
  }

  // Normal day
  if (todayHours && todayHours.open) {
    var openParts = todayHours.open.split(':');
    var closeParts = todayHours.close.split(':');
    var openMinutes = parseInt(openParts[0]) * 60 + parseInt(openParts[1]);
    var closeMinutes = parseInt(closeParts[0]) * 60 + parseInt(closeParts[1]);

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      indicator.textContent = 'Open now';
      indicator.className = 'status-indicator status-indicator--open';
    } else {
      indicator.textContent = 'Currently closed';
      indicator.className = 'status-indicator status-indicator--closed';
    }
  } else {
    indicator.textContent = 'Currently closed';
    indicator.className = 'status-indicator status-indicator--closed';
  }
})();

// Care navigator decision tree
(function () {
  var container = document.getElementById('care-navigator');
  if (!container) return;

  var states = {
    start: {
      question: 'What do you need help with?',
      options: [
        { label: 'I feel unwell', icon: 'thermometer', next: 'unwell_urgency' },
        { label: 'I need a prescription', icon: 'pill', result: 'prescription' },
        { label: 'I need mental health support', icon: 'heart', next: 'mental_crisis' },
        { label: 'I\'ve had an injury', icon: 'injury', next: 'injury_severity' },
        { label: 'I have a dental problem', icon: 'tooth', result: 'dental' },
        { label: 'I have an eye problem', icon: 'eye', result: 'eye' },
        { label: 'I need something else', icon: 'more', result: 'other' }
      ]
    },
    unwell_urgency: {
      question: 'Is this urgent?',
      options: [
        { label: 'Yes, I need help now', next: 'unwell_urgent_result' },
        { label: 'No, it can wait a day or two', next: 'unwell_common' }
      ]
    },
    unwell_urgent_result: {
      result: 'urgent'
    },
    unwell_common: {
      question: 'Is it a common condition like sore throat, UTI, earache, or skin rash?',
      options: [
        { label: 'Yes, it might be', result: 'pharmacy' },
        { label: 'No, or I\'m not sure', result: 'call_us' }
      ]
    },
    mental_crisis: {
      question: 'Is this a crisis?',
      options: [
        { label: 'Yes, I need immediate help', result: 'mental_crisis_result' },
        { label: 'No, but I need support', result: 'mental_support' }
      ]
    },
    injury_severity: {
      question: 'Is it life or limb threatening?',
      options: [
        { label: 'Yes, it\'s serious', result: 'call_999' },
        { label: 'No, but it needs attention', result: 'minor_injury' }
      ]
    }
  };

  var results = {
    prescription: {
      title: 'Order a repeat prescription',
      body: 'You can order your repeat medication online via Patient Access, by email, through your pharmacy, or using the drop-box at Leven Health Centre.',
      links: [{ text: 'Order a prescription', url: '/prescriptions/order-repeat/' }]
    },
    urgent: {
      title: 'Get urgent help',
      body: 'If you need urgent same-day care, call us on <a href="tel:{{phoneHref}}" class="text-brand-primary font-semibold">{{phone}}</a> from 08:00. Our team will arrange the most appropriate appointment.',
      links: [{ text: 'More about urgent care', url: '/get-help/urgent-care/' }]
    },
    pharmacy: {
      title: 'Try Pharmacy First',
      body: 'Your local pharmacy can treat many common conditions on the NHS, including UTIs, ear infections, sore throats, sinusitis, and skin infections — without a GP appointment.',
      links: [{ text: 'Learn about Pharmacy First', url: '/get-help/pharmacy-first/' }]
    },
    call_us: {
      title: 'Call us to book an appointment',
      body: 'Call <a href="tel:{{phoneHref}}" class="text-brand-primary font-semibold">{{phone}}</a> from 08:00, Monday to Friday. Our reception team will help match you to the right clinician.',
      links: [{ text: 'More about appointments', url: '/get-help/book-appointment/' }]
    },
    mental_crisis_result: {
      title: 'Get immediate mental health support',
      body: 'Call <a href="tel:111" class="text-brand-primary font-semibold">NHS 24 on 111</a> and choose the mental health option. You\'ll be connected to a mental health professional.<br><br><strong>Breathing Space:</strong> <a href="tel:08008385587" class="text-brand-primary font-semibold">0800 83 85 87</a> (Mon\u2013Thu 6pm\u20132am, Fri 6pm\u2013Mon 6am)',
      links: []
    },
    mental_support: {
      title: 'Mental health support',
      body: 'Our mental health nurses Seonad and Andrew can help. Call us to book directly \u2014 no GP referral needed. You can also self-refer to Access Therapies Fife for talking therapies.',
      links: [
        { text: 'Self-referral services', url: '/get-help/self-referral/' },
        { text: 'Book an appointment', url: '/get-help/book-appointment/' }
      ]
    },
    dental: {
      title: 'Dental problems',
      body: 'We cannot treat dental problems at the practice. Contact your dentist. If you don\'t have one, call the <strong>Fife Dental Help Line</strong> on <a href="tel:01592226555" class="text-brand-primary font-semibold">01592 226 555</a>. Out of hours: NHS 24 on 111.',
      links: []
    },
    eye: {
      title: 'Eye problems',
      body: 'Contact your optometrist first for red eye, pain, blurred vision, flashes, floaters, or headaches. Visit <a href="https://www.eyes.scot/" class="text-brand-primary font-semibold" rel="noopener noreferrer">Eyes.Scot</a> for guidance on urgent eye care \u2014 no GP referral needed.',
      links: []
    },
    call_999: {
      title: 'Call 999',
      body: 'For life-threatening or limb-threatening injuries, call <a href="tel:999" class="text-alert-urgent font-bold">999</a> immediately or go to your nearest A&amp;E.',
      links: []
    },
    minor_injury: {
      title: 'Minor Injuries Unit',
      body: 'For cuts, burns, sprains, suspected broken bones, or animal bites, call <a href="tel:111" class="text-brand-primary font-semibold">NHS 24 on 111</a> for a Minor Injuries Unit appointment. They\'ll direct you to the nearest open unit.',
      links: []
    },
    other: {
      title: 'Other services',
      body: 'We offer a range of services. Choose from the links below, or call us on <a href="tel:{{phoneHref}}" class="text-brand-primary font-semibold">{{phone}}</a> and we\'ll help.',
      links: [
        { text: 'Self-referral services', url: '/get-help/self-referral/' },
        { text: 'Contact us', url: '/contact/get-in-touch/' },
        { text: 'Register with us', url: '/new-patients/register/' },
        { text: 'Order a prescription', url: '/prescriptions/order-repeat/' }
      ]
    }
  };

  var history = [];

  function render(stateKey) {
    var state = states[stateKey];
    var html = '';

    // If this state has a direct result
    if (state && state.result) {
      renderResult(state.result);
      return;
    }

    if (state && state.question) {
      html += '<p class="font-medium text-neutral-dark mb-4">' + state.question + '</p>';
      html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">';
      state.options.forEach(function (opt) {
        if (opt.result) {
          html += '<button class="care-nav__option" data-result="' + opt.result + '">' + opt.label + '</button>';
        } else if (opt.next) {
          html += '<button class="care-nav__option" data-next="' + opt.next + '">' + opt.label + '</button>';
        }
      });
      html += '</div>';
    }

    if (history.length > 0) {
      html += '<button class="text-sm text-brand-primary mt-4 underline cursor-pointer" data-back>← Back</button>';
    }

    container.innerHTML = html;
    bindEvents();
  }

  var sitePhone = (window.__SITE_DATA__ && window.__SITE_DATA__.phone) || '';
  var sitePhoneHref = sitePhone.replace(/\s/g, '');

  function interpolate(text) {
    return text.replace(/\{\{phone\}\}/g, sitePhone).replace(/\{\{phoneHref\}\}/g, sitePhoneHref);
  }

  function renderResult(resultKey) {
    var r = results[resultKey];
    if (!r) return;

    var html = '<div class="care-nav__result">';
    html += '<h3 class="text-lg font-bold text-neutral-dark mb-2">' + r.title + '</h3>';
    html += '<p class="text-sm text-neutral-mid mb-4 leading-relaxed">' + interpolate(r.body) + '</p>';
    if (r.links && r.links.length) {
      html += '<div class="flex flex-wrap gap-3">';
      r.links.forEach(function (link) {
        html += '<a href="' + link.url + '" class="btn btn--primary text-sm">' + link.text + '</a>';
      });
      html += '</div>';
    }
    html += '</div>';
    html += '<button class="text-sm text-brand-primary mt-4 underline cursor-pointer" data-restart>Start again</button>';

    container.innerHTML = html;

    container.querySelector('[data-restart]').addEventListener('click', function () {
      history = [];
      render('start');
    });
  }

  function bindEvents() {
    container.querySelectorAll('[data-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        history.push(currentState);
        currentState = btn.dataset.next;
        render(currentState);
      });
    });
    container.querySelectorAll('[data-result]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        renderResult(btn.dataset.result);
      });
    });
    var backBtn = container.querySelector('[data-back]');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (history.length) {
          currentState = history.pop();
          render(currentState);
        }
      });
    }
  }

  var currentState = 'start';
  render('start');
})();
