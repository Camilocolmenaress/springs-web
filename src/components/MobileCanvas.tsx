"use client";

import MobileEditorial from "@/components/MobileEditorial";

export default function MobileCanvas() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        background: "#F2E8D5",
      }}
    >
      <MobileEditorial />
    </div>
  );
}
