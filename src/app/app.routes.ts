import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'carrito', canActivate: [authGuard], loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
  {
    path: 'admin', canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'presentacion' },
      { path: 'presentacion', loadComponent: () => import('./pages/admin/presentation/presentation.component').then(m => m.PresentationComponent) },
      { path: 'productos', loadComponent: () => import('./pages/admin/products/products.component').then(m => m.ProductsComponent) },
      { path: 'pedidos', loadComponent: () => import('./pages/admin/orders/orders.component').then(m => m.OrdersComponent) },
      { path: 'informe', loadComponent: () => import('./pages/admin/report/report.component').then(m => m.ReportComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];