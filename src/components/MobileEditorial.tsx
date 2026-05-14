"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import DragSticker from "@/components/DragSticker";

const C = {
  burgundy: "#6B1419",
  cream: "#F2E8D5",
  tinta: "#1A0A0C",
  mostaza: "#C5871F",
};

const F = {
  display: { fontFamily: "Anton, sans-serif" },
  sans: { fontFamily: "Inter, sans-serif" },
  mono: { fontFamily: "JetBrains Mono, monospace" },
};

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
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
    <div
      style={{
        position: "relative",
        width: 4320, // 3 × 1440
        height: 900,
        flexShrink: 0,
        transformOrigin: "0 0",
      }}
    >
      {/* === ZONA 1 — HERO === */}

      {/* Papa hero — sangra desde la izquierda */}
      <div style={{
        position: "absolute", left: "-57.6px", top: "72px",
        width: "633.6px", height: "756px",
        background: "radial-gradient(ellipse at 45% 40%, #D4A55A 0%, #9B6530 35%, #5C3514 70%, #2E1A08 100%)",
        clipPath: "ellipse(48% 50% at 50% 50%)",
        zIndex: 2,
      }}>
        <span style={{
          position: "absolute", bottom: "8%", left: "20%",
          ...F.mono, fontSize: "0.55rem", letterSpacing: "0.22em",
          color: C.cream, opacity: 0.5, textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ display: "block", width: "16px", height: "1px", background: C.cream, opacity: 0.4 }} />
          La Jacket · 300g · Horneada
        </span>
      </div>

      {/* "FOR THE HOTTEST PEOPLE" mini */}
      <Reveal style={{ position: "absolute", left: "633.6px", top: "144px", zIndex: 5 }} delay={0.2}>
        <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.2em", color: C.tinta, opacity: 0.7, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "block", width: "14px", height: "14px", border: `1px solid ${C.tinta}`, borderRadius: "50%", opacity: 0.5 }} />
          FOR THE HOTTEST PEOPLE
        </div>
      </Reveal>

      {/* SPRINGS CITIES — tipografía gigante que se extiende */}
      <Reveal style={{ position: "absolute", left: "576px", top: "198px", zIndex: 3, whiteSpace: "nowrap" }}>
        <h1 style={{
          ...F.display,
          fontSize: "clamp(140px, 316.8px, 380px)",
          color: C.tinta, lineHeight: 0.85,
          letterSpacing: "-0.005em",
          margin: 0,
          textTransform: "uppercase",
        }}>
          SPRINGS CITIES
        </h1>
      </Reveal>

      {/* COLLECTION abajo */}
      <Reveal delay={0.15} style={{ position: "absolute", left: "432px", bottom: "144px", zIndex: 3, whiteSpace: "nowrap" }}>
        <h2 style={{
          ...F.display,
          fontSize: "clamp(80px, 201.6px, 220px)",
          color: C.tinta, lineHeight: 0.85,
          letterSpacing: "-0.005em",
          margin: 0,
          textTransform: "uppercase",
        }}>
          CARTA 2025
        </h2>
      </Reveal>

      {/* Label La Fija */}
      <div style={{ position: "absolute", left: "57.6px", bottom: "270px", zIndex: 6 }}>
        <div style={{ ...F.sans, fontSize: "0.72rem", color: C.tinta, fontStyle: "italic" }}>La Fija ↗</div>
        <div style={{ ...F.mono, fontSize: "0.58rem", letterSpacing: "0.15em", color: C.tinta, opacity: 0.5, marginTop: "3px" }}>W25 [BGA]</div>
        <div style={{ marginTop: "12px", width: "32px", height: "32px", border: `1px solid ${C.tinta}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ ...F.mono, fontSize: "0.55rem", color: C.tinta, opacity: 0.6 }}>↗</span>
        </div>
      </div>

      {/* Sticker SPRINGS JACKET CLUB — draggable */}
      <DragSticker
        rotate={-8}
        idleRotateRange={2}
        idleDuration={7}
        onDragStart={pauseScroll}
        onDragEnd={resumeScroll}
        style={{
          position: "absolute", left: "432px", top: "72px", zIndex: 20,
          background: C.burgundy, color: C.cream,
          padding: "12px 18px",
          textAlign: "center",
          border: `2px solid ${C.tinta}`,
        }}
      >
        <div style={{ ...F.display, fontSize: "1.1rem", letterSpacing: "0.08em", lineHeight: 1 }}>SPRINGS</div>
        <div style={{ ...F.display, fontSize: "0.95rem", fontStyle: "italic", lineHeight: 1, marginTop: "2px" }}>Jacket Club</div>
        <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.1em", marginTop: "8px", lineHeight: 1.3, textTransform: "uppercase" }}>
          ESTO ES ALGO ASÍ<br />COMO QUE TE PAGAMOS<br />POR COMER SPRINGS
        </div>
        <div style={{ marginTop: "8px", background: C.tinta, color: C.cream, padding: "4px 14px", display: "inline-block", ...F.mono, fontSize: "0.6rem", letterSpacing: "0.2em" }}>ACCEDER</div>
      </DragSticker>

      {/* Sticker SPRINGS [UNVRS] holográfico — draggable */}
      <DragSticker
        rotate={3}
        idleRotateRange={2.5}
        idleDuration={6}
        onDragStart={pauseScroll}
        onDragEnd={resumeScroll}
        style={{
          position: "absolute", left: "720px", top: "45px", zIndex: 20,
          padding: "8px 16px",
          background: "linear-gradient(135deg, #e0e0e0 0%, #ffffff 50%, #c0c0c0 100%)",
          border: `1.5px solid ${C.tinta}`,
          textAlign: "center",
        }}
      >
        <div style={{ ...F.display, fontSize: "0.95rem", letterSpacing: "0.05em", color: C.tinta }}>SPRINGS™ [UNVRS]</div>
        <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.18em", color: C.tinta, marginTop: "3px", textTransform: "uppercase" }}>
          SPRINGS (SPACE) JACKET CLUB X BGA<br />LIMITED EDITION
        </div>
      </DragSticker>

      {/* Sticker RÓBALA — campaña activa, mostaza — draggable */}
      <DragSticker
        rotate={12}
        idleRotateRange={3}
        idleDuration={5}
        onDragStart={pauseScroll}
        onDragEnd={resumeScroll}
        style={{
          position: "absolute", left: "1094.4px", top: "99px", zIndex: 22,
          background: C.mostaza, color: C.tinta,
          padding: "14px 20px",
          border: `2px solid ${C.tinta}`,
          textAlign: "center",
        }}
      >
        <div style={{ ...F.display, fontSize: "1.5rem", letterSpacing: "0.06em", lineHeight: 1 }}>RÓBALA</div>
        <div style={{ ...F.mono, fontSize: "0.52rem", letterSpacing: "0.14em", marginTop: "6px", lineHeight: 1.3, textTransform: "uppercase" }}>
          BONO ESCONDIDO<br />EN LA CIUDAD
        </div>
        <div style={{ marginTop: "8px", background: C.tinta, color: C.mostaza, padding: "3px 12px", display: "inline-block", ...F.mono, fontSize: "0.55rem", letterSpacing: "0.2em" }}>STORIES ↗</div>
      </DragSticker>

      {/* Sticker MIÉRCOLES DE DADOS — draggable */}
      <DragSticker
        rotate={-14}
        idleRotateRange={3}
        idleDuration={6}
        onDragStart={pauseScroll}
        onDragEnd={resumeScroll}
        style={{
          position: "absolute", left: "1180.8px", top: "558px", zIndex: 22,
          background: C.cream, color: C.tinta,
          padding: "12px 16px",
          border: `2px solid ${C.tinta}`,
          textAlign: "center",
        }}
      >
        <div style={{ ...F.display, fontSize: "1.1rem", letterSpacing: "0.05em", lineHeight: 1 }}>MIÉRCOLES</div>
        <div style={{ ...F.display, fontSize: "1.1rem", fontStyle: "italic", lineHeight: 1, marginTop: "2px" }}>de Dados</div>
        <div style={{
          margin: "8px auto 0",
          width: "34px", height: "34px",
          background: C.tinta, color: C.cream,
          ...F.display, fontSize: "1.3rem",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>6</div>
        <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.15em", marginTop: "6px", textTransform: "uppercase", opacity: 0.7 }}>
          SACA 6 = GRATIS
        </div>
      </DragSticker>

      {/* Stickers pequeños flotantes */}
      <div style={{ position: "absolute", left: "892.8px", top: "396px", zIndex: 8 }}>
        <div style={{ ...F.sans, fontSize: "0.7rem", color: C.tinta, fontStyle: "italic" }}>TE DAMOS LO TUYO</div>
        <div style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.5, marginTop: "2px" }}>@SPRINGS.COL</div>
      </div>

      {/* Sticker SPRINGS (logo grande tipo etiqueta) — draggable */}
      <DragSticker
        rotate={-4}
        idleRotateRange={3}
        idleDuration={5}
        onDragStart={pauseScroll}
        onDragEnd={resumeScroll}
        style={{
          position: "absolute", left: "864px", top: "468px", zIndex: 20,
          background: C.tinta, padding: "8px 18px",
          border: `2px solid ${C.burgundy}`,
        }}
      >
        <div style={{ ...F.display, fontSize: "1.8rem", color: C.burgundy, letterSpacing: "0.05em", lineHeight: 1 }}>SPRINGS</div>
      </DragSticker>

      {/* Símbolos flotantes */}
      <span style={{ position: "absolute", left: "835.2px", top: "396px", ...F.display, fontSize: "1.2rem", color: C.tinta, opacity: 0.3, zIndex: 5 }}>+</span>
      <span style={{ position: "absolute", left: "1051.2px", top: "522px", fontSize: "1.4rem", color: C.tinta, opacity: 0.3, zIndex: 5 }}>☺</span>
      <span style={{ position: "absolute", left: "1008px", top: "288px", ...F.display, fontSize: "1rem", color: C.tinta, opacity: 0.3, zIndex: 5 }}>✦</span>

      {/* "AQUÍ TIENES NUESTRO MENÚ" */}
      <div style={{ position: "absolute", left: "892.8px", bottom: "270px", zIndex: 6 }}>
        <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.18em", color: C.tinta, textTransform: "uppercase" }}>AQUÍ TIENES NUESTRO MENÚ</div>
      </div>

      {/* Sticker PEDIDO GRANDE — burgundy — draggable */}
      <DragSticker
        rotate={-6}
        idleRotateRange={3}
        idleDuration={7}
        onDragStart={pauseScroll}
        onDragEnd={resumeScroll}
        style={{
          position: "absolute", left: "892.8px", bottom: "90px", zIndex: 20,
          background: C.burgundy, color: C.cream,
          padding: "14px 22px",
          border: `2px solid ${C.tinta}`,
          textAlign: "center",
        }}
      >
        <div style={{ ...F.display, fontSize: "1.3rem", letterSpacing: "0.04em", lineHeight: 1 }}>PEDIDO GRANDE</div>
        <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.12em", marginTop: "6px", lineHeight: 1.3, textTransform: "uppercase" }}>
          ¿OFICINA? ¿FAMILIA?<br />HABLEMOS.
        </div>
        <div style={{ marginTop: "8px", background: C.tinta, padding: "3px 12px", display: "inline-block", ...F.mono, fontSize: "0.55rem", letterSpacing: "0.18em" }}>CLICK AQUÍ</div>
      </DragSticker>

      {/* Menú corrido — lista de productos */}
      <Reveal delay={0.3} style={{
        position: "absolute", left: "57.6px", bottom: "72px", zIndex: 6,
        maxWidth: "576px",
      }}>
        <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.08em", color: C.tinta, opacity: 0.55, lineHeight: 1.8, textTransform: "uppercase" }}>
          LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA /<br />
          LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA /<br />
          LOADED CHORIZO / FUSE / EXTRA QUESO / AGUACATE /<br />
          HUEVO FRITO / HOGAO DOBLE / DOBLE RELLENO /<br />
          LIMONADA NATURAL / LIMONADA DE PANELA / AGUA / GASEOSA /
        </div>
      </Reveal>


      {/* === ZONA 2 — JACKETS GRID === */}

      {/* Foto editorial 1 — modelo con gafas */}
      <Reveal style={{ position: "absolute", left: "1555.2px", top: "198px", zIndex: 4 }}>
        <div style={{
          width: "288px", height: "540px",
          background: `linear-gradient(160deg, ${C.burgundy} 0%, #4A0E12 100%)`,
          display: "flex", alignItems: "flex-end", padding: "16px",
        }}>
          <div>
            <div style={{ ...F.display, fontSize: "0.9rem", color: C.cream, letterSpacing: "0.08em" }}>LA FIJA</div>
            <div style={{ ...F.mono, fontSize: "0.7rem", color: C.mostaza, fontWeight: 600 }}>32,900</div>
          </div>
        </div>
      </Reveal>

      {/* Foto editorial 2 — packshot */}
      <Reveal delay={0.1} style={{ position: "absolute", left: "1886.4px", top: "162px", zIndex: 4 }}>
        <div style={{
          width: "230.4px", height: "468px",
          background: `linear-gradient(180deg, #3a1818 0%, ${C.tinta} 100%)`,
          border: `2px solid ${C.cream}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px",
          position: "relative",
        }}>
          <div style={{
            ...F.display, fontSize: "clamp(28px, 43.2px, 48px)",
            color: C.cream, letterSpacing: "0.02em",
            textAlign: "center", lineHeight: 0.95,
          }}>
            ESTO<br />ES<br />SPRINGS
          </div>
          <div style={{ position: "absolute", bottom: "14px", left: "16px", ...F.mono, fontSize: "0.55rem", letterSpacing: "0.15em", color: C.mostaza }}>LA PESADA</div>
          <div style={{ position: "absolute", bottom: "14px", right: "16px", ...F.mono, fontSize: "0.6rem", color: C.mostaza, fontWeight: 600 }}>35,900</div>
        </div>
      </Reveal>

      {/* Foto editorial 3 — packaging */}
      <Reveal delay={0.2} style={{ position: "absolute", left: "2160px", top: "234px", zIndex: 4 }}>
        <div style={{
          width: "259.2px", height: "504px",
          background: C.tinta,
          backgroundImage: `repeating-linear-gradient(45deg, ${C.burgundy} 0px, ${C.burgundy} 24px, ${C.tinta} 24px, ${C.tinta} 48px)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ ...F.display, fontSize: "2.4rem", color: C.cream, letterSpacing: "0.04em", transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
            SPRINGS
          </div>
        </div>
      </Reveal>

      {/* Sticker holográfico MUY RICA — draggable */}
      <DragSticker
        rotate={-4}
        idleRotateRange={4}
        idleDuration={5}
        onDragStart={pauseScroll}
        onDragEnd={resumeScroll}
        style={{
          position: "absolute", left: "1828.8px", top: "135px", zIndex: 25,
          width: "60px", height: "60px",
          background: "linear-gradient(135deg, #c0e0ff 0%, #ffd0e0 50%, #e0e0ff 100%)",
          border: `1.5px solid ${C.tinta}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.1em", color: C.tinta, textAlign: "center" }}>SPRINGS<br />MUY RICA</span>
      </DragSticker>

      {/* Sticker DROP — papa de temporada — draggable */}
      <DragSticker
        rotate={9}
        idleRotateRange={3}
        idleDuration={5.5}
        onDragStart={pauseScroll}
        onDragEnd={resumeScroll}
        style={{
          position: "absolute", left: "2361.6px", top: "90px", zIndex: 25,
          background: C.tinta, color: C.mostaza,
          padding: "10px 18px",
          border: `2px solid ${C.mostaza}`,
          textAlign: "center",
        }}
      >
        <div style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.22em", opacity: 0.7, marginBottom: "2px" }}>W25 · DROP</div>
        <div style={{ ...F.display, fontSize: "1.6rem", letterSpacing: "0.04em", color: C.cream, lineHeight: 1 }}>SOLO 20</div>
        <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.14em", marginTop: "4px" }}>POR NOCHE</div>
      </DragSticker>

      {/* "TE DAMOS LO TUYO" continuación */}
      <Reveal delay={0.1} style={{ position: "absolute", left: "2476.8px", top: "180px", zIndex: 5 }}>
        <div style={{ ...F.sans, fontSize: "0.78rem", color: C.tinta, fontStyle: "italic" }}>TE DAMOS LO TUYO</div>
        <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.5, marginTop: "3px" }}>@SPRINGS.COL</div>
      </Reveal>

      {/* QR + Daily Dose */}
      <Reveal style={{ position: "absolute", left: "2476.8px", top: "288px", zIndex: 5 }}>
        <div style={{ ...F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.tinta, textTransform: "uppercase", marginBottom: "8px", maxWidth: "120px", lineHeight: 1.3 }}>
          DAILY DOSE<br />OF SPRINGS HERE
        </div>
        <div style={{
          width: "84px", height: "84px",
          background: C.tinta,
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 4px, ${C.cream} 4px, ${C.cream} 6px), repeating-linear-gradient(90deg, transparent 0px, transparent 4px, ${C.cream} 4px, ${C.cream} 6px)`,
          border: `2px solid ${C.tinta}`,
        }} />
        <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ ...F.display, fontSize: "1rem", color: C.tinta }}>↗</span>
          <span style={{ width: "16px", height: "16px", border: `1.5px solid ${C.tinta}`, borderRadius: "50%" }} />
        </div>
      </Reveal>

      {/* Big black rectangle (como Vicio) */}
      <div style={{
        position: "absolute", left: "2764.8px", top: "108px", zIndex: 3,
        width: "230.4px", height: "288px",
        background: C.tinta,
      }} />

      {/* Lista de Jackets en columna a la derecha */}
      <Reveal delay={0.3} style={{ position: "absolute", left: "1555.2px", bottom: "90px", zIndex: 6, maxWidth: "1296px" }}>
        <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.08em", color: C.tinta, lineHeight: 1.8, textTransform: "uppercase", opacity: 0.55 }}>
          LA FIJA · POLLO DESMECHADO · 32,900 / LA PESADA · CARNE DESMECHADA · 35,900 /<br />
          LA BRAVA · CHORIZO SANTANDEREANO · 34,900 / LA SIMPLE · CARNE MOLIDA · 28,900 /<br />
          LA HONESTA · SIN CARNE · 28,900 /
        </div>
      </Reveal>


      {/* === ZONA 3 — ABOUT / LOADED === */}

      {/* Logo 3D placeholder — chrome SPRINGS */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "absolute", left: "3240px", top: "162px", zIndex: 4,
          width: "374.4px", height: "288px",
          background: `radial-gradient(ellipse at 30% 30%, #e8b8b8 0%, ${C.burgundy} 40%, ${C.tinta} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{
          ...F.display, fontSize: "clamp(60px, 100.8px, 130px)",
          color: C.cream, letterSpacing: "0.02em",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
          fontStyle: "italic",
        }}>
          Springs
        </div>
        <span style={{ position: "absolute", top: "12%", right: "12%", color: C.cream, fontSize: "1.2rem", opacity: 0.8 }}>✦</span>
      </motion.div>

      {/* Foto packaging trio */}
      <Reveal style={{ position: "absolute", left: "3686.4px", top: "270px", zIndex: 5 }}>
        <div style={{
          width: "259.2px", height: "396px",
          background: `repeating-linear-gradient(45deg, ${C.burgundy} 0, ${C.burgundy} 18px, ${C.tinta} 18px, ${C.tinta} 36px)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ ...F.display, fontSize: "2rem", color: C.cream, letterSpacing: "0.04em" }}>SPRINGS</div>
        </div>
      </Reveal>

      {/* Sneakers / brand artifact */}
      <Reveal delay={0.1} style={{ position: "absolute", left: "3974.4px", top: "108px", zIndex: 4 }}>
        <div style={{
          width: "201.6px", height: "324px",
          background: `linear-gradient(180deg, ${C.tinta} 0%, #2a1010 100%)`,
          display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px",
        }}>
          <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.15em", color: C.cream, opacity: 0.5, textTransform: "uppercase", marginBottom: "4px" }}>
            ▮▮▮▮ ▮▮ ▮▮▮ ▮▮▮▮
          </div>
          <div style={{ ...F.sans, fontSize: "0.7rem", color: C.cream, fontStyle: "italic" }}>
            Y BUCARAMANGA<br />NOS DIÓ LO NUESTRO
          </div>
        </div>
      </Reveal>

      {/* FAQS rotada */}
      <div style={{
        position: "absolute", left: "4204.8px", top: "144px", zIndex: 5,
        transform: "rotate(-90deg)", transformOrigin: "left top",
      }}>
        <div style={{ ...F.display, fontSize: "clamp(40px, 72px, 80px)", color: C.tinta, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ ...F.mono, fontSize: "0.5em", opacity: 0.4 }}>↗</span> FAQS
        </div>
      </div>

      {/* Foto especial — La Brava */}
      <Reveal delay={0.2} style={{ position: "absolute", left: "4291.2px", top: "108px", zIndex: 4 }}>
        <div style={{
          width: "201.6px", height: "288px",
          background: `radial-gradient(ellipse at center, ${C.burgundy} 0%, #3a0a0e 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
        }}>
          <div style={{ ...F.display, fontSize: "1.6rem", color: C.cream, letterSpacing: "0.04em", textAlign: "center" }}>LA<br />BRAVA</div>
        </div>
      </Reveal>

      {/* ABOUT US gigante */}
      <Reveal delay={0.2} style={{ position: "absolute", left: "3398.4px", bottom: "180px", zIndex: 3, whiteSpace: "nowrap" }}>
        <h2 style={{
          ...F.display,
          fontSize: "clamp(100px, 230.4px, 280px)",
          color: C.tinta, lineHeight: 0.85,
          letterSpacing: "-0.005em", margin: 0,
          textTransform: "uppercase",
        }}>
          ABOUT US
        </h2>
      </Reveal>

      {/* Banner SPRINGS JACKET CLUB */}
      <Reveal delay={0.3} style={{ position: "absolute", left: "3369.6px", bottom: "90px", zIndex: 4 }}>
        <div style={{
          display: "flex", alignItems: "stretch",
          background: C.cream,
          border: `2px solid ${C.tinta}`,
          transform: "skewX(-4deg)",
        }}>
          <div style={{ background: C.burgundy, padding: "10px 18px", display: "flex", alignItems: "center" }}>
            <span style={{ ...F.display, fontSize: "1rem", color: C.cream, letterSpacing: "0.1em" }}>SPRINGS™ — JACKET CLUB —</span>
          </div>
          <div style={{ padding: "10px 18px", display: "flex", alignItems: "center" }}>
            <span style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.15em", color: C.tinta, textTransform: "uppercase" }}>
              NO BULLSHIT JACKETS. JUST INGREDIENTES SANTANDEREANOS Y MÁS CALITÉ.
            </span>
          </div>
          <div style={{ background: C.burgundy, padding: "10px 18px", display: "flex", alignItems: "center" }}>
            <span style={{ ...F.display, fontSize: "1rem", color: C.cream, letterSpacing: "0.1em" }}>— ESTO ES SPRINGS —</span>
          </div>
        </div>
      </Reveal>

      {/* "FAST, GOOD & LOUD" */}
      <div style={{ position: "absolute", left: "3830.4px", bottom: "36px", zIndex: 5 }}>
        <div style={{ ...F.mono, fontSize: "0.7rem", letterSpacing: "0.15em", color: C.tinta, textTransform: "uppercase", lineHeight: 1.4 }}>
          FAST, GOOD &amp; LOUD<br />ESTO ES SPRINGS.
        </div>
      </div>

      {/* Burger detail bleeding al final */}
      <div style={{
        position: "absolute", left: "4536px", bottom: "108px", zIndex: 4,
        width: "403.2px", height: "576px",
        background: "radial-gradient(ellipse at 45% 40%, #D4A55A 0%, #9B6530 35%, #5C3514 70%, #2E1A08 100%)",
        clipPath: "ellipse(48% 50% at 50% 50%)",
      }} />

      <Reveal delay={0.2} style={{ position: "absolute", left: "4579.2px", top: "144px", zIndex: 5 }}>
        <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.15em", color: C.tinta, textTransform: "uppercase" }}>BUCARAMANGA · BGA</div>
        <div style={{ ...F.display, fontSize: "clamp(40px, 72px, 96px)", color: C.tinta, marginTop: "12px", lineHeight: 0.9, textTransform: "uppercase" }}>
          SOLO<br />DELIVERY.
        </div>
        <div style={{ ...F.sans, fontSize: "0.85rem", fontStyle: "italic", color: C.tinta, opacity: 0.5, marginTop: "12px", maxWidth: "240px" }}>
          Dark kitchen. Sin local físico.<br />La papa va a vos, no al revés.
        </div>
      </Reveal>

    </div>
  );
}
