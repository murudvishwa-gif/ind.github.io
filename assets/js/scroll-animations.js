(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 700px)');
  const selector = [
    'h1', 'main > section > h2', '.section-heading', '.hero-copy > p', '.hero-copy > .actions',
    '.hero-inner > p', '.hero-inner > .actions', '.hero-media', '.trusted', '.partners',
    '.feature-card', '.sector-card', '.benefit-card', '.grid > *', '.split > *',
    '.partnership-photo', '.partnership-copy', '.process-step', '.stat', '.stats > div',
    '.testimonial-card', '.closing-cta > *', '.cta > *', '.faq details',
    '.footer-columns > *', '.footer-grid > *', '.footer-bottom', '.article-cover',
    '.article-content > *', '.auth-content > *', '.page-heading', '.panel',
    '.error-art', '.error-layout > section', '.footer'
  ].join(', ');
  // Animate outer blocks only, so nested headings/forms never move twice.
  const targets = () => Array.from(document.querySelectorAll(selector))
    .filter(element => !element.parentElement.closest(selector) && !element.closest('[hidden]'));
  let cleanup = () => {};

  function setup() {
    cleanup();
    if (reduced.matches) return;
    const elements = targets();
    const active = new Map();
    const finishFocused = event => active.forEach((animation, element) => {
      if (element.contains(event.target)) {
        if (animation.progress) animation.progress(1); else animation.finish();
      }
    });
    document.addEventListener('focusin', finishFocused);
    const distance = mobile.matches ? 18 : 36;
    const duration = mobile.matches ? 0.5 : 0.8;
    const delay = element => (Array.from(element.parentElement.children).indexOf(element) % 3) * (mobile.matches ? 0.045 : 0.085);

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {});
      context.add('reveal', element => {
        if (element.matches(':focus-within')) return;
        const heading = element.matches('h1, h2, .section-heading');
        const tween = gsap.fromTo(element,
          { opacity: 0, y: distance, ...(heading ? { clipPath: 'inset(0 0 100% 0)' } : {}) },
          { opacity: 1, y: 0, ...(heading ? { clipPath: 'inset(0 0 0% 0)' } : {}),
            duration, delay: delay(element), ease: 'power3.out',
            clearProps: 'opacity,transform,clipPath', onComplete: () => active.delete(element) });
        active.set(element, tween);
      });
      context.add(() => {
        elements.forEach(element => ScrollTrigger.create({
          trigger: element, start: 'top 94%', once: true,
          onEnter: () => context.reveal(element)
        }));
      });
      // Native scrolling stays intact; the thin line follows reading progress.
      const progress = document.createElement('div');
      progress.className = 'scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progress);
      context.add(() => gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: {
        start: 0, end: 'max', scrub: 0.15
      } }));
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh, { once: true });
      document.addEventListener('toggle', refresh, true);
      document.addEventListener('site:layout', refresh);
      cleanup = () => {
        context.revert();
        progress.remove();
        document.removeEventListener('focusin', finishFocused);
        window.removeEventListener('load', refresh);
        document.removeEventListener('toggle', refresh, true);
        document.removeEventListener('site:layout', refresh);
        active.clear();
      };
    } else if ('IntersectionObserver' in window && Element.prototype.animate) {
      // Content still reveals if the optional GSAP files cannot load.
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        observer.unobserve(element);
        if (element.matches(':focus-within')) return;
        const animation = element.animate([
          { opacity: 0, transform: `translateY(${distance}px)` },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: duration * 1000, delay: delay(element) * 1000,
          easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
        active.set(element, animation);
        animation.onfinish = () => active.delete(element);
      }), { threshold: 0 });
      elements.forEach(element => observer.observe(element));
      cleanup = () => {
        observer.disconnect();
        active.forEach(animation => animation.cancel());
        active.clear();
        document.removeEventListener('focusin', finishFocused);
      };
    } else {
      cleanup = () => document.removeEventListener('focusin', finishFocused);
    }
  }
  setup();
  reduced.addEventListener('change', setup);
  mobile.addEventListener('change', setup);
  document.addEventListener('dashboard:view', setup);
})();
