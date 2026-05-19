"use client";

import { useState } from "react";
import Link from "next/link";
import Menu, { type MenuStyles } from "@/components/Menu";
import Cart, { type CartItem } from "@/components/Cart";
import DevPanel from "@/components/DevPanel";
import { useDesignConfig } from "@/hooks/useDesignConfig";
import { type Producto } from "@/data/productos";
import type { PageConfig, SliderProp, ColorProp } from "@/types/design";

const BRAND: Record<string, string> = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

function sliderCss(config: PageConfig, zone: string, elem: string, key: string, fallback: string): string {
  const prop = config.zones[zone]?.elements[elem]?.props[key];
  if (prop && typeof prop === "object" && "unit" in prop) {
    const s = prop as SliderProp;
    return `${s.value}${s.unit}`;
  }
  return fallback;
}

function sliderNum(config: PageConfig, zone: string, elem: string, key: string, fallback: number): number {
  const prop = config.zones[zone]?.elements[elem]?.props[key];
  if (prop && typeof prop === "object" && "unit" in prop) return (prop as SliderProp).value;
  return fallback;
}

function colorHex(config: PageConfig, zone: string, elem: string, key: string, fallback: string): string {
  const prop = config.zones[zone]?.elements[elem]?.props[key];
  if (prop && typeof prop === "object" && "options" in prop) {
    return BRAND[(prop as ColorProp).value] ?? fallback;
  }
  return fallback;
}

function strProp(config: PageConfig, zone: string, elem: string, key: string, fallback: string): string {
  const prop = config.zones[zone]?.elements[elem]?.props[key];
  return typeof prop === "string" ? prop : fallback;
}

export default function MenuPage() {
  const { config, editMode, saved, updateProp, save, reset, exportValues } = useDesignConfig("menu");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function handleAgregar(p: Producto) {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === p.id);
      if (existing) {
        return prev.map(i => i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 }];
    });
  }

  function handleAdd(id: string) {
    setCartItems(prev =>
      prev.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i)
    );
  }

  function handleRemove(id: string) {
    setCartItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      if (item.cantidad <= 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i);
    });
  }

  function handleDelete(id: string) {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }

  const menuStyles: Partial<MenuStyles> = {
    tabFontSize:       sliderCss(config, "tabs", "tab", "fontSize", "0.6rem"),
    tabGap:            sliderNum(config, "tabs", "tab", "gap", 6),
    tabActiveBg:       colorHex(config, "tabs", "tab", "activeBackground", "#1A0A0C"),
    tabActiveColor:    colorHex(config, "tabs", "tab", "activeColor", "#F2E8D5"),
    centerImageSize:   `min(${sliderNum(config, "carousel", "centerImage", "size", 52)}vh, 42vw, 540px)`,
    sideOffsetVw:      sliderNum(config, "carousel", "sideItems", "offsetVw", 23),
    sideScale:         sliderNum(config, "carousel", "sideItems", "scale", 70) / 100,
    sideOpacity:       sliderNum(config, "carousel", "sideItems", "opacity", 75) / 100,
    nameFontSize:      `clamp(28px, ${sliderNum(config, "productInfo", "name", "fontSize", 5)}vw, 56px)`,
    nameColor:         colorHex(config, "productInfo", "name", "color", "#1A0A0C"),
    descFontSize:      sliderCss(config, "productInfo", "description", "fontSize", "0.68rem"),
    descOpacity:       sliderNum(config, "productInfo", "description", "opacity", 58) / 100,
    priceFontSize:     sliderCss(config, "productInfo", "price", "fontSize", "1.15rem"),
    priceColor:        colorHex(config, "productInfo", "price", "color", "#1A0A0C"),
    ctaText:           strProp(config, "cta", "addButton", "content", "AGREGAR ↗"),
    ctaFontSize:       sliderCss(config, "cta", "addButton", "fontSize", "0.78rem"),
    ctaBg:             colorHex(config, "cta", "addButton", "background", "#6B1419"),
    ctaColor:          colorHex(config, "cta", "addButton", "color", "#F2E8D5"),
    watermarkOpacity:  sliderNum(config, "watermark", "bg", "opacity", 5.5) / 100,
    watermarkFontSize: `clamp(100px, ${sliderNum(config, "watermark", "bg", "fontSize", 19)}vw, 300px)`,
  };

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

      <Menu onAgregar={handleAgregar} styles={menuStyles} />

      <Cart
        items={cartItems}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onDelete={handleDelete}
      />

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
