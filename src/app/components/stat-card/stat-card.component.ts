import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() tone: '' | 'ok' | 'err' = '';
}
