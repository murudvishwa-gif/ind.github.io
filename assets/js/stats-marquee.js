(() => {
  const section = document.querySelector('.stats-marquee');
  if (!section) return;
  const track = section.querySelector('.stats-track');
  const copy = track.querySelector('.stats-list').cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.classList.add('stats-copy');
  track.append(copy);
  section.classList.add('is-scrolling');
})();
