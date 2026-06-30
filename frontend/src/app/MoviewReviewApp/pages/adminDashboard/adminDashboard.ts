import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CommonModule} from '@angular/common';

register();
@Component({
  selector: 'adminDashboard',
  imports: [
    CommonModule
  ],
  templateUrl: './adminDashboard.html',
})
export class AdminDashboard {
  imageUrl = 'https://image.tmdb.org/t/p/w500';

  movies: any[] = [];
}
