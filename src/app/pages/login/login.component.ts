import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private router = inject(Router);
  registering = false; busy = false; err = '';
  f = { name: '', email: '', password: '' };

  submit() {
    this.busy = true; this.err = '';
    const req = this.registering ? this.auth.register(this.f) : this.auth.login(this.f);
    req.subscribe({
      next: r => this.router.navigate([r.user.role === 'admin' ? '/admin' : this.cart.count() ? '/carrito' : '/']),
      error: e => { this.err = e.error?.error || 'No se pudo conectar con el servidor'; this.busy = false; },
    });
  }
}
