"use client";

export default function Hero() {
  return (
    <section className="relative w-full bg-cream overflow-hidden" style={{ height: "100svh" }}>

      {/* ── NAV TOP ── */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-8 pt-6">
        <span className="font-display text-tinta text-xl tracking-[0.2em]">SPRINGS</span>
        <div className="flex items-start gap-6">
          <p className="hidden md:block font-mono text-[10px] leading-[1.5] tracking-[0.12em] uppercase text-tinta/50 text-right max-w-[160px]">
            LA FIJA ES<br />LA JACKET HOY.
          </p>
          <a
            href="#menu"
            className="flex items-center gap-2 border border-burgundy text-burgundy font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2.5 hover:bg-burgundy hover:text-cream transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mostaza animate-pulse shrink-0" />
            ¡PEDIR YA!
          </a>
        </div>
      </nav>

      {/* ── FOTO PRODUCTO — sangra top/left/bottom ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-6%",
          top: "-5%",
          width: "55%",
          height: "110%",
          zIndex: 1,
        }}
      >
        {/* Papa placeholder — forma orgánica */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "radial-gradient(ellipse at 45% 42%, #D4A55A 0%, #A06828 35%, #6B3E18 65%, #3A1E08 100%)",
            clipPath: "ellipse(47% 50% at 50% 50%)",
          }}
        />
        {/* Label sobre foto */}
        <div className="absolute bottom-[18%] left-[22%] font-mono text-[9px] tracking-[0.22em] uppercase text-cream/60 flex items-center gap-2">
          <span className="block w-4 h-px bg-cream/40" />
          La Jacket · 300g
        </div>
      </div>

      {/* ── "SPRINGS" GIGANTE — overlapping ── */}
      <h1
        className="absolute pointer-events-none font-display text-tinta leading-[0.82] tracking-[0.01em] uppercase select-none"
        style={{
          left: "28%",
          top: "50%",
          transform: "translateY(-54%)",
          fontSize: "clamp(80px, 18vw, 280px)",
          zIndex: 2,
        }}
      >
        SPRINGS
      </h1>

      {/* ── "JACKETS." — sangra por la derecha ── */}
      <p
        className="absolute pointer-events-none font-display text-tinta/15 leading-none tracking-[0.01em] uppercase whitespace-nowrap select-none"
        style={{
          left: "18%",
          bottom: "8%",
          fontSize: "clamp(70px, 14vw, 220px)",
          zIndex: 2,
        }}
      >
        JACKETS.
      </p>

      {/* ── "COLLECTION" / subtítulo ── */}
      <p
        className="absolute pointer-events-none font-display text-burgundy leading-none tracking-[0.01em] uppercase whitespace-nowrap select-none"
        style={{
          left: "30%",
          bottom: "16%",
          fontSize: "clamp(18px, 3.5vw, 56px)",
          zIndex: 3,
        }}
      >
        CARTA 2025
      </p>

      {/* ── STICKER 1 — rotante, centro ── */}
      <div
        className="absolute"
        style={{ left: "48%", top: "8%", zIndex: 20 }}
      >
        <div className="relative w-[108px] h-[108px]">
          <svg
            viewBox="0 0 108 108"
            className="w-full h-full"
            style={{ animation: "spin 16s linear infinite" }}
          >
            <circle cx="54" cy="54" r="52" fill="#6B1419" />
            <path id="sc1" d="M54,54 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" fill="none" />
            <text fontFamily="JetBrains Mono,monospace" fontSize="8.5" fill="#F2E8D5" letterSpacing="2.8">
              <textPath href="#sc1">DIFFERENT BY DEFAULT · SPRINGS · </textPath>
            </text>
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center font-display text-cream text-[11px] tracking-[0.1em] text-center leading-tight">
            BGA<br />2024
          </span>
        </div>
      </div>

      {/* ── STICKER 2 — badge irregular ── */}
      <div
        className="absolute font-display text-tinta"
        style={{
          right: "28%",
          top: "10%",
          zIndex: 20,
          transform: "rotate(-3deg)",
        }}
      >
        <div className="border border-tinta/30 px-4 py-2 bg-cream/80 backdrop-blur-sm">
          <div className="font-display text-[13px] tracking-[0.15em] text-tinta">SPRINGS [BGA]</div>
          <div className="font-mono text-[8px] tracking-[0.18em] uppercase text-tinta/40">Dark Kitchen · Limited</div>
        </div>
      </div>

      {/* ── SÍMBOLOS FLOTANTES ── */}
      <span className="absolute font-display text-tinta/20 select-none pointer-events-none"
        style={{ left: "54%", top: "38%", fontSize: "28px", zIndex: 3 }}>↗</span>
      <span className="absolute font-display text-tinta/15 select-none pointer-events-none"
        style={{ left: "62%", top: "52%", fontSize: "22px", zIndex: 3 }}>+</span>
      <span className="absolute text-tinta/10 select-none pointer-events-none"
        style={{ left: "58%", top: "60%", fontSize: "28px", zIndex: 3 }}>☺</span>
      <span className="absolute font-display text-tinta/20 select-none pointer-events-none"
        style={{ left: "42%", top: "22%", fontSize: "18px", zIndex: 3 }}>✦</span>

      {/* ── TEXTO FLOTANTE — handle ── */}
      <div className="absolute font-mono text-[9px] tracking-[0.2em] uppercase text-tinta/35 select-none"
        style={{ left: "56%", top: "46%", zIndex: 5 }}>
        TE DAMOS LO TUYO<br />
        <span className="text-tinta/20">@SPRINGS.COL</span>
      </div>

      {/* ── FOTOS EDITORIALES — derecha ── */}
      <div
        className="absolute"
        style={{ right: 0, top: "11%", width: "26%", height: "78%", zIndex: 4 }}
      >
        {/* Foto 1 */}
        <div
          className="absolute bg-burgundy"
          style={{ left: 0, top: 0, width: "58%", height: "62%" }}
        >
          <div className="w-full h-full flex items-end p-3"
            style={{ background: "linear-gradient(160deg, #8B1D24 0%, #4A0E12 100%)" }}>
            <div>
              <span className="block font-display text-cream text-[11px] tracking-[0.08em]">LA FIJA</span>
              <span className="font-mono text-mostaza text-[9px] font-semibold">32,900</span>
            </div>
          </div>
        </div>
        {/* Foto 2 */}
        <div
          className="absolute"
          style={{
            right: 0, top: "8%", width: "48%", height: "50%",
            background: "#1A0A0C",
          }}
        >
          <div className="w-full h-full flex items-end p-3"
            style={{ background: "linear-gradient(160deg, #2A1008 0%, #1A0A0C 100%)" }}>
            <div>
              <span className="block font-display text-cream text-[11px] tracking-[0.08em]">LA BRAVA</span>
              <span className="font-mono text-mostaza text-[9px] font-semibold">34,900</span>
            </div>
          </div>
        </div>
        {/* Foto 3 */}
        <div
          className="absolute"
          style={{
            left: "10%", bottom: 0, width: "80%", height: "36%",
            background: "rgba(107,20,25,0.18)",
            border: "1px solid rgba(107,20,25,0.2)",
          }}
        >
          <div className="w-full h-full flex items-end p-3">
            <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-tinta/30">
              AQUÍ TIENES NUESTRO MENÚ
            </span>
          </div>
        </div>
      </div>

      {/* ── LISTA DE MENÚ CORRIDA — base izquierda ── */}
      <div
        className="absolute font-mono text-[9px] tracking-[0.1em] uppercase text-tinta/30 leading-[1.8] select-none"
        style={{ left: "4%", bottom: "5%", zIndex: 5, maxWidth: "38%" }}
      >
        LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA /<br />
        LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA / LOADED CHORIZO /
      </div>

      {/* ── NAV BOTTOM ── */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-8 pb-5">
        <ul className="flex gap-7">
          {["JACKETS", "LOADED", "NOSOTROS", "FAQS"].map((item) => (
            <li key={item}>
              <a href="#menu" className="font-mono text-[9px] tracking-[0.2em] uppercase text-tinta/35 hover:text-tinta transition-colors">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 items-center">
          <a href="https://tiktok.com/@springs.col" target="_blank" rel="noopener noreferrer"
            className="font-mono text-[9px] tracking-[0.18em] uppercase text-tinta/30 hover:text-tinta/70 transition-colors">TikTok</a>
          <a href="https://instagram.com/springs.col" target="_blank" rel="noopener noreferrer"
            className="font-mono text-[9px] tracking-[0.18em] uppercase text-tinta/30 hover:text-tinta/70 transition-colors">Instagram</a>
          <span className="font-mono text-[11px] text-tinta/20">↗</span>
        </div>
      </nav>

      {/* CSS para spin */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

    </section>
  );
}
