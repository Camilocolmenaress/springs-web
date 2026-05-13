"use client";

// Juan David — Card de producto individual
// Nombre (Anton), descripcion (Inter), precio (JetBrains Mono),
// boton "AGREGAR AL PEDIDO"

import type { Producto } from "@/data/productos";

interface ProductCardProps {
  producto: Producto;
  onAdd?: (producto: Producto) => void;
}

export default function ProductCard({ producto, onAdd }: ProductCardProps) {
  return (
    <div className="border border-tinta/10 p-5">
      <h3 className="font-display text-lg uppercase tracking-wide">
        {producto.nombre}
      </h3>
      <p className="font-sans text-tinta/50 text-sm mt-1">
        {producto.descripcion}
      </p>
      <div className="flex items-center justify-between mt-4">
        <span className="font-mono text-sm font-medium">
          {producto.precio.toLocaleString("es-CO")}
        </span>
        <button
          onClick={() => onAdd?.(producto)}
          className="bg-tinta text-cream font-mono text-xs tracking-[2px] px-4 py-2 uppercase hover:opacity-85 transition-opacity"
        >
          AGREGAR AL PEDIDO
        </button>
      </div>
    </div>
  );
}
