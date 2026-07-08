import { Component, inject, signal, viewChild } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Movie } from '../../../Interfaces/movie.interface';
import { DBconexion } from '../../../services/DataBase/dbconexion';
import { TmdbService } from '../../../services/movieApi/tmdbService';
import { Genre } from '../../../Interfaces/genre.interface';
import { MovieForm } from '../../../components/MoviePage/MoviewFormComponent/MoviewFormComponent';

@Component({
  selector: 'movie-dashboard-page',
  imports: [MovieForm, RouterLink],
  templateUrl: './MovieDashboardPage.html',
})
export class MovieDashboardPage {
  // Injeccion del servicio DB
  private DBconexion = inject(DBconexion);
  private router = inject(Router);

  // INJECCION DEL SERVICIO TMDB
  private tmdbService = inject(TmdbService);

  // Referencia al componente MovieForm
  movieForm = viewChild(MovieForm);

  // LÓGICA PARA EL FORMULARIO DE AGREGAR MOVIE
  moviesCollection = signal<Movie[]>([]);

  // PARA EL GÉNERO DE PELÍCULAS
  genresCatalog = signal<Genre[]>([]);

  constructor() {
    this.getMovies();
    this.loadGenres();
  }

  // ABRIR MODAL PARA AGREGAR
  abrirModal(): void {
    this.movieForm()?.open();
  }

  // ABRIR MODAL PARA EDITAR
  editarPelicula(movie: Movie): void {
    this.movieForm()?.open(movie);
  }

  // MANEJAR CUANDO SE GUARDA UNA PELÍCULA (desde MovieForm)
  onMovieSaved(movie: Movie): void {
    if (movie._id) {
      // Si tiene _id, es una actualización
      this.actualizarPelicula(movie);
    } else {
      // Si no tiene _id, es una nueva
      this.sendPelicula(movie);
    }
  }

  // ENVIAR NUEVA PELÍCULA
  sendPelicula(movie: Movie): void {
    console.log('Enviando nueva película:', movie);

    this.DBconexion.postMovie(movie).subscribe({
      next: (response) => {
        console.log('✅ Película agregada correctamente', response);
        alert('¡Película agregada exitosamente!');
        this.getMovies();
      },
      error: (err) => {
        console.error('❌ Error al enviar la película:', err);
        alert('Error al agregar la película. Por favor, intenta de nuevo.');
      },
    });
  }

  // ACTUALIZAR PELÍCULA
  actualizarPelicula(movie: Movie): void {
    const peliculaId = movie._id;

    if (!peliculaId) {
      console.error('❌ No hay ID de película para actualizar');
      return;
    }

    console.log('Actualizando película:', movie);

    this.DBconexion.updateMovie(peliculaId, movie).subscribe({
      next: (respuesta) => {
        console.log('✅ Película actualizada exitosamente', respuesta);
        alert('¡Película actualizada exitosamente!');
        this.getMovies();
      },
      error: (error) => {
        console.error('❌ Error al actualizar la película:', error);
        alert('Error al actualizar la película. Por favor, intenta de nuevo.');
      },
    });
  }

  // ELIMINAR PELÍCULA
  eliminarPelicula(movie: Movie): void {
    if (!confirm(`¿Estás seguro de eliminar "${movie.title}"?`)) {
      return;
    }

    if (!movie._id) {
      console.error('❌ No hay ID para eliminar');
      return;
    }

    console.log('Eliminando película:', movie._id);

    this.DBconexion.deleteMovie(movie._id).subscribe({
      next: (respuesta) => {
        console.log('✅ Película eliminada exitosamente', respuesta);
        alert('¡Película eliminada exitosamente!');
        this.getMovies();
      },
      error: (error) => {
        console.error('❌ Error al eliminar la película:', error);
        alert('Error al eliminar la película. Por favor, intenta de nuevo.');
      },
    });
  }

  // NAVEGAR A LAS RESEÑAS DE ESTA PELÍCULA ESPECÍFICA (dashboard admin)
  verResenas(movie: Movie): void {
    if (!movie._id) return;
    this.router.navigate(['/admin/reviews'], { queryParams: { movieId: movie._id } });
  }

  // OBTENER TODAS LAS PELÍCULAS
  getMovies(): void {
    this.DBconexion.getMovies().subscribe({
      next: (response: Movie[]) => {
        console.log('Películas obtenidas:', response);
        this.moviesCollection.set(response);
      },
      error: (err) => {
        console.error('❌ Error al obtener las películas:', err);
      },
    });
  }

  // CARGAR GÉNEROS
  loadGenres(): void {
    this.tmdbService.getGenres().subscribe({
      next: (response) => {
        this.genresCatalog.set(response.genres || []);
        console.log('Géneros cargados:', this.genresCatalog());
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
      },
    });
  }
}
