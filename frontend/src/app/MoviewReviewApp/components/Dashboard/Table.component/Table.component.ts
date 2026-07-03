import { Component, input, output } from '@angular/core';
import { TableColumn } from '../../../Interfaces/tableColumns.interface';

@Component({
  selector: 'table-component',
  standalone: true,
  imports: [],
  templateUrl: './Table.component.html',
})
export class TableComponent {
  // ==========================
  // Inputs
  // ==========================

  title = input.required<string>();

  buttonText = input.required<string>();

  columns = input.required<TableColumn[]>();

  data = input.required<any[]>();

  // ==========================
  // Outputs
  // ==========================

  create = output<void>();

  edit = output<any>();

  delete = output<any>();
}
