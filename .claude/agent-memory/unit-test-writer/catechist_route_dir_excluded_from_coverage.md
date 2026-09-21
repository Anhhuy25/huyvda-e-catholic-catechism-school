---
name: catechist-route-dir-excluded-from-coverage
description: vitest.config.ts excludes all of src/routes/_authenticated/_catechist/** from coverage collection — no row/number is ever produced for files in that directory, even with full test coverage.
metadata:
  type: project
---

`vitest.config.ts`'s `coverage.exclude` array has a blanket entry
`'src/routes/_authenticated/_catechist/**'` (alongside the sibling
`_authenticated/_catechist.tsx` and `_authenticated/_student.tsx` layout
files). This means **every route file under that directory** — e.g.
`catechists.tsx`, `students.tsx`, `classes_.$id.tsx`, etc. — never appears in
the coverage text table or `coverage/lcov.info`, no matter how thoroughly it's
tested. `npm test -- --coverage` cannot be used to "confirm the file clears
75%" for anything in this folder; there's structurally no number to check.
Don't waste time re-running coverage with narrower `--coverage.include`
globs trying to find a missing row for these files — it's not a
[[coverage_text_table_missing_row_quirk]] fluke, it's an intentional
project-level exclusion. When CLAUDE.md's 75%-coverage rule is invoked for a
task touching one of these route files, write the tests anyway (they're still
required and valuable), run them standalone to confirm they pass, and note in
the final report that no coverage percentage exists for that file rather than
reporting a fabricated number. `convex/**/*.ts` files (e.g. `catechists.ts`
the backend module, as opposed to the route file of the same base name) are
NOT excluded and do get real coverage numbers.

Confirmed 2026-09-12 while adding restore/permanentDelete tests for
`catechists.tsx` (frontend) and `catechists.ts` (backend) — the backend file
reported 91.18/81.67/93.45/93.62 (stmts/branch/func/lines) cleanly, while the
frontend file's row was simply absent from both the text table and
`coverage/lcov.info` even after a clean `rm -rf coverage` + full-suite rerun.
