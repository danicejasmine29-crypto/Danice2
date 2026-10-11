# Portfolio — Danice Jasmine Estorion Nerves

Personal developer portfolio for **Danice Jasmine Estorion Nerves** — BSIT (Integrative Programming and Technologies) student and aspiring game developer.

Live profile content, live GitHub data, and a print-ready resume, built as a static site with no build step and no framework.

## Stack

- HTML5, CSS3 (custom properties, glassmorphism, `clamp()` fluid type)
- Vanilla JavaScript (ES2019+), no dependencies
- GitHub REST API for live profile, repo, and language data
- Google Fonts (Plus Jakarta Sans, JetBrains Mono)

## Structure

```
index.html        Portfolio page
resume.html       Print-ready resume ("Save as PDF" from the browser)
css/style.css     All styling, light + dark themes
js/script.js      Nav, theme, scroll reveal, GitHub integration, copy-email
```

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

Live GitHub stats work from `file://` too, but serving locally matches how GitHub Pages will run it.

## Deploy to GitHub Pages

1. Create a repository (for example `danicejasmine29-crypto.github.io`) and push these files to the `main` branch.
2. Repository → **Settings** → **Pages** → Source: **Deploy from a branch** → Branch: `main` / `/ (root)` → **Save**.
3. The site appears at `https://<user>.github.io/<repo>/` within a minute or two.

## Personalise before publishing

- **Figma links** — each project card has a `data-figma` attribute in `index.html`. It is currently empty, which renders the button as a disabled placeholder. Paste the Figma URL, e.g.
  `data-figma="https://www.figma.com/design/xxxxx/Student-Management"` and the button becomes clickable.
- **Project repositories** — the "View Project" buttons auto-match your live repository list by keyword (`data-repo-keywords`) once GitHub data loads. If a project has no matching repo, the button falls back to your repositories tab; give the repo a similar name or edit `data-repo-keywords` to fix the match.
- **Resume PDF** — `resume.html` is the printable version. If you later export a PDF, drop it in the folder and point the header hero buttons and the "Resume" nav button at it.
- **Avatar** — the hero monogram is replaced automatically with your GitHub avatar when the API responds. To use a custom image, replace the contents of `#avatar` in `index.html` with an `<img>`.
- **Contact** — email address is in `index.html` (hero contact card, footer, and `data-copy` on the copy button).

## Notes

- GitHub's unauthenticated API allows 60 requests per hour per IP. If the limit is hit, the stats card shows a retry notice instead of failing silently.
- All GitHub data is inserted with `textContent` / DOM nodes, never `innerHTML`, so repo names and descriptions can't inject markup.
- `prefers-reduced-motion` is respected: reveal animations and smooth scrolling are disabled for users who ask for it.
