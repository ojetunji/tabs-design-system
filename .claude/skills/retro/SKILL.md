---
name: retro
description: Draft a RETRO.md entry from what went wrong in this session or PR — a correction, a failed check, a review finding, or work that had to be redone. Use when the user types /retro, when a change hit a correction or failed gate, or before pushing a PR that needed a fix. The draft is marked Draft for the human to review; never use it to grade or approve your own work.
---

# retro

Turn a mistake into a lesson the next session reads. You draft; the human decides. A retro entry
only counts once a person has reviewed it in a PR.

## When to run

- The user types `/retro`.
- During the current change, any of these happened: the user corrected you, a check failed
  (typecheck, lint, build, tests, the review bot), a design measured wrong against Figma, or work
  was thrown away and redone.
- Before `pre-push-review` on a branch where any of the above happened.

If nothing went wrong, say so in one line and write nothing. An empty retro is better than a
filler entry; filler trains everyone to skip the file.

## Step 1 — Gather what actually happened

Look back over this session and branch: the user's corrections, failed command output, review-bot
findings, reverted commits. Use only what you can point to. Do not reconstruct events you can't
see, and do not soften what went wrong.

## Step 2 — Read the current RETRO.md

- Missing? Create it at the repo root with the header from the template (newest entry first).
- Read the most recent entry. If its **What changes** item has not been done yet (no matching
  skill step, STANDARDS rule or CI check exists), note that in your new entry under
  **What changes** as `Still open from <date>: …`, so it isn't lost when your entry takes the top.
- If the same trap already appears in an earlier entry, say so — a repeat means the earlier
  lesson never became a check, and that is the real finding.

## Step 3 — Draft the entry at the TOP of the file

Use exactly this shape:

```
## YYYY-MM-DD · One line on what happened · Draft

Two or three sentences: what you were doing, what went wrong, how it was caught.

### Traps to remember
- **The rule, in bold, stated as an instruction.** The real cost if ignored — a concrete
  consequence (a public claim broken, work lost, a reviewer round wasted), not "could cause issues".

### What changes
- The specific skill step, STANDARDS rule ID, or CI check this lesson should become, and the
  file it lives in. If you are not sure which, say what you'd propose and mark it `(proposed)`.
```

Rules for the draft:

- **Specific over general.** "Never hand-edit `src/styles/tokens.css`; it is regenerated from
  `src/tokens/tokens.json` and the edit disappears" — not "be careful with tokens".
- **Honest about cause.** If you (the agent) caused it, say so plainly. Don't blame the tooling for
  a skipped step.
- **One entry per session or PR.** Several traps can sit under one entry.
- **Never edit or delete older entries.** Only add the new one at the top.
- Keep the `· Draft` marker. Only the human removes it.

## Step 4 — Hand it to the human

- Leave the change in the working tree of the current branch so it travels with this PR. Do not
  create a separate branch for it, and do not commit or push unless the user asks — the usual
  push rules in `WORKING_AGREEMENTS.md` apply.
- Tell the user in two or three lines: the trap you recorded and the check you're proposing.
- Mention in the PR body: `Retro: draft entry added — needs review`.

## What the human does at review

Edit the wording, sharpen the cost, delete the entry if it isn't a real lesson, then remove
`· Draft`. When the **What changes** item is built, it can be noted as done in a later entry.
