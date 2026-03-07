# Sport Shooting Barcode Generator

A web-based barcode generator for sport shooting use cases — license numbers, membership cards, competition entries, and more. Generates CODE_128 barcodes with configurable patterns and automatic checksum calculation.

## Features

- **Real-time barcode generation** — barcodes update as you type
- **Multiple barcode templates** — hit display (Generic / Sintro), with more to come
- **Automatic checksum** — mod97weighted checksum calculation
- **Favorites** — save, reorder, and quickly reload frequently used barcodes
- **Share via URL** — share barcode configurations as a link with query parameters
- **Export** — download as high-resolution PNG or copy to clipboard
- **Offline capable** — works without internet after first load (PWA with Service Worker)
- **Multi-language** — English and German, with language preference persistence
- **Mobile-first** — responsive design for phones, tablets, and desktop
- **Embeddable** — self-contained Web Component with Shadow DOM

## Getting Started

No build tools or dependencies required. Open `index.html` directly in your browser to use the app.

## Embedding in Other Websites

The barcode generator is a self-contained Web Component that can be embedded in any website:

```html
<script src="https://your-domain.com/lib/JsBarcode.all.min.js"></script>
<script src="https://your-domain.com/barcode-generator.js"></script>
<barcode-generator></barcode-generator>
```

Shadow DOM isolates styles, so it won't conflict with the host page.

## Sharing Barcodes via URL

Click the **Share** button to copy a URL encoding the current barcode config and input values. Parameters use indexed array notation:

```
https://example.com/?config=HitDisplayGeneric-Shooter&v[0]=0&v[1]=123456
https://example.com/?config=HitDisplayGeneric-Programm&v[0]=0&v[1]=100&v[2]=200
```

Parameters:
- `config` — barcode template ID
- `v[0]`, `v[1]`, ... — indexed value for each input segment, in order of appearance

## Adding New Barcode Templates

Edit `BARCODE_CONFIGS` in [barcode-generator.js](barcode-generator.js). Each template is a JSON object:

```js
{
  id: 'my-template',                          // unique ID (used in share URLs)
  title: { en: 'My Template', de: '...' },    // localized title
  description: { en: '...', de: '...' },      // localized description
  pattern: '2LEEEPPPCC',                       // pattern string
  segments: {
    2: { type: 'number', value: 2, fill: 'exact' },
    L: {
      type: 'option',
      input: true,
      label: { en: 'Category', de: 'Kategorie' },
      options: [
        { value: 0, label: { en: 'All', de: 'Alle' } },
        { value: 1, label: { en: 'Veterans', de: 'Veteranen' } },
      ],
    },
    E: { type: 'number', input: true, fill: 'left:0', label: { en: 'Billing Number', de: 'Abrechnungsnr.' } },
    P: { type: 'number', input: true, fill: 'left:0', label: { en: 'Display Number', de: 'Anzeigenr.' } },
    C: { type: 'checksum', algorithm: 'mod97weighted', source: '2LEEEPPP' },
  },
  barcodeOptions: { format: 'CODE128', width: 8, height: 200, displayValue: true },
}
```

### Pattern Syntax

Each unique character in the pattern maps to a segment definition. Repeated characters define the segment length:
- `PP` → segment `P`, length 2
- `EEE` → segment `E`, length 3
- `CC` → segment `C`, length 2

The total barcode length is the sum of all segment lengths.

### Segment Types

Five segment types are available. Each type supports a specific set of properties:

#### Property Reference

| Property | Type | Applies to | Description |
|---|---|---|---|
| `type` | `string` | all | **Required.** One of `"text"`, `"letter"`, `"number"`, `"option"`, `"checksum"` |
| `value` | `string` | text, letter, number | Fixed or default value for this segment. Required for non-input segments. |
| `input` | `boolean` | text, letter, number, option | If `true`, the user provides this value via a form field. Default: `false` (segment uses `value`). |
| `fill` | `string` | text, letter, number | How to handle input shorter than the segment length. See [Fill Modes](#fill-modes). Default: `"left:0"` |
| `validation` | `string` | text, letter, number | Optional regex pattern applied after type validation. Example: `"^[A-Z]+$"` |
| `label` | `object` | text, letter, number, option | Localized label shown above the input field. Example: `{ "en": "Name", "de": "Name" }`. Falls back to type name if omitted. |
| `options` | `array` | option | **Required for option.** Array of `{ value, label }` objects for the dropdown. `value` length must match the segment length. `label` is a localized object. |
| `default` | `string` | option | Pre-selected option value. If omitted, the first option is used. |
| `algorithm` | `string` | checksum | **Required for checksum.** Algorithm name. Currently available: `"mod97weighted"` |
| `source` | `string` | checksum | **Required for checksum.** Pattern characters whose resolved values feed the checksum. Example: `"2LEEEPPP"` references the 2, L, E, and P segments. |

#### `text`
Accepts any characters valid for the barcode format. Use for fixed prefixes, free-form text input, or mixed content.

#### `letter`
Accepts only alphabetic characters (A-Z, a-z). Invalid characters are stripped from input automatically.

#### `number`
Accepts only numeric digits (0-9). Input field shows a numeric keyboard on mobile.

#### `option`
Renders as a dropdown. Each option has a `value` (used in the barcode) and a localized `label` (shown to the user). The `value` length must match the segment length defined in the pattern.

#### `checksum`
Automatically calculated — no user input. The `source` property references pattern characters whose filled values are concatenated and passed to the algorithm. The result is padded/truncated to the segment length.

### Fill Modes

The `fill` property controls how input shorter than the segment length is handled:

| Mode | Behavior | Example (pattern `####`, input `"5"`) |
|---|---|---|
| `left:0` | Pad left with `0` (default) | `"0005"` |
| `left:X` | Pad left with character X | `left: ` → `"   5"` |
| `right:0` | Pad right with `0` | `"5000"` |
| `right:X` | Pad right with character X | `right:-` → `"5---"` |
| `exact` | No padding — input must be exactly the segment length, otherwise invalid | fails (length 1 ≠ 4) |
| `shorten` | Use input as-is without padding; barcode is shorter | `"5"` |

### Checksum Algorithms

#### `mod97weighted`
Checksum based on modulo 97:
```
checksum = (source_number * -3) mod 97
```
The source value (all referenced segments concatenated) must be numeric (digits 0-9 only). Result is zero-padded to the segment length.

## Project Structure

```
├── index.html                  # App entry point
├── barcode-generator.js        # Web Component (all logic, styles, configs)
├── sw.js                       # Service Worker for offline caching
├── manifest.json               # PWA manifest
├── lib/
│   └── JsBarcode.all.min.js   # JsBarcode library (v3.11.6)
├── icons/
│   ├── icon-192.svg           # PWA icon 192×192
│   └── icon-512.svg           # PWA icon 512×512
├── AICONTEXT.md               # AI context / requirements document
├── LICENSE
└── README.md
```

## Deployment

The app is fully static and can be deployed to **GitHub Pages**, Netlify, Vercel, or any static hosting.

For GitHub Pages:
1. Push to a branch (e.g., `main`)
2. Enable GitHub Pages in repository settings
3. The Service Worker uses relative paths so it works in subdirectories

## Browser Support

All modern, up-to-date browsers: Chrome, Firefox, Safari, Edge.

## License

See [LICENSE](LICENSE).