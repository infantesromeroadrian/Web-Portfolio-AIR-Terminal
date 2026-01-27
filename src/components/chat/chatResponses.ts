/**
 * Respuestas del chatbot por keyword matching.
 *
 * Extraído de ChatPanel.tsx para:
 *  - Mantener ChatPanel como componente de UI puro
 *  - Facilitar añadir/editar respuestas sin tocar JSX
 *  - Poder testear las respuestas sin montar componentes
 */

// ── Tipos ───────────────────────────────────────────────────

interface ChatRule {
  /** Keywords que activan esta respuesta (OR lógico) */
  keywords: string[];
  /** Respuesta a devolver */
  response: string;
}

// ── Reglas de respuesta (más específico primero) ────────────

const RULES: ChatRule[] = [
  {
    keywords: [
      "comando",
      "command",
      "ayuda",
      "help",
      "qué puedo hacer",
      "que puedo hacer",
      "cómo funciona",
      "como funciona",
    ],
    response: `📟 Esta terminal tiene comandos reales. Escríbelos abajo en el prompt:

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

**Tips:** TAB autocompleta, ↑↓ navega historial, Ctrl+L limpia.`,
  },
  {
    keywords: ["easter", "secreto", "oculto", "hidden", "truco"],
    response: `👀 ¡Te gustan los secretos! Hay varios easter eggs:

• \`nmap localhost\` — Simula un escaneo de puertos. Los servicios que muestra son ficticios pero representan el stack real de Adrian.

• \`hack\` — Hace una "auditoría de seguridad" del portfolio. Comprueba XSS, CSRF, Prompt Injection... y al final hay un CTF flag 🏁

• \`sudo rm -rf /\` — Pruébalo y verás qué pasa 😂

• \`threat-map\` — Un dashboard SIEM completo con mapa de amenazas geográfico, vectores de ataque, y defensas activas.

• \`demo\` — Simula logs de un pipeline ML detectando anomalías en tiempo real. Muy visual.

• \`curl\` — Muestra headers HTTP ficticios con \`x-security-level: BLUE CYBER HARDENED\`

Cada uno demuestra que Adrian piensa como atacante Y como defensor.`,
  },
  {
    keywords: ["proyecto", "project", "watchdog", "siem", "threat", "email"],
    response: `🎯 Adrian tiene 4 proyectos de AI Security. Escribe estos comandos:

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

O escribe \`ls projects/\` para ver la lista rápida.`,
  },
  {
    keywords: ["experiencia", "trabajo", "bbva", "empleo", "carrera", "cv"],
    response: `💼 Escribe \`cat exp.txt\` para ver el detalle completo. Resumen:

**[Actual] BBVA Technology** — AI Security Architect
Unidad de Inteligencia Financiera. Arquitecturas IA híbridas, seguridad GenAI/LLMs, procesamiento SIGINT de +10M interacciones/año.

**[2024-2026] BBVA Technology** — AI/ML Engineer
RAG Híbrido, NLP, modelos de riesgo (Fraud Scoring), +22% AUC-ROC.

**[2020-2024] Ecoembes** — ML Engineer
Computer Vision Edge AI para reciclaje. 45k imágenes/hora, <100ms latencia.

**[2017-2020] Capgemini** — Data Scientist Junior
Data Lakes en AWS, modelado predictivo, automatización serverless.

7+ años de evolución: Data → ML → AI → AI Security.`,
  },
  {
    keywords: ["skill", "tecnolog", "stack", "sabe", "lenguaje"],
    response: `⚡ Escribe \`cat skills.txt\` para el detalle. Stack principal:

**🔒 AI Security:**
OWASP LLM Top 10, MITRE ATLAS, Adversarial Robustness Toolbox, Red Teaming de LLMs, Prompt Injection Defense

**🤖 AI/ML Engineering:**
LLMs (Llama, Mistral, GPT), RAG Systems, PyTorch, LangChain, LangGraph, vLLM, Fine-tuning (LoRA/QLoRA)

**☁️ Cloud:**
AWS (SageMaker, Bedrock, EKS), Azure (AKS, ExpressRoute), Kubernetes, Docker, Helm

**💻 Programación:**
Python, SQL, Bash, TypeScript, Spark, Kafka, PostgreSQL

**🌍 Idiomas:**
Español (nativo), Inglés (profesional), Italiano (profesional), Chino (básico)`,
  },
  {
    keywords: ["contacto", "email", "linkedin", "github", "contratar", "hablar"],
    response: `📬 Escribe \`cat contact.txt\` para ver todo. Vías de contacto:

📧 **Email:** infantesromeroadrian@proton.me
💼 **LinkedIn:** linkedin.com/in/adrianinfantes
🐙 **GitHub:** github.com/infantesromeroadrian

📍 Madrid, España | CET (UTC+1)
🟢 Abierto a oportunidades estratégicas en AI Security.`,
  },
  {
    keywords: ["estudi", "formacion", "master", "universidad", "grado"],
    response: `🎓 Escribe \`cat edu.txt\` para el detalle. Formación:

• **Máster en Generative AI** — MIOTI (2024-2025)
• **Máster en Big Data** — MIOTI (2023-2024)
• **Grado en Ingeniería del Software** — U-tad
• **ASIR** — Administración de Sistemas

Certificaciones: ML Engineer Track, AI Engineer Track, LangChain for LLMs, Cybersecurity.

Escribe \`cat certs.txt\` para verlas todas.`,
  },
  {
    keywords: ["seguridad", "security", "cyber", "ciber", "hacking", "pentest"],
    response: `🔒 Adrian es AI Security Architect. Su enfoque:

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
• \`nmap localhost\` — Escaneo de puertos`,
  },
  {
    keywords: ["portfolio", "web", "página", "pagina", "terminal"],
    response: `💻 Este portfolio es una terminal interactiva real:

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

El código es open source: github.com/infantesromeroadrian/Web-Portfolio-AIR-Terminal`,
  },
  {
    keywords: ["quién", "quien", "adrian", "sobre", "presentat"],
    response: `Escribe \`whoami\` en la terminal para la presentación completa.

En resumen: **Adrian Infantes** es AI Security Architect en BBVA Technology (Unidad de Inteligencia Financiera). 7+ años de experiencia en AI/ML, especializado en seguridad de sistemas de IA.

Su filosofía: "Defensa en Profundidad aplicada a la IA. Un agente autónomo sin blindaje es un riesgo inaceptable."

Prueba \`neofetch\` para ver sus "specs" estilo Linux 😎`,
  },
];

// ── Fallback ────────────────────────────────────────────────

const FALLBACK = `No estoy seguro de lo que buscas. Puedo ayudarte con:

• **"qué comandos hay"** — Lista completa de lo que puedes hacer
• **"proyectos"** — Los 4 proyectos de AI Security
• **"experiencia"** — Carrera profesional de Adrian
• **"skills"** — Stack tecnológico
• **"contacto"** — Cómo hablar con Adrian
• **"easter eggs"** — Secretos ocultos 👀
• **"seguridad"** — Enfoque de AI Security
• **"portfolio"** — Sobre esta web

O simplemente escribe \`help\` en la terminal.`;

// ── API pública ─────────────────────────────────────────────

/**
 * Dado un mensaje del usuario, devuelve la respuesta del chatbot.
 * Prioridad: la primera regla que haga match gana.
 */
export function getResponse(question: string): string {
  const q = question.toLowerCase();

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => q.includes(kw))) {
      return rule.response;
    }
  }

  return FALLBACK;
}
