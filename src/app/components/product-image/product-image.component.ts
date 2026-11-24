import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-product-image',
  imports: [],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.css'
})
export class ProductImageComponent {
  @Input() src?: string | null;
  @Input() alt = '';
  @Input() mark = true;
  @HostBinding('class.wm') get wm() { return this.mark && !!this.src; }
}