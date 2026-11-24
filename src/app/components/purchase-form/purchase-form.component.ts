import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopPipe } from '../../shared/cop.pipe';
import { AdminUser, Product, Purchase, PurchaseInput } from '../../shared/models';
import { MoneyInputComponent } from '../money-input/money-input.component';

interface Line { productId: number | null; qty: number | null; unitCost: number | null; }

@Component({
  selector: 'app-purchase-form', standalone: true, imports: [FormsModule, CopPipe, MoneyInputComponent],
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
  lines: Line[] = [this.blank()]; extra: number | null = null; notes = '';
  amounts: Record<number, number | null> = {};
  step: 1 | 2 = 1; submitted = false; err = '';

  @Input() set purchase(p: Purchase | null) {
    this.editing = p; this.err = ''; this.submitted = false; this.step = 1;
    if (!p) { this.reset(); return; }
    this.lines = p.items.map(i => ({ productId: i.product_id, qty: i.qty, unitCost: +i.unit_cost }));
    this.extra = +p.extra_cost || null; this.notes = p.notes || '';
    this.amounts = {}; for (const c of p.contributions) this.amounts[c.user_id] = +c.amount;
  }

  private blank(): Line { return { productId: null, qty: 1, unitCost: null }; }
  lineTotal(l: Line) { return (+(l.qty ?? 0)) * (+(l.unitCost ?? 0)); }
  get total() { return Math.round(this.lines.reduce((a, l) => a + this.lineTotal(l), 0) + (+(this.extra ?? 0))); }
  get sum() { return this.admins.reduce((a, x) => a + (+(this.amounts[x.id] ?? 0)), 0); }
  get diff() { return this.total - this.sum; }
  get absDiff() { return Math.abs(this.diff); }

  availableFor(i: number) { // no deja elegir un producto que ya está en otra línea
    const used = new Set(this.lines.filter((_, k) => k !== i).map(l => l.productId));
    return this.products.filter(p => !used.has(p.id));
  }
  lineErr(l: Line): string {
    if (!l.productId) return 'Elige un producto';
    if (!(+(l.qty ?? 0) > 0)) return 'Indica las unidades';
    if (l.unitCost == null) return 'Indica el costo por unidad';
    return '';
  }
  get linesOk() { return this.lines.every(l => !this.lineErr(l)) && this.total > 0; }

  addLine() { this.lines.push(this.blank()); }
  removeLine(i: number) { if (this.lines.length > 1) this.lines.splice(i, 1); }
  split() { // reparte el total en partes iguales (lo que sobra se lo lleva el primero)
    const n = this.admins.length; if (!n) return;
    const base = Math.floor(this.total / n);
    this.admins.forEach((a, i) => this.amounts[a.id] = base + (i === 0 ? this.total - base * n : 0));
  }
  fill(a: AdminUser) { this.amounts[a.id] = Math.max(0, +(this.amounts[a.id] ?? 0) + this.diff); }

  next() {
    this.submitted = true;
    if (!this.linesOk) { this.err = 'Revisa los productos marcados en rojo'; return; }
    this.err = ''; this.submitted = false; this.step = 2; scrollTo({ top: 0, behavior: 'smooth' });
  }
  back() { this.step = 1; this.err = ''; }
  reset() { this.lines = [this.blank()]; this.extra = null; this.notes = ''; this.amounts = {}; this.err = ''; this.submitted = false; this.step = 1; }

  submit() {
    this.submitted = true;
    if (!this.linesOk) { this.step = 1; this.err = 'Revisa los productos marcados en rojo'; return; }
    if (this.diff !== 0) { this.step = 2; this.err = 'Lo aportado por los administradores debe sumar el costo total'; return; }
    this.err = '';
    this.save.emit({
      items: this.lines.map(l => ({ product_id: l.productId as number, qty: +(l.qty ?? 0), unit_cost: +(l.unitCost ?? 0) })),
      extra_cost: +(this.extra ?? 0), notes: this.notes,
      contributions: this.admins.map(a => ({ user_id: a.id, amount: +(this.amounts[a.id] ?? 0) })).filter(c => c.amount > 0),
    });
  }
}