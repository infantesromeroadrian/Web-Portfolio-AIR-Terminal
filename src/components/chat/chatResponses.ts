/**
 * Chatbot responses using keyword matching.
 *
 * Extracted from ChatPanel.tsx to:
 *  - Keep ChatPanel as a pure UI component
 *  - Easily add/edit responses without touching JSX
 *  - Enable testing responses without mounting components
 */

// ── Types ───────────────────────────────────────────────────

interface ChatRule {
  /** Keywords that trigger this response (logical OR) */
  keywords: string[];
  /** Response to return */
  response: string;
}

// ── Quick replies for suggestions ───────────────────────────

export const QUICK_REPLIES = [
  { label: "Commands", query: "what commands" },
  { label: "Projects", query: "projects" },
  { label: "Experience", query: "experience" },
  { label: "Easter Eggs 👀", query: "easter eggs" },
  { label: "Contact", query: "contact" },
];

// ── Response rules (most specific first) ────────────────────

const RULES: ChatRule[] = [
  {
    keywords: ["command", "help", "what can i do", "how does it work", "how to use", "terminal"],
    response: `📟 This terminal has real commands. Type them in the prompt below:

**Basic:**
• \`help\` — List all commands
• \`whoami\` — Who is Adrian
• \`neofetch\` — Linux-style system info
• \`clear\` — Clear terminal
• \`all\` — Show all info

**Profile:**
• \`estudios\` — Education background
• \`experiencia\` — Work experience
• \`skills\` — Technical skills
• \`certificaciones\` — Certifications

**Projects:**
• \`proyectos\` — Projects list
• \`cat proyectos/hospital.txt\` — Medical Agents
• \`cat proyectos/bankfraud.txt\` — Fraud Detector
• \`cat proyectos/watchdogs.txt\` — OSINT System
• \`cat proyectos/siem.txt\` — SIEM Anomaly

**Blog:**
• \`blog\` — Research posts list

**🔒 Security (the cool ones):**
• \`nmap\` — Port scanning
• \`hack\` — Security audit
• \`threat-map\` — Live SIEM dashboard
• \`cve\` — AI/ML vulnerabilities
• \`demo\` — Live detection pipeline
• \`docker inspect air\` — Docker expertise
• \`sudo rm -rf /\` — Try it 😏

**Tips:** TAB autocompletes, ↑↓ navigates history.`,
  },
  {
    keywords: ["easter", "secret", "hidden", "trick", "egg"],
    response: `👀 You like secrets! There are several easter eggs:

• \`nmap\` — Simulates a port scan. Services shown are fictional but represent Adrian's real stack.

• \`hack\` — Runs a "security audit" of the portfolio. Checks XSS, CSRF, Prompt Injection... and there's a CTF flag at the end 🏁

• \`sudo rm -rf /\` — Try it and see what happens 😂

• \`threat-map\` — A complete SIEM dashboard with geographic threat map, attack vectors, and active defenses.

• \`demo\` — Simulates ML pipeline logs detecting anomalies in real-time. Very visual.

• \`docker inspect air\` — Shows Docker expertise in JSON format 🐳

• \`curl\` — Shows fictional HTTP headers with \`x-security-level: BLUE CYBER HARDENED\`

Each one demonstrates that Adrian thinks like both attacker AND defender.`,
  },
  {
    keywords: ["project", "watchdog", "siem", "threat", "email", "hospital", "fraud", "bank"],
    response: `🎯 Adrian has 6 AI Security projects. Type these commands:

**LangGraph Medical Center** (8 agents)
→ \`cat proyectos/hospital.txt\`
Multi-agent medical system with parallel orchestration.

**Bank Fraud Detector** (Threshold 0.91)
→ \`cat proyectos/bankfraud.txt\`
Fraud prediction with calibrated Logistic Regression.

**WatchDogs OSINT** (Score: 95/100)
→ \`cat proyectos/watchdogs.txt\`
Multi-agent system with GPT-4 Vision for video analysis.

**Threat Intelligence Aggregator** (35 endpoints)
→ \`cat proyectos/threatintel.txt\`
NER with spaCy, BERT classification, LDA topic modeling.

**SIEM Anomaly Detector** (ROI $310k/year)
→ \`cat proyectos/siem.txt\`
ML ensemble: Isolation Forest + DBSCAN + GMM. 80% false positive reduction.

**Email Threat Platform** (95% accuracy)
→ \`cat proyectos/emailthreat.txt\`
Dual SPAM + Phishing detector with SOC dashboard.

Or type \`proyectos\` to see the quick list.`,
  },
  {
    keywords: ["experience", "work", "bbva", "job", "career", "cv", "resume"],
    response: `💼 Type \`experiencia\` to see full details. Summary:

**[Current] BBVA Technology** — AI Security Architect
Financial Intelligence Unit. Hybrid AI architectures, GenAI/LLM security, SIGINT processing of +10M interactions/year.

**[2024-2026] BBVA Technology** — AI/ML Engineer
Hybrid RAG, NLP, risk models (Fraud Scoring), +22% AUC-ROC.

**[2020-2024] Ecoembes** — ML Engineer
Computer Vision Edge AI for recycling. 45k images/hour, <100ms latency.

**[2017-2020] Capgemini** — Junior Data Scientist
AWS Data Lakes, predictive modeling, serverless automation.

7+ years of evolution: Data → ML → AI → AI Security.`,
  },
  {
    keywords: ["skill", "tech", "stack", "know", "language", "programming"],
    response: `⚡ Type \`skills\` for full details. Main stack:

**🔒 AI Security:**
OWASP LLM Top 10, MITRE ATLAS, Adversarial Robustness Toolbox, LLM Red Teaming, Prompt Injection Defense

**🤖 AI/ML Engineering:**
LLMs (Llama, Mistral, GPT), RAG Systems, PyTorch, LangChain, LangGraph, vLLM, Fine-tuning (LoRA/QLoRA)

**🐳 Docker & Containers:**
Multi-stage builds, Rootless, Distroless, GPU/NVIDIA runtime, Trivy scanning

**☁️ Cloud:**
AWS (SageMaker, Bedrock, EKS), Azure (AKS, ExpressRoute), Kubernetes, Helm

**💻 Programming:**
Python, SQL, Bash, TypeScript, Spark, Kafka, PostgreSQL

**🌍 Languages:**
Spanish (native), English (professional), Italian (professional), Chinese (basic)`,
  },
  {
    keywords: ["contact", "email", "linkedin", "github", "hire", "talk", "reach"],
    response: `📬 Contact info is in the footer icons. Quick access:

📧 **Email:** infantesromeroadrian@proton.me
💼 **LinkedIn:** linkedin.com/in/adrianinfantes
🐙 **GitHub:** github.com/infantesromeroadrian

📍 Madrid, Spain | CET (UTC+1)
🟢 Open to strategic opportunities in AI Security.`,
  },
  {
    keywords: ["education", "study", "master", "university", "degree", "school"],
    response: `🎓 Type \`estudios\` for full details. Education:

• **Master in Generative AI & Deep Learning** — MIOTI (2024-2025)
• **Master in Big Data & Data Science** — MIOTI (2022-2023)
• **Bachelor's in Software Engineering (AI)** — U-tad (2017-2021)
• **Network Systems Administration** — U-tad (2015-2017)

Certifications: Azure AI-102, AI-900, IT Specialist Python, ML Specialist IBM, OSINT, Linux 101, LangChain, EU AI Act, and more.

Type \`certificaciones\` to see them all.`,
  },
  {
    keywords: ["security", "cyber", "hacking", "pentest", "red team", "blue team"],
    response: `🔒 Adrian is an AI Security Architect. His approach:

**Offensive (Red Team):**
• LLM Red Teaming — Prompt Injection, Jailbreaks
• Adversarial ML — Model Evasion, Data Poisoning
• OWASP LLM Top 10 audits

**Defensive (Blue Team):**
• LLM Guardrails (Azure AI Content Safety)
• SIEM with ML for anomaly detection
• Secure deployment (air-gapped, GDPR compliant)

**Purple Team (both):**
• Threat modeling for AI systems
• MITRE ATLAS framework
• Secure hybrid architectures (NVIDIA DGX + Cloud)

Try these commands:
• \`hack\` — Portfolio security audit
• \`threat-map\` — SIEM dashboard with threats
• \`cve\` — Recent AI/ML vulnerabilities
• \`nmap\` — Port scanning simulation`,
  },
  {
    keywords: ["portfolio", "web", "page", "site", "terminal", "this"],
    response: `💻 This portfolio is a real interactive terminal:

**Tech Stack:** Preact + TypeScript + Vite + Tailwind CSS
**Background:** Neural Rain (falling ML symbols: λ∑∂θσ∇)
**Theme:** Blue Cyber (offensive + defensive security)
**Sound:** Mechanical keyboard clicks (toggle ♪ ON/OFF at top)

**Features:**
• Real keyboard input with cursor
• TAB autocomplete for all commands
• Command history with ↑↓
• 25+ commands including security easter eggs
• This AI assistant you're using
• Responsive design (mobile/tablet/desktop)

Source code: github.com/infantesromeroadrian/Web-Portfolio-AIR-Terminal`,
  },
  {
    keywords: ["who", "adrian", "about", "introduce", "yourself"],
    response: `Type \`whoami\` in the terminal for the full presentation.

Summary: **Adrian Infantes** is an AI Security Architect at BBVA Technology (Financial Intelligence Unit). 7+ years of experience in AI/ML, specialized in AI systems security.

His philosophy: "Defense in Depth applied to AI. An autonomous agent without hardening is an unacceptable risk."

Try \`neofetch\` to see his Linux-style "specs" 😎`,
  },
  {
    keywords: ["blog", "post", "article", "write", "read"],
    response: `📝 Adrian writes about AI Security. Type \`blog\` to see all posts.

**Latest posts:**

• **Docker: The AI Red Teamer's Secret Weapon**
  Why Docker is essential for AI Security testing
  → \`cat blog/docker-ai-redteam-arsenal.md\`

• **Defending Against Prompt Injection**
  Practical strategies for production LLMs
  → \`cat blog/prompt-injection-defense.md\`

• **Hardening Docker for ML Workloads**
  Security best practices for ML containers
  → \`cat blog/docker-ml-security.md\`

• **Production-Ready AI Agents with LangGraph**
  Architecture patterns for robust agents
  → \`cat blog/langgraph-agents-production.md\``,
  },
  {
    keywords: ["docker", "container", "kubernetes", "k8s"],
    response: `🐳 Docker is a core skill for Adrian. Highlights:

**Build Strategy:**
• Multi-stage builds (<100MB production images)
• Distroless/Alpine base images
• Layer optimization & caching

**Security:**
• Rootless containers
• Non-root users (USER 1000:1000)
• Trivy/Grype vulnerability scanning
• BuildKit secrets management

**ML/GPU:**
• NVIDIA Container Toolkit
• Model caching with named volumes
• Health checks for inference services

**Orchestration:**
• Docker Compose → Kubernetes migration
• Helm charts, GitOps (ArgoCD)
• ECR, ACR, Harbor registries

Try \`docker inspect air\` for a fun easter egg! 🐳`,
  },
];

// ── Fallback ────────────────────────────────────────────────

const FALLBACK = `I'm not sure what you're looking for. I can help with:

• **"what commands"** — Full list of available commands
• **"projects"** — The 6 AI Security projects
• **"experience"** — Adrian's career path
• **"skills"** — Technology stack
• **"contact"** — How to reach Adrian
• **"easter eggs"** — Hidden secrets 👀
• **"security"** — AI Security approach
• **"blog"** — Research articles
• **"docker"** — Container expertise

Or just type \`help\` in the terminal.`;

// ── Public API ─────────────────────────────────────────────

/**
 * Given a user message, returns the chatbot response.
 * Priority: first matching rule wins.
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
