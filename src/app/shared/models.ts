export interface User { id: number; name: string; email: string; role: 'cliente' | 'admin'; }
export interface AuthResponse { token: string; user: User; }
export type EvalStatus = 'pendiente' | 'aprobado' | 'rechazado';
export type VoteValue = 'aprobado' | 'rechazado';
export interface Product {
  id: number; name: string; description?: string; category?: string;
  price: number; cost?: number; stock: number; image?: string | null;
  source_url?: string; eval_status?: EvalStatus; active?: boolean;
  approvals?: number; rejections?: number; my_vote?: VoteValue | null;
}
export interface VoteResult { eval_status: EvalStatus; approvals: number; rejections: number; my_vote: VoteValue; }
export interface CartLine { id: number; qty: number; }
export interface CheckoutForm { customer: string; phone: string; city: string; address: string; notes: string; }
export interface OrderItem { name: string; price: number; qty: number; }
export interface Order {
  id: number; total: number; status: string; created_at: string;
  customer?: string; phone?: string; city?: string; address?: string; items: OrderItem[];
}
export interface Report {
  totals: { orders: number; revenue: number; profit: number };
  byDay: { day: string; revenue: number }[];
  top: { name: string; units: number; revenue: number }[];
  lowStock: { id: number; name: string; stock: number }[];
  evals: { s: string; n: number }[];
}
export const ORDER_STATUSES = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
