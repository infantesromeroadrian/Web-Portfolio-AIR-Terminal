/**
 * Componente raíz de la aplicación.
 *
 * Este componente actúa como "root controller" del proyecto:
 *  - Gestiona el estado global mínimo (login → terminal)
 *  - Orquesta los componentes principales (Header, Terminal, LoginPanel)
 *  - Mantiene la UI desacoplada de la lógica interna (useTerminal)
 *
 * La lógica de negocio NO vive aquí. Este archivo solo coordina.
 */

import { useState } from "preact/hooks";

// Componentes principales de la interfaz
import PageHeader from "./components/layout/PageHeader";
import Footer from "./components/layout/Footer";
import MobileBottomBar from "./components/layout/MobileBottomBar";
import Terminal from "./components/terminal/Terminal";
import LoginPanel from "./components/login/LoginPanel";
import MatrixBackground from "./components/background/MatrixBackground";
import TacticalMap from "./components/background/TacticalMap";
import ChatBubble from "./components/chat/ChatBubble";

// HUD y efectos visuales
import TacticalHUD from "./components/hud/TacticalHUD";
import CRTEffect from "./components/effects/CRTEffect";

// Hook que encapsula toda la lógica de la terminal
import { useTerminal } from "./core/hooks/useTerminal";

import "./styles/globals.css";

export function App() {
  /**
   * Controla la etapa actual:
   *  - "login": se muestra el personaje caminando + intro
   *  - "terminal": se muestra la terminal interactiva
   */
  const [stage, setStage] = useState<"login" | "terminal">("login");

  /**
   * Hook que contiene:
   *  - historial de salida
   *  - animación de comandos
   *  - router de comandos
   *  - helpers de impresión
   */
  const terminal = useTerminal();

  return (
    <div class="relative min-h-screen flex flex-col">
      {/* Capa 1: Mapa táctico de fondo */}
      <TacticalMap />
      {/* Capa 2: Matrix Rain encima */}
      <MatrixBackground />
      {/* Capa 3: Efecto CRT (scanlines, vignette) */}
      <CRTEffect />

      {/* HUD Táctico — solo visible en modo terminal */}
      {stage === "terminal" && <TacticalHUD />}

      {/* Chatbot flotante */}
      <ChatBubble />

      {/* Header visible solo en modo terminal */}
      {stage === "terminal" && <PageHeader runCommand={terminal.runCommand} />}

      {/* Contenedor principal de contenido */}
      <div class="relative z-10 flex flex-col flex-grow pt-20">
        {/* LOGIN / INTRO */}
        {stage === "login" && (
          <div class="flex-grow flex items-center justify-center">
            <LoginPanel
              onLogin={() => {
                setStage("terminal");
                // Ejecutar whoami automáticamente después de un breve delay
                setTimeout(() => {
                  void terminal.runCommand("whoami");
                }, 300);
              }}
            />
          </div>
        )}

        {/* TERMINAL */}
        {stage === "terminal" && (
          <div class="flex-grow flex items-start justify-center">
            <Terminal terminal={terminal} />
          </div>
        )}

        {/* Footer fijo al final en modo terminal */}
        {stage === "terminal" && <Footer />}
      </div>

      {/* Barra inferior móvil — solo visible en modo terminal y pantallas pequeñas */}
      {stage === "terminal" && <MobileBottomBar runCommand={terminal.runCommand} />}
    </div>
  );
}
