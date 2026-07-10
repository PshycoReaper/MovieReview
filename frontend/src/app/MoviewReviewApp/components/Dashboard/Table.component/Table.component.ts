import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../../Interfaces/tableColumns.interface';

@Component({
  selector: 'table-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Table.component.html',
})
export class TableComponent {
  // ==========================
  // Inputs
  // ==========================

  title = input.required<string>();

  buttonText = input<string>();

  columns = input.required<TableColumn[]>();

  data = input.required<any[]>();

  addRequired = input<boolean>(false);

  trackBy = input<string>('_id')

  // ==========================
  // Outputs
  // ==========================

  create = output<void>();

  edit = output<any>();

  delete = output<any>();
}
