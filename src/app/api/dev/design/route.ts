import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Solo disponible en desarrollo." }, { status: 403 });
  }

  const { page, config } = await request.json();

  if (!page || !config) {
    return NextResponse.json({ error: "Faltan page o config." }, { status: 400 });
  }

  const safePage = page.replace(/[^a-z0-9-]/gi, "");
  const filePath = path.join(process.cwd(), "src", "data", "design", `${safePage}.json`);

  await writeFile(filePath, JSON.stringify(config, null, 2) + "\n");

  return NextResponse.json({ ok: true, path: filePath });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");

  if (!page) {
    return NextResponse.json({ error: "Falta parametro page." }, { status: 400 });
  }

  const safePage = page.replace(/[^a-z0-9-]/gi, "");
  const filePath = path.join(process.cwd(), "src", "data", "design", `${safePage}.json`);

  try {
    const content = await readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Config no encontrado." }, { status: 404 });
  }
}
