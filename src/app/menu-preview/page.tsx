"use client";

import Menu from "@/components/Menu";

export default function MenuPreviewPage() {
  return (
    <main style={{ width: "100vw", height: "100vh", overflowY: "auto", background: "var(--cream)" }}>
      <Menu onAgregar={(p) => console.log("AGREGAR", p.nombre)} />
    </main>
  );
}
