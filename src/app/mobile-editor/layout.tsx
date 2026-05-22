"use client";

import { useEffect } from "react";

export default function MobileEditorLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Override the global overflow:hidden so this page can scroll
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return <>{children}</>;
}
