"use client";

import { useState, useCallback, useEffect } from "react";
import type { PageConfig, SliderProp, FontProp, ColorProp, ImageProp, AnimationProp } from "@/types/design";

import homeConfig        from "@/data/design/home.json";
import menuConfig        from "@/data/design/menu.json";
import menuMobileConfig  from "@/data/design/menu-mobile.json";
import artGalleryConfig        from "@/data/design/art-gallery.json";
import artGalleryMobileConfig  from "@/data/design/art-gallery-mobile.json";

const configs: Record<string, PageConfig> = {
  home:                  homeConfig               as unknown as PageConfig,
  menu:                  menuConfig               as unknown as PageConfig,
  "menu-mobile":         menuMobileConfig         as unknown as PageConfig,
  "art-gallery":         artGalleryConfig         as unknown as PageConfig,
  "art-gallery-mobile":  artGalleryMobileConfig   as unknown as PageConfig,
};

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function useDesignConfig(page: string) {
  const [editMode, setEditMode] = useState(false);
  const [config, setConfig] = useState<PageConfig>(() => deepClone(configs[page]));
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setEditMode(new URLSearchParams(window.location.search).get("edit") === "1");
  }, []);

  const updateProp = useCallback((
    zone: string,
    element: string,
    propKey: string,
    value: string | number,
  ) => {
    setConfig(prev => {
      const next = deepClone(prev);
      const prop = next.zones[zone]?.elements[element]?.props[propKey];
      if (!prop) return prev;

      if (typeof prop === "string") {
        next.zones[zone].elements[element].props[propKey] = value as string;
      } else if ("unit" in prop) {
        (prop as SliderProp).value = value as number;
      } else if ("folder" in prop) {
        (prop as ImageProp).value = value as string;
      } else if ("options" in prop) {
        (prop as FontProp | ColorProp | AnimationProp).value = value as never;
      }
      return next;
    });
    setSaved(false);
  }, []);

  const save = useCallback(async () => {
    const res = await fetch("/api/dev/design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, config }),
    });
    if (res.ok) setSaved(true);
    return res.ok;
  }, [page, config]);

  const reset = useCallback(() => {
    setConfig(deepClone(configs[page]));
    setSaved(true);
  }, [page]);

  const exportValues = useCallback(() => {
    const lines: string[] = [`/* ── DESIGN CONFIG: ${page} ── */`];
    for (const [zoneKey, zone] of Object.entries(config.zones)) {
      lines.push(`\n// ${zone.label}`);
      for (const [elemKey, elem] of Object.entries(zone.elements)) {
        for (const [propKey, prop] of Object.entries(elem.props)) {
          if (typeof prop === "string") {
            lines.push(`${zoneKey}.${elemKey}.${propKey}: "${prop}"`);
          } else if ("unit" in prop) {
            lines.push(`${zoneKey}.${elemKey}.${propKey}: "${(prop as SliderProp).value}${(prop as SliderProp).unit}"`);
          } else if ("folder" in prop) {
            lines.push(`${zoneKey}.${elemKey}.${propKey}: "${(prop as ImageProp).value}"`);
          } else if ("options" in prop) {
            lines.push(`${zoneKey}.${elemKey}.${propKey}: "${(prop as FontProp).value}"`);
          }
        }
      }
    }
    const text = lines.join("\n");
    navigator.clipboard.writeText(text);
    return text;
  }, [config, page]);

  return { config, editMode, saved, updateProp, save, reset, exportValues };
}
