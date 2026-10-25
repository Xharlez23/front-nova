import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CopPipe } from '../../shared/cop.pipe';
import { Product } from '../../shared/models';
import { ProductImageComponent } from '../product-image/product-image.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-admin-product-card',
  imports: [CopPipe, ProductImageComponent, StatusBadgeComponent],
  templateUrl: './admin-product-card.component.html',
  styleUrl: './admin-product-card.component.css'
})
export class AdminProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() edit = new EventEmitter<Product>();
  @Output() remove = new EventEmitter<Product>();
  @Output() update = new EventEmitter<Partial<Product>>();
}
