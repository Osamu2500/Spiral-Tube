---
name: ralph
description: "Convert PRDs to prd.json format for autonomous execution. Use when you have an existing PRD and need to convert it to Ralph's JSON format. Triggers on: convert this prd, turn this into ralph format, create prd.json from this, ralph json, convert to json."
user-invocable: true
---

# Ralph PRD Converter

Converts existing PRDs (markdown) to the `prd.json` format for autonomous agent execution.

---

## The Job

Take a PRD (markdown file or text) and convert it to `prd.json` in the project root.

---

## Output Format

```json
{
  "project": "[Project Name]",
  "branchName": "ralph/[feature-name-kebab-case]",
  "description": "[Feature description from PRD title/intro]",
  "userStories": [
    {
      "id": "US-001",
      "title": "[Story title]",
      "description": "As a [user], I want [feature] so that [benefit]",
      "acceptanceCriteria": [
        "Criterion 1",
        "Criterion 2",
        "Build passes (npm run build)"
      ],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

---

## Story Size: The Number One Rule

**Each story must be completable in ONE iteration (one context window).**

A fresh AI instance is spawned per iteration with no memory of previous work. If a story is too big, the LLM runs out of context before finishing and produces broken code.

### Right-sized stories for this extension:
- Add a new toggle to popup.html + popup settings storage
- Implement a new feature class in `src/features/`
- Update manifest.json with new permissions
- Add new CSS selectors/constants to an existing feature

### Too big (split these):
- "Add [Feature X]" → split into: feature class scaffold, content script logic, popup UI toggle, storage integration
- "Fix all bugs in feature Y" → split into one story per bug

**Rule of thumb:** If you cannot describe the change in 2-3 sentences, it's too big.

---

## Story Ordering: Dependencies First

Stories execute in priority order (priority 1 = first). Earlier stories must not depend on later ones.

**Correct order for extension features:**
1. manifest.json changes (permissions, content scripts)
2. Constants/selectors
3. Feature class scaffold
4. Core feature logic
5. Storage/settings integration
6. Popup UI
7. Visual/browser verification

**Wrong order:**
1. Popup UI (depends on storage keys that don't exist yet)
2. Storage keys

---

## Acceptance Criteria: Must Be Verifiable

Each criterion must be something an agent can CHECK, not something vague.

### Good criteria (verifiable):
- "Feature class file exists at `src/features/my-feature.js`"
- "Toggle appears in popup with correct label"
- "Setting persists after page reload"
- "Build passes (npm run build)"
- "No console errors when feature is enabled"

### Bad criteria (vague):
- "Works correctly"
- "User can do X easily"
- "Good UX"
- "Handles edge cases"

### Always include as final criterion for code changes:
```
"Build passes (npm run build)"
```

### For UI stories, always include:
```
"Reload extension in Chrome, navigate to YouTube, verify feature works visually"
```

---

## After Generating prd.json

Tell the user:

```
prd.json created. To run autonomous execution:

1. Ensure you have a compatible AI tool (Claude Code, Amp)
2. Run: ./scripts/ralph/ralph.sh --tool claude [max_iterations]

Or run stories manually by telling me:
"Work on US-001 from prd.json"
```

Also create `progress.txt` if it doesn't exist:
```
# Ralph Progress Log
Project: [project name]
Started: [date]
```
