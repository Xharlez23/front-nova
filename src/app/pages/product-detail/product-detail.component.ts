import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { ShopService } from '../../core/shop.service';
import { STORE } from '../../core/store.config';
import { ToastService } from '../../core/toast.service';
import { CopPipe } from '../../shared/cop.pipe';
import { Product } from '../../shared/models';
import { validPhone, whatsappUrl } from '../../shared/whatsapp';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail', standalone: true, imports: [RouterLink, CopPipe, ProductCardComponent],
  templateUrl: './product-detail.component.html', styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private shop = inject(ShopService);
  private title = inject(Title);
  private toast = inject(ToastService);
  private location = inject(Location);
  cart = inject(CartService);

  product: Product | null = null; related: Product[] = [];
  qty = 1; loading = true; zoom = false; copied = false;

  ngOnInit() { this.route.paramMap.subscribe(m => this.load(Number(m.get('id')))); }
  ngOnDestroy() { this.title.setTitle(STORE.name); }
  @HostListener('document:keydown.escape') closeZoom() { this.zoom = false; }

  load(id: number) {
    this.loading = true; this.qty = 1;
    this.shop.product(id).subscribe({
      next: p => {
        this.product = p; this.loading = false;
        this.title.setTitle(p.name + ' · ' + STORE.name);
        this.shop.products().subscribe(l => this.related = l.filter(x => x.id !== p.id && !!p.category && x.category === p.category).slice(0, 6));
        scrollTo({ top: 0 });
      },
      error: () => { this.product = null; this.loading = false; },
    });
  }
  get inCart() { return this.cart.lines().find(l => l.id === this.product?.id)?.qty ?? 0; }
  get maxQty() { return Math.max(0, (this.product?.stock ?? 0) - this.inCart); }
  change(d: number) { this.qty = Math.max(1, Math.min(this.qty + d, this.maxQty || 1)); }
  add() {
    const p = this.product; if (!p || this.maxQty < 1) return;
    this.cart.addQty(p.id, this.qty, p.stock);
    this.toast.show(`${this.qty} × ${p.name}`); this.qty = 1;
  }
  buyNow() {
    const p = this.product;
    if (p && this.maxQty >= 1) this.cart.addQty(p.id, this.qty, p.stock);
    this.router.navigate(['/carrito']);
  }
  addRelated(p: Product) { this.cart.add(p.id, p.stock); this.toast.show('Añadido: ' + p.name); }
  openZoom() { if (this.product?.image) this.zoom = true; }
  back(e: Event) { e.preventDefault(); history.length > 1 ? this.location.back() : this.router.navigate(['/']); }

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
}