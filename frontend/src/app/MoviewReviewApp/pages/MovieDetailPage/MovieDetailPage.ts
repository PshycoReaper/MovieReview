import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../Interfaces/movie.interface';
import { DBconexion } from '../../services/DataBase/dbconexion';
import { ReviewComponent } from '../../components/MoviePage/Review.Component/Review.Component';

@Component({
  selector: 'app-movie-detail-page',
  imports: [CommonModule, ReviewComponent],
  templateUrl: './MovieDetailPage.html',
})
export class MovieDetailPage {
  private route = inject(ActivatedRoute);
  private dbConexion = inject(DBconexion);

  movie = signal<Movie | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  // ID de la película tomado de la ruta (/movie/:id)
  movieId = signal<string>('');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('No se especificó ninguna película.');
      this.isLoading.set(false);
      return;
    }

    this.movieId.set(id);
    this.loadMovie(id);
  }

  private loadMovie(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.dbConexion.getMovieById(id).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al obtener la película:', err);
        this.errorMessage.set('No se pudo encontrar la película solicitada.');
        this.isLoading.set(false);
      },
    });
  }
}
