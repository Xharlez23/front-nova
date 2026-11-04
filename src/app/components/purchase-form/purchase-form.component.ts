import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopPipe } from '../../shared/cop.pipe';
import { AdminUser, Product, Purchase, PurchaseInput } from '../../shared/models';

interface Line { productId: number | null; qty: number; unitCost: number; }

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
  @Output() cancelled = new EventEmitter<void>();

  editing: Purchase | null = null;
  lines: Line[] = [this.blank()]; extra = 0; notes = '';
  amounts: Record<number, number> = {}; err = '';

  @Input() set purchase(p: Purchase | null) {
    this.editing = p; this.err = '';
    if (!p) { this.reset(); return; }
    this.lines = p.items.map(i => ({ productId: i.product_id, qty: i.qty, unitCost: +i.unit_cost }));
    this.extra = +p.extra_cost; this.notes = p.notes || '';
    this.amounts = {}; for (const c of p.contributions) this.amounts[c.user_id] = +c.amount;
  }

  private blank(): Line { return { productId: null, qty: 1, unitCost: 0 }; }
  lineTotal(l: Line) { return (+l.qty || 0) * (+l.unitCost || 0); }
  get total() { return Math.round(this.lines.reduce((a, l) => a + this.lineTotal(l), 0) + (+this.extra || 0)); }
  get sum() { return this.admins.reduce((a, x) => a + (+this.amounts[x.id] || 0), 0); }
  get diff() { return this.total - this.sum; }
  get absDiff() { return Math.abs(this.diff); }

  addLine() { this.lines.push(this.blank()); }
  removeLine(i: number) { if (this.lines.length > 1) this.lines.splice(i, 1); }
  split() { // reparte el total en partes iguales (lo que sobra se lo lleva el primero)
    const n = this.admins.length; if (!n) return;
    const base = Math.floor(this.total / n);
    this.admins.forEach((a, i) => this.amounts[a.id] = base + (i === 0 ? this.total - base * n : 0));
  }
  reset() { this.lines = [this.blank()]; this.extra = 0; this.notes = ''; this.amounts = {}; this.err = ''; }

  submit() {
    const ls = this.lines;
    if (ls.some(l => !l.productId)) { this.err = 'Selecciona el producto en cada línea'; return; }
    if (new Set(ls.map(l => l.productId)).size !== ls.length) { this.err = 'Un producto aparece repetido: suma sus unidades en una sola línea'; return; }
    if (ls.some(l => !(l.qty > 0) || !(l.unitCost >= 0))) { this.err = 'Revisa las unidades y los costos'; return; }
    if (this.total <= 0) { this.err = 'El costo total debe ser mayor a cero'; return; }
    if (this.diff !== 0) { this.err = 'Lo aportado por los administradores debe sumar el costo total'; return; }
    this.err = '';
    this.save.emit({
      items: ls.map(l => ({ product_id: l.productId as number, qty: +l.qty, unit_cost: +l.unitCost })),
      extra_cost: +this.extra || 0, notes: this.notes,
      contributions: this.admins.map(a => ({ user_id: a.id, amount: +this.amounts[a.id] || 0 })).filter(c => c.amount > 0),
    });
  }
}