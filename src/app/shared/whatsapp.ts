import { CheckoutForm, Product } from './models';

const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export const validPhone = (n: string) => /^\d{8,15}$/.test(n);
export const whatsappUrl = (phone: string, text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

export function orderMessage(orderId: number, f: CheckoutForm, items: { p: Product; qty: number }[], total: number): string {
  return [
    `🛒 *Nuevo pedido #${orderId}*`,
    'Pago: *contra entrega*',
    '',
    `*Cliente:* ${f.customer}`,
    `*Celular:* ${f.phone}`,
    `*Ciudad:* ${f.city}`,
    `*Dirección:* ${f.address}`,
    ...(f.notes ? [`*Notas:* ${f.notes}`] : []),
    '',
    '*Productos:*',
    ...items.map(i => `• ${i.qty} × ${i.p.name} — ${cop.format(i.p.price * i.qty)}`),
    '',
    `*Total a pagar: ${cop.format(total)}*`,
  ].join('\n');
}