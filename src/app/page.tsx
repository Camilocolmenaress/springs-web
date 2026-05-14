"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion, useInView } from "framer-motion";

// Helper: elemento que aparece al entrar al viewport
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

export default function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let raf: number;
    const animate = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Estilos base
  const F = {
    display: { fontFamily: "Anton, sans-serif" },
    sans:    { fontFamily: "Inter, sans-serif" },
    mono:    { fontFamily: "JetBrains Mono, monospace" },
  };
  const C = {
    burgundy: "#6B1419",
    cream: "#F2E8D5",
    tinta: "#1A0A0C",
    mostaza: "#C5871F",
  };

  return (
    <>
      {/* ── NAV TOP FIJO ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        padding: "20px 32px", pointerEvents: "none",
        mixBlendMode: "difference",
      }}>
        <a href="#" style={{ ...F.display, fontSize: "1.4rem", letterSpacing: "0.18em", color: C.cream, textDecoration: "none", pointerEvents: "auto" }}>SPRINGS</a>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "32px", pointerEvents: "auto" }}>
          <p style={{ ...F.mono, fontSize: "0.65rem", lineHeight: 1.4, letterSpacing: "0.1em", textTransform: "uppercase", color: C.cream, maxWidth: "180px", textAlign: "right" }}>
            LA JACKET ES<br />EL PRODUCTO HOY.
          </p>
          <a href="#pedir" style={{
            display: "flex", alignItems: "center", gap: "8px",
            border: `1px solid ${C.burgundy}`, color: C.burgundy, background: C.cream,
            ...F.mono, fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase",
            padding: "10px 18px", textDecoration: "none", borderRadius: "999px",
          }}>
            <span style={{ width: "6px", height: "6px", background: C.mostaza, borderRadius: "50%" }} />
            ¡PEDIR YA!
          </a>
        </div>
      </nav>

      {/* ── NAV BOTTOM FIJO ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 32px", pointerEvents: "none",
        mixBlendMode: "difference",
      }}>
        <ul style={{ display: "flex", gap: "28px", listStyle: "none", padding: 0, margin: 0, pointerEvents: "auto" }}>
          {["CARTA", "JACKETS", "LOADED", "NOSOTROS", "PEDIR"].map((item) => (
            <li key={item}>
              <a href="#" style={{ ...F.mono, fontSize: "0.65rem", letterSpacing: "0.2em", color: C.cream, textDecoration: "none", opacity: 0.7 }}>{item}</a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", pointerEvents: "auto" }}>
          <a href="#" style={{ ...F.mono, fontSize: "0.65rem", letterSpacing: "0.18em", color: C.cream, textDecoration: "none", opacity: 0.7 }}>TIKTOK</a>
          <a href="#" style={{ ...F.mono, fontSize: "0.65rem", letterSpacing: "0.18em", color: C.cream, textDecoration: "none", opacity: 0.7 }}>INSTAGRAM</a>
          <span style={{ ...F.mono, fontSize: "0.65rem", color: C.cream, opacity: 0.7 }}>↗</span>
        </div>
      </nav>

      {/* ── WRAPPER LENIS ── */}
      <div ref={wrapperRef} style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.cream }}>
        {/* ── CANVAS CONTINUO 500vw ── */}
        <div ref={contentRef} style={{ position: "relative", width: "500vw", height: "100vh" }}>

          {/* ═══════════════════════════════════════
              ZONA 1 — HERO (0 → 100vw)
          ═══════════════════════════════════════ */}

          {/* Papa hero — sangra desde la izquierda */}
          <div style={{
            position: "absolute", left: "-4vw", top: "8vh",
            width: "44vw", height: "84vh",
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
          <Reveal style={{ position: "absolute", left: "44vw", top: "16vh", zIndex: 5 }} delay={0.2}>
            <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.2em", color: C.tinta, opacity: 0.7, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ display: "block", width: "14px", height: "14px", border: `1px solid ${C.tinta}`, borderRadius: "50%", opacity: 0.5 }} />
              FOR THE HOTTEST PEOPLE
            </div>
          </Reveal>

          {/* SPRINGS CITIES — tipografía gigante que se extiende */}
          <Reveal style={{ position: "absolute", left: "40vw", top: "22vh", zIndex: 3, whiteSpace: "nowrap" }}>
            <h1 style={{
              ...F.display,
              fontSize: "clamp(140px, 22vw, 380px)",
              color: C.tinta, lineHeight: 0.85,
              letterSpacing: "-0.005em",
              margin: 0,
              textTransform: "uppercase",
            }}>
              SPRINGS CITIES
            </h1>
          </Reveal>

          {/* COLLECTION abajo */}
          <Reveal delay={0.15} style={{ position: "absolute", left: "30vw", bottom: "16vh", zIndex: 3, whiteSpace: "nowrap" }}>
            <h2 style={{
              ...F.display,
              fontSize: "clamp(80px, 14vw, 220px)",
              color: C.tinta, lineHeight: 0.85,
              letterSpacing: "-0.005em",
              margin: 0,
              textTransform: "uppercase",
            }}>
              CARTA 2025
            </h2>
          </Reveal>

          {/* Label La Fija */}
          <div style={{ position: "absolute", left: "4vw", bottom: "30vh", zIndex: 6 }}>
            <div style={{ ...F.sans, fontSize: "0.72rem", color: C.tinta, fontStyle: "italic" }}>La Fija ↗</div>
            <div style={{ ...F.mono, fontSize: "0.58rem", letterSpacing: "0.15em", color: C.tinta, opacity: 0.5, marginTop: "3px" }}>W25 [BGA]</div>
            <div style={{ marginTop: "12px", width: "32px", height: "32px", border: `1px solid ${C.tinta}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ ...F.mono, fontSize: "0.55rem", color: C.tinta, opacity: 0.6 }}>↗</span>
            </div>
          </div>

          {/* Sticker SPRINGS BURGER CLUB (rojo) — placeholder */}
          <motion.div
            initial={{ rotate: -8, scale: 0 }}
            animate={{ rotate: -8, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
            style={{
              position: "absolute", left: "30vw", top: "8vh", zIndex: 20,
              background: C.burgundy, color: C.cream,
              padding: "12px 18px",
              transform: "rotate(-8deg)",
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
          </motion.div>

          {/* Sticker SPRINGS [UNVRS] holográfico */}
          <motion.div
            animate={{ rotate: [3, -2, 3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", left: "50vw", top: "5vh", zIndex: 20,
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
          </motion.div>

          {/* Stickers pequeños flotantes */}
          <div style={{ position: "absolute", left: "62vw", top: "44vh", zIndex: 8 }}>
            <div style={{ ...F.sans, fontSize: "0.7rem", color: C.tinta, fontStyle: "italic" }}>TE DAMOS LO TUYO</div>
            <div style={{ ...F.mono, fontSize: "0.6rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.5, marginTop: "2px" }}>@SPRINGS.COL</div>
          </div>

          {/* Sticker SPRINGS (logo grande tipo etiqueta) */}
          <motion.div
            animate={{ rotate: [-4, 2, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", left: "60vw", top: "52vh", zIndex: 20,
              background: C.tinta, padding: "8px 18px",
              transform: "rotate(-4deg)",
              border: `2px solid ${C.burgundy}`,
            }}
          >
            <div style={{ ...F.display, fontSize: "1.8rem", color: C.burgundy, letterSpacing: "0.05em", lineHeight: 1 }}>SPRINGS</div>
          </motion.div>

          {/* Símbolos flotantes */}
          <span style={{ position: "absolute", left: "58vw", top: "44vh", ...F.display, fontSize: "1.2rem", color: C.tinta, opacity: 0.3, zIndex: 5 }}>+</span>
          <span style={{ position: "absolute", left: "73vw", top: "58vh", fontSize: "1.4rem", color: C.tinta, opacity: 0.3, zIndex: 5 }}>☺</span>
          <span style={{ position: "absolute", left: "70vw", top: "32vh", ...F.display, fontSize: "1rem", color: C.tinta, opacity: 0.3, zIndex: 5 }}>✦</span>

          {/* "AQUÍ TIENES NUESTRO MENÚ" */}
          <div style={{ position: "absolute", left: "62vw", bottom: "30vh", zIndex: 6 }}>
            <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.18em", color: C.tinta, textTransform: "uppercase" }}>AQUÍ TIENES NUESTRO MENÚ</div>
          </div>

          {/* Sticker BIG ORDERS — burgundy */}
          <motion.div
            animate={{ rotate: [-6, 4, -6] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", left: "62vw", bottom: "10vh", zIndex: 20,
              background: C.burgundy, color: C.cream,
              padding: "14px 22px",
              transform: "rotate(-6deg)",
              border: `2px solid ${C.tinta}`,
              textAlign: "center",
            }}
          >
            <div style={{ ...F.display, fontSize: "1.3rem", letterSpacing: "0.04em", lineHeight: 1 }}>PEDIDO GRANDE</div>
            <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.12em", marginTop: "6px", lineHeight: 1.3, textTransform: "uppercase" }}>
              ¿OFICINA? ¿FAMILIA?<br />HABLEMOS.
            </div>
            <div style={{ marginTop: "8px", background: C.tinta, padding: "3px 12px", display: "inline-block", ...F.mono, fontSize: "0.55rem", letterSpacing: "0.18em" }}>CLICK AQUÍ</div>
          </motion.div>

          {/* Menú corrido — lista de productos */}
          <Reveal delay={0.3} style={{
            position: "absolute", left: "4vw", bottom: "8vh", zIndex: 6,
            maxWidth: "40vw",
          }}>
            <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.08em", color: C.tinta, opacity: 0.55, lineHeight: 1.8, textTransform: "uppercase" }}>
              LA FIJA / LA PESADA / LA BRAVA / LA SIMPLE / LA HONESTA /<br />
              LOADED POLLO / LOADED MOLIDA / LOADED DESMECHADA /<br />
              LOADED CHORIZO / FUSE / EXTRA QUESO / AGUACATE /<br />
              HUEVO FRITO / HOGAO DOBLE / DOBLE RELLENO /<br />
              LIMONADA NATURAL / LIMONADA DE PANELA / AGUA / GASEOSA /
            </div>
          </Reveal>


          {/* ═══════════════════════════════════════
              ZONA 2 — JACKETS GRID (100 → 220vw)
          ═══════════════════════════════════════ */}

          {/* Foto editorial 1 — modelo con gafas */}
          <Reveal style={{ position: "absolute", left: "108vw", top: "22vh", zIndex: 4 }}>
            <div style={{
              width: "20vw", height: "60vh",
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
          <Reveal delay={0.1} style={{ position: "absolute", left: "131vw", top: "18vh", zIndex: 4 }}>
            <div style={{
              width: "16vw", height: "52vh",
              background: `linear-gradient(180deg, #3a1818 0%, ${C.tinta} 100%)`,
              border: `2px solid ${C.cream}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px",
              position: "relative",
            }}>
              <div style={{
                ...F.display, fontSize: "clamp(28px, 3vw, 48px)",
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
          <Reveal delay={0.2} style={{ position: "absolute", left: "150vw", top: "26vh", zIndex: 4 }}>
            <div style={{
              width: "18vw", height: "56vh",
              background: C.tinta,
              backgroundImage: `repeating-linear-gradient(45deg, ${C.burgundy} 0px, ${C.burgundy} 24px, ${C.tinta} 24px, ${C.tinta} 48px)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ ...F.display, fontSize: "2.4rem", color: C.cream, letterSpacing: "0.04em", transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
                SPRINGS
              </div>
            </div>
          </Reveal>

          {/* Sticker holográfico */}
          <motion.div
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", left: "127vw", top: "15vh", zIndex: 25,
              width: "60px", height: "60px",
              background: "linear-gradient(135deg, #c0e0ff 0%, #ffd0e0 50%, #e0e0ff 100%)",
              border: `1.5px solid ${C.tinta}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ ...F.mono, fontSize: "0.5rem", letterSpacing: "0.1em", color: C.tinta, textAlign: "center" }}>SPRINGS<br />MUY RICA</span>
          </motion.div>

          {/* "TE DAMOS LO TUYO" continuación */}
          <Reveal delay={0.1} style={{ position: "absolute", left: "172vw", top: "20vh", zIndex: 5 }}>
            <div style={{ ...F.sans, fontSize: "0.78rem", color: C.tinta, fontStyle: "italic" }}>TE DAMOS LO TUYO</div>
            <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.1em", color: C.tinta, opacity: 0.5, marginTop: "3px" }}>@SPRINGS.COL</div>
          </Reveal>

          {/* QR + Daily Dose */}
          <Reveal style={{ position: "absolute", left: "172vw", top: "32vh", zIndex: 5 }}>
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
            position: "absolute", left: "192vw", top: "12vh", zIndex: 3,
            width: "16vw", height: "32vh",
            background: C.tinta,
          }} />

          {/* Lista de Jackets en columna a la derecha */}
          <Reveal delay={0.3} style={{ position: "absolute", left: "108vw", bottom: "10vh", zIndex: 6, maxWidth: "90vw" }}>
            <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.08em", color: C.tinta, lineHeight: 1.8, textTransform: "uppercase", opacity: 0.55 }}>
              LA FIJA · POLLO DESMECHADO · 32,900 / LA PESADA · CARNE DESMECHADA · 35,900 /<br />
              LA BRAVA · CHORIZO SANTANDEREANO · 34,900 / LA SIMPLE · CARNE MOLIDA · 28,900 /<br />
              LA HONESTA · SIN CARNE · 28,900 /
            </div>
          </Reveal>


          {/* ═══════════════════════════════════════
              ZONA 3 — ABOUT / LOADED (220 → 380vw)
          ═══════════════════════════════════════ */}

          {/* Logo 3D placeholder — chrome SPRINGS */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute", left: "225vw", top: "18vh", zIndex: 4,
              width: "26vw", height: "32vh",
              background: `radial-gradient(ellipse at 30% 30%, #e8b8b8 0%, ${C.burgundy} 40%, ${C.tinta} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <div style={{
              ...F.display, fontSize: "clamp(60px, 7vw, 130px)",
              color: C.cream, letterSpacing: "0.02em",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
              fontStyle: "italic",
            }}>
              Springs
            </div>
            <span style={{ position: "absolute", top: "12%", right: "12%", color: C.cream, fontSize: "1.2rem", opacity: 0.8 }}>✦</span>
          </motion.div>

          {/* Foto packaging trio */}
          <Reveal style={{ position: "absolute", left: "256vw", top: "30vh", zIndex: 5 }}>
            <div style={{
              width: "18vw", height: "44vh",
              background: `repeating-linear-gradient(45deg, ${C.burgundy} 0, ${C.burgundy} 18px, ${C.tinta} 18px, ${C.tinta} 36px)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ ...F.display, fontSize: "2rem", color: C.cream, letterSpacing: "0.04em" }}>SPRINGS</div>
            </div>
          </Reveal>

          {/* Sneakers / brand artifact */}
          <Reveal delay={0.1} style={{ position: "absolute", left: "276vw", top: "12vh", zIndex: 4 }}>
            <div style={{
              width: "14vw", height: "36vh",
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
            position: "absolute", left: "292vw", top: "16vh", zIndex: 5,
            transform: "rotate(-90deg)", transformOrigin: "left top",
          }}>
            <div style={{ ...F.display, fontSize: "clamp(40px, 5vw, 80px)", color: C.tinta, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ ...F.mono, fontSize: "0.5em", opacity: 0.4 }}>↗</span> FAQS
            </div>
          </div>

          {/* Foto especial — La Brava */}
          <Reveal delay={0.2} style={{ position: "absolute", left: "298vw", top: "12vh", zIndex: 4 }}>
            <div style={{
              width: "14vw", height: "32vh",
              background: `radial-gradient(ellipse at center, ${C.burgundy} 0%, #3a0a0e 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
            }}>
              <div style={{ ...F.display, fontSize: "1.6rem", color: C.cream, letterSpacing: "0.04em", textAlign: "center" }}>LA<br />BRAVA</div>
            </div>
          </Reveal>

          {/* ABOUT US gigante */}
          <Reveal delay={0.2} style={{ position: "absolute", left: "236vw", bottom: "20vh", zIndex: 3, whiteSpace: "nowrap" }}>
            <h2 style={{
              ...F.display,
              fontSize: "clamp(100px, 16vw, 280px)",
              color: C.tinta, lineHeight: 0.85,
              letterSpacing: "-0.005em", margin: 0,
              textTransform: "uppercase",
            }}>
              ABOUT US
            </h2>
          </Reveal>

          {/* Banner SPRINGS JACKET CLUB */}
          <Reveal delay={0.3} style={{ position: "absolute", left: "234vw", bottom: "10vh", zIndex: 4 }}>
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
          <div style={{ position: "absolute", left: "266vw", bottom: "4vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.7rem", letterSpacing: "0.15em", color: C.tinta, textTransform: "uppercase", lineHeight: 1.4 }}>
              FAST, GOOD &amp; LOUD<br />ESTO ES SPRINGS.
            </div>
          </div>

          {/* Burger detail bleeding al final */}
          <div style={{
            position: "absolute", left: "315vw", bottom: "12vh", zIndex: 4,
            width: "28vw", height: "64vh",
            background: "radial-gradient(ellipse at 45% 40%, #D4A55A 0%, #9B6530 35%, #5C3514 70%, #2E1A08 100%)",
            clipPath: "ellipse(48% 50% at 50% 50%)",
          }} />

          <Reveal delay={0.2} style={{ position: "absolute", left: "318vw", top: "16vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.62rem", letterSpacing: "0.15em", color: C.tinta, textTransform: "uppercase" }}>BUCARAMANGA · BGA</div>
            <div style={{ ...F.display, fontSize: "clamp(40px, 5vw, 96px)", color: C.tinta, marginTop: "12px", lineHeight: 0.9, textTransform: "uppercase" }}>
              SOLO<br />DELIVERY.
            </div>
            <div style={{ ...F.sans, fontSize: "0.85rem", fontStyle: "italic", color: C.tinta, opacity: 0.5, marginTop: "12px", maxWidth: "240px" }}>
              Dark kitchen. Sin local físico.<br />La papa va a vos, no al revés.
            </div>
          </Reveal>


          {/* ═══════════════════════════════════════
              ZONA 4 — PEDIR YA (380 → 500vw)
          ═══════════════════════════════════════ */}

          {/* Fondo burgundy panel pedir */}
          <div style={{
            position: "absolute", left: "380vw", top: 0,
            width: "120vw", height: "100vh",
            background: C.burgundy, zIndex: 1,
          }} />

          {/* PEDIR YA gigante */}
          <Reveal style={{ position: "absolute", left: "388vw", top: "20vh", zIndex: 3, whiteSpace: "nowrap" }}>
            <h2 id="pedir" style={{
              ...F.display,
              fontSize: "clamp(120px, 18vw, 320px)",
              color: C.cream, lineHeight: 0.85,
              margin: 0, letterSpacing: "-0.005em",
              textTransform: "uppercase",
            }}>
              PEDIR YA.
            </h2>
          </Reveal>

          <Reveal delay={0.1} style={{ position: "absolute", left: "388vw", top: "12vh", zIndex: 5 }}>
            <div style={{ ...F.mono, fontSize: "0.65rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase" }}>
              ↗ SIN EXCUSAS · ESTO ES SPRINGS
            </div>
          </Reveal>

          {/* Apps */}
          <Reveal delay={0.2} style={{ position: "absolute", left: "390vw", bottom: "16vh", zIndex: 5, width: "26vw" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="#" style={{
                ...F.display, fontSize: "1rem", letterSpacing: "0.12em",
                color: C.tinta, background: C.cream,
                padding: "16px 24px", textDecoration: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                RAPPI <span>→</span>
              </a>
              <a href="#" style={{
                ...F.display, fontSize: "1rem", letterSpacing: "0.12em",
                color: C.cream, background: "transparent",
                border: `1px solid ${C.cream}`, opacity: 0.9,
                padding: "16px 24px", textDecoration: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                UBER EATS <span>→</span>
              </a>
              <a href="#" style={{
                ...F.display, fontSize: "1rem", letterSpacing: "0.12em",
                color: C.mostaza, background: "transparent",
                border: `1px solid ${C.mostaza}`,
                padding: "16px 24px", textDecoration: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                PEDIDO DIRECTO (PRONTO) <span>→</span>
              </a>
            </div>
          </Reveal>

          {/* Info derecha */}
          <Reveal delay={0.3} style={{ position: "absolute", left: "424vw", bottom: "16vh", zIndex: 5, width: "30vw" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {[
                { label: "Horario", val: "12PM — 9PM", sub: "Lunes a domingo" },
                { label: "Zona", val: "BUCARAMANGA", sub: "Cabecera · Cañaveral · Sotomayor" },
                { label: "Síguenos", val: "@SPRINGS.COL", sub: "Instagram · TikTok" },
                { label: "Combo recomendado", val: "PARA DOS · 69,900", sub: "2 Jackets + 2 Bebidas · Ahorra 9,900" },
              ].map((i) => (
                <div key={i.label} style={{ background: "rgba(242,232,213,0.06)", padding: "16px 22px", borderBottom: `1px solid rgba(242,232,213,0.06)` }}>
                  <div style={{ ...F.mono, fontSize: "0.55rem", letterSpacing: "0.22em", color: C.mostaza, textTransform: "uppercase", marginBottom: "4px" }}>{i.label}</div>
                  <div style={{ ...F.display, fontSize: "1.3rem", letterSpacing: "0.05em", color: C.cream }}>{i.val}</div>
                  <div style={{ ...F.sans, fontSize: "0.7rem", color: C.cream, opacity: 0.4, marginTop: "2px" }}>{i.sub}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* "BUCARAMANGA" fantasma */}
          <div style={{
            position: "absolute", left: "470vw", top: "50%", transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "left center", whiteSpace: "nowrap", zIndex: 2,
            ...F.display, fontSize: "clamp(40px, 5vw, 100px)", color: C.cream, opacity: 0.07,
          }}>
            DIFFERENT BY DEFAULT.
          </div>

        </div>
      </div>
    </>
  );
}
