# alu_Summative-Assignment_front-web_Jules-Ineza

# Student Finance Tracker

A responsive, accessible, vanilla HTML/CSS/JS web app to track student expenses. It demonstrates semantic structure, mobile-first layouts, DOM manipulation, events, regex validation & search, basic persistence, and clean modular code.

Live demo (GitHub Pages): add your repository Pages URL here once deployed


## Project Structure

- `index.html` — Landing page + first-use setup modal (currency, spending cap).
- `dashboard.html` — Stats dashboard with progress bar, weekly trend, top category.
- `records.html` — Records table with add/edit modal, sorting, and live regex search.
- `settings.html` — Currency & budget settings; JSON import/export; clear data.
- CSS: `css/styles.css`, `css/style-dashboard.css`, `css/style-records.css`, `css/style-settings.css`, `css/modal.css`, `css/setup.css`.
- JS: `js/script1.js` (shared UI + modal loader), `js/dashboard-script.js` (stats, progress, chart), `js/record-script.js` (records, search, sorting, edit/delete).

No frameworks; plain HTML/CSS/JS. Font Awesome used for icons.

## How to Run Locally

1. Clone the repo.
2. Open `index.html` in a modern browser. No build step required.
3. For best results with module scripts, you may use a simple static server (optional):
   - Python: `python3 -m http.server` then open `http://localhost:8000/`
   - VS Code Live Server or any static file server

## Features Overview (mapped to learning outcomes)

- HTML/CSS
  - Semantic landmarks and headings: `header`, `nav`, `main`, `section`, `footer` across pages.
  - Mobile-first responsive design with Flexbox and media queries.
  - Tasteful transitions/animations (e.g., modal open/close, chart bar animations).
- JavaScript
  - DOM updates and event handling for add/edit/delete, sorting, search, and settings.
  - Modular structure with separate scripts per concern.
  - Error handling: safe regex compilation, guarded DOM lookups, and input validation.
- Data
  - Persistence in `localStorage` for records and settings.
  - JSON Import/Export with basic structure validation in `settings.html`.
- Regex
  - Input validation and live regex search with highlighting.
  - Advanced pattern support (e.g., back-references for duplicate words).
- Accessibility (a11y)
  - Keyboard operable UI with visible focus outlines.
  - ARIA live regions for budget status updates and status messages.
  - Labels bound to inputs; adequate color contrast.

## Core Pages/Sections

- About (Index)
  - Purpose and contact in `index.html`:
    - GitHub: https://github.com/julesineza/alu_Summative-Assignment_front-web_Jules-Ineza
    - Email: j.ineza@alustudent.com
- Dashboard/Stats (`dashboard.html` + `js/dashboard-script.js`)
  - Total records, total spent, remaining vs cap (with color-coded progress bar).
  - ARIA live status message for remaining/overage.
  - Weekly last-7-days trend chart (CSS/JS) and top category.
- Records (`records.html` + `js/record-script.js`)
  - Table render of all records with sorting and live regex search.
  - Add/Edit form in modal (inline edit via pencil icon), delete with confirm.
- Settings (`settings.html`)
  - Base currency + manual EUR/GBP rates.
  - Monthly spending cap.
  - JSON import/export and clear-all with confirmation.

## Data Model

Each record is stored in `localStorage` under the `records` key as an array of objects like:

```json
{
  "id": "rec_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.5,
  "category": "Food",
  "date": "2025-09-29",
  "createdAt": "2025-09-29T12:34:56.789Z",
  "updatedAt": "2025-09-29T13:45:00.000Z"
}
```

- New records get a unique `id` of the form `rec_XXXX` and a `createdAt` timestamp (`js/script1.js`).
- Edits update `updatedAt` in the edit flow (`js/record-script.js`).
- All changes auto-save to `localStorage`.
- Settings are also persisted (e.g., `baseCurrency`, `spendingCap`, `rateEur`, `rateGbp`).

### Import/Export

- Export: Settings page → “Export JSON” downloads a consolidated JSON of all `localStorage` keys.
- Import: “Import JSON” accepts a JSON file and merges keys into `localStorage` after basic validation. The page reloads to apply changes.

## Forms & Regex Validation

Validation occurs in the add/edit modal (`js/script1.js` and `js/record-script.js`). The following rules are enforced or demonstrated:

- Description/title: forbid leading/trailing spaces and collapse doubles.
  - Suggested pattern: `/^\S(?:.*\S)?$/`
  - Current implementation ensures minimum 3 letters and trims input: `/^[A-Za-z\s]{3,}$/`
- Numeric (amount): `^(0|[1-9]\d*)(\.\d{1,2})?$`
  - Implementation accepts positive numbers with up to 2 decimals: `/^[0-9]+(\.[0-9]{1,2})?$/` and `> 0` check.
- Date (YYYY-MM-DD): `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
  - Dates are captured from the modal input and stored; you can extend with this pattern.
- Category/tag (letters, spaces, hyphens): `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`
  - Default categories provided; “Other” reveals a custom input.
- Advanced regex (≥1): Back-reference to catch duplicate words: `/\b(\w+)\s+\1\b/`

Error messages are displayed inline near the fields. Invalid submissions are blocked.

## Table, Sorting, and Regex Search

- Render: All records are rendered into the table body (`js/record-script.js` → `loadTable()`). Empty state shown when no records exist.
- Sorting: Click headers to sort by date, description (A↕Z), and amount (↑↓) (`setupSorting()` / `sortTable()`).
- Live regex search:
  - User types a pattern in the search input (`records.html`).
  - Safe compile with `try/catch` (`safeRegexCompile()`), preventing crashes on invalid patterns.
  - Optional case-insensitivity supported via flags or toggle.
  - Matches are highlighted using `<mark>` (`highlightText()`), preserving accessibility.

## Stats Dashboard

- Total records and total spent computed from `localStorage`.
- Top category determined by frequency/amount.
- Weekly trend chart for last 7 days (`getWeeklySpending()` + `updateWeeklyChart()`).
- Cap/Target:
  - Set numeric cap in Index setup or Settings.
  - Remaining/overage is displayed with ARIA live updates (`role="status"`).
  - Progress bar color shifts: green → orange → red based on utilization.

## Units/Currency

- Base currency stored as `baseCurrency`.
- Manual EUR/GBP rate inputs in Settings (`rateEur`, `rateGbp`).
- Display uses selected base currency symbol when showing totals and amounts.

## Edit & Delete

- Edit: Click the pencil icon in the Actions column to open the modal prefilled; edits update the record and `updatedAt`.
- Delete: Trash icon prompts confirm, removes the record, and refreshes table/stats.

## Accessibility & UX

- Semantic structure across pages: `header`, `nav`, `main`, `section`, `footer`.
- Form labels correctly bound to inputs; helpful hint text and error copy.
- Visible focus styles for keyboard navigation; all controls are keyboard-accessible.
- Status and budget messages announced via `role="status"` and `aria-live` regions.
- Mobile-first responsive design with multiple breakpoints (~360px, 768px, 1024px).

## Keyboard Map

- Global
  - Tab/Shift+Tab: Navigate interactive elements and modal controls.
  - Enter: Activate buttons/links; submit forms.
  - Escape: Close open modal.
- Records Table
  - Arrow keys + Tab: Navigate cells/controls.
  - Enter on header: Toggle sort.
- Modal
  - Focus trapped within modal while open (close to return focus to trigger).

## Animations/Transitions (Modal Example)

This app includes tasteful transitions for better UX. The modal uses a subtle backdrop fade and a slide-up content animation, defined in `css/modal.css`:

```css
.modal {
  display: none;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.25s ease-in;
}

.modal-content {
  background: #ffffff;
  width: 100%;
  max-width: 460px;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: slideUp 0.3s ease;
}

.modal-content h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
}
```

These animations satisfy the “at least one tasteful animation/transition” requirement. Keyframes for `fadeIn` and `slideUp` are defined in the stylesheet, and the modal is triggered and closed via keyboard/mouse events.

## Regex Catalog (examples you can try in Search)

- Cents present: `/\.\d{2}\b/`
- Beverage keyword (case-insensitive): `/(coffee|tea)/i`
- Duplicate word (advanced back-reference): `/\b(\w+)\s+\1\b/`
- Starts with uppercase: `/^[A-Z]/`
- Amount with 1–2 decimals: `/^(0|[1-9]\d*)(\.\d{1,2})?$/`

## Testing

- Manual smoke tests: add several records, sort columns, search using the regex catalog above, import/export a JSON file, adjust cap and verify ARIA live updates on Dashboard.

## Seed Data

Create `seed.json` at the repo root with ≥10 diverse records to import via Settings → Import JSON. Example:

```json
[
  {
    "id": "txn_1",
    "description": "Lunch at cafeteria",
    "amount": 12.5,
    "category": "Food",
    "date": "2025-09-25",
    "createdAt": "...",
    "updatedAt": "..."
  },
  {
    "id": "txn_2",
    "description": "Chemistry textbook",
    "amount": 89.99,
    "category": "Books",
    "date": "2025-09-23",
    "createdAt": "...",
    "updatedAt": "..."
  },
  {
    "id": "txn_3",
    "description": "Bus pass",
    "amount": 45.0,
    "category": "Transport",
    "date": "2025-09-20",
    "createdAt": "...",
    "updatedAt": "..."
  },
  {
    "id": "txn_4",
    "description": "Coffee with friends",
    "amount": 8.75,
    "category": "Entertainment",
    "date": "2025-09-28",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

## Notes

- This app runs entirely in the browser; no backend required.
- If you extend validators (date/category), follow the patterns in the “Forms & Regex Validation” section.
- By Ineza Jules
