/**
 * HUD Táctico - Elementos estilo centro de operaciones de ciberseguridad.
 *
 * Incluye:
 *  - Radar scanner giratorio
 *  - Contadores en tiempo real (uptime, threats, packets)
 *  - Indicadores de status del sistema
 *  - Coordenadas y timestamp
 *
 * Diseño: Esquinas de pantalla, no interfiere con contenido central.
 */

import { useEffect, useState, useRef } from "preact/hooks";

// ============================================================================
// RADAR SCANNER
// ============================================================================

function RadarScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;

    // Non-null alias para uso en closures
    const ctx = ctxRaw;
    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 10;

    let angle = 0;
    let animId: number;

    // Puntos de "amenazas" detectadas (posiciones aleatorias)
    const threats = Array.from({ length: 5 }, () => ({
      x: center + (Math.random() - 0.5) * radius * 1.6,
      y: center + (Math.random() - 0.5) * radius * 1.6,
      pulse: Math.random() * Math.PI * 2,
      active: Math.random() > 0.3,
    }));

    function draw(): void {
      ctx.clearRect(0, 0, size, size);

      // Círculos concéntricos
      ctx.strokeStyle = "rgba(37, 99, 235, 0.3)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(center, center, (radius / 3) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Cruz central
      ctx.strokeStyle = "rgba(37, 99, 235, 0.2)";
      ctx.beginPath();
      ctx.moveTo(center, center - radius);
      ctx.lineTo(center, center + radius);
      ctx.moveTo(center - radius, center);
      ctx.lineTo(center + radius, center);
      ctx.stroke();

      // Línea de escaneo con gradiente cónico
      const gradient = ctx.createConicGradient(angle, center, center);
      gradient.addColorStop(0, "rgba(34, 211, 238, 0.8)");
      gradient.addColorStop(0.1, "rgba(34, 211, 238, 0.3)");
      gradient.addColorStop(0.2, "rgba(34, 211, 238, 0)");
      gradient.addColorStop(1, "rgba(34, 211, 238, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle - 0.5, angle);
      ctx.closePath();
      ctx.fill();

      // Línea principal del scanner
      ctx.strokeStyle = "rgba(34, 211, 238, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + Math.cos(angle) * radius, center + Math.sin(angle) * radius);
      ctx.stroke();

      // Puntos de amenazas
      threats.forEach((threat) => {
        if (!threat.active) return;

        const dist = Math.sqrt(Math.pow(threat.x - center, 2) + Math.pow(threat.y - center, 2));
        if (dist > radius) return;

        threat.pulse += 0.1;
        const pulseSize = 3 + Math.sin(threat.pulse) * 2;

        // Glow
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.beginPath();
        ctx.arc(threat.x, threat.y, pulseSize + 4, 0, Math.PI * 2);
        ctx.fill();

        // Punto central
        ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
        ctx.beginPath();
        ctx.arc(threat.x, threat.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Centro del radar
      ctx.fillStyle = "rgba(34, 211, 238, 0.8)";
      ctx.beginPath();
      ctx.arc(center, center, 4, 0, Math.PI * 2);
      ctx.fill();

      angle += 0.03;
      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div class="relative">
      <canvas ref={canvasRef} width={120} height={120} class="opacity-80" />
      <div class="absolute -bottom-1 left-0 right-0 text-center text-[10px] text-cyan-400/70 font-mono">
        RADAR SCAN
      </div>
    </div>
  );
}

// ============================================================================
// CONTADORES EN TIEMPO REAL
// ============================================================================

function LiveCounters() {
  const [uptime, setUptime] = useState(0);
  const [threats, setThreats] = useState(0);
  const [packets, setPackets] = useState(0);

  useEffect(() => {
    // Uptime counter (segundos desde carga)
    const uptimeInterval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);

    // Threats blocked (incremento aleatorio)
    const threatInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setThreats((prev) => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 2000);

    // Packets scanned (incremento constante)
    const packetInterval = setInterval(() => {
      setPackets((prev) => prev + Math.floor(Math.random() * 500) + 100);
    }, 100);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(threatInterval);
      clearInterval(packetInterval);
    };
  }, []);

  const formatUptime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatNumber = (n: number): string => {
    if (n >= 1000000) return (n / 1000000).toFixed(2) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <div class="font-mono text-xs space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-green-400">●</span>
        <span class="text-gray-500">UPTIME:</span>
        <span class="text-green-400 tabular-nums">{formatUptime(uptime)}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-red-400 animate-pulse">●</span>
        <span class="text-gray-500">THREATS:</span>
        <span class="text-red-400 tabular-nums">{threats}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-cyan-400">●</span>
        <span class="text-gray-500">PACKETS:</span>
        <span class="text-cyan-400 tabular-nums">{formatNumber(packets)}</span>
      </div>
    </div>
  );
}

// ============================================================================
// STATUS BARS
// ============================================================================

function StatusBars() {
  const [cpu, setCpu] = useState(23);
  const [mem, setMem] = useState(45);
  const [net, setNet] = useState(67);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(20 + Math.random() * 30);
      setMem(40 + Math.random() * 20);
      setNet(50 + Math.random() * 40);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div class="space-y-2 w-24">
      {/* CPU */}
      <div class="space-y-1">
        <div class="flex justify-between text-[10px] font-mono">
          <span class="text-gray-500">CPU</span>
          <span class="text-green-400">{cpu.toFixed(0)}%</span>
        </div>
        <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-500 bg-green-400"
            style={{ width: `${cpu}%` }}
          />
        </div>
      </div>
      {/* MEM */}
      <div class="space-y-1">
        <div class="flex justify-between text-[10px] font-mono">
          <span class="text-gray-500">MEM</span>
          <span class="text-blue-400">{mem.toFixed(0)}%</span>
        </div>
        <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-500 bg-blue-400"
            style={{ width: `${mem}%` }}
          />
        </div>
      </div>
      {/* NET */}
      <div class="space-y-1">
        <div class="flex justify-between text-[10px] font-mono">
          <span class="text-gray-500">NET</span>
          <span class="text-cyan-400">{net.toFixed(0)}%</span>
        </div>
        <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-500 bg-cyan-400"
            style={{ width: `${net}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COORDENADAS Y TIMESTAMP
// ============================================================================

function CoordinatesDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (d: Date): string => {
    return (
      d.toLocaleTimeString("en-US", { hour12: false }) +
      "." +
      d.getMilliseconds().toString().padStart(3, "0")
    );
  };

  return (
    <div class="font-mono text-[10px] text-gray-500 space-y-1">
      <div>
        <span class="text-cyan-400/70">LAT:</span> 40.4168°N
      </div>
      <div>
        <span class="text-cyan-400/70">LON:</span> 3.7038°W
      </div>
      <div>
        <span class="text-cyan-400/70">UTC:</span>{" "}
        <span class="text-green-400/70 tabular-nums">{formatTime(time)}</span>
      </div>
    </div>
  );
}

// ============================================================================
// TARGETING CORNERS
// ============================================================================

function TargetingCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const corners = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };

  return (
    <div class={`absolute ${corners[position]} w-8 h-8 border-cyan-500/30 pointer-events-none`} />
  );
}

// ============================================================================
// MAIN HUD COMPONENT
// ============================================================================

export default function TacticalHUD() {
  return (
    <div class="fixed inset-0 pointer-events-none z-10 p-4">
      {/* Esquinas de targeting */}
      <TargetingCorner position="tl" />
      <TargetingCorner position="tr" />
      <TargetingCorner position="bl" />
      <TargetingCorner position="br" />

      {/* Top-left: Radar */}
      <div class="absolute top-4 left-4 hidden lg:block">
        <RadarScanner />
      </div>

      {/* Top-right: Contadores */}
      <div class="absolute top-4 right-4 hidden lg:block">
        <LiveCounters />
      </div>

      {/* Bottom-left: Coordenadas */}
      <div class="absolute bottom-28 left-4 hidden lg:block">
        <CoordinatesDisplay />
      </div>

      {/* Bottom-right: Status bars */}
      <div class="absolute bottom-28 right-4 hidden lg:block">
        <StatusBars />
      </div>

      {/* Mobile: Mini status en top */}
      <div class="lg:hidden absolute top-2 right-2 flex items-center gap-3 text-[10px] font-mono">
        <span class="text-green-400">● SYS OK</span>
        <span class="text-cyan-400/70 tabular-nums">
          {new Date().toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>
    </div>
  );
}
