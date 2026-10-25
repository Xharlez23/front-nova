import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  tabs = [
    { path: 'presentacion', label: '01 · Presentación' }, { path: 'productos', label: '02 · Productos' },
    { path: 'pedidos', label: '03 · Pedidos' }, { path: 'informe', label: '04 · Informe' },
  ];
}
