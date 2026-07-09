import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DBconexion } from '../../services/DataBase/dbconexion';
import { ContactRequest, ContactRequestType } from '../../Interfaces/contactRequest.interface';

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ContactPage.html',
})
export class ContactPage {
  private dbConexion = inject(DBconexion);

  // ==========================
  // Estado del formulario
  // ==========================
  requestType: ContactRequestType | null = null;
  fullName = '';
  email = '';
  movieTitle = '';
  message = '';

  // ==========================
  // Estado de la UI
  // ==========================
  isLoading = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);

  // ==========================
  // Métodos
  // ==========================
  submitRequest() {
    if (!this.requestType) {
      this.errorMessage.set('Selecciona el tipo de solicitud.');
      return;
    }

    if (!this.fullName || !this.email || !this.message) {
      this.errorMessage.set('Completa todos los campos obligatorios.');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    const requestData: ContactRequest = {
      requestType: this.requestType,
      fullName: this.fullName,
      email: this.email,
      movieTitle: this.movieTitle || undefined,
      message: this.message,
    };

    this.dbConexion.postContactRequest(requestData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.submitted.set(true);
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Error al enviar la petición de contacto:', err);
        this.isLoading.set(false);
        this.errorMessage.set(
          'Ocurrió un error al enviar tu solicitud. Intenta nuevamente más tarde.'
        );
      },
    });
  }

  sendAnother() {
    this.submitted.set(false);
  }

  private resetForm() {
    this.requestType = null;
    this.fullName = '';
    this.email = '';
    this.movieTitle = '';
    this.message = '';
  }
}
