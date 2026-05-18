export default function PruebaTuSuerte() {
  const C = {
    burgundy: "#6B1419",
    cream: "#F2E8D5",
    tinta: "#1A0A0C",
    mostaza: "#C5871F",
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: C.mostaza,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 40px",
    }}>
      <h1 style={{
        fontFamily: "Anton, sans-serif",
        fontSize: "clamp(60px, 12vw, 220px)",
        color: C.tinta,
        lineHeight: 0.9,
        letterSpacing: "-0.01em",
        textTransform: "uppercase",
        textAlign: "center",
        margin: 0,
      }}>
        PRUEBA<br />TU<br />SUERTE
      </h1>
    </main>
  );
}
