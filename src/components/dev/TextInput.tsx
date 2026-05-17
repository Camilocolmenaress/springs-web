"use client";

const C = { cream: "#F2E8D5", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

export default function TextInput({ label, value, onChange, multiline }: Props) {
  const shared = {
    width: "100%", padding: "4px 6px",
    background: "rgba(242,232,213,0.08)", color: C.mostaza,
    border: "1px solid rgba(242,232,213,0.15)",
    ...MONO, fontSize: "0.52rem", resize: "none" as const,
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...MONO, fontSize: "0.52rem", color: C.cream, opacity: 0.65, letterSpacing: "0.08em", marginBottom: 3 }}>
        {label}
      </div>
      {multiline ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} style={shared} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} style={shared} />
      )}
    </div>
  );
}
