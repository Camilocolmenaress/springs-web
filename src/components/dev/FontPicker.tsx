"use client";

import type { FontProp, FontFamily } from "@/types/design";

const C = { cream: "#F2E8D5", mostaza: "#C5871F", burgundy: "#6B1419" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;
const FONT_LABELS: Record<FontFamily, string> = { display: "Anton", sans: "Inter", mono: "JetBrains" };

interface Props {
  label: string;
  prop: FontProp;
  onChange: (value: FontFamily) => void;
}

export default function FontPicker({ label, prop, onChange }: Props) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...MONO, fontSize: "0.52rem", color: C.cream, opacity: 0.65, letterSpacing: "0.08em", marginBottom: 3 }}>
        {label}
      </div>
      <select
        value={prop.value}
        onChange={e => onChange(e.target.value as FontFamily)}
        style={{
          width: "100%", padding: "4px 6px",
          background: "rgba(242,232,213,0.08)", color: C.mostaza,
          border: "1px solid rgba(242,232,213,0.15)",
          ...MONO, fontSize: "0.52rem", cursor: "pointer",
        }}
      >
        {prop.options.map(f => (
          <option key={f} value={f}>{FONT_LABELS[f]}</option>
        ))}
      </select>
    </div>
  );
}
