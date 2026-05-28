"use client";

import { useState } from "react";
import Link from "next/link";
import Menu from "@/components/Menu";
import Cart, { type CartItem, type CartExtra } from "@/components/Cart";
import ExtrasModal from "@/components/ExtrasModal";
import DevPanel from "@/components/DevPanel";
import { useDesignConfig } from "@/hooks/useDesignConfig";
import { type Producto } from "@/data/productos";

export default function MenuPage() {
  const { config, editMode, saved, updateProp, save, reset, exportValues } = useDesignConfig("menu");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [pendingProduct, setPendingProduct] = useState<Producto | null>(null);
  const [cartBump, setCartBump] = useState(0);

  function handleAgregar(p: Producto) {
    if (p.categoria === "bebida" || p.categoria === "extra" || p.categoria === "combo") {
      addToCart(p, []);
    } else {
      setPendingProduct(p);
    }
  }

  function addToCart(p: Producto, extras: CartExtra[]) {
    const cartId = `${p.id}_${Date.now()}`;
    setCartItems(prev => [...prev, { cartId, id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1, extras }]);
    setCartBump(b => b + 1);
  }

  function handleConfirm(p: Producto, extras: CartExtra[]) {
    addToCart(p, extras);
    setPendingProduct(null);
  }

  function handleAdd(cartId: string) {
    setCartItems(prev =>
      prev.map(i => i.cartId === cartId ? { ...i, cantidad: i.cantidad + 1 } : i)
    );
  }

  function handleRemove(cartId: string) {
    setCartItems(prev => {
      const item = prev.find(i => i.cartId === cartId);
      if (!item) return prev;
      if (item.cantidad <= 1) return prev.filter(i => i.cartId !== cartId);
      return prev.map(i => i.cartId === cartId ? { ...i, cantidad: i.cantidad - 1 } : i);
    });
  }

  function handleDelete(cartId: string) {
    setCartItems(prev => prev.filter(i => i.cartId !== cartId));
  }

  // ── Edit mode: split layout — mobile preview left, editor sidebar right
  if (editMode) {
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh", background: "#0d0d0d", overflow: "hidden" }}>
        {/* Mobile preview frame */}
        <div style={{ width: 390, flexShrink: 0, height: "100vh", position: "relative", overflow: "hidden", outline: "1px solid rgba(242,232,213,0.1)" }}>
          <Link
            href="/"
            aria-label="Volver al home"
            style={{
              position: "absolute", top: 16, left: 16, zIndex: 50,
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 14px", background: "var(--cream)", color: "var(--tinta)",
              border: "1px solid var(--tinta)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "0.65rem", letterSpacing: "0.22em",
              textTransform: "uppercase", textDecoration: "none",
              mixBlendMode: "multiply",
            }}
          >
            <span aria-hidden>←</span> VOLVER
          </Link>
          <Menu onAgregar={handleAgregar} config={config} />
        </div>
        {/* Editor sidebar */}
        <div style={{ flex: 1, height: "100vh", overflow: "hidden", minWidth: 280 }}>
          <DevPanel
            config={config}
            saved={saved}
            onUpdate={updateProp}
            onSave={save}
            onExport={exportValues}
            onReset={reset}
            inlineSidebar
          />
        </div>
      </div>
    );
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

      <Menu onAgregar={handleAgregar} config={config} />

      <Cart
        items={cartItems}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onDelete={handleDelete}
        bumpSignal={cartBump}
      />

      {pendingProduct && (
        <ExtrasModal
          product={pendingProduct}
          onClose={() => setPendingProduct(null)}
          onConfirm={handleConfirm}
        />
      )}

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
