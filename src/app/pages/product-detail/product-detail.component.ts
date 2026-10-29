import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { ShopService } from '../../core/shop.service';
import { CopPipe } from '../../shared/cop.pipe';
import { Product } from '../../shared/models';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Title } from '@angular/platform-browser';
import { STORE } from '../../core/store.config';
import { validPhone, whatsappUrl } from '../../shared/whatsapp';

@Component({
  selector: 'app-product-detail', standalone: true, imports: [RouterLink, CopPipe, ProductCardComponent],
  templateUrl: './product-detail.component.html', styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {


  private title = inject(Title);
  private router = inject(Router);
  zoom = false; copied = false;
  readonly whatsapp = '573214226583'; // ← tu número con código de país, solo dígitos (ej. 573001234567)

  private route = inject(ActivatedRoute);
  private shop = inject(ShopService);
  cart = inject(CartService);
  product: Product | null = null; related: Product[] = [];
  qty = 1; loading = true; added = false;

  ngOnDestroy() { this.title.setTitle('Nova gadgets'); }
  @HostListener('document:keydown.escape') closeZoom() { this.zoom = false; }
  openZoom() { if (this.product?.image) this.zoom = true; }
  buyNow() { if (this.maxQty >= 1) this.add(); this.router.navigate(['/carrito']); }
  get hasWa() { return validPhone(STORE.whatsapp); }
  get waLink() { return whatsappUrl(STORE.whatsapp, `Hola, me interesa: ${this.product?.name} (${location.href})`); }
  async share() {
    const url = location.href;
    try {
      if (navigator.share) { await navigator.share({ title: this.product?.name, url }); return; }
      await navigator.clipboard.writeText(url);
      this.copied = true; setTimeout(() => this.copied = false, 2000);
    } catch { /* el usuario canceló */ }
  }

  ngOnInit() { this.route.paramMap.subscribe(m => this.load(Number(m.get('id')))); }

  load(id: number) {
    this.loading = true; this.qty = 1; this.added = false;
    this.shop.product(id).subscribe({
      next: p => {
        this.product = p; this.loading = false;
        this.title.setTitle(p.name + ' · Nova gadgets');
        this.loadRelated(p); scrollTo({ top: 0 });
      },
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