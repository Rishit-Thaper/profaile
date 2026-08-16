import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        color: "#ffffff",
        fontFamily: "'Inter', -apple-system, sans-serif",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: "12px",
          fontFamily: "'Sora', 'Inter', sans-serif",
          color: "#3b82f6",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "32px",
          maxWidth: "360px",
          lineHeight: 1.5,
        }}
      >
        This portfolio doesn&apos;t exist or hasn&apos;t been published yet.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          padding: "12px 28px",
          background: "#3b82f6",
          color: "#fff",
          borderRadius: "9999px",
          fontSize: "0.9rem",
          fontWeight: 600,
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
      >
        Create your portfolio →
      </Link>
    </div>
  );
}
