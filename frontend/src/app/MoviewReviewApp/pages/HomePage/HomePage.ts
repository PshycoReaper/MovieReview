import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

import { DBconexion } from '../../services/DataBase/dbconexion';
import { Movie } from '../../Interfaces/movie.interface';
import { Review } from '../../Interfaces/review.interface';
import { NavbarComponent } from '../../shared/NavBarComponent/NavBarComponent';
import { FooterComponent } from '../../shared/FooterComponent/FooterComponent';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './HomePage.html',
})
export class HomePage implements OnInit, OnDestroy {
  private dbconexion = inject(DBconexion);
  private subscriptions = new Subscription();

  //==================
  // Estado
  //==================
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  private moviesArray = signal<Movie[]>([]);
  private reviewsArray = signal<Review[]>([]);

  // Slide activo del carrusel principal
  currentSlide = signal(0);

  //==================
  // Tarjetas de "¿Qué puedes hacer?"
  //==================
  features = [
    {
      icon: 'bi-film',
      title: 'Explora el catálogo',
      description: 'Recorre todo el catálogo de FilmTalk y filtra por género para encontrar tu próxima película.',
      route: '/movies',
    },
    {
      icon: 'bi-chat-square-text-fill',
      title: 'Lee reseñas de la comunidad',
      description: 'Descubre lo que otros espectadores opinan antes de decidir qué ver esta noche.',
      route: '/movies',
    },
    {
      icon: 'bi-pencil-square',
      title: 'Comparte tu opinión',
      description: 'Califica y escribe tu propia reseña sobre cualquier película del catálogo.',
      route: '/movies',
    },
    {
      icon: 'bi-envelope-fill',
      title: 'Solicita cambios o títulos',
      description: '¿Falta una película o quieres modificar una reseña? Contáctanos y te ayudamos.',
      route: '/contact',
    },
  ];

  //==================
  // Computed
  //==================

  // Catálogo ordenado por calificación (de mayor a menor)
  private sortedByRating = computed(() =>
    [...this.moviesArray()].sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  );

  // Películas destacadas para el carrusel principal
  heroMovies = computed(() => this.sortedByRating().slice(0, 5));

  // Slide activo (con límites seguros por si el catálogo aún está cargando)
  activeMovie = computed(() => {
    const slides = this.heroMovies();
    if (slides.length === 0) return null;
    return slides[this.currentSlide() % slides.length];
  });

  // Película más popular del catálogo, usada en "Descripción general"
  featuredMovie = computed(() => this.sortedByRating()[0] ?? null);

  // Populares / En tendencia
  trendingMovies = computed(() => this.sortedByRating().slice(0, 6));

  // Últimas 2 reseñas publicadas (el backend ya las entrega ordenadas por fecha)
  recentReviews = computed(() => this.reviewsArray().slice(0, 2));

  // Mapa rápido idPelícula -> Película, para enriquecer las reseñas recientes
  private moviesById = computed(() => {
    const map = new Map<string, Movie>();
    this.moviesArray().forEach((movie) => {
      if (movie._id) map.set(movie._id, movie);
    });
    return map;
  });

  //==================
  // Ciclo de vida
  //==================
  ngOnInit(): void {
    this.loadHomeData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  //==================
  // Métodos públicos
  //==================
  nextSlide(): void {
    const total = this.heroMovies().length;
    if (total === 0) return;
    this.currentSlide.set((this.currentSlide() + 1) % total);
  }

  prevSlide(): void {
    const total = this.heroMovies().length;
    if (total === 0) return;
    this.currentSlide.set((this.currentSlide() - 1 + total) % total);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
  }

  // Película asociada a una reseña (para mostrar su póster y título)
  movieForReview(review: Review): Movie | undefined {
    return this.moviesById().get(review.idMovie);
  }

  initials(name: string): string {
    return name?.trim().charAt(0).toUpperCase() || '?';
  }

  //==================
  // Métodos privados
  //==================
  private loadHomeData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const sub = forkJoin({
      movies: this.dbconexion.getMovies(),
      reviews: this.dbconexion.getReviews(),
    }).subscribe({
      next: ({ movies, reviews }) => {
        this.moviesArray.set(movies || []);
        this.reviewsArray.set(reviews || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la página de inicio:', err);
        this.errorMessage.set('No se pudo cargar el contenido de inicio.');
        this.isLoading.set(false);
      },
    });

    this.subscriptions.add(sub);
  }
}
