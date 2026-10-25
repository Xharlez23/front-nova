import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AdminProductCardComponent } from '../../../components/admin-product-card/admin-product-card.component';
import { ProductFormComponent } from '../../../components/product-form/product-form.component';
import { AdminService } from '../../../core/admin.service';
import { Product } from '../../../shared/models';
import { shrink } from '../../../shared/utils';

@Component({
  selector: 'app-products',
  imports: [FormsModule, ProductFormComponent, AdminProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private admin = inject(AdminService);
  @ViewChild(ProductFormComponent) form?: ProductFormComponent;
  items: Product[] = []; filter = 'all'; editing: Product | null = null;
  busy = false; msg = '';

  ngOnInit() { this.load(); }
  load() { this.admin.products().subscribe(r => this.items = r); }
  get shown() { return this.filter === 'all' ? this.items : this.items.filter(p => p.eval_status === this.filter); }

  edit(p: Product) { this.editing = { ...p }; scrollTo({ top: 0, behavior: 'smooth' }); }
  onSave(p: Partial<Product>) {
    this.busy = true; this.msg = '';
    this.admin.saveProduct(p).subscribe({
      next: () => { this.busy = false; this.editing = null; this.form?.reset(); this.load(); },
      error: e => { this.busy = false; this.msg = e.error?.error || 'No se pudo guardar'; },
    });
  }
  async onBulk(files: File[]) {
    this.busy = true;
    for (const f of files)
      await firstValueFrom(this.admin.saveProduct({ name: f.name.replace(/\.[^.]+$/, ''), image: await shrink(f), active: false, price: 0 }));
    this.busy = false; this.load();
  }
  update(p: Product, patch: Partial<Product>) { Object.assign(p, patch); this.admin.saveProduct(p).subscribe(); }
  remove(p: Product) { if (confirm(`¿Borrar ${p.name}?`)) this.admin.deleteProduct(p.id).subscribe(() => this.load()); }
}