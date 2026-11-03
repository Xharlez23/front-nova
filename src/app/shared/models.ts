export interface User { id: number; name: string; email: string; role: 'cliente' | 'admin'; }
export interface AuthResponse { token: string; user: User; }
export type EvalStatus = 'pendiente' | 'aprobado' | 'rechazado';
export type VoteValue = 'aprobado' | 'rechazado';
export interface Product {
  id: number; name: string; description?: string; category?: string;
  price: number; cost?: number; stock: number; image?: string | null;
  source_url?: string; eval_status?: EvalStatus; active?: boolean;
  approvals?: number; rejections?: number; my_vote?: VoteValue | null;
  acquired?: boolean;
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
export interface AdminUser { id: number; name: string; }
export interface AdminBalance { id: number; name: string; invested: number; entitled: number; profit: number; paid: number; pending: number; }
export interface FinanceSummary {
  invested: number; revenue: number; cogs: number; profit: number; receivable: number; inventory: number; cash: number;
  admins: AdminBalance[];
}
export interface Contribution { user_id: number; amount: number; }
export interface Purchase {
  id: number; product_id: number; product: string; qty: number; unit_cost: number; extra_cost: number; total: number;
  notes: string; created_at: string; contributions: (Contribution & { name: string })[];
}
export interface PurchaseInput { product_id: number; qty: number; unit_cost: number; extra_cost: number; notes: string; contributions: Contribution[]; }
export interface Payout { id: number; user_id: number; name: string; amount: number; note: string; created_at: string; }
export interface PayoutInput { user_id: number; amount: number; note: string; }
