import { Injectable, computed, signal } from '@angular/core';
import { CartLine } from '../shared/models';
import { readJson, writeJson } from './storage';

// Guarda solo {id, cantidad}: los precios y el stock se leen siempre frescos del servidor
@Injectable({ providedIn: 'root' })
export class CartService {
  readonly lines = signal<CartLine[]>(readJson<CartLine[]>('cart_v3') || []);
  readonly count = computed(() => this.lines().reduce((a, l) => a + l.qty, 0));

  add(id: number, stock: number) {
    const list = this.lines().map(l => ({ ...l }));
    const line = list.find(l => l.id === id);
    if (line) { if (line.qty < stock) line.qty++; } else if (stock > 0) list.push({ id, qty: 1 });
    this.save(list);
  }
  setQty(id: number, qty: number, stock: number) {
    const q = Math.max(1, Math.min(Math.floor(+qty) || 1, stock));
    this.save(this.lines().map(l => l.id === id ? { ...l, qty: q } : l));
  }
  remove(id: number) { this.save(this.lines().filter(l => l.id !== id)); }
  clear() { this.save([]); }
  prune(validIds: number[]) { // quita productos que ya no existen
    const kept = this.lines().filter(l => validIds.includes(l.id));
    if (kept.length !== this.lines().length) this.save(kept);
  }
  private save(l: CartLine[]) { this.lines.set(l); writeJson('cart_v3', l); }
}
