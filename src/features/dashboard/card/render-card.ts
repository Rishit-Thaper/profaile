import type { PersonalInfo } from "@/app/types";
import { cardPalette, type Appearance } from "./card-themes";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function lineBreaks(context: CanvasRenderingContext2D, text: string, width: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderShareCard({
  personal,
  theme,
  appearance,
  portfolioName,
  url,
  qrDataUrl,
}: {
  personal: PersonalInfo;
  theme: string;
  appearance: Appearance;
  portfolioName: string;
  url: string;
  qrDataUrl: string;
}): Promise<Blob> {
  await document.fonts.ready;
  const palette = cardPalette(theme, appearance);
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 675;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create card image");

  // Base background
  context.fillStyle = palette.bg;
  context.fillRect(0, 0, 1200, 675);

  // Theme-specific background and decorative artwork
  if (theme === "terminal") {
    // Scanline simulation
    context.fillStyle = "rgba(0, 225, 138, 0.03)";
    for (let y = 0; y < 675; y += 4) {
      context.fillRect(0, y, 1200, 2);
    }
    // Terminal window chrome top bar
    context.fillStyle = "rgba(0, 225, 138, 0.08)";
    context.fillRect(0, 0, 1200, 70);
    context.fillStyle = "rgba(0, 225, 138, 0.3)";
    context.fillRect(0, 69, 1200, 1);

    // Traffic light dots
    context.fillStyle = "#ff5f56";
    context.beginPath(); context.arc(80, 35, 7, 0, Math.PI * 2); context.fill();
    context.fillStyle = "#ffbd2e";
    context.beginPath(); context.arc(104, 35, 7, 0, Math.PI * 2); context.fill();
    context.fillStyle = "#27c93f";
    context.beginPath(); context.arc(128, 35, 7, 0, Math.PI * 2); context.fill();

    context.font = "600 20px ui-monospace, monospace";
    context.fillStyle = "#00e18a";
    context.fillText("guest@profaile:~ (zsh) — " + portfolioName.toLowerCase(), 155, 42);
  } else if (theme === "neon") {
    // Cyberpunk ambient glow
    context.globalAlpha = 0.2;
    context.fillStyle = palette.accent;
    context.beginPath(); context.arc(1100, 80, 360, 0, Math.PI * 2); context.fill();
    context.globalAlpha = 1;

    // Corner HUD brackets
    context.strokeStyle = palette.accent;
    context.lineWidth = 3;
    context.strokeRect(50, 50, 40, 40);
    context.strokeRect(1110, 50, 40, 40);
    context.strokeRect(50, 585, 40, 40);
    context.strokeRect(1110, 585, 40, 40);

    context.font = "700 20px ui-monospace, monospace";
    context.fillStyle = palette.accent;
    context.fillText("SYS.ID: 0x9F4 // FREQ: 5.8GHZ // ONLINE", 110, 80);
  } else if (theme === "professional") {
    // Executive top ribbon
    context.fillStyle = palette.accent;
    context.fillRect(0, 0, 1200, 12);
    context.fillStyle = "rgba(196, 98, 45, 0.12)";
    context.fillRect(0, 12, 1200, 75);

    context.font = "700 22px Georgia, serif";
    context.fillStyle = palette.text;
    context.fillText("PROFAILE EXECUTIVE ARCHIVE  |  " + portfolioName.toUpperCase(), 72, 58);
  } else if (theme === "elegant") {
    // Haute Couture luxury border
    context.strokeStyle = palette.accent;
    context.lineWidth = 2;
    context.strokeRect(30, 30, 1140, 615);
    context.strokeStyle = "rgba(169, 134, 71, 0.3)";
    context.strokeRect(40, 40, 1120, 595);

    context.font = "600 22px Georgia, serif";
    context.fillStyle = palette.accent;
    context.textAlign = "center";
    context.fillText("PROFAILE ATELIER  /  HAUTE DOSSIER", 600, 80);
    context.textAlign = "start";
  } else if (theme === "vibrant") {
    // Pop art dynamic backdrop
    context.globalAlpha = 0.18;
    context.fillStyle = palette.accent;
    context.beginPath(); context.arc(1080, 120, 260, 0, Math.PI * 2); context.fill();
    context.fillStyle = "#FFD166";
    context.beginPath(); context.arc(200, 550, 200, 0, Math.PI * 2); context.fill();
    context.globalAlpha = 1;

    // Candy dots
    context.fillStyle = "#FF4D6D"; context.beginPath(); context.arc(75, 75, 8, 0, Math.PI * 2); context.fill();
    context.fillStyle = "#FFD166"; context.beginPath(); context.arc(98, 75, 8, 0, Math.PI * 2); context.fill();
    context.fillStyle = "#06D6A0"; context.beginPath(); context.arc(121, 75, 8, 0, Math.PI * 2); context.fill();

    context.font = "800 22px Inter, sans-serif";
    context.fillStyle = palette.text;
    context.fillText("CREATIVE PASS  /  " + portfolioName.toUpperCase(), 145, 82);
  } else if (theme === "modern") {
    // Modern gradient mesh
    context.globalAlpha = 0.22;
    context.fillStyle = palette.accent;
    context.beginPath(); context.arc(1060, 90, 340, 0, Math.PI * 2); context.fill();
    context.fillStyle = "#9B51E0";
    context.beginPath(); context.arc(140, 540, 260, 0, Math.PI * 2); context.fill();
    context.globalAlpha = 1;

    // Modern pill badge
    context.fillStyle = palette.accent;
    context.beginPath(); context.arc(76, 75, 6, 0, Math.PI * 2); context.fill();
    context.font = "700 22px Inter, sans-serif";
    context.fillStyle = palette.text;
    context.fillText("VERIFIED CREATOR  /  " + portfolioName.toUpperCase(), 95, 82);
  } else {
    // Minimalist hairline and indicator
    context.globalAlpha = 0.12;
    context.fillStyle = palette.accent;
    context.beginPath(); context.arc(1060, 50, 320, 0, Math.PI * 2); context.fill();
    context.globalAlpha = 1;

    context.fillStyle = palette.accent;
    context.fillRect(72, 60, 48, 5);
    context.font = "600 22px Inter, sans-serif";
    context.fillStyle = palette.muted;
    context.fillText("PROFAILE // ARCHIVE [01] — " + portfolioName.toUpperCase(), 72, 95);
  }

  // Portrait layout
  const portraitX = 72;
  const portraitY = theme === "professional" || theme === "terminal" ? 140 : 130;
  const portraitSize = 160;

  context.save();
  context.beginPath();
  if (theme === "terminal") {
    context.rect(portraitX, portraitY, portraitSize, portraitSize);
  } else if (theme === "elegant") {
    // Arch frame (top rounded, bottom slight radius)
    context.roundRect(portraitX, portraitY, portraitSize, portraitSize, [80, 80, 16, 16]);
  } else if (theme === "modern" || theme === "vibrant") {
    // Squircle / rounded rect
    context.roundRect(portraitX, portraitY, portraitSize, portraitSize, 36);
  } else if (theme === "professional") {
    // Executive rectangular frame
    context.roundRect(portraitX, portraitY, portraitSize, portraitSize, 14);
  } else {
    // Circle
    context.arc(portraitX + portraitSize / 2, portraitY + portraitSize / 2, portraitSize / 2, 0, Math.PI * 2);
  }
  context.clip();

  context.fillStyle = palette.surface;
  context.fillRect(portraitX, portraitY, portraitSize, portraitSize);

  if (personal.photo && personal.photo_visible !== false) {
    try {
      const image = await loadImage(personal.photo);
      const scale = Math.max(portraitSize / image.width, portraitSize / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      context.drawImage(
        image,
        portraitX + (portraitSize - width) / 2,
        portraitY + (portraitSize - height) / 2,
        width,
        height
      );
    } catch {
      context.fillStyle = palette.text;
      context.font = "700 62px Inter, sans-serif";
      context.fillText(personal.name.slice(0, 2).toUpperCase(), portraitX + 38, portraitY + 102);
    }
  } else {
    context.fillStyle = palette.text;
    context.font = "700 62px Inter, sans-serif";
    context.fillText(personal.name.slice(0, 2).toUpperCase(), portraitX + 38, portraitY + 102);
  }
  context.restore();

  // Portrait frame border
  context.strokeStyle = palette.accent;
  context.lineWidth = 4;
  context.stroke();

  // Typography - Name
  context.fillStyle = palette.text;
  if (theme === "professional" || theme === "elegant") {
    context.font = "700 58px Georgia, serif";
  } else if (theme === "terminal" || theme === "neon") {
    context.font = "700 54px ui-monospace, monospace";
  } else {
    context.font = "800 60px Inter, sans-serif";
  }

  const nameLines = lineBreaks(context, personal.name || "Your name", 680, 2);
  nameLines.forEach((line, index) => context.fillText(line, 72, 365 + index * 68));

  // Headline
  context.fillStyle = palette.accent;
  if (theme === "elegant") {
    context.font = "italic 500 32px Georgia, serif";
  } else if (theme === "terminal" || theme === "neon") {
    context.font = "500 28px ui-monospace, monospace";
  } else {
    context.font = "600 30px Inter, sans-serif";
  }

  const headlinePrefix = theme === "terminal" ? "> " : theme === "neon" ? "// " : "";
  const headline = headlinePrefix + (personal.headline || personal.title || "Portfolio");
  const headlineLines = lineBreaks(context, headline, 720, 2);
  headlineLines.forEach((line, index) => context.fillText(line, 72, 455 + index * 42));

  // Role / Subtitle
  context.font = theme === "terminal" ? "500 22px ui-monospace, monospace" : "500 24px Inter, sans-serif";
  context.fillStyle = palette.muted;
  context.fillText(personal.title || "Creator & Builder", 72, 535);

  // Footer URL
  context.font = theme === "terminal" ? "600 24px ui-monospace, monospace" : "600 25px Inter, sans-serif";
  context.fillStyle = palette.text;
  context.fillText(url.replace(/^https?:\/\//, "").slice(0, 52), 72, 610);

  // QR Code Tile
  const qrX = 920;
  const qrY = 380;
  const qrSize = 220;

  context.fillStyle = "#FFFFFF";
  context.beginPath();
  if (theme === "terminal") {
    context.rect(qrX, qrY, qrSize, qrSize);
  } else if (theme === "modern" || theme === "vibrant") {
    context.roundRect(qrX, qrY, qrSize, qrSize, 28);
  } else {
    context.roundRect(qrX, qrY, qrSize, qrSize, 14);
  }
  context.fill();

  context.strokeStyle = palette.accent;
  context.lineWidth = 3;
  context.stroke();

  try {
    const qr = await loadImage(qrDataUrl);
    context.drawImage(qr, qrX + 16, qrY + 16, qrSize - 32, qrSize - 32);
  } catch {
    context.fillStyle = "#111111";
    context.font = "600 20px Inter, sans-serif";
    context.fillText("QR CODE", qrX + 60, qrY + 115);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not export card image"))), "image/png");
  });
}
