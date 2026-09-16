(() => {
  document.querySelectorAll('[data-provider]').forEach(button => {
    button.addEventListener('click', () => {
      window.location.assign('404.html');
    });
  });
  document.querySelectorAll('[data-dialog]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.getElementById(link.dataset.dialog).showModal();
    });
  });
})();
