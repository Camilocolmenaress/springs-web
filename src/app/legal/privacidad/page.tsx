import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidad — SPRINGS",
  description:
    "Politica de tratamiento de datos personales de Springs, conforme a la Ley 1581 de 2012.",
};

export default function PrivacidadPage() {
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
          POLITICA DE PRIVACIDAD
        </h1>
        <p className="font-mono text-xs text-tinta/40 tracking-[1px] mb-10">
          Ultima actualizacion: mayo 2026
        </p>

        <div className="space-y-8 font-sans text-sm text-tinta/80 leading-relaxed">
          <Section title="1. Quien es el responsable">
            <p>
              Springs es operado por Camilo Colmenares y Juan David Gonzalez,
              personas naturales domiciliadas en Bucaramanga, Santander,
              Colombia. Somos los responsables del tratamiento de sus datos
              personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de
              2013.
            </p>
          </Section>

          <Section title="2. Que datos recolectamos">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Nombre completo</strong> — para identificar su pedido.
              </li>
              <li>
                <strong>Numero de telefono</strong> — para contactarlo sobre su
                pedido y enviar confirmaciones por WhatsApp.
              </li>
              <li>
                <strong>Direccion de entrega</strong> — para entregar su pedido.
              </li>
            </ul>
            <p className="mt-3">
              No recolectamos email, datos financieros, ni creamos cuentas de
              usuario.
            </p>
          </Section>

          <Section title="3. Para que usamos sus datos">
            <ul className="list-disc pl-5 space-y-1">
              <li>Procesar y entregar su pedido.</li>
              <li>
                Enviarle confirmacion y estado del pedido por WhatsApp.
              </li>
              <li>
                Contactarlo si hay un problema con su pedido.
              </li>
              <li>
                Enviarle mensajes ocasionales sobre promociones o novedades
                de Springs (puede solicitar que dejemos de enviarlos en
                cualquier momento).
              </li>
            </ul>
          </Section>

          <Section title="4. Cookies y herramientas de terceros">
            <p>Usamos las siguientes herramientas que pueden almacenar cookies en su navegador:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong>Meta Pixel (Facebook/Instagram)</strong> — para medir
                el rendimiento de nuestros anuncios.
              </li>
              <li>
                <strong>Google Analytics (GA4)</strong> — para entender como
                los visitantes usan el sitio.
              </li>
              <li>
                <strong>Vercel Analytics</strong> — para medir el rendimiento
                de la pagina.
              </li>
            </ul>
            <p className="mt-3">
              Estas herramientas recolectan datos anonimos de navegacion
              (paginas visitadas, tiempo en el sitio, dispositivo). No
              identifican a personas individuales.
            </p>
          </Section>

          <Section title="5. Con quien compartimos sus datos">
            <p>
              No vendemos, alquilamos ni compartimos sus datos personales con
              terceros. Solo los usamos internamente para operar Springs.
              Excepcion: si una autoridad judicial colombiana lo requiere
              mediante orden.
            </p>
          </Section>

          <Section title="6. Cuanto tiempo guardamos sus datos">
            <p>
              Conservamos los datos de sus pedidos por 2 anos para efectos
              contables y de servicio. Despues de ese periodo, se eliminan
              automaticamente.
            </p>
          </Section>

          <Section title="7. Sus derechos (Ley 1581 de 2012)">
            <p>Usted tiene derecho a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong>Conocer</strong> que datos tenemos sobre usted.
              </li>
              <li>
                <strong>Actualizar y rectificar</strong> sus datos si estan
                incorrectos.
              </li>
              <li>
                <strong>Solicitar la eliminacion</strong> de sus datos cuando
                no sean necesarios para la finalidad que fueron recolectados.
              </li>
              <li>
                <strong>Revocar la autorizacion</strong> para el tratamiento
                de sus datos.
              </li>
              <li>
                <strong>Presentar quejas</strong> ante la Superintendencia de
                Industria y Comercio (SIC) si considera que sus derechos han
                sido vulnerados.
              </li>
            </ul>
          </Section>

          <Section title="8. Como ejercer sus derechos">
            <p>
              Escribanos por WhatsApp o al correo electronico indicando su
              nombre y solicitud. Responderemos en un plazo maximo de 15 dias
              habiles.
            </p>
            <div className="mt-3 border border-tinta/10 p-4">
              <p className="font-mono text-xs text-tinta/60 tracking-[1px]">
                CANAL DE CONTACTO
              </p>
              <p className="mt-2">WhatsApp: por definir</p>
              <p>Email: por definir</p>
            </div>
          </Section>

          <Section title="9. Cambios a esta politica">
            <p>
              Podemos actualizar esta politica. Si lo hacemos, cambiaremos la
              fecha de actualizacion al inicio de este documento. El uso
              continuado del sitio despues de los cambios implica aceptacion.
            </p>
          </Section>
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
