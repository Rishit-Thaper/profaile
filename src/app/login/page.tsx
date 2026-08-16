import Image from "next/image";
import "../dashboard-theme.css";
import styles from "./login.module.css";
import SignInButton from "./SignInButton";

const FEATURES = [
  {
    title: "AI parses your resume",
    desc: "Experience, projects & skills extracted in seconds",
    color: "#3b82f6",
  },
  {
    title: "Pick from 7 premium themes",
    desc: "Minimal, Neon, Elegant, Terminal and more",
    color: "#60a5fa",
  },
  {
    title: "An AI assistant on your page",
    desc: "Visitors chat with your portfolio — grounded in RAG",
    color: "#93c5fd",
  },
  {
    title: "Go live in one click",
    desc: "Get a custom URL to share with recruiters",
    color: "#dbeafe",
  },
];

export default function LoginPage() {
  return (
    <div className={`${styles.page} noise-overlay`}>
      {/* Background effects */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGrid} />

      <main className={styles.main}>
        <div className={`${styles.card} animate-fade-in-scale`}>
          {/* Logo */}
          <div className={styles.logoSection}>
            <span className={styles.logoMark} aria-hidden>
              <Image
                src="/20260816_152547.jpg"
                alt="Profaile logo"
                width={32}
                height={32}
                className={styles.logoImg}
                priority
              />
            </span>
            <h1 className={styles.logoTitle}>profaile</h1>
            <span className={styles.logoBadge}>beta</span>
          </div>

          {/* Headline */}
          <h2 className={styles.headline}>
            Resume to portfolio
            <br />
            <span className="gradient-text">in seconds.</span>
          </h2>

          <p className={styles.subtext}>
            Upload your resume, choose a theme, and get a live portfolio with an
            AI assistant — instantly powered by AI.
          </p>

          {/* Features */}
          <div className={styles.features}>
            {FEATURES.map((feature) => (
              <div className={styles.feature} key={feature.title}>
                <span
                  className={styles.featureIcon}
                  style={{ background: `${feature.color}1f`, color: feature.color }}
                  aria-hidden
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                      d="M2 5.5L4.2 7.7L9 3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className={styles.featureText}>
                  <strong>{feature.title}</strong>
                  <span className={styles.featureDesc}>{feature.desc}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Login Button */}
          <SignInButton />

          <p className={styles.disclaimer}>
            Free forever • No credit card required
          </p>
        </div>
      </main>
    </div>
  );
}
