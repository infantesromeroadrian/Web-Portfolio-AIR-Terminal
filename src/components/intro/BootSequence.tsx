/**
 * Secuencia de arranque tipo BIOS con efecto de typing real.
 *
 * - Caracteres aparecen uno a uno (velocidad variable por tipo de línea)
 * - Tags de estado ([OK], [LOADED], [ACTIVE]) resaltan en color
 * - Barra de progreso sincronizada con glow
 * - Skip disponible con cualquier tecla (completa instantáneamente)
 * - Logo ASCII con GSAP entrance (scale + opacity)
 * - Transición de salida con GSAP (scale + brightness + fade)
 */

import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import gsap from "gsap";

interface BootSequenceProps {
  onComplete: () => void;
}

interface BootLine {
  text: string;
  style: string;
  charDelay: number;
  pauseAfter: number;
}

const BOOT_LINES: BootLine[] = [
  {
    text: "AIR BIOS v2.0.26 — Neural Security Systems",
    style: "title",
    charDelay: 14,
    pauseAfter: 300,
  },
  { text: "", style: "spacer", charDelay: 0, pauseAfter: 100 },
  { text: "Initializing hardware...", style: "normal", charDelay: 10, pauseAfter: 400 },
  {
    text: "CPU: Neural Processing Unit @ 4.2 GHz .............. [OK]",
    style: "check",
    charDelay: 3,
    pauseAfter: 80,
  },
  {
    text: "RAM: 128 GB DDR5 Secure Memory .................... [OK]",
    style: "check",
    charDelay: 3,
    pauseAfter: 80,
  },
  {
    text: "GPU: NVIDIA RTX 6090 Tensor Cores ................. [OK]",
    style: "check",
    charDelay: 3,
    pauseAfter: 80,
  },
  {
    text: "TPM: Hardware Security Module v2.0 ................ [OK]",
    style: "check",
    charDelay: 3,
    pauseAfter: 120,
  },
  { text: "", style: "spacer", charDelay: 0, pauseAfter: 100 },
  { text: "Loading security modules...", style: "normal", charDelay: 10, pauseAfter: 300 },
  {
    text: "  ├─ threat_detection.ko .......................... [LOADED]",
    style: "module",
    charDelay: 4,
    pauseAfter: 60,
  },
  {
    text: "  ├─ prompt_guardian.ko ........................... [LOADED]",
    style: "module",
    charDelay: 4,
    pauseAfter: 60,
  },
  {
    text: "  ├─ llm_firewall.ko .............................. [LOADED]",
    style: "module",
    charDelay: 4,
    pauseAfter: 60,
  },
  {
    text: "  ├─ anomaly_detector.ko .......................... [LOADED]",
    style: "module",
    charDelay: 4,
    pauseAfter: 60,
  },
  {
    text: "  └─ neural_rain.ko ............................... [LOADED]",
    style: "module",
    charDelay: 4,
    pauseAfter: 120,
  },
  { text: "", style: "spacer", charDelay: 0, pauseAfter: 100 },
  { text: "Establishing secure connection...", style: "normal", charDelay: 10, pauseAfter: 200 },
  {
    text: "  Encryption: AES-256-GCM ......................... [ACTIVE]",
    style: "secure",
    charDelay: 3,
    pauseAfter: 60,
  },
  {
    text: "  Protocol: TLS 1.3 ............................... [ACTIVE]",
    style: "secure",
    charDelay: 3,
    pauseAfter: 60,
  },
  {
    text: "  Firewall: AI-Enhanced ........................... [ACTIVE]",
    style: "secure",
    charDelay: 3,
    pauseAfter: 120,
  },
  { text: "", style: "spacer", charDelay: 0, pauseAfter: 100 },
  {
    text: "All systems operational. Launching interface...",
    style: "success",
    charDelay: 12,
    pauseAfter: 400,
  },
];

const ASCII_LOGO = `
    █████╗ ██╗██████╗     ███████╗███████╗ ██████╗
   ██╔══██╗██║██╔══██╗    ██╔════╝██╔════╝██╔════╝
   ███████║██║██████╔╝    ███████╗█████╗  ██║
   ██╔══██║██║██╔══██╗    ╚════██║██╔══╝  ██║
   ██║  ██║██║██║  ██║    ███████║███████╗╚██████╗
   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝    ╚══════╝╚══════╝ ╚═════╝
`;

function getLineClasses(style: string): string {
  switch (style) {
    case "title":
      return "text-[var(--coral-bright)] font-bold text-lg";
    case "check":
      return "text-[var(--text-secondary)]";
    case "module":
      return "text-[var(--cyan-bright)]";
    case "secure":
      return "text-[var(--blue-soft)]";
    case "success":
      return "text-[var(--cyan-bright)] font-bold";
    case "spacer":
      return "h-3";
    default:
      return "text-[var(--text-primary)]";
  }
}

function renderText(text: string) {
  const tagMatch = /\[(OK|LOADED|ACTIVE)\]$/.exec(text);
  if (!tagMatch) return <>{text}</>;

  const base = text.slice(0, text.lastIndexOf("["));
  const tag = tagMatch[0];
  const color =
    tag === "[OK]"
      ? "var(--success)"
      : tag === "[LOADED]"
        ? "var(--cyan-bright)"
        : "var(--blue-soft)";

  return (
    <>
      {base}
      <span style={{ color }} class="font-semibold">
        {tag}
      </span>
    </>
  );
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLPreElement>(null);
  const skipRef = useRef({ value: false });
  const timeoutsRef = useRef<number[]>([]);
  const pendingResolvesRef = useRef<(() => void)[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [lines, setLines] = useState<{ text: string; style: string }[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const [progress, setProgress] = useState(0);

  const sleep = useCallback(
    (ms: number): Promise<void> =>
      new Promise((resolve) => {
        if (skipRef.current.value) {
          resolve();
          return;
        }
        const id = window.setTimeout(resolve, ms);
        timeoutsRef.current.push(id);
        pendingResolvesRef.current.push(resolve);
      }),
    []
  );

  useEffect(() => {
    const state = { cancelled: false };
    setLines([]);
    setShowLogo(false);
    setProgress(0);

    void (async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (state.cancelled) return;
        const line = BOOT_LINES[i];

        setProgress(((i + 1) / BOOT_LINES.length) * 100);

        if (line.text === "") {
          setLines((prev) => [...prev, { text: "\u00A0", style: line.style }]);
          await sleep(line.pauseAfter);
          continue;
        }

        setLines((prev) => [...prev, { text: "", style: line.style }]);

        for (let c = 1; c <= line.text.length; c++) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- mutated async by skip handler
          if (state.cancelled || skipRef.current.value) break;
          const partial = line.text.slice(0, c);
          setLines((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { text: partial, style: line.style };
            return copy;
          });
          await sleep(line.charDelay);
        }

        setLines((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { text: line.text, style: line.style };
          return copy;
        });

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- mutated async by skip handler
        await sleep(skipRef.current.value ? 8 : line.pauseAfter);
      }

      if (state.cancelled) return;

      setShowLogo(true);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- mutated async by skip handler
      await sleep(skipRef.current.value ? 150 : 800);

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- mutated async in cleanup
      if (state.cancelled) return;

      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.02,
          filter: "brightness(1.5)",
          duration: skipRef.current.value ? 0.25 : 0.6,
          ease: "power2.in",
          onComplete: () => {
            if (!state.cancelled) onCompleteRef.current();
          },
        });
      } else {
        onCompleteRef.current();
      }
    })();

    return () => {
      state.cancelled = true;
      for (const id of timeoutsRef.current) clearTimeout(id);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- runs once on mount

  useEffect(() => {
    if (showLogo && logoRef.current) {
      gsap.from(logoRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 10,
        duration: 0.6,
        ease: "back.out(1.4)",
      });
    }
  }, [showLogo]);

  useEffect(() => {
    const handleSkip = () => {
      if (!skipRef.current.value) {
        skipRef.current.value = true;
        for (const id of timeoutsRef.current) clearTimeout(id);
        timeoutsRef.current = [];
        // Resolve all pending sleep promises so the async loop continues
        for (const resolve of pendingResolvesRef.current) resolve();
        pendingResolvesRef.current = [];
      }
    };

    window.addEventListener("keydown", handleSkip);
    window.addEventListener("click", handleSkip);

    return () => {
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      class="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
    >
      <div class="max-w-3xl w-full px-6 font-mono text-sm">
        <div class="space-y-0.5">
          {lines.map((line, idx) => (
            <div key={idx} class={getLineClasses(line.style)}>
              {line.style === "spacer" ? null : renderText(line.text)}
              {idx === lines.length - 1 && !showLogo && line.style !== "spacer" && (
                <span
                  class="inline-block w-2 h-4 bg-[var(--coral-bright)] ml-0.5 align-text-bottom"
                  style="animation:cursor-blink 0.6s steps(1) infinite"
                />
              )}
            </div>
          ))}
        </div>

        {showLogo && (
          <pre ref={logoRef} class="text-[var(--coral-bright)] text-xs sm:text-sm mt-6 text-center">
            {ASCII_LOGO}
          </pre>
        )}

        <div class="mt-8 h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-200 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--coral-bright), var(--cyan-bright))",
              boxShadow: "0 0 12px var(--coral-bright), 0 0 4px var(--cyan-bright)",
            }}
          />
        </div>

        <p class="text-center text-[var(--text-muted)] text-xs mt-4 animate-pulse">
          Press any key to skip...
        </p>
      </div>
    </div>
  );
}
