export interface BadgeConfig {
  label: string;
  icon: string;   // clase de Bootstrap Icons, ej. 'bi-star-fill'
  classes: string; // clases de color/fondo del badge
}

export interface TableColumn {
  key: string;
  title: string;

  type?: 'text' | 'image' | 'date' | 'badge' | 'rating';

  formatter?: (value: any) => string;

  // Si se define, la columna se renderiza como una "píldora" con ícono en vez de texto plano
  badge?: (value: any) => BadgeConfig;
}
