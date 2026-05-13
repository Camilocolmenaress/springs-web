// Juan David — Menu completo
// Orden: COMBOS > JACKETS > LOADED > EXTRAS > BEBIDAS
// Los datos vienen de @/data/productos por ahora,
// despues se conectan a la API /api/products (CAM-3)

import { productos, type Categoria } from "@/data/productos";
import ProductCard from "./ProductCard";

const SECCIONES: { categoria: Categoria; titulo: string }[] = [
  { categoria: "combo", titulo: "COMBOS" },
  { categoria: "jacket", titulo: "JACKETS" },
  { categoria: "loaded", titulo: "LOADED" },
  { categoria: "extra", titulo: "EXTRAS" },
  { categoria: "bebida", titulo: "BEBIDAS" },
];

export default function Menu() {
  return (
    <section id="menu" className="bg-cream py-16 px-6 max-w-3xl mx-auto">
      {SECCIONES.map((seccion) => {
        const items = productos.filter(
          (p) => p.categoria === seccion.categoria
        );
        if (items.length === 0) return null;
        return (
          <div key={seccion.categoria} className="mb-12">
            <h2 className="font-display text-3xl tracking-[4px] text-tinta mb-6 border-b border-tinta/10 pb-3">
              {seccion.titulo}
            </h2>
            <div className="grid gap-4">
              {items.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
