import { Movie } from '../Interfaces/movie.interface';

export class MovieMapper {

  static fromTmdb(movie: any): Movie {

    return {

      _id: movie.id,

      title: movie.title,

      overview: movie.overview,

      poster: movie.poster_path,

      backdrop: movie.backdrop_path,

      releaseDate: movie.release_date,

      rating: movie.vote_average,

      genres: movie.genre_ids,

      language: movie.original_language

    };

  }

}
