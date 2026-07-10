import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Review } from '../../../Interfaces/review.interface';
import { DBconexion } from '../../../services/DataBase/dbconexion';

@Component({
  selector: 'app-review',
  imports: [FormsModule, CommonModule],
  templateUrl: './Review.Component.html',
})
export class ReviewComponent implements OnInit, OnChanges {
  private dbConexion = inject(DBconexion);
  private route = inject(ActivatedRoute);

  // ID de la película a la que pertenecen estas reseñas.
  // Puede llegar por @Input (uso embebido, ej. MovieDetailPage) o
  // se toma del parámetro de ruta ':id' cuando se usa como página standalone (/movie/:id).
  movieId = input<string>();

  private resolvedMovieId: string | null = null;

  showModal = false;

  userName = '';
  grade: number | null = null;
  review = '';

  // Aquí se almacenan las reseñas obtenidas del backend
  reviewsFromBackend = signal<Review[]>([]);

  // Para el selector de calificación con íconos (1 a 5 estrellas)
  starOptions = [1, 2, 3, 4, 5];

  initials(name: string): string {
    return name?.trim().charAt(0).toUpperCase() || '?';
  }

  setGrade(value: number) {
    this.grade = value;
  }

  ngOnInit() {
    this.resolveMovieId();
    this.getReviewsFromBackend();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movieId']) {
      this.resolveMovieId();
      this.getReviewsFromBackend();
    }
  }

  private resolveMovieId() {
    this.resolvedMovieId = this.movieId() || this.route.snapshot.paramMap.get('id');
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;

    // Limpiar formulario
    this.userName = '';
    this.grade = null;
    this.review = '';
  }

  publishReview() {
    // Validación sencilla
    if (!this.userName || !this.review || this.grade === null) {
      alert('Completa todos los campos.');
      return;
    }

    this.sendReview();
  }

  sendReview() {
    if (!this.resolvedMovieId) {
      console.error('❌ No se pudo determinar el ID de la película para esta reseña');
      alert('No se pudo identificar la película. Recarga la página e intenta de nuevo.');
      return;
    }

    const reviewData: Review = {
      idMovie: this.resolvedMovieId,
      userName: this.userName,
      review: this.review,
      grade: this.grade!,
    };

    this.dbConexion.postReview(reviewData).subscribe({
      next: () => {
        console.log('✅ Reseña enviada correctamente');

        // Volver a consultar las reseñas para mostrar la nueva
        this.getReviewsFromBackend();

        // Cerrar y limpiar formulario
        this.closeModal();
      },

      error: (err) => {
        console.error('❌ Error al enviar la reseña:', err);
      },
    });
  }

  getReviewsFromBackend() {
    if (!this.resolvedMovieId) {
      this.reviewsFromBackend.set([]);
      return;
    }

    this.dbConexion.getReviewsByMovie(this.resolvedMovieId).subscribe({
      next: (response: Review[]) => {
        this.reviewsFromBackend.set(response);
        //console.log(this.reviewsFromBackend)
      },

      error: (err) => {
        console.error('❌ Error al obtener las reseñas:', err);
      },
    });
  }
}
