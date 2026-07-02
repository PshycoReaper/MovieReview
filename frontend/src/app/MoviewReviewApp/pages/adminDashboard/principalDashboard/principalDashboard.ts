import { Component, inject, signal } from '@angular/core';
import { TmdbService } from '../../../services/movieApi/tmdbService';
import { Movie } from '../../../Interfaces/movie.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'principal-dashboard',
  imports: [DatePipe],
  templateUrl: './principalDashboard.html',
})
export class PrincipalDashboard {
  private tmdbService = inject(TmdbService);

  imageUrl = 'https://image.tmdb.org/t/p/w500';

  moviesApiArray = signal<Movie[]>([]);
  moviesDBArray = signal<Movie[]>([]);
  usersArray = signal<number[]>([]);
  reviewsArray = signal<number[]>([]);

  constructor() {
    this.tmdbService.getMovies().subscribe((movies: Movie[]) => {
      this.moviesApiArray.set(movies);

      console.log(this.moviesApiArray());

      console.log('Length:', this.moviesApiArray().length);
    });
  }
}
