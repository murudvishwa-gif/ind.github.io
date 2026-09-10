(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  // Reveal blocks on entry and re-arm only after they leave the viewport completely.
  // Content remains readable when scripts or animations are unavailable.
  const selector = [
    '.hero-copy > *', '.hero-media', '.trusted', '.partners',
    'main > section > h2', 'main > section > .section-description',
    '.feature-card', '.sector-card', '.benefit-card',
    '.partnership-photo', '.partnership-copy', '.process-step', '.stat',
    '.testimonial-card', '.closing-cta > *', '.footer-columns > *',
    '.footer-bottom', '.error-art', '.error-layout > section', '.footer'
  ].join(', ');
  const active = new Map();
  const revealed = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const element = entry.target;
      if (!entry.isIntersecting) {
        if (entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= window.innerHeight) {
          revealed.delete(element);
          active.get(element)?.cancel();
          active.delete(element);
        }
        return;
      }
      if (revealed.has(element) || preference.matches || element.matches(':focus-within')) return;
      revealed.add(element);
      const siblings = Array.from(element.parentElement.children);
      const delay = (siblings.indexOf(element) % 3) * 90;
      const isPhoto = element.matches('.hero-media, .partnership-photo, .error-art');
      const animation = element.animate([
        { opacity: 0, translate: '0 32px', scale: isPhoto ? '0.97' : '1' },
        { opacity: 1, translate: '0 0', scale: '1' }
      ], { duration: 760, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
      active.set(element, animation);
      animation.onfinish = () => active.delete(element);
    });
  }, { threshold: 0 });

  document.querySelectorAll(selector).forEach(element => observer.observe(element));
  // Keyboard navigation should always expose focused content immediately.
  document.addEventListener('focusin', event => {
    active.forEach((animation, element) => {
      if (element.contains(event.target)) { animation.cancel(); active.delete(element); }
    });
  });
  preference.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    active.forEach(animation => animation.cancel());
    active.clear();
  });
})();
