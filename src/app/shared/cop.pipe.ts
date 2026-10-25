import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'cop', standalone: true })
export class CopPipe implements PipeTransform {
  private fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  transform(v: unknown): string { return this.fmt.format(Number(v) || 0); }
}
