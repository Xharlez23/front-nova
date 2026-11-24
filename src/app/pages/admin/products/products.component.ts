import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AdminService } from '../../../core/admin.service';
import { Product } from '../../../shared/models';
import { STAGES, stageOf } from '../../../shared/stage';
import { shrink } from '../../../shared/utils';
import { AdminProductCardComponent } from '../../../components/admin-product-card/admin-product-card.component';
import { ChipOption, FilterChipsComponent } from '../../../components/filter-chips/filter-chips.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { ProductFormComponent } from '../../../components/product-form/product-form.component';
import { SearchBoxComponent } from '../../../components/search-box/search-box.component';

@Component({
  selector: 'app-products', standalone: true,
  imports: [ProductFormComponent, AdminProductCardComponent, SearchBoxComponent, FilterChipsComponent, PaginatorComponent],
  templateUrl: './products.component.html', styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private admin = inject(AdminService);
  @ViewChild(ProductFormComponent) form?: ProductFormComponent;

  items: Product[] = []; editing: Product | null = null;
  busy = false; msg = ''; loading = true; showForm = false;
  q = ''; stage = 'all'; page = 1; readonly pageSize = 12;

  ngOnInit() { this.load(); }
  load() {
    this.admin.products().subscribe({
      next: r => { this.items = r; this.loading = false; this.page = Math.min(this.page, this.pages); },
      error: () => this.loading = false,
    });
  }
  get cats() { return [...new Set(this.items.map(p => p.category).filter((c): c is string => !!c))]; }
  get options(): ChipOption[] {
    return [{ key: 'all', label: 'Todos', count: this.items.length },
      ...STAGES.map(s => ({ key: s.key, label: s.label, count: this.items.filter(p => stageOf(p) === s.key).length }))];
  }
  get filtered() {
    const t = this.q.trim().toLowerCase();
    return this.items.filter(p => (this.stage === 'all' || stageOf(p) === this.stage) && (!t || `${p.name} ${p.category ?? ''}`.toLowerCase().includes(t)));
  }
  get pages() { return Math.max(1, Math.ceil(this.filtered.length / this.pageSize)); }
  get paged() { const s = (this.page - 1) * this.pageSize; return this.filtered.slice(s, s + this.pageSize); }
  setQ(v: string) { this.q = v; this.page = 1; }
  setStage(s: string) { this.stage = s; this.page = 1; }

  toggleForm() { this.showForm = !this.showForm; if (this.showForm) scrollTo({ top: 0, behavior: 'smooth' }); }
  edit(p: Product) { this.editing = { ...p }; scrollTo({ top: 0, behavior: 'smooth' }); }
  cancel() { this.editing = null; this.showForm = false; }
  onSave(p: Partial<Product>) {
    this.busy = true; this.msg = '';
    this.admin.saveProduct(p).subscribe({
      next: () => { this.busy = false; this.editing = null; this.showForm = false; this.form?.reset(); this.load(); },
      error: e => { this.busy = false; this.msg = e.error?.error || 'No se pudo guardar'; },
    });
  }
  async onBulk(files: File[]) {
    this.busy = true;
    for (const f of files)
      await firstValueFrom(this.admin.saveProduct({ name: f.name.replace(/\.[^.]+$/, ''), image: await shrink(f), active: false, price: 0 }));
    this.busy = false; this.showForm = false; this.load();
  }
  update(p: Product, patch: Partial<Product>) { Object.assign(p, patch); this.admin.saveProduct(p).subscribe(); }
  remove(p: Product) {
    if (!confirm(`¿Borrar ${p.name}?`)) return;
    this.admin.deleteProduct(p.id).subscribe({ next: () => this.load(), error: e => alert(e.error?.error || 'No se pudo borrar') });
  }
}