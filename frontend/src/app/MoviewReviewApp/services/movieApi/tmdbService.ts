import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { map } from 'rxjs';
import { MovieMapper } from '../../Mappers/movie.mapper';
import { Genre } from '../../Interfaces/genre.interface';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private http = inject(HttpClient);

  private api = environment.tmdb.url;

  private headers = new HttpHeaders({
    accept: 'application/json',
    Authorization: `Bearer ${environment.tmdb.token}`,
  });

  getMovies() {
    return this.http
      .get<any>(`${this.api}/movie/popular`, {
        headers: this.headers,
      })
      .pipe(map((response) => response.results.map(MovieMapper.fromTmdb)));
  }

  //MÉTODO PARA BUSCAR PELÍCULAS
  buscarPeliculas(nombre: string) {

    return this.http.get<any>(
      `${this.api}/search/movie`,
      {
        headers: this.headers,
        params: {
          query: nombre,
          language: 'es-MX'
        }
      }
    )
      .pipe(
        map(response =>
          response.results.map(MovieMapper.fromTmdb)
        )
      );

  }

  //PARA EL GÉNERO; PUESTO QUE EN BUSCAR PELÍCULAS SOLO ARROJA NÚMEROS
  getGenres() {

    return this.http.get<{ genres: Genre[] }>(
      `${this.api}/genre/movie/list`,
      {
        headers: this.headers,
        params: {
          language: 'es-MX'
        }
      }
    );

  }

}
