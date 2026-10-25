import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CartService } from '../../core/cart.service';
import { ShopService } from '../../core/shop.service';
import { Product } from '../../shared/models';

@Component({
  selector: 'app-catalog',
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  private shop = inject(ShopService);
  private cart = inject(CartService);
  items: Product[] = []; q = ''; cat = 'Todos'; sort: 'new' | 'lo' | 'hi' = 'new';
  loading = true; error = '';

  ngOnInit() {
    this.shop.products().subscribe({
      next: r => { this.items = r; this.loading = false; },
      error: () => { this.error = 'No se pudo conectar con el servidor'; this.loading = false; },
    });
  }
  get categories() { return ['Todos', ...new Set(this.items.map(p => p.category).filter((c): c is string => !!c))]; }
  get list() {
    const t = this.q.toLowerCase();
    const l = this.items.filter(p => (this.cat === 'Todos' || p.category === this.cat) && `${p.name} ${p.category ?? ''}`.toLowerCase().includes(t));
    if (this.sort === 'lo') l.sort((a, b) => a.price - b.price);
    if (this.sort === 'hi') l.sort((a, b) => b.price - a.price);
    return l;
  }
  add(p: Product) { this.cart.add(p.id, p.stock); }
}