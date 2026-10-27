# Xinyue Feng — portfolio

Source for **https://lily-feng.com/**, the portfolio of Xinyue (Lily) Feng, a Computer Science student at Kean University (class of 2027).

| Project | Live | Source |
| --- | --- | --- |
| **Yuzu Onsen Capybaras**: a cozy pixel-art life sim (JavaScript, HTML canvas, Electron) | [winter demo](https://capybara.lily-feng.com/) · [case study](https://lily-feng.com/work/yuzu-onsen-capybaras/) | private repository |
| **Otherworlds**: a crossover boss mod for Terraria, in development (C#, tModLoader) | [case study](https://lily-feng.com/work/otherworlds/) | not yet public |
| **Wizarding World**: a Harry Potter mod for Terraria (C#, tModLoader) | [case study](https://lily-feng.com/work/wizarding-world/) | [lillly1/WizardingWorld](https://github.com/lillly1/WizardingWorld) |
| **The Adventures of Edgeworth**: an Ace Attorney platformer (Java Swing, ported to the web) | [play](https://lily-feng.com/play/edgeworth/) · [case study](https://lily-feng.com/work/edgeworth/) | [`projects/edgeworth`](projects/edgeworth) |
| **AI Recipe Remix**: recipes and dish photos from the ingredients you have (React, Express, OpenAI) | [demo](https://lily-feng.com/play/recipe-remix/) · [case study](https://lily-feng.com/work/recipe-remix/) | [`projects/ai-recipe-remix`](projects/ai-recipe-remix) |
| **Tic-Tac-Toe vs. AI**: rule-based AI vs. minimax, with a “Show AI thinking” overlay | [play](https://lily-feng.com/play/tic-tac-toe/) · [case study](https://lily-feng.com/work/tic-tac-toe/) | [`projects/tic-tac-toe`](projects/tic-tac-toe) |

The whole portfolio is also a 20-page PDF (A4 landscape): [download it](https://lily-feng.com/assets/xinyue-feng-portfolio.pdf). Her résumé: [lily-feng.com/resume.pdf](https://lily-feng.com/resume.pdf).

## Layout

```
site/        the static website Cloudflare Pages serves at lily-feng.com (plain HTML/CSS/JS, no build step)
  play/      playable builds copied or built from projects/
  work/      one case-study page per project
projects/    source code for each project
pdf/         the PDF portfolio as one HTML page (portfolio.html + portfolio.css), using the site's fonts and pictures
redirect/    the pages lillly1.github.io serves: each one forwards to the same path on lily-feng.com
scripts/     build-site.sh copies the games into site/play/ (--recipe also rebuilds the React demo)
             build-pdf.mjs prints pdf/ to site/assets/xinyue-feng-portfolio.pdf
             build-resume.mjs makes site/resume.pdf from her LaTeX résumé, kept out of this repository: no GPA, the site's email
             make-og.mjs draws the newer case studies' social cards (site/assets/img/og/) from og/card.html
             check-site.mjs checks every page's layout at phone, tablet and desktop sizes
```

## Working on it

```bash
scripts/build-site.sh --recipe                 # refresh site/play/ from projects/
python3 -m http.server 8000 --directory site   # preview at http://localhost:8000
```

The PDF, the social cards and the layout checks use headless browsers (Playwright). The PDF and the cards are committed, so only someone changing them needs this:

```bash
cd scripts && npm install && npx playwright install chromium webkit firefox
node build-pdf.mjs                             # checks every page for overflow, then writes the PDF
node build-resume.mjs                          # the résumé, from ~/Downloads/Xinyue_Feng_Resume_v2 (needs tectonic, poppler)
node make-og.mjs                               # every card, or name one: node make-og.mjs otherworlds
node check-site.mjs                            # sideways scrolling, overlaps, broken pictures and links;
                                               # ENGINE=webkit or ENGINE=firefox for the other engines
```

Each project has its own README with setup and tests. Cloudflare Pages serves the committed `site/` at https://lily-feng.com/ on every push to `main`, so run `scripts/build-site.sh` (with `--recipe` after changing the React demo) and commit `site/play/` along with a game change. GitHub Actions runs every project's tests and checks that `site/play/` matches `projects/`; GitHub Pages only redirects the old address, lillly1.github.io, to the same page on lily-feng.com (`redirect/`).

## Notes

- **Fan works.** *The Adventures of Edgeworth*, *Wizarding World* and *Otherworlds* are non-commercial fan projects. *Ace Attorney* belongs to Capcom; *Harry Potter* to Warner Bros. Entertainment and J.K. Rowling; *Terraria* to Re-Logic; *Hollow Knight* and *Hollow Knight: Silksong* to Team Cherry; *Dead Cells* to Motion Twin; *Cuphead* to StudioMDHR; *The Binding of Isaac* to Edmund McMillen. Third-party art and audio are credited in each project.
- **AI assistance.** Lily led the development of *Yuzu Onsen Capybaras* and *Otherworlds* (October 2026) with AI tools: AI coding agents wrote the code to her direction and the art was generated with AI image tools; their case-study pages say how. *Wizarding World* (summer 2026) was made with AI coding and image tools too. The 2026 portfolio updates to the older projects, and this site, were made with AI coding tools. Each project README says what Lily wrote originally and what changed later. The original files are kept in `projects/tic-tac-toe/original/` and `projects/edgeworth/java/original-src/`; the original recipe app is not included.
- **Secrets.** No API keys are committed. The recipe app reads `OPENAI_API_KEY` from `projects/ai-recipe-remix/server/.env`, which is git-ignored.

© Xinyue Feng. All rights reserved unless noted otherwise. Third-party assets belong to their owners.
