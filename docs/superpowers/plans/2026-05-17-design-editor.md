# Design Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a schema-driven visual editor (DevPanel v2) that reads/writes JSON configs per page, enabling Camilo and Juan David to fine-tune layouts without code.

**Architecture:** Each page has a JSON config file defining zones with editable elements. The DevPanel reads the config schema and auto-generates controls (sliders, pickers, inputs). A `useDesignConfig` hook provides values to components — static at build-time, mutable in `?edit=1` mode. An API route writes changes back to disk (dev only). Playwright MCP gives Claude visual feedback.

**Tech Stack:** Next.js 16 App Router, TypeScript, Framer Motion, Playwright MCP

---

## File Map

| File | Action | Task |
|---|---|---|
| `src/types/design.ts` | Create | T1 |
| `src/data/design/home.json` | Create | T1 |
| `src/data/design/menu.json` | Create | T1 |
| `src/app/api/dev/design/route.ts` | Create | T2 |
| `src/app/api/dev/images/route.ts` | Create | T2 |
| `src/components/dev/SliderControl.tsx` | Create | T3 |
| `src/components/dev/FontPicker.tsx` | Create | T3 |
| `src/components/dev/ColorPicker.tsx` | Create | T3 |
| `src/components/dev/ImagePicker.tsx` | Create | T3 |
| `src/components/dev/AnimationPicker.tsx` | Create | T3 |
| `src/components/dev/TextInput.tsx` | Create | T3 |
| `src/hooks/useDesignConfig.ts` | Create | T4 |
| `src/components/DevPanel.tsx` | Rewrite | T5 |
| `src/app/page.tsx` | Modify | T6 |
| `src/app/menu/page.tsx` | Modify | T7 |
| `.claude/settings.json` | Modify | T8 |

---

## Task 1: Types & Config JSONs

**Goal:** Define the type system and create initial JSON configs for Home and Menu with values extracted from the current codebase.

**Files:**
- Create: `src/types/design.ts`
- Create: `src/data/design/home.json`
- Create: `src/data/design/menu.json`

- [ ] **Step 1: Create `src/types/design.ts`**

```typescript
export type FontFamily = "display" | "sans" | "mono";
export type BrandColor = "burgundy" | "cream" | "tinta" | "mostaza";
export type Animation = "none" | "fade-up" | "fade-in" | "slide-left" | "scale-in";

export interface SliderProp {
  value: number;
  unit: "vw" | "vh" | "px" | "rem";
  min: number;
  max: number;
  step: number;
}

export interface FontProp {
  value: FontFamily;
  options: FontFamily[];
}

export interface ColorProp {
  value: BrandColor;
  options: BrandColor[];
}

export interface ImageProp {
  value: string;
  folder: string;
}

export interface AnimationProp {
  value: Animation;
  options: Animation[];
}

export interface TextElement {
  type: "text";
  props: Record<string, SliderProp | FontProp | ColorProp | AnimationProp | string>;
}

export interface ImageElement {
  type: "image";
  props: Record<string, SliderProp | ImageProp | AnimationProp>;
}

export type DesignElement = TextElement | ImageElement;

export interface Zone {
  label: string;
  elements: Record<string, DesignElement>;
}

export interface PageConfig {
  page: string;
  zones: Record<string, Zone>;
}
```

- [ ] **Step 2: Create directory**

```bash
mkdir -p src/data/design
```

- [ ] **Step 3: Create `src/data/design/home.json`**

Values extracted from current `DEFAULT_DESIGN` in `src/app/page.tsx` (lines 48-57) and inline styles (lines 203-298).

```json
{
  "page": "home",
  "zones": {
    "hero": {
      "label": "Hero principal",
      "elements": {
        "title": {
          "type": "text",
          "props": {
            "content": "SPRINGS",
            "fontSize": { "value": 22, "unit": "vw", "min": 10, "max": 30, "step": 0.5 },
            "left": { "value": 37, "unit": "vw", "min": 10, "max": 70, "step": 1 },
            "top": { "value": 14, "unit": "vh", "min": 0, "max": 50, "step": 1 },
            "fontFamily": { "value": "display", "options": ["display", "sans", "mono"] },
            "color": { "value": "tinta", "options": ["burgundy", "cream", "tinta", "mostaza"] }
          }
        },
        "subtitle": {
          "type": "text",
          "props": {
            "content": "Jackets That Hit Different.",
            "fontSize": { "value": 2.6, "unit": "vw", "min": 1, "max": 6, "step": 0.1 },
            "fontFamily": { "value": "sans", "options": ["display", "sans", "mono"] },
            "color": { "value": "burgundy", "options": ["burgundy", "cream", "tinta", "mostaza"] },
            "animation": { "value": "fade-up", "options": ["none", "fade-up", "fade-in", "slide-left", "scale-in"] }
          }
        },
        "image": {
          "type": "image",
          "props": {
            "src": { "value": "/images/la-fija.png", "folder": "/images" },
            "width": { "value": 52, "unit": "vw", "min": 20, "max": 90, "step": 1 },
            "left": { "value": -2, "unit": "vw", "min": -20, "max": 50, "step": 1 },
            "bottom": { "value": 40, "unit": "px", "min": -100, "max": 300, "step": 5 }
          }
        },
        "bodyCopy": {
          "type": "text",
          "props": {
            "content": "NO ES SOLO COMIDA.\nES UN PLAN.\nES UN LUGAR.\nES SPRINGS.",
            "left": { "value": 38, "unit": "vw", "min": 20, "max": 70, "step": 1 },
            "fontSize": { "value": 0.68, "unit": "rem", "min": 0.5, "max": 1.5, "step": 0.02 },
            "color": { "value": "tinta", "options": ["burgundy", "cream", "tinta", "mostaza"] },
            "animation": { "value": "fade-up", "options": ["none", "fade-up", "fade-in", "slide-left", "scale-in"] }
          }
        }
      }
    }
  }
}
```

- [ ] **Step 4: Create `src/data/design/menu.json`**

```json
{
  "page": "menu",
  "zones": {
    "header": {
      "label": "Header menú",
      "elements": {
        "title": {
          "type": "text",
          "props": {
            "content": "NUESTRA CARTA",
            "fontSize": { "value": 3, "unit": "vw", "min": 1, "max": 8, "step": 0.1 },
            "fontFamily": { "value": "display", "options": ["display", "sans", "mono"] },
            "color": { "value": "tinta", "options": ["burgundy", "cream", "tinta", "mostaza"] }
          }
        }
      }
    },
    "carousel": {
      "label": "Carrusel productos",
      "elements": {
        "productImage": {
          "type": "image",
          "props": {
            "src": { "value": "/images/la-fija.png", "folder": "/images" },
            "width": { "value": 60, "unit": "vw", "min": 30, "max": 95, "step": 1 }
          }
        },
        "productName": {
          "type": "text",
          "props": {
            "content": "LA FIJA",
            "fontSize": { "value": 2.5, "unit": "rem", "min": 1, "max": 5, "step": 0.1 },
            "fontFamily": { "value": "display", "options": ["display", "sans", "mono"] },
            "color": { "value": "tinta", "options": ["burgundy", "cream", "tinta", "mostaza"] }
          }
        },
        "price": {
          "type": "text",
          "props": {
            "content": "32,900",
            "fontSize": { "value": 1.2, "unit": "rem", "min": 0.8, "max": 3, "step": 0.1 },
            "fontFamily": { "value": "mono", "options": ["display", "sans", "mono"] },
            "color": { "value": "tinta", "options": ["burgundy", "cream", "tinta", "mostaza"] }
          }
        }
      }
    }
  }
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: build passes — JSON files are just data, types file has no runtime code.

- [ ] **Step 6: Commit**

```bash
git add src/types/design.ts src/data/design/home.json src/data/design/menu.json
git commit -m "feat(CAM): types y config JSONs para design editor — home + menu"
```

---

## Task 2: API Routes (dev-only)

**Goal:** Create endpoints to save config changes to disk and list available images.

**Files:**
- Create: `src/app/api/dev/design/route.ts`
- Create: `src/app/api/dev/images/route.ts`

- [ ] **Step 1: Create `src/app/api/dev/design/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Solo disponible en desarrollo." }, { status: 403 });
  }

  const { page, config } = await request.json();

  if (!page || !config) {
    return NextResponse.json({ error: "Faltan page o config." }, { status: 400 });
  }

  const safePage = page.replace(/[^a-z0-9-]/gi, "");
  const filePath = path.join(process.cwd(), "src", "data", "design", `${safePage}.json`);

  await writeFile(filePath, JSON.stringify(config, null, 2) + "\n");

  return NextResponse.json({ ok: true, path: filePath });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");

  if (!page) {
    return NextResponse.json({ error: "Falta parametro page." }, { status: 400 });
  }

  const safePage = page.replace(/[^a-z0-9-]/gi, "");
  const filePath = path.join(process.cwd(), "src", "data", "design", `${safePage}.json`);

  try {
    const content = await readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Config no encontrado." }, { status: 404 });
  }
}
```

- [ ] **Step 2: Create `src/app/api/dev/images/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  const imagesDir = path.join(process.cwd(), "public", "images");

  try {
    const files = await readdir(imagesDir);
    const images = files
      .filter(f => /\.(png|jpg|jpeg|webp|avif)$/i.test(f))
      .map(f => `/images/${f}`);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: build passes, two new dynamic routes appear in output.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/dev/design/route.ts src/app/api/dev/images/route.ts
git commit -m "feat(CAM): API routes dev — guardar config + listar imágenes"
```

---

## Task 3: DevPanel Control Components

**Goal:** Create the 6 individual UI controls that the DevPanel will compose.

**Files:**
- Create: `src/components/dev/SliderControl.tsx`
- Create: `src/components/dev/FontPicker.tsx`
- Create: `src/components/dev/ColorPicker.tsx`
- Create: `src/components/dev/ImagePicker.tsx`
- Create: `src/components/dev/AnimationPicker.tsx`
- Create: `src/components/dev/TextInput.tsx`

All controls share these design constants:

```typescript
// Used inline in each component — NOT a shared file (keeps each component self-contained)
const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;
```

- [ ] **Step 1: Create `src/components/dev/SliderControl.tsx`**

```typescript
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
```

- [ ] **Step 2: Create `src/components/dev/FontPicker.tsx`**

```typescript
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
          border: `1px solid rgba(242,232,213,0.15)`,
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
```

- [ ] **Step 3: Create `src/components/dev/ColorPicker.tsx`**

```typescript
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
```

- [ ] **Step 4: Create `src/components/dev/ImagePicker.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import type { ImageProp } from "@/types/design";

const C = { cream: "#F2E8D5", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;

interface Props {
  label: string;
  prop: ImageProp;
  onChange: (value: string) => void;
}

export default function ImagePicker({ label, prop, onChange }: Props) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/dev/images")
      .then(r => r.json())
      .then(d => setImages(d.images || []))
      .catch(() => setImages([]));
  }, []);

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...MONO, fontSize: "0.52rem", color: C.cream, opacity: 0.65, letterSpacing: "0.08em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
        {images.map(src => (
          <button
            key={src}
            onClick={() => onChange(src)}
            style={{
              width: "100%", aspectRatio: "1", padding: 0, cursor: "pointer",
              border: prop.value === src ? "2px solid #C5871F" : "1px solid rgba(242,232,213,0.15)",
              background: "rgba(242,232,213,0.06)", overflow: "hidden",
            }}
          >
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/dev/AnimationPicker.tsx`**

```typescript
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
          border: `1px solid rgba(242,232,213,0.15)`,
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
```

- [ ] **Step 6: Create `src/components/dev/TextInput.tsx`**

```typescript
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
    border: `1px solid rgba(242,232,213,0.15)`,
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
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: build passes — all components are standalone client components.

- [ ] **Step 8: Commit**

```bash
git add src/components/dev/
git commit -m "feat(CAM): 6 controles del design editor — slider, font, color, image, animation, text"
```

---

## Task 4: useDesignConfig Hook

**Goal:** Create a hook that provides design values to components — static in production, mutable in edit mode.

**Files:**
- Create: `src/hooks/useDesignConfig.ts`

- [ ] **Step 1: Create `src/hooks/useDesignConfig.ts`**

```typescript
"use client";

import { useState, useCallback, useEffect } from "react";
import type { PageConfig, DesignElement, SliderProp, FontProp, ColorProp, ImageProp, AnimationProp } from "@/types/design";

import homeConfig from "@/data/design/home.json";
import menuConfig from "@/data/design/menu.json";

const configs: Record<string, PageConfig> = {
  home: homeConfig as unknown as PageConfig,
  menu: menuConfig as unknown as PageConfig,
};

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function useDesignConfig(page: string) {
  const [editMode, setEditMode] = useState(false);
  const [config, setConfig] = useState<PageConfig>(() => deepClone(configs[page]));
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setEditMode(new URLSearchParams(window.location.search).get("edit") === "1");
  }, []);

  const updateProp = useCallback((
    zone: string,
    element: string,
    propKey: string,
    value: string | number,
  ) => {
    setConfig(prev => {
      const next = deepClone(prev);
      const prop = next.zones[zone]?.elements[element]?.props[propKey];
      if (!prop) return prev;

      if (typeof prop === "string") {
        next.zones[zone].elements[element].props[propKey] = value as string;
      } else if ("unit" in prop) {
        (prop as SliderProp).value = value as number;
      } else if ("folder" in prop) {
        (prop as ImageProp).value = value as string;
      } else if ("options" in prop) {
        (prop as FontProp | ColorProp | AnimationProp).value = value as never;
      }
      return next;
    });
    setSaved(false);
  }, []);

  const save = useCallback(async () => {
    const res = await fetch("/api/dev/design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, config }),
    });
    if (res.ok) setSaved(true);
    return res.ok;
  }, [page, config]);

  const reset = useCallback(() => {
    setConfig(deepClone(configs[page]));
    setSaved(true);
  }, [page]);

  const exportValues = useCallback(() => {
    const lines: string[] = [`/* ── DESIGN CONFIG: ${page} ── */`];
    for (const [zoneKey, zone] of Object.entries(config.zones)) {
      lines.push(`\n// ${zone.label}`);
      for (const [elemKey, elem] of Object.entries(zone.elements)) {
        for (const [propKey, prop] of Object.entries(elem.props)) {
          if (typeof prop === "string") {
            lines.push(`${zoneKey}.${elemKey}.${propKey}: "${prop}"`);
          } else if ("unit" in prop) {
            lines.push(`${zoneKey}.${elemKey}.${propKey}: "${(prop as SliderProp).value}${(prop as SliderProp).unit}"`);
          } else if ("folder" in prop) {
            lines.push(`${zoneKey}.${elemKey}.${propKey}: "${(prop as ImageProp).value}"`);
          } else if ("options" in prop) {
            lines.push(`${zoneKey}.${elemKey}.${propKey}: "${(prop as FontProp).value}"`);
          }
        }
      }
    }
    const text = lines.join("\n");
    navigator.clipboard.writeText(text);
    return text;
  }, [config, page]);

  return { config, editMode, saved, updateProp, save, reset, exportValues };
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build passes. Hook imports JSON files which Next.js bundles at build time.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useDesignConfig.ts
git commit -m "feat(CAM): useDesignConfig hook — config estático en prod, editable en ?edit=1"
```

---

## Task 5: DevPanel v2

**Goal:** Rewrite the DevPanel to be schema-driven — reads zones/elements from config, auto-generates the appropriate controls.

**Files:**
- Rewrite: `src/components/DevPanel.tsx`

- [ ] **Step 1: Rewrite `src/components/DevPanel.tsx`**

```typescript
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { PageConfig, SliderProp, FontProp, ColorProp, ImageProp, AnimationProp } from "@/types/design";
import SliderControl from "@/components/dev/SliderControl";
import FontPicker from "@/components/dev/FontPicker";
import ColorPicker from "@/components/dev/ColorPicker";
import ImagePicker from "@/components/dev/ImagePicker";
import AnimationPicker from "@/components/dev/AnimationPicker";
import TextInput from "@/components/dev/TextInput";

const C = { burgundy: "#6B1419", cream: "#F2E8D5", tinta: "#1A0A0C", mostaza: "#C5871F" };
const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;

const PROP_LABELS: Record<string, string> = {
  fontSize: "Tamaño", left: "Left", top: "Top", bottom: "Bottom",
  width: "Ancho", content: "Texto", fontFamily: "Fuente",
  color: "Color", src: "Imagen", animation: "Animación",
};

interface Props {
  config: PageConfig;
  saved: boolean;
  onUpdate: (zone: string, element: string, propKey: string, value: string | number) => void;
  onSave: () => void;
  onExport: () => void;
  onReset: () => void;
}

export default function DevPanel({ config, saved, onUpdate, onSave, onExport, onReset }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [openZones, setOpenZones] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleZone = (key: string) => {
    setOpenZones(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    onExport();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{
        position: "fixed", right: 16, top: "15%",
        zIndex: 9999, width: 280,
        background: C.tinta,
        border: "1px solid rgba(242,232,213,0.15)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        cursor: "grab", userSelect: "none",
        maxHeight: "70vh", display: "flex", flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "9px 12px",
          borderBottom: "1px solid rgba(242,232,213,0.1)",
          background: C.burgundy, cursor: "grab", flexShrink: 0,
        }}
        onClick={() => setCollapsed(v => !v)}
      >
        <span style={{ ...MONO, fontSize: "0.58rem", letterSpacing: "0.2em", color: C.cream }}>
          SPRINGS DEV {!saved && "●"}
        </span>
        <span style={{ color: C.cream, fontSize: "0.6rem" }}>{collapsed ? "+" : "-"}</span>
      </div>

      {!collapsed && (
        <>
          {/* Zones */}
          <div style={{ overflowY: "auto", flex: 1, padding: "6px 0" }}>
            {Object.entries(config.zones).map(([zoneKey, zone]) => (
              <div key={zoneKey}>
                {/* Zone header */}
                <div
                  onClick={() => toggleZone(zoneKey)}
                  style={{
                    padding: "6px 12px", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderBottom: "1px solid rgba(242,232,213,0.06)",
                  }}
                >
                  <span style={{ ...MONO, fontSize: "0.54rem", letterSpacing: "0.12em", color: C.cream, opacity: 0.8 }}>
                    {openZones[zoneKey] ? "▾" : "▸"} {zone.label.toUpperCase()}
                  </span>
                </div>

                {/* Zone elements */}
                {openZones[zoneKey] && (
                  <div style={{ padding: "8px 12px" }}>
                    {Object.entries(zone.elements).map(([elemKey, elem]) => (
                      <div key={elemKey} style={{
                        marginBottom: 14,
                        padding: "8px",
                        background: "rgba(242,232,213,0.04)",
                        border: "1px solid rgba(242,232,213,0.08)",
                      }}>
                        <div style={{
                          ...MONO, fontSize: "0.5rem", letterSpacing: "0.15em",
                          color: C.mostaza, marginBottom: 8, textTransform: "uppercase",
                        }}>
                          {elemKey}
                        </div>

                        {Object.entries(elem.props).map(([propKey, prop]) => {
                          const label = PROP_LABELS[propKey] || propKey;

                          if (typeof prop === "string") {
                            return (
                              <TextInput
                                key={propKey}
                                label={label}
                                value={prop}
                                onChange={v => onUpdate(zoneKey, elemKey, propKey, v)}
                                multiline={prop.includes("\n")}
                              />
                            );
                          }

                          if ("unit" in prop) {
                            return (
                              <SliderControl
                                key={propKey}
                                label={label}
                                prop={prop as SliderProp}
                                onChange={v => onUpdate(zoneKey, elemKey, propKey, v)}
                              />
                            );
                          }

                          if ("folder" in prop) {
                            return (
                              <ImagePicker
                                key={propKey}
                                label={label}
                                prop={prop as ImageProp}
                                onChange={v => onUpdate(zoneKey, elemKey, propKey, v)}
                              />
                            );
                          }

                          if ("options" in prop && "value" in prop) {
                            const p = prop as FontProp | ColorProp | AnimationProp;
                            if (["display", "sans", "mono"].includes(p.value as string)) {
                              return <FontPicker key={propKey} label={label} prop={p as FontProp} onChange={v => onUpdate(zoneKey, elemKey, propKey, v)} />;
                            }
                            if (["burgundy", "cream", "tinta", "mostaza"].includes(p.value as string)) {
                              return <ColorPicker key={propKey} label={label} prop={p as ColorProp} onChange={v => onUpdate(zoneKey, elemKey, propKey, v)} />;
                            }
                            if (["none", "fade-up", "fade-in", "slide-left", "scale-in"].includes(p.value as string)) {
                              return <AnimationPicker key={propKey} label={label} prop={p as AnimationProp} onChange={v => onUpdate(zoneKey, elemKey, propKey, v)} />;
                            }
                          }

                          return null;
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(242,232,213,0.1)", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1, padding: "8px 0",
                  background: saving ? C.mostaza : saved ? "rgba(242,232,213,0.1)" : C.burgundy,
                  color: C.cream, border: "none",
                  ...MONO, fontSize: "0.54rem", letterSpacing: "0.14em", cursor: "pointer",
                }}
              >
                {saving ? "..." : saved ? "GUARDADO" : "GUARDAR"}
              </button>
              <button
                onClick={handleExport}
                style={{
                  flex: 1, padding: "8px 0",
                  background: copied ? "#2a5a2a" : "rgba(242,232,213,0.1)",
                  color: C.cream, border: "none",
                  ...MONO, fontSize: "0.54rem", letterSpacing: "0.14em", cursor: "pointer",
                }}
              >
                {copied ? "COPIADO" : "COPIAR"}
              </button>
            </div>
            <button
              onClick={onReset}
              style={{
                width: "100%", padding: "6px 0",
                background: "transparent", color: C.cream, opacity: 0.4,
                border: "1px solid rgba(242,232,213,0.1)",
                ...MONO, fontSize: "0.48rem", letterSpacing: "0.14em", cursor: "pointer",
              }}
            >
              RESET
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build passes. DevPanel imports all 6 controls correctly.

- [ ] **Step 3: Commit**

```bash
git add src/components/DevPanel.tsx
git commit -m "feat(CAM): DevPanel v2 — schema-driven, GUARDAR/COPIAR/RESET"
```

---

## Task 6: Integrate Home Page

**Goal:** Wire `src/app/page.tsx` to read design values from the config via `useDesignConfig` and render the DevPanel v2 in edit mode.

**Files:**
- Modify: `src/app/page.tsx`

**Strategy:** Replace the current `DEFAULT_DESIGN` + `DesignValues` interface + old DevPanel import with `useDesignConfig("home")`. The existing inline styles that use `design.titleSize`, `design.potatoLeft`, etc. need to be updated to read from the config structure: `config.zones.hero.elements.title.props.fontSize.value`.

To keep the diff minimal and avoid rewriting the entire 896-line file, create a helper that extracts flat values from the config — matching the current `DesignValues` shape.

- [ ] **Step 1: Modify imports and state in `src/app/page.tsx`**

Replace lines 1-70 (imports, hooks, DEFAULT_DESIGN, component head):

Old imports to remove:
```typescript
import DevPanel, { type DesignValues } from "@/components/DevPanel";
```

New imports to add:
```typescript
import DevPanel from "@/components/DevPanel";
import { useDesignConfig } from "@/hooks/useDesignConfig";
```

Remove:
- The `DEFAULT_DESIGN` const (lines 48-57)
- The `design` and `potatoDrag` state (lines 65-66)
- The `setVal` callback (lines 68-70)

Replace with:
```typescript
const { config, editMode: configEditMode, saved, updateProp, save, reset, exportValues } = useDesignConfig("home");

// Flat accessor for backward compatibility with existing inline styles
const hero = config.zones.hero?.elements;
const d = {
  titleSize: (hero?.title?.props?.fontSize as { value: number })?.value ?? 22,
  titleLeft: (hero?.title?.props?.left as { value: number })?.value ?? 37,
  titleTop: (hero?.title?.props?.top as { value: number })?.value ?? 14,
  potatoWidth: (hero?.image?.props?.width as { value: number })?.value ?? 52,
  potatoLeft: (hero?.image?.props?.left as { value: number })?.value ?? -2,
  potatoBottom: (hero?.image?.props?.bottom as { value: number })?.value ?? 40,
  subtitleSize: (hero?.subtitle?.props?.fontSize as { value: number })?.value ?? 2.6,
  bodyCopyLeft: (hero?.bodyCopy?.props?.left as { value: number })?.value ?? 38,
  heroImage: (hero?.image?.props?.src as { value: string })?.value ?? "/images/la-fija.png",
};
```

Then replace all `design.titleSize` references with `d.titleSize`, etc. Replace `editMode` with `configEditMode` (since the hook now manages edit mode). Remove the old `useEditMode()` call.

- [ ] **Step 2: Replace DevPanel rendering**

Find the old DevPanel render (near the end of the component, after all the visual zones) and replace with:

```tsx
{configEditMode && (
  <DevPanel
    config={config}
    saved={saved}
    onUpdate={updateProp}
    onSave={save}
    onExport={exportValues}
    onReset={reset}
  />
)}
```

Remove the old DevPanel render with its `values`, `onChange`, `potatoDragOffset` props.

- [ ] **Step 3: Update image src**

Replace the hardcoded `/images/la-fija.png` in the hero `<motion.img>` (around line 204) with `d.heroImage`.

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: build passes. Home page now reads from config JSON.

- [ ] **Step 5: Manual verification**

```bash
npm run dev
```

Open `http://localhost:3000` — should look identical to current state.
Open `http://localhost:3000?edit=1` — DevPanel v2 should appear with zone-grouped controls.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(CAM): home integrado con design editor — config JSON + DevPanel v2"
```

---

## Task 7: Integrate Menu Page

**Goal:** Add design editor support to the menu page.

**Files:**
- Modify: `src/app/menu/page.tsx`

- [ ] **Step 1: Modify `src/app/menu/page.tsx`**

The menu page is simple (37 lines) — it renders the `<Menu />` component. Add the DevPanel v2 overlay:

```typescript
"use client";

import Link from "next/link";
import Menu from "@/components/Menu";
import DevPanel from "@/components/DevPanel";
import { useDesignConfig } from "@/hooks/useDesignConfig";

export default function MenuPage() {
  const { config, editMode, saved, updateProp, save, reset, exportValues } = useDesignConfig("menu");

  return (
    <main style={{ width: "100vw", height: "100vh", overflowY: "auto", background: "var(--cream)", position: "relative" }}>
      <Link
        href="/"
        aria-label="Volver al home"
        style={{
          position: "fixed",
          top: "max(16px, env(safe-area-inset-top, 16px))",
          left: 16,
          zIndex: 50,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          background: "var(--cream)",
          color: "var(--tinta)",
          border: "1px solid var(--tinta)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textDecoration: "none",
          mixBlendMode: "multiply",
        }}
      >
        <span aria-hidden>←</span> VOLVER
      </Link>
      <Menu onAgregar={(p) => console.log("AGREGAR", p.nombre)} />
      {editMode && (
        <DevPanel
          config={config}
          saved={saved}
          onUpdate={updateProp}
          onSave={save}
          onExport={exportValues}
          onReset={reset}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add src/app/menu/page.tsx
git commit -m "feat(CAM): menú integrado con design editor — DevPanel v2 en ?edit=1"
```

---

## Task 8: Playwright MCP

**Goal:** Install Playwright MCP so Claude can take screenshots and see the UI.

**Files:**
- Modify: `.claude/settings.json`

- [ ] **Step 1: Install dependencies**

```bash
npm install -D @anthropic-ai/mcp-playwright playwright
npx playwright install chromium
```

Note: if `@anthropic-ai/mcp-playwright` doesn't exist, use `@playwright/mcp` instead:
```bash
npm install -D @playwright/mcp playwright
npx playwright install chromium
```

- [ ] **Step 2: Update `.claude/settings.json`**

Read the current file first, then replace with:

```json
{
  "enableAllProjectMcpServers": true,
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp", "--browser", "chromium"]
    }
  }
}
```

- [ ] **Step 3: Verify Playwright works**

```bash
npx playwright install chromium --with-deps 2>/dev/null; echo "done"
```

Expected: chromium browser installed for Playwright.

- [ ] **Step 4: Commit**

```bash
git add .claude/settings.json package.json package-lock.json
git commit -m "feat(CAM): Playwright MCP — Claude puede ver el UI"
```

- [ ] **Step 5: Push all changes**

```bash
git push origin main
```

---

## Execution Order

Tasks must be executed in order (each builds on the previous):

```
T1 (types + configs) → T2 (API routes) → T3 (controls) → T4 (hook) → T5 (DevPanel v2) → T6 (home) → T7 (menu) → T8 (Playwright)
```
