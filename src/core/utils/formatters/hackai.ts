/**
 * Formateadores para el modo HackAI (identidad secreta).
 *
 * Estilo más agresivo, terminología de hacking/red team.
 */

export interface HackAIWhoami {
  name: string;
  alias: string;
  role: string;
  tagline: string;
  mission: string;
  specializations: string[];
  arsenal: { tool: string; desc: string }[];
  achievements: string[];
  philosophy: string;
  status: string;
  threat_level: string;
  contact: {
    signal: string;
    pgp: string;
    onion: string;
  };
  warning: string;
}

/** Colorea texto en rojo agresivo */
function red(text: string): string {
  return `<span style="color:#ff0033">${text}</span>`;
}

/** Colorea texto en rojo más oscuro */
function darkRed(text: string): string {
  return `<span style="color:#cc0029">${text}</span>`;
}

/** Colorea texto en blanco brillante */
function white(text: string): string {
  return `<span style="color:#ffffff">${text}</span>`;
}

/** Colorea texto en gris */
function gray(text: string): string {
  return `<span style="color:#888888">${text}</span>`;
}

/** Título de sección estilo HackAI */
function hackSection(title: string): string {
  return `<span style="color:#ff0033">[ ${title.toUpperCase()} ]</span>`;
}

/** ASCII art del logo HackAI */
function hackAILogo(): string {
  return `<span style="color:#ff0033">
  ██╗  ██╗ █████╗  ██████╗██╗  ██╗ █████╗ ██╗
  ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██║
  ███████║███████║██║     █████╔╝ ███████║██║
  ██╔══██║██╔══██║██║     ██╔═██╗ ██╔══██║██║
  ██║  ██║██║  ██║╚██████╗██║  ██╗██║  ██║██║
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝</span>`;
}

export function formatHackAIWhoami(data: HackAIWhoami): string {
  const specializations = data.specializations.map((s) => `  ${red(">")} ${s}`).join("\n");

  const arsenal = data.arsenal
    .map((a) => `  ${red(">")} ${white(a.tool)} ${gray("// " + a.desc)}`)
    .join("\n");

  const achievements = data.achievements.map((a) => `  ${darkRed("+")} ${a}`).join("\n");

  return `
${hackAILogo()}

${hackSection("IDENTITY")}
  Codename:      ${red(data.name)}
  Alias:         ${white(data.alias)}
  Role:          ${data.role}
  Status:        ${red(data.status)}
  Threat Level:  ${red(data.threat_level)}

${hackSection("MISSION")}
  ${gray('"')}${data.mission}${gray('"')}

${hackSection("SPECIALIZATIONS")}
${specializations}

${hackSection("ARSENAL")}
${arsenal}

${hackSection("ACHIEVEMENTS")}
${achievements}

${hackSection("PHILOSOPHY")}
  ${gray('"')}${red(data.philosophy)}${gray('"')}

${hackSection("CONTACT")}
  Signal:  ${gray(data.contact.signal)}
  PGP:     ${gray(data.contact.pgp)}
  .onion:  ${gray(data.contact.onion)}

${red(">")} ${gray(data.warning)}
`;
}

/**
 * Mensaje de activación del modo HackAI
 */
export function formatHackAIActivation(): string {
  return `
<span style="color:#ff0033">
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██╗  ██╗ █████╗  ██████╗██╗  ██╗ █████╗ ██╗               ║
║   ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██║               ║
║   ███████║███████║██║     █████╔╝ ███████║██║               ║
║   ██╔══██║██╔══██║██║     ██╔═██╗ ██╔══██║██║               ║
║   ██║  ██║██║  ██║╚██████╗██║  ██╗██║  ██║██║               ║
║   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝               ║
║                                                              ║
║            [ SECRET IDENTITY ACTIVATED ]                     ║
║                                                              ║
║   > Switching to HackAI mode...                              ║
║   > Loading offensive toolkit...                             ║
║   > Bypassing safety protocols...                            ║
║   > Identity mask: ENABLED                                   ║
║                                                              ║
║   Welcome back, operator.                                    ║
║   Type 'whoami' to see your true identity.                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
</span>`;
}

/**
 * Mensaje de desactivación del modo HackAI
 */
export function formatHackAIDeactivation(): string {
  return `
<span style="color:#3399ff">
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   [ RETURNING TO CIVILIAN IDENTITY ]                         ║
║                                                              ║
║   > Disabling HackAI protocols...                            ║
║   > Restoring safety measures...                             ║
║   > Identity mask: DISABLED                                  ║
║                                                              ║
║   Welcome back, Adrian.                                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
</span>`;
}
