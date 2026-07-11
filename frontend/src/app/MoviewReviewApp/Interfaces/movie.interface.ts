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

  // Promedio de calificaciones de las reseñas de la comunidad (viene calculado
  // desde el backend). null cuando la película aún no tiene reseñas.
  communityRating?: number | null;

}
