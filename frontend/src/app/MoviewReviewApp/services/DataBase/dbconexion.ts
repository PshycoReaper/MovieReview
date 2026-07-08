import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../../Interfaces/review.interface';
import { Movie } from '../../Interfaces/movie.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DBconexion {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/';

  // Métodos para reseñas
  postReview(data: Review): Observable<any> {
    console.log('Enviando reseña al backend:', data);
    return this.http.post(this.apiUrl + 'api/reviews/postReview', data);
  }
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl + 'api/reviews/getReviews');
  }
  // Reseñas de una película específica
  getReviewsByMovie(movieId: string): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl + `api/reviews/getReviewsByMovie/${movieId}`);
  }
  updateReview(id: string, data: Partial<Review>): Observable<any> {
    console.log(`Actualizando reseña ${id}:`, data);
    return this.http.put(this.apiUrl + `api/reviews/updateReview/${id}`, data);
  }
  deleteReview(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + `api/reviews/deleteReview/${id}`);
  }
  // Método para obtener una reseña específica
  getReviewById(id: string): Observable<Review> {
    return this.http.get<Review>(this.apiUrl + `api/reviews/getReview/${id}`);
  }


  // Métodos para películas
  postMovie(data: Movie): Observable<any> {
    return this.http.post(this.apiUrl + 'api/movies/postMovie', data);
  }
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl + 'api/movies/getMovies');
  }
  // Obtener una película específica (para la página de detalle)
  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(this.apiUrl + `api/movies/getMovie/${id}`);
  }
  updateMovie(id: string, data: Movie): Observable<any> {
    return this.http.put(this.apiUrl + `api/movies/updateMovie/${id}`, data);
  }
  deleteMovie(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + `api/movies/deleteMovie/${id}`)
  }
}
