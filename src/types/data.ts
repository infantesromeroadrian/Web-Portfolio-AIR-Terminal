/**
 * Tipos centralizados para los datos del portfolio.
 *
 * Este archivo define todas las interfaces que representan la estructura
 * de los archivos JSON en src/data/. Elimina la necesidad de usar 'any'
 * y proporciona autocompletado + validación en tiempo de compilación.
 *
 * Convenciones:
 *  - Interfaces con sufijo 'Data' para datos raíz de cada JSON
 *  - Interfaces auxiliares para estructuras anidadas
 *  - Type literals para valores conocidos (colores, etc.)
 */

// =============================================================================
// TIPOS COMUNES (reutilizables en múltiples secciones)
// =============================================================================

/**
 * Colores soportados por el sistema de iconos.
 * Corresponden a los valores usados en colorIcon() de formatters.ts
 */
export type IconColor = "green" | "orange" | "red" | "blue" | "yellow" | "white";

/**
 * Item genérico con icono coloreado.
 * Usado en múltiples secciones: perfil, estudios, skills, etc.
 */
export interface IconItem {
  icon: string;
  color: IconColor;
  text: string;
}

/**
 * Item de contacto con label y valor.
 */
export interface ContactItem {
  icon: string;
  color: IconColor;
  label: string;
  value: string;
}

// =============================================================================
// WHOAMI
// =============================================================================

export interface WhoamiData {
  name: string;
  role: string;
  text: string;
}

// =============================================================================
// PERFIL
// =============================================================================

export interface PerfilData {
  title: string;
  description: string;
  specialization: IconItem[];
  goals: IconItem[];
}

// =============================================================================
// ESTUDIOS
// =============================================================================

export interface EstudioItem {
  id: string;
  titulo: string;
  inicio: string;
  fin: string;
  centro: string;
  ubicacion: string;
  temas: IconItem[];
}

export interface EstudiosData {
  title: string;
  items: EstudioItem[];
}

// =============================================================================
// EXPERIENCIA
// =============================================================================

export interface StackGroup {
  icon: string;
  color: IconColor;
  title: string;
  items: string[];
}

export interface ExperienciaItem {
  id: string;
  puesto: string;
  inicio: string;
  fin: string;
  empresa: string;
  ubicacion: string;
  responsabilidades: IconItem[];
  logros: IconItem[];
  stackGroups: StackGroup[];
}

export interface ExperienciaData {
  title: string;
  items: ExperienciaItem[];
}

// =============================================================================
// SKILLS
// =============================================================================

export interface SkillCategoria {
  nombre: string;
  items: IconItem[];
}

export interface SkillsData {
  title: string;
  categorias: SkillCategoria[];
}

// =============================================================================
// CERTIFICACIONES
// =============================================================================

export interface CertificacionObtenida {
  icon: string;
  color: IconColor;
  nombre: string;
  anio?: string;
  id?: string;
  url?: string;
  detalles: string[];
}

export interface CertificacionEnPreparacion {
  icon: string;
  color: IconColor;
  nombre: string;
  progreso: string;
  detalles: string[];
}

export interface CertificacionObjetivo {
  icon: string;
  color: IconColor;
  nombre: string;
}

export interface CertificacionesData {
  title: string;
  obtenidas: CertificacionObtenida[];
  enPreparacion: CertificacionEnPreparacion[];
  objetivos: CertificacionObjetivo[];
}

// =============================================================================
// CONTACTO
// =============================================================================

export interface ContactoData {
  title: string;
  items: ContactItem[];
  disponibilidad: IconItem[];
  idiomas: IconItem[];
}

// =============================================================================
// ASCII (Banners)
// =============================================================================

export interface AsciiData {
  bannerDesktop: string;
  messageDesktop: string;
  bannerMobile: string;
  messageMobile: string;
  bannerTablet: string;
  messageTablet: string;
}

// =============================================================================
// PROYECTOS
// =============================================================================

/**
 * Estructura de un proyecto individual.
 * Diseñado para visualización tipo terminal con comandos ls/cat.
 */
export interface ProyectoItem {
  nombre: string;
  archivo: string;
  descripcion: string;
  score: string;
  estado: string;
  github: string;
  detalles: string[];
  stack: string[];
}

/**
 * Mapa de proyectos indexados por clave (slug).
 * Permite acceso por nombre: proyectos["watchdogs"]
 */
export type ProyectosData = Record<string, ProyectoItem>;

// =============================================================================
// TERMINAL (tipos internos del hook)
// =============================================================================

export type OutputItemType = "raw" | "html";

export interface OutputItem {
  type: OutputItemType;
  content: string;
}

export interface TerminalState {
  output: OutputItem[];
  isTyping: boolean;
  isTypingCommand: boolean;
  hasInteracted: boolean;
  commandHistory: string[];
  availableCommands: string[];
  runCommand: (cmd: string) => Promise<void>;
  /** Ejecuta un comando escrito por el usuario (sin animación de typing) */
  executeUserCommand: (cmd: string) => void;
  clear: () => void;
}
