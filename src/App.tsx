import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { TEMPLATES, render, type Fields } from "./templates";
import { parseEmails } from "./emails";
import { ExcludeSelect } from "./ExcludeSelect";

export function App() {
  const [fields, setFields] = useState<Fields>({ name: "", team: "", birthday: "", payment: "" });
  const [templateId, setTemplateId] = useState(TEMPLATES[0]!.id);
  const [body, setBody] = useState("");
  const [edited, setEdited] = useState(false);

  const [rawRecipients, setRawRecipients] = useState("");
  const [excluded, setExcluded] = useState<string[]>([]);

  const template = useMemo(() => TEMPLATES.find(t => t.id === templateId)!, [templateId]);

  // Derive body from template + fields, unless the user has taken manual control.
  useEffect(() => {
    if (!edited) setBody(render(template.body, fields));
  }, [template, fields, edited]);

  const parsed = useMemo(() => parseEmails(rawRecipients), [rawRecipients]);

  // Only exclusions still present in the parsed list count. Derived, not stored —
  // storing this (via a setState-in-effect) caused an infinite render loop.
  const activeExcluded = useMemo(() => {
    const set = new Set(parsed);
    return excluded.filter(e => set.has(e));
  }, [parsed, excluded]);

  const finalRecipients = useMemo(() => {
    const ex = new Set(activeExcluded);
    return parsed.filter(e => !ex.has(e));
  }, [parsed, activeExcluded]);

  function setField(key: keyof Fields, value: string) {
    setFields(f => ({ ...f, [key]: value }));
  }

  function resetToTemplate() {
    setEdited(false);
    setBody(render(template.body, fields));
  }

  return (
    <main className="app">
      <header className="title-bar">
        <h1>🎂 Birthday Email Helper</h1>
        <p>Compose the gift-collection email and prep recipients.</p>
      </header>

      <section className="card">
        <h2>1 · Details {edited && <span className="lock">🔒 locked while editing body</span>}</h2>
        <div className="grid">
          <label>
            <span>Name</span>
            <input className="nb-input" disabled={edited} value={fields.name}
              onChange={e => setField("name", e.target.value)} placeholder="Jane Doe" />
          </label>
          <label>
            <span>Team</span>
            <input className="nb-input" disabled={edited} value={fields.team}
              onChange={e => setField("team", e.target.value)} placeholder="Acme" />
          </label>
          <label>
            <span>Birthday</span>
            <input className="nb-input" disabled={edited} value={fields.birthday}
              onChange={e => setField("birthday", e.target.value)} placeholder="May 21st" />
          </label>
          <label>
            <span>Payment details</span>
            <input className="nb-input" disabled={edited} value={fields.payment}
              onChange={e => setField("payment", e.target.value)} placeholder="Revolut me @handle (Your Name)" />
          </label>
        </div>
      </section>

      <section className="card">
        <h2>2 · Template</h2>
        <select className="nb-input" disabled={edited} value={templateId}
          onChange={e => setTemplateId(e.target.value)}>
          {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </section>

      <section className="card">
        <div className="row-between">
          <h2>3 · Body</h2>
          {edited && <button type="button" className="nb-btn ghost" onClick={resetToTemplate}>↺ Reset to template</button>}
        </div>
        <textarea
          className="nb-input body"
          value={body}
          rows={8}
          onChange={e => { setBody(e.target.value); setEdited(true); }}
        />
        <p className="hint">{edited
          ? "You're editing the body manually — details & template are locked. Reset to unlock."
          : "Edit this directly to take manual control (locks the inputs above)."}</p>
      </section>

      <section className="card">
        <h2>4 · Recipients</h2>
        <textarea
          className="nb-input"
          rows={4}
          placeholder="Paste emails — space, comma, semicolon or newline separated"
          value={rawRecipients}
          onChange={e => setRawRecipients(e.target.value)}
        />
        <p className="hint">{parsed.length} parsed · {finalRecipients.length} after exclusions</p>
      </section>

      <section className="card">
        <h2>5 · Exclude (e.g. the birthday person)</h2>
        <ExcludeSelect options={parsed} excluded={activeExcluded} onChange={setExcluded} />
      </section>

      <CopyBar body={body} recipients={finalRecipients.join(", ")} />
    </main>
  );
}

function CopyBar({ body, recipients }: { body: string; recipients: string }) {
  const [copied, setCopied] = useState<"body" | "recipients" | null>(null);

  async function copy(text: string, which: "body" | "recipients") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(c => (c === which ? null : c)), 1500);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="copy-bar">
      <button type="button" className="nb-btn primary" onClick={() => copy(body, "body")}>
        {copied === "body" ? "✓ Copied!" : "📋 Copy Body"}
      </button>
      <button type="button" className="nb-btn accent" onClick={() => copy(recipients, "recipients")}>
        {copied === "recipients" ? "✓ Copied!" : "📋 Copy Recipients"}
      </button>
    </div>
  );
}
