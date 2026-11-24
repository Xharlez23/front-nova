import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { STORE } from '../../core/store.config';
import { CopPipe } from '../../shared/cop.pipe';
import { Order } from '../../shared/models';
import { validPhone, whatsappUrl } from '../../shared/whatsapp';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-order-row', standalone: true, imports: [FormsModule, CopPipe, StatusBadgeComponent],
  templateUrl: './order-row.component.html', styleUrl: './order-row.component.css',
})
export class OrderRowComponent {
  @Input({ required: true }) order!: Order;
  @Input() statuses: string[] = [];
  @Output() statusChange = new EventEmitter<string>();

  get wa(): string { // celulares de 10 dígitos se asumen colombianos (+57)
    const d = (this.order.phone ?? '').replace(/\D/g, '');
    const n = d.length === 10 ? '57' + d : d;
    return validPhone(n) ? whatsappUrl(n, `Hola ${this.order.customer}, te escribimos de ${STORE.name} por tu pedido #${this.order.id}.`) : '';
  }
}