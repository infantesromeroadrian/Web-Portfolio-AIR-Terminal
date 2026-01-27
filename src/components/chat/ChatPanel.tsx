/**
 * Panel del chatbot AI.
 *
 * Asistente conversacional que explica:
 *  - Qué es este portfolio y cómo funciona
 *  - Todos los comandos disponibles (incluyendo easter eggs)
 *  - Info sobre Adrian: proyectos, experiencia, skills, contacto
 *
 * Diseño:
 *  - Estilo terminal para coherencia con el resto del portfolio
 *  - Pattern matching por keywords para respuestas predefinidas
 *  - Quick replies para guiar al usuario
 */

import { useState, useRef, useEffect } from "preact/hooks";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `👋 ¡Hey! Soy el asistente de Adrian.

Esta web es un portfolio interactivo estilo terminal — puedes escribir comandos reales con el teclado.

Pregúntame sobre:
• Qué comandos hay disponibles
• Los proyectos de Adrian
• Su experiencia y skills
• Easter eggs ocultos 👀
• Cómo contactar con él

¿Qué quieres saber?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Sistema de respuestas por keyword matching.
   * Prioridad: más específico primero.
   */
  const getResponse = (question: string): string => {
    const q = question.toLowerCase();

    // ── Comandos y ayuda ──────────────────────────────────────
    if (
      q.includes("comando") ||
      q.includes("command") ||
      q.includes("ayuda") ||
      q.includes("help") ||
      q.includes("qué puedo hacer") ||
      q.includes("que puedo hacer") ||
      q.includes("cómo funciona") ||
      q.includes("como funciona")
    ) {
      return `📟 Esta terminal tiene comandos reales. Escríbelos abajo en el prompt:

**Básicos:**
• \`help\` — Lista todos los comandos
• \`whoami\` — Quién es Adrian
• \`neofetch\` — Info del sistema estilo Linux
• \`clear\` — Limpia la terminal

**Perfil:**
• \`cat profile.txt\` — Perfil profesional
• \`cat edu.txt\` — Formación académica
• \`cat exp.txt\` — Experiencia laboral
• \`cat skills.txt\` — Habilidades técnicas
• \`cat certs.txt\` — Certificaciones
• \`cat contact.txt\` — Contacto

**Proyectos:**
• \`ls projects/\` — Lista de proyectos
• \`cat projects/watchdogs.txt\` — WatchDogs OSINT
• \`cat projects/threatintel.txt\` — Threat Intel
• \`cat projects/siem.txt\` — SIEM Anomaly
• \`cat projects/emailthreat.txt\` — Email Threat

**🔒 Security (los que molan):**
• \`nmap localhost\` — Escaneo de puertos
• \`hack\` — Auditoría de seguridad
• \`threat-map\` — Dashboard SIEM en vivo
• \`cve\` — Vulnerabilidades AI/ML
• \`demo\` — Pipeline de detección live
• \`exploit\` — Responsible disclosure
• \`curl\` — Headers HTTP
• \`sudo rm -rf /\` — Pruébalo 😏

**Tips:** TAB autocompleta, ↑↓ navega historial, Ctrl+L limpia.`;
    }

    // ── Easter eggs ───────────────────────────────────────────
    if (
      q.includes("easter") ||
      q.includes("secreto") ||
      q.includes("oculto") ||
      q.includes("hidden") ||
      q.includes("truco")
    ) {
      return `👀 ¡Te gustan los secretos! Hay varios easter eggs:

• \`nmap localhost\` — Simula un escaneo de puertos. Los servicios que muestra son ficticios pero representan el stack real de Adrian.

• \`hack\` — Hace una "auditoría de seguridad" del portfolio. Comprueba XSS, CSRF, Prompt Injection... y al final hay un CTF flag 🏁

• \`sudo rm -rf /\` — Pruébalo y verás qué pasa 😂

• \`threat-map\` — Un dashboard SIEM completo con mapa de amenazas geográfico, vectores de ataque, y defensas activas.

• \`demo\` — Simula logs de un pipeline ML detectando anomalías en tiempo real. Muy visual.

• \`curl\` — Muestra headers HTTP ficticios con \`x-security-level: BLUE CYBER HARDENED\`

Cada uno demuestra que Adrian piensa como atacante Y como defensor.`;
    }

    // ── Proyectos ─────────────────────────────────────────────
    if (
      q.includes("proyecto") ||
      q.includes("project") ||
      q.includes("watchdog") ||
      q.includes("siem") ||
      q.includes("threat") ||
      q.includes("email")
    ) {
      return `🎯 Adrian tiene 4 proyectos de AI Security. Escribe estos comandos:

**WatchDogs OSINT** (Score: 95/100)
→ \`cat projects/watchdogs.txt\`
Sistema multi-agente con GPT-4 Vision para análisis de video. 4 agentes simultáneos con LangGraph.

**Threat Intelligence Aggregator** (35 endpoints)
→ \`cat projects/threatintel.txt\`
NER con spaCy, clasificación con BERT, topic modeling con LDA.

**SIEM Anomaly Detector** (ROI $310k/año)
→ \`cat projects/siem.txt\`
ML ensemble: Isolation Forest + DBSCAN + GMM. Reducción 80% false positives.

**Email Threat Platform** (95% accuracy)
→ \`cat projects/emailthreat.txt\`
Dual SPAM + Phishing detector con dashboard SOC.

O escribe \`ls projects/\` para ver la lista rápida.`;
    }

    // ── Experiencia ───────────────────────────────────────────
    if (
      q.includes("experiencia") ||
      q.includes("trabajo") ||
      q.includes("bbva") ||
      q.includes("empleo") ||
      q.includes("carrera") ||
      q.includes("cv")
    ) {
      return `💼 Escribe \`cat exp.txt\` para ver el detalle completo. Resumen:

**[Actual] BBVA Technology** — AI Security Architect
Unidad de Inteligencia Financiera. Arquitecturas IA híbridas, seguridad GenAI/LLMs, procesamiento SIGINT de +10M interacciones/año.

**[2024-2026] BBVA Technology** — AI/ML Engineer
RAG Híbrido, NLP, modelos de riesgo (Fraud Scoring), +22% AUC-ROC.

**[2020-2024] Ecoembes** — ML Engineer
Computer Vision Edge AI para reciclaje. 45k imágenes/hora, <100ms latencia.

**[2017-2020] Capgemini** — Data Scientist Junior
Data Lakes en AWS, modelado predictivo, automatización serverless.

7+ años de evolución: Data → ML → AI → AI Security.`;
    }

    // ── Skills ────────────────────────────────────────────────
    if (
      q.includes("skill") ||
      q.includes("tecnolog") ||
      q.includes("stack") ||
      q.includes("sabe") ||
      q.includes("lenguaje")
    ) {
      return `⚡ Escribe \`cat skills.txt\` para el detalle. Stack principal:

**🔒 AI Security:**
OWASP LLM Top 10, MITRE ATLAS, Adversarial Robustness Toolbox, Red Teaming de LLMs, Prompt Injection Defense

**🤖 AI/ML Engineering:**
LLMs (Llama, Mistral, GPT), RAG Systems, PyTorch, LangChain, LangGraph, vLLM, Fine-tuning (LoRA/QLoRA)

**☁️ Cloud:**
AWS (SageMaker, Bedrock, EKS), Azure (AKS, ExpressRoute), Kubernetes, Docker, Helm

**💻 Programación:**
Python, SQL, Bash, TypeScript, Spark, Kafka, PostgreSQL

**🌍 Idiomas:**
Español (nativo), Inglés (profesional), Italiano (profesional), Chino (básico)`;
    }

    // ── Contacto ──────────────────────────────────────────────
    if (
      q.includes("contacto") ||
      q.includes("email") ||
      q.includes("linkedin") ||
      q.includes("github") ||
      q.includes("contratar") ||
      q.includes("hablar")
    ) {
      return `📬 Escribe \`cat contact.txt\` para ver todo. Vías de contacto:

📧 **Email:** infantesromeroadrian@proton.me
💼 **LinkedIn:** linkedin.com/in/adrianinfantes
🐙 **GitHub:** github.com/infantesromeroadrian

📍 Madrid, España | CET (UTC+1)
🟢 Abierto a oportunidades estratégicas en AI Security.`;
    }

    // ── Estudios ──────────────────────────────────────────────
    if (
      q.includes("estudi") ||
      q.includes("formacion") ||
      q.includes("master") ||
      q.includes("universidad") ||
      q.includes("grado")
    ) {
      return `🎓 Escribe \`cat edu.txt\` para el detalle. Formación:

• **Máster en Generative AI** — MIOTI (2024-2025)
• **Máster en Big Data** — MIOTI (2023-2024)
• **Grado en Ingeniería del Software** — U-tad
• **ASIR** — Administración de Sistemas

Certificaciones: ML Engineer Track, AI Engineer Track, LangChain for LLMs, Cybersecurity.

Escribe \`cat certs.txt\` para verlas todas.`;
    }

    // ── Security específico ───────────────────────────────────
    if (
      q.includes("seguridad") ||
      q.includes("security") ||
      q.includes("cyber") ||
      q.includes("ciber") ||
      q.includes("hacking") ||
      q.includes("pentest")
    ) {
      return `🔒 Adrian es AI Security Architect. Su enfoque:

**Ofensivo (Red Team):**
• Red Teaming de LLMs — Prompt Injection, Jailbreaks
• Adversarial ML — Model Evasion, Data Poisoning
• OWASP LLM Top 10 audits

**Defensivo (Blue Team):**
• Guardrails para LLMs (Azure AI Content Safety)
• SIEM con ML para detección de anomalías
• Secure deployment (air-gapped, GDPR compliant)

**Purple Team (ambos):**
• Threat modeling para sistemas de IA
• MITRE ATLAS framework
• Arquitecturas híbridas seguras (NVIDIA DGX + Cloud)

Prueba estos comandos:
• \`hack\` — Auditoría de seguridad del portfolio
• \`threat-map\` — Dashboard SIEM con amenazas
• \`cve\` — Vulnerabilidades recientes en AI/ML
• \`nmap localhost\` — Escaneo de puertos`;
    }

    // ── Sobre el portfolio ────────────────────────────────────
    if (
      q.includes("portfolio") ||
      q.includes("web") ||
      q.includes("página") ||
      q.includes("pagina") ||
      q.includes("terminal")
    ) {
      return `💻 Este portfolio es una terminal interactiva real:

**Tech Stack:** Preact + TypeScript + Vite + Tailwind CSS
**Background:** Neural Rain (símbolos ML cayendo: λ∑∂θσ∇)
**Colores:** Tema Blue Cyber (seguridad ofensiva + defensiva)
**Sonido:** Click de teclado mecánico (toggle ♪ ON/OFF arriba)

**Features:**
• Input de teclado real con cursor
• TAB autocomplete para todos los comandos
• Historial de comandos con ↑↓
• 24 comandos incluyendo easter eggs de seguridad
• Este chatbot que estás usando

El código es open source: github.com/infantesromeroadrian/Web-Portfolio-AIR-Terminal`;
    }

    // ── Quién es / sobre Adrian ───────────────────────────────
    if (
      q.includes("quién") ||
      q.includes("quien") ||
      q.includes("adrian") ||
      q.includes("sobre") ||
      q.includes("presentat")
    ) {
      return `Escribe \`whoami\` en la terminal para la presentación completa.

En resumen: **Adrian Infantes** es AI Security Architect en BBVA Technology (Unidad de Inteligencia Financiera). 7+ años de experiencia en AI/ML, especializado en seguridad de sistemas de IA.

Su filosofía: "Defensa en Profundidad aplicada a la IA. Un agente autónomo sin blindaje es un riesgo inaceptable."

Prueba \`neofetch\` para ver sus "specs" estilo Linux 😎`;
    }

    // ── Fallback ──────────────────────────────────────────────
    return `No estoy seguro de lo que buscas. Puedo ayudarte con:

• **"qué comandos hay"** — Lista completa de lo que puedes hacer
• **"proyectos"** — Los 4 proyectos de AI Security
• **"experiencia"** — Carrera profesional de Adrian
• **"skills"** — Stack tecnológico
• **"contacto"** — Cómo hablar con Adrian
• **"easter eggs"** — Secretos ocultos 👀
• **"seguridad"** — Enfoque de AI Security
• **"portfolio"** — Sobre esta web

O simplemente escribe \`help\` en la terminal.`;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    setTimeout(() => {
      const response = getResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div
      class="
        fixed bottom-24 right-6 z-50
        w-96 h-[520px]
        bg-[#0a0a0a]/95 backdrop-blur-sm
        border border-blue-600 rounded-lg
        shadow-2xl shadow-blue-600/20
        flex flex-col
        font-mono
      "
    >
      {/* Header */}
      <div class="flex items-center justify-between px-4 py-3 border-b border-blue-600/50 bg-black/50">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-blue-400 text-sm font-bold">AIR Assistant</span>
          <span class="text-gray-500 text-xs">// ask me anything</span>
        </div>
        <button onClick={onClose} class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} class="flex-1 overflow-y-auto p-4 space-y-4 terminal-scroll">
        {messages.map((msg, i) => (
          <div key={i} class={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              class={`
                max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-200 border border-gray-700"
                }
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div class="flex justify-start">
            <div class="bg-gray-800 text-gray-400 px-3 py-2 rounded-lg text-sm border border-gray-700">
              <span class="animate-pulse">Procesando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} class="p-3 border-t border-blue-600/50 bg-black/50">
        <div class="flex space-x-2">
          <input
            type="text"
            value={input}
            onInput={(e) => {
              setInput((e.target as HTMLInputElement).value);
            }}
            placeholder="Pregunta sobre Adrian..."
            class="
              flex-1 bg-gray-900 border border-gray-700 rounded-lg
              px-3 py-2 text-sm text-white
              focus:outline-none focus:border-blue-500
              placeholder-gray-500
            "
          />
          <button
            type="submit"
            disabled={isLoading}
            class="
              bg-blue-600 hover:bg-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              px-4 py-2 rounded-lg
              text-white text-sm font-bold
              transition-colors
            "
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
}
