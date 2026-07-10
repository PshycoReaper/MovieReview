import { Component, inject, signal, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TableComponent } from '../../../components/Dashboard/Table.component/Table.component';
import { TableColumn } from '../../../Interfaces/tableColumns.interface';
import { DBconexion } from '../../../services/DataBase/dbconexion';
import { ContactRequest } from '../../../Interfaces/contactRequest.interface';
import { FormContactRequest } from '../../../shared/FormContactRequest/FormContactRequest';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-petition-dashboard-page',
  imports: [TableComponent, FormContactRequest],
  templateUrl: './PetitionDashboardPage.html',
})
export class PetitionDashboardPage implements OnInit, OnDestroy {
  //==================
  // Signals
  //==================
  title = signal('Peticiones de usuarios');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private requestsArray = signal<ContactRequest[]>([]);
  private subscriptions = new Subscription();

  //==================
  // ViewChild
  //==================
  @ViewChild(FormContactRequest)
  formContactRequest!: FormContactRequest;

  //==================
  // Servicios
  //==================
  private dbconexion = inject(DBconexion);

  //==================
  // Configuración
  //==================
  trackBy = signal<string>('_id');

  requestColumns: TableColumn[] = [
    {
      key: 'requestType',
      title: 'Tipo',
      formatter: (value) => (value === 'movie_request' ? 'Solicitud de película' : 'Cambio de reseña'),
    },
    { key: 'fullName', title: 'Nombre' },
    { key: 'email', title: 'Correo' },
    { key: 'movieTitle', title: 'Película' },
    {
      key: 'status',
      title: 'Estado',
      badge: (value) =>
        value === 'resolved'
          ? { label: 'Resuelta', icon: 'bi-check-circle-fill', classes: 'bg-emerald-100 text-emerald-700' }
          : value === 'in_progress'
          ? { label: 'En proceso', icon: 'bi-arrow-repeat', classes: 'bg-blue-100 text-blue-700' }
          : { label: 'Pendiente', icon: 'bi-hourglass-split', classes: 'bg-amber-100 text-amber-700' },
    },
    {
      key: 'createdAt',
      title: 'Fecha',
      formatter: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  //==================
  // Computed
  //==================
  requests = this.requestsArray.asReadonly();

  //==================
  // Ciclo de vida
  //==================
  ngOnInit(): void {
    this.loadRequests();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  //==================
  // Métodos públicos
  //==================
  viewRequest(request: ContactRequest) {
    this.formContactRequest.openModal(request);
  }

  updateRequest(formData: Partial<ContactRequest>) {
    if (!formData._id) {
      console.error('No hay ID de petición para actualizar');
      return;
    }

    const requestId = formData._id;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const subscription = this.dbconexion.updateContactRequest(requestId, formData).subscribe({
      next: () => {
        this.loadRequests();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al actualizar la petición:', error);
        this.errorMessage.set('Error al actualizar la petición. Por favor, intenta nuevamente.');
        this.isLoading.set(false);
      },
    });

    this.subscriptions.add(subscription);
  }

  deleteRequest(request: ContactRequest) {
    if (!request._id) {
      console.error('El ID de la petición no existe');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar esta petición?')) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const subscription = this.dbconexion.deleteContactRequest(request._id).subscribe({
      next: () => {
        this.loadRequests();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al eliminar la petición:', error);
        this.errorMessage.set('Error al eliminar la petición.');
        this.isLoading.set(false);
      },
    });

    this.subscriptions.add(subscription);
  }

  //==================
  // Métodos privados
  //==================
  private loadRequests() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const subscription = this.dbconexion.getContactRequests().subscribe({
      next: (requests) => {
        this.requestsArray.set(requests);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar las peticiones:', error);
        this.errorMessage.set('Error al cargar las peticiones.');
        this.isLoading.set(false);
        this.requestsArray.set([]);
      },
    });

    this.subscriptions.add(subscription);
  }
}
