"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import QRCode from "qrcode";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiDownload,
  FiEdit2,
  FiExternalLink,
  FiMail,
  FiMoon,
  FiSend,
  FiShare2,
  FiStar,
  FiSun,
  FiX,
  FiZap,
} from "react-icons/fi";
import { FaLinkedin, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import type { PortfolioData } from "@/app/types";
import {
  cardPalette,
  cardThemes,
  defaultAppearance,
  type Appearance,
  type CardThemeId,
} from "../card/card-themes";
import { renderShareCard } from "../card/render-card";
import styles from "./PortfolioShareCard.module.css";

const THEME_KEYS = Object.keys(cardThemes) as CardThemeId[];
const SHARE_MESSAGE = "Hey, I made my Profaile card. Make yours too!";

export function PortfolioShareCard({
  portfolioName,
  data,
  theme,
  publicUrl,
  draftUrl,
  shareReady,
  onThemeChange,
  onAppearanceChange,
  onHeadlineSave,
  onGenerateHeadline,
  onGoLive,
}: {
  portfolioName: string;
  data: PortfolioData | null;
  theme: string;
  publicUrl: string;
  draftUrl: string | null;
  shareReady: boolean;
  onThemeChange: (theme: string) => Promise<void>;
  onAppearanceChange: (appearance: Appearance) => Promise<void>;
  onHeadlineSave: (headline: string) => Promise<void>;
  onGenerateHeadline: () => Promise<void>;
  onGoLive: () => Promise<void>;
}) {
  const personal = data?.personal_info;
  const appearance = personal?.appearance ?? defaultAppearance(theme);
  const palette = cardPalette(theme, appearance);

  const [headline, setHeadline] = useState(personal?.headline ?? "");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const [brokenPhoto, setBrokenPhoto] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareFile, setShareFile] = useState<File | null>(null);
  const [sharePreviewUrl, setSharePreviewUrl] = useState("");
  const [shareError, setShareError] = useState("");
  const [canShareFile, setCanShareFile] = useState(false);

  // 3D Motion & Card Change State
  const [isFlipping, setIsFlipping] = useState(false);
  const prevThemeRef = useRef(theme);
  const prevAppearanceRef = useRef(appearance);

  const drawerRef = useRef<HTMLDialogElement>(null);
  const shareDialogRef = useRef<HTMLDialogElement>(null);
  const pillListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeadline(personal?.headline ?? "");
  }, [personal?.headline]);

  // Auto-scroll active theme pill into view in the theme bar
  useEffect(() => {
    const container = pillListRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>(`.${styles.themePillActive}`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [theme]);

  // 3D Flip animation trigger when theme or appearance changes
  useEffect(() => {
    if (prevThemeRef.current !== theme || prevAppearanceRef.current !== appearance) {
      prevThemeRef.current = theme;
      prevAppearanceRef.current = appearance;
      setIsFlipping(true);
      const timer = window.setTimeout(() => {
        setIsFlipping(false);
      }, 650);
      return () => window.clearTimeout(timer);
    }
  }, [theme, appearance]);

  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;
    if (drawerOpen) {
      setDrawerClosing(false);
      if (!dialog.open) dialog.showModal();
      return;
    }
    if (!dialog.open) return;
    setDrawerClosing(true);
    const timeout = window.setTimeout(() => {
      dialog.close();
      setDrawerClosing(false);
    }, 260);
    return () => window.clearTimeout(timeout);
  }, [drawerOpen]);

  useEffect(() => {
    const dialog = shareDialogRef.current;
    if (!dialog) return;
    if (shareOpen && !dialog.open) dialog.showModal();
    if (!shareOpen && dialog.open) dialog.close();
  }, [shareOpen]);

  useEffect(() => {
    if (!shareReady || !publicUrl) {
      setQrDataUrl("");
      return;
    }
    let active = true;
    QRCode.toDataURL(publicUrl, { width: 220, margin: 1, errorCorrectionLevel: "H" })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl("");
      });
    return () => {
      active = false;
    };
  }, [publicUrl, shareReady]);

  useEffect(() => {
    if (!shareOpen || !shareReady || !personal || !qrDataUrl || !publicUrl) return;

    let active = true;
    let objectUrl = "";
    setShareFile(null);
    setSharePreviewUrl("");
    setCanShareFile(false);
    setShareError("");

    void renderShareCard({ personal, theme, appearance, portfolioName, url: publicUrl, qrDataUrl })
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        const filename = `${portfolioName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "portfolio"}-card.png`;
        const file = new File([blob], filename, { type: "image/png" });
        setShareFile(file);
        setSharePreviewUrl(objectUrl);
        try {
          setCanShareFile(typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }));
        } catch {
          setCanShareFile(false);
        }
      })
      .catch(() => {
        if (active) setShareError("The card image could not be prepared. You can still share your portfolio link.");
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [shareOpen, shareReady, personal, theme, appearance, portfolioName, publicUrl, qrDataUrl]);

  const run = async (action: () => Promise<void>, success?: string) => {
    setBusy(true);
    setMessage("");
    try {
      await action();
      if (success) setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save this change");
    } finally {
      setBusy(false);
    }
  };

  const switchThemeByIndex = (delta: number) => {
    const currentIndex = THEME_KEYS.indexOf(theme as CardThemeId);
    const nextIndex = (currentIndex + delta + THEME_KEYS.length) % THEME_KEYS.length;
    const nextTheme = THEME_KEYS[nextIndex];
    void run(() => onThemeChange(nextTheme));
  };

  const shareText = `${SHARE_MESSAGE}\n${publicUrl}`;
  const shareToApps = () => {
    if (!shareFile || !canShareFile) return;
    void navigator.share({
      files: [shareFile],
      title: `${personal?.name || "My"} Profaile card`,
      text: SHARE_MESSAGE,
      url: publicUrl,
    }).then(() => setShareOpen(false)).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareError("Your device could not share the image. Try an app link or download the PNG.");
    });
  };
  const copyShareText = () => {
    if (!navigator.clipboard?.writeText) {
      setShareError("Clipboard access is unavailable. Select the message above to copy it.");
      return;
    }
    void navigator.clipboard.writeText(shareText)
      .then(() => setShareError("Message and link copied."))
      .catch(() => setShareError("Could not copy automatically. Select the message above to copy it."));
  };

  const cardStyle = {
    "--card-bg": palette.bg,
    "--card-surface": palette.surface,
    "--card-text": palette.text,
    "--card-muted": palette.muted,
    "--card-accent": palette.accent,
  } as CSSProperties;

  const photoUrl =
    personal?.photo && personal.photo_visible !== false && brokenPhoto !== personal.photo
      ? personal.photo
      : null;

  const cleanUrl = shareReady ? publicUrl.replace(/^https?:\/\//, "") : "Publish to activate this card";

  // Dynamic layout rendering based on theme
  const renderCardContent = () => {
    switch (theme) {
      case "terminal":
        return (
          <>
            <div className={styles.cardTop}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-flex", gap: "5px" }}>
                  <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ff5f56" }} />
                  <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ffbd2e" }} />
                  <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#27c93f" }} />
                </span>
                <span>guest@profaile:~ (zsh)</span>
              </div>
              <div className={styles.cardTopRight}>
                <span className={styles.themeBadge}>PID: 4182</span>
                <button
                  type="button"
                  className={styles.editCardButton}
                  onClick={() => setDrawerOpen(true)}
                  disabled={!data}
                >
                  <FiEdit2 aria-hidden /> [--edit--]
                </button>
              </div>
            </div>

            <div className={styles.cardIdentity}>
              <div className={styles.portrait}>
                <span aria-hidden={Boolean(photoUrl)}>
                  {(personal?.name || "P").slice(0, 2).toUpperCase()}
                </span>
                {photoUrl && (
                  <Image
                    src={photoUrl}
                    alt={personal?.name || "Profile photo"}
                    width={112}
                    height={112}
                    unoptimized
                    onError={() => setBrokenPhoto(photoUrl)}
                  />
                )}
              </div>
              <div className={styles.identityMeta}>
                <span style={{ color: "#00e18a", fontFamily: "ui-monospace, monospace", fontSize: "0.75rem" }}>
                  $ profaile fetch --user
                </span>
                <h2>
                  {personal?.name || "Your name"}
                  <span style={{ animation: "pulse 1s infinite", color: "#00e18a" }}>_</span>
                </h2>
                <p className={styles.headline}>
                  &gt; {personal?.headline || personal?.title || "Your professional headline"}
                </p>
                <span className={styles.role}>
                  {"[STATUS: READY] // "}
                  {personal?.title || "Build your portfolio"}
                </span>
              </div>
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.cardBottomInfo}>
                <span className={styles.scanLabel}>$ qrencode -t ansi</span>
                <strong className={styles.cardUrl}>{cleanUrl}</strong>
              </div>
              <div className={styles.qrTile}>
                {qrDataUrl && shareReady ? (
                  <Image
                    src={qrDataUrl}
                    alt="QR code for published portfolio"
                    width={104}
                    height={104}
                    unoptimized
                  />
                ) : (
                  <span>
                    [SCAN]
                    <br />
                    PENDING
                    <br />
                    PUBLISH
                  </span>
                )}
              </div>
            </div>
          </>
        );

      case "neon":
        return (
          <>
            <div className={styles.cardTop}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "var(--card-accent)", fontWeight: 900 }}>[+]</span>
                <span>SYS.ID: 0x9F4 // FREQ: 5.8GHZ</span>
              </div>
              <div className={styles.cardTopRight}>
                <span className={styles.themeBadge}>ONLINE</span>
                <button
                  type="button"
                  className={styles.editCardButton}
                  onClick={() => setDrawerOpen(true)}
                  disabled={!data}
                >
                  <FiEdit2 aria-hidden /> Config
                </button>
              </div>
            </div>

            <div className={styles.cardIdentity}>
              <div className={styles.portrait}>
                <span aria-hidden={Boolean(photoUrl)}>
                  {(personal?.name || "P").slice(0, 2).toUpperCase()}
                </span>
                {photoUrl && (
                  <Image
                    src={photoUrl}
                    alt={personal?.name || "Profile photo"}
                    width={112}
                    height={112}
                    unoptimized
                    onError={() => setBrokenPhoto(photoUrl)}
                  />
                )}
              </div>
              <div className={styles.identityMeta}>
                <h2>{personal?.name || "Your name"}</h2>
                <p className={styles.headline}>
                  {"// "}
                  {personal?.headline || personal?.title || "Cybernetic Developer"}
                </p>
                <span className={styles.role}>
                  {"// PROTOCOL: LEVEL-5 // "}
                  {personal?.title || "Engineer"}
                </span>
              </div>
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.cardBottomInfo}>
                <span className={styles.scanLabel}>&gt;&gt; DIRECT NODE LINK</span>
                <strong className={styles.cardUrl}>{cleanUrl}</strong>
              </div>
              <div className={styles.qrTile}>
                {qrDataUrl && shareReady ? (
                  <Image
                    src={qrDataUrl}
                    alt="QR code for published portfolio"
                    width={104}
                    height={104}
                    unoptimized
                  />
                ) : (
                  <span>
                    QR HUD
                    <br />
                    SYNC
                    <br />
                    WAITING
                  </span>
                )}
              </div>
            </div>
          </>
        );

      case "professional":
        return (
          <>
            <div className={styles.cardTop}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ letterSpacing: "0.18em", fontWeight: 800 }}>PROFAILE EXECUTIVE</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span>{portfolioName}</span>
              </div>
              <div className={styles.cardTopRight}>
                <span className={styles.themeBadge}>AUTHORIZED ID</span>
                <button
                  type="button"
                  className={styles.editCardButton}
                  onClick={() => setDrawerOpen(true)}
                  disabled={!data}
                >
                  <FiEdit2 aria-hidden /> Edit card
                </button>
              </div>
            </div>

            <div className={styles.cardIdentity}>
              <div className={styles.portrait}>
                <span aria-hidden={Boolean(photoUrl)}>
                  {(personal?.name || "P").slice(0, 2).toUpperCase()}
                </span>
                {photoUrl && (
                  <Image
                    src={photoUrl}
                    alt={personal?.name || "Profile photo"}
                    width={112}
                    height={112}
                    unoptimized
                    onError={() => setBrokenPhoto(photoUrl)}
                  />
                )}
              </div>
              <div className={styles.identityMeta}>
                <h2>{personal?.name || "Your name"}</h2>
                <p className={styles.headline}>
                  {personal?.headline || personal?.title || "Executive Record"}
                </p>
                <span className={styles.role}>
                  AUTHENTICATED RECORD • {personal?.title || "Professional"}
                </span>
              </div>
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.cardBottomInfo}>
                <span className={styles.scanLabel}>OFFICIAL VERIFICATION PORTAL</span>
                <strong className={styles.cardUrl}>{cleanUrl}</strong>
              </div>
              <div className={styles.qrTile}>
                {qrDataUrl && shareReady ? (
                  <Image
                    src={qrDataUrl}
                    alt="QR code for published portfolio"
                    width={104}
                    height={104}
                    unoptimized
                  />
                ) : (
                  <span>
                    OFFICIAL
                    <br />
                    SEAL
                    <br />
                    PENDING
                  </span>
                )}
              </div>
            </div>
          </>
        );

      case "elegant":
        return (
          <>
            <div className={styles.cardTop}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><FiStar aria-hidden /> PROFAILE ATELIER <FiStar aria-hidden /></span>
              <div className={styles.cardTopRight}>
                <span className={styles.themeBadge}>DOSSIER</span>
                <button
                  type="button"
                  className={styles.editCardButton}
                  onClick={() => setDrawerOpen(true)}
                  disabled={!data}
                >
                  <FiEdit2 aria-hidden /> Edit
                </button>
              </div>
            </div>

            <div className={styles.cardIdentity}>
              <div className={styles.portrait}>
                <span aria-hidden={Boolean(photoUrl)}>
                  {(personal?.name || "P").slice(0, 2).toUpperCase()}
                </span>
                {photoUrl && (
                  <Image
                    src={photoUrl}
                    alt={personal?.name || "Profile photo"}
                    width={112}
                    height={112}
                    unoptimized
                    onError={() => setBrokenPhoto(photoUrl)}
                  />
                )}
              </div>
              <div className={styles.identityMeta}>
                <h2>{personal?.name || "Your name"}</h2>
                <p className={styles.headline}>
                  &ldquo;{personal?.headline || personal?.title || "Curated Portfolio"}&rdquo;
                </p>
                <span className={styles.role}>
                  CURATED BY PROFAILE • {personal?.title || "Creator"}
                </span>
              </div>
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.cardBottomInfo}>
                <span className={styles.scanLabel}>EXCLUSIVE ACCESS // MMXXVI</span>
                <strong className={styles.cardUrl}>{cleanUrl}</strong>
              </div>
              <div className={styles.qrTile}>
                {qrDataUrl && shareReady ? (
                  <Image
                    src={qrDataUrl}
                    alt="QR code for published portfolio"
                    width={104}
                    height={104}
                    unoptimized
                  />
                ) : (
                  <span>
                    ATELIER
                    <br />
                    CURATION
                    <br />
                    PENDING
                  </span>
                )}
              </div>
            </div>
          </>
        );

      case "vibrant":
        return (
          <>
            <div className={styles.cardTop}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FiZap aria-hidden style={{ fontSize: "1rem" }} />
                <span style={{ fontWeight: 900, letterSpacing: "0.08em" }}>CREATIVE PASS</span>
                <span style={{ display: "inline-flex", gap: "4px", marginLeft: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff4d6d" }} />
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ffd166" }} />
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#06d6a0" }} />
                </span>
              </div>
              <div className={styles.cardTopRight}>
                <button
                  type="button"
                  className={styles.editCardButton}
                  onClick={() => setDrawerOpen(true)}
                  disabled={!data}
                >
                  <FiEdit2 aria-hidden /> Style
                </button>
              </div>
            </div>

            <div className={styles.cardIdentity}>
              <div className={styles.portrait}>
                <span aria-hidden={Boolean(photoUrl)}>
                  {(personal?.name || "P").slice(0, 2).toUpperCase()}
                </span>
                {photoUrl && (
                  <Image
                    src={photoUrl}
                    alt={personal?.name || "Profile photo"}
                    width={112}
                    height={112}
                    unoptimized
                    onError={() => setBrokenPhoto(photoUrl)}
                  />
                )}
              </div>
              <div className={styles.identityMeta}>
                <h2>{personal?.name || "Your name"}</h2>
                <div style={{ marginTop: "4px" }}>
                  <span className={styles.headline}>
                    {personal?.headline || personal?.title || "Creative Mind"}
                  </span>
                </div>
                <span className={styles.role} style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: "6px", fontWeight: 700 }}>
                  <FiSend aria-hidden /> {personal?.title || "Maker"} • OPEN TO CONNECT
                </span>
              </div>
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.cardBottomInfo}>
                <span className={styles.scanLabel}>SCAN TO CONNECT</span>
                <strong className={styles.cardUrl}>{cleanUrl}</strong>
              </div>
              <div className={styles.qrTile}>
                {qrDataUrl && shareReady ? (
                  <Image
                    src={qrDataUrl}
                    alt="QR code for published portfolio"
                    width={104}
                    height={104}
                    unoptimized
                  />
                ) : (
                  <span>
                    READY
                    <br />
                    AFTER
                    <br />
                    PUBLISH
                  </span>
                )}
              </div>
            </div>
          </>
        );

      case "modern":
        return (
          <>
            <div className={styles.cardTop}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--card-accent)",
                    boxShadow: "0 0 8px var(--card-accent)",
                  }}
                />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 800 }}>VERIFIED CREATOR <FiStar aria-hidden /></span>
              </div>
              <div className={styles.cardTopRight}>
                <span className={styles.themeBadge}>MODERN</span>
                <button
                  type="button"
                  className={styles.editCardButton}
                  onClick={() => setDrawerOpen(true)}
                  disabled={!data}
                >
                  <FiEdit2 aria-hidden /> Edit card
                </button>
              </div>
            </div>

            <div className={styles.cardIdentity}>
              <div className={styles.portrait}>
                <span aria-hidden={Boolean(photoUrl)}>
                  {(personal?.name || "P").slice(0, 2).toUpperCase()}
                </span>
                {photoUrl && (
                  <Image
                    src={photoUrl}
                    alt={personal?.name || "Profile photo"}
                    width={112}
                    height={112}
                    unoptimized
                    onError={() => setBrokenPhoto(photoUrl)}
                  />
                )}
              </div>
              <div className={styles.identityMeta}>
                <h2>{personal?.name || "Your name"}</h2>
                <div>
                  <span className={styles.headline}>
                    {personal?.headline || personal?.title || "Modern Specialist"}
                  </span>
                </div>
                <span className={styles.role}>
                  <FiStar aria-hidden /> ACTIVE PORTFOLIO • {personal?.title || "Builder"}
                </span>
              </div>
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.cardBottomInfo}>
                <span className={styles.scanLabel}>CONNECT INSTANTLY</span>
                <strong className={styles.cardUrl}>{cleanUrl}</strong>
              </div>
              <div className={styles.qrTile}>
                {qrDataUrl && shareReady ? (
                  <Image
                    src={qrDataUrl}
                    alt="QR code for published portfolio"
                    width={104}
                    height={104}
                    unoptimized
                  />
                ) : (
                  <span>
                    QR
                    <br />
                    AFTER
                    <br />
                    PUBLISH
                  </span>
                )}
              </div>
            </div>
          </>
        );

      case "minimal":
      default:
        return (
          <>
            <div className={styles.cardTop}>
              <span style={{ letterSpacing: "0.16em" }}>PROFAILE // ARCHIVE [01]</span>
              <div className={styles.cardTopRight}>
                <span className={styles.themeBadge}>{palette.name.toUpperCase()}</span>
                <button
                  type="button"
                  className={styles.editCardButton}
                  onClick={() => setDrawerOpen(true)}
                  disabled={!data}
                >
                  <FiEdit2 aria-hidden /> Edit card
                </button>
              </div>
            </div>

            <div className={styles.cardIdentity}>
              <div className={styles.portrait}>
                <span aria-hidden={Boolean(photoUrl)}>
                  {(personal?.name || "P").slice(0, 2).toUpperCase()}
                </span>
                {photoUrl && (
                  <Image
                    src={photoUrl}
                    alt={personal?.name || "Profile photo"}
                    width={112}
                    height={112}
                    unoptimized
                    onError={() => setBrokenPhoto(photoUrl)}
                  />
                )}
              </div>
              <div className={styles.identityMeta}>
                <h2>{personal?.name || "Your name"}</h2>
                <div
                  style={{
                    width: "48px",
                    height: "2px",
                    background: "var(--card-accent)",
                    margin: "4px 0",
                    opacity: 0.8,
                  }}
                />
                <p className={styles.headline}>
                  {personal?.headline || personal?.title || "Your professional headline"}
                </p>
                <span className={styles.role}>
                  [SPEC: {personal?.title?.toUpperCase() || "PORTFOLIO"}]
                </span>
              </div>
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.cardBottomInfo}>
                <span className={styles.scanLabel}>LOC // SCAN TO VIEW</span>
                <strong className={styles.cardUrl}>{cleanUrl}</strong>
              </div>
              <div className={styles.qrTile}>
                {qrDataUrl && shareReady ? (
                  <Image
                    src={qrDataUrl}
                    alt="QR code for published portfolio"
                    width={104}
                    height={104}
                    unoptimized
                  />
                ) : (
                  <span>
                    QR
                    <br />
                    AFTER
                    <br />
                    PUBLISH
                  </span>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <section className={styles.section} aria-label="Portfolio card">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderTop}>
          <div className={styles.sectionHeaderIntro}>
            <span className={styles.eyebrow}>Your ProfAIle card</span>
            <h1>Make a first impression</h1>
            <p className={styles.sectionHeaderDesc}>
              Choose a style, refine your headline, then go live to share the card.
            </p>
          </div>
          <span className={`${styles.status} ${shareReady ? styles.statusLive : ""}`}>
            {shareReady ? "Live card" : "Private preview"}
          </span>
        </div>

        {/* Quick Theme Switcher Pill Bar */}
        <div className={styles.themeBar} role="toolbar" aria-label="Quick theme selector">
          <button
            type="button"
            className={styles.themeBarNav}
            onClick={() => switchThemeByIndex(-1)}
            disabled={busy || !data}
            aria-label="Previous card theme"
          >
            <FiChevronLeft aria-hidden />
          </button>
          <div ref={pillListRef} className={styles.themePillList}>
              {THEME_KEYS.map((key) => {
                const item = cardThemes[key];
                const active = theme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.themePill} ${active ? styles.themePillActive : ""}`}
                    onClick={() => void run(() => onThemeChange(key))}
                    disabled={busy || !data}
                  >
                    <span
                      className={styles.themePillDot}
                      style={{ background: item.accent }}
                    />
                    {item.name}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className={styles.themeBarNav}
              onClick={() => switchThemeByIndex(1)}
              disabled={busy || !data}
              aria-label="Next card theme"
            >
              <FiChevronRight aria-hidden />
            </button>
          </div>
        </div>

      {/* 3D Stage with Floating motion & 3D card rotation */}
      <div className={styles.stage}>
        <div className={`${styles.floatEntity} ${!isFlipping ? styles.isFloating : ""}`}>
          <div className={`${styles.cardTiltWrapper} ${isFlipping ? styles.cardFlipping : ""}`}>
            <div
              className={styles.card}
              data-theme={theme}
              style={cardStyle}
            >
              {/* Theme Distinct Card Content */}
              {renderCardContent()}
            </div>
          </div>
        </div>
      </div>

      {data && (
        <div className={styles.cardActions}>
          <span>
            {message ||
              (shareReady
                ? "Your card is live and ready to share."
                : "Preview your changes, then go live to update the card and QR.")}
          </span>
          <div className={styles.cardActionButtons}>
            {!shareReady && draftUrl && (
              <a href={draftUrl} target="_blank" rel="noopener noreferrer">
                <FiExternalLink aria-hidden /> View draft
              </a>
            )}
            {data && !shareReady && (
              <button
                className={styles.goLiveButton}
                type="button"
                onClick={() => void run(onGoLive, "Portfolio is live")}
                disabled={busy}
              >
                {busy ? "Publishing..." : "Go live"}
              </button>
            )}
            {shareReady && publicUrl && (
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <FiExternalLink aria-hidden /> View portfolio
              </a>
            )}
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              disabled={!shareReady || !qrDataUrl}
            >
              <FiShare2 aria-hidden /> Share card
            </button>
          </div>
        </div>
      )}

      <dialog
        ref={shareDialogRef}
        className={styles.shareDialog}
        onClose={() => setShareOpen(false)}
        onCancel={() => setShareOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) setShareOpen(false); }}
        aria-labelledby="share-card-title"
      >
        <div className={styles.shareDialogContent}>
          <div className={styles.shareDialogHeader}>
            <div><span className={styles.eyebrow}>Your introduction, ready to share</span><h2 id="share-card-title">Share your card</h2></div>
            <button type="button" onClick={() => setShareOpen(false)} aria-label="Close share menu"><FiX aria-hidden /></button>
          </div>
          <div className={styles.sharePreview}>
            {sharePreviewUrl ? <Image src={sharePreviewUrl} alt={`Share card for ${personal?.name || "your portfolio"}`} width={1200} height={675} unoptimized /> : <span>{shareError || "Preparing your card image..."}</span>}
          </div>
          <p className={styles.shareMessage}>{SHARE_MESSAGE}</p>
          <p className={styles.shareLink}>{publicUrl}</p>
          {canShareFile && <button type="button" className={styles.nativeShareButton} onClick={shareToApps}><FiShare2 aria-hidden /> Choose an app to share the image</button>}
          <div className={styles.shareAppGrid} aria-label="Share portfolio link">
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"><FaWhatsapp aria-hidden /> WhatsApp</a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_MESSAGE)}&url=${encodeURIComponent(publicUrl)}`} target="_blank" rel="noopener noreferrer"><FaXTwitter aria-hidden /> X</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`} target="_blank" rel="noopener noreferrer"><FaLinkedin aria-hidden /> LinkedIn</a>
            <a href={`mailto:?subject=${encodeURIComponent("My Profaile card")}&body=${encodeURIComponent(shareText)}`}><FiMail aria-hidden /> Email</a>
          </div>
          <p className={styles.shareHint}>{canShareFile ? "The app chooser includes your card image. App links share your portfolio URL." : "App links share your portfolio URL. Download the PNG to attach the card image."}</p>
          <div className={styles.shareUtilities}>
            <button type="button" onClick={copyShareText}><FiCopy aria-hidden /> Copy message & link</button>
            {sharePreviewUrl && shareFile && <a href={sharePreviewUrl} download={shareFile.name}><FiDownload aria-hidden /> Download PNG</a>}
          </div>
          {shareError && sharePreviewUrl && <p className={styles.shareFeedback} role="status">{shareError}</p>}
        </div>
      </dialog>

      {/* Edit Card Drawer Modal */}
      <dialog
        ref={drawerRef}
        className={styles.drawer}
        data-closing={drawerClosing ? "true" : undefined}
        onCancel={(event) => {
          event.preventDefault();
          setDrawerOpen(false);
        }}
        onClose={() => setDrawerOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setDrawerOpen(false);
        }}
        aria-labelledby="card-editor-title"
      >
        <div className={styles.drawerContent}>
          <div className={styles.drawerHeader}>
            <div>
              <span className={styles.eyebrow}>Portfolio card</span>
              <h2 id="card-editor-title">Edit your card</h2>
              <p>These choices also shape your portfolio draft.</p>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close card editor"
            >
              <FiX aria-hidden />
            </button>
          </div>
          <div className={styles.controls}>
            <label className={styles.themeControl}>
              Portfolio theme
              <select
                value={theme}
                onChange={(event) => void run(() => onThemeChange(event.target.value))}
                disabled={busy || !data}
              >
                {THEME_KEYS.map((id) => (
                  <option key={id} value={id}>
                    {cardThemes[id].name}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className={styles.modeControl} disabled={busy || !data}>
              <legend>Appearance</legend>
              <div>
                {(["light", "dark"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={appearance === mode ? styles.modeActive : ""}
                    onClick={() => void run(() => onAppearanceChange(mode))}
                  >
                    {mode === "light" ? <FiSun aria-hidden /> : <FiMoon aria-hidden />}
                    {mode === "light" ? "Light" : "Dark"}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className={styles.headlineControl}>
              Card headline
              <div>
                <input
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  maxLength={80}
                  placeholder="A short phrase that sounds like you"
                  disabled={!data || busy}
                />
                <button
                  type="button"
                  disabled={!data || busy || headline.trim() === (personal?.headline ?? "")}
                  onClick={() =>
                    void run(() => onHeadlineSave(headline.trim()), "Headline saved")
                  }
                >
                  Save
                </button>
              </div>
            </label>
            <button
              className={styles.generateButton}
              type="button"
              disabled={!data || busy}
              onClick={() => void run(onGenerateHeadline, "New headline generated")}
            >
              <FiZap aria-hidden /> Generate with AI
            </button>
          </div>
          {message && (
            <p className={styles.drawerMessage} role="status">
              {message}
            </p>
          )}
          <div className={styles.drawerFooter}>
            <button type="button" onClick={() => setDrawerOpen(false)}>
              Done
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
