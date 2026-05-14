"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("springs_cookies");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("springs_cookies", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-tinta border-t border-cream/10 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      <p className="font-sans text-xs text-cream/70 max-w-xl">
        Usamos cookies para mejorar su experiencia y medir el trafico del
        sitio.{" "}
        <Link
          href="/legal/privacidad"
          className="text-mostaza underline underline-offset-2"
        >
          Politica de privacidad
        </Link>
      </p>
      <button
        onClick={accept}
        className="bg-cream text-tinta font-mono text-xs tracking-[2px] px-5 py-2 shrink-0 hover:opacity-85 transition-opacity"
      >
        ACEPTAR
      </button>
    </div>
  );
}
