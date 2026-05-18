"use client";

import { useState } from "react";
import Link from "next/link";
import Menu from "@/components/Menu";
import Cart, { type CartItem } from "@/components/Cart";
import DevPanel from "@/components/DevPanel";
import { useDesignConfig } from "@/hooks/useDesignConfig";
import { type Producto } from "@/data/productos";

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

      <Menu onAgregar={handleAgregar} />

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
