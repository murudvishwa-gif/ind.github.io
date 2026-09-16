// Reveal on entry without hiding content before JavaScript initializes.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const selector = 'h1, .section-heading, .hero-copy > p, .hero-copy > .actions, .hero-inner > p, .hero-inner > .actions, .hero-media, .hero-explorer, .trusted, .partners, .editorial-card, .why-intro, .why-assurance, .feature-card, .sector-card, .benefit-card, .grid > *, .split > *, .partnership-photo, .partnership-copy, .process-step, .stat, .stats > div, .testimonial-card, .closing-cta > *, .cta > *, .faq details, .footer-columns > *, .footer-bottom, .article-cover, .article-content > *, .auth-content > *, .page-heading, .panel, .form-panel, .error-art, .error-layout > section, main > section > h2, [data-reveal]';
  const seen = new WeakSet(), active = new Map();
  let observer, progress, frame;
  const reveal = element => {
    observer?.unobserve(element);
    if (seen.has(element)) return;
    seen.add(element); element.dataset.revealed = 'true';
    if (reduced.matches || element.matches(':focus-within') || !element.animate) return;
    const index = Array.from(element.parentElement.children).indexOf(element) % 3;
    const animation = element.animate([{opacity:0,transform:`translateY(${innerWidth < 700 ? 18 : 30}px)`},{opacity:1,transform:'translateY(0)'}], {duration:700,delay:index*65,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    active.set(element,animation); animation.onfinish = () => active.delete(element);
  };
  const scan = () => {
    if (!observer) return;
    document.querySelectorAll(selector).forEach(element => {
      if (!seen.has(element) && !element.closest('[hidden], .stats-marquee') && !element.parentElement.closest(selector)) observer.observe(element);
    });
  };
  const update = () => {
    frame = null;
    if (!progress) return;
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1,Math.max(0,scrollY/distance)) : 0})`;
  };
  const schedule = () => { if (!frame) frame=requestAnimationFrame(update); };
  function setup() {
    observer?.disconnect(); observer=null;
    active.forEach(animation=>animation.cancel()); active.clear();
    progress?.remove(); progress=null;
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)reveal(entry.target);}),{threshold:.05});
    progress=document.createElement('div'); progress.className='scroll-progress'; progress.setAttribute('aria-hidden','true');
    document.body.append(progress); scan(); update();
  }
  document.addEventListener('focusin',event=>active.forEach((animation,element)=>{if(element.contains(event.target)){animation.cancel();active.delete(element);}}));
  document.addEventListener('dashboard:view',scan);
  document.addEventListener('site:layout',()=>{scan();schedule();});
  document.addEventListener('toggle',schedule,true);
  addEventListener('scroll',schedule,{passive:true}); addEventListener('resize',schedule,{passive:true}); addEventListener('load',schedule,{once:true});
  reduced.addEventListener('change',setup); setup();
})();
