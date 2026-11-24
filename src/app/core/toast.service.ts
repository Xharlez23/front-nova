import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly msg = signal('');
  private timer?: ReturnType<typeof setTimeout>;
  show(text: string) {
    this.msg.set(text); clearTimeout(this.timer);
    this.timer = setTimeout(() => this.msg.set(''), 2600);
  }
}