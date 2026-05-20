"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import DragSticker from "@/components/DragSticker";

const C = {
  burgundy: "#6B1419",
  cream:    "#F2E8D5",
  tinta:    "#1A0A0C",
  mostaza:  "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" },
  sans:    { fontFamily: "Inter, sans-serif" },
  mono:    { fontFamily: "JetBrains Mono, monospace" },
};

function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

type Props = {
  pauseScroll?: () => void;
  resumeScroll?: () => void;
};

export default function MobileEditorial({ pauseScroll, resumeScroll }: Props) {
  return (
    <div style={{ display: "flex", height: "100vh", width: "300vw", flexShrink: 0 }}>

      {/* ══════════════════════════════════════════
          ZONA 1 — HERO
      ══════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        flexShrink: 0,
        background: C.cream,
        overflow: "hidden",
        scrollSnapAlign: "start",
      }}>

        {/* Papa hero — llena el tercio izquierdo desde el fondo */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "-6vw",
          width: "82vw",
          height: "70vh",
          backgroundImage: "url('/images/la-fija.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          zIndex: 2,
        }} />

        {/* SPRINGS — tipografía dominante */}
        <Reveal style={{ position: "absolute", left: "30vw", top: "26vh", zIndex: 3, whiteSpace: "nowrap" }}>
          <h1 style={{
            ...F.display,
            fontSize: "clamp(60px, 19vw, 96px)",
            color: C.tinta,
            lineHeight: 0.85,
            letterSpacing: "-0.005em",
            margin: 0,
            textTransform: "uppercase",
          }}>
            SPRINGS
          </h1>
        </Reveal>

        {/* CARTA 2025 */}
        <Reveal delay={0.1} style={{ position: "absolute", left: "20vw", top: "41vh", zIndex: 3 }}>
          <div style={{
            ...F.display,
            fontSize: "clamp(32px, 11vw, 60px)",
            color: C.tinta,
            lineHeight: 0.9,
            letterSpacing: "-0.005em",
            textTransform: "uppercase",
            opacity: 0.72,
          }}>
            CARTA 2025
          </div>
        </Reveal>

        {/* Label La Fija */}
        <div style={{ position: "absolute", left: "5vw", bottom: "29vh", zIndex: 6 }}>
          <div style={{ ...F.sans, fontSize: "0.7rem", color: C.tinta, fontStyle: "italic" }}>La Fija ↗</div>
          <div style={{ ...F.mono, fontSize: "0.52rem", letterSpacing: "0.15em", color: C.tinta, opacity: 0.5, marginTop: 3 }}>W25 [BGA]</div>
        </div>

        {/* Sticker SPRINGS JACKET CLUB — draggable */}
        <DragSticker
          rotate={-8}
          idleRotateRange={2}
          idleDuration={7}
          onDragStart={pauseScroll}
          onDragEnd={resumeScroll}
          style={{
            position: "absolute", right: "4vw", top: "8vh", zIndex: 20,
            background: C.burgundy, color: C.cream,
            padding: "10px 14px",
            textAlign: "center",
            border: `2px solid ${C.tinta}`,
          }}
        >
          <div style={{ ...F.display, fontSize: "0.9rem", letterSpacing: "0.08em", lineHeight: 1 }}>SPRINGS</div>
          <div style={{ ...F.display, fontSize: "0.8rem", fontStyle: "italic", lineHeight: 1, marginTop: 2 }}>Jacket Club</div>
          <div style={{ ...F.mono, fontSize: "0.42rem", letterSpacing: "0.1em", marginTop: 6, lineHeight: 1.4, textTransform: "uppercase" }}>
            ESTO ES ALGO ASÍ<br />COMO QUE TE PAGAMOS<br />POR COMER SPRINGS
          </div>
          <div style={{
            marginTop: 6, background: C.tinta, color: C.cream,
            padding: "3px 10px", display: "inline-block",
            ...F.mono, fontSize: "0.5rem", letterSpacing: "0.2em",
          }}>
            ACCEDER
          </div>
        </DragSticker>

        {/* Sticker RÓBALA — mostaza */}
        <DragSticker
          rotate={12}
          idleRotateRange={3}
          idleDuration={5}
          onDragStart={pauseScroll}
          onDragEnd={resumeScroll}
          style={{
            position: "absolute", right: "4vw", bottom: "30vh", zIndex: 22,
            background: C.mostaza, color: C.tinta,
            padding: "10px 14px",
            border: `2px solid ${C.tinta}`,
            textAlign: "center",
          }}
        >
          <div style={{ ...F.display, fontSize: "1.2rem", letterSpacing: "0.06em", lineHeight: 1 }}>RÓBALA</div>
          <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.14em", marginTop: 4, lineHeight: 1.4, textTransform: "uppercase" }}>
            BONO ESCONDIDO<br />EN LA CIUDAD
          </div>
          <div style={{
            marginTop: 6, background: C.tinta, color: C.mostaza,
            padding: "2px 10px", display: "inline-block",
            ...F.mono, fontSize: "0.44rem", letterSpacing: "0.2em",
          }}>
            STORIES ↗
          </div>
        </DragSticker>

        {/* Menú corrido */}
        <div style={{ position: "absolute", left: "5vw", right: "5vw", bottom: "9vh", zIndex: 6 }}>
          <div style={{
            ...F.mono, fontSize: "0.48rem", letterSpacing: "0.08em",
            color: C.tinta, opacity: 0.5, lineHeight: 1.7, textTransform: "uppercase",
          }}>
            LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA /<br />
            LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA / LOADED CHORIZO /
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          ZONA 2 — JACKETS
      ══════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        flexShrink: 0,
        background: C.cream,
        overflow: "hidden",
        scrollSnapAlign: "start",
      }}>

        {/* Foto LA FIJA — columna izquierda */}
        <Reveal style={{ position: "absolute", left: "4vw", top: "12vh", zIndex: 4 }}>
          <div style={{
            width: "43vw",
            height: "54vh",
            backgroundImage: "url('/images/la-fija.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex", alignItems: "flex-end", padding: "10px",
          }}>
            <div>
              <div style={{ ...F.display, fontSize: "0.85rem", color: C.cream, letterSpacing: "0.08em" }}>LA FIJA</div>
              <div style={{ ...F.mono, fontSize: "0.65rem", color: C.mostaza }}>32,900</div>
            </div>
          </div>
        </Reveal>

        {/* Foto LA PESADA — columna derecha */}
        <Reveal delay={0.1} style={{ position: "absolute", right: "4vw", top: "8vh", zIndex: 4 }}>
          <div style={{
            width: "39vw",
            height: "50vh",
            backgroundImage: "url('/images/la-pesada.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: `2px solid ${C.tinta}`,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "10px", position: "relative",
          }}>
            <div style={{
              ...F.display, fontSize: "clamp(20px, 7vw, 36px)",
              color: C.cream, textAlign: "center", lineHeight: 0.95,
              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
            }}>
              ESTO<br />ES<br />SPRINGS
            </div>
            <div style={{ position: "absolute", bottom: 10, left: 10, ...F.mono, fontSize: "0.48rem", letterSpacing: "0.15em", color: C.mostaza }}>LA PESADA</div>
            <div style={{ position: "absolute", bottom: 10, right: 10, ...F.mono, fontSize: "0.52rem", color: C.mostaza }}>35,900</div>
          </div>
        </Reveal>

        {/* Sticker SOLO 20 */}
        <DragSticker
          rotate={9}
          idleRotateRange={3}
          idleDuration={5.5}
          onDragStart={pauseScroll}
          onDragEnd={resumeScroll}
          style={{
            position: "absolute", right: "4vw", bottom: "26vh", zIndex: 25,
            background: C.tinta, color: C.mostaza,
            padding: "8px 14px",
            border: `2px solid ${C.mostaza}`,
            textAlign: "center",
          }}
        >
          <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.22em", opacity: 0.7, marginBottom: 2 }}>W25 · DROP</div>
          <div style={{ ...F.display, fontSize: "1.3rem", letterSpacing: "0.04em", color: C.cream, lineHeight: 1 }}>SOLO 20</div>
          <div style={{ ...F.mono, fontSize: "0.44rem", letterSpacing: "0.14em", marginTop: 3 }}>POR NOCHE</div>
        </DragSticker>

        {/* TE DAMOS LO TUYO */}
        <Reveal delay={0.1} style={{ position: "absolute", left: "4vw", bottom: "26vh", zIndex: 5 }}>
          <div style={{ ...F.sans, fontSize: "0.7rem", color: C.tinta, fontStyle: "italic" }}>TE DAMOS LO TUYO</div>
          <div style={{ ...F.mono, fontSize: "0.52rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.5, marginTop: 2 }}>@SPRINGS.COL</div>
        </Reveal>

        {/* Lista de Jackets */}
        <Reveal delay={0.2} style={{ position: "absolute", left: "4vw", right: "4vw", bottom: "8vh", zIndex: 6 }}>
          <div style={{
            ...F.mono, fontSize: "0.48rem", letterSpacing: "0.08em",
            color: C.tinta, opacity: 0.5, lineHeight: 1.7, textTransform: "uppercase",
          }}>
            LA FIJA · 32,900 / LA PESADA · 35,900 / LA BRAVA · 34,900 /<br />
            LA SIMPLE · 28,900 / LA HONESTA · 28,900 /
          </div>
        </Reveal>
      </section>


      {/* ══════════════════════════════════════════
          ZONA 3 — ABOUT
      ══════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        flexShrink: 0,
        background: C.cream,
        overflow: "hidden",
        scrollSnapAlign: "start",
      }}>

        {/* Bloque 3D SPRINGS */}
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "absolute", left: "4vw", top: "14vh", zIndex: 4,
            width: "54vw", height: "34vh",
            background: `radial-gradient(ellipse at 30% 30%, #e8b8b8 0%, ${C.burgundy} 40%, ${C.tinta} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{
            ...F.display, fontSize: "clamp(40px, 13vw, 72px)",
            color: C.cream, letterSpacing: "0.02em",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
            fontStyle: "italic",
          }}>
            Springs
          </div>
        </motion.div>

        {/* SOLO DELIVERY — columna derecha */}
        <Reveal delay={0.1} style={{ position: "absolute", right: "4vw", top: "14vh", zIndex: 5, maxWidth: "36vw" }}>
          <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.15em", color: C.tinta, textTransform: "uppercase" }}>BUCARAMANGA · BGA</div>
          <div style={{
            ...F.display, fontSize: "clamp(28px, 9vw, 52px)",
            color: C.tinta, marginTop: 8, lineHeight: 0.9, textTransform: "uppercase",
          }}>
            SOLO<br />DELIVERY.
          </div>
          <div style={{
            ...F.sans, fontSize: "0.68rem", fontStyle: "italic",
            color: C.tinta, opacity: 0.5, marginTop: 8,
          }}>
            Dark kitchen.<br />Sin local físico.<br />La papa va a vos.
          </div>
        </Reveal>

        {/* Bloque packaging */}
        <Reveal delay={0.2} style={{ position: "absolute", right: "4vw", top: "50vh", zIndex: 4 }}>
          <div style={{
            width: "36vw", height: "27vh",
            background: `repeating-linear-gradient(45deg, ${C.burgundy} 0, ${C.burgundy} 14px, ${C.tinta} 14px, ${C.tinta} 28px)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ ...F.display, fontSize: "clamp(14px, 5vw, 26px)", color: C.cream, letterSpacing: "0.04em" }}>SPRINGS</div>
          </div>
        </Reveal>

        {/* ABOUT US */}
        <Reveal delay={0.2} style={{ position: "absolute", left: "4vw", bottom: "26vh", zIndex: 3 }}>
          <h2 style={{
            ...F.display,
            fontSize: "clamp(48px, 16vw, 88px)",
            color: C.tinta, lineHeight: 0.85,
            letterSpacing: "-0.005em", margin: 0,
            textTransform: "uppercase",
          }}>
            ABOUT US
          </h2>
        </Reveal>

        {/* Banner JACKET CLUB */}
        <Reveal delay={0.3} style={{ position: "absolute", left: 0, right: 0, bottom: "13vh", zIndex: 4 }}>
          <div style={{
            display: "flex", alignItems: "stretch",
            border: `2px solid ${C.tinta}`,
            margin: "0 4vw",
          }}>
            <div style={{ background: C.burgundy, padding: "8px 12px", display: "flex", alignItems: "center", flexShrink: 0 }}>
              <span style={{ ...F.display, fontSize: "0.75rem", color: C.cream, letterSpacing: "0.08em" }}>SPRINGS™</span>
            </div>
            <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", flex: 1, background: C.cream }}>
              <span style={{
                ...F.mono, fontSize: "0.42rem", letterSpacing: "0.1em",
                color: C.tinta, textTransform: "uppercase",
              }}>
                NO BULLSHIT JACKETS. JUST INGREDIENTES SANTANDEREANOS Y MÁS CALITÉ.
              </span>
            </div>
          </div>
        </Reveal>

        {/* FAST GOOD LOUD */}
        <div style={{ position: "absolute", left: "4vw", bottom: "7vh", zIndex: 5 }}>
          <div style={{
            ...F.mono, fontSize: "0.6rem", letterSpacing: "0.15em",
            color: C.tinta, textTransform: "uppercase", lineHeight: 1.5,
          }}>
            FAST, GOOD &amp; LOUD<br />ESTO ES SPRINGS.
          </div>
        </div>
      </section>
    </div>
  );
}
