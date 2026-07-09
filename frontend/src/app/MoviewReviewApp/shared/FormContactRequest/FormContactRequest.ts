import { Component, input, output, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactRequest, ContactRequestStatus } from '../../Interfaces/contactRequest.interface';

@Component({
  selector: 'form-contact-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './FormContactRequest.html',
})
export class FormContactRequest implements OnChanges {
  //==========================
  // Inputs/Outputs
  //==========================
  requestData = input<ContactRequest | null>(null);

  submitUpdate = output<Partial<ContactRequest>>();
  cancel = output<void>();

  //==========================
  // Signals y variables
  //==========================
  showModal = signal(false);
  isLoading = signal(false);

  current: ContactRequest | null = null;

  status: ContactRequestStatus = 'pending';
  adminNotes = '';

  //==========================
  // Ciclo de vida
  //==========================
  ngOnChanges(changes: SimpleChanges) {
    if (changes['requestData'] && this.requestData()) {
      this.loadData(this.requestData()!);
    }
  }

  //==========================
  // Métodos públicos
  //==========================
  openModal(request: ContactRequest) {
    this.loadData(request);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.cancel.emit();
  }

  saveChanges() {
    if (!this.current?._id) {
      console.error('No hay ID de petición para actualizar');
      return;
    }

    this.isLoading.set(true);

    this.submitUpdate.emit({
      _id: this.current._id,
      status: this.status,
      adminNotes: this.adminNotes,
    });

    this.isLoading.set(false);
    this.closeModal();
  }

  //==========================
  // Getters para el template
  //==========================
  get typeLabel(): string {
    return this.current?.requestType === 'movie_request'
      ? 'Solicitud de película'
      : 'Cambio de reseña';
  }

  //==========================
  // Métodos privados
  //==========================
  private loadData(request: ContactRequest) {
    this.current = request;
    this.status = request.status || 'pending';
    this.adminNotes = request.adminNotes || '';
  }
}
