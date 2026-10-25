import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutForm } from '../../shared/models';

@Component({
  selector: 'app-checkout-form',
  imports: [FormsModule],
  templateUrl: './checkout-form.component.html',
  styleUrl: './checkout-form.component.css'
})
export class CheckoutFormComponent implements OnInit {
  @Input() initialName = '';
  @Input() busy = false;
  @Input() msg = '';
  @Input() bad = false;
  @Output() confirmed = new EventEmitter<CheckoutForm>();
  form: CheckoutForm = { customer: '', phone: '', city: '', address: '', notes: '' };
  err = '';

  ngOnInit() { this.form.customer = this.initialName; }
  send() {
    const f = this.form;
    if (!f.customer || !f.phone || !f.city || !f.address) { this.err = 'Completa los campos obligatorios (*)'; return; }
    this.err = ''; this.confirmed.emit(f);
  }
}
