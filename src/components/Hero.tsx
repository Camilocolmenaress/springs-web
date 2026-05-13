// Juan David — Hero principal
// Tipografia gigante que se sale de la pantalla, foto del producto flotando,
// boton "HACER PEDIDO". Referencia visual: landing.html
export default function Hero() {
  return (
    <section className="relative min-h-screen bg-burgundy flex items-center justify-center overflow-hidden">
      <div className="text-center px-6">
        <h1 className="font-display text-cream text-[20vw] leading-none uppercase tracking-tight">
          SPRINGS
        </h1>
        <p className="font-sans text-cream/60 text-lg mt-4 tracking-wide">
          Different by default.
        </p>
        <a
          href="#menu"
          className="inline-block mt-8 bg-mostaza text-tinta font-display text-sm tracking-[3px] px-8 py-4 uppercase hover:opacity-85 transition-opacity"
        >
          HACER PEDIDO
        </a>
      </div>
    </section>
  );
}
