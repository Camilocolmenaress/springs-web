import { supabase } from "./supabase";

interface Horario {
  abre: string;
  cierra: string;
}

type DiaSemana =
  | "domingo"
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado";

const DIAS: DiaSemana[] = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

export async function esCocinaAbierta(): Promise<{
  abierta: boolean;
  mensaje?: string;
}> {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("id", "horarios")
    .single();

  if (!data)
    return { abierta: false, mensaje: "No se pudieron cargar los horarios." };

  const ahora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
  );
  const dia = DIAS[ahora.getDay()];
  const horario: Horario | null = data.value[dia];

  if (!horario) {
    return { abierta: false, mensaje: "Hoy no abrimos. Vuelva manana." };
  }

  const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
  const [abreH, abreM] = horario.abre.split(":").map(Number);
  const [cierraH, cierraM] = horario.cierra.split(":").map(Number);
  const abreMin = abreH * 60 + abreM;
  const cierraMin = cierraH * 60 + cierraM;

  if (horaActual < abreMin) {
    return {
      abierta: false,
      mensaje: `Estamos descansando. Abrimos hoy a las ${horario.abre}.`,
    };
  }

  if (horaActual >= cierraMin) {
    return { abierta: false, mensaje: "Estamos descansando hasta manana." };
  }

  return { abierta: true };
}
