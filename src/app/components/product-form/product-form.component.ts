import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/models';
import { shrink } from '../../shared/utils';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  f: Partial<Product> = { active: true };
  err = '';
  // Con un producto entra en modo edición; con null vuelve a "nuevo"
  @Input() set product(p: Product | null) { this.f = p ? { ...p } : { active: true }; this.err = ''; }
  @Input() busy = false;
  @Input() msg = '';
  @Output() save = new EventEmitter<Partial<Product>>();
  @Output() bulk = new EventEmitter<File[]>();
  @Output() cancelled = new EventEmitter<void>();

  reset() { this.f = { active: true }; this.err = ''; }
  async onFile(e: Event) { const x = (e.target as HTMLInputElement).files?.[0]; if (x) this.f.image = await shrink(x); }
  submit() {
    if (!this.f.name?.trim() || this.f.price == null) { this.err = 'Nombre y precio de venta son obligatorios'; return; }
    this.err = ''; this.save.emit(this.f);
  }
  onBulk(e: Event) { const el = e.target as HTMLInputElement; this.bulk.emit(Array.from(el.files || [])); el.value = ''; }
}