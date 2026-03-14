"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rx = 0,
      ry = 0;
    const move = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (dot.current) {
        dot.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }
      rx += (x - rx) * 0.12;
      ry += (y - ry) * 0.12;
    };
    const tick = () => {
      if (ring.current) {
        ring.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      }
      requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move);
    tick();
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#C4622D] z-[9999] pointer-events-none"
        style={{ transition: "transform 0.05s linear" }}
      />
      <div
        ref={ring}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#C4622D]/50 z-[9999] pointer-events-none"
        style={{ transition: "transform 0.08s linear" }}
      />
    </>
  );
}
