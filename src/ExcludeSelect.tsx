import { useMemo, useRef, useState } from "react";

type Props = {
  options: string[];
  excluded: string[];
  onChange: (next: string[]) => void;
};

/** Searchable multi-select. Pick emails to exclude from the final recipient list. */
export function ExcludeSelect({ options, excluded, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const excludedSet = useMemo(() => new Set(excluded), [excluded]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter(o => !excludedSet.has(o) && (q === "" || o.toLowerCase().includes(q)));
  }, [options, excludedSet, query]);

  function toggle(email: string) {
    if (excludedSet.has(email)) onChange(excluded.filter(e => e !== email));
    else onChange([...excluded, email]);
  }

  return (
    <div className="exclude" ref={boxRef}>
      <div className="chips">
        {excluded.length === 0 && <span className="chips-empty">No one excluded yet</span>}
        {excluded.map(e => (
          <button type="button" key={e} className="chip" onClick={() => toggle(e)} title="Click to re-include">
            {e} ✕
          </button>
        ))}
      </div>

      <input
        className="nb-input"
        type="text"
        placeholder={options.length ? "Search emails to exclude…" : "Paste recipients above first"}
        value={query}
        disabled={options.length === 0}
        onFocus={() => setOpen(true)}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />

      {open && options.length > 0 && (
        <div className="dropdown">
          {matches.length === 0 && <div className="dropdown-empty">No matches</div>}
          {matches.map(o => (
            <button type="button" key={o} className="option" onClick={() => toggle(o)}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
