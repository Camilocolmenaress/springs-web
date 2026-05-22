"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable, InertiaPlugin);

interface StickerLayerProps {
  children: ReactNode;
  boundsRef: React.RefObject<HTMLElement | null>;
}

export default function StickerLayer({ children, boundsRef }: StickerLayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!wrapperRef.current || !boundsRef.current) return;

    const stickers = wrapperRef.current.querySelectorAll(".draggable-sticker");

    stickers.forEach((el) => {
      Draggable.create(el, {
        type: "x,y",
        edgeResistance: 0.85,
        bounds: boundsRef.current!,
        inertia: true,
        zIndexBoost: false,
        onPress() {
          gsap.to(el, { scale: 1.05, duration: 0.15 });
        },
        onRelease() {
          gsap.to(el, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
        },
      });
    });
  }, { scope: wrapperRef, dependencies: [] });

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 500,
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}
