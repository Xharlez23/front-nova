import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ChipOption { key: string; label: string; count?: number; }

@Component({ selector: 'app-filter-chips', standalone: true, templateUrl: './filter-chips.component.html', styleUrl: './filter-chips.component.css' })
export class FilterChipsComponent {
  @Input() options: ChipOption[] = [];
  @Input() selected = 'all';
  @Output() selectedChange = new EventEmitter<string>();
}