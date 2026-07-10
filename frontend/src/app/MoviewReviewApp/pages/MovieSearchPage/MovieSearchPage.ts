import { Component, computed, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription, of, switchMap } from 'rxjs';

import { DBconexion } from '../../services/DataBase/dbconexion';
import { Movie } from '../../Interfaces/movie.interface';
import { NavbarComponent } from '../../shared/NavBarComponent/NavBarComponent';
import { FooterComponent } from '../../shared/FooterComponent/FooterComponent';

@Component({
  selector: 'app-movie-search',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './MovieSearchPage.html',
})
export class MovieSearchPage implements OnInit, OnDestroy {
  private dbconexion = inject(DBconexion);
  private subscriptions = new Subscription();

  //==================
  // Estado
  //==================
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  // Catálogo completo (todas las películas registradas en la base de datos)
  private moviesArray = signal<Movie[]>([]);
  movies = this.moviesArray.asReadonly();

  // Barra de búsqueda (sugerencias rápidas hacia el backend)
  buscarControlSearch = new FormControl('');
  searchTerm = signal('');
  resultadosPelisBusqueda = signal<Movie[]>([]);
  showSuggestions = signal(false);

  // Filtro por género (píldoras)
  selectedGenre = signal<string | null>(null);

  //==================
  // Computed
  //==================

  // Lista de géneros únicos, calculada a partir de las películas del catálogo
  // (el campo "genres" se guarda como texto separado por comas, ej. "Acción, Aventura, Comedia")
  availableGenres = computed(() => {
    const genresSet = new Set<string>();

    this.moviesArray().forEach((movie) => {
      if (!movie.genres) return;

      const genresText = Array.isArray(movie.genres) ? movie.genres.join(',') : String(movie.genres);

      genresText
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean)
        .forEach((g) => genresSet.add(g));
    });

    return Array.from(genresSet).sort();
  });

  // Catálogo visible: aplica el texto de búsqueda y el género seleccionado sobre el catálogo completo
  filteredMovies = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const genre = this.selectedGenre();

    return this.moviesArray().filter((movie) => {
      const matchesTerm = !term || movie.title.toLowerCase().includes(term);

      const movieGenres = Array.isArray(movie.genres) ? movie.genres.join(',') : String(movie.genres || '');
      const matchesGenre = !genre || movieGenres.toLowerCase().includes(genre.toLowerCase());

      return matchesTerm && matchesGenre;
    });
  });

  //==================
  // Ciclo de vida
  //==================
  ngOnInit(): void {
    this.loadMovies();

    const searchSub = this.buscarControlSearch.valueChanges
      .pipe(
        switchMap((nombre) => {
          this.searchTerm.set(nombre ?? '');

          if (!nombre || nombre.trim().length < 2) {
            this.resultadosPelisBusqueda.set([]);
            this.showSuggestions.set(false);
            return of([]);
          }

          this.showSuggestions.set(true);
          return this.dbconexion.getMovieByName(nombre.trim());
        }),
      )
      .subscribe({
        next: (pelis) => this.resultadosPelisBusqueda.set(pelis || []),
        error: () => this.resultadosPelisBusqueda.set([]),
      });

    this.subscriptions.add(searchSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  //==================
  // Métodos públicos
  //==================
  selectGenre(genre: string): void {
    this.selectedGenre.set(this.selectedGenre() === genre ? null : genre);
  }

  closeSuggestions(): void {
    // Pequeño retraso para permitir que el (click) del resultado se registre antes de ocultar la lista
    setTimeout(() => this.showSuggestions.set(false), 150);
  }

  clearSearch(): void {
    this.buscarControlSearch.setValue('');
    this.searchTerm.set('');
    this.resultadosPelisBusqueda.set([]);
    this.showSuggestions.set(false);
  }

  //==================
  // Métodos privados
  //==================
  private loadMovies(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const sub = this.dbconexion.getMovies().subscribe({
      next: (movies) => {
        this.moviesArray.set(movies);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el catálogo de películas:', err);
        this.errorMessage.set('No se pudo cargar el catálogo de películas.');
        this.isLoading.set(false);
      },
    });

    this.subscriptions.add(sub);
  }
}
