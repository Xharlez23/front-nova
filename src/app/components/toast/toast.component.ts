import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-toast', standalone: true, imports: [RouterLink],
  template: `@if (toast.msg()) {<div class="t" role="status"><span>✓ {{ toast.msg() }}</span><a routerLink="/carrito">Ver carrito</a></div>}`,
  styles: [`.t{position:fixed;top:76px;left:50%;transform:translateX(-50%);z-index:60;display:flex;gap:14px;align-items:center;background:var(--navy-900);color:#fff;padding:12px 18px;border-radius:14px;box-shadow:0 14px 34px rgba(7,19,41,.35);max-width:calc(100vw - 28px);animation:in .22s ease-out}.t a{color:var(--accent);font-weight:700;text-decoration:none;white-space:nowrap}@keyframes in{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}`],
})
export class ToastComponent { toast = inject(ToastService); }