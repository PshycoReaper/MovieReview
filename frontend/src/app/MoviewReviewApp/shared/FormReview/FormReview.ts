import { Component, input, output, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../Interfaces/review.interface';

@Component({
  selector: 'form-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './FormReview.html',
})
export class FormReview implements OnInit, OnChanges {
  //==========================
  // Inputs/Outputs
  //==========================
  modaltitle = input.required<string>();
  buttonText = input.required<string>();
  reviewData = input<Review | null>(null); // Nuevo input para datos de edición

  // Eventos
  submitReview = output<Partial<Review>>();
  cancel = output<void>();

  //==========================
  // Signals y Variables
  //==========================
  showModal = signal(false);
  isLoading = signal(false);

  // Form fields
  userName = '';
  grade: number | null = null;
  review = '';
  idMovie: number | null = null;
  _id: number | null = null;

  //==========================
  // Ciclo de vida
  //==========================
  ngOnInit() {
    this.loadReviewData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reviewData'] && this.reviewData()) {
      this.loadReviewData();
    }
  }

  //==========================
  // Métodos públicos
  //==========================
  openModal(review?: Review) {
    if (review) {
      this.loadReviewData(review);
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.resetForm();
    this.cancel.emit();
  }

  publishReview() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading.set(true);

    // Construir objeto de reseña
    const reviewData: Partial<Review> = {
      userName: this.userName,
      grade: this.grade!,
      review: this.review,
      idMovie: this.idMovie || undefined
    };

    // Si estamos editando, incluir el ID
    if (this._id) {
      reviewData._id = this._id;
    }

    this.submitReview.emit(reviewData);
    this.isLoading.set(false);
    this.closeModal();
  }

  //==========================
  // Métodos privados
  //==========================
  private loadReviewData(review?: Review) {
    const data = review || this.reviewData();

    if (data) {
      this.userName = data.userName || '';
      this.grade = data.grade || null;
      this.review = data.review || '';
      this.idMovie = data.idMovie || null;
      this._id = data._id || null;
    }
  }

  private resetForm() {
    this.userName = '';
    this.grade = null;
    this.review = '';
    this.idMovie = null;
    this._id = null;
  }

  private validateForm(): boolean {
    if (!this.userName || this.userName.length < 3) {
      alert('El nombre debe tener al menos 3 caracteres.');
      return false;
    }

    if (this.grade === null || this.grade < 1 || this.grade > 5) {
      alert('Debes seleccionar una calificación válida.');
      return false;
    }

    if (!this.review || this.review.length < 15) {
      alert('La reseña debe tener al menos 15 caracteres.');
      return false;
    }

    return true;
  }

  // Getters para el template
  get isEditMode(): boolean {
    return !!this._id;
  }
}
