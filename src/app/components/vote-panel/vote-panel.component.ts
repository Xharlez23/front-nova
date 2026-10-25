import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CopPipe } from '../../shared/cop.pipe';
import { Product, VoteValue } from '../../shared/models';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-vote-panel',
  imports: [CopPipe, StatusBadgeComponent],
  templateUrl: './vote-panel.component.html',
  styleUrl: './vote-panel.component.css'
})
export class VotePanelComponent {
  @Input({ required: true }) product!: Product;
  @Input() needed = 2;
  @Output() vote = new EventEmitter<VoteValue>();
  @Input() total = 3;
  get profit() { return this.product.price - (this.product.cost ?? 0); }
  get margin() { return this.product.price ? Math.round(this.profit * 100 / this.product.price) : 0; }
  get slots() {
    const a = this.product.approvals ?? 0, r = this.product.rejections ?? 0;
    return Array.from({ length: this.total }, (_, i) => i < a ? 'yes' : i < a + r ? 'no' : '');
  }
}
