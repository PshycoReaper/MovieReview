import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { map } from 'rxjs';
import { MovieMapper } from '../../Mappers/movie.mapper';

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
}
