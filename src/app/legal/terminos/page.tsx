import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminos y Condiciones — SPRINGS",
  description:
    "Terminos y condiciones de uso del sitio web y servicio de domicilios de Springs.",
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-cream py-16 px-6">
      <article className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="font-mono text-xs text-tinta/40 tracking-[2px] hover:text-tinta transition-colors"
        >
          ← VOLVER
        </Link>

        <h1 className="font-display text-4xl text-tinta tracking-[2px] mt-8 mb-2">
          TERMINOS Y CONDICIONES
        </h1>
        <p className="font-mono text-xs text-tinta/40 tracking-[1px] mb-10">
          Ultima actualizacion: mayo 2026
        </p>

        <div className="space-y-8 font-sans text-sm text-tinta/80 leading-relaxed">
          <Section title="1. Que es Springs">
            <p>
              Springs es una dark kitchen (cocina de domicilios) ubicada en
              Bucaramanga, Santander, Colombia. Vendemos jacket potatoes
              (papas horneadas rellenas con proteina santandereana)
              exclusivamente a domicilio a traves de este sitio web.
            </p>
          </Section>

          <Section title="2. Zona de cobertura">
            <p>
              Actualmente operamos en los barrios de Cabecera, Canaveral y
              Sotomayor en Bucaramanga. Si su direccion esta fuera de estas
              zonas, el sistema se lo indicara antes de confirmar el pedido.
            </p>
          </Section>

          <Section title="3. Horarios de operacion">
            <p>
              Nuestros horarios pueden variar. El sitio web indica en tiempo
              real si la cocina esta abierta o cerrada. No se pueden realizar
              pedidos fuera del horario de operacion.
            </p>
          </Section>

          <Section title="4. Precios y metodos de pago">
            <p>
              Los precios publicados en el sitio incluyen IVA cuando aplica.
              Los precios pueden cambiar sin previo aviso, pero el precio
              vigente al momento de su pedido es el que se respeta.
            </p>
            <p className="mt-2">Metodos de pago aceptados:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>
                <strong>Efectivo</strong> — paga al recibir el pedido.
              </li>
              <li>
                <strong>Nequi</strong> — transferencia antes de la
                preparacion.
              </li>
              <li>
                <strong>Transferencia bancaria</strong> — transferencia antes
                de la preparacion.
              </li>
            </ul>
            <p className="mt-2">
              Para pagos por Nequi o transferencia, el pedido se empieza a
              preparar una vez confirmemos la recepcion del pago.
            </p>
          </Section>

          <Section title="5. Domicilio">
            <p>
              El costo del domicilio se calcula automaticamente segun el
              valor de su pedido. Pedidos que superen el umbral indicado en
              el sitio tienen domicilio gratis. El costo exacto se muestra
              antes de confirmar el pedido.
            </p>
          </Section>

          <Section title="6. Tiempo de entrega">
            <p>
              El tiempo estimado de entrega es de 30 a 45 minutos desde la
              confirmacion del pedido. Este tiempo puede variar segun la
              demanda y condiciones de trafico. No garantizamos tiempos
              exactos.
            </p>
          </Section>

          <Section title="7. Confirmacion del pedido">
            <p>
              Al realizar un pedido, usted recibe un numero de pedido y un
              enlace de seguimiento. El pedido se considera confirmado cuando
              aparece en nuestro sistema. Para pagos electronicos, la
              preparacion inicia al confirmar el pago.
            </p>
          </Section>

          <Section title="8. Cancelaciones y problemas">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Cancelacion antes de preparacion:</strong> puede
                cancelar sin costo escribiendonos por WhatsApp.
              </li>
              <li>
                <strong>Cancelacion durante preparacion:</strong> no es
                posible cancelar una vez iniciada la preparacion, ya que los
                alimentos son perecederos.
              </li>
              <li>
                <strong>Pedido con errores:</strong> si su pedido llega
                incorrecto o en mal estado, contactenos por WhatsApp y lo
                resolvemos con reposicion del producto.
              </li>
            </ul>
          </Section>

          <Section title="9. Derecho de retracto">
            <p>
              Conforme al Articulo 47 de la Ley 1480 de 2011 (Estatuto del
              Consumidor), el derecho de retracto no aplica para productos
              perecederos como alimentos preparados.
            </p>
          </Section>

          <Section title="10. Propiedad intelectual">
            <p>
              La marca Springs, su identidad visual, textos, disenos y
              contenido de este sitio son propiedad de sus creadores. Queda
              prohibida la reproduccion sin autorizacion escrita.
            </p>
          </Section>

          <Section title="11. Legislacion aplicable">
            <p>
              Estos terminos se rigen por las leyes de la Republica de
              Colombia. Cualquier controversia se resolvera ante las
              autoridades competentes de Bucaramanga, Santander.
            </p>
          </Section>

          <Section title="12. Contacto">
            <div className="border border-tinta/10 p-4">
              <p className="font-mono text-xs text-tinta/60 tracking-[1px]">
                SPRINGS — BUCARAMANGA, COLOMBIA
              </p>
              <p className="mt-2">WhatsApp: por definir</p>
              <p>Email: por definir</p>
            </div>
          </Section>
        </div>

        <div className="mt-12 pt-6 border-t border-tinta/10">
          <Link
            href="/legal/privacidad"
            className="font-mono text-xs text-burgundy tracking-[1px] hover:opacity-70 transition-opacity"
          >
            Ver Politica de Privacidad →
          </Link>
        </div>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-lg text-tinta tracking-[1px] mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
