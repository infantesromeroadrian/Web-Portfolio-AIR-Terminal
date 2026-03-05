/**
 * Componente raíz de la aplicación.
 *
 * Este componente actúa como "root controller" del proyecto:
 *  - Gestiona el estado global mínimo (login → terminal)
 *  - Orquesta los componentes principales (Header, Terminal, LoginPanel)
 *  - Mantiene la UI desacoplada de la lógica interna (useTerminal)
 *  - Soporta modo L4tentNoise (identidad secreta via Konami code)
 *
 * La lógica de negocio NO vive aquí. Este archivo solo coordina.
 */

import { useState, useEffect, useCallback } from "preact/hooks";

// Componentes principales de la interfaz
import PageHeader from "./components/layout/PageHeader";
import Footer from "./components/layout/Footer";
import MobileBottomBar from "./components/layout/MobileBottomBar";
import Terminal from "./components/terminal/Terminal";
import LoginPanel from "./components/login/LoginPanel";
import BootSequence from "./components/intro/BootSequence";
import MatrixBackground from "./components/background/MatrixBackground";
import TacticalMap from "./components/background/TacticalMap";
import ChatBubble from "./components/chat/ChatBubble";

// HUD y efectos visuales
import TacticalHUD from "./components/hud/TacticalHUD";
import CRTEffect from "./components/effects/CRTEffect";

// Hook que encapsula toda la lógica de la terminal
import { useTerminal } from "./core/hooks/useTerminal";

// L4tentNoise mode (identidad secreta)
import { L4tentNoiseProvider, useL4tentNoise } from "./core/context/L4tentNoiseContext";
import { useKonamiCode } from "./core/hooks/useKonamiCode";

import "./styles/globals.css";

/**
 * Componente interno que tiene acceso al contexto L4tentNoise
 */
function AppContent() {
  /**
   * Controla la etapa actual:
   *  - "boot": secuencia BIOS inicial
   *  - "login": se muestra el personaje caminando + intro
   *  - "terminal": se muestra la terminal interactiva
   */
  const [stage, setStage] = useState<"boot" | "login" | "terminal">("boot");

  // L4tentNoise mode context
  const { isL4tentMode, toggleL4tent } = useL4tentNoise();

  // Estado para mostrar mensaje de activación
  const [showActivationMessage, setShowActivationMessage] = useState(false);

  /**
   * Hook que contiene:
   *  - historial de salida
   *  - animación de comandos
   *  - router de comandos
   *  - helpers de impresión
   */
  const terminal = useTerminal({ isL4tentMode, toggleL4tent });

  // Callback para cuando se activa el Konami code (alternativa al comando)
  const handleKonamiActivation = useCallback(() => {
    toggleL4tent();
    setShowActivationMessage(true);
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setShowActivationMessage(false);
    }, 3000);
  }, [toggleL4tent]);

  // Escuchar Konami code (alternativa secreta)
  useKonamiCode(handleKonamiActivation);

  // Permitir saltar la secuencia de boot con cualquier tecla
  useEffect(() => {
    if (stage !== "boot") return;

    const handleKeyPress = () => {
      setStage("login");
    };
    const handleClick = () => {
      setStage("login");
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleClick);
    };
  }, [stage]);

  return (
    <div class="relative min-h-screen flex flex-col">
      {/* Secuencia de arranque BIOS */}
      {stage === "boot" && (
        <BootSequence
          onComplete={() => {
            setStage("login");
          }}
        />
      )}

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

      {/* Badge de modo L4tentNoise */}
      {isL4tentMode && stage === "terminal" && (
        <div class="l4tent-badge">
          <span class="mr-2">&#9760;</span>
          L4TENTNOISE MODE
        </div>
      )}

      {/* Header visible solo en modo terminal */}
      {stage === "terminal" && (
        <PageHeader runCommand={terminal.runCommand} isL4tentMode={isL4tentMode} />
      )}

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

      {/* Mensaje de activación/desactivación */}
      {showActivationMessage && (
        <div class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div
            class="text-center p-8 rounded-lg animate-fade-in"
            style={{
              background: isL4tentMode ? "rgba(255,0,51,0.1)" : "rgba(51,153,255,0.1)",
              border: `2px solid ${isL4tentMode ? "#ff0033" : "#3399ff"}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              class="text-4xl font-bold mb-2"
              style={{ color: isL4tentMode ? "#ff0033" : "#3399ff" }}
            >
              {isL4tentMode ? "L4TENTNOISE ACTIVATED" : "CIVILIAN MODE"}
            </div>
            <div class="text-sm text-gray-400">
              {isL4tentMode
                ? "Secret identity unlocked. Type 'whoami' to see your true self."
                : "Returning to normal operations."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Componente raíz que envuelve todo con el provider de L4tentNoise
 */
export function App() {
  return (
    <L4tentNoiseProvider>
      <AppContent />
    </L4tentNoiseProvider>
  );
}
