(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navigation');
  const closeMenu = () => { nav?.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
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
      if (form.dataset.form === 'contact') {
        const body = ['Name: ' + data.get('name'), 'Email: ' + data.get('email'), 'Company: ' + data.get('company'), 'Phone: ' + data.get('phone'), 'Service: ' + data.get('service'), '', data.get('message')].join('\n');
        window.location.href = 'mailto:hello@Stackly.net.in?subject=' + encodeURIComponent('Project enquiry — ' + data.get('service')) + '&body=' + encodeURIComponent(body);
        status.textContent = 'Your email draft is ready in your mail app. Send it there to submit your enquiry. You can also email hello@Stackly.net.in directly.';
      } else if (form.dataset.form === 'newsletter') {
        window.location.href = 'mailto:hello@Stackly.net.in?subject=Newsletter%20subscription&body=' + encodeURIComponent('Please subscribe ' + data.get('email') + ' to engineering updates.');
        status.textContent = 'Send the subscription request from your email app to complete your request.';
      } else if (form.dataset.form === 'login') {
        const role = data.get('role') === 'admin' ? 'admin' : 'user';
        form.querySelector('[name=password]').value = '';
        window.location.assign(role + '-dashboard.html');
      } else {
        status.textContent = 'This is an account page preview. ' + (form.dataset.form === 'login' ? 'Sign-in' : 'Account creation') + ' will be available when the authentication service is connected. No password has been saved or sent.';
        form.querySelectorAll('input[type=password], input[name=password], input[name=confirm]').forEach(input => { input.value = ''; });
      }
    });
  });
})();
