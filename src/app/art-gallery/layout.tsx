import type { Metadata } from "next";

export const metadata: Metadata = {
  themeColor: "#000000",
};

export default function ArtGalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
