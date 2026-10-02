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

  // Forms.
  // Set the form's action to your Formspree endpoint (https://formspree.io/f/XXXXXXXX)
  // and submissions land in your inbox. Until then, the form opens the visitor's
  // email app with everything filled in, addressed to hello@saunawagon.ca.
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute('action') || '';
      var status = form.querySelector('.form-status');
      var data = new FormData(form);
      var phoneNote = ' If nothing happens, call or text (403) 809-1572.';

      if (!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        var lines = [];
        data.forEach(function (value, key) {
          if (key.charAt(0) !== '_' && String(value).trim() !== '') {
            lines.push(key.replace(/_/g, ' ') + ': ' + value);
          }
        });
        var subject = encodeURIComponent(form.getAttribute('data-subject') || 'Website request');
        var body = encodeURIComponent(lines.join('\n'));
        window.location.href = 'mailto:hello@saunawagon.ca?subject=' + subject + '&body=' + body;
        if (status) status.textContent = 'Opening your email app with the details filled in.' + phoneNote;
        return;
      }

      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('send failed');
          window.location.href = form.getAttribute('data-success') || 'booking-success.html';
        })
        .catch(function () {
          if (status) status.textContent = 'Something went wrong sending the form.' + phoneNote;
        });
    });
  });
});
