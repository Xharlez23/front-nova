import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopPipe } from '../../shared/cop.pipe';
import { AdminBalance, AdminUser, Payout, PayoutInput } from '../../shared/models';
import { MoneyInputComponent } from '../money-input/money-input.component';

@Component({
  selector: 'app-payout-form', standalone: true, imports: [FormsModule, CopPipe, MoneyInputComponent],
  templateUrl: './payout-form.component.html', styleUrl: './payout-form.component.css',
})
export class PayoutFormComponent {
  @Input() admins: AdminUser[] = [];
  @Input() balances: AdminBalance[] = [];
  @Input() busy = false;
  @Input() msg = '';
  @Output() save = new EventEmitter<PayoutInput>();
  @Output() cancelled = new EventEmitter<void>();

  editing: Payout | null = null;
  userId: number | null = null; amount: number | null = null; note = ''; submitted = false; err = '';

  @Input() set payout(p: Payout | null) {
    this.editing = p; this.err = ''; this.submitted = false;
    if (!p) { this.reset(); return; }
    this.userId = p.user_id; this.amount = +p.amount; this.note = p.note || '';
  }

  get pending() { return this.balances.find(b => b.id === this.userId)?.pending ?? 0; }
  // al editar, el pendiente ya descuenta esta misma devolución, así que se suma de vuelta
  get limit() { return this.pending + (this.editing && this.editing.user_id === this.userId ? +this.editing.amount : 0); }
  get userErr() { return this.userId ? '' : 'Elige el administrador'; }
  get amountErr() { return Number(this.amount) > 0 ? '' : 'Indica un monto mayor a cero'; }
  get over() { return !!this.userId && Number(this.amount) > Math.max(0, this.limit); }

  usePending() { this.amount = Math.max(0, this.limit); }
  reset() { this.userId = null; this.amount = null; this.note = ''; this.err = ''; this.submitted = false; }
  submit() {
    this.submitted = true;
    if (this.userErr || this.amountErr) return;
    this.save.emit({ user_id: this.userId as number, amount: Number(this.amount), note: this.note });
  }
}