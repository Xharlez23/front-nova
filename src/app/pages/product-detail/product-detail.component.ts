import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { ShopService } from '../../core/shop.service';
import { CopPipe } from '../../shared/cop.pipe';
import { Product } from '../../shared/models';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail', standalone: true, imports: [RouterLink, CopPipe, ProductCardComponent],
  templateUrl: './product-detail.component.html', styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private shop = inject(ShopService);
  cart = inject(CartService);
  product: Product | null = null; related: Product[] = [];
  qty = 1; loading = true; added = false;

  ngOnInit() { this.route.paramMap.subscribe(m => this.load(Number(m.get('id')))); }
  load(id: number) {
    this.loading = true; this.qty = 1; this.added = false;
    this.shop.product(id).subscribe({
      next: p => { this.product = p; this.loading = false; this.loadRelated(p); scrollTo({ top: 0 }); },
      error: () => { this.product = null; this.loading = false; },
    });
  }
  loadRelated(p: Product) {
    this.shop.products().subscribe(l => this.related = l.filter(x => x.id !== p.id && !!p.category && x.category === p.category).slice(0, 4));
  }
  get inCart() { return this.cart.lines().find(l => l.id === this.product?.id)?.qty ?? 0; }
  get maxQty() { return Math.max(0, (this.product?.stock ?? 0) - this.inCart); }
  change(d: number) { this.qty = Math.max(1, Math.min(this.qty + d, this.maxQty || 1)); }
  add() {
    const p = this.product; if (!p || this.maxQty < 1) return;
    this.cart.addQty(p.id, this.qty, p.stock); this.added = true; this.qty = 1;
  }
  addRelated(p: Product) { this.cart.add(p.id, p.stock); }
}