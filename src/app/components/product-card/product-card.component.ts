import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../shared/models';
import { ProductImageComponent } from '../product-image/product-image.component';
import { CopPipe } from '../../shared/cop.pipe';

@Component({
  selector: 'app-product-card',
  imports: [CopPipe, ProductImageComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() add = new EventEmitter<Product>();
}