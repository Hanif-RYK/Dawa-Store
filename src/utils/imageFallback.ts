// Neutral placeholder (pill icon on light grey) shown when a product photo fails
// to load, instead of the browser's broken-image icon and stray alt text. A stock
// photo would risk showing a different medicine, so this stays generic.
export const IMAGE_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
      '<rect width="120" height="120" fill="#f1f5f9"/>' +
      '<g transform="translate(36 36) rotate(45 24 24)" fill="none" stroke="#90a1b9" stroke-width="4">' +
      '<rect x="12" y="0" width="24" height="48" rx="12"/><line x1="12" y1="24" x2="36" y2="24"/>' +
      '</g></svg>',
  );

// One capture-phase listener covers every <img> in the app; error events don't bubble.
export const installImageFallback = () => {
  window.addEventListener(
    'error',
    (event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement) || img.dataset.fallback) return;
      img.dataset.fallback = 'true';
      img.src = IMAGE_PLACEHOLDER;
    },
    true,
  );
};
