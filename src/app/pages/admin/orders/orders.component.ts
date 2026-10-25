import { Component, inject, OnInit } from '@angular/core';
import { OrderRowComponent } from '../../../components/order-row/order-row.component';
import { AdminService } from '../../../core/admin.service';
import { Order, ORDER_STATUSES } from '../../../shared/models';

@Component({
  selector: 'app-orders',
  imports: [OrderRowComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  private admin = inject(AdminService);
  orders: Order[] = []; statuses = ORDER_STATUSES;

  ngOnInit() { this.load(); }
  load() { this.admin.orders().subscribe(o => this.orders = o); }
  setStatus(o: Order, s: string) {
    this.admin.setOrderStatus(o.id, s).subscribe({
      next: () => o.status = s,
      error: e => { alert(e.error?.error || 'Error'); this.load(); },
    });
  }
}
