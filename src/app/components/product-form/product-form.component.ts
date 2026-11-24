import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopPipe } from '../../shared/cop.pipe';
import { Product } from '../../shared/models';
import { shrink } from '../../shared/utils';
import { MoneyInputComponent } from '../money-input/money-input.component';

@Component({
  selector: 'app-product-form', standalone: true, imports: [FormsModule, CopPipe, MoneyInputComponent],
  templateUrl: './product-form.component.html', styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  f: Partial<Product> = { active: true };
  submitted = false; err = '';
  // Con un producto entra en modo edición; con null vuelve a "nuevo"
  @Input() set product(p: Product | null) { this.f = p ? { ...p } : { active: true }; this.submitted = false; this.err = ''; }
  @Input() busy = false;
  @Input() msg = '';
  @Input() categories: string[] = [];
  @Output() save = new EventEmitter<Partial<Product>>();
  @Output() bulk = new EventEmitter<File[]>();
  @Output() cancelled = new EventEmitter<void>();

  get nameErr() { return this.f.name?.trim() ? '' : 'Escribe el nombre del producto'; }
  get priceErr() { return Number(this.f.price) > 0 ? '' : 'Indica el precio de venta'; }
  get urlErr() { const u = (this.f.source_url ?? '').trim(); return u && !/^https?:\/\//i.test(u) ? 'El enlace debe empezar por http:// o https://' : ''; }
  get profit() { return (Number(this.f.price) || 0) - (Number(this.f.cost) || 0); }
  get margin() { const p = Number(this.f.price) || 0; return p > 0 ? Math.round(this.profit * 100 / p) : null; }

  reset() { this.f = { active: true }; this.submitted = false; this.err = ''; }
  async onFile(e: Event) { const x = (e.target as HTMLInputElement).files?.[0]; if (x) this.f.image = await shrink(x); }
  removeImage() { this.f.image = null; }
  submit() {
    this.submitted = true;
    if (this.nameErr || this.priceErr || this.urlErr) return;
    this.save.emit(this.f);
  }
  onBulk(e: Event) { const el = e.target as HTMLInputElement; this.bulk.emit(Array.from(el.files || [])); el.value = ''; }
}