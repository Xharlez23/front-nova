import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({ selector: 'app-paginator', standalone: true, templateUrl: './paginator.component.html', styleUrl: './paginator.component.css' })
export class PaginatorComponent {
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 12;
  @Output() pageChange = new EventEmitter<number>();

  get pages() { return Math.max(1, Math.ceil(this.total / this.pageSize)); }
  get from() { return this.total ? (this.page - 1) * this.pageSize + 1 : 0; }
  get to() { return Math.min(this.page * this.pageSize, this.total); }

  // 1 … 4 5 6 … 20: siempre muestra la primera, la última y las vecinas de la actual
  get items(): (number | '…')[] {
    const n = this.pages, p = this.page;
    if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
    const set = new Set([1, n, p - 1, p, p + 1]);
    if (p <= 3) [2, 3, 4].forEach(x => set.add(x));
    if (p >= n - 2) [n - 1, n - 2, n - 3].forEach(x => set.add(x));
    const list = [...set].filter(x => x >= 1 && x <= n).sort((a, b) => a - b);
    const out: (number | '…')[] = [];
    list.forEach((x, i) => { if (i && x - list[i - 1] > 1) out.push('…'); out.push(x); });
    return out;
  }
  go(p: number) { if (p >= 1 && p <= this.pages && p !== this.page) this.pageChange.emit(p); }
}