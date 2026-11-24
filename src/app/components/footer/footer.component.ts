import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STORE } from '../../core/store.config';
import { validPhone, whatsappUrl } from '../../shared/whatsapp';

const ICONS: Record<string, string> = {
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM17.5 6.5h.01',
  facebook: 'M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z',
  tiktok: 'M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.1 4.4 5 4.6',
  youtube: 'M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9v6l5-3z',
};
const FALLBACK = 'M3 12V4h8l10 10-8 8zM7.5 8h.01';

@Component({
  selector: 'app-footer', standalone: true, imports: [RouterLink],
  templateUrl: './footer.component.html', styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly store = STORE;
  readonly year = new Date().getFullYear();
  get waOk() { return validPhone(STORE.whatsapp); }
  get tel() { return 'tel:+' + STORE.whatsapp; }
  get chat() { return whatsappUrl(STORE.whatsapp, `Hola, quiero hacer una consulta en ${STORE.name}.`); }
  get support() { return whatsappUrl(STORE.whatsapp, `Hola, necesito soporte con mi compra en ${STORE.name}. Mi consulta es: `); }
  icon(key: string) { return ICONS[key] ?? FALLBACK; }
}