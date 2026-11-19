(() => {
  const root = document.documentElement;
  const controls = document.querySelector('.fj-scene-controls');
  const select = document.querySelector('#scene-select');
  const motionButton = document.querySelector('.fj-motion-toggle');
  const backdrop = document.querySelector('[data-sprite-manifest]');
  if (!controls || !select || !motionButton || !backdrop) return;

  const readPreference = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const readVisitScene = () => { try { return sessionStorage.getItem('what-a-world.scene'); } catch (_) { return null; } };
  const saveVisitScene = scene => { try { sessionStorage.setItem('what-a-world.scene', scene); } catch (_) {} };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches || readPreference('what-a-world.paused') === 'true';
  let sprites = [];
  let animation = null;
  let previousTime = null;
  let loading = false;
  let loaded = false;
  let swimmingTime = 0;
  const bodyWaves = [];
  const waveProfiles = [
    { sprite:'moray', selector:'.ocean-moray [data-sprite]', step:80, period:2100, amplitude:6, head:.18, waves:1.4 },
    { sprite:'deep-fish', selector:'.ocean-deep-fish [data-sprite]', step:40, period:2600, amplitude:8, head:.26, waves:1.15 }
  ];
  const journal = document.querySelector('#field-journal');
  const seafloor = document.querySelector('.ocean-seafloor');
  // Lane heights follow the user's drawing; offsets stagger arrivals without changing speed.
  const routes = {
    moray: { period:36, offset:27, direction:-1, depth:66 / 640 },
    school: { period:48, offset:8, direction:-1, depth:164 / 640 },
    jellyfish: { period:55, offset:7, diagonal:{ from:[0, 280 / 640], to:[232 / 360, 0] } },
    'jellyfish-medium': { period:60, offset:7, diagonal:{ from:[1, .68], to:[.83, 0] } },
    'jellyfish-small': { period:68, offset:7, diagonal:{ from:[.04, 1], to:[.13, 0] } },
    'yellow-fish': { period:28, offset:27, direction:1, depth:294 / 640 },
    'deep-fish': { period:42, offset:6, direction:-1, depth:416 / 640 },
    'bottom-fish': { period:30, direction:-1, depth:28 / 140, floor:true }
  };
  const creatures = Array.from(document.querySelectorAll('[data-swim]')).flatMap(element => {
    const baseRoute = routes[element.dataset.swim];
    const route = baseRoute && { ...baseRoute, offset:(baseRoute.offset || 0) + (Number(element.dataset.swimOffset) || 0) };
    const picture = element.querySelector('[data-sprite]');
    return route && picture ? [{ element, picture, route, path:null }] : [];
  });
  const bubbles = [
    { side:'left', across:.28, size:4, period:56, phase:.17 },
    { side:'right', across:.72, size:6, period:64, phase:.62 },
    { side:'left', across:.73, size:5, period:71, phase:.86 },
    { side:'right', across:.25, size:3, period:52, phase:.35 }
  ].map(bubble => {
    const element = document.createElement('span');
    element.className = 'ocean-bubble';
    element.setAttribute('aria-hidden', 'true');
    element.style.width = `${bubble.size}px`;
    element.style.height = `${bubble.size}px`;
    element.style.opacity = '0';
    backdrop.appendChild(element);
    return { ...bubble, element, bounds:null };
  });
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

  function placeBubbles() {
    bubbles.forEach(bubble => {
      if (!bubble.bounds) return;
      const { element, bounds, size } = bubble;
      const progress = (bubble.phase + swimmingTime / (bubble.period * 1000)) % 1;
      const sway = Math.sin(progress * Math.PI * 2 + bubble.phase) * bounds.sway;
      const x = clamp(bounds.x + sway, bounds.left, bounds.right);
      const y = bounds.height + size + 12 - progress * (bounds.height + size * 2 + 24);
      element.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
      element.style.opacity = (.28 * Math.min(1, progress / .12, (1-progress) / .12)).toFixed(3);
    });
  }

  function paintBodyWaves() {
    bodyWaves.forEach(body => {
      const frame = Math.floor(swimmingTime / body.step);
      if (frame === body.frame) return;
      body.frame = frame;
      const { context, image, canvas, padding } = body;
      const phase = frame * body.step / body.period * Math.PI * 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let x = 0; x < image.naturalWidth; x++) {
        const alongBody = x / (image.naturalWidth - 1);
        // Keep faces steady while the body wave grows toward the tail.
        const amplitude = body.amplitude * Math.pow(Math.max(0, (alongBody - body.head) / (1-body.head)), 1.2);
        const bend = Math.round(amplitude * Math.sin(phase - alongBody * Math.PI * 2 * body.waves));
        context.drawImage(image, x, 0, 1, image.naturalHeight,
          x, padding + bend, 1, image.naturalHeight);
      }
    });
  }
  function loadBodyWaves() {
    waveProfiles.forEach(profile => {
      const picture = document.querySelector(profile.selector);
      if (!picture || bodyWaves.some(body => body.picture === picture)) return;
      const image = new Image();
      image.onload = () => {
        if (!image.naturalWidth || !image.naturalHeight) return;
        const canvas = document.createElement('canvas');
        const padding = profile.amplitude + 2;
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight + padding * 2;
        const context = canvas.getContext('2d');
        if (!context) return; // Keep the complete static pose as a fallback.
        context.imageSmoothingEnabled = false;
        canvas.className = 'ocean-undulation';
        canvas.dataset.bodyWave = profile.sprite;
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.top = `${-padding / image.naturalHeight * 100}%`;
        canvas.style.height = `${canvas.height / image.naturalHeight * 100}%`;
        bodyWaves.push({ ...profile, picture, image, canvas, context, padding, frame:-1 });
        paintBodyWaves();
        picture.appendChild(canvas);
        picture.style.backgroundImage = 'none';
      };
      image.onerror = () => {}; // The CSS image remains visible if loading fails.
      image.src = new URL(`${profile.sprite}.png`, new URL(backdrop.dataset.spriteManifest, window.location.href)).href;
    });
  }

  // Swimming moves the entire animal. Its body-frame cycle is independent.
  function placeCreatures() {
    creatures.forEach(creature => {
      if (!creature.path) return;
      const { element, picture, route, path } = creature;
      const progress = (path.initialProgress + swimmingTime / (route.period * 1000)) % 1;
      const x = path.from.x + (path.to.x - path.from.x) * progress - path.width / 2;
      const y = path.from.y + (path.to.y - path.from.y) * progress - path.height / 2;
      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      // Mirror the upward-right jellyfish artwork for the leftward ascent.
      picture.style.transform = route.diagonal
        ? (path.to.x < path.from.x ? 'scaleX(-1)' : 'none')
        : `scaleX(${route.direction === 1 ? -1 : 1})`;
    });
  }
  function layoutCreatures() {
    if (root.dataset.scene !== 'underwater' || !journal) return;
    const paper = journal.getBoundingClientRect();
    const water = backdrop.getBoundingClientRect();
    const floor = seafloor?.getBoundingClientRect();
    creatures.forEach(creature => {
      const { element, route } = creature;
      const container = route.floor ? floor : water;
      const size = element.getBoundingClientRect();
      if (!container?.width || !container.height || !size.width || !size.height) { creature.path = null; return; }
      let from;
      let to;
      if (route.diagonal) {
        const start = { x:route.diagonal.from[0] * container.width, y:route.diagonal.from[1] * container.height };
        const end = { x:route.diagonal.to[0] * container.width, y:route.diagonal.to[1] * container.height };
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const radius = Math.hypot(size.width, size.height) / 2 + 12;
        // Extend the line to padded scene edges, including right/bottom entries.
        // The radius keeps the entire animal offscreen when its loop resets.
        const xBounds = dx === 0 ? [-Infinity, Infinity]
          : [(-radius-start.x)/dx, (container.width+radius-start.x)/dx].sort((a,b) => a-b);
        const yBounds = dy === 0 ? [-Infinity, Infinity]
          : [(-radius-start.y)/dy, (container.height+radius-start.y)/dy].sort((a,b) => a-b);
        const entry = Math.max(xBounds[0], yBounds[0]);
        const exit = Math.min(xBounds[1], yBounds[1]);
        from = { x:start.x + dx * entry, y:start.y + dy * entry };
        to = { x:start.x + dx * exit, y:start.y + dy * exit };
      } else {
        const inset = Math.min(size.height / 2 + 12, container.height / 2);
        const y = clamp(container.height * route.depth, inset, container.height - inset);
        const left = { x:-size.width / 2 - 12, y };
        const right = { x:container.width + size.width / 2 + 12, y };
        from = route.direction === -1 ? right : left;
        to = route.direction === -1 ? left : right;
      }
      // Reference positions anchor the staggered starts; the paper only occludes the route.
      const initialX = route.floor ? container.width * .2 : element.dataset.side === 'left'
        ? clamp(paper.left - water.left, 0, water.width) / 2
        : (clamp(paper.right - water.left, 0, water.width) + water.width) / 2;
      creature.path = {
        from, to, width:size.width, height:size.height,
        initialProgress:(clamp((initialX - from.x) / (to.x - from.x), 0, 1) + (route.offset || 0) / route.period) % 1
      };
      element.style.left = '0px';
      element.style.right = 'auto';
      element.style.top = '0px';
    });
    bubbles.forEach(bubble => {
      const left = bubble.side === 'left' ? 0 : clamp(paper.right - water.left, 0, water.width);
      const right = bubble.side === 'left' ? clamp(paper.left - water.left, 0, water.width) : water.width;
      const fits = right-left >= bubble.size+4;
      bubble.element.style.display = fits ? 'block' : 'none';
      bubble.bounds = fits ? {
        left:left+2, right:right-bubble.size-2, height:water.height,
        x:left+(right-left)*bubble.across-bubble.size/2,
        sway:Math.min(7, (right-left-bubble.size-4)/4)
      } : null;
    });
    placeCreatures();
    placeBubbles();
  }

  const paint = sprite => {
    const x = sprite.frame % sprite.columns;
    const y = Math.floor(sprite.frame / sprite.columns);
    sprite.element.style.backgroundPosition = `${sprite.columns > 1 ? x * 100 / (sprite.columns - 1) : 0}% ${sprite.rows > 1 ? y * 100 / (sprite.rows - 1) : 0}%`;
  };
  const shouldAnimate = () => root.dataset.scene === 'underwater' && !paused && !document.hidden && sprites.length;
  function tick(time) {
    animation = null;
    if (!shouldAnimate()) { previousTime = null; return; }
    const elapsed = previousTime === null ? 0 : Math.min(time - previousTime, 100);
    previousTime = time;
    swimmingTime += elapsed;
    placeCreatures();
    placeBubbles();
    paintBodyWaves();
    sprites.forEach(sprite => {
      sprite.elapsed += elapsed;
      let changed = false;
      while (sprite.elapsed >= sprite.durations[sprite.frame]) {
        sprite.elapsed -= sprite.durations[sprite.frame];
        sprite.frame = (sprite.frame + 1) % sprite.durations.length;
        changed = true;
      }
      if (changed) paint(sprite);
    });
    animation = requestAnimationFrame(tick);
  }
  function syncAnimation() {
    if (animation !== null) cancelAnimationFrame(animation);
    animation = null;
    previousTime = null;
    if (shouldAnimate()) animation = requestAnimationFrame(tick);
  }
  function syncMotionButton() {
    motionButton.textContent = paused ? 'Resume movement' : 'Pause movement';
    motionButton.hidden = root.dataset.scene !== 'underwater' || !loaded;
  }
  async function loadSprites() {
    if (loading || loaded) return;
    loading = true;
    try {
      const response = await fetch(backdrop.dataset.spriteManifest);
      if (!response.ok) throw new Error('Sprite metadata unavailable');
      const manifest = await response.json();
      sprites = Array.from(document.querySelectorAll('[data-sprite]')).flatMap(element => {
        const data = manifest[element.dataset.sprite];
        if (!data || !data.durations?.length || data.durations.some(delay => delay <= 0)) return [];
        const sprite = { ...data, element, frame: Number(element.dataset.startFrame || 0) % data.durations.length, elapsed: 0 };
        element.style.backgroundSize = `${data.columns * 100}% ${data.rows * 100}%`;
        paint(sprite);
        return [sprite];
      });
      loaded = sprites.length > 0;
      layoutCreatures();
      loadBodyWaves();
    } catch (_) { /* The first frames remain visible if animation data cannot load. */ }
    finally { loading = false; syncMotionButton(); syncAnimation(); }
  }
  function setScene(scene, updateURL = false) {
    root.dataset.scene = scene === 'underwater' ? 'underwater' : 'forest';
    select.value = root.dataset.scene;
    saveVisitScene(select.value);
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = select.value === 'underwater' ? '#3f36e9' : '#fff8e9';
    if (updateURL) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('scene', select.value);
        window.history.replaceState(null, '', url);
      } catch (_) { /* Scene switching also works without History API access. */ }
    }
    syncMotionButton();
    syncAnimation();
    if (select.value === 'underwater') {
      if (loaded) layoutCreatures();
      else loadSprites();
    }
  }
  select.addEventListener('change', () => setScene(select.value, true));
  motionButton.addEventListener('click', () => {
    paused = !paused;
    savePreference('what-a-world.paused', String(paused));
    syncMotionButton();
    syncAnimation();
  });
  const onReducedMotion = event => {
    if (event.matches) paused = true;
    syncMotionButton();
    syncAnimation();
  };
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onReducedMotion);
  else reducedMotion.addListener(onReducedMotion);
  document.addEventListener('visibilitychange', syncAnimation);
  window.addEventListener('resize', layoutCreatures);
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(layoutCreatures);
    [backdrop, journal, seafloor].filter(Boolean).forEach(element => observer.observe(element));
  }
  window.addEventListener('pagehide', () => { if (animation !== null) cancelAnimationFrame(animation); });
  window.addEventListener('pageshow', event => {
    const saved = readVisitScene();
    // A restored page should use the choice made on the most recently visited page.
    if (event.persisted && (saved === 'forest' || saved === 'underwater')) setScene(saved);
    else syncAnimation();
  });
  controls.hidden = false;
  setScene(root.dataset.scene);
})();
