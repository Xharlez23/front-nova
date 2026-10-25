import { isDevMode } from '@angular/core';
// ⚠️ Pon aquí la URL de tu backend desplegado (debe terminar en /api, sin barra final)
const PROD_API = 'https://backend-nova-iota.vercel.app/api';
// ng serve usa el backend local; el build de producción (Vercel) usa PROD_API
export const API = isDevMode() ? 'https://backend-nova-iota.vercel.app/api' : PROD_API;
