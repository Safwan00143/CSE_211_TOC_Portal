# Signals & Systems — CSE 219 study site

Topic-wise notes and worked solutions to past term-final questions.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 (the preview config in `../.claude/launch.json` uses port 3219).

## Where things live

- `src/content/topics.ts` — the 12 topics, in slide order
- `src/content/notes/` — the "Learn" notes for each topic (Markdown + LaTeX)
- `src/content/questions/` — past questions and solutions, tagged by topic
- `src/components/practice-list.tsx` — question list, hidden solutions, "mark solved" progress (saved in the browser)

To add a question, append an object to one of the files in `src/content/questions/`. Use `$…$` and `$$…$$` for math.

Stack: Next.js + Tailwind + shadcn, with Magic UI's Blur Fade and Dot Pattern. Fonts: Outfit (headings), Inter (body), KaTeX (math).
