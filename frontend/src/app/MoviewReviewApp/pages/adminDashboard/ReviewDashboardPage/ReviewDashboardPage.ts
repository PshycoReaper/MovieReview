import { Component, inject, signal, ViewChild } from '@angular/core';
import { TableComponent } from '../../../components/Dashboard/Table.component/Table.component';
import { TableColumn } from '../../../Interfaces/tableColumns.interface';
import { DBconexion } from '../../../services/DataBase/dbconexion';
import { Review } from '../../../Interfaces/review.interface';
import { FormReview } from '../../../shared/FormReview/FormReview';

@Component({
  selector: 'app-review-dashboard-page',
  imports: [TableComponent, FormReview],
  templateUrl: './ReviewDashboardPage.html',
})

export class ReviewDashboardPage {

  //==================
  // Signals
  //==================

  title = signal('Reseñas');

  reviewsArray = signal<Review[]>([]);

  //==================
  // ViewChild
  //==================

  @ViewChild(FormReview)
  formReview!: FormReview;

  //==================
  // Servicios
  //==================

  private dbconexion = inject(DBconexion);

  //==================
  // Constructor
  //==================

  constructor() {
      this.loadReviews();
  }

  //==================
  // Métodos públicos
  //==================

  editReview(e: any) {
    console.log("Si jalo wey eh")
      this.formReview.openModal();
  }

  deleteReview(e: any) {
      this.dbconexion.deleteReview(e._id).subscribe(() => {
          this.loadReviews();
      });
  }

  //==================
  // Métodos privados
  //==================

  private loadReviews() {
      this.dbconexion.getReviews().subscribe({
          next: reviews => this.reviewsArray.set(reviews)
      });
  }

  //==================
  // Configuración tabla
  //==================
modalTittle= signal<string>('Editar Reseña')
buttonText = signal<string>('Publicar Cambios')
trackBy=signal<string>('_id')


 reviewColumns: TableColumn[] = [
  { key: '_id', title: 'ID' },
  { key: 'userName', title: 'Usuario' },
  { key: 'review', title: 'Contenido' },
  { key: 'grade', title: 'Calificación', formatter: (value) => `⭐ ${value}` },
  { key: 'idMovie', title: 'ID de Película' },
  { key: 'createdAt',
    title: 'Fecha de Creación',
    formatter: (value) => new Date(value).toLocaleDateString(),
  }
];

}
