import { Component, OnInit, inject } from '@angular/core';
import { AdminService } from '../../../core/admin.service';
import { ORDER_STATUSES, Order } from '../../../shared/models';
import { ChipOption, FilterChipsComponent } from '../../../components/filter-chips/filter-chips.component';
import { OrderRowComponent } from '../../../components/order-row/order-row.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { SearchBoxComponent } from '../../../components/search-box/search-box.component';

@Component({
  selector: 'app-orders', standalone: true,
  imports: [OrderRowComponent, SearchBoxComponent, FilterChipsComponent, PaginatorComponent],
  templateUrl: './orders.component.html', styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private admin = inject(AdminService);
  orders: Order[] = []; statuses = ORDER_STATUSES; loading = true;
  q = ''; status = 'all'; page = 1; readonly pageSize = 8;

  ngOnInit() { this.load(); }
  load() { this.admin.orders().subscribe({ next: o => { this.orders = o; this.loading = false; }, error: () => this.loading = false }); }

  get options(): ChipOption[] {
    return [{ key: 'all', label: 'Todos', count: this.orders.length },
      ...this.statuses.map(s => ({ key: s, label: s[0].toUpperCase() + s.slice(1), count: this.orders.filter(o => o.status === s).length }))];
  }
  get filtered() {
    const t = this.q.trim().toLowerCase().replace('#', '');
    return this.orders.filter(o => (this.status === 'all' || o.status === this.status) &&
      (!t || `${o.id} ${o.customer ?? ''} ${o.phone ?? ''} ${o.city ?? ''}`.toLowerCase().includes(t)));
  }
  get paged() { const s = (this.page - 1) * this.pageSize; return this.filtered.slice(s, s + this.pageSize); }
  setQ(v: string) { this.q = v; this.page = 1; }
  setStatus(s: string) { this.status = s; this.page = 1; }

  setOrderStatus(o: Order, s: string) {
    this.admin.setOrderStatus(o.id, s).subscribe({
      next: () => o.status = s,
      error: e => { alert(e.error?.error || 'Error'); this.load(); },
    });
  }
}