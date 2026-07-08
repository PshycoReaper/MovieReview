export interface Movie {

  _id?: string;

  title: string;

  overview: string;

  poster: string;

  backdrop: string;

  releaseDate: string;

  rating: number;

  genres: number[];

  language: string;

  // Cantidad de reseñas asociadas a esta película (viene calculado desde el backend)
  reviewsCount?: number;

}
