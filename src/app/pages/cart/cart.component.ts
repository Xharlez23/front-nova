import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { ShopService } from '../../core/shop.service';
import { STORE } from '../../core/store.config';
import { CopPipe } from '../../shared/cop.pipe';
import { CheckoutForm, Order, Product } from '../../shared/models';
import { orderMessage, validPhone, whatsappUrl } from '../../shared/whatsapp';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { CheckoutFormComponent } from '../../components/checkout-form/checkout-form.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-cart', standalone: true,
  imports: [RouterLink, CopPipe, CartItemComponent, CheckoutFormComponent, PaginatorComponent, StatusBadgeComponent],
  templateUrl: './cart.component.html', styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cart = inject(CartService);
  private shop = inject(ShopService);
  private auth = inject(AuthService);

  products = signal<Product[]>([]);
  loading = signal(true);
  items = computed(() => this.cart.lines().flatMap(l => { const p = this.products().find(x => x.id === l.id); return p ? [{ p, qty: l.qty }] : []; }));
  total = computed(() => this.items().reduce((a, i) => a + i.p.price * i.qty, 0));
  units = computed(() => this.items().reduce((a, i) => a + i.qty, 0));

  step: 'cart' | 'info' = 'cart';
  userName = this.auth.user()?.name ?? '';
  msg = ''; bad = false; busy = false; orderId = 0; wa = '';
  orders: Order[] = []; ordersPage = 1; readonly ordersPageSize = 5;

  ngOnInit() {
    this.shop.products().subscribe({
      next: p => { this.products.set(p); this.cart.prune(p.map(x => x.id)); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.loadOrders();
  }
  get pagedOrders() { const s = (this.ordersPage - 1) * this.ordersPageSize; return this.orders.slice(s, s + this.ordersPageSize); }
  loadOrders() { this.shop.myOrders().subscribe(o => this.orders = o); }
  next() { if (!this.items().length) return; this.step = 'info'; scrollTo({ top: 0 }); }

  buy(form: CheckoutForm) {
    this.busy = true; this.msg = '';
    const snap = { items: this.items(), total: this.total() }; // se arma antes de vaciar el carrito
    this.shop.checkout(form, this.cart.lines()).subscribe({
      next: r => {
        this.orderId = r.orderId;
        this.wa = validPhone(STORE.whatsapp) ? whatsappUrl(STORE.whatsapp, orderMessage(r.orderId, form, snap.items, snap.total)) : '';
        this.busy = false; this.cart.clear(); this.loadOrders(); scrollTo({ top: 0 });
      },
      error: e => { this.msg = e.error?.error || 'Error al crear el pedido'; this.bad = true; this.busy = false; },
    });
  }
}