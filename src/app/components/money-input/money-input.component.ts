import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const fmt = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

@Component({
  selector: 'app-money-input', standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MoneyInputComponent), multi: true }],
  template: `
    <div class="m" [class.bad]="invalid" [class.off]="disabled">
      <span>$</span>
      <input type="text" inputmode="numeric" autocomplete="off" [attr.aria-label]="label"
        [placeholder]="placeholder" [value]="text" [disabled]="disabled" (input)="onInput($event)" (blur)="touched()">
    </div>`,
  styles: [`
    :host { display: block; }
    .m { display: flex; align-items: center; border: 1px solid #c6d4ec; border-radius: 12px; background: #fff; transition: box-shadow .15s, border-color .15s; }
    .m:focus-within { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(98, 156, 248, .25); }
    .m.bad { border-color: var(--red); background: #fff8f8; }
    .m.off { background: #f1f4fa; }
    span { padding-left: 13px; color: var(--muted); font-weight: 700; }
    input { border: 0 !important; box-shadow: none !important; background: transparent !important; padding-left: 6px; }
  `],
})
export class MoneyInputComponent implements ControlValueAccessor {
  @Input() placeholder = '0';
  @Input() invalid = false;
  @Input() label = 'Valor en pesos';
  text = ''; disabled = false;
  private change: (v: number | null) => void = () => {};
  touched: () => void = () => {};

  writeValue(v: number | null): void { this.text = v == null || (v as unknown) === '' ? '' : fmt.format(Math.round(+v || 0)); }
  registerOnChange(fn: (v: number | null) => void) { this.change = fn; }
  registerOnTouched(fn: () => void) { this.touched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }

  onInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '').slice(0, 12);
    this.text = digits ? fmt.format(+digits) : '';
    el.value = this.text;
    this.change(digits ? +digits : null);
  }
}