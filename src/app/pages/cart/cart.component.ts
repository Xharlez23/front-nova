import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { CheckoutFormComponent } from '../../components/checkout-form/checkout-form.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { ShopService } from '../../core/shop.service';
import { CopPipe } from '../../shared/cop.pipe';
import { Product, Order, CheckoutForm } from '../../shared/models';
import { RouterLink } from '@angular/router';
import { STORE } from '../../core/store.config';
import { orderMessage, validPhone, whatsappUrl } from '../../shared/whatsapp';

@Component({
  selector: 'app-cart',
  imports: [CopPipe, CartItemComponent, CheckoutFormComponent, StatusBadgeComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart = inject(CartService);
  private shop = inject(ShopService);
  userName = inject(AuthService).user()?.name ?? '';
  products = signal<Product[]>([]);
  items = computed(() => this.cart.lines().flatMap(l => {
    const p = this.products().find(x => x.id === l.id);
    return p ? [{ p, qty: l.qty }] : [];
  }));
  total = computed(() => this.items().reduce((a, i) => a + i.p.price * i.qty, 0));
  orders: Order[] = []; msg = ''; bad = false; busy = false;
  orderId = 0; wa = '';

  ngOnInit() {
    this.shop.products().subscribe(p => { this.products.set(p); this.cart.prune(p.map(x => x.id)); });
    this.loadOrders();
  }
  loadOrders() { this.shop.myOrders().subscribe(o => this.orders = o); }
  buy(form: CheckoutForm) {
  this.busy = true; this.msg = '';
  const snapshot = { items: this.items(), total: this.total() };
  this.shop.checkout(form, this.cart.lines()).subscribe({
    next: r => {
      this.orderId = r.orderId;
      this.wa = validPhone(STORE.whatsapp) ? whatsappUrl(STORE.whatsapp, orderMessage(r.orderId, form, snapshot.items, snapshot.total)) : '';
      this.busy = false; this.cart.clear(); this.loadOrders();
    },
    error: e => { this.msg = e.error?.error || 'Error al crear el pedido'; this.bad = true; this.busy = false; },
  });
}
}
