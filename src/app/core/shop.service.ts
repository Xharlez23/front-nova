import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from './api.config';
import { CartLine, CheckoutForm, Order, Product } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private http = inject(HttpClient);
  products() { return this.http.get<Product[]>(`${API}/products`); }
  checkout(form: CheckoutForm, lines: CartLine[]) {
    return this.http.post<{ orderId: number }>(`${API}/orders`, { ...form, items: lines.map(l => ({ productId: l.id, qty: l.qty })) });
  }
  myOrders() { return this.http.get<Order[]>(`${API}/orders/mine`); }
}
