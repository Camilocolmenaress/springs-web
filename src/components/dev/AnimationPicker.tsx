"use client";

import type { AnimationProp, Animation } from "@/types/design";

const C = { cream: "#F2E8D5", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;
const ANIM_LABELS: Record<Animation, string> = {
  "none": "Ninguna", "fade-up": "Fade up", "fade-in": "Fade in",
  "slide-left": "Slide left", "scale-in": "Scale in",
};

interface Props {
  label: string;
  prop: AnimationProp;
  onChange: (value: Animation) => void;
}

export default function AnimationPicker({ label, prop, onChange }: Props) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...MONO, fontSize: "0.52rem", color: C.cream, opacity: 0.65, letterSpacing: "0.08em", marginBottom: 3 }}>
        {label}
      </div>
      <select
        value={prop.value}
        onChange={e => onChange(e.target.value as Animation)}
        style={{
          width: "100%", padding: "4px 6px",
          background: "rgba(242,232,213,0.08)", color: C.mostaza,
          border: "1px solid rgba(242,232,213,0.15)",
          ...MONO, fontSize: "0.52rem", cursor: "pointer",
        }}
      >
        {prop.options.map(a => (
          <option key={a} value={a}>{ANIM_LABELS[a]}</option>
        ))}
      </select>
    </div>
  );
}
