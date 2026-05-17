import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  const imagesDir = path.join(process.cwd(), "public", "images");

  try {
    const files = await readdir(imagesDir);
    const images = files
      .filter(f => /\.(png|jpg|jpeg|webp|avif)$/i.test(f))
      .map(f => `/images/${f}`);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
