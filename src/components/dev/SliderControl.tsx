"use client";

import type { SliderProp } from "@/types/design";

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;

interface Props {
  label: string;
  prop: SliderProp;
  onChange: (value: number) => void;
}

export default function SliderControl({ label, prop, onChange }: Props) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", marginBottom: 3,
        ...MONO, fontSize: "0.52rem", letterSpacing: "0.08em",
      }}>
        <span style={{ color: C.cream, opacity: 0.65 }}>{label}</span>
        <span style={{ color: C.mostaza }}>{prop.value}{prop.unit}</span>
      </div>
      <input
        type="range"
        min={prop.min} max={prop.max} step={prop.step}
        value={prop.value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: C.burgundy, cursor: "pointer" }}
      />
    </div>
  );
}
