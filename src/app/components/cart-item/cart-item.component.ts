import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CopPipe } from '../../shared/cop.pipe';
import { Product } from '../../shared/models';
import { ProductImageComponent } from '../product-image/product-image.component';

@Component({
  selector: 'app-cart-item',
  imports: [CopPipe, ProductImageComponent],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  @Input({ required: true }) product!: Product;
  @Input({ required: true }) qty!: number;
  @Output() qtyChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();
}
