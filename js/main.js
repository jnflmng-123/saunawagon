// Sauna Wagon — small helpers: mobile menu, footer year, form handling
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Forms deliver through Web3Forms, so no email address appears on the site.
  // The access_key hidden field identifies the form; the destination address lives
  // only in the Web3Forms account. Until the key is set, the form asks visitors to
  // call or text instead.
  var PHONE = '(403) 809-1572';
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var keyField = form.querySelector('input[name="access_key"]');
      var key = keyField ? keyField.value : '';
      var button = form.querySelector('button[type="submit"]');

      if (!key || key === 'YOUR_ACCESS_KEY') {
        if (status) status.textContent = 'Online booking is being switched on. For now, call or text ' + PHONE + ' and we\'ll get you sorted.';
        return;
      }

      var data = new FormData(form);
      data.append('subject', form.getAttribute('data-subject') || 'Website request');
      if (button) button.disabled = true;
      if (status) status.textContent = 'Sending…';

      fetch(form.getAttribute('action'), { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json && json.success) {
            window.location.href = form.getAttribute('data-success') || 'booking-success.html';
          } else {
            throw new Error('send failed');
          }
        })
        .catch(function () {
          if (button) button.disabled = false;
          if (status) status.textContent = 'Something went wrong sending the form. Call or text ' + PHONE + ' and we\'ll sort you out.';
        });
    });
  });
});

// Availability calendar (data in js/availability.js)
(function () {
  var cfg = window.SAUNA_AVAILABILITY, el = document.getElementById('availability');
  if (!cfg || !el) return;
  var unavailable = {}; (cfg.unavailable || []).forEach(function (d) { unavailable[d] = true; });
  var opens = new Date(cfg.opens + 'T00:00:00');
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var first = opens > today ? opens : today;
  var start = new Date(first.getFullYear(), first.getMonth(), 1);
  var names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dows = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var html = '';
  for (var m = 0; m < (cfg.months || 3); m++) {
    var d = new Date(start.getFullYear(), start.getMonth() + m, 1);
    html += '<div class="cal"><div class="cal-title">' + names[d.getMonth()] + ' ' + d.getFullYear() + '</div><div class="cal-grid">';
    dows.forEach(function (x) { html += '<span class="cal-dow">' + x + '</span>'; });
    for (var i = 0; i < d.getDay(); i++) html += '<span class="cal-pad"></span>';
    var days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    for (var day = 1; day <= days; day++) {
      var dt = new Date(d.getFullYear(), d.getMonth(), day), key = iso(dt), cls = 'cal-day', dis = '';
      if (dt < opens || dt < today) { cls += ' is-closed'; dis = ' disabled'; }
      else if (unavailable[key]) { cls += ' is-unavailable'; dis = ' disabled'; }
      else cls += ' is-open';
      var label = cls.indexOf('is-unavailable') > -1 ? ' aria-label="' + key + ' unavailable"' : '';
      html += '<button type="button" class="' + cls + '" data-date="' + key + '"' + dis + label + '>' + day + '</button>';
    }
    html += '</div></div>';
  }
  html += '<div class="cal-legend"><span class="leg-open">Open</span><span class="leg-unavail">Unavailable</span><span class="leg-closed">Not bookable</span></div>';
  el.innerHTML = html;
  var inp = document.getElementById('b-date');
  el.addEventListener('click', function (e) {
    var b = e.target.closest('.is-open'); if (!b || !inp) return;
    inp.value = b.getAttribute('data-date'); inp.setCustomValidity('');
    var sel = el.querySelectorAll('.is-selected'); for (var i = 0; i < sel.length; i++) sel[i].classList.remove('is-selected');
    b.classList.add('is-selected');
    inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  if (inp) inp.addEventListener('change', function () {
    if (unavailable[inp.value]) { inp.setCustomValidity('That date is unavailable. Please pick another.'); inp.reportValidity(); }
    else inp.setCustomValidity('');
  });
})();
