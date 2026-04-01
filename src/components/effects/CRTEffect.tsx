/**
 * Efecto CRT - Overlay de pantalla retro con scanlines y flicker.
 *
 * Características:
 *  - Scanlines horizontales sutiles
 *  - Efecto de curvatura en bordes (vignette)
 *  - Flicker aleatorio muy sutil
 *  - RGB shift en hover (opcional)
 *
 * Performance: CSS puro, sin JavaScript en render loop.
 */

import { useEffect, useState } from "preact/hooks";

export default function CRTEffect() {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    // Track all pending timeouts so cleanup can cancel them all
    const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];

    const track = (id: ReturnType<typeof setTimeout>): void => {
      pendingTimeouts.push(id);
    };

    // Flicker aleatorio cada 3-8 segundos
    const triggerFlicker = (): void => {
      setFlicker(true);
      track(
        setTimeout(
          () => {
            setFlicker(false);
          },
          50 + Math.random() * 100
        )
      );

      // Programar siguiente flicker
      const nextFlicker = 3000 + Math.random() * 5000;
      track(setTimeout(triggerFlicker, nextFlicker));
    };

    track(setTimeout(triggerFlicker, 2000));

    return () => {
      for (const id of pendingTimeouts) clearTimeout(id);
    };
  }, []);

  return (
    <div class="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {/* Scanlines */}
      <div
        class="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 3px
          )`,
          opacity: 0.30,
        }}
      />

      {/* Vignette - bordes oscuros */}
      <div
        class="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 60%,
            rgba(0, 0, 0, 0.25) 100%
          )`,
        }}
      />

      {/* Flicker overlay */}
      {flicker && (
        <div
          class="absolute inset-0"
          style={{
            opacity: 0.07,
            background: "linear-gradient(180deg, rgba(0,229,204,0.04), rgba(255,255,255,0.9), rgba(255,77,77,0.03))",
          }}
        />
      )}

      {/* Glow en bordes - efecto CRT */}
      <div
        class="absolute inset-0"
        style={{
          boxShadow: `
            inset 0 0 100px rgba(37, 99, 235, 0.03),
            inset 0 0 50px rgba(0, 0, 0, 0.18)
          `,
        }}
      />
    </div>
  );
}
