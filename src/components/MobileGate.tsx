"use client";

import { useEffect, useState } from "react";
import MobileLanding from "@/components/MobileLanding";
import MobileHome from "@/components/MobileHome";

const KEY = "springs_hasVisited";

export default function MobileGate() {
  const [hasVisited, setHasVisited] = useState<boolean | null>(null);

  useEffect(() => {
    const visited = localStorage.getItem(KEY);
    if (visited) {
      setHasVisited(true);
    } else {
      localStorage.setItem(KEY, "1");
      setHasVisited(false);
    }
  }, []);

  if (hasVisited === null) {
    return <div style={{ width: "100vw", height: "100dvh", background: "#1A0A0C" }} />;
  }

  return hasVisited ? <MobileHome /> : <MobileLanding />;
}
