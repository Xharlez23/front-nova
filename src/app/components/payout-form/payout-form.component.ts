import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopPipe } from '../../shared/cop.pipe';
import { AdminBalance, AdminUser, Payout, PayoutInput } from '../../shared/models';

@Component({
  selector: 'app-payout-form', standalone: true, imports: [FormsModule, CopPipe],
  templateUrl: './payout-form.component.html', styleUrl: './payout-form.component.css',
})
export class PayoutFormComponent {
  @Input() admins: AdminUser[] = [];
  @Input() balances: AdminBalance[] = [];
  @Input() busy = false;
  @Input() msg = '';
  @Output() save = new EventEmitter<PayoutInput>();
  editing: Payout | null = null;
  @Output() cancelled = new EventEmitter<void>();
  @Input() set payout(p: Payout | null) {
    this.editing = p; this.err = '';
    if (!p) { this.reset(); return; }
    this.userId = p.user_id; this.amount = +p.amount; this.note = p.note || '';
  }
  userId: number | null = null; amount: number | null = null; note = ''; err = '';
  get pending() { return this.balances.find(b => b.id === this.userId)?.pending ?? 0; }
  usePending() { this.amount = Math.max(0, this.pending); }
  reset() { this.userId = null; this.amount = null; this.note = ''; this.err = ''; }
  submit() {
    if (!this.userId || !this.amount || this.amount <= 0) { this.err = 'Elige el administrador y un monto mayor a cero'; return; }
    this.err = ''; this.save.emit({ user_id: this.userId, amount: +this.amount, note: this.note });
  }
}