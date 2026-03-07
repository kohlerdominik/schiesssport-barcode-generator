(function () {
  'use strict';

  // ======================== I18N ========================
  const TRANSLATIONS = {
    en: {
      appTitle: 'Barcode Generator',
      favorites: 'Favorites',
      noFavorites: 'No favorites saved yet',
      addFavorite: 'Favorite',
      removeFavorite: 'Remove favorite',
      removeFavoriteConfirm: 'Remove this favorite?',
      moveToTop: 'Move to top',
      loadFavorite: 'Load favorite',
      favoriteTitlePrompt: 'Enter a name for this favorite:',
      download: 'Download',
      copy: 'Copy',
      copiedToClipboard: 'Barcode copied to clipboard',
      copyFailed: 'Failed to copy barcode',
      downloadFailed: 'Failed to download barcode',
      invalidInput: 'Please enter valid input to generate a barcode',
      selectTemplate: 'Select barcode type',
      language: 'Language',
      english: 'English',
      german: 'Deutsch',
      collapseFavorites: 'Collapse favorites',
      expandFavorites: 'Expand favorites',
      cancel: 'Cancel',
      confirm: 'Confirm',
      ok: 'OK',
      share: 'Share',
      shareCopied: 'Share link copied to clipboard',
      shareFailed: 'Failed to copy share link',
      checksumError: 'Checksum calculation failed',
      storageError: 'Could not save to local storage',
    },
    de: {
      appTitle: 'Barcode Generator',
      favorites: 'Favoriten',
      noFavorites: 'Noch keine Favoriten gespeichert',
      addFavorite: 'Favorisieren',
      removeFavorite: 'Favorit entfernen',
      removeFavoriteConfirm: 'Diesen Favoriten entfernen?',
      moveToTop: 'Nach oben verschieben',
      loadFavorite: 'Favorit laden',
      favoriteTitlePrompt: 'Name für diesen Favoriten:',
      download: 'Herunterladen',
      copy: 'Kopieren',
      copiedToClipboard: 'Barcode in Zwischenablage kopiert',
      copyFailed: 'Barcode konnte nicht kopiert werden',
      downloadFailed: 'Herunterladen fehlgeschlagen',
      invalidInput: 'Bitte gültige Eingabe machen, um einen Barcode zu erzeugen',
      selectTemplate: 'Barcode-Typ wählen',
      language: 'Sprache',
      english: 'English',
      german: 'Deutsch',
      collapseFavorites: 'Favoriten einklappen',
      expandFavorites: 'Favoriten aufklappen',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      ok: 'OK',
      share: 'Teilen',
      shareCopied: 'Teilen-Link in Zwischenablage kopiert',
      shareFailed: 'Teilen-Link konnte nicht kopiert werden',
      checksumError: 'Prüfsummenberechnung fehlgeschlagen',
      storageError: 'Konnte nicht im lokalen Speicher speichern',
    },
  };

  // ======================== BARCODE CONFIGS ========================
  const BARCODE_CONFIGS = [
    {
      id: 'HitDisplayGeneric-Shooter',
      title: {
        en: 'Hit Display Shooter',
        de: 'Trefferanzeige Schütze',
      },
      description: {
        en: 'Barcode for identifying shooters on electronic target systems',
        de: 'Barcode-Format für elektronische Trefferanzeigesysteme',
      },
      pattern: '1LNNNNNNCC',
      segments: {
        1: { type: 'number', value: 1, fill: 'exact' },
        L: {
          type: 'option',
          input: true,
          label: { en: 'Legalization', de: 'Legalisierung' },
          options: [
            { value: 0, label: { en: 'All', de: 'Alle' } },
            { value: 1, label: { en: 'Veterans', de: 'Veteranen' } },
            { value: 2, label: { en: 'Juniors', de: 'Junioren' } },
          ],
        },
        N: { type: 'number', input: true, fill: 'left:0', label: { en: 'License Number', de: 'Lizenznummer' } },
        C: { type: 'checksum', algorithm: 'mod97weighted', source: '1LNNNNNN' },
      },
      barcodeOptions: {
        format: 'CODE128',
        width: 8,
        height: 200,
        displayValue: true,
      },
    },
    {
      id: 'HitDisplayGeneric-Programm',
      title: {
        en: 'Hit Display Program',
        de: 'Trefferanzeige Stich',
      },
      description: {
        en: 'Barcode for selecting programs on electronic target systems',
        de: 'Barcode-Format für elektronische Trefferanzeigesysteme',
      },
      pattern: '2LEEEPPPCC',
      segments: {
        2: { type: 'number', value: 2, fill: 'exact' },
        L: {
          type: 'option',
          input: true,
          label: { en: 'Legalization', de: 'Legalisierung' },
          options: [
            { value: 0, label: { en: 'All', de: 'Alle' } },
            { value: 1, label: { en: 'Veterans', de: 'Veteranen' } },
            { value: 2, label: { en: 'Juniors', de: 'Junioren' } },
          ],
        },
        E: { type: 'number', input: true, fill: 'left:0', label: { en: 'Billing Program Number', de: 'Stichnummer Abrechnung' } },
        P: { type: 'number', input: true, fill: 'left:0', label: { en: 'Display Program Number', de: 'Stichnummer Trefferanzeige' } },
        C: { type: 'checksum', algorithm: 'mod97weighted', source: '2LEEEPPP' },
      },
      barcodeOptions: {
        format: 'CODE128',
        width: 8,
        height: 200,
        displayValue: true,
      },
    },
    {
      id: 'HitDisplaySintro-CodeSelect',
      title: {
        en: 'Hit Display Sintro | Select Code',
        de: 'Trefferanzeige Sintro | Code auswählen',
      },
      description: {
        en: 'Select a predefined Sintro barcode from a list',
        de: 'Barcode-Format für elektronische Trefferanzeigesysteme',
      },
      pattern: 'NNNN',
      segments: {
        N: {
          type: 'option',
          input: true,
          fill: 'left:0',
          label: { en: 'Sintro Code', de: 'Sintro Code' },
          options: [
            { value: 1, label: { en: 'One', de: 'Eins' } },
            { value: 2, label: { en: 'Two', de: 'Zwei' } },
            { value: 3, label: { en: 'Three', de: 'Drei' } },
          ],
        },
      },
      barcodeOptions: {
        format: 'CODE128',
        width: 8,
        height: 200,
        displayValue: true,
      },
    },
    {
      id: 'HitDisplaySintro-CodeText',
      title: {
        en: 'Hit Display Sintro | Enter Code',
        de: 'Trefferanzeige Sintro | Code eingeben',
      },
      description: {
        en: 'Enter a custom Sintro barcode value',
        de: 'Barcode-Format für elektronische Trefferanzeigesysteme',
      },
      pattern: 'NNNN',
      segments: {
        N: { type: 'text', input: true, fill: 'left:0', label: { en: 'Sintro Code', de: 'Sintro Code' } },
      },
      barcodeOptions: {
        format: 'CODE128',
        width: 8,
        height: 200,
        displayValue: true,
      },
    },
  ];

  // ======================== CHECKSUM ALGORITHMS ========================
  const CHECKSUM_ALGORITHMS = {
    mod97weighted(sourceValue) {
      const num = parseInt(sourceValue, 10);
      if (isNaN(num)) return null;
      return (((num * -3) % 97) + 97) % 97;
    },
  };

  // ======================== PATTERN PARSER ========================
  function parsePattern(config) {
    const { pattern, segments } = config;
    const parsed = [];
    let i = 0;
    while (i < pattern.length) {
      const char = pattern[i];
      let length = 0;
      while (i < pattern.length && pattern[i] === char) {
        length++;
        i++;
      }
      const segConfig = segments[char];
      if (!segConfig) {
        throw new Error(`Segment "${char}" not defined in segments`);
      }
      parsed.push({ char, length, config: { ...segConfig } });
    }
    return parsed;
  }

  // ======================== FILL LOGIC ========================
  function applyFill(value, length, fill) {
    if (!fill) fill = 'left:0';

    if (fill === 'exact') {
      return value.length === length ? value : null;
    }
    if (fill === 'shorten') {
      return value.length <= length ? value : null;
    }

    const match = fill.match(/^(left|right):(.*)$/);
    if (!match) return value.padStart(length, '0');

    const direction = match[1];
    const fillChar = match[2];

    if (value.length > length) return null;
    if (direction === 'left') {
      return value.padStart(length, fillChar);
    } else {
      return value.padEnd(length, fillChar);
    }
  }

  // ======================== VALIDATION ========================
  function validateSegmentInput(value, segConfig) {
    if (!value && value !== '') return false;

    switch (segConfig.type) {
      case 'letter':
        if (!/^[A-Za-z]*$/.test(value)) return false;
        break;
      case 'number':
        if (!/^[0-9]*$/.test(value)) return false;
        break;
      case 'text':
        break;
      case 'option':
        break;
    }

    if (segConfig.validation) {
      const regex = new RegExp(segConfig.validation);
      if (value.length > 0 && !regex.test(value)) return false;
    }

    return true;
  }

  // ======================== RESOLVE SOURCE ========================
  function resolveSource(sourcePattern, parsedSegments, segmentValues) {
    let result = '';
    let pos = 0;
    for (let si = 0; si < parsedSegments.length && pos < sourcePattern.length; si++) {
      const seg = parsedSegments[si];
      const sourceChunk = sourcePattern.substring(pos, pos + seg.length);
      if (sourceChunk === seg.char.repeat(seg.length)) {
        result += segmentValues[si] || '';
        pos += seg.length;
      }
    }
    return result;
  }

  // ======================== JSBARCODE LOADER ========================
  function ensureJsBarcode() {
    return new Promise((resolve, reject) => {
      if (typeof JsBarcode !== 'undefined') {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load JsBarcode'));
      document.head.appendChild(script);
    });
  }

  // ======================== COMPONENT STYLES ========================
  const STYLES = `
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      color: #1e293b;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --primary-light: #dbeafe;
      --bg: #f1f5f9;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text: #1e293b;
      --text-muted: #64748b;
      --success: #22c55e;
      --error: #ef4444;
      --warning: #f59e0b;
      --radius: 8px;
      --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
      --shadow-lg: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    .app {
      min-height: 100vh;
      background: var(--bg);
      padding-bottom: 2rem;
    }

    /* Header */
    header {
      background: var(--primary);
      color: #ffffff;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: var(--shadow-lg);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    header h1 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .lang-select {
      background: rgba(255,255,255,0.15);
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: var(--radius);
      padding: 0.35rem 0.5rem;
      font-size: 0.8125rem;
      cursor: pointer;
      outline: none;
    }

    .lang-select:focus {
      border-color: rgba(255,255,255,0.6);
    }

    .lang-select option {
      background: var(--card-bg);
      color: var(--text);
    }

    /* Main container */
    .container {
      max-width: 640px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    /* Favorites Drawer */
    .favorites-drawer {
      background: var(--card-bg);
      margin: 1rem 0;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid var(--border);
    }

    .drawer-header h2 {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .drawer-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      color: var(--text-muted);
      font-size: 1rem;
      line-height: 1;
      transition: transform 0.2s;
    }

    .drawer-toggle.collapsed {
      transform: rotate(180deg);
    }

    .drawer-content {
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .drawer-content.collapsed {
      max-height: 0 !important;
    }

    .favorites-list {
      padding: 0.5rem;
    }

    .favorite-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.625rem;
      border-radius: calc(var(--radius) - 2px);
      cursor: pointer;
      transition: background 0.15s;
    }

    .favorite-item:hover {
      background: var(--bg);
    }

    .favorite-item .fav-title {
      flex: 1;
      font-size: 0.875rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .favorite-item .fav-value {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: 'SF Mono', 'Fira Code', monospace;
    }

    .fav-actions {
      display: flex;
      gap: 0.125rem;
      flex-shrink: 0;
    }

    .fav-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      color: var(--text-muted);
      font-size: 0.875rem;
      line-height: 1;
      transition: background 0.15s, color 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
    }

    .fav-btn:hover {
      background: var(--border);
      color: var(--text);
    }

    .fav-btn.remove:hover {
      color: var(--error);
    }

    .no-favorites {
      padding: 1rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.8125rem;
    }

    /* Template selector */
    .template-selector {
      margin: 1rem 0;
    }

    .template-selector select {
      width: 100%;
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 0.9375rem;
      background: var(--card-bg);
      color: var(--text);
      cursor: pointer;
      outline: none;
    }

    .template-selector select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }

    .template-selector.hidden {
      display: none;
    }

    /* Template info */
    .template-info {
      margin: 1rem 0;
    }

    .template-info h2 {
      margin: 0 0 0.25rem;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .template-info p {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    /* Barcode container */
    .barcode-container {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 1.5rem;
      margin: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 190px;
      position: relative;
    }

    .barcode-container canvas {
      max-width: 100%;
      height: auto;
    }

    .barcode-invalid {
      display: none;
      color: var(--text-muted);
      font-size: 0.875rem;
      text-align: center;
      padding: 2rem 1rem;
    }

    .barcode-invalid.visible {
      display: block;
    }

    .barcode-container canvas.hidden {
      display: none;
    }

    /* Action buttons */
    .barcode-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding: 0.625rem;
      border-radius: var(--radius);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, box-shadow 0.15s;
      border: 1px solid var(--border);
      background: var(--card-bg);
      color: var(--text);
    }

    .btn span {
      display: none;
    }

    .btn:hover {
      background: var(--bg);
      box-shadow: var(--shadow);
    }

    .btn:active {
      transform: scale(0.98);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }

    .btn-primary:hover {
      background: var(--primary-hover);
    }

    .btn svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    /* Input fields */
    .input-fields {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 1rem;
      margin: 1rem 0;
    }

    .input-group {
      margin-bottom: 0.75rem;
    }

    .input-group:last-child {
      margin-bottom: 0;
    }

    .input-label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .input-field {
      width: 100%;
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 1rem;
      font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
      color: var(--text);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .input-field:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }

    .input-field.invalid {
      border-color: var(--error);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .input-field-select {
      width: 100%;
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 1rem;
      color: var(--text);
      background: var(--card-bg);
      cursor: pointer;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .input-field-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }

    /* Toast notifications */
    .toast-container {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
      width: calc(100% - 2rem);
      max-width: 400px;
    }

    .toast {
      background: var(--text);
      color: #ffffff;
      padding: 0.75rem 1rem;
      border-radius: var(--radius);
      font-size: 0.875rem;
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      pointer-events: auto;
      animation: toast-in 0.3s ease;
    }

    .toast.toast-success {
      background: #166534;
    }

    .toast.toast-error {
      background: #991b1b;
    }

    .toast.toast-warning {
      background: #92400e;
    }

    .toast.toast-out {
      animation: toast-out 0.2s ease forwards;
    }

    .toast-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      padding: 0.125rem;
      font-size: 1rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .toast-close:hover {
      color: #ffffff;
    }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(1rem); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes toast-out {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(1rem); }
    }

    /* Confirm dialog */
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .dialog {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      padding: 1.5rem;
      max-width: 320px;
      width: 100%;
    }

    .dialog p {
      margin: 0 0 1rem;
      font-size: 0.9375rem;
    }

    .dialog-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .dialog-btn {
      padding: 0.5rem 1rem;
      border-radius: var(--radius);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--card-bg);
      color: var(--text);
      transition: background 0.15s;
    }

    .dialog-btn:hover {
      background: var(--bg);
    }

    .dialog-btn.danger {
      background: var(--error);
      color: #ffffff;
      border-color: var(--error);
    }

    .dialog-btn.danger:hover {
      background: #dc2626;
    }

    /* Prompt dialog */
    .dialog input[type="text"] {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 0.9375rem;
      margin-bottom: 1rem;
      outline: none;
    }

    .dialog input[type="text"]:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }

    /* Responsive - tablet and desktop */
    @media (min-width: 768px) {
      .container {
        max-width: 720px;
      }

      .barcode-container {
        padding: 2rem;
        min-height: 190px;
      }

      .input-fields {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.75rem;
      }

      .input-group {
        margin-bottom: 0;
      }

      .btn span {
        display: inline;
      }

      .btn {
        padding: 0.625rem 1rem;
      }
    }
  `;

  // ======================== SVG ICONS ========================
  const ICONS = {
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    starFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    chevronUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  };

  // ======================== WEB COMPONENT ========================
  class BarcodeGenerator extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this._lang = 'en';
      this._configs = BARCODE_CONFIGS;
      this._activeConfigIndex = 0;
      this._parsedSegments = [];
      this._inputValues = {};
      this._favorites = [];
      this._drawerOpen = false;
      this._barcodeValid = false;
      this._ready = false;
    }

    connectedCallback() {
      this._loadPreferences();
      this._loadFavorites();
      this._drawerOpen = this._favorites.length > 0;
      this._loadFromURL();

      ensureJsBarcode()
        .then(() => {
          this._ready = true;
          this._parseCurrentConfig();
          this._render();
          this._bindEvents();
          this._generateBarcode();
        })
        .catch((err) => {
          this.shadowRoot.innerHTML = `<p style="color:red;padding:1rem;">Failed to load barcode library: ${err.message}</p>`;
        });
    }

    // ---- I18n ----
    _t(key) {
      const trans = TRANSLATIONS[this._lang] || TRANSLATIONS.en;
      return trans[key] || TRANSLATIONS.en[key] || key;
    }

    _localized(obj) {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      return obj[this._lang] || obj.en || Object.values(obj)[0] || '';
    }

    // ---- Preferences ----
    _loadPreferences() {
      try {
        const lang = localStorage.getItem('barcode-gen-lang');
        if (lang && TRANSLATIONS[lang]) {
          this._lang = lang;
        } else {
          const browserLangs = navigator.languages || [navigator.language];
          for (const bl of browserLangs) {
            const code = bl.split('-')[0].toLowerCase();
            if (TRANSLATIONS[code]) {
              this._lang = code;
              break;
            }
          }
        }

        const lastConfig = localStorage.getItem('barcode-gen-last-config');
        if (lastConfig !== null) {
          const idx = parseInt(lastConfig, 10);
          if (idx >= 0 && idx < this._configs.length) {
            this._activeConfigIndex = idx;
          }
        }
      } catch (e) {
        // localStorage unavailable
      }
    }

    _savePreferences() {
      try {
        localStorage.setItem('barcode-gen-lang', this._lang);
        localStorage.setItem('barcode-gen-last-config', String(this._activeConfigIndex));
      } catch (e) {
        this._showToast(this._t('storageError'), 'error');
      }
    }

    _loadFromURL() {
      try {
        const params = new URLSearchParams(window.location.search);
        const configId = params.get('config');
        if (!configId) return;
        const idx = this._configs.findIndex((c) => c.id === configId);
        if (idx < 0) return;
        this._activeConfigIndex = idx;
        this._parseCurrentConfig();
        let vi = 0;
        let hasValues = false;
        this._parsedSegments.forEach((seg, i) => {
          if (seg.config.input) {
            const val = params.get(`v[${vi}]`);
            if (val !== null) {
              this._inputValues[`seg_${i}`] = val;
              hasValues = true;
            }
            vi++;
          }
        });
      } catch (e) {
        // ignore malformed URLs
      }
    }

    // ---- Favorites ----
    _loadFavorites() {
      try {
        const data = localStorage.getItem('barcode-gen-favorites');
        if (data) {
          this._favorites = JSON.parse(data);
        }
      } catch (e) {
        this._favorites = [];
      }
    }

    _saveFavorites() {
      try {
        localStorage.setItem('barcode-gen-favorites', JSON.stringify(this._favorites));
      } catch (e) {
        this._showToast(this._t('storageError'), 'error');
      }
    }

    // ---- Config parsing ----
    _parseCurrentConfig() {
      const config = this._configs[this._activeConfigIndex];
      this._parsedSegments = parsePattern(config);

      // Initialize input values for input segments
      const newInputValues = {};
      this._parsedSegments.forEach((seg, i) => {
        if (seg.config.input) {
          const key = `seg_${i}`;
          // Preserve existing value if same key exists
          if (this._inputValues[key] !== undefined) {
            newInputValues[key] = this._inputValues[key];
          } else if (seg.config.type === 'option' && seg.config.options && seg.config.options.length > 0) {
            newInputValues[key] = String(seg.config.options[0].value);
          } else if (seg.config.value !== undefined) {
            newInputValues[key] = seg.config.value;
          } else {
            newInputValues[key] = '';
          }
        }
      });
      this._inputValues = newInputValues;
    }

    // ---- Build barcode value ----
    _buildBarcodeValue() {
      const config = this._configs[this._activeConfigIndex];
      const segmentValues = [];
      let hasEmptyInput = false;
      let hasInvalidInput = false;

      // First pass: resolve non-checksum segments
      this._parsedSegments.forEach((seg, i) => {
        if (seg.config.type === 'checksum') {
          segmentValues.push(null); // placeholder
          return;
        }

        let value;
        if (seg.config.input) {
          value = this._inputValues[`seg_${i}`];
          value = (value !== undefined && value !== null) ? String(value) : '';
        } else {
          value = (seg.config.value !== undefined && seg.config.value !== null) ? String(seg.config.value) : '';
        }

        // Validate input type
        if (seg.config.input && !validateSegmentInput(value, seg.config)) {
          hasInvalidInput = true;
          console.warn(`[barcode] Segment '${seg.char}' (index ${i}): validation failed for value '${value}'`);
          segmentValues.push('');
          return;
        }

        if (seg.config.input && value === '') {
          hasEmptyInput = true;
        }

        // Apply fill
        const filled = applyFill(value, seg.length, seg.config.fill);
        if (filled === null) {
          hasInvalidInput = true;
          console.warn(`[barcode] Segment '${seg.char}' (index ${i}): fill '${seg.config.fill}' failed for value '${value}' (expected length ${seg.length})`);
          segmentValues.push('');
        } else {
          segmentValues.push(filled);
        }
      });

      if (hasInvalidInput || hasEmptyInput) {
        return null;
      }

      // Second pass: resolve checksum segments
      this._parsedSegments.forEach((seg, i) => {
        if (seg.config.type !== 'checksum') return;

        const sourceValue = resolveSource(seg.config.source, this._parsedSegments, segmentValues);
        const algorithm = CHECKSUM_ALGORITHMS[seg.config.algorithm];
        if (!algorithm) {
          hasInvalidInput = true;
          console.error(`[barcode] Segment '${seg.char}' (index ${i}): unknown checksum algorithm '${seg.config.algorithm}'`);
          segmentValues[i] = '';
          return;
        }

        const checksum = algorithm(sourceValue);
        if (checksum === null || checksum === undefined) {
          hasInvalidInput = true;
          console.warn(`[barcode] Segment '${seg.char}' (index ${i}): checksum returned ${checksum} for source '${sourceValue}'`);
          segmentValues[i] = '';
          return;
        }

        const checksumStr = String(checksum);
        const filled = applyFill(checksumStr, seg.length, 'left:0');
        segmentValues[i] = filled || '';
      });

      if (hasInvalidInput) return null;

      return segmentValues.join('');
    }

    // ---- Render ----
    _render() {
      const config = this._configs[this._activeConfigIndex];

      this.shadowRoot.innerHTML = `
        <style>${STYLES}</style>
        <div class="app">
          <div class="toast-container"></div>

          <header>
            <h1>${this._t('appTitle')}</h1>
            <div class="header-actions">
              <select class="lang-select" aria-label="${this._t('language')}">
                <option value="en" ${this._lang === 'en' ? 'selected' : ''}>EN</option>
                <option value="de" ${this._lang === 'de' ? 'selected' : ''}>DE</option>
              </select>
            </div>
          </header>

          <div class="container">
            ${this._renderFavoritesDrawer()}

            <div class="template-selector">
              <select class="template-select" aria-label="${this._t('selectTemplate')}">
                ${this._configs.map((c, i) => `<option value="${i}" ${i === this._activeConfigIndex ? 'selected' : ''}>${this._localized(c.title)}</option>`).join('')}
              </select>
            </div>

            <div class="template-info">
              <p>${this._localized(config.description)}</p>
            </div>

            <div class="barcode-container">
              <canvas class="barcode-canvas hidden"></canvas>
              <div class="barcode-invalid visible">${this._t('invalidInput')}</div>
            </div>

            <div class="barcode-actions">
              <button class="btn" id="btn-fav" title="${this._t('addFavorite')}">
                ${ICONS.star}
                <span>${this._t('addFavorite')}</span>
              </button>
              <button class="btn" id="btn-download" disabled>
                ${ICONS.download}
                <span>${this._t('download')}</span>
              </button>
              <button class="btn" id="btn-copy" disabled>
                ${ICONS.copy}
                <span>${this._t('copy')}</span>
              </button>
              <button class="btn" id="btn-share" disabled>
                ${ICONS.share}
                <span>${this._t('share')}</span>
              </button>
            </div>

            <div class="input-fields">
              ${this._renderInputFields()}
            </div>
          </div>
        </div>
      `;
    }

    _renderFavoritesDrawer() {
      const isOpen = this._drawerOpen;
      return `
        <div class="favorites-drawer">
          <div class="drawer-header" role="button" tabindex="0" aria-expanded="${isOpen}" aria-label="${isOpen ? this._t('collapseFavorites') : this._t('expandFavorites')}">
            <h2>${ICONS.starFilled} ${this._t('favorites')}</h2>
            <button class="drawer-toggle ${isOpen ? '' : 'collapsed'}" aria-hidden="true">${ICONS.chevronUp}</button>
          </div>
          <div class="drawer-content ${isOpen ? '' : 'collapsed'}" style="max-height: ${isOpen ? '400px' : '0'}">
            ${this._favorites.length === 0
              ? `<div class="no-favorites">${this._t('noFavorites')}</div>`
              : `<div class="favorites-list">${this._favorites.map((fav, i) => this._renderFavoriteItem(fav, i)).join('')}</div>`
            }
          </div>
        </div>
      `;
    }

    _renderFavoriteItem(fav, index) {
      return `
        <div class="favorite-item" data-fav-index="${index}">
          <span class="fav-title">${this._escapeHtml(fav.title)}</span>
          <span class="fav-value">${this._escapeHtml(fav.barcodeValue || '')}</span>
          <div class="fav-actions">
            <button class="fav-btn move-top" data-fav-index="${index}" title="${this._t('moveToTop')}">${ICONS.arrowUp}</button>
            <button class="fav-btn remove" data-fav-index="${index}" title="${this._t('removeFavorite')}">${ICONS.x}</button>
          </div>
        </div>
      `;
    }

    _renderInputFields() {
      const fields = [];
      this._parsedSegments.forEach((seg, i) => {
        if (!seg.config.input) return;

        const key = `seg_${i}`;
        const value = this._inputValues[key] || '';

        if (seg.config.type === 'option') {
          const options = seg.config.options || [];
          fields.push(`
            <div class="input-group">
              <label class="input-label" for="input-${key}">${this._getSegmentLabel(seg)}</label>
              <select class="input-field-select" id="input-${key}" data-seg-index="${i}">
                ${options.map(opt => `<option value="${this._escapeAttr(opt.value)}" ${String(opt.value) === String(value) ? 'selected' : ''}>${this._localized(opt.label)}</option>`).join('')}
              </select>
            </div>
          `);
        } else {
          const inputType = seg.config.type === 'number' ? 'tel' : 'text';
          const pattern = seg.config.type === 'number' ? '[0-9]*' : (seg.config.type === 'letter' ? '[A-Za-z]*' : undefined);
          const inputMode = seg.config.type === 'number' ? 'numeric' : 'text';

          fields.push(`
            <div class="input-group">
              <label class="input-label" for="input-${key}">${this._getSegmentLabel(seg)}</label>
              <input
                class="input-field"
                type="${inputType}"
                id="input-${key}"
                data-seg-index="${i}"
                maxlength="${seg.length}"
                value="${this._escapeAttr(value)}"
                inputmode="${inputMode}"
                ${pattern ? `pattern="${pattern}"` : ''}
                autocomplete="off"
              />
            </div>
          `);
        }
      });
      return fields.join('');
    }

    _getSegmentLabel(seg) {
      if (seg.config.label) return this._localized(seg.config.label);
      const typeLabels = {
        en: { text: 'Text', letter: 'Letters', number: 'Number', option: 'Option' },
        de: { text: 'Text', letter: 'Buchstaben', number: 'Nummer', option: 'Option' },
      };
      const labels = typeLabels[this._lang] || typeLabels.en;
      return labels[seg.config.type] || seg.config.type;
    }

    // ---- Event binding ----
    _bindEvents() {
      const root = this.shadowRoot;

      // Language select
      root.querySelector('.lang-select').addEventListener('change', (e) => {
        this._lang = e.target.value;
        this._savePreferences();
        this._render();
        this._bindEvents();
        this._generateBarcode();
      });

      // Template select
      const templateSelect = root.querySelector('.template-select');
      if (templateSelect) {
        templateSelect.addEventListener('change', (e) => {
          this._activeConfigIndex = parseInt(e.target.value, 10);
          this._inputValues = {};
          this._parseCurrentConfig();
          this._savePreferences();
          this._render();
          this._bindEvents();
          this._generateBarcode();
        });
      }

      // Input fields
      root.querySelectorAll('.input-field').forEach((input) => {
        input.addEventListener('input', (e) => {
          const segIndex = parseInt(e.target.dataset.segIndex, 10);
          const seg = this._parsedSegments[segIndex];
          let val = e.target.value;

          // Filter invalid characters
          if (seg.config.type === 'number') {
            val = val.replace(/[^0-9]/g, '');
          } else if (seg.config.type === 'letter') {
            val = val.replace(/[^A-Za-z]/g, '');
          }

          // Enforce maxlength
          if (val.length > seg.length) {
            val = val.substring(0, seg.length);
          }

          e.target.value = val;
          this._inputValues[`seg_${segIndex}`] = val;
          this._generateBarcode();
        });
      });

      // Option selects
      root.querySelectorAll('.input-field-select').forEach((select) => {
        select.addEventListener('change', (e) => {
          const segIndex = parseInt(e.target.dataset.segIndex, 10);
          this._inputValues[`seg_${segIndex}`] = e.target.value;
          this._generateBarcode();
        });
      });

      // Favorite
      root.querySelector('#btn-fav').addEventListener('click', () => {
        this._promptAddFavorite();
      });

      // Download
      root.querySelector('#btn-download').addEventListener('click', () => {
        this._downloadPNG();
      });

      // Copy
      root.querySelector('#btn-copy').addEventListener('click', () => {
        this._copyToClipboard();
      });

      // Share
      root.querySelector('#btn-share').addEventListener('click', () => {
        this._shareURL();
      });

      // Drawer toggle
      const drawerHeader = root.querySelector('.drawer-header');
      if (drawerHeader) {
        drawerHeader.addEventListener('click', () => {
          this._drawerOpen = !this._drawerOpen;
          const content = root.querySelector('.drawer-content');
          const toggle = root.querySelector('.drawer-toggle');
          if (this._drawerOpen) {
            content.classList.remove('collapsed');
            content.style.maxHeight = '400px';
            toggle.classList.remove('collapsed');
            drawerHeader.setAttribute('aria-expanded', 'true');
          } else {
            content.classList.add('collapsed');
            content.style.maxHeight = '0';
            toggle.classList.add('collapsed');
            drawerHeader.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Favorite item click (load)
      root.querySelectorAll('.favorite-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          // Don't load if clicking action buttons
          if (e.target.closest('.fav-actions')) return;
          const index = parseInt(item.dataset.favIndex, 10);
          this._loadFavorite(index);
        });
      });

      // Favorite move to top
      root.querySelectorAll('.fav-btn.move-top').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(btn.dataset.favIndex, 10);
          this._moveFavoriteToTop(index);
        });
      });

      // Favorite remove
      root.querySelectorAll('.fav-btn.remove').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(btn.dataset.favIndex, 10);
          this._confirmRemoveFavorite(index);
        });
      });
    }

    // ---- Barcode generation ----
    _generateBarcode() {
      const value = this._buildBarcodeValue();
      const canvas = this.shadowRoot.querySelector('.barcode-canvas');
      const invalid = this.shadowRoot.querySelector('.barcode-invalid');
      const btnDownload = this.shadowRoot.querySelector('#btn-download');
      const btnCopy = this.shadowRoot.querySelector('#btn-copy');

      const btnShare = this.shadowRoot.querySelector('#btn-share');

      if (!value) {
        this._barcodeValid = false;
        canvas.classList.add('hidden');
        invalid.classList.add('visible');
        btnDownload.disabled = true;
        btnCopy.disabled = true;
        btnShare.disabled = true;
        return;
      }

      const config = this._configs[this._activeConfigIndex];
      const options = {
        format: 'CODE128',
        width: 2,
        height: 100,
        displayValue: true,
        margin: 10,
        ...(config.barcodeOptions || {}),
      };

      try {
        JsBarcode(canvas, value, options);
        canvas.style.width = (canvas.width / 2) + 'px';
        canvas.style.height = (canvas.height / 2) + 'px';
        this._barcodeValid = true;
        canvas.classList.remove('hidden');
        invalid.classList.remove('visible');
        btnDownload.disabled = false;
        btnCopy.disabled = false;
        btnShare.disabled = false;
      } catch (err) {
        this._barcodeValid = false;
        canvas.classList.add('hidden');
        invalid.classList.add('visible');
        btnDownload.disabled = true;
        btnCopy.disabled = true;
        btnShare.disabled = true;
      }
    }

    // ---- Export ----
    _downloadPNG() {
      const canvas = this.shadowRoot.querySelector('.barcode-canvas');
      if (!canvas || !this._barcodeValid) return;

      try {
        const link = document.createElement('a');
        const value = this._buildBarcodeValue() || 'barcode';
        link.download = `barcode-${value}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        this._showToast(this._t('downloadFailed'), 'error');
      }
    }

    async _copyToClipboard() {
      const canvas = this.shadowRoot.querySelector('.barcode-canvas');
      if (!canvas || !this._barcodeValid) return;

      try {
        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
        });
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        this._showToast(this._t('copiedToClipboard'), 'success');
      } catch (err) {
        this._showToast(this._t('copyFailed'), 'error');
      }
    }

    async _shareURL() {
      if (!this._barcodeValid) return;
      const config = this._configs[this._activeConfigIndex];
      const params = new URLSearchParams();
      params.set('config', config.id);
      let vi = 0;
      this._parsedSegments.forEach((seg, i) => {
        if (seg.config.input) {
          params.set(`v[${vi}]`, this._inputValues[`seg_${i}`] || '');
          vi++;
        }
      });
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

      try {
        await navigator.clipboard.writeText(url);
        this._showToast(this._t('shareCopied'), 'success');
      } catch (err) {
        this._showToast(this._t('shareFailed'), 'error');
      }
    }

    // ---- Favorites operations ----
    _promptAddFavorite() {
      if (!this._barcodeValid) {
        this._showToast(this._t('invalidInput'), 'warning');
        return;
      }

      const value = this._buildBarcodeValue() || '';
      this._showPromptDialog(this._t('favoriteTitlePrompt'), value, (title) => {
        if (!title) return;
        const fav = {
          title,
          configIndex: this._activeConfigIndex,
          inputValues: { ...this._inputValues },
          barcodeValue: value,
          timestamp: Date.now(),
        };
        this._favorites.unshift(fav);
        this._saveFavorites();
        this._drawerOpen = true;
        this._render();
        this._bindEvents();
        this._generateBarcode();
      });
    }

    _loadFavorite(index) {
      const fav = this._favorites[index];
      if (!fav) return;

      this._activeConfigIndex = fav.configIndex;
      this._parseCurrentConfig();
      this._inputValues = { ...fav.inputValues };
      this._savePreferences();
      this._render();
      this._bindEvents();
      this._generateBarcode();
    }

    _moveFavoriteToTop(index) {
      if (index <= 0) return;
      const fav = this._favorites.splice(index, 1)[0];
      this._favorites.unshift(fav);
      this._saveFavorites();
      this._render();
      this._bindEvents();
      this._generateBarcode();
    }

    _confirmRemoveFavorite(index) {
      this._showConfirmDialog(this._t('removeFavoriteConfirm'), () => {
        this._favorites.splice(index, 1);
        this._saveFavorites();
        this._render();
        this._bindEvents();
        this._generateBarcode();
      });
    }

    // ---- Dialogs ----
    _showConfirmDialog(message, onConfirm) {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';
      overlay.innerHTML = `
        <div class="dialog">
          <p>${this._escapeHtml(message)}</p>
          <div class="dialog-actions">
            <button class="dialog-btn cancel">${this._t('cancel')}</button>
            <button class="dialog-btn danger confirm">${this._t('confirm')}</button>
          </div>
        </div>
      `;

      const close = () => overlay.remove();
      overlay.querySelector('.cancel').addEventListener('click', close);
      overlay.querySelector('.confirm').addEventListener('click', () => {
        close();
        onConfirm();
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });

      this.shadowRoot.querySelector('.app').appendChild(overlay);
      overlay.querySelector('.confirm').focus();
    }

    _showPromptDialog(message, defaultValue, onSubmit) {
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';
      overlay.innerHTML = `
        <div class="dialog">
          <p>${this._escapeHtml(message)}</p>
          <input type="text" class="prompt-input" value="${this._escapeAttr(defaultValue)}" />
          <div class="dialog-actions">
            <button class="dialog-btn cancel">${this._t('cancel')}</button>
            <button class="dialog-btn dialog-btn-primary confirm" style="background:var(--primary);color:#fff;border-color:var(--primary);">${this._t('ok')}</button>
          </div>
        </div>
      `;

      const input = overlay.querySelector('.prompt-input');
      const close = () => overlay.remove();

      overlay.querySelector('.cancel').addEventListener('click', close);
      overlay.querySelector('.confirm').addEventListener('click', () => {
        const val = input.value.trim();
        close();
        onSubmit(val);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = input.value.trim();
          close();
          onSubmit(val);
        }
        if (e.key === 'Escape') close();
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });

      this.shadowRoot.querySelector('.app').appendChild(overlay);
      input.focus();
      input.select();
    }

    // ---- Toast ----
    _showToast(message, type = 'info') {
      const container = this.shadowRoot.querySelector('.toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <span>${this._escapeHtml(message)}</span>
        <button class="toast-close" aria-label="Close">${ICONS.x}</button>
      `;

      const dismiss = () => {
        toast.classList.add('toast-out');
        toast.addEventListener('animationend', () => toast.remove());
      };

      toast.querySelector('.toast-close').addEventListener('click', dismiss);
      container.appendChild(toast);

      setTimeout(dismiss, 4000);
    }

    // ---- Helpers ----
    _escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    _escapeAttr(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }

  customElements.define('barcode-generator', BarcodeGenerator);
})();
