import { Component, inject, signal, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent } from '../../../components/Dashboard/Table.component/Table.component';
import { TableColumn } from '../../../Interfaces/tableColumns.interface';
import { DBconexion } from '../../../services/DataBase/dbconexion';
import { Review } from '../../../Interfaces/review.interface';
import { Movie } from '../../../Interfaces/movie.interface';
import { FormReview } from '../../../shared/FormReview/FormReview';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review-dashboard-page',
  imports: [TableComponent, FormReview],
  templateUrl: './ReviewDashboardPage.html',
})
export class ReviewDashboardPage implements OnInit, OnDestroy {
  //==================
  // Signals
  //==================
  title = signal('Reseñas');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Si viene un ?movieId=<id> en la URL, se filtran las reseñas de esa película
  filteredMovieId = signal<string | null>(null);
  filteredMovie = signal<Movie | null>(null);

  // Mapa de idPelícula -> título, para mostrar el nombre en vez del ObjectId
  private movieTitlesMap = new Map<string, string>();

  private reviewsArray = signal<Review[]>([]);
  private subscriptions = new Subscription();
  private editingReview = signal<Review | null>(null);

  //==================
  // ViewChild
  //==================
  @ViewChild(FormReview)
  formReview!: FormReview;

  //==================
  // Servicios
  //==================
  private dbconexion = inject(DBconexion);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  //==================
  // Configuración
  //==================
  modalTittle = signal<string>('Editar Reseña');
  buttonText = signal<string>('Actualizar Reseña');
  trackBy = signal<string>('_id');

  reviewColumns: TableColumn[] = [
    { key: 'userName', title: 'Usuario' },
    { key: 'review', title: 'Contenido' },
    {
      key: 'grade',
      title: 'Calificación',
      badge: (value) => ({
        label: `${value}/5`,
        icon: 'bi-star-fill',
        classes: 'bg-amber-100 text-amber-700',
      }),
    },
    {
      key: 'idMovie',
      title: 'Película',
      formatter: (value) => this.movieTitlesMap.get(value) || 'Película no encontrada',
    },
    {
      key: 'createdAt',
      title: 'Fecha de Creación',
      formatter: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  //==================
  // Computed
  //==================
  reviews = this.reviewsArray.asReadonly();

  //==================
  // Ciclo de vida
  //==================
  constructor() {}

  ngOnInit(): void {
    // Cargar el catálogo de películas para poder mostrar su título en la tabla
    const moviesSub = this.dbconexion.getMovies().subscribe({
      next: (movies) => {
        movies.forEach((m) => {
          if (m._id) this.movieTitlesMap.set(m._id, m.title);
        });
      },
      error: (err) => console.error('Error al cargar películas para el mapeo:', err),
    });
    this.subscriptions.add(moviesSub);

    const subscription = this.route.queryParamMap.subscribe((params) => {
      const movieId = params.get('movieId');
      this.filteredMovieId.set(movieId);

      if (movieId) {
        this.dbconexion.getMovieById(movieId).subscribe({
          next: (movie) => this.filteredMovie.set(movie),
          error: () => this.filteredMovie.set(null),
        });
      } else {
        this.filteredMovie.set(null);
      }

      this.loadReviews();
    });

    this.subscriptions.add(subscription);
  }

  //==================
  // Filtro por película
  //==================
  clearMovieFilter(): void {
    this.router.navigate(['/admin/reviews']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  //==================
  // Métodos públicos
  //==================
  editReview(review: Review) {
    if (!review._id) {
      console.error('Review ID is missing');
      return;
    }

    console.log('Editando reseña:', review);
    this.editingReview.set(review);
    this.formReview.openModal(review);
  }

  updateReview(formData: Partial<Review>) {
    if (!formData._id) {
      console.error('No review ID for update');
      return;
    }

    const reviewId = formData._id;
    console.log('Actualizando reseña:', formData);

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Llamar al servicio de actualización
    const subscription = this.dbconexion.updateReview(reviewId, formData).subscribe({
      next: (response: any) => {
        console.log('Reseña actualizada exitosamente', response);
        this.loadReviews(); // Recargar la lista
        this.isLoading.set(false);
        this.editingReview.set(null);
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        this.errorMessage.set('Error al actualizar la reseña. Por favor, intenta nuevamente.');
        this.isLoading.set(false);
      },
    });

    this.subscriptions.add(subscription);
  }

  deleteReview(review: Review) {
    if (!review._id) {
      console.error('Review ID is missing');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const subscription = this.dbconexion.deleteReview(review._id).subscribe({
      next: () => {
        console.log('Reseña eliminada exitosamente');
        this.loadReviews();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this.errorMessage.set('Error al eliminar la reseña.');
        this.isLoading.set(false);
      },
    });

    this.subscriptions.add(subscription);
  }

  //==================
  // Métodos privados
  //==================
  private loadReviews() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const movieId = this.filteredMovieId();
    const request = movieId
      ? this.dbconexion.getReviewsByMovie(movieId)
      : this.dbconexion.getReviews();

    const subscription = request.subscribe({
      next: (reviews) => {
        this.reviewsArray.set(reviews);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar reseñas:', error);
        this.errorMessage.set('Error al cargar las reseñas.');
        this.isLoading.set(false);
        this.reviewsArray.set([]);
      },
    });

    this.subscriptions.add(subscription);
  }
}
