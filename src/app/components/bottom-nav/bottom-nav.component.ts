import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';

interface Tab { label: string; icon: string; path?: string; exact?: boolean; badge?: number; }

const ICONS: Record<string, string> = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  cart: 'M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2M9 20h.01M17 20h.01',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6',
  out: 'M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9',
  shield: 'M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z',
  vote: 'M7 11v9H4v-9zM7 11l4-8c1.5 0 2.5 1 2.5 2.5V9h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 20H7',
  box: 'M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9',
  coins: 'M4 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 7V6a2 2 0 0 1 2-2h11M16 13h.01',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  chart: 'M4 20V11M10 20V4M16 20v-7M3 20h18',
};

@Component({
  selector: 'app-bottom-nav', standalone: true, imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html', styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);
  icons = ICONS;
  url = signal(this.router.url);

  constructor() {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.url.set(e.urlAfterRedirects));
  }

  get tabs(): Tab[] {
    if (this.auth.isAdmin() && this.url().startsWith('/admin')) return [
      { path: '/admin/presentacion', label: 'Votar', icon: 'vote' },
      { path: '/admin/productos', label: 'Productos', icon: 'box' },
      { path: '/admin/finanzas', label: 'Finanzas', icon: 'coins' },
      { path: '/admin/pedidos', label: 'Pedidos', icon: 'list' },
      { path: '/admin/informe', label: 'Informe', icon: 'chart' },
    ];
    const tabs: Tab[] = [
      { path: '/', label: 'Inicio', icon: 'home', exact: true },
      { path: '/carrito', label: 'Carrito', icon: 'cart', badge: this.cart.count() },
    ];
    if (this.auth.isAdmin()) tabs.push({ path: '/admin', label: 'Admin', icon: 'shield' });
    tabs.push(this.auth.user() ? { label: 'Salir', icon: 'out' } : { path: '/login', label: 'Ingresar', icon: 'user' });
    return tabs;
  }
  logout() { this.auth.logout(); }
}