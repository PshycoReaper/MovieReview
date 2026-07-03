export interface TableColumn {
  key: string;
  title: string;

  type?: 'text' | 'image' | 'date' | 'badge' | 'rating';

  formatter?: (value: any) => string;
}
