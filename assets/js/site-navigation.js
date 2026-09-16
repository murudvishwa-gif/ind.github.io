(() => {
  const header = document.querySelector('.header');
  const toggle = header?.querySelector('.menu-toggle');
  const nav = header?.querySelector('.navigation');
  const auth = header?.querySelector('.header-auth');
  if (!toggle || !nav || !auth) return;

  const mobile = matchMedia('(max-width: 1000px)');
  const navHome = document.createComment('Navigation position');
  const authHome = document.createComment('Account links position');
  nav.before(navHome); auth.before(authHome);

  // A native modal keeps the page inert and keyboard focus inside the menu.
  const dialog = document.createElement('dialog');
  dialog.id = 'mobile-navigation';
  dialog.className = 'mobile-navigation-dialog';
  dialog.setAttribute('aria-labelledby', 'mobile-navigation-title');
  dialog.innerHTML = `<div class="mobile-navigation-top"><a class="mobile-navigation-brand" href="index.html" aria-label="Stackly home"><img src="assets/images/stackly-logo.webp" width="140" height="28" alt="Stackly"></a><button type="button" class="mobile-navigation-close" aria-label="Close navigation" autofocus><span aria-hidden="true">✕</span></button></div><div class="mobile-navigation-content"><p class="mobile-navigation-eyebrow" id="mobile-navigation-title">Explore Stackly</p><div class="mobile-navigation-links"></div><div class="mobile-navigation-account"><p>Your next project starts here.</p></div><div class="mobile-navigation-bottom"><span>Precision. Partnership. Progress.</span><span>Industrial services</span></div></div>`;
  document.body.append(dialog);
  toggle.setAttribute('aria-controls', dialog.id);
  toggle.setAttribute('aria-haspopup', 'dialog');
  const close = () => { if (dialog.open) dialog.close(); reset(); };
  const reset = () => {
    document.documentElement.classList.remove('navigation-modal-open');
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  };
  const layout = () => {
    close(); reset();
    if (mobile.matches) {
      dialog.querySelector('.mobile-navigation-links').append(nav);
      dialog.querySelector('.mobile-navigation-account').append(auth);
      header.classList.add('mobile-menu-ready');
    } else {
      navHome.after(nav); authHome.after(auth);
      header.classList.remove('mobile-menu-ready');
    }
  };
  toggle.addEventListener('click', () => {
    if (!mobile.matches) return;
    if (dialog.open) { close(); return; }
    dialog.showModal();
    document.documentElement.classList.add('navigation-modal-open');
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('open');
  });
  dialog.querySelector('.mobile-navigation-close').addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  dialog.addEventListener('close', () => { if (!dialog.open) reset(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  // Explicit cycling also keeps focus contained in browsers with partial dialog support.
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('a[href],button')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  mobile.addEventListener('change', layout);
  addEventListener('pagehide', close);
  layout();
})();
