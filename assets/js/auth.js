(() => {
  document.querySelectorAll('[data-provider]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('provider-status').textContent = `${button.dataset.provider} sign-in is not connected in this preview. No account details have been sent.`;
    });
  });
  document.querySelectorAll('[data-dialog]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.getElementById(link.dataset.dialog).showModal();
    });
  });
})();
