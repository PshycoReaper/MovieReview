import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../../Interfaces/review.interface';

@Injectable({
  providedIn: 'root',
})
export class DBconexion {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/';

  //Metodos para las reseñas de peliculas
  postReview(data: any) {
    console.log('Enviando reseña al backend:', data);
    return this.http.post(this.apiUrl + 'api/movies/postReview', data);
  }
  getReviews() {
    return this.http.get<Review[]>(this.apiUrl + 'api/movies/getReviews');
  }
  /*sendMessage(endpoint: string, data: any) {
    return this.http.post(this.apiUrl + endpoint, data);
  }*/
}
