"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./PortfolioChat.module.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPalette {
  panel: string;
  header: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accent2: string;
  onAccent: string;
  assistant: string;
  input: string;
  chip: string;
  chipHover: string;
  glow: string;
}

/* --------------------------- color helpers ---------------------------- */

function luminance(color: string): number {
  let hex = color.trim();
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length !== 6) return 0.5;
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  // rgb(...) / rgba(...)
  const m = color.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (m) {
    const r = Number(m[1]) / 255;
    const g = Number(m[2]) / 255;
    const b = Number(m[3]) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  return 0.5;
}

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0");
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${full}${a}`;
}

function buildPalette(bodyBg: string, bodyText: string, accent: string): ChatPalette {
  const isDark = luminance(bodyBg) < 0.5;
  const onAccent = luminance(accent) < 0.55 ? "#ffffff" : "#0b0b0b";
  const text = isDark ? "#ececec" : "#1a1a1a";
  const panel = isDark ? "#18181d" : "#ffffff";
  const header = isDark ? "#1f1f26" : "#fafafa";
  const muted = isDark ? "rgba(236,236,236,0.55)" : "rgba(26,26,26,0.55)";
  const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const assistant = isDark ? "#232329" : "#f4f4f6";
  const input = isDark ? "#121216" : "#f7f7f8";
  const chip = isDark ? "#202027" : "#f4f4f6";
  const chipHover = isDark ? withAlpha(accent, 0.15) : withAlpha(accent, 0.1);
  const glow = isDark ? "rgba(0,0,0,0.5)" : withAlpha(accent, 0.25);

  return {
    panel,
    header,
    text,
    muted,
    border,
    accent,
    accent2: withAlpha(accent, 0.65),
    onAccent,
    assistant,
    input,
    chip,
    chipHover,
    glow,
  };
}

/* ------------------------- mini markdown ------------------------------ */

function renderInline(text: string): React.ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}

function renderContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: number) => {
    if (list.length === 0) return;
    nodes.push(
      <ul key={key}>
        {list.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const bullet = trimmed.match(/^[-•*]\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
    } else {
      flushList(i);
      if (trimmed) nodes.push(<p key={i}>{renderInline(trimmed)}</p>);
    }
  });
  flushList(lines.length);

  return nodes;
}

/* ------------------------------ widget -------------------------------- */

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function PortfolioChat({
  name,
  username,
  accent = "#6366f1",
}: {
  name: string;
  username: string;
  accent?: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [palette, setPalette] = useState<ChatPalette>(() =>
    buildPalette("#ffffff", "#1a1a1a", accent),
  );

  useEffect(() => {
    const cs = getComputedStyle(document.body);
    const bg = cs.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/i.test(cs.backgroundColor)
      ? cs.backgroundColor
      : "#ffffff";
    const text = cs.color || "#1a1a1a";
    setPalette(buildPalette(bg, text, accent));
  }, [accent]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const suggestions = useMemo(() => {
    const first = name?.split(" ")[0] || "them";
    return [
      `What does ${first} do?`,
      `What projects has ${first} built?`,
      `Summarize ${first}'s experience`,
      `What are ${first}'s core skills?`,
    ];
  }, [name]);

  const send = async (raw?: string) => {
    const content = (raw ?? input).trim();
    if (!content || loading) return;

    const userMessage: Message = { id: uid(), role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    const history = messages
      .slice(-6)
      .map((m) => ({ role: m.role === "user" ? "user" : "model", content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, message: content, history }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get a response");
      }
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const cssVars = {
    "--c-panel": palette.panel,
    "--c-header": palette.header,
    "--c-text": palette.text,
    "--c-muted": palette.muted,
    "--c-border": palette.border,
    "--c-accent": palette.accent,
    "--c-accent-2": palette.accent2,
    "--c-on-accent": palette.onAccent,
    "--c-assistant": palette.assistant,
    "--c-input": palette.input,
    "--c-chip": palette.chip,
    "--c-chip-hover": palette.chipHover,
    "--c-glow": palette.glow,
  } as React.CSSProperties;

  const initials = (name || "?").slice(0, 2).toUpperCase();

  return (
    <div className={styles.root} style={cssVars}>
      {open && (
        <div className={styles.panel}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.headerInfo}>
              <div className={styles.headerTitle}>{name}&apos;s AI Assistant</div>
              <div className={styles.headerSub}>
                <span className={styles.liveDot} />
                Ask me anything about {name}
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages} ref={scrollRef}>
            {messages.length === 0 && !loading && (
              <div className={styles.suggestions}>
                <div className={styles.suggestionLabel}>
                  Quick questions about {name.split(" ")[0]}:
                </div>
                {suggestions.map((s) => (
                  <button key={s} className={styles.chip} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`${styles.row} ${m.role === "user" ? styles.rowUser : ""}`}>
                <div
                  className={`${styles.bubble} ${
                    m.role === "user" ? styles.userBubble : styles.assistantBubble
                  }`}
                >
                  {renderContent(m.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className={styles.row}>
                <div className={`${styles.bubble} ${styles.assistantBubble}`}>
                  <div className={styles.typing}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {/* Input */}
          <div className={styles.inputBar}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              placeholder={`Ask about ${name.split(" ")[0]}...`}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              className={styles.sendButton}
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3.4 20.4l17.4-7.5c.8-.34.8-1.46 0-1.8L3.4 3.6c-.65-.28-1.4.22-1.4.93v5.6c0 .5.37.92.86.99L14 12l-11.14.88c-.5.07-.86.5-.86.99v5.6c0 .7.75 1.2 1.4.93z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Launcher */}
      <button
        className={styles.launcher}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2.5c.65 3.9 2.4 5.65 6.3 6.3-3.9.65-5.65 2.4-6.3 6.3-.65-3.9-2.4-5.65-6.3-6.3 3.9-.65 5.65-2.4 6.3-6.3Z" />
            <path d="M18.5 13.5c.4 2.4 1.5 3.5 3.9 3.9-2.4.4-3.5 1.5-3.9 3.9-.4-2.4-1.5-3.5-3.9-3.9 2.4-.4 3.5-1.5 3.9-3.9Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
