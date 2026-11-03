import { Component, Input } from '@angular/core';
import { CopPipe } from '../../shared/cop.pipe';
import { AdminBalance } from '../../shared/models';

@Component({
  selector: 'app-balance-table', standalone: true, imports: [CopPipe],
  templateUrl: './balance-table.component.html', styleUrl: './balance-table.component.css',
})
export class BalanceTableComponent {
  @Input() rows: AdminBalance[] = [];
  get totals() {
    const t = { invested: 0, entitled: 0, profit: 0, paid: 0, pending: 0 };
    for (const r of this.rows) { t.invested += r.invested; t.entitled += r.entitled; t.profit += r.profit; t.paid += r.paid; t.pending += r.pending; }
    return t;
  }
}