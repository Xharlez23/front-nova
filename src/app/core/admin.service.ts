import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from './api.config';
import { Order, Product, Report, VoteResult, VoteValue } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = `${API}/admin`;
  products() { return this.http.get<Product[]>(`${this.base}/products`); }
  saveProduct(p: Partial<Product>) { return p.id ? this.http.put(`${this.base}/products/${p.id}`, p) : this.http.post(`${this.base}/products`, p); }
  deleteProduct(id: number) { return this.http.delete(`${this.base}/products/${id}`); }
  vote(id: number, vote: VoteValue) { return this.http.patch<VoteResult>(`${this.base}/products/${id}/eval`, { vote }); }
  orders() { return this.http.get<Order[]>(`${this.base}/orders`); }
  setOrderStatus(id: number, status: string) { return this.http.patch(`${this.base}/orders/${id}`, { status }); }
  report() { return this.http.get<Report>(`${this.base}/reports/summary`); }
  exportCsv(kind: 'sales' | 'shopping') { return this.http.get(`${this.base}/export/${kind}`, { responseType: 'text' }); }
}
