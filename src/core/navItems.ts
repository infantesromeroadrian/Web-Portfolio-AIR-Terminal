/**
 * Items de navegación compartidos entre PageHeader y SideMenu.
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
  { label: "ESTUDIOS", command: "estudios" },
  { label: "EXPERIENCIA", command: "experiencia" },
  { label: "SKILLS", command: "skills" },
  { label: "CERTIFICACIONES", command: "certificaciones" },
  { label: "PROYECTOS", command: "proyectos" },
  { label: "BLOG", command: "blog" },
  { label: "CONTACTO", command: "contacto" },
];
