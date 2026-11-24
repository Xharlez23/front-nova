import { Component, EventEmitter, Input, Output } from '@angular/core';

const PATHS = {
  all: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  audio: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2zM20 15a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  puzzle: 'M10 4a2 2 0 1 1 4 0v2h4v4h-2a2 2 0 1 0 0 4h2v4h-4v-2a2 2 0 1 0-4 0v2H6v-4h2a2 2 0 1 0 0-4H6V6h4z',
  gift: 'M4 9h16v4H4zM6 13h12v7H6zM12 9v11M12 9c-2-4-6-3-5 0M12 9c2-4 6-3 5 0',
  tag: 'M3 12V4h8l10 10-8 8zM7.5 8h.01',
};

@Component({ selector: 'app-category-strip', standalone: true, templateUrl: './category-strip.component.html', styleUrl: './category-strip.component.css' })
export class CategoryStripComponent {
  @Input() categories: string[] = [];
  @Input() selected = 'Todos';
  @Output() picked = new EventEmitter<string>();

  icon(c: string): string {
    if (c === 'Todos') return PATHS.all;
    const k = c.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    if (/audio|sonido|audifon|parlante|musica/.test(k)) return PATHS.audio;
    if (/accesor|celular|cargador|cable|telefono/.test(k)) return PATHS.phone;
    if (/puzzle|rompecabez|juego|juguete/.test(k)) return PATHS.puzzle;
    if (/oferta|regalo|promo/.test(k)) return PATHS.gift;
    return PATHS.tag;
  }
}