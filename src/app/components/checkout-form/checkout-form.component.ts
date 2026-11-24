import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopPipe } from '../../shared/cop.pipe';
import { CheckoutForm } from '../../shared/models';

@Component({
  selector: 'app-checkout-form', standalone: true, imports: [FormsModule, CopPipe],
  templateUrl: './checkout-form.component.html', styleUrl: './checkout-form.component.css',
})
export class CheckoutFormComponent implements OnInit {
  @Input() initialName = '';
  @Input() busy = false;
  @Input() msg = '';
  @Input() bad = false;
  @Input() units = 0;
  @Input() total = 0;
  @Output() confirmed = new EventEmitter<CheckoutForm>();

  form: CheckoutForm = { customer: '', phone: '', city: '', address: '', notes: '' };
  submitted = false;

  ngOnInit() { this.form.customer = this.initialName; }
  get phoneOk() { return this.form.phone.replace(/\D/g, '').length >= 7; }
  get valid() { const f = this.form; return !!f.customer.trim() && this.phoneOk && !!f.city.trim() && !!f.address.trim(); }
  send() {
    this.submitted = true;
    if (!this.valid) return;
    const f = this.form;
    this.confirmed.emit({ customer: f.customer.trim(), phone: f.phone.trim(), city: f.city.trim(), address: f.address.trim(), notes: f.notes.trim() });
  }
}