import { Component, inject, signal } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../services/movieApi/tmdbService';
import { Movie } from '../../Interfaces/movie.interface';

register();
@Component({
  selector: 'adminDashboard',
  imports: [CommonModule],
  templateUrl: './adminDashboard.html',
})
export class AdminDashboard {

  private tmdbService = inject(TmdbService);

  imageUrl = 'https://image.tmdb.org/t/p/w500';

  moviesArray = signal<Movie[]>([]);
  usersArray = signal<number[]>([]);
  reviewsArray = signal<number[]>([]);

  constructor() {

    this.tmdbService.getMovies().subscribe((movies: Movie[]) => {

      this.moviesArray.set(movies);

      console.log(this.moviesArray());

      console.log('Length:', this.moviesArray().length);

    });

  }

}
