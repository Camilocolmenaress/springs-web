"use client";

import type { ColorProp, BrandColor } from "@/types/design";

const COLORS: Record<BrandColor, string> = {
  burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F",
};
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;

interface Props {
  label: string;
  prop: ColorProp;
  onChange: (value: BrandColor) => void;
}

export default function ColorPicker({ label, prop, onChange }: Props) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...MONO, fontSize: "0.52rem", color: "#F2E8D5", opacity: 0.65, letterSpacing: "0.08em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {prop.options.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            title={c}
            style={{
              width: 22, height: 22,
              background: COLORS[c],
              border: prop.value === c ? "2px solid #C5871F" : "1px solid rgba(242,232,213,0.2)",
              cursor: "pointer", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
