# gauravanand10.github.io

Personal engineering portfolio of **Gaurav Anand**: VLSI • ASIC • FPGA • Digital Hardware • Embedded.

React + TypeScript + Vite + Tailwind CSS + Framer Motion. Deployed to GitHub Pages by GitHub Actions.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/ (plus 404.html so deep links work on Pages)
npm run preview
```

## Deploy

1. Push this folder to the repo **`gauravanand10/gauravanand10.github.io`** on branch `main`.
2. On GitHub, open **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml` and publishes to https://gauravanand10.github.io.

This is a user site, so it is served from `/`. If you ever host it under a sub-path, build with `BASE_PATH=/sub-path/ npm run build`.

## Where to edit things

| What | File |
|---|---|
| Name, links, education, resume toggle, marquee | `src/data/profile.ts` |
| Projects (text, metrics, figures, sections) | `src/data/projects.ts` |
| Skills and research topics | `src/data/skills.ts` |
| Project photos | `public/images/` |
| Social preview image | `public/og-image.png` |

### Resume
Put your PDF at `public/resume/Gaurav_Anand_Resume.pdf`, then set `resume.available: true` in `src/data/profile.ts`. The View and Download buttons turn on everywhere.

### PA-MAC
When the repo is public, set `repo:` on the `pamac` object in `src/data/projects.ts`. Then replace each `placeholder:` with real content (`body`, `metrics`, `figures`) taken from your Genus and Innovus reports.

### Adding a project
Append a `Project` object to `projects` in `src/data/projects.ts`. Pick an existing `visual`, or add a component in `src/visuals/` and register it in `src/visuals/ProjectVisual.tsx`. The detail page at `/projects/<slug>` is built automatically.

## Authenticity rule
Every number on the site was copied from a report in the linked repository:

- **Sobel:** Genus `qor.rpt` / `power.rpt`, Modus ATPG summary, scan-chain report.
- **AHB:** Design Compiler `qor.rpt`.

Anything not yet published is shown as a placeholder. Keep it that way.

## Structure

```
src/
├── components/   Navbar, Footer, ProjectCard, FeaturedProject, FlowChain, Figure, TiltCard…
├── sections/     Hero, TechMarquee, About, Projects, ASICFlow, FPGA, Verification, Research, Skills, GitHubSection, Resume, Contact
├── pages/        Home, ProjectDetail, NotFound
├── visuals/      SiliconDie, PAMACDatapath, SystolicArray, LiveSobel, AHBBus, ToFGrid, QuadTopView, OttoVisual, FPGAFabric
├── data/         profile.ts, projects.ts, skills.ts
├── hooks/        usePointer.ts
└── App.tsx
```

All animations respect `prefers-reduced-motion`. Cursor effects only turn on for fine pointers (mouse or trackpad).
