# Sport Shooting Barcode Generator - Requirements

## Project Overview
A web-based barcode generator application specifically designed for sport shooting use cases (e.g., license numbers for target displays). The application generates barcodes based on configurable patterns with automatic checksum calculation.

## Technical Requirements

### Technology Stack
- **Pure JavaScript + HTML** - No build tools, package managers, or compilation steps
- **JsBarcode Library** - Embedded lindell/JsBarcode library for barcode generation
- **Web Components** - Modern Web Components API for component architecture
- **Barcode Formats** - Primary format is CODE_128, architecture must support QR codes and other JsBarcode formats for future expansion

### Browser Support
- All modern, up-to-date browsers (Chrome, Firefox, Safari, Edge)
- No legacy browser support required

### Architecture
- Simple, readable code with configuration over coding
- Mobile-first responsive design
- Single-page application (no routing needed)
- **Self-contained Web Component:** Can be embedded in other websites
  - Not an iframe - integrates naturally into host page
  - Load via simple HTML snippet that references external JS/CSS
  - Isolated styles (Shadow DOM) to avoid conflicts with host page
  - Example usage: `<script src="https://example.com/barcode-generator.js"></script>` + `<barcode-generator></barcode-generator>`

### Deployment
- **GitHub Pages Compatible** - Static hosting ready
- No server-side requirements
- All assets (HTML, CSS, JS, libraries) served as static files
- CDN-ready for embedding in external websites
- Service Worker properly configured for GitHub Pages subdirectory paths

## User Interface Requirements

### Layout & Responsiveness
- **Mobile-first design** - Primary focus on mobile devices
- **Responsive breakpoints** - Tablet and desktop share the same wider layout
- **Two main views:**
  1. Favorites drawer (collapsible, opens by default if favorites exist)
  2. Barcode generator view

### Barcode Generator View
- Display generated barcode in canvas (approximately 50×20mm size)
- Show both barcode graphic and text value within the canvas
- Input fields below barcode for user data entry (text inputs for text/letter/number, dropdowns for option segments)
- Real-time barcode generation as user types
- **Validation:** Invalid input shows NO barcode (makes it clear that input is invalid)
- Display title and description of current barcode type (localized)
- Star icon button to add current barcode to favorites
- PNG download button and copy-to-clipboard button for exporting barcode

### Favorites System
- Store complete barcode state in localStorage (configuration + input values)
- Each favorite has a custom user-defined title
- Favorites drawer opens by default if any favorites exist
- On mobile: can collapse favorites drawer to show generator
- Quick access to frequently used barcode configurations
- Loading a favorite restores both the barcode type and any saved input values
- **UI Controls:**
  - Star icon: Add/save current barcode to favorites
  - X icon: Remove favorite (requires confirmation dialog)
  - Arrow up icon: Move favorite to top of list (reordering)
  - No maximum number of favorites
- Favorites are persistent across sessions (localStorage)

## Configuration System

### Barcode Pattern Configuration
Each barcode type is defined by a JSON configuration object with the following structure:

```json
{
  "title": {
    "en": "License Number for Hit Display",
    "de": "Lizenznummer für Trefferanzeige"
  },
  "description": {
    "en": "Barcode format for electronic target systems",
    "de": "Barcode-Format für elektronische Trefferanzeigesysteme"
  },
  "pattern": "PP######CC",
  "segments": {
    "P": {"type": "text", "value": "00", "fill": "left:0"},
    "#": {"type": "number", "input": true, "fill": "left:0"},
    "C": {"type": "checksum", "algorithm": "mod97weighted", "source": "PP######"}
  },
  "barcodeOptions": {
    "format": "CODE128",
    "width": 2,
    "height": 100,
    "displayValue": true
  }
}
```

### Pattern Syntax
- Pattern string uses single characters to represent segment types
- **Same character repeated = length of that segment**
- Character count in pattern defines the exact length for that segment
- Example: `PP######CC` = 
  - P segment: length 2 (P appears twice)
  - # segment: length 6 (# appears 6 times)
  - C segment: length 2 (C appears twice)
- **Total barcode length** = sum of all segment lengths

### JsBarcode Options
- All JsBarcode options can be overridden via the optional `barcodeOptions` object
- Common options: `format`, `width`, `height`, `displayValue`, `text`, `fontOptions`, `font`, `textAlign`, `textPosition`, `textMargin`, `fontSize`, `background`, `lineColor`, `margin`, `marginTop`, `marginBottom`, `marginLeft`, `marginRight`, `valid`
- See [JsBarcode documentation](https://github.com/lindell/JsBarcode) for complete list
- All properties are optional; defaults will be used if not specified

### Segment Types

#### Text Segment
- Allows all characters valid for the barcode format
- Properties:
  - `type: "text"`
  - `value: string` - The fixed or default value
  - `input: boolean` - (optional) If true, user can provide input
  - `fill: string` - (optional) Fill mode: "left:X", "right:X", "exact", "shorten" (default: "left:0")
  - `validation: string` - (optional) Regex pattern for validation (e.g., "^[A-Z]+$")
- **Length:** Defined by character count in pattern

#### Letter Segment
- Allows only alphabetic characters (A-Z, a-z)
- Properties:
  - `type: "letter"`
  - `value: string` - (optional) The fixed or default value
  - `input: boolean` - (optional) If true, user can provide input
  - `fill: string` - (optional) Fill mode: "left:X", "right:X", "exact", "shorten" (default: "left:0")
  - `validation: string` - (optional) Regex pattern for validation (e.g., "^[A-Z]+$")
- **Length:** Defined by character count in pattern

#### Number Segment
- Allows only numeric input (0-9)
- Properties:
  - `type: "number"`
  - `value: string` - (optional) The fixed or default value
  - `input: boolean` - (optional) If true, user can provide input
  - `fill: string` - (optional) Fill mode: "left:X", "right:X", "exact", "shorten" (default: "left:0")
  - `validation: string` - (optional) Regex pattern for validation (e.g., "^[1-9][0-9]*$" for no leading zeros)
- **Length:** Defined by character count in pattern

#### Option Segment
- Dropdown selection from predefined options
- Properties:
  - `type: "option"`
  - `input: true` - User must select an option
  - `options: array` - Array of option objects
  - `default: string` - (optional) Default option value
  - If no default is set, the first option is used
  - Example:
    ```json
    {
      "type": "option",
      "input": true,
      "options": [
        {"value": "A", "label": {"en": "Air Rifle", "de": "Luftgewehr"}},
        {"value": "P", "label": {"en": "Air Pistol", "de": "Luftpistole"}}
      ],
      "default": "A"
    }
    ```
- **Length:** Defined by character count in pattern (option values must match this length)
  
#### Checksum Segment
- Automatically calculated checksum value
- Properties:
  - `type: "checksum"`
  - `algorithm: string` - Checksum calculation algorithm (currently: "mod97weighted")
  - `source: string` - Which pattern segments to include in calculation (references the pattern)
- **Length:** Defined by character count in pattern (checksum result will be padded/truncated to fit)
- **Implementation Note:** Architecture must support adding additional checksum algorithms

## Data Storage & Offline Capability
- **localStorage** for persisting:
  - Favorite barcode configurations (including input values and custom titles)
  - User language preference
  - Last used barcode configuration
- **Service Worker** for offline capability:
  - Small footprint implementation
  - Cache HTML, CSS, JS, and JsBarcode library
  - App works completely offline after first load
  - Progressive Web App (PWA) capabilities

## Configuration Management
- Barcode templates are **pre-defined in the application code**
- End users cannot create custom templates through the UI
- **Developer-friendly:** Software developers should be able to easily add new templates by editing configuration files/code
- Initial release will include basic templates (starting with "Lizenznummer für Trefferanzeige")
- Additional templates will be added in future iterations

## Input Validation & Error Handling

### Validation Rules
- **Segment length is defined by the pattern** (count of repeated characters)
  - Pattern `PP` = 2 characters for P segment
  - Pattern `######` = 6 characters for # segment
- **Input constraints:**
  - Input fields will NOT accept more characters than defined in the pattern
  - User cannot type beyond the segment length
- **Fill behavior** (property: `fill`):
  - `fill: "left:X"` (default: "left:0"): Fill left with character X for shorter inputs
    - Example: Input "5" for `##` pattern with "left:0" → becomes "05"
    - Example: Input "5" for `##` pattern with "left: " → becomes " 5"
  - `fill: "right:X"`: Fill right with character X for shorter inputs
    - Example: Input "5" for `##` pattern with "right:0" → becomes "50"
    - Example: Input "ABC" for `FFFFF` pattern with "right:-" → becomes "ABC--"
  - `fill: "exact"`: No filling - REQUIRES exact length
    - Input must match pattern length exactly, or validation fails
    - Invalid input = no barcode displayed
  - `fill: "shorten"`: Allow shorter input - shortens the final code
    - Input can be up to pattern length
    - Final barcode uses only the provided input length
    - Example: Input "12" for `######` pattern → barcode uses "12" (not padded to 6 chars)
- **Type-specific validation:**
  - `text`: All characters valid for the barcode format
  - `letter`: Only alphabetic characters (A-Z, a-z)
  - `number`: Only numeric digits (0-9)
  - `option`: Must select from predefined options (value length must match pattern)
- **Custom regex validation** (optional `validation` property):
  - Applied after type validation
  - Example: `"validation": "^[A-Z]+$"` enforces uppercase only
  - Example: `"validation": "^[1-9][0-9]*$"` prevents leading zeros
- **No auto-formatting by default** - user input is preserved as-typed (within validation rules)

### Error Handling
- **Invalid Input:** No barcode is displayed (clear visual feedback)
- **Toast Notifications:** All errors are displayed as toast messages
  - Checksum calculation failures
  - Invalid barcode format errors
  - localStorage quota exceeded
  - Network errors (if applicable)
- Toasts auto-dismiss after a few seconds but can be dismissed manually

## Internationalization (i18n)

### Multi-Language Support
- UI supports multiple languages (initial: English, German)
- All code and comments in English
- User can select preferred language (stored in localStorage)
- **Localized Properties:**
  - Template `title`: Object with language codes as keys (e.g., `{"en": "...", "de": "..."}`)
  - Template `description`: Object with language codes as keys
  - Option labels in option segments: Object with language codes
  - UI strings: Managed via language files/objects
- Fallback to English if translation missing

## Export & Sharing

### Export Options
- **PNG Download:** Download barcode as PNG image file
- **Copy to Clipboard:** Copy barcode as PNG to system clipboard
- File naming: Uses barcode value or custom name
- Image quality: High resolution suitable for printing
- No printing function (PNG download covers this use case)

### Architecture Considerations for Future QR Sharing
- Design data structures to be easily serializable for QR code transfer
- Keep barcode state (template + values) in a clean, portable format
- Consider JSON structure that can be stored in QR codes later
- This will enable phone-to-phone transfer feature in future versions


## Implementation Priorities

### Phase 1: Core Functionality
1. Set up project structure with JsBarcode library
2. Define complete data schema for barcode configurations
3. Implement barcode generation with CODE_128
4. Create Web Component architecture with Shadow DOM (for self-contained embedding)
5. Implement mod97weighted checksum algorithm
6. Add pattern parsing and segment rendering
7. Implement all segment types (text, letter, number, option, checksum)
8. Add validation logic (pattern length enforcement, fill modes, type-specific validation, regex validation, input constraints)

### Phase 2: User Interface
1. Build mobile-first responsive layout
2. Create barcode generator view with input fields (text inputs + dropdowns)
3. Implement real-time barcode generation
4. Add barcode canvas with proper sizing (50×20mm)
5. Display barcode with text value
6. Implement "no barcode" state for invalid input
7. Add toast notification system

### Phase 3: Internationalization
1. Create language file structure (English, German)
2. Implement language switching
3. Localize UI strings
4. Support localized template titles and descriptions
5. Store language preference in localStorage

### Phase 4: Favorites System
1. Implement localStorage persistence
2. Create favorites drawer component
3. Add star icon for saving favorites (with custom title prompt)
4. Add X icon for removing favorites (with confirmation dialog)
5. Add arrow up icon for reordering (move to top)
6. Implement favorite loading (restores configuration + input values)
7. Add drawer collapse/expand on mobile

### Phase 5: Export & Offline
1. Implement PNG download functionality
2. Implement copy-to-clipboard functionality
3. Create service worker for offline capability
4. Configure PWA manifest
5. Test offline functionality

### Phase 6: Templates & Configuration
1. Create initial template: "Lizenznummer für Trefferanzeige"
2. Design template selection UI
3. Document template creation process for developers
4. Create example templates with different segment types

### Phase 7: Polish & Testing
1. Cross-browser testing (Chrome, Firefox, Safari, Edge)
2. Mobile device testing
3. Tablet and desktop layout refinement
4. Error handling and edge cases
5. Performance optimization
6. Accessibility testing (ARIA labels, keyboard navigation)

### Phase 8: Deployment & Embedding
1. Configure for GitHub Pages deployment
2. Set up proper base paths for subdirectory hosting
3. Create embedding documentation with HTML snippet
4. Test embedding in external website
5. Verify Service Worker works with GitHub Pages paths
6. Create deployment workflow/documentation
7. Test CDN loading of JS/CSS from external sites

### Future Enhancements
- **QR Code Sharing:** Phone-to-phone barcode transfer via QR codes
  - Generate QR with template + input values
  - Scan QR to restore barcode on another device
  - Requires QR library and camera access
- Additional barcode formats (EAN, Code39, etc.)
- Additional checksum algorithms (mod10, Luhn, etc.)
- Additional sport shooting templates
- Batch generation (multiple codes at once)
- Import/export favorites as JSON
- Dark mode theme
- Advanced QR code options (custom logos, colors)

---

## Implementation Status & Notes for Next LLM

### What Has Been Implemented (as of March 2026)

All phases 1–6 and most of phases 7–8 are complete. The app is a single-file Web Component architecture:

**Files:**
- `barcode-generator.js` — Self-contained Web Component with Shadow DOM. Contains all logic: i18n translations, barcode configs, checksum algorithms, pattern parser, fill logic, validation, rendering, favorites, export, share, and event handling. ~1500 lines.
- `index.html` — Minimal host page with PWA tags, loads JsBarcode + the component, registers service worker.
- `sw.js` — Cache-first service worker with versioned cache (`barcode-gen-v1`).
- `manifest.json` — PWA manifest with SVG icons.
- `lib/JsBarcode.all.min.js` — JsBarcode v3.11.6, locally bundled.
- `icons/icon-192.svg`, `icons/icon-512.svg` — SVG PWA icons (barcode motif).

**Barcode Templates (4 configs in `BARCODE_CONFIGS`):**
1. `HitDisplayGeneric-Shooter` — Pattern `1LNNNNNNCC` (prefix 1, legalization dropdown, 6-digit license number, mod97weighted checksum)
2. `HitDisplayGeneric-Programm` — Pattern `2LEEEPPPCC` (prefix 2, legalization dropdown, 3-digit billing program, 3-digit display program, mod97weighted checksum)
3. `HitDisplaySintro-CodeSelect` — Pattern `NNNN` (Sintro code from dropdown, left-padded with 0)
4. `HitDisplaySintro-CodeText` — Pattern `NNNN` (free-form Sintro code text input, left-padded with 0)

**Architecture decisions & key details:**
- The component loads JsBarcode either from the host page global or falls back to loading from CDN via `ensureJsBarcode()`.
- `_loadFromURL()` parses `?config=<id>&v[0]=val0&v[1]=val1` on page load to restore state from a shared URL. Each input segment gets an indexed `v[N]` query parameter.
- **Resolution strategy:** JsBarcode renders at 2x resolution (e.g., `width: 4, height: 200` in barcodeOptions). After rendering, the canvas CSS dimensions are set to half the pixel dimensions (`canvas.style.width/height = canvas.width/height / 2 + 'px'`). This gives a crisp display and high-res export from the same canvas. Download and copy use the canvas directly (no separate hi-res canvas needed).
- The template selector `<select>` is always visible. The template title is NOT shown separately — only the description is displayed below the selector.
- Segment configs support a `label` property (localized object) for custom input field labels. Falls back to type name if omitted.
- Option segments default to the first option value (no `default` property needed).
- Favorites store `configIndex` (integer). If configs are reordered or removed, old favorites may point to wrong templates. Consider migrating to `configId` string in the future.
- Action buttons (Favorite, Download, Copy, Share) all use the same `.btn` class with consistent styling — icon + text label, uniform sizing.
- `resolveSource()` iterates all parsed segments and matches them against the source pattern. It skips segments not in the source, so the source can reference a subset of the pattern (e.g., source `######` in pattern `D######CC` correctly picks up only the # segment).
- The `mod97weighted` checksum algorithm only handles numeric source values. Make sure the `source` property in checksum segments only references segments that resolve to digits.

**Checksum algorithm (`mod97weighted`):**
- Formula: `(source * -3) mod 97` where source is the full numeric string parsed as an integer
- JavaScript implementation uses `(((num * -3) % 97) + 97) % 97` to ensure non-negative results
- Only works with numeric source values. Non-digit characters cause the algorithm to return `null` (no barcode shown).

**Things NOT yet done / known gaps:**
- No automated tests
- Service worker cache version (`barcode-gen-v1`) needs manual bumping on updates
- No "last used config" restoration from localStorage (preference is saved but input values are not persisted across sessions unless saved as a favorite)
- Accessibility: basic ARIA attributes exist but no comprehensive a11y audit done
- PWA icons are SVG which some older Android versions may not support as splash icons
- No GitHub Actions CI/CD workflow file yet
- Favorites use `configIndex` (positional), not `configId` — fragile if configs are reordered
- The `template-info` section currently has unused CSS for `h2` (the h2 element was removed, only `p` description remains)
