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
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SlideText({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

export default function MobileLanding() {
  return (
    <div
      className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-tinta font-sans text-cream"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* 1. HERO */}
      <section className="relative w-full h-[100svh] bg-burgundy flex flex-col justify-between border-b border-mostaza">
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20">
          <span className="font-display text-2xl leading-none text-cream tracking-[0.06em]">SPRINGS</span>
          <a
            href="/menu"
            className="bg-mostaza text-tinta font-sans font-medium text-sm px-4 py-2 uppercase tracking-wide"
          >
            PEDIR AHORA
          </a>
        </div>

        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/hero-jacket.jpg"
            alt="La Fija — Jacket de autor"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-6 flex flex-col justify-end h-full pb-12">
          <div className="flex flex-col mb-16 -ml-2">
            <SlideText className="font-display text-[56px] leading-[0.8] text-cream block">CARNE &amp;</SlideText>
            <SlideText delay={0.1} className="font-display text-[64px] leading-[0.8] text-cream -ml-4 whitespace-nowrap block">
              QUESO
            </SlideText>
          </div>
          <div className="flex justify-between items-end w-full">
            <img
              src="/images/wax-seal.png"
              alt="Springs — Jacket de Autor · Colombia"
              className="w-24 h-24 circle object-cover rotate-12"
            />
            <div className="font-mono text-cream text-[10px] text-right uppercase tracking-widest">
              ↖ LA FIJA /<br />
              CARNE OREADA
            </div>
          </div>
        </div>
      </section>

      {/* 2. COLLECTION */}
      <section className="relative w-full border-b border-mostaza overflow-hidden">
        <a href="/menu" className="block relative">
          <img
            src="/images/collection-hero.jpg"
            alt="Collection — Aquí está nuestro menú"
            className="w-full h-auto object-cover"
          />
        </a>
      </section>

      {/* 3. STATEMENT */}
      <SectionReveal className="relative w-full h-[600px] bg-tinta border-b border-mostaza overflow-hidden">
        <div className="absolute inset-0 -rotate-6 scale-110 overflow-hidden">
          <img
            alt=""
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl1MZIb4jNW5HDJrJl0Qe7dA21KtNKHd6CcqyidfPzhNGcszipU6ecXznvC7FcABhgS9t2Z_bRZn_Y97ICPPJ2KaOaVoGTqpEBewagS3kIlbtBQoWJsgULu7R4M-C6tayksyXsc6fgscHK6A-7HPwUrj_PU1zI921IRyJzecZTqTpS9pSTqz1gKtgmPb6kINglR18dGrpYrBGz4LjUfBHHpqtC6sZx2zszAxvRjHxLW-RwPl8GlDSr1nfBI5VP3kY8RBRhKNpdVrWk"
          />
        </div>
        <div className="relative z-10 w-full h-full p-6 flex flex-col">
          <div className="flex flex-col -ml-4 mt-12">
            <SlideText className="font-display text-[64px] leading-[0.85] text-cream block">JACKET DE</SlideText>
            <SlideText delay={0.1} className="font-display text-[64px] leading-[0.85] text-cream block">
              AUTOR.
            </SlideText>
          </div>
          <div className="mt-auto mb-12 flex items-center gap-4">
            <span className="text-mostaza font-display text-4xl leading-none">+</span>
            <p className="font-sans italic text-sm text-cream">Primera en Colombia.</p>
          </div>
        </div>
      </SectionReveal>

      {/* 4. INGREDIENTS */}
      <SectionReveal className="w-full bg-cream border-b border-mostaza flex">
        <div className="w-1/2 h-[400px] border-r border-mostaza overflow-hidden">
          <img
            alt="Carne oreada"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVDgzw0Ell036ESM7hKl-22wjxsEkfhFdUUY7z3eGqckLv7KjTnCoMHzS-JgeYiiuvlCf15nnMXTp-wxesfMjvtpj8W5pNi0slB2N8j2kfpbbvOuljc8gbutSkS8qNnCBggFXIZ1yfatozhqIDD5VexCFx715D7cSnpEPp2z7xl5RsftOXUcGv1K0VrHRb2bnMk2vNQkkGVgcj3XjhI3QNr5aw5Ms-UevbM2xLEKIYwvxWnFwgKUyKLYUXqRIUo7dMxad-mv-UAaN8"
          />
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center h-[400px]">
          <div className="flex flex-col gap-2 mb-6 border-l-2 border-mostaza pl-4">
            <SlideText className="font-display text-[28px] leading-none text-burgundy block">
              CARNE<br />OREADA.
            </SlideText>
            <SlideText delay={0.1} className="font-display text-[28px] leading-none text-burgundy block">
              HOGAO.
            </SlideText>
            <SlideText delay={0.2} className="font-display text-[28px] leading-none text-burgundy block">
              QUESO<br />COSTEÑO.
            </SlideText>
          </div>
          <p className="font-sans text-xs text-tinta mb-8">Tres ingredientes. Una Jacket.</p>
          <div className="mt-auto">
            <span className="font-mono text-[10px] text-mostaza block mb-1">COP</span>
            <span className="font-mono text-2xl text-mostaza tracking-tighter">32,900</span>
          </div>
        </div>
      </SectionReveal>

      {/* 5. MANIFESTO */}
      <SectionReveal className="relative w-full min-h-[500px] bg-cream border-b border-mostaza overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDACXDosyxWbH0mXpSKIk_B4CDzFUotk63mRXPRHqbdA52llOaIdEuP-dGoQh0TFjv9eXJIXKQIa9nNhKCkoFda5_M29jDm9c1WwVONjmm5b4DYW4r1uUmO862PQiChw8ukY61p6wWAXZE3OiJB0sHpbA3m98CsjqIuW86jd0ySkbLfQWMutJs0a8BQJV6UThL_sqgaQFSGt-dZan7AqdMTdwVmGlZYbXX0LqicHaCNJaTZOGy6l7KdU0JNEHMTdKGYetsWdlry2d0B"
          />
          <div className="absolute inset-0 bg-burgundy/35" />
        </div>
        <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-[500px]">
          <div className="flex flex-col -ml-4">
            <SlideText className="font-display text-[72px] leading-[0.8] text-cream block">BIEN</SlideText>
            <SlideText delay={0.1} className="font-display text-[72px] leading-[0.8] text-cream ml-12 block">
              HECHA.
            </SlideText>
          </div>
          <div className="mt-20">
            <p className="font-sans text-sm text-cream leading-[1.6] max-w-[85%] font-medium">
              Bucaramanga ya tenía suficientes hamburguesas iguales. Springs nace porque pedir comida también es respeto
              propio.
            </p>
          </div>
          <div className="mt-12 border border-cream px-3 py-2 bg-tinta/80 self-start">
            <span className="font-mono text-[10px] text-cream tracking-widest uppercase">
              EST. 2026 / BGA-COL / DARK KITCHEN
            </span>
          </div>
        </div>
      </SectionReveal>

      {/* 6. ORDER CTA */}
      <SectionReveal className="w-full bg-burgundy border-b border-mostaza flex flex-col">
        <div className="w-full h-[300px] overflow-hidden">
          <img src="/images/packaging-bag.png" alt="" className="w-full h-full object-cover object-center" />
        </div>
        <div className="p-6 flex flex-col gap-6 bg-burgundy">
          <div className="flex flex-col -ml-4">
            <SlideText className="font-display text-[68px] leading-[0.8] text-cream block">PEDÍ</SlideText>
            <SlideText delay={0.1} className="font-display text-[68px] leading-[0.8] text-cream block">
              AHORA.
            </SlideText>
          </div>
          <a
            href="/menu"
            className="w-full bg-mostaza text-tinta font-display text-[32px] h-16 flex items-center justify-center uppercase tracking-wider hover:bg-cream transition-colors"
          >
            IR A PEDIR
          </a>
          <div className="w-full text-center border-t border-mostaza/30 pt-4">
            <span className="font-mono text-[10px] text-cream tracking-widest uppercase">
              30–45 MIN · CABECERA · CAÑAVERAL · SOTOMAYOR
            </span>
          </div>
        </div>
      </SectionReveal>

      {/* 7. FOOTER */}
      <footer className="w-full bg-tinta p-8 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-[48px] text-cream tracking-[0.06em] leading-none">SPRINGS</span>
          <span className="font-sans italic text-base text-cream">Jacket de autor.</span>
        </div>
        <div className="w-full h-px bg-mostaza my-4" />
        <div className="flex flex-col items-center gap-4 w-full">
          <a href="/menu" className="font-mono text-xs text-cream uppercase tracking-widest hover:text-mostaza transition-colors">
            MENÚ [VER]
          </a>
          <a href="#" className="font-mono text-xs text-cream uppercase tracking-widest hover:text-mostaza transition-colors">
            EDITORIAL [LEER]
          </a>
          <a href="#" className="font-mono text-xs text-cream uppercase tracking-widest hover:text-mostaza transition-colors">
            MANIFIESTO [SABER]
          </a>
        </div>
        <div className="mt-12 w-full text-center">
          <span className="font-mono text-[9px] text-cream/50 uppercase tracking-widest">
            © 2026 SPRINGS · SYS.VER 1.0 // BGA-COL
          </span>
        </div>
      </footer>
    </div>
  );
}
