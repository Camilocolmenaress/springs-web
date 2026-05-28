"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { productos, type Producto } from "@/data/productos";
import { type CartItem, type CartExtra } from "@/components/Cart";
import ExtrasModal from "@/components/ExtrasModal";
import { saveCart, fmt, calcTotal } from "@/lib/cart-store";

const CATEGORIAS = [
  { id: "combos",  label: "COMBOS"  },
  { id: "jackets", label: "JACKETS" },
  { id: "loaded",  label: "LOADED"  },
  { id: "extras",  label: "EXTRAS"  },
  { id: "bebidas", label: "BEBIDAS" },
] as const;

type CatId = typeof CATEGORIAS[number]["id"];

const byCategoria = (cat: string) =>
  productos.filter(p => p.categoria === cat && p.disponible);

export default function MenuPage() {
  const router = useRouter();
  const [cartItems, setCartItems]       = useState<CartItem[]>([]);
  const [pendingProduct, setPendingProduct] = useState<Producto | null>(null);
  const [activeSection, setActiveSection]   = useState<CatId>("combos");
  const sectionRefs = useRef<Partial<Record<CatId, HTMLElement | null>>>({});

  useEffect(() => { saveCart(cartItems); }, [cartItems]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    CATEGORIAS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25, rootMargin: "-120px 0px -50% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  function scrollToSection(id: CatId) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  }

  function addToCart(p: Producto, extras: CartExtra[] = []) {
    const cartId = `${p.id}_${Date.now()}`;
    setCartItems(prev => [
      ...prev,
      { cartId, id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1, extras },
    ]);
  }

  function removeLastOf(productId: string) {
    setCartItems(prev => {
      const idx = [...prev].reverse().findIndex(i => i.id === productId);
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      const item = prev[realIdx];
      if (item.cantidad > 1) {
        return prev.map((i, n) =>
          n === realIdx ? { ...i, cantidad: i.cantidad - 1 } : i
        );
      }
      return prev.filter((_, n) => n !== realIdx);
    });
  }

  function handleAgregar(p: Producto) {
    if (p.categoria === "bebida" || p.categoria === "extra" || p.categoria === "combo") {
      addToCart(p);
    } else {
      setPendingProduct(p);
    }
  }

  function handleConfirm(p: Producto, extras: CartExtra[]) {
    addToCart(p, extras);
    setPendingProduct(null);
  }

  const subtotal  = calcTotal(cartItems);
  const itemCount = cartItems.reduce((s, i) => s + i.cantidad, 0);

  const qtyOf = (productId: string) =>
    cartItems.filter(i => i.id === productId).reduce((s, i) => s + i.cantidad, 0);

  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-tinta font-sans text-cream"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-burgundy border-b-2 border-mostaza">
        <Link href="/" className="text-cream hover:text-mostaza transition-colors text-xl font-bold w-8">
          ←
        </Link>
        <h1 className="font-display text-[20px] text-cream uppercase tracking-widest flex-1 text-center">
          CARTA
        </h1>
        <div className="w-8 flex justify-end">
          {itemCount > 0 && (
            <div className="w-6 h-6 bg-mostaza text-tinta font-mono text-[10px] font-bold flex items-center justify-center">
              {itemCount > 9 ? "9+" : itemCount}
            </div>
          )}
        </div>
      </header>

      {/* ── CATEGORY NAV ── */}
      <nav
        className="fixed top-16 left-0 w-full z-40 bg-tinta border-b border-white/10 overflow-x-auto"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        <ul className="flex px-6 py-3 gap-8 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
          {CATEGORIAS.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className={`pb-1 transition-colors ${
                  activeSection === id
                    ? "text-cream border-b-2 border-mostaza"
                    : "text-white/30 hover:text-cream"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="pt-[120px] pb-[148px] max-w-[600px] mx-auto w-full">

        {/* COMBOS */}
        <section
          id="combos"
          ref={el => { sectionRefs.current.combos = el; }}
          className="mb-12"
        >
          <h2 className="font-display text-[32px] text-cream px-6 py-6 uppercase">COMBOS</h2>
          <div className="flex flex-col gap-6 px-6">
            {byCategoria("combo").map(p => (
              <article key={p.id} className="bg-cream text-tinta relative">
                {p.id === "combo-2" && (
                  <div className="absolute top-0 right-0 bg-mostaza text-tinta font-mono text-[9px] px-3 py-1 uppercase z-10 border-b border-l border-tinta">
                    AHORRÁS 9,900
                  </div>
                )}
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="font-display text-[24px] text-burgundy uppercase leading-none mb-2">
                      {p.nombre.toUpperCase()}
                    </h3>
                    <p className="font-sans text-[13px] text-tinta leading-relaxed">{p.descripcion}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-tinta/20 pt-4">
                    <span className="font-mono text-[16px] text-burgundy font-bold">{fmt(p.precio)}</span>
                    <button
                      onClick={() => handleAgregar(p)}
                      className="bg-burgundy text-cream font-sans font-medium text-[13px] uppercase py-3 px-6 hover:bg-mostaza hover:text-tinta transition-colors"
                    >
                      AGREGAR AL PEDIDO
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* JACKETS */}
        <section
          id="jackets"
          ref={el => { sectionRefs.current.jackets = el; }}
          className="mb-12"
        >
          <h2 className="font-display text-[32px] text-cream px-6 py-6 uppercase">JACKETS</h2>
          <div className="flex flex-col gap-4 px-6">
            {byCategoria("jacket").map(p => (
              <article key={p.id} className="bg-cream text-tinta flex h-36 relative">
                {p.id === "jacket-1" && (
                  <div className="absolute -top-2 -left-2 bg-burgundy text-cream font-mono text-[9px] px-2 py-1 uppercase border border-cream z-10 shadow-[2px_2px_0px_#C5871F]">
                    EMPIECE POR ESTA →
                  </div>
                )}
                {p.imagen_url ? (
                  <Image
                    src={p.imagen_url}
                    alt={p.nombre}
                    width={144}
                    height={144}
                    className="w-[40%] h-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-[40%] h-full bg-tinta/10 flex-shrink-0" />
                )}
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-display text-[18px] text-burgundy uppercase leading-none mb-1">
                      {p.nombre.toUpperCase()}
                    </h3>
                    <p className="font-sans text-[11px] text-tinta leading-tight line-clamp-2">{p.descripcion}</p>
                    <span className="font-mono text-[8px] text-mostaza mt-1 block tracking-widest">INCLUYE FUSE</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[13px] text-burgundy font-bold">{fmt(p.precio)}</span>
                    <button
                      onClick={() => handleAgregar(p)}
                      className="bg-mostaza text-tinta font-sans font-medium text-[11px] uppercase py-2 px-4 hover:bg-burgundy hover:text-cream transition-colors"
                    >
                      AGREGAR
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-cream text-tinta p-6 mx-6 mt-8 border-l-4 border-mostaza">
            <h4 className="font-display text-[20px] text-mostaza uppercase mb-2">¿PRIMERA VEZ?</h4>
            <p className="font-sans text-[13px] leading-relaxed">
              Una jacket no es una papa rellena. Es técnica Kumpir: horneada a 200 grados, vaciada,
              pureada con mantequilla y queso fundido, y devuelta a su coraza crujiente. Respete el proceso.
            </p>
          </div>
        </section>

        {/* LOADED */}
        <section
          id="loaded"
          ref={el => { sectionRefs.current.loaded = el; }}
          className="mb-12"
        >
          <div className="px-6 py-6">
            <h2 className="font-display text-[32px] text-cream uppercase">LOADED</h2>
            <p className="font-mono text-[9px] text-mostaza mt-1 tracking-widest">GAJOS RELLENOS. PARA COMPARTIR.</p>
          </div>
          <div className="flex flex-col gap-3 px-6">
            {byCategoria("loaded").map(p => (
              <article key={p.id} className="bg-tinta border border-white/10 flex h-32">
                {p.imagen_url ? (
                  <Image
                    src={p.imagen_url}
                    alt={p.nombre}
                    width={112}
                    height={128}
                    className="w-[35%] h-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-[35%] h-full bg-white/5 flex-shrink-0" />
                )}
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-display text-[16px] text-cream uppercase leading-none mb-1">
                      {p.nombre.replace("Loaded ", "").toUpperCase()}
                    </h3>
                    <p className="font-sans text-[11px] text-white/50 leading-tight line-clamp-2">{p.descripcion}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[12px] text-mostaza">{fmt(p.precio)}</span>
                    <button
                      onClick={() => handleAgregar(p)}
                      className="border border-cream text-cream font-sans text-[10px] uppercase py-1.5 px-3 hover:bg-cream hover:text-tinta transition-colors"
                    >
                      AGREGAR
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* EXTRAS */}
        <section
          id="extras"
          ref={el => { sectionRefs.current.extras = el; }}
          className="mb-12 bg-cream py-8"
        >
          <h2 className="font-display text-[32px] text-burgundy px-6 mb-6 uppercase">EXTRAS</h2>
          <div className="grid grid-cols-2 gap-px bg-tinta/20 border-y border-tinta/20">
            {byCategoria("extra").map(p => (
              <div key={p.id} className="bg-cream p-4 flex flex-col items-center text-center">
                <span className="font-display text-[14px] text-tinta uppercase leading-tight">{p.nombre}</span>
                <span className="font-mono text-[11px] text-burgundy mt-1 mb-3">{fmt(p.precio)}</span>
                <div className="flex items-center border border-tinta h-8 w-24">
                  <button
                    onClick={() => removeLastOf(p.id)}
                    className="w-1/3 h-full flex items-center justify-center text-tinta hover:bg-tinta hover:text-cream transition-colors"
                  >
                    −
                  </button>
                  <span className="w-1/3 h-full flex items-center justify-center font-mono text-[12px] border-x border-tinta">
                    {qtyOf(p.id)}
                  </span>
                  <button
                    onClick={() => addToCart(p)}
                    className="w-1/3 h-full flex items-center justify-center text-tinta hover:bg-tinta hover:text-cream transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BEBIDAS */}
        <section
          id="bebidas"
          ref={el => { sectionRefs.current.bebidas = el; }}
          className="mb-6"
        >
          <h2 className="font-display text-[32px] text-cream px-6 py-6 uppercase">BEBIDAS</h2>
          <div className="flex flex-col px-6">
            {byCategoria("bebida").map(p => (
              <article
                key={p.id}
                className="flex justify-between items-center py-4 border-b border-white/10"
              >
                <span className="font-sans text-[14px] text-cream uppercase">{p.nombre}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[12px] text-mostaza">{fmt(p.precio)}</span>
                  <button
                    onClick={() => handleAgregar(p)}
                    className="border border-cream text-cream font-sans text-[10px] uppercase py-1.5 px-3 hover:bg-cream hover:text-tinta transition-colors"
                  >
                    AGREGAR
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* ── TRUST BAR ── */}
      <div className="fixed bottom-[80px] left-0 w-full z-40 bg-burgundy border-t border-white/10 py-2">
        <p className="font-mono text-[9px] text-cream text-center tracking-[0.2em]">
          30-45 MIN
          <span className="text-mostaza px-2">·</span>
          CABECERA
          <span className="text-mostaza px-2">·</span>
          CAÑAVERAL
          <span className="text-mostaza px-2">·</span>
          SOTOMAYOR
        </p>
      </div>

      {/* ── STICKY CART BAR ── */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-tinta border-t-2 border-mostaza px-6 h-20 flex justify-between items-center">
        {itemCount > 0 ? (
          <>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
              </span>
              <span className="font-display text-[24px] text-cream leading-none">{fmt(subtotal)}</span>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="bg-mostaza text-tinta font-display text-[16px] px-6 py-4 uppercase hover:bg-cream transition-colors"
            >
              VER PEDIDO →
            </button>
          </>
        ) : (
          <span className="w-full text-center font-mono text-[10px] text-white/20 uppercase tracking-widest">
            SU PEDIDO ESTÁ VACÍO. LA PAPA NO SE HORNEA SOLA.
          </span>
        )}
      </footer>

      {/* ── EXTRAS MODAL ── */}
      {pendingProduct && (
        <ExtrasModal
          product={pendingProduct}
          onClose={() => setPendingProduct(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
