/* Page-entry loader using CPC Lottie assets. Never blocks real content. */
(function () {
  'use strict';

  const host = document.getElementById('cpc-page-loader');
  if (!host) {
    document.documentElement.classList.remove('is-loading');
    return;
  }

  const status = document.getElementById('page-status');
  const animationPath = host.dataset.animation || '/assets/lottie/CPC-cat-loader-light.json';
  let loader = null;
  let finished = false;

  function finish(message) {
    if (finished) return;
    finished = true;
    document.documentElement.classList.remove('is-loading');
    document.body.removeAttribute('aria-busy');
    if (loader) loader.complete(message || 'Content ready.');
    else {
      host.hidden = true;
      host.style.display = 'none';
    }
    if (status && message) status.textContent = message;
  }

  async function start() {
    document.body.setAttribute('aria-busy', 'true');
    try {
      if (!window.lottie || !window.CPCLoader) throw new Error('runtime missing');
      const response = await fetch(animationPath);
      if (!response.ok) throw new Error('asset unavailable');
      const animationData = await response.json();
      loader = window.CPCLoader.mount(host, {
        animationData,
        label: host.dataset.label || 'Loading CPC…',
        onComplete: message => {
          if (status) status.textContent = message;
        }
      });
    } catch {
      host.textContent = host.dataset.label || 'Loading CPC…';
    }

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', () => finish(), { once: true });
    setTimeout(() => finish(), 8000);
  }

  start();
})();
