/** Email body templates. Placeholders: {name} {team} {birthday} {payment}. */

export type Fields = {
  name: string;
  team: string;
  birthday: string;
  payment: string;
};

export type Template = {
  id: string;
  label: string;
  body: string;
};

export const TEMPLATES: Template[] = [
  {
    id: "casual",
    label: "Casual 🎂",
    body: `Hey all! 🎂
Our awesome colleague {name} (part of the {team} team) is celebrating their birthday on {birthday}!
Let's pool together for a gift — if you want to contribute, {payment}
Gift ideas are very welcome! 🙌`,
  },
  {
    id: "formal",
    label: "Formal 🤝",
    body: `Hi everyone,
{name} from the {team} team has a birthday coming up on {birthday}.
We're collecting for a group gift. To chip in: {payment}
Suggestions for the gift are welcome.`,
  },
  {
    id: "short",
    label: "Short 🎉",
    body: `🎉 {name} ({team}) turns another year older on {birthday}!
Chip in for a gift: {payment}`,
  },
];

/** Substitute field values into a template body. Empty fields stay as {placeholder}. */
export function render(body: string, fields: Fields): string {
  return body
    .replaceAll("{name}", fields.name || "{name}")
    .replaceAll("{team}", fields.team || "{team}")
    .replaceAll("{birthday}", fields.birthday || "{birthday}")
    .replaceAll("{payment}", fields.payment || "{payment}");
}
