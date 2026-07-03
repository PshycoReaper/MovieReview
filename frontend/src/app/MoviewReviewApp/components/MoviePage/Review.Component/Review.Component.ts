import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Review } from '../../../Interfaces/review.interface';
import { DBconexion } from '../../../services/DataBase/dbconexion';

@Component({
  selector: 'app-review',
  imports: [FormsModule, CommonModule],
  templateUrl: './Review.Component.html',
})
export class ReviewComponent {
  private dbConexion = inject(DBconexion);

  showModal = false;

  userName = '';
  grade: number | null = null;
  review = '';

  // Aquí se almacenan las reseñas obtenidas del backend
  reviewsFromBackend = signal<Review[]>([]);

  ngOnInit() {
    this.getReviewsFromBackend();
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
    const reviewData: Review = {
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
    this.dbConexion.getReviews().subscribe({
      next: (response: Review[]) => {
        this.reviewsFromBackend.set(response);
      },

      error: (err) => {
        console.error('❌ Error al obtener las reseñas:', err);
      },
    });
  }
}
