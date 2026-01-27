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
  { label: "PERFIL", command: "cat profile.txt" },
  { label: "ESTUDIOS", command: "cat edu.txt" },
  { label: "EXPERIENCIA", command: "cat exp.txt" },
  { label: "HABILIDADES", command: "cat skills.txt" },
  { label: "CERTIFICACIONES", command: "cat certs.txt" },
  { label: "PROYECTOS", command: "ls projects/" },
  { label: "CONTACTO", command: "cat contact.txt" },
];
