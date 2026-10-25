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
}
