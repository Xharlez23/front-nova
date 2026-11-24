import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/cart.service';
import { ShopService } from '../../core/shop.service';
import { Product } from '../../shared/models';
import { CategoryStripComponent } from '../../components/category-strip/category-strip.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ToastService } from '../../core/toast.service';

type Sort = 'new' | 'lo' | 'hi' | 'az';

@Component({
  selector: 'app-catalog', standalone: true,
  imports: [FormsModule, ProductCardComponent, CategoryStripComponent, PaginatorComponent],
  templateUrl: './catalog.component.html', styleUrl: './catalog.component.css',
})
export class CatalogComponent implements OnInit {
  private shop = inject(ShopService);
  private cart = inject(CartService);
  private toast = inject(ToastService);
  @ViewChild('top') top?: ElementRef<HTMLElement>;

  items: Product[] = []; filtered: Product[] = [];
  q = ''; cat = 'Todos'; sort: Sort = 'new'; onlyStock = false;
  page = 1; readonly pageSize = 12;
  loading = true; error = ''; skeletons = [1, 2, 3, 4, 5, 6, 7, 8];

  ngOnInit() {
    this.shop.products().subscribe({
      next: r => { this.items = r; this.loading = false; this.apply(); },
      error: () => { this.error = 'No se pudo conectar con el servidor'; this.loading = false; },
    });
  }
  get categories() { return ['Todos', ...new Set(this.items.map(p => p.category).filter((c): c is string => !!c))]; }
  get featured() { return this.items.filter(p => p.image).slice(0, 3); }
  get paged() { const s = (this.page - 1) * this.pageSize; return this.filtered.slice(s, s + this.pageSize); }
  get hasFilters() { return !!this.q || this.cat !== 'Todos' || this.onlyStock; }

  apply() {
    const t = this.q.trim().toLowerCase();
    const l = this.items.filter(p =>
      (this.cat === 'Todos' || p.category === this.cat) && (!this.onlyStock || p.stock > 0) &&
      `${p.name} ${p.category ?? ''}`.toLowerCase().includes(t));
    if (this.sort === 'lo') l.sort((a, b) => a.price - b.price);
    else if (this.sort === 'hi') l.sort((a, b) => b.price - a.price);
    else if (this.sort === 'az') l.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    this.filtered = l; this.page = 1;
  }
  setQ(v: string) { this.q = v; this.apply(); }
  setCat(c: string) { this.cat = c; this.apply(); }
  setSort(s: Sort) { this.sort = s; this.apply(); }
  toggleStock() { this.onlyStock = !this.onlyStock; this.apply(); }
  clear() { this.q = ''; this.cat = 'Todos'; this.onlyStock = false; this.apply(); }
  goPage(p: number) { this.page = p; this.scrollTop(); }
  scrollTop() { this.top?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  add(p: Product) { this.cart.add(p.id, p.stock); this.toast.show('Añadido: ' + p.name); }
}