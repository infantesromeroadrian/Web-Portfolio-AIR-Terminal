/**
 * Items de navegación compartidos entre PageHeader y MobileBottomBar.
 *
 * Single source of truth: añadir/quitar una sección solo requiere
 * editar este array.
 */

export interface NavItem {
  label: string;
  command: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "WHOAMI", command: "whoami" },
  { label: "EDUCATION", command: "estudios" },
  { label: "EXPERIENCE", command: "experiencia" },
  { label: "SKILLS", command: "skills" },
  { label: "CERTIFICATIONS", command: "certificaciones" },
  { label: "PROJECTS", command: "proyectos" },
  { label: "BLOG", command: "blog" },
  { label: "THREATS", command: "threats" },
];
