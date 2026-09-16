// Touch feedback for static and dynamically rendered boxes; scrolling stays native.
(() => {
  const selector = '.ui-card, .card, .feature-card, .sector-card, .benefit-card, .testimonial-card, .stat, .stats > div:not(.stats-window), .step, .process-step, .panel, .form-panel, .article-feature, .hero-media, .partnership-photo, .badge, .faq details, .error-art, .role-selection label, .workspace, .activity-item, .editorial-card, .hero-explorer, .profile-section, .social-logo-link, .social-options button';
  let box, startX, startY, timer;
  const clear = () => {
    clearTimeout(timer);
    box?.classList.remove('is-touch-active');
    box = null;
  };
  document.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse') return;
    clear();
    box = event.target.closest(selector);
    startX = event.clientX;
    startY = event.clientY;
    box?.classList.add('is-touch-active');
  }, { passive: true });
  document.addEventListener('pointermove', event => {
    if (box && Math.hypot(event.clientX - startX, event.clientY - startY) > 8) clear();
  }, { passive: true });
  document.addEventListener('pointerup', () => { timer = setTimeout(clear, 220); }, { passive: true });
  document.addEventListener('pointercancel', clear, { passive: true });
  document.addEventListener('scroll', clear, { passive: true, capture: true });
  window.addEventListener('blur', clear);
})();
