/* Choose once per tab visit, before styles load, to avoid a background flash. */
(() => {
  const validScene = scene => scene === 'forest' || scene === 'underwater';
  const requested = new URLSearchParams(window.location.search).get('scene');
  let saved = null;
  try {
    saved = sessionStorage.getItem('what-a-world.scene');
  } catch (_) { /* Browsing without storage still supports the scene selector. */ }
  const scene = validScene(requested) ? requested : validScene(saved) ? saved
    : Math.random() < .5 ? 'forest' : 'underwater';
  try {
    sessionStorage.setItem('what-a-world.scene', scene);
  } catch (_) { /* A disabled session store leaves this choice on the current page. */ }
  document.documentElement.dataset.scene = scene;
})();
