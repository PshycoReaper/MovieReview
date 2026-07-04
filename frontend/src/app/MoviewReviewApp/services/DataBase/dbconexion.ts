import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../../Interfaces/review.interface';
import { Movie } from '../../Interfaces/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class DBconexion {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/';

  //Metodos para las reseñas de peliculas
  postReview(data: Review) {
    console.log('Enviando reseña al backend:', data);
    return this.http.post(this.apiUrl + 'api/reviews/postReview', data);
  }
  getReviews() {
    return this.http.get<Review[]>(this.apiUrl + 'api/reviews/getReviews');
  }
  deleteReview(id: number) {
    return this.http.delete(this.apiUrl + `api/reviews/deleteReview/${id}`);
  }


  //Metodos para las peliculas
  postMovie(data:Movie){
    return this.http.post(this.apiUrl+ 'api/movies/postMovie', data)
  }
  getMovies(){
    return this.http.get<Movie[]>(this.apiUrl + 'api/movies/getMovies')
  }
  /*sendMessage(endpoint: string, data: any) {
    return this.http.post(this.apiUrl + endpoint, data);
  }*/
}
