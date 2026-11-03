import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopPipe } from '../../shared/cop.pipe';
import { AdminUser, Product, Purchase, PurchaseInput } from '../../shared/models';

@Component({
  selector: 'app-purchase-form', standalone: true, imports: [FormsModule, CopPipe],
  templateUrl: './purchase-form.component.html', styleUrl: './purchase-form.component.css',
})
export class PurchaseFormComponent {
  @Input() products: Product[] = [];
  @Input() admins: AdminUser[] = [];
  @Input() busy = false;
  @Input() msg = '';
  @Output() save = new EventEmitter<PurchaseInput>();
  editing: Purchase | null = null;
  @Output() cancelled = new EventEmitter<void>();
  @Input() set purchase(p: Purchase | null) {
    this.editing = p; this.err = '';
    if (!p) { this.reset(); return; }
    this.productId = p.product_id; this.qty = p.qty; this.unitCost = +p.unit_cost; this.extra = +p.extra_cost; this.notes = p.notes || '';
    this.amounts = {}; for (const c of p.contributions) this.amounts[c.user_id] = +c.amount;
  }
  productId: number | null = null; qty = 1; unitCost = 0; extra = 0; notes = '';
  amounts: Record<number, number> = {}; err = '';

  get total() { return Math.round((+this.qty || 0) * (+this.unitCost || 0) + (+this.extra || 0)); }
  get sum() { return this.admins.reduce((a, x) => a + (+this.amounts[x.id] || 0), 0); }
  get diff() { return this.total - this.sum; }
  get absDiff() { return Math.abs(this.diff); }

  split() { // reparte el total en partes iguales (lo que sobra se lo lleva el primero)
    const n = this.admins.length; if (!n) return;
    const base = Math.floor(this.total / n);
    this.admins.forEach((a, i) => this.amounts[a.id] = base + (i === 0 ? this.total - base * n : 0));
  }
  reset() { this.productId = null; this.qty = 1; this.unitCost = 0; this.extra = 0; this.notes = ''; this.amounts = {}; this.err = ''; }
  submit() {
    if (!this.productId) { this.err = 'Selecciona un producto'; return; }
    if (!(this.qty > 0) || this.total <= 0) { this.err = 'Indica las unidades y los costos'; return; }
    if (this.diff !== 0) { this.err = 'Lo aportado por los administradores debe sumar el costo total'; return; }
    this.err = '';
    this.save.emit({
      product_id: this.productId, qty: +this.qty, unit_cost: +this.unitCost, extra_cost: +this.extra, notes: this.notes,
      contributions: this.admins.map(a => ({ user_id: a.id, amount: +this.amounts[a.id] || 0 })).filter(c => c.amount > 0),
    });
  }
}