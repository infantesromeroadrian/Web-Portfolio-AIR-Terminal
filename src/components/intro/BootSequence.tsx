/**
 * Secuencia de arranque tipo BIOS.
 *
 * Simula un boot de sistema con:
 *  - Efecto typing línea por línea
 *  - Checks de sistema (RAM, CPU, modules)
 *  - ASCII art del logo
 *  - Transición automática al login
 */

import { useState, useEffect } from "preact/hooks";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "AIR BIOS v2.0.26 — Neural Security Systems", delay: 0, style: "title" },
  { text: "Copyright (C) 2026 Adrian Infantes Research", delay: 100, style: "dim" },
  { text: "", delay: 200, style: "normal" },
  { text: "Initializing hardware...", delay: 300, style: "normal" },
  { text: "CPU: Neural Processing Unit @ 4.2 GHz .............. [OK]", delay: 500, style: "check" },
  { text: "RAM: 128 GB DDR5 Secure Memory .................... [OK]", delay: 700, style: "check" },
  { text: "GPU: NVIDIA RTX 6090 Tensor Cores ................. [OK]", delay: 900, style: "check" },
  { text: "TPM: Hardware Security Module v2.0 ................ [OK]", delay: 1100, style: "check" },
  { text: "", delay: 1200, style: "normal" },
  { text: "Loading security modules...", delay: 1300, style: "normal" },
  {
    text: "  ├─ threat_detection.ko .......................... [LOADED]",
    delay: 1500,
    style: "module",
  },
  {
    text: "  ├─ prompt_guardian.ko ........................... [LOADED]",
    delay: 1650,
    style: "module",
  },
  {
    text: "  ├─ llm_firewall.ko .............................. [LOADED]",
    delay: 1800,
    style: "module",
  },
  {
    text: "  ├─ anomaly_detector.ko .......................... [LOADED]",
    delay: 1950,
    style: "module",
  },
  {
    text: "  └─ neural_rain.ko ............................... [LOADED]",
    delay: 2100,
    style: "module",
  },
  { text: "", delay: 2200, style: "normal" },
  { text: "Establishing secure connection...", delay: 2300, style: "normal" },
  {
    text: "  Encryption: AES-256-GCM ......................... [ACTIVE]",
    delay: 2450,
    style: "secure",
  },
  {
    text: "  Protocol: TLS 1.3 ............................... [ACTIVE]",
    delay: 2600,
    style: "secure",
  },
  {
    text: "  Firewall: AI-Enhanced ........................... [ACTIVE]",
    delay: 2750,
    style: "secure",
  },
  { text: "", delay: 2850, style: "normal" },
  { text: "All systems operational. Launching interface...", delay: 3000, style: "success" },
  { text: "", delay: 3200, style: "normal" },
];

const ASCII_LOGO = `
    █████╗ ██╗██████╗     ███████╗███████╗ ██████╗
   ██╔══██╗██║██╔══██╗    ██╔════╝██╔════╝██╔════╝
   ███████║██║██████╔╝    ███████╗█████╗  ██║     
   ██╔══██║██║██╔══██╗    ╚════██║██╔══╝  ██║     
   ██║  ██║██║██║  ██║    ███████║███████╗╚██████╗
   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝    ╚══════╝╚══════╝ ╚═════╝
`;

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Mostrar líneas progresivamente
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
      timers.push(timer);
    });

    // Mostrar logo después de las líneas
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 3300);
    timers.push(logoTimer);

    // Fade out y completar
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4200);
    timers.push(fadeTimer);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4800);
    timers.push(completeTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const getLineStyle = (style: string): string => {
    switch (style) {
      case "title":
        return "text-[var(--coral-bright)] font-bold text-lg";
      case "dim":
        return "text-[var(--text-muted)] text-sm";
      case "check":
        return "text-[var(--text-secondary)]";
      case "module":
        return "text-[var(--cyan-bright)]";
      case "secure":
        return "text-[var(--blue-bright)]";
      case "success":
        return "text-[var(--green-bright)] font-bold";
      default:
        return "text-[var(--text-primary)]";
    }
  };

  return (
    <div
      class={`fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div class="max-w-3xl w-full px-6 font-mono text-sm">
        {/* Líneas de boot */}
        <div class="space-y-1">
          {BOOT_LINES.slice(0, visibleLines).map((line, index) => (
            <div
              key={index}
              class={`${getLineStyle(line.style)} animate-fade-in`}
              style={{ animationDelay: `${index * 20}ms` }}
            >
              {line.text.includes("[OK]") ? (
                <>
                  {line.text.replace("[OK]", "")}
                  <span class="text-[var(--green-bright)]">[OK]</span>
                </>
              ) : line.text.includes("[LOADED]") ? (
                <>
                  {line.text.replace("[LOADED]", "")}
                  <span class="text-[var(--cyan-bright)]">[LOADED]</span>
                </>
              ) : line.text.includes("[ACTIVE]") ? (
                <>
                  {line.text.replace("[ACTIVE]", "")}
                  <span class="text-[var(--blue-bright)]">[ACTIVE]</span>
                </>
              ) : (
                line.text
              )}
              {/* Cursor parpadeante en la última línea */}
              {index === visibleLines - 1 && !showLogo && (
                <span class="inline-block w-2 h-4 bg-[var(--coral-bright)] ml-1 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* ASCII Logo */}
        {showLogo && (
          <pre
            class={`text-[var(--coral-bright)] text-xs sm:text-sm mt-6 text-center animate-fade-in ${
              fadeOut ? "animate-pulse" : ""
            }`}
          >
            {ASCII_LOGO}
          </pre>
        )}

        {/* Barra de progreso */}
        <div class="mt-8 h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-[var(--coral-bright)] to-[var(--cyan-bright)] transition-all duration-300 ease-out"
            style={{
              width: `${Math.min((visibleLines / BOOT_LINES.length) * 100, 100)}%`,
            }}
          />
        </div>

        {/* Skip hint */}
        <p class="text-center text-[var(--text-muted)] text-xs mt-4 animate-pulse">
          Press any key to skip...
        </p>
      </div>
    </div>
  );
}
