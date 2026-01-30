/**
 * Componente raíz de la aplicación.
 *
 * Este componente actúa como "root controller" del proyecto:
 *  - Gestiona el estado global mínimo (login → terminal, menú lateral)
 *  - Orquesta los componentes principales (Header, SideMenu, Terminal, LoginPanel)
 *  - Mantiene la UI desacoplada de la lógica interna (useTerminal)
 *
 * La lógica de negocio NO vive aquí. Este archivo solo coordina.
 * Esto sigue el principio SRP (Single Responsibility Principle - SOLID).
 */

import { useState } from "preact/hooks";

// Componentes principales de la interfaz
import PageHeader from "./components/layout/PageHeader";
import SideMenu from "./components/layout/SideMenu";
import Footer from "./components/layout/Footer";
import MobileBottomBar from "./components/layout/MobileBottomBar";
import Terminal from "./components/terminal/Terminal";
import LoginPanel from "./components/login/LoginPanel";
import MatrixBackground from "./components/background/MatrixBackground";
import TacticalMap from "./components/background/TacticalMap";
import ChatBubble from "./components/chat/ChatBubble";

// HUD y efectos visuales
import TacticalHUD from "./components/hud/TacticalHUD";
import AlertSystem from "./components/hud/AlertSystem";
import CRTEffect from "./components/effects/CRTEffect";

// Hook que encapsula toda la lógica de la terminal
import { useTerminal } from "./core/hooks/useTerminal";

import "./styles/globals.css";

export function App() {
  /**
   * Controla la etapa actual:
   *  - "login": se muestra el panel de autenticación
   *  - "terminal": se muestra la terminal interactiva
   *
   * Esto permite una transición limpia sin mezclar componentes.
   */
  const [stage, setStage] = useState<"login" | "terminal">("login");

  /**
   * Controla la visibilidad del menú lateral.
   * El menú solo aparece en modo terminal.
   */
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Hook que contiene:
   *  - historial de salida
   *  - animación de comandos
   *  - router de comandos
   *  - helpers de impresión
   *
   * La UI nunca conoce la lógica interna de la terminal.
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

      {/* Sistema de alertas — solo visible en modo terminal */}
      {stage === "terminal" && <AlertSystem />}

      {/* Chatbot flotante */}
      <ChatBubble />

      {/* Header visible solo en modo terminal */}
      {stage === "terminal" && (
        <PageHeader
          onMenuToggle={() => {
            setMenuOpen(true);
          }}
          runCommand={terminal.runCommand}
        />
      )}

      {/* Menú lateral (mobile-first) — solo se monta en modo terminal */}
      {stage === "terminal" && (
        <SideMenu
          open={menuOpen}
          onClose={() => {
            setMenuOpen(false);
          }}
          runCommand={(cmd) => {
            setMenuOpen(false); // Cierra el menú antes de ejecutar
            return terminal.runCommand(cmd);
          }}
        />
      )}

      {/* Contenedor principal de contenido */}
      <div class="relative z-10 flex flex-col flex-grow pt-20">
        {/* LOGIN */}
        {stage === "login" && (
          <div class="flex-grow flex items-center justify-center">
            {/* LoginPanel controla su propia animación y llama a onLogin */}
            <LoginPanel
              onLogin={() => {
                setStage("terminal");
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
