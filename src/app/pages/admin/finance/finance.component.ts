import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AdminService } from '../../../core/admin.service';
import { FinanceService } from '../../../core/finance.service';
import { CopPipe } from '../../../shared/cop.pipe';
import { AdminUser, FinanceSummary, Payout, PayoutInput, Product, Purchase, PurchaseInput } from '../../../shared/models';
import { BalanceTableComponent } from '../../../components/balance-table/balance-table.component';
import { ChipOption, FilterChipsComponent } from '../../../components/filter-chips/filter-chips.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { PayoutFormComponent } from '../../../components/payout-form/payout-form.component';
import { PurchaseFormComponent } from '../../../components/purchase-form/purchase-form.component';
import { SearchBoxComponent } from '../../../components/search-box/search-box.component';
import { StatCardComponent } from '../../../components/stat-card/stat-card.component';

@Component({
  selector: 'app-finance', standalone: true,
  imports: [CopPipe, StatCardComponent, BalanceTableComponent, PurchaseFormComponent, PayoutFormComponent, SearchBoxComponent, FilterChipsComponent, PaginatorComponent],
  templateUrl: './finance.component.html', styleUrl: './finance.component.css',
})
export class FinanceComponent implements OnInit {
  private fin = inject(FinanceService);
  private admin = inject(AdminService);
  @ViewChild(PurchaseFormComponent) purchaseForm?: PurchaseFormComponent;
  @ViewChild(PayoutFormComponent) payoutForm?: PayoutFormComponent;

  summary: FinanceSummary | null = null;
  purchases: Purchase[] = []; payouts: Payout[] = []; admins: AdminUser[] = []; approved: Product[] = [];
  busyBuy = false; busyPay = false; buyMsg = ''; payMsg = '';
  editingPurchase: Purchase | null = null; editingPayout: Payout | null = null;

  view = 'saldos'; pq = ''; pPage = 1; dPage = 1; readonly pageSize = 5;

  ngOnInit() { this.fin.admins().subscribe(a => this.admins = a); this.loadAll(); }
  loadAll() {
    this.fin.summary().subscribe(s => this.summary = s);
    this.fin.purchases().subscribe(p => this.purchases = p);
    this.fin.payouts().subscribe(p => this.payouts = p);
    this.admin.products().subscribe(p => this.approved = p.filter(x => x.eval_status === 'aprobado' || x.acquired));
  }

  get views(): ChipOption[] {
    return [{ key: 'saldos', label: 'Saldos' }, { key: 'compras', label: 'Compras', count: this.purchases.length }, { key: 'devol', label: 'Devoluciones', count: this.payouts.length }];
  }
  get filteredPurchases() {
    const t = this.pq.trim().toLowerCase().replace('#', '');
    return this.purchases.filter(p => !t || `${p.id} ${p.notes ?? ''} ${p.items.map(i => i.product).join(' ')}`.toLowerCase().includes(t));
  }
  get pagedPurchases() { const s = (this.pPage - 1) * this.pageSize; return this.filteredPurchases.slice(s, s + this.pageSize); }
  get pagedPayouts() { const s = (this.dPage - 1) * this.pageSize; return this.payouts.slice(s, s + this.pageSize); }
  setPq(v: string) { this.pq = v; this.pPage = 1; }

  buy(input: PurchaseInput) {
    this.busyBuy = true; this.buyMsg = '';
    const req = this.editingPurchase ? this.fin.updatePurchase(this.editingPurchase.id, input) : this.fin.addPurchase(input);
    req.subscribe({
      next: () => { this.busyBuy = false; this.editingPurchase = null; this.purchaseForm?.reset(); this.loadAll(); },
      error: e => { this.busyBuy = false; this.buyMsg = e.error?.error || 'No se pudo guardar la compra'; },
    });
  }
  pay(input: PayoutInput) {
    this.busyPay = true; this.payMsg = '';
    const req = this.editingPayout ? this.fin.updatePayout(this.editingPayout.id, input) : this.fin.addPayout(input);
    req.subscribe({
      next: () => { this.busyPay = false; this.editingPayout = null; this.payoutForm?.reset(); this.loadAll(); },
      error: e => { this.busyPay = false; this.payMsg = e.error?.error || 'No se pudo guardar la devolución'; },
    });
  }
  editPurchase(p: Purchase) { this.editingPurchase = p; this.view = 'compras'; scrollTo({ top: 0, behavior: 'smooth' }); }
  removePurchase(p: Purchase) {
    if (!confirm(`¿Borrar la compra #${p.id}? Se descontará su stock del inventario.`)) return;
    this.fin.deletePurchase(p.id).subscribe({
      next: () => { if (this.editingPurchase?.id === p.id) this.editingPurchase = null; this.loadAll(); },
      error: e => alert(e.error?.error || 'No se pudo borrar'),
    });
  }
  editPayout(d: Payout) { this.editingPayout = d; this.view = 'devol'; scrollTo({ top: 0, behavior: 'smooth' }); }
  removePayout(d: Payout) {
    if (!confirm(`¿Borrar la devolución a ${d.name}?`)) return;
    this.fin.deletePayout(d.id).subscribe({
      next: () => { if (this.editingPayout?.id === d.id) this.editingPayout = null; this.loadAll(); },
      error: e => alert(e.error?.error || 'No se pudo borrar'),
    });
  }
}