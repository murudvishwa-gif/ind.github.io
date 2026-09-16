(() => {
  document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.getAttribute('aria-controls'));
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Hide' : 'Show';
      button.setAttribute('aria-pressed', String(show));
    });
  });
  document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      document.querySelectorAll('.article-card').forEach(card => {
        card.hidden = button.dataset.filter !== 'All' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) count++;
      });
      document.getElementById('filter-status').textContent = `${count} articles shown`;
      document.dispatchEvent(new Event('site:layout'));
    });
  });
  document.querySelectorAll('form[data-form]').forEach(form => {
    const password = form.querySelector('[name=password]');
    const confirmation = form.querySelector('[name=confirm]');
    const validatePasswords = () => confirmation?.setCustomValidity(confirmation.value !== password.value ? 'Passwords must match.' : '');
    confirmation?.addEventListener('input', validatePasswords);
    password?.addEventListener('input', validatePasswords);
    form.addEventListener('submit', event => {
      event.preventDefault();
      validatePasswords();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const status = form.querySelector('[role=status]');
      const type = form.dataset.form;
      if (type === 'contact' || type === 'newsletter') {
        window.location.assign('404.html');
      } else if (type === 'signup' || type === 'login') {
        const email = String(data.get('email')).trim();
        let previous = {};
        try { previous = JSON.parse(sessionStorage.getItem('stackly-profile')) || {}; } catch {}
        const name = type === 'signup' ? [data.get('first-name'), data.get('last-name')].map(v => String(v).trim()).join(' ') : (previous.email === email ? previous.name : email.split('@')[0]);
        if (!name.trim()) return;
        try { sessionStorage.setItem('stackly-profile', JSON.stringify({ name, email })); } catch {}
        form.querySelectorAll('input[type=password]').forEach(input => input.value = '');
        window.location.assign(type === 'signup' ? 'login.html' : (data.get('role') === 'admin' ? 'admin' : 'user') + '-dashboard.html');
      } else { window.location.assign('404.html'); }
    });
  });
})();
