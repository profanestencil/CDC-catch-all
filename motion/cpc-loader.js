/* Requires the bundled lottie.min.js (lottie-web 5.13.0, MIT). */
(function (global) {
  'use strict';
  function mount(host, options) {
    if (!host || !options || !options.animationData) throw new Error('A host and animationData are required.');
    if (!global.lottie) throw new Error('Load lottie.min.js before cpc-loader.js.');
    const container = document.createElement('div');
    container.className = 'cpc-loading-visual';
    container.setAttribute('aria-hidden', 'true');
    const status = document.createElement('span');
    status.className = 'cpc-loader-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.textContent = options.label || 'Loading CPC content…';
    host.append(container, status);
    const animation = global.lottie.loadAnimation({
      container, renderer: 'svg', loop: true, autoplay: false,
      animationData: JSON.parse(JSON.stringify(options.animationData)),
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false }
    });
    const reduced = global.matchMedia('(prefers-reduced-motion: reduce)');
    let stopped = false;
    let manuallyPaused = false;
    function update() {
      if (stopped) return;
      if (reduced.matches) animation.goToAndStop(0, true);
      else if (document.hidden || manuallyPaused) animation.pause();
      else animation.play();
    }
    animation.addEventListener('DOMLoaded', update);
    animation.addEventListener('data_failed', () => {
      stopped = true;
      container.replaceChildren();
      status.textContent = 'Loading content…';
    });
    document.addEventListener('visibilitychange', update);
    reduced.addEventListener('change', update);
    return {
      animation,
      pause() { manuallyPaused = true; update(); },
      resume() { manuallyPaused = false; update(); },
      complete(message = 'Content ready.') {
        stopped = true; animation.pause(); host.hidden = true; host.style.display = 'none';
        // Announce readiness with an existing live region in the surrounding application.
        if (options.onComplete) options.onComplete(message);
      },
      fail(message = 'Content could not load. Please try again.') {
        stopped = true; animation.goToAndStop(0, true); status.textContent = message;
      },
      destroy() {
        stopped = true;
        document.removeEventListener('visibilitychange', update);
        reduced.removeEventListener('change', update);
        animation.destroy(); container.remove(); status.remove(); host.hidden = false; host.style.removeProperty('display');
      }
    };
  }
  global.CPCLoader = { mount };
})(window);
