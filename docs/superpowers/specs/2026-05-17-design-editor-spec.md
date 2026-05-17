# Springs Design Editor — Spec

## Resumen

Sistema de edición visual para que Camilo y Juan David ajusten las páginas de Springs sin escribir código. Claude genera el layout inicial, Playwright le permite ver el resultado, y el DevPanel permite ajustes finos que se persisten en archivos JSON por página.

## Decisiones de arquitectura

### Storage: JSON en el repo (no Supabase)
- Archivos JSON por página en `src/data/design/`
- Se commitean al repo como cualquier archivo
- Git trackea el historial de cambios del diseño
- Ambos devs ven los cambios al hacer pull
- Sin complejidad de DB, sin latencia de red

### Páginas v1: Home + Menu
- `src/data/design/home.json`
- `src/data/design/menu.json`
- Agregar una página nueva al editor = agregar un JSON + schema

### Playwright MCP para Claude
- Instalar `@playwright/mcp` en el proyecto
- Claude puede navegar a cualquier página, tomar screenshot, y autocorregirse
- Cierra el loop visual: Claude ya no codea a ciegas

---

## Estructura de un config JSON

Cada página se divide en **zonas**. Cada zona tiene **elementos editables**. Cada elemento tiene **propiedades** con tipos específicos.

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
            "fontSize": { "value": 18, "unit": "vw", "min": 10, "max": 30, "step": 0.5 },
            "left": { "value": 35, "unit": "vw", "min": 10, "max": 70, "step": 1 },
            "top": { "value": 15, "unit": "vh", "min": 0, "max": 50, "step": 1 },
            "fontFamily": { "value": "display", "options": ["display", "sans", "mono"] },
            "color": { "value": "cream", "options": ["burgundy", "cream", "tinta", "mostaza"] }
          }
        },
        "image": {
          "type": "image",
          "props": {
            "src": { "value": "/images/la-fija.png", "folder": "/images" },
            "width": { "value": 55, "unit": "vw", "min": 20, "max": 90, "step": 1 },
            "left": { "value": 5, "unit": "vw", "min": -20, "max": 50, "step": 1 },
            "bottom": { "value": 80, "unit": "px", "min": -100, "max": 300, "step": 5 }
          }
        },
        "subtitle": {
          "type": "text",
          "props": {
            "content": "JACKET POTATOES",
            "fontSize": { "value": 2.5, "unit": "vw", "min": 1, "max": 6, "step": 0.1 },
            "fontFamily": { "value": "sans", "options": ["display", "sans", "mono"] },
            "animation": { "value": "fade-up", "options": ["none", "fade-up", "fade-in", "slide-left", "scale-in"] }
          }
        }
      }
    }
  }
}
```

### Tipos de propiedades editables

| Tipo | Control en DevPanel | Ejemplo |
|---|---|---|
| **Numérico con rango** | Slider | fontSize, left, top, width, bottom |
| **Selector de fuente** | Dropdown (3 opciones) | Anton, Inter, JetBrains Mono |
| **Selector de color** | 4 botones de color | burgundy, cream, tinta, mostaza |
| **Selector de imagen** | Grid de thumbnails de `/public/images/` | swap foto de producto |
| **Selector de animación** | Dropdown | none, fade-up, fade-in, slide-left, scale-in |
| **Texto** | Input de texto | contenido de títulos y subtítulos |
| **Toggle** | Switch on/off | mostrar/ocultar un elemento |

---

## DevPanel v2

### Evolución del DevPanel actual de JD

El DevPanel actual tiene:
- 8 sliders hardcodeados para el home
- Drag de la papa con coordenadas en tiempo real
- Botón "COPIAR VALORES" al clipboard

El DevPanel v2:
- **Schema-driven**: lee el JSON de la página y genera los controles automáticamente
- **Agrupado por zona**: secciones colapsables (Hero, Editorial, Pedir)
- **Todos los tipos de control**: sliders, dropdowns, color pickers, image picker, text inputs
- **Drag en cualquier elemento**: no solo la papa — cualquier elemento con position absolute
- **Botón GUARDAR**: escribe al JSON via API route (solo en dev)
- **Botón COPIAR**: mantiene el flujo de JD para pegar a Claude
- **Botón RESET**: vuelve al último estado guardado
- **Solo visible en `?edit=1`**: invisible en producción

### Anatomía del panel

```
┌─────────────────────────┐
│ ⚙ SPRINGS DEV    ▼     │  ← header draggable, click para colapsar
├─────────────────────────┤
│ ▸ Hero principal        │  ← zona colapsable
│ ▸ Editorial             │
│ ▾ Pedir                 │  ← zona expandida
│   ┌───────────────────┐ │
│   │ TÍTULO            │ │
│   │ fontSize ═══●══ 3vw│ │  ← slider
│   │ font [Inter    ▼] │ │  ← dropdown
│   │ color ● ● ○ ○     │ │  ← 4 botones color
│   │ anim  [fade-up ▼] │ │  ← dropdown
│   └───────────────────┘ │
│   ┌───────────────────┐ │
│   │ IMAGEN            │ │
│   │ [thumb][thumb][th] │ │  ← image picker
│   │ width ══●═══ 45vw │ │
│   └───────────────────┘ │
├─────────────────────────┤
│ [■ GUARDAR] [□ COPIAR]  │  ← acciones
│ [↺ RESET]               │
└─────────────────────────┘
```

### Interacción drag

Cualquier elemento marcado como `draggable: true` en el schema:
- Muestra borde punteado en modo edit
- Se puede arrastrar libremente
- Las coordenadas se actualizan en tiempo real en el DevPanel
- Al soltar, los valores `left`/`top`/`bottom` se actualizan en el state

---

## API Route para guardar

### `POST /api/dev/design`

- Solo funciona cuando `NODE_ENV === "development"`
- Recibe: `{ page: string, config: PageConfig }`
- Escribe el JSON formateado a `src/data/design/{page}.json`
- Retorna 200 o error

```typescript
// src/app/api/dev/design/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Solo disponible en desarrollo." }, { status: 403 });
  }

  const { page, config } = await request.json();
  const filePath = path.join(process.cwd(), "src/data/design", `${page}.json`);
  await writeFile(filePath, JSON.stringify(config, null, 2));

  return NextResponse.json({ ok: true });
}
```

### `GET /api/dev/images`

- Lista las imágenes disponibles en `/public/images/` para el image picker
- Retorna array de paths: `["/images/la-fija.png", "/images/la-pesada.png", ...]`

---

## Cómo los componentes leen el config

Los componentes importan el JSON directamente:

```typescript
import homeConfig from "@/data/design/home.json";

// En el componente:
const hero = homeConfig.zones.hero.elements;
const titleSize = `clamp(80px, ${hero.title.props.fontSize.value}${hero.title.props.fontSize.unit}, 340px)`;
```

Se crea un hook `useDesignConfig(page)` que:
- En modo normal: importa el JSON estático (build-time, zero overhead)
- En modo edit (`?edit=1`): usa useState con el JSON como valor inicial, permite edición en tiempo real

---

## Playwright MCP

### Instalación
```bash
npm install -D @playwright/mcp playwright
npx playwright install chromium
```

### Configuración en Claude Code
Agregar a `.claude/settings.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp", "--browser", "chromium"]
    }
  }
}
```

### Flujo con Claude
1. Claude escribe/modifica código de un componente
2. Claude usa Playwright para navegar a `localhost:3000`
3. Claude toma screenshot y evalúa contra las reglas de marca:
   - Solo 4 colores de la paleta
   - Tipografías correctas
   - Sin border-radius
   - Jerarquía visual correcta
4. Si algo no cuadra, Claude se autocorrige y repite

---

## TypeScript: tipos compartidos

```typescript
// src/types/design.ts

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
  value: string;       // path relativo: "/images/la-fija.png"
  folder: string;      // directorio donde buscar: "/images"
}

export interface AnimationProp {
  value: Animation;
  options: Animation[];
}

export interface TextElement {
  type: "text";
  props: {
    content: string;
    fontSize: SliderProp;
    fontFamily?: FontProp;
    color?: ColorProp;
    animation?: AnimationProp;
    left?: SliderProp;
    top?: SliderProp;
    [key: string]: SliderProp | FontProp | ColorProp | AnimationProp | ImageProp | string | undefined;
  };
}

export interface ImageElement {
  type: "image";
  props: {
    src: ImageProp;
    width: SliderProp;
    left?: SliderProp;
    top?: SliderProp;
    bottom?: SliderProp;
    animation?: AnimationProp;
    [key: string]: SliderProp | ImageProp | AnimationProp | undefined;
  };
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

---

## Scope v1

### Incluido
- DevPanel v2 schema-driven con todos los tipos de control
- Config JSONs para Home y Menu
- Hook `useDesignConfig` con modo edit vs modo estático
- API route `POST /api/dev/design` para guardar
- API route `GET /api/dev/images` para listar imágenes
- Tipos TypeScript compartidos
- Playwright MCP instalado y configurado
- Botones: GUARDAR, COPIAR, RESET

### NO incluido (v2 futuro)
- Undo/redo
- Presets/templates guardados
- Preview mobile dentro del editor
- Multi-usuario en tiempo real
- Drag and drop para reordenar zonas
- Editor de animaciones con timeline
- Export a Figma

---

## Archivos que se crean o modifican

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/types/design.ts` | Crear | Tipos compartidos |
| `src/data/design/home.json` | Crear | Config del home |
| `src/data/design/menu.json` | Crear | Config del menú |
| `src/hooks/useDesignConfig.ts` | Crear | Hook para leer/editar config |
| `src/components/DevPanel.tsx` | Reescribir | Panel schema-driven |
| `src/components/dev/SliderControl.tsx` | Crear | Control slider |
| `src/components/dev/FontPicker.tsx` | Crear | Control fuente |
| `src/components/dev/ColorPicker.tsx` | Crear | Control color |
| `src/components/dev/ImagePicker.tsx` | Crear | Control imagen |
| `src/components/dev/AnimationPicker.tsx` | Crear | Control animación |
| `src/components/dev/TextInput.tsx` | Crear | Control texto |
| `src/app/api/dev/design/route.ts` | Crear | API guardar config |
| `src/app/api/dev/images/route.ts` | Crear | API listar imágenes |
| `src/app/page.tsx` | Modificar | Leer config, integrar DevPanel v2 |
| `src/app/menu/page.tsx` | Modificar | Leer config, integrar DevPanel v2 |
| `.claude/settings.json` | Modificar | Agregar Playwright MCP |
