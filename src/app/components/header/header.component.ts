import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-header', standalone: true, imports: [RouterLink],
  templateUrl: './header.component.html', styleUrl: './header.component.css',
})
export class HeaderComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  open = false;

  toggle() { this.open = !this.open; }
  close() { this.open = false; }
  logout(e: Event) { e.preventDefault(); this.close(); this.auth.logout(); }

  @HostListener('document:keydown.escape') onEsc() { this.close(); }
  @HostListener('window:resize') onResize() { if (window.innerWidth > 720) this.close(); }
}