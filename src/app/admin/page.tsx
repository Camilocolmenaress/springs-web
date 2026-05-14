"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = "pedidos" | "productos" | "horarios" | "domicilio" | "contenido" | "config";

const TABS: { id: Tab; label: string }[] = [
  { id: "pedidos", label: "PEDIDOS" },
  { id: "productos", label: "PRODUCTOS" },
  { id: "horarios", label: "HORARIOS" },
  { id: "domicilio", label: "DOMICILIO" },
  { id: "contenido", label: "CONTENIDO" },
  { id: "config", label: "CONFIG" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [tab, setTab] = useState<Tab>("pedidos");

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, tipo: "admin" }),
    });
    const data = await res.json();
    if (res.ok) setAuthed(true);
    else setPinError(data.error);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-tinta flex items-center justify-center">
        <div className="w-72 text-center">
          <h1 className="font-display text-3xl text-cream tracking-[4px] mb-2">ADMIN</h1>
          <p className="font-mono text-[10px] text-cream/30 tracking-[2px] mb-8">SPRINGS</p>
          <input
            type="password"
            inputMode="numeric"
            placeholder="PIN"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-cream/10 text-cream font-mono text-center text-2xl tracking-[8px] py-4 border border-cream/20 focus:border-mostaza outline-none"
          />
          {pinError && <p className="font-mono text-xs text-mostaza mt-3">{pinError}</p>}
          <button onClick={handleLogin} className="w-full mt-4 bg-burgundy text-cream font-display tracking-[3px] py-4 hover:opacity-85 transition-opacity">
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tinta flex overflow-hidden">
      <aside className="w-48 border-r border-cream/10 p-4 flex flex-col gap-1 shrink-0">
        <p className="font-display text-cream text-lg tracking-[3px] mb-6">SPRINGS</p>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-left font-mono text-xs tracking-[2px] px-3 py-2 transition-colors ${
              tab === t.id ? "bg-burgundy text-cream" : "text-cream/40 hover:text-cream/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {tab === "pedidos" && <PedidosSection />}
        {tab === "productos" && <ProductosSection />}
        {tab === "horarios" && <HorariosSection />}
        {tab === "domicilio" && <DomicilioSection />}
        {tab === "contenido" && <ContenidoSection />}
        {tab === "config" && <ConfigSection />}
      </main>
    </div>
  );
}

// ── PEDIDOS ──
function PedidosSection() {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [filter, setFilter] = useState("activos");

  const load = useCallback(async () => {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50);
    if (filter === "activos") query = query.not("estado", "in", '("entregado","cancelado")');
    const { data } = await query;
    setOrders(data || []);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const ch = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const cambiarEstado = async (id: string, estado: string) => {
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado }) });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-display text-xl text-cream tracking-[3px]">PEDIDOS</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-cream/10 text-cream font-mono text-xs px-3 py-1 border border-cream/20 outline-none"
        >
          <option value="activos">Activos</option>
          <option value="todos">Todos</option>
        </select>
      </div>
      {orders.length === 0 && <p className="font-sans text-cream/20">Sin pedidos.</p>}
      {orders.map((o) => (
        <div key={o.id as string} className="bg-cream/5 border border-cream/10 p-4 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg text-cream">#{String(o.numero_pedido).padStart(3, "0")}</span>
              <span className="font-mono text-[10px] tracking-[1px] text-mostaza">{(o.estado as string).toUpperCase()}</span>
              {o.metodo_pago !== "efectivo" && <span className={`font-mono text-[10px] ${o.pago_confirmado ? "text-green-400" : "text-red-400"}`}>{o.pago_confirmado ? "PAGADO" : "PAGO PEND."}</span>}
            </div>
            <span className="font-mono text-xs text-cream/30">{new Date(o.created_at as string).toLocaleString("es-CO")}</span>
          </div>
          <p className="font-sans text-sm text-cream/50 mt-2">{o.nombre_cliente as string} · {o.telefono as string} · {o.direccion as string}</p>
          <p className="font-mono text-sm text-cream mt-1">{(o.total as number).toLocaleString("es-CO")} · {o.metodo_pago as string}</p>
          <div className="flex gap-2 mt-3">
            {o.estado === "nuevo" && <Btn onClick={() => cambiarEstado(o.id as string, "confirmado")}>CONFIRMAR</Btn>}
            {o.estado === "confirmado" && <Btn onClick={() => cambiarEstado(o.id as string, "preparando")}>PREPARAR</Btn>}
            {o.estado === "preparando" && <Btn onClick={() => cambiarEstado(o.id as string, "listo")}>LISTO</Btn>}
            {o.estado === "listo" && <Btn onClick={() => cambiarEstado(o.id as string, "en_camino")}>EN CAMINO</Btn>}
            {o.estado === "en_camino" && <Btn onClick={() => cambiarEstado(o.id as string, "entregado")}>ENTREGADO</Btn>}
            {!["entregado", "cancelado"].includes(o.estado as string) && (
              <button onClick={() => cambiarEstado(o.id as string, "cancelado")} className="font-mono text-[10px] tracking-[1px] text-red-400 px-3 py-1 border border-red-400/30 hover:bg-red-400/10 transition-colors">CANCELAR</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PRODUCTOS ──
function ProductosSection() {
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").order("orden").then(({ data }) => setProducts(data || []));
  }, []);

  const toggle = async (id: string, disponible: boolean) => {
    await fetch(`/api/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ disponible: !disponible }) });
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, disponible: !disponible } : p));
  };

  return (
    <div>
      <h2 className="font-display text-xl text-cream tracking-[3px] mb-6">PRODUCTOS</h2>
      {products.map((p) => (
        <div key={p.id as string} className="flex items-center justify-between bg-cream/5 border border-cream/10 p-3 mb-2">
          <div>
            <span className="font-sans text-sm text-cream">{p.nombre as string}</span>
            <span className="font-mono text-xs text-cream/40 ml-3">{p.categoria as string}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-cream">{(p.precio as number).toLocaleString("es-CO")}</span>
            <button
              onClick={() => toggle(p.id as string, p.disponible as boolean)}
              className={`font-mono text-[10px] tracking-[1px] px-3 py-1 transition-colors ${
                p.disponible ? "bg-green-400/20 text-green-400 border border-green-400/30" : "bg-red-400/20 text-red-400 border border-red-400/30"
              }`}
            >
              {p.disponible ? "DISPONIBLE" : "AGOTADO"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── HORARIOS ──
function HorariosSection() {
  const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
  const [horarios, setHorarios] = useState<Record<string, { abre: string; cierra: string } | null>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("value").eq("id", "horarios").single().then(({ data }) => {
      if (data) setHorarios(data.value);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: "horarios", value: horarios }) });
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-display text-xl text-cream tracking-[3px] mb-6">HORARIOS</h2>
      {DIAS.map((dia) => {
        const h = horarios[dia];
        const abierto = h !== null;
        return (
          <div key={dia} className="flex items-center gap-4 mb-3">
            <span className="font-mono text-xs text-cream/60 w-24 uppercase">{dia}</span>
            <button
              onClick={() => setHorarios((prev) => ({ ...prev, [dia]: abierto ? null : { abre: "11:00", cierra: "21:00" } }))}
              className={`font-mono text-[10px] px-2 py-1 ${abierto ? "text-green-400 border border-green-400/30" : "text-red-400 border border-red-400/30"}`}
            >
              {abierto ? "ABIERTO" : "CERRADO"}
            </button>
            {abierto && (
              <>
                <input type="time" value={h?.abre || ""} onChange={(e) => setHorarios((prev) => ({ ...prev, [dia]: { ...prev[dia]!, abre: e.target.value } }))}
                  className="bg-cream/10 text-cream font-mono text-xs px-2 py-1 border border-cream/20 outline-none" />
                <span className="text-cream/30">—</span>
                <input type="time" value={h?.cierra || ""} onChange={(e) => setHorarios((prev) => ({ ...prev, [dia]: { ...prev[dia]!, cierra: e.target.value } }))}
                  className="bg-cream/10 text-cream font-mono text-xs px-2 py-1 border border-cream/20 outline-none" />
              </>
            )}
          </div>
        );
      })}
      <button onClick={save} className="mt-4 bg-burgundy text-cream font-mono text-xs tracking-[2px] px-6 py-3 hover:opacity-85 transition-opacity">
        {saving ? "GUARDANDO..." : "GUARDAR HORARIOS"}
      </button>
    </div>
  );
}

// ── DOMICILIO ──
function DomicilioSection() {
  const [tarifa, setTarifa] = useState(5000);
  const [umbral, setUmbral] = useState(60000);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("value").eq("id", "domicilio").single().then(({ data }) => {
      if (data) { setTarifa(data.value.tarifa); setUmbral(data.value.umbral_gratis); }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: "domicilio", value: { tarifa, umbral_gratis: umbral } }) });
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-display text-xl text-cream tracking-[3px] mb-6">DOMICILIO</h2>
      <div className="space-y-4 max-w-sm">
        <div>
          <label className="font-mono text-[10px] text-cream/40 tracking-[2px] block mb-1">TARIFA DOMICILIO</label>
          <input type="number" value={tarifa} onChange={(e) => setTarifa(Number(e.target.value))}
            className="w-full bg-cream/10 text-cream font-mono text-lg px-3 py-2 border border-cream/20 outline-none" />
        </div>
        <div>
          <label className="font-mono text-[10px] text-cream/40 tracking-[2px] block mb-1">UMBRAL DOMICILIO GRATIS</label>
          <input type="number" value={umbral} onChange={(e) => setUmbral(Number(e.target.value))}
            className="w-full bg-cream/10 text-cream font-mono text-lg px-3 py-2 border border-cream/20 outline-none" />
          <p className="font-mono text-[10px] text-cream/30 mt-1">Pedidos de {umbral.toLocaleString("es-CO")} o mas tienen domicilio gratis.</p>
        </div>
        <button onClick={save} className="bg-burgundy text-cream font-mono text-xs tracking-[2px] px-6 py-3 hover:opacity-85 transition-opacity">
          {saving ? "GUARDANDO..." : "GUARDAR"}
        </button>
      </div>
    </div>
  );
}

// ── CONTENIDO ──
function ContenidoSection() {
  const [frase, setFrase] = useState("");
  const [productoId, setProductoId] = useState<string | null>(null);
  const [products, setProducts] = useState<{ id: string; nombre: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("content").select("id, value").then(({ data }) => {
      data?.forEach((c) => {
        if (c.id === "frase_del_dia") setFrase(c.value.texto || "");
        if (c.id === "producto_destacado") setProductoId(c.value.product_id || null);
      });
    });
    supabase.from("products").select("id, nombre").order("orden").then(({ data }) => setProducts(data || []));
  }, []);

  const saveFrase = async () => {
    setSaving(true);
    await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: "frase_del_dia", value: { texto: frase } }) });
    setSaving(false);
  };

  const saveDestacado = async (pid: string | null) => {
    setProductoId(pid);
    await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: "producto_destacado", value: { product_id: pid } }) });
  };

  return (
    <div>
      <h2 className="font-display text-xl text-cream tracking-[3px] mb-6">CONTENIDO</h2>
      <div className="max-w-lg space-y-8">
        <div>
          <label className="font-mono text-[10px] text-cream/40 tracking-[2px] block mb-2">FRASE DEL DIA</label>
          <textarea value={frase} onChange={(e) => setFrase(e.target.value)} rows={3}
            className="w-full bg-cream/10 text-cream font-sans text-sm px-3 py-2 border border-cream/20 outline-none resize-none" />
          <button onClick={saveFrase} className="mt-2 bg-burgundy text-cream font-mono text-xs tracking-[2px] px-6 py-2 hover:opacity-85 transition-opacity">
            {saving ? "GUARDANDO..." : "GUARDAR FRASE"}
          </button>
        </div>
        <div>
          <label className="font-mono text-[10px] text-cream/40 tracking-[2px] block mb-2">PRODUCTO DESTACADO</label>
          <select value={productoId || ""} onChange={(e) => saveDestacado(e.target.value || null)}
            className="w-full bg-cream/10 text-cream font-mono text-sm px-3 py-2 border border-cream/20 outline-none">
            <option value="">Ninguno</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ── CONFIG ──
function ConfigSection() {
  const [pinCocina, setPinCocina] = useState("");
  const [pinAdmin, setPinAdmin] = useState("");
  const [msg, setMsg] = useState("");

  const changePin = async (tipo: "cocina" | "admin", value: string) => {
    if (value.length < 4) { setMsg("El PIN debe tener al menos 4 digitos."); return; }
    const res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin: value, tipo }) });
    if (res.ok) {
      setMsg(`PIN de ${tipo} actualizado.`);
      if (tipo === "cocina") setPinCocina("");
      else setPinAdmin("");
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl text-cream tracking-[3px] mb-6">CONFIGURACION</h2>
      <div className="max-w-sm space-y-6">
        <div>
          <label className="font-mono text-[10px] text-cream/40 tracking-[2px] block mb-2">NUEVO PIN COCINA</label>
          <div className="flex gap-2">
            <input type="password" inputMode="numeric" value={pinCocina} onChange={(e) => setPinCocina(e.target.value)} placeholder="****"
              className="flex-1 bg-cream/10 text-cream font-mono text-center text-lg tracking-[4px] py-2 border border-cream/20 outline-none" />
            <button onClick={() => changePin("cocina", pinCocina)} className="bg-burgundy text-cream font-mono text-xs tracking-[1px] px-4 hover:opacity-85 transition-opacity">CAMBIAR</button>
          </div>
        </div>
        <div>
          <label className="font-mono text-[10px] text-cream/40 tracking-[2px] block mb-2">NUEVO PIN ADMIN</label>
          <div className="flex gap-2">
            <input type="password" inputMode="numeric" value={pinAdmin} onChange={(e) => setPinAdmin(e.target.value)} placeholder="******"
              className="flex-1 bg-cream/10 text-cream font-mono text-center text-lg tracking-[4px] py-2 border border-cream/20 outline-none" />
            <button onClick={() => changePin("admin", pinAdmin)} className="bg-burgundy text-cream font-mono text-xs tracking-[1px] px-4 hover:opacity-85 transition-opacity">CAMBIAR</button>
          </div>
        </div>
        {msg && <p className="font-mono text-xs text-mostaza">{msg}</p>}
      </div>
    </div>
  );
}

// ── Shared ──
function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-burgundy text-cream font-mono text-[10px] tracking-[1px] px-3 py-1 hover:opacity-85 transition-opacity">
      {children}
    </button>
  );
}
