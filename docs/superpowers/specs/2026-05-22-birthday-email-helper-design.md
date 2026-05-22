# Birthday Email Helper — Design

Date: 2026-05-22

## Purpose

Single-page tool to compose "collecting money for a birthday gift" emails and
prepare the recipient list. Replaces hand-editing a repeated email each time.
No backend, no persistence.

## Stack

- Scaffolded with `bun init --react` (React + Bun bundler/dev server).
- Pure client-side React. No router, no backend, no storage (ephemeral state).

## Layout (top → bottom)

1. **Field inputs:** Name, Team, Birthday (free text, e.g. "May 21st"),
   Payment details (free text, e.g. "Revolut me @handle (Your Name)").
2. **Template dropdown:** Casual / Formal / Short. Selecting one fills the body.
3. **Body editor:** textarea, pre-filled from selected template + field values.
   Manual edit sets an `edited` lock that disables the field inputs and template
   dropdown (they would otherwise overwrite manual edits). A "Reset to template"
   button clears the lock and re-enables them.
4. **Recipients textarea:** paste an email blob (e.g. copied Gmail group).
5. **Exclude select:** searchable multi-select populated from the parsed emails;
   used to drop the birthday person's own address(es).
6. **Copy bar:** "Copy Body" and "Copy Recipients" buttons.

## Placeholders

`{name}` `{team}` `{birthday}` `{payment}` — substituted into template text.

## Templates

```
CASUAL:
Hey all! 🎂
Our awesome colleague {name} (part of the {team} team) is celebrating their birthday on {birthday}!
Let's pool together for a gift — if you want to contribute, {payment}
Gift ideas are very welcome! 🙌

FORMAL:
Hi everyone,
{name} from the {team} team has a birthday coming up on {birthday}.
We're collecting for a group gift. To chip in: {payment}
Suggestions for the gift are welcome.

SHORT:
🎉 {name} ({team}) turns another year older on {birthday}!
Chip in for a gift: {payment}
```

Empty fields render their placeholder literally (e.g. `{name}`) so the user sees
what is missing.

## State model

- `fields` (name, team, birthday, payment), `templateId`, `body`, `edited` flag,
  `rawRecipients` string, `excluded` set.
- Derived body: when `edited === false`, body = render(template[templateId], fields)
  recomputed whenever fields or templateId change.
- When user types in body textarea → `edited = true`, body becomes free.
- "Reset to template" → `edited = false`, body re-derived, inputs re-enabled.

## Recipient parsing

- Split `rawRecipients` on any run of: whitespace, newline, comma, semicolon.
- Trim, lowercase-dedupe (preserve first-seen original casing), drop empties.
- Exclude select options = parsed list. Final recipients = parsed − excluded.
- "Copy Recipients" copies final list joined by `, `.

## Components

- `App` — owns state, wires everything.
- `FieldInputs` — 4 inputs, disabled when `edited`.
- `TemplateSelect` — dropdown + (preview is just the body below it).
- `BodyEditor` — textarea + Reset button.
- `RecipientInput` — textarea.
- `ExcludeSelect` — searchable multi-select over parsed emails.
- `CopyBar` — two copy buttons; uses `navigator.clipboard.writeText`.

## Styling — Neo-brutalism

- Thick solid black borders (3–4px), hard offset box-shadows (no blur), flat
  bright accent colors, chunky bold typography, no gradients/rounded-soft looks.
- Buttons: solid fill, black border, offset shadow that collapses on
  `:active` (press-down effect).
- Off-white/paper background.

## Out of scope (YAGNI)

- No persistence, no backend, no auth, no email sending, no tests scaffold,
  no validation beyond email parsing.

## Open follow-ups

- None. Approved verbally including neo-brutalism styling on 2026-05-22.
- All example data is anonymized (no real names/handles in source or spec).
