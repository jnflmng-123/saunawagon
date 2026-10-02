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
