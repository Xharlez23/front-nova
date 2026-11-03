import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from './api.config';
import { AdminUser, FinanceSummary, Payout, PayoutInput, Purchase, PurchaseInput } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private http = inject(HttpClient);
  private base = `${API}/admin/finance`;
  admins() { return this.http.get<AdminUser[]>(`${this.base}/admins`); }
  summary() { return this.http.get<FinanceSummary>(`${this.base}/summary`); }
  purchases() { return this.http.get<Purchase[]>(`${this.base}/purchases`); }
  addPurchase(p: PurchaseInput) { return this.http.post(`${this.base}/purchases`, p); }
  payouts() { return this.http.get<Payout[]>(`${this.base}/payouts`); }
  addPayout(p: PayoutInput) { return this.http.post(`${this.base}/payouts`, p); }
  updatePurchase(id: number, p: PurchaseInput) { return this.http.put(`${this.base}/purchases/${id}`, p); }
  deletePurchase(id: number) { return this.http.delete(`${this.base}/purchases/${id}`); }
  updatePayout(id: number, p: PayoutInput) { return this.http.put(`${this.base}/payouts/${id}`, p); }
  deletePayout(id: number) { return this.http.delete(`${this.base}/payouts/${id}`); }
}