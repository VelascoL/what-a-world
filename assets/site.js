(() => {
  const collection = document.querySelector('#story-collection');
  const select = document.querySelector('[data-story-order]');
  if (collection && select) {
    const stories = Array.from(collection.querySelectorAll('.fj-entry'));
    const reorder = () => {
      const ordered = stories.slice();
      if (select.value === 'newest') {
        ordered.sort((a, b) => b.dataset.publishedOn.localeCompare(a.dataset.publishedOn));
      } else {
        for (let i = ordered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
        }
      }
      collection.append(...ordered);
    };
    select.value = 'random';
    reorder();
    select.closest('label').hidden = false;
    select.addEventListener('change', reorder);
  }

  const button = document.querySelector('[data-random]');
  const links = Array.from(document.querySelectorAll('[data-story-link]'));
  if (!button || !links.length) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    const link = links[Math.floor(Math.random() * links.length)];
    window.location.assign(link.href);
  });
})();
