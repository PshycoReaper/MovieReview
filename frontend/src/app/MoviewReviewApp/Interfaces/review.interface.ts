export interface Review {
  _id?: string;       // ID en la base de datos (Mongo ObjectId)
  id?: string;        // ID alternativo
  idMovie: string;    // ID de la película a la que pertenece la reseña (Mongo ObjectId)
  userName: string;
  grade: number;
  review: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}
