/**
 * Formateadores para easter eggs de seguridad y comandos especiales.
 *
 * Comandos: help, neofetch, nmap, hack, exploit, curl, sudo rm,
 * threat-map, cve, demo.
 *
 * Todas las funciones son puras y devuelven HTML strings.
 */

// =============================================================================
// HELP
// =============================================================================

/**
 * Formateador para el comando help.
 * Muestra todos los comandos disponibles con descripción.
 */
export function formatHelp(commands: string[]): string {
  const commandDescriptions: Record<string, string> = {
    // Comandos principales
    whoami: "Perfil profesional completo",
    estudios: "Formación académica",
    experiencia: "Experiencia laboral",
    skills: "Habilidades técnicas",
    certificaciones: "Certificaciones",
    proyectos: "Lista de proyectos",
    // Utilidades
    help: "Muestra esta ayuda",
    clear: "Limpia la terminal",
    neofetch: "Info del sistema estilo Linux",
    all: "Muestra toda la info",
    // Proyectos específicos
    "proyecto watchdogs": "Detalle WatchDogs OSINT",
    "proyecto threatintel": "Detalle Threat Intel",
    "proyecto siem": "Detalle SIEM Anomaly",
    "proyecto emailthreat": "Detalle Email Threat",
    // Blog
    blog: "Lista de posts del blog",
    // Easter eggs
    nmap: "Escaneo de puertos",
    hack: "Auditoría de seguridad",
    "threat-map": "Dashboard SIEM",
    cve: "Vulnerabilidades AI/ML",
    demo: "Pipeline ML en vivo",
    curl: "Headers HTTP",
    exploit: "Responsible disclosure",
    "sudo rm -rf /": "Nice try 😏",
    "docker inspect air": "🐳 Docker expertise",
  };

  const lines = commands.map((cmd) => {
    const desc = commandDescriptions[cmd] ?? "";
    const paddedCmd = cmd.padEnd(25);
    return `  <span style="color:#00ff00">${paddedCmd}</span> <span style="color:#888888">${desc}</span>`;
  });

  return `
<span style="color:#3399ff">=== COMANDOS DISPONIBLES ===</span>

${lines.join("\n")}

<span style="color:#888888">Usa TAB para autocompletar, ↑↓ para historial</span>
`;
}

// =============================================================================
// NEOFETCH
// =============================================================================

/**
 * Emula el clásico neofetch de Linux mostrando información
 * del "sistema" (portfolio/perfil de Adrian).
 */
export function formatNeofetch(): string {
  const logo = [
    `<span style="color:#2563eb">     █████╗ ██╗██████╗ </span>`,
    `<span style="color:#2563eb">    ██╔══██╗██║██╔══██╗</span>`,
    `<span style="color:#3b82f6">    ███████║██║██████╔╝</span>`,
    `<span style="color:#3b82f6">    ██╔══██║██║██╔══██╗</span>`,
    `<span style="color:#60a5fa">    ██║  ██║██║██║  ██║</span>`,
    `<span style="color:#60a5fa">    ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝</span>`,
  ];

  const info = [
    `<span style="color:#2563eb">air</span><span style="color:#888888">@</span><span style="color:#2563eb">portfolio</span>`,
    `<span style="color:#888888">─────────────────────</span>`,
    `<span style="color:#2563eb">OS:</span>      AI Security Arch v2.0`,
    `<span style="color:#2563eb">Host:</span>    Adrian Infantes`,
    `<span style="color:#2563eb">Kernel:</span>  Blue Cyber Engine`,
    `<span style="color:#2563eb">Shell:</span>   portfolio-terminal 1.0`,
    `<span style="color:#2563eb">Role:</span>    AI Security Architect`,
    `<span style="color:#2563eb">DE:</span>      Neural Rain + Preact`,
    `<span style="color:#2563eb">Theme:</span>   Blue Cyber [dark]`,
    `<span style="color:#0db7ed">Docker:</span>  <span style="color:#0db7ed">Expert</span> — Multi-stage, Rootless, GPU`,
    `<span style="color:#2563eb">Stack:</span>   Python, TypeScript, K8s`,
    `<span style="color:#2563eb">ML:</span>      LangGraph, PyTorch, scikit`,
    `<span style="color:#2563eb">Cloud:</span>   AWS, Azure, Kubernetes`,
    `<span style="color:#2563eb">Uptime:</span>  8+ years in AI/Security`,
    ``,
    `<span style="color:#2563eb">██</span><span style="color:#3b82f6">██</span><span style="color:#60a5fa">██</span><span style="color:#93c5fd">██</span><span style="color:#00ff00">██</span><span style="color:#0db7ed">██</span><span style="color:#ff9900">██</span><span style="color:#ff3333">██</span>`,
  ];

  const maxLines = Math.max(logo.length, info.length);
  const lines: string[] = [];
  for (let i = 0; i < maxLines; i++) {
    const logoLine = i < logo.length ? logo[i] : "                       ";
    const infoLine = i < info.length ? info[i] : "";
    lines.push(`${logoLine}   ${infoLine}`);
  }

  return `\n${lines.join("\n")}\n`;
}

// =============================================================================
// EASTER EGGS — Seguridad Ofensiva
// =============================================================================

/**
 * Simula un escaneo nmap contra localhost.
 */
export function formatNmap(): string {
  return `
<span style="color:#00ff00">Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().replace("T", " ").slice(0, 19)}</span>
<span style="color:#888888">Nmap scan report for localhost (127.0.0.1)</span>
<span style="color:#888888">Host is up (0.00042s latency).</span>

<span style="color:#ffff66">PORT      STATE    SERVICE          VERSION</span>
<span style="color:#00ff00">22/tcp    filtered ssh              OpenSSH 9.6 (honeypot)</span>
<span style="color:#00ff00">80/tcp    open     http             Preact/Vite 7.3</span>
<span style="color:#00ff00">443/tcp   open     https            TLS 1.3 / HSTS enabled</span>
<span style="color:#ff3333">666/tcp   open     neural-rain      AIR Neural Engine v2.0</span>
<span style="color:#00ff00">3000/tcp  filtered dev-server       Vite HMR (blocked)</span>
<span style="color:#ff3333">8080/tcp  open     threat-intel     SIEM Anomaly Detector</span>
<span style="color:#ff3333">9090/tcp  open     ml-inference     vLLM Serving Engine</span>
<span style="color:#00ff00">27017/tcp filtered mongodb          Vector DB (Qdrant)</span>

<span style="color:#888888">OS detection: Linux 6.x (Blue Cyber Hardened)</span>
<span style="color:#888888">Network Distance: 0 hops</span>

<span style="color:#ffff66">Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds</span>
<span style="color:#ff3333">[!] WARNING: Scan detected and logged. Incident ID: AIR-${Math.floor(Math.random() * 9000 + 1000)}</span>
`;
}

/**
 * Respuesta divertida a sudo rm -rf /
 */
export function formatSudoRm(): string {
  return `
<span style="color:#ff3333">██████████████████████████████████████████████████</span>
<span style="color:#ff3333">█                                                █</span>
<span style="color:#ff3333">█   ⚠️  ACCESS DENIED — NICE TRY, SCRIPT KIDDIE  █</span>
<span style="color:#ff3333">█                                                █</span>
<span style="color:#ff3333">██████████████████████████████████████████████████</span>

<span style="color:#ffff66">[SECURITY]</span> Incident logged.
<span style="color:#ffff66">[SECURITY]</span> IP fingerprinted.
<span style="color:#ffff66">[SECURITY]</span> Threat level: <span style="color:#ff3333">LMAO</span>

<span style="color:#888888">$ whoami</span>
<span style="color:#00ff00">You are not root. You are not even close.</span>

<span style="color:#888888">Fun fact: This portfolio runs on an immutable filesystem.</span>
<span style="color:#888888">Even if you were root, there's nothing to delete.</span>

<span style="color:#2563eb">— "The best defense is making the attacker waste their time." — Adrian Infantes</span>
`;
}

/**
 * Simula un ataque tipo CTF con output hacker.
 */
export function formatHack(): string {
  return `
<span style="color:#ff3333">[*] Initializing attack vector...</span>
<span style="color:#ffff66">[*] Target: portfolio.air.local</span>
<span style="color:#00ff00">[*] Scanning for vulnerabilities...</span>

<span style="color:#888888">  [1/7] SQL Injection.............. <span style="color:#00ff00">PATCHED ✓</span></span>
<span style="color:#888888">  [2/7] XSS (Reflected)............ <span style="color:#00ff00">PATCHED ✓</span> (DOMPurify)</span>
<span style="color:#888888">  [3/7] XSS (Stored)............... <span style="color:#00ff00">PATCHED ✓</span> (CSP headers)</span>
<span style="color:#888888">  [4/7] CSRF...................... <span style="color:#00ff00">N/A ✓</span> (static site)</span>
<span style="color:#888888">  [5/7] Prompt Injection........... <span style="color:#00ff00">HARDENED ✓</span> (no LLM backend)</span>
<span style="color:#888888">  [6/7] Dependency Confusion....... <span style="color:#00ff00">PATCHED ✓</span> (lockfile)</span>
<span style="color:#888888">  [7/7] Secrets Exposure........... <span style="color:#00ff00">CLEAN ✓</span> (no .env committed)</span>

<span style="color:#00ff00">═══════════════════════════════════════════════════</span>
<span style="color:#00ff00">  RESULT: 0 vulnerabilities found. System hardened.</span>
<span style="color:#00ff00">═══════════════════════════════════════════════════</span>

<span style="color:#2563eb">[CTF FLAG] AIR{y0u_c4nt_h4ck_wh4t_y0u_c4nt_br34k}</span>

<span style="color:#888888">This portfolio was built with security-first principles:</span>
<span style="color:#888888">  • HTML sanitized with DOMPurify</span>
<span style="color:#888888">  • No backend — zero attack surface</span>
<span style="color:#888888">  • All dependencies locked (package-lock.json)</span>
<span style="color:#888888">  • CSP-ready, no inline scripts</span>
`;
}

/**
 * Información sobre responsible disclosure.
 */
export function formatExploit(): string {
  return `
<span style="color:#ff3333">┌─────────────────────────────────────────────────┐</span>
<span style="color:#ff3333">│         RESPONSIBLE DISCLOSURE POLICY            │</span>
<span style="color:#ff3333">└─────────────────────────────────────────────────┘</span>

<span style="color:#ffff66">Found a vulnerability?</span> I'd love to hear about it.

<span style="color:#00ff00">[+]</span> Report to: <a href="mailto:infantesromeroadrian@proton.me" style="color:#3399ff">infantesromeroadrian@proton.me</a>
<span style="color:#00ff00">[+]</span> PGP: Available on request
<span style="color:#00ff00">[+]</span> Response time: &lt; 24 hours
<span style="color:#00ff00">[+]</span> Hall of Fame: Coming soon

<span style="color:#ffff66">Rules of engagement:</span>
<span style="color:#888888">  1. No automated scanning without permission</span>
<span style="color:#888888">  2. No data exfiltration or destruction</span>
<span style="color:#888888">  3. Provide clear reproduction steps</span>
<span style="color:#888888">  4. Allow 90 days for remediation</span>

<span style="color:#2563eb">I believe in building a safer digital world.</span>
<span style="color:#2563eb">Security researchers are allies, not adversaries.</span>

<span style="color:#888888">— Adrian Infantes, AI Security Architect</span>
`;
}

/**
 * Simula headers HTTP tipo curl.
 */
export function formatCurl(): string {
  return `
<span style="color:#00ff00">$ curl -I https://infantesromeroadrian.github.io/Web-Portfolio-AIR-Terminal/</span>

<span style="color:#ffff66">HTTP/2 200 OK</span>
<span style="color:#888888">server:</span>              GitHub.com (Fastly CDN)
<span style="color:#888888">content-type:</span>         text/html; charset=utf-8
<span style="color:#888888">x-powered-by:</span>         <span style="color:#2563eb">AIR Neural Engine v2.0</span>
<span style="color:#888888">x-frame-options:</span>      DENY
<span style="color:#888888">x-content-type:</span>       nosniff
<span style="color:#888888">x-xss-protection:</span>    1; mode=block
<span style="color:#888888">strict-transport:</span>     max-age=31536000; includeSubDomains
<span style="color:#888888">content-security:</span>     default-src 'self'
<span style="color:#888888">referrer-policy:</span>      strict-origin-when-cross-origin
<span style="color:#888888">permissions-policy:</span>   camera=(), microphone=(), geolocation=()
<span style="color:#888888">x-architect:</span>          <span style="color:#00ff00">Adrian Infantes — AI Security Architect</span>
<span style="color:#888888">x-built-with:</span>         Preact, TypeScript, Vite, TailwindCSS
<span style="color:#888888">x-security-level:</span>     <span style="color:#ff3333">BLUE CYBER HARDENED</span>
<span style="color:#888888">x-hiring:</span>             <span style="color:#ffff66">Open to strategic opportunities</span>
<span style="color:#888888">cache-control:</span>        public, max-age=3600
<span style="color:#888888">date:</span>                 ${new Date().toUTCString()}
`;
}

// =============================================================================
// THREAT MAP — Mini Dashboard SIEM
// =============================================================================

/**
 * Simula un mapa de amenazas ASCII tipo dashboard SOC.
 */
export function formatThreatMap(): string {
  const blocked = Math.floor(Math.random() * 500 + 1200);
  const alerts = Math.floor(Math.random() * 30 + 45);
  const critical = Math.floor(Math.random() * 5 + 2);

  return `
<span style="color:#ff3333">╔══════════════════════════════════════════════════════════════╗</span>
<span style="color:#ff3333">║            AIR THREAT INTELLIGENCE DASHBOARD                ║</span>
<span style="color:#ff3333">║              Real-time Security Monitoring                  ║</span>
<span style="color:#ff3333">╚══════════════════════════════════════════════════════════════╝</span>

<span style="color:#ffff66">┌─── THREAT OVERVIEW ──────────────────────────────────────┐</span>
<span style="color:#888888">│</span>  <span style="color:#ff3333">█████████████████████████████</span>  Blocked IPs:     <span style="color:#ff3333">${blocked}</span>
<span style="color:#888888">│</span>  <span style="color:#ffff66">████████████████</span>               Active Alerts:   <span style="color:#ffff66">${alerts}</span>
<span style="color:#888888">│</span>  <span style="color:#ff3333">████</span>                           Critical:        <span style="color:#ff3333">${critical}</span>
<span style="color:#888888">│</span>  <span style="color:#00ff00">██████████████████████████</span>    Models Online:   <span style="color:#00ff00">4/4</span>
<span style="color:#ffff66">└──────────────────────────────────────────────────────────┘</span>

<span style="color:#3399ff">┌─── TOP ATTACK VECTORS (last 24h) ────────────────────────┐</span>
<span style="color:#888888">│</span>  <span style="color:#ff3333">[CRITICAL]</span> Prompt Injection attempts     <span style="color:#ff3333">████████</span>  847
<span style="color:#888888">│</span>  <span style="color:#ff3333">[HIGH]</span>     Model Evasion attacks        <span style="color:#ffff66">██████</span>    523
<span style="color:#888888">│</span>  <span style="color:#ffff66">[MEDIUM]</span>   Data Poisoning probes        <span style="color:#ffff66">████</span>      298
<span style="color:#888888">│</span>  <span style="color:#00ff00">[LOW]</span>      Brute Force (API keys)       <span style="color:#00ff00">███</span>       156
<span style="color:#888888">│</span>  <span style="color:#00ff00">[INFO]</span>     Recon/Scanning               <span style="color:#00ff00">██</span>         89
<span style="color:#3399ff">└──────────────────────────────────────────────────────────┘</span>

<span style="color:#2563eb">┌─── GEO DISTRIBUTION ─────────────────────────────────────┐</span>
<span style="color:#888888">│</span>  🇨🇳 China ........... 34%  <span style="color:#ff3333">████████████████</span>
<span style="color:#888888">│</span>  🇷🇺 Russia .......... 22%  <span style="color:#ff3333">███████████</span>
<span style="color:#888888">│</span>  🇰🇵 North Korea ..... 15%  <span style="color:#ffff66">████████</span>
<span style="color:#888888">│</span>  🇮🇷 Iran ............ 12%  <span style="color:#ffff66">██████</span>
<span style="color:#888888">│</span>  🇺🇸 USA (bots) ......  9%  <span style="color:#00ff00">████</span>
<span style="color:#888888">│</span>  🌍 Others ..........  8%  <span style="color:#00ff00">████</span>
<span style="color:#2563eb">└──────────────────────────────────────────────────────────┘</span>

<span style="color:#00ff00">┌─── ACTIVE DEFENSES ──────────────────────────────────────┐</span>
<span style="color:#888888">│</span>  <span style="color:#00ff00">[✓]</span> WAF Rules ............... 247 active
<span style="color:#888888">│</span>  <span style="color:#00ff00">[✓]</span> ML Anomaly Detection .... Ensemble (IF+DBSCAN+GMM)
<span style="color:#888888">│</span>  <span style="color:#00ff00">[✓]</span> Rate Limiting ........... 30 req/min
<span style="color:#888888">│</span>  <span style="color:#00ff00">[✓]</span> Guardrails .............. Azure AI Content Safety
<span style="color:#888888">│</span>  <span style="color:#00ff00">[✓]</span> SIEM Integration ........ Splunk + Custom ML
<span style="color:#00ff00">└──────────────────────────────────────────────────────────┘</span>

<span style="color:#888888">Last updated: ${new Date().toISOString().replace("T", " ").slice(0, 19)} UTC</span>
<span style="color:#888888">Status: <span style="color:#00ff00">ALL SYSTEMS OPERATIONAL</span></span>
`;
}

// =============================================================================
// CVE — Vulnerabilidades AI/ML
// =============================================================================

/**
 * Muestra CVEs recientes y relevantes para AI/ML Security.
 */
export function formatCve(): string {
  return `
<span style="color:#ff3333">╔══════════════════════════════════════════════════════════════╗</span>
<span style="color:#ff3333">║              AI/ML SECURITY — CVE TRACKER                   ║</span>
<span style="color:#ff3333">╚══════════════════════════════════════════════════════════════╝</span>

<span style="color:#ffff66">┌─── CRITICAL / HIGH — LLM & GenAI ────────────────────────┐</span>

<span style="color:#ff3333">[CRITICAL]</span> CVE-2024-5184 — <span style="color:#ffff66">Prompt Injection in LangChain</span>
  CVSS: 9.8 | Allows RCE via crafted prompts in agent chains
  Affects: LangChain &lt; 0.1.0 | Fix: Upgrade + input sanitization

<span style="color:#ff3333">[CRITICAL]</span> CVE-2024-3402 — <span style="color:#ffff66">SSRF in LLM Tool Use</span>
  CVSS: 9.1 | LLM agents can be tricked to access internal APIs
  Affects: Any LLM with unrestricted tool access

<span style="color:#ff3333">[HIGH]</span>     CVE-2024-29510 — <span style="color:#ffff66">Model Serialization RCE (Pickle)</span>
  CVSS: 8.8 | Arbitrary code execution via malicious .pkl models
  Affects: PyTorch, scikit-learn | Fix: Use safetensors

<span style="color:#ffff66">┌─── HIGH / MEDIUM — ML Infrastructure ────────────────────┐</span>

<span style="color:#ffff66">[HIGH]</span>     CVE-2024-0225 — <span style="color:#3399ff">MLflow Auth Bypass</span>
  CVSS: 8.1 | Unauthenticated access to experiment tracking
  Affects: MLflow &lt; 2.9.0 | Fix: Upgrade + enable auth

<span style="color:#ffff66">[MEDIUM]</span>   CVE-2024-3572 — <span style="color:#3399ff">ONNX Model Parsing Overflow</span>
  CVSS: 7.5 | Buffer overflow when loading crafted .onnx models
  Affects: ONNX Runtime &lt; 1.17 | Fix: Upgrade runtime

<span style="color:#ffff66">[MEDIUM]</span>   CVE-2024-2196 — <span style="color:#3399ff">Ray Dashboard Unauth Access</span>
  CVSS: 7.2 | Exposed Ray dashboard allows job submission
  Affects: Ray &lt; 2.8.1 | Fix: Enable auth + network isolation

<span style="color:#2563eb">┌─── MITRE ATLAS — AI ATTACK TECHNIQUES ───────────────────┐</span>

<span style="color:#888888">│</span>  <span style="color:#ff3333">AML.T0043</span>  Adversarial ML Attack — Model Evasion
<span style="color:#888888">│</span>  <span style="color:#ff3333">AML.T0040</span>  Model Inference Attack — Data Extraction
<span style="color:#888888">│</span>  <span style="color:#ffff66">AML.T0049</span>  Prompt Injection — Direct & Indirect
<span style="color:#888888">│</span>  <span style="color:#ffff66">AML.T0051</span>  LLM Jailbreak — Guardrail Bypass
<span style="color:#888888">│</span>  <span style="color:#00ff00">AML.T0020</span>  Data Poisoning — Training Set Manipulation
<span style="color:#888888">│</span>  <span style="color:#00ff00">AML.T0044</span>  Model Supply Chain Attack — Backdoored Models
<span style="color:#2563eb">└──────────────────────────────────────────────────────────┘</span>

<span style="color:#888888">Source: MITRE ATLAS, NVD, OWASP LLM Top 10</span>
<span style="color:#888888">Curated by: Adrian Infantes — AI Security Architect</span>
`;
}

// =============================================================================
// DEMO — Threat Detection Simulada
// =============================================================================

/**
 * Simula un pipeline de detección de amenazas en tiempo real.
 */
export function formatDemo(): string {
  const timestamp = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - Math.floor(Math.random() * 60));
    return d.toISOString().replace("T", " ").slice(0, 19);
  };

  const ips = [
    "192.168.1.105",
    "10.0.0.42",
    "172.16.0.88",
    "45.33.32.156",
    "203.0.113.50",
    "198.51.100.23",
  ];

  const randomIp = () => ips[Math.floor(Math.random() * ips.length)];
  const randomScore = () => (Math.random() * 0.4 + 0.6).toFixed(3);

  return `
<span style="color:#2563eb">╔══════════════════════════════════════════════════════════════╗</span>
<span style="color:#2563eb">║          AIR THREAT DETECTION — LIVE DEMO                   ║</span>
<span style="color:#2563eb">║          ML Pipeline: Isolation Forest + DBSCAN             ║</span>
<span style="color:#2563eb">╚══════════════════════════════════════════════════════════════╝</span>

<span style="color:#3399ff">[PIPELINE]</span> Ingesting logs from: syslog, nginx, auth, firewall
<span style="color:#3399ff">[PIPELINE]</span> Feature extraction: 15 behavioral features
<span style="color:#3399ff">[PIPELINE]</span> Ensemble: IF(50%) + DBSCAN(30%) + GMM(20%)
<span style="color:#3399ff">[PIPELINE]</span> Processing...

<span style="color:#ffff66">═══════════════════════════════════════════════════════════════</span>

<span style="color:#888888">${timestamp()}</span> <span style="color:#00ff00">[NORMAL]</span>  src=${randomIp()} → GET /api/v1/models     200  12ms
<span style="color:#888888">${timestamp()}</span> <span style="color:#00ff00">[NORMAL]</span>  src=${randomIp()} → POST /api/v1/predict   200  45ms
<span style="color:#888888">${timestamp()}</span> <span style="color:#ffff66">[ALERT]</span>   src=${randomIp()} → POST /api/v1/predict   200  <span style="color:#ffff66">2847ms ⚠ LATENCY SPIKE</span>
<span style="color:#888888">${timestamp()}</span> <span style="color:#00ff00">[NORMAL]</span>  src=${randomIp()} → GET /api/v1/health     200   3ms
<span style="color:#888888">${timestamp()}</span> <span style="color:#ff3333">[THREAT]</span>  src=<span style="color:#ff3333">45.33.32.156</span> → POST /api/v1/predict   200  <span style="color:#ff3333">anomaly_score: ${randomScore()}</span>
<span style="color:#888888">           </span> <span style="color:#ff3333">         ├─ Model: Isolation Forest flagged (score &gt; 0.75)</span>
<span style="color:#888888">           </span> <span style="color:#ff3333">         ├─ Pattern: 847 requests in 60s (rate: 14.1/s)</span>
<span style="color:#888888">           </span> <span style="color:#ff3333">         ├─ Payload: Suspected prompt injection attempt</span>
<span style="color:#888888">           </span> <span style="color:#ff3333">         └─ Action: BLOCKED + Alert sent to SOC</span>
<span style="color:#888888">${timestamp()}</span> <span style="color:#00ff00">[NORMAL]</span>  src=${randomIp()} → GET /api/v1/models     200   8ms
<span style="color:#888888">${timestamp()}</span> <span style="color:#ffff66">[ALERT]</span>   src=<span style="color:#ffff66">203.0.113.50</span>  → POST /admin/config    <span style="color:#ffff66">403  FORBIDDEN</span>
<span style="color:#888888">           </span> <span style="color:#ffff66">         ├─ Pattern: Directory traversal attempt</span>
<span style="color:#888888">           </span> <span style="color:#ffff66">         └─ Action: Logged + IP added to watchlist</span>
<span style="color:#888888">${timestamp()}</span> <span style="color:#ff3333">[THREAT]</span>  src=<span style="color:#ff3333">198.51.100.23</span> → POST /api/v1/predict   200  <span style="color:#ff3333">anomaly_score: ${randomScore()}</span>
<span style="color:#888888">           </span> <span style="color:#ff3333">         ├─ Model: DBSCAN cluster -1 (noise/outlier)</span>
<span style="color:#888888">           </span> <span style="color:#ff3333">         ├─ Pattern: Model evasion — adversarial input detected</span>
<span style="color:#888888">           </span> <span style="color:#ff3333">         ├─ Confidence: GMM posterior = 0.012 (extreme outlier)</span>
<span style="color:#888888">           </span> <span style="color:#ff3333">         └─ Action: QUARANTINED + Incident created (INC-${Math.floor(Math.random() * 9000 + 1000)})</span>

<span style="color:#ffff66">═══════════════════════════════════════════════════════════════</span>

<span style="color:#3399ff">[SUMMARY]</span> Processed: 10,847 events | Threats: 2 | Alerts: 2 | Blocked: 1
<span style="color:#3399ff">[SUMMARY]</span> False Positive Rate: 0.3% | Detection Rate: 97.2%
<span style="color:#3399ff">[SUMMARY]</span> Avg Inference: 12ms | P99: 45ms

<span style="color:#00ff00">Pipeline status: OPERATIONAL</span>
<span style="color:#888888">Built by Adrian Infantes — SIEM Anomaly Detector project</span>
<span style="color:#888888">See: <a href="https://github.com/infantesromeroadrian/SIEM-Anomaly-Detector-ML" target="_blank" style="color:#3399ff">github.com/infantesromeroadrian/SIEM-Anomaly-Detector-ML</a></span>
`;
}

// =============================================================================
// DOCKER INSPECT — Easter Egg Docker Expertise
// =============================================================================

/**
 * Muestra expertise Docker en formato JSON estilo docker inspect.
 */
export function formatDockerInspect(): string {
  return `
<span style="color:#0db7ed">$ docker inspect air</span>

<span style="color:#888888">[</span>
  <span style="color:#888888">{</span>
    <span style="color:#0db7ed">"Id"</span>: <span style="color:#98c379">"sha256:a1r5ecur1ty...dockerexpert"</span>,
    <span style="color:#0db7ed">"RepoTags"</span>: [<span style="color:#98c379">"adrianinfantes/ai-security:latest"</span>],
    <span style="color:#0db7ed">"Created"</span>: <span style="color:#98c379">"8+ years of container experience"</span>,
    
    <span style="color:#0db7ed">"DockerPhilosophy"</span>: <span style="color:#888888">{</span>
      <span style="color:#61afef">"BuildStrategy"</span>: <span style="color:#98c379">"Multi-stage builds (builder → runtime)"</span>,
      <span style="color:#61afef">"ImageSize"</span>: <span style="color:#98c379">"&lt;100MB production images"</span>,
      <span style="color:#61afef">"BaseImages"</span>: [<span style="color:#98c379">"distroless"</span>, <span style="color:#98c379">"alpine"</span>, <span style="color:#98c379">"python:slim"</span>],
      <span style="color:#61afef">"LayerOptimization"</span>: <span style="color:#d19a66">true</span>,
      <span style="color:#61afef">"CacheStrategy"</span>: <span style="color:#98c379">"Dependencies first, code last"</span>
    <span style="color:#888888">}</span>,

    <span style="color:#0db7ed">"SecurityConfig"</span>: <span style="color:#888888">{</span>
      <span style="color:#ff6b6b">"RootlessContainers"</span>: <span style="color:#d19a66">true</span>,
      <span style="color:#ff6b6b">"NonRootUser"</span>: <span style="color:#98c379">"USER 1000:1000"</span>,
      <span style="color:#ff6b6b">"ReadOnlyRootfs"</span>: <span style="color:#d19a66">true</span>,
      <span style="color:#ff6b6b">"NoNewPrivileges"</span>: <span style="color:#d19a66">true</span>,
      <span style="color:#ff6b6b">"SecretManagement"</span>: <span style="color:#98c379">"BuildKit --mount=type=secret"</span>,
      <span style="color:#ff6b6b">"VulnerabilityScanning"</span>: [<span style="color:#98c379">"Trivy"</span>, <span style="color:#98c379">"Snyk"</span>, <span style="color:#98c379">"Grype"</span>],
      <span style="color:#ff6b6b">"SeccompProfile"</span>: <span style="color:#98c379">"runtime/default"</span>,
      <span style="color:#ff6b6b">"AppArmorProfile"</span>: <span style="color:#98c379">"docker-default"</span>,
      <span style="color:#ff6b6b">"CapDrop"</span>: [<span style="color:#98c379">"ALL"</span>],
      <span style="color:#ff6b6b">"CapAdd"</span>: <span style="color:#98c379">"Only what's needed"</span>
    <span style="color:#888888">}</span>,

    <span style="color:#0db7ed">"MLSpecific"</span>: <span style="color:#888888">{</span>
      <span style="color:#00ff00">"GPUSupport"</span>: <span style="color:#98c379">"NVIDIA Container Toolkit"</span>,
      <span style="color:#00ff00">"CUDABaseImages"</span>: <span style="color:#98c379">"nvidia/cuda:*-runtime"</span>,
      <span style="color:#00ff00">"ModelCaching"</span>: <span style="color:#98c379">"Named volumes for /models"</span>,
      <span style="color:#00ff00">"HealthChecks"</span>: <span style="color:#98c379">"HEALTHCHECK --interval=30s /health"</span>,
      <span style="color:#00ff00">"ResourceLimits"</span>: <span style="color:#98c379">"--memory, --cpus, --gpus"</span>,
      <span style="color:#00ff00">"InferenceOptimization"</span>: <span style="color:#98c379">"vLLM, ONNX Runtime, TensorRT"</span>
    <span style="color:#888888">}</span>,

    <span style="color:#0db7ed">"Orchestration"</span>: <span style="color:#888888">{</span>
      <span style="color:#ffff66">"Development"</span>: <span style="color:#98c379">"Docker Compose"</span>,
      <span style="color:#ffff66">"Production"</span>: <span style="color:#98c379">"Kubernetes + Helm"</span>,
      <span style="color:#ffff66">"GitOps"</span>: <span style="color:#98c379">"ArgoCD, Flux"</span>,
      <span style="color:#ffff66">"Registry"</span>: [<span style="color:#98c379">"ECR"</span>, <span style="color:#98c379">"ACR"</span>, <span style="color:#98c379">"Harbor"</span>],
      <span style="color:#ffff66">"CI/CD"</span>: <span style="color:#98c379">"GitHub Actions, GitLab CI"</span>
    <span style="color:#888888">}</span>,

    <span style="color:#0db7ed">"BestPractices"</span>: [
      <span style="color:#98c379">"✓ One process per container"</span>,
      <span style="color:#98c379">"✓ Immutable infrastructure"</span>,
      <span style="color:#98c379">"✓ 12-factor app compliance"</span>,
      <span style="color:#98c379">"✓ Explicit versioning (no :latest in prod)"</span>,
      <span style="color:#98c379">"✓ .dockerignore optimization"</span>,
      <span style="color:#98c379">"✓ Multi-platform builds (amd64/arm64)"</span>,
      <span style="color:#98c379">"✓ Graceful shutdown (SIGTERM handling)"</span>
    ]
  <span style="color:#888888">}</span>
<span style="color:#888888">]</span>

<span style="color:#0db7ed">🐳 Docker expertise: Production-grade containerization for ML/AI workloads</span>
<span style="color:#888888">— Adrian Infantes, AI Security Architect</span>
`;
}
