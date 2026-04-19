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
        background: "#08080c",
        color: "#f0f0f5",
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
          background: "linear-gradient(135deg, #7c5cfc, #5c9dfc, #5cfcb5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          color: "#8b8b9e",
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
          background: "linear-gradient(135deg, #7c5cfc 0%, #5c9dfc 100%)",
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
