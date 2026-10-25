import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopPipe } from '../../shared/cop.pipe';
import { Order } from '../../shared/models';

@Component({
  selector: 'app-order-row',
  imports: [FormsModule, CopPipe],
  templateUrl: './order-row.component.html',
  styleUrl: './order-row.component.css'
})
export class OrderRowComponent {
  @Input({ required: true }) order!: Order;
  @Input() statuses: string[] = [];
  @Output() statusChange = new EventEmitter<string>();
}
