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
    // Flicker aleatorio cada 3-8 segundos
    const triggerFlicker = (): void => {
      setFlicker(true);
      setTimeout(
        () => {
          setFlicker(false);
        },
        50 + Math.random() * 100
      );

      // Programar siguiente flicker
      const nextFlicker = 3000 + Math.random() * 5000;
      setTimeout(triggerFlicker, nextFlicker);
    };

    const initialDelay = setTimeout(triggerFlicker, 2000);
    return () => {
      clearTimeout(initialDelay);
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
          opacity: 0.4,
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
            rgba(0, 0, 0, 0.4) 100%
          )`,
        }}
      />

      {/* Flicker overlay */}
      {flicker && <div class="absolute inset-0 bg-white" style={{ opacity: 0.03 }} />}

      {/* Glow en bordes - efecto CRT */}
      <div
        class="absolute inset-0"
        style={{
          boxShadow: `
            inset 0 0 100px rgba(37, 99, 235, 0.05),
            inset 0 0 50px rgba(0, 0, 0, 0.3)
          `,
        }}
      />
    </div>
  );
}
