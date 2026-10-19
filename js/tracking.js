// Sauna Wagon: visit measurement with the Meta Pixel.
// Skipped when the visitor opted out on the privacy page, or their browser sends
// Global Privacy Control or Do Not Track. Counts visits and form submissions only.
(function () {
  var PIXEL_ID = '2017686582250414';

  function optedOut() {
    try { return localStorage.getItem('sw_no_track') === '1'; } catch (e) { return false; }
  }

  // Opt-out / opt-in buttons on the privacy page.
  document.addEventListener('DOMContentLoaded', function () {
    var status = document.querySelector('[data-sw-status]');
    function show() {
      if (status) status.textContent = (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1')
        ? 'Your browser is already asking sites not to track you, so tracking is off.'
        : (optedOut() ? 'Tracking is off on this device.' : 'Tracking is on for this device.');
    }
    document.querySelectorAll('[data-sw-optout]').forEach(function (b) {
      b.addEventListener('click', function () { try { localStorage.setItem('sw_no_track', '1'); } catch (e) {} show(); });
    });
    document.querySelectorAll('[data-sw-optin]').forEach(function (b) {
      b.addEventListener('click', function () { try { localStorage.removeItem('sw_no_track'); } catch (e) {} show(); });
    });
    show();
  });

  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || optedOut()) return;

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('set', 'autoConfig', false, PIXEL_ID);
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
  // A finished booking request lands on booking-success.html.
  if (/\/booking-success(\.html)?\/?$/.test(location.pathname)) fbq('track', 'Lead');
})();
