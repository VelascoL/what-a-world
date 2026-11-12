(() => {
  const button = document.querySelector('[data-random]');
  const links = Array.from(document.querySelectorAll('[data-story-link]'));
  if (!button || !links.length) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    const link = links[Math.floor(Math.random() * links.length)];
    window.location.assign(link.href);
  });
})();

