"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function TabletLanding() {
  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-burgundy text-cream font-sans"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Fixed Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-burgundy border-b border-mostaza">
        <button aria-label="Menú" className="text-cream hover:text-mostaza transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="8" x2="20" y2="8" />
            <line x1="4" y1="16" x2="20" y2="16" />
          </svg>
        </button>
        <a href="/" className="font-display text-3xl text-cream tracking-[0.06em] hover:text-mostaza transition-colors">
          SPRINGS
        </a>
        <a href="/menu" aria-label="Ir a pedir" className="text-cream hover:text-mostaza transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </a>
      </header>

      <main className="pt-16 max-w-[1200px] mx-auto w-full">
        {/* 1. HERO */}
        <SectionReveal className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-tinta border-b border-mostaza">
          <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
            <img
              src="/images/la-fija.webp"
              alt="La Fija"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-tinta to-transparent" />
          <div className="relative z-10 w-full px-6 flex flex-row items-center justify-between gap-8 h-full pb-12">
            <div className="w-1/2 flex flex-col justify-end h-full">
              <h1 className="font-display text-[80px] leading-[0.85] text-cream uppercase tracking-tighter mb-4">
                CARNE &amp;<br />QUESO
              </h1>
              <p className="font-mono text-[10px] text-mostaza uppercase tracking-widest mt-2">
                JACKET DE AUTOR. BUCARAMANGA.
              </p>
            </div>
            <div className="w-1/2 flex flex-col justify-end h-full items-end">
              <a
                href="/menu"
                className="bg-mostaza text-tinta font-sans font-medium text-sm px-8 py-4 uppercase tracking-widest hover:bg-cream transition-colors"
              >
                IR A PEDIR
              </a>
            </div>
          </div>
        </SectionReveal>

        {/* 2. MARQUEE */}
        <section className="w-full bg-cream py-4 border-b border-mostaza overflow-hidden">
          <div className="overflow-hidden w-full">
            <motion.div
              className="flex whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="font-display text-[48px] text-tinta uppercase opacity-20 inline-block pr-8"
                >
                  SANTANDER — CHICHARRÓN — BOLOGNESA — CLÁSICA —
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 3. STATEMENT */}
        <SectionReveal className="relative w-full py-24 px-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-4xl mx-auto aspect-video">
            <img
              alt="Jacket de autor — Springs"
              className="w-full h-full object-cover border border-mostaza"
              src="/images/la-fija-exhibit.webp"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h2 className="font-display text-[80px] leading-[0.9] text-cream text-center uppercase tracking-tighter mix-blend-difference">
                JACKET<br />DE AUTOR
              </h2>
            </div>
          </div>
          <div className="mt-8 max-w-2xl mx-auto text-center">
            <p className="font-sans text-sm text-cream/80 leading-relaxed uppercase tracking-wide">
              No más lo de siempre. Tres ingredientes. Una Jacket. La primera en Colombia.
            </p>
          </div>
        </SectionReveal>

        {/* 4. INGREDIENTS SPLIT */}
        <SectionReveal className="w-full flex flex-row min-h-[500px] border-y border-mostaza">
          <div className="w-1/2 bg-cream flex flex-col justify-center px-12 py-16">
            <h3 className="font-display text-[40px] text-burgundy uppercase mb-6 tracking-tight">LA OREADA</h3>
            <p className="font-mono text-[10px] text-tinta mb-8 uppercase tracking-widest">
              INGREDIENTE PROTAGONISTA // SANTANDER
            </p>
            <div className="font-sans text-xs text-tinta space-y-4 max-w-sm">
              <p className="uppercase tracking-wide">CARNE OREADA. HOGAO. QUESO COSTEÑO.</p>
              <p className="opacity-60">Textura sin pretensión. Carne seca ahumada. Un clásico regional.</p>
            </div>
            <div className="mt-12">
              <span className="font-mono text-[10px] text-mostaza bg-tinta px-3 py-1 uppercase tracking-widest">
                32,900 COP
              </span>
            </div>
          </div>
          <div className="w-1/2 h-[400px] md:h-auto">
            <img
              alt="Carne oreada"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVDgzw0Ell036ESM7hKl-22wjxsEkfhFdUUY7z3eGqckLv7KjTnCoMHzS-JgeYiiuvlCf15nnMXTp-wxesfMjvtpj8W5pNi0slB2N8j2kfpbbvOuljc8gbutSkS8qNnCBggFXIZ1yfatozhqIDD5VexCFx715D7cSnpEPp2z7xl5RsftOXUcGv1K0VrHRb2bnMk2vNQkkGVgcj3XjhI3QNr5aw5Ms-UevbM2xLEKIYwvxWnFwgKUyKLYUXqRIUo7dMxad-mv-UAaN8"
            />
          </div>
        </SectionReveal>

        {/* 5. MANIFESTO */}
        <SectionReveal className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center border-b border-mostaza">
          <div className="absolute inset-0">
            <img
              alt=""
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl1MZIb4jNW5HDJrJl0Qe7dA21KtNKHd6CcqyidfPzhNGcszipU6ecXznvC7FcABhgS9t2Z_bRZn_Y97ICPPJ2KaOaVoGTqpEBewagS3kIlbtBQoWJsgULu7R4M-C6tayksyXsc6fgscHK6A-7HPwUrj_PU1zI921IRyJzecZTqTpS9pSTqz1gKtgmPb6kINglR18dGrpYrBGz4LjUfBHHpqtC6sZx2zszAxvRjHxLW-RwPl8GlDSr1nfBI5VP3kY8RBRhKNpdVrWk"
            />
          </div>
          <div className="absolute inset-0 bg-burgundy/35" />
          <div className="relative z-10 w-full max-w-3xl px-6 text-center flex flex-col items-center">
            <h2 className="font-display text-[70px] leading-none text-cream uppercase tracking-tighter mb-8">
              BIEN HECHA.
            </h2>
            <p className="font-sans text-base text-mostaza uppercase tracking-widest max-w-lg bg-tinta/80 p-4 border border-mostaza">
              Bucaramanga ya tenía suficientes hamburguesas iguales. Springs nace porque pedir comida también es respeto
              propio.
            </p>
          </div>
        </SectionReveal>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center py-12 px-6 text-center gap-6 bg-burgundy text-cream border-t-2 border-mostaza">
        <div className="w-full max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-display text-3xl text-mostaza uppercase tracking-[0.06em]">SPRINGS</div>
          <nav className="flex flex-row gap-6 uppercase tracking-widest font-mono text-xs">
            <a href="/menu" className="text-cream hover:text-mostaza transition-colors">MENÚ</a>
            <a href="#" className="text-cream hover:text-mostaza transition-colors">MANIFIESTO</a>
            <a href="#" className="text-cream hover:text-mostaza transition-colors">COBERTURA</a>
            <a href="#" className="text-cream hover:text-mostaza transition-colors">CONTACTO</a>
          </nav>
          <div className="font-mono text-[10px] text-mostaza/70 uppercase">
            © 2026 SPRINGS<br />JACKET DE AUTOR
          </div>
        </div>
      </footer>
    </div>
  );
}
