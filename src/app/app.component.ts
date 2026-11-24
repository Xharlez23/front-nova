import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, BottomNavComponent, ToastComponent],
  templateUrl: './app.component.html', styleUrl: './app.component.css',
})
export class AppComponent {
  inAdmin = signal(false);
  tall = signal(false); // páginas con barra de compra fija (carrito y detalle)

  constructor() {
    const router = inject(Router);
    const apply = (u: string) => {
      this.inAdmin.set(u.startsWith('/admin'));
      this.tall.set(u.startsWith('/carrito') || u.startsWith('/producto'));
    };
    apply(router.url);
    router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => apply(e.urlAfterRedirects));
  }
}