export interface Review {
  _id?: number;      // ID en la base de datos
  id?: number;       // ID alternativo
  idMovie?: number;
  userName: string;
  grade: number;
  review: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}
