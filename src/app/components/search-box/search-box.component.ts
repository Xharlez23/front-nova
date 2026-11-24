import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({ selector: 'app-search-box', standalone: true, imports: [FormsModule], templateUrl: './search-box.component.html', styleUrl: './search-box.component.css' })
export class SearchBoxComponent {
  @Input() value = '';
  @Input() placeholder = 'Buscar…';
  @Output() valueChange = new EventEmitter<string>();
}