import { Component, inject, signal } from '@angular/core';
import { TmdbService } from '../../../services/movieApi/tmdbService';
import { Movie } from '../../../Interfaces/movie.interface';
import { TableColumn } from '../../../Interfaces/tableColumns.interface';
import { TableComponent } from '../../../components/Dashboard/Table.component/Table.component';
import { Review } from '../../../Interfaces/review.interface';
import { DBconexion } from '../../../services/DataBase/dbconexion';

@Component({
  selector: 'principal-dashboard',
  imports: [TableComponent],
  templateUrl: './principalDashboard.html',
})
export class PrincipalDashboard {
  private tmdbService = inject(TmdbService);
  private dbconexion = inject(DBconexion);

  imageUrl = 'https://image.tmdb.org/t/p/w500';

  moviesApiArray = signal<Movie[]>([]);
  moviesDBArray = signal<Movie[]>([]);
  usersArray = signal<number[]>([]);
  reviewsArray = signal<Review[]>([]);

  constructor() {
    this.tmdbService.getMovies().subscribe((movies: Movie[]) => {
      this.moviesApiArray.set(movies);
    });
    this.dbconexion.getReviews().subscribe((reviews: Review[]) => {
      this.reviewsArray.set(reviews);
    });
  }

  title = signal<string>('Peliculas');
  buttonText = signal<string>('Agregar pelicula');

  movieColumns: TableColumn[] = [
    {
      key: 'title',
      title: 'Título',
    },

    {
      key: 'releaseDate',
      title: 'Año',

      formatter: (value) => new Date(value).getFullYear().toString(),
    },

    {
      key: 'rating',
      title: 'Calificación',

      formatter: (value) => `⭐ ${value}`,
    },
  ];

  deleteMovie($event: any) {}
  navigateToEditMovie($event: any) {
    throw new Error('Method not implemented.');
  }
}
