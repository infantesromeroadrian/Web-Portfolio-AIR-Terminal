/**
 * Cursor glow follower — subtle radial gradient that tracks the mouse.
 * Desktop only (hidden on mobile via CSS). GPU-accelerated via will-change.
 */

import { useEffect, useRef } from "preact/hooks";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let animId: number;

    const handleMove = (e: MouseEvent): void => {
      targetX = e.clientX - 150;
      targetY = e.clientY - 150;
    };

    // Smooth lerp for fluid movement
    const animate = (): void => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      el.style.transform = `translate(${x}px, ${y}px)`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <div ref={glowRef} class="cursor-glow" aria-hidden="true" />;
}
