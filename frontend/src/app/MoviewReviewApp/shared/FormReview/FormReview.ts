import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'form-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './FormReview.html',
})
export class FormReview {
  //==========================
  // Inputs
  //==========================
  modaltitle = input.required<string>();
  buttonText = input.required<string>();

  //==========================
  //Functions
  //==========================

  showModal = signal(false);

  userName = '';
  grade: number | null = null;
  review = '';

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false)

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
  }
}
