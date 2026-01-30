/**
 * Sistema de Alertas Vivas - Notificaciones estilo sistema de seguridad.
 *
 * Genera alertas periódicas que aparecen y desaparecen:
 *  - Threats detected/blocked
 *  - System scans
 *  - Connection logs
 *  - Security events
 *
 * Diseño: Aparecen en esquina, se apilan, y desaparecen con animación.
 */

import { useEffect, useState } from "preact/hooks";

interface Alert {
  id: number;
  type: "threat" | "info" | "success" | "warning";
  message: string;
  timestamp: string;
}

const ALERT_TEMPLATES = {
  threat: [
    "SQL Injection attempt blocked from {ip}",
    "Brute force attack mitigated: {n} attempts",
    "Suspicious payload detected and quarantined",
    "XSS attempt blocked on /api/contact",
    "Rate limit exceeded from {ip}",
    "Malformed request rejected: {protocol}",
  ],
  info: [
    "New connection from {country}",
    "TLS handshake completed: {cipher}",
    "Session initialized: {session}",
    "API request processed in {ms}ms",
    "Cache refreshed: {n} entries",
  ],
  success: [
    "Security scan complete: 0 vulnerabilities",
    "Firewall rules updated successfully",
    "Certificate renewed: valid for 90 days",
    "Backup completed: {size}MB",
    "All systems operational",
  ],
  warning: [
    "High traffic detected: {n} req/min",
    "Memory usage: {n}% - monitoring",
    "Unusual pattern from {ip}",
    "Slow response time: {ms}ms",
  ],
};

const COUNTRIES = [
  "United States",
  "Germany",
  "Japan",
  "Brazil",
  "Australia",
  "Canada",
  "UK",
  "France",
  "Spain",
  "Netherlands",
];
const CIPHERS = [
  "TLS_AES_256_GCM_SHA384",
  "TLS_CHACHA20_POLY1305_SHA256",
  "ECDHE-RSA-AES256-GCM-SHA384",
];
const PROTOCOLS = ["HTTP/2", "HTTP/3", "WebSocket", "gRPC"];

function generateIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function fillTemplate(template: string): string {
  return template
    .replace("{ip}", generateIP())
    .replace("{n}", String(Math.floor(Math.random() * 500) + 10))
    .replace("{ms}", String(Math.floor(Math.random() * 200) + 50))
    .replace("{size}", String(Math.floor(Math.random() * 500) + 100))
    .replace("{country}", COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)])
    .replace("{cipher}", CIPHERS[Math.floor(Math.random() * CIPHERS.length)])
    .replace("{protocol}", PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)])
    .replace("{session}", generateSessionId());
}

function generateAlert(): Omit<Alert, "id"> {
  const types: Alert["type"][] = ["threat", "info", "success", "warning"];
  const weights = [0.15, 0.5, 0.25, 0.1]; // Probabilidades

  let type: Alert["type"] = "info";
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < types.length; i++) {
    cumulative += weights[i];
    if (rand <= cumulative) {
      type = types[i];
      break;
    }
  }

  const templates = ALERT_TEMPLATES[type];
  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    type,
    message: fillTemplate(template),
    timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
  };
}

const TYPE_STYLES = {
  threat: {
    bg: "bg-red-950/80",
    border: "border-red-500/50",
    icon: "⚠",
    label: "THREAT",
    labelColor: "text-red-400",
  },
  info: {
    bg: "bg-blue-950/80",
    border: "border-blue-500/50",
    icon: "ℹ",
    label: "INFO",
    labelColor: "text-blue-400",
  },
  success: {
    bg: "bg-green-950/80",
    border: "border-green-500/50",
    icon: "✓",
    label: "OK",
    labelColor: "text-green-400",
  },
  warning: {
    bg: "bg-yellow-950/80",
    border: "border-yellow-500/50",
    icon: "⚡",
    label: "WARN",
    labelColor: "text-yellow-400",
  },
};

export default function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    // Generar alerta cada 4-10 segundos
    const scheduleAlert = (): void => {
      const alertData = generateAlert();
      const newAlert: Alert = { ...alertData, id: nextId };

      setAlerts((prev) => [...prev.slice(-4), newAlert]); // Máximo 5 alertas
      setNextId((prev) => prev + 1);

      // Remover alerta después de 6 segundos
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== newAlert.id));
      }, 6000);

      // Programar siguiente alerta
      const nextDelay = 4000 + Math.random() * 6000;
      setTimeout(scheduleAlert, nextDelay);
    };

    // Primera alerta después de 3 segundos
    const initialTimeout = setTimeout(scheduleAlert, 3000);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, [nextId]);

  return (
    <div class="fixed top-16 left-4 z-40 space-y-2 max-w-sm hidden lg:block">
      {alerts.map((alert) => {
        const style = TYPE_STYLES[alert.type];
        return (
          <div
            key={alert.id}
            class={`${style.bg} ${style.border} border rounded px-3 py-2 font-mono text-xs backdrop-blur-sm animate-slide-up`}
            style={{
              animation: "slide-up 0.3s ease-out",
            }}
          >
            <div class="flex items-center gap-2 mb-1">
              <span class={style.labelColor}>{style.icon}</span>
              <span class={`${style.labelColor} font-bold`}>[{style.label}]</span>
              <span class="text-gray-500 ml-auto tabular-nums">{alert.timestamp}</span>
            </div>
            <div class="text-gray-300 leading-tight">{alert.message}</div>
          </div>
        );
      })}
    </div>
  );
}
