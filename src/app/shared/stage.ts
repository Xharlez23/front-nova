import { Product } from './models';

export type StageKey = 'pendiente' | 'rechazado' | 'aprobado' | 'inventario' | 'publicado';

export const STAGES: { key: StageKey; label: string }[] = [
  { key: 'pendiente', label: 'Pendientes' }, { key: 'aprobado', label: 'Por comprar' },
  { key: 'inventario', label: 'En inventario' }, { key: 'publicado', label: 'Publicados' }, { key: 'rechazado', label: 'Rechazados' },
];
export const STAGE_LABEL: Record<StageKey, string> = {
  pendiente: 'Pendiente', rechazado: 'Rechazado', aprobado: 'Aprobado · por comprar', inventario: 'En inventario', publicado: 'Publicado',
};

export function stageOf(p: Product): StageKey {
  if (p.eval_status === 'rechazado') return 'rechazado';
  if (p.eval_status !== 'aprobado') return 'pendiente';
  if (!p.acquired) return 'aprobado';
  return p.active ? 'publicado' : 'inventario';
}