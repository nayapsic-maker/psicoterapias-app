/* Repaso espaciado (sistema Leitner) para los ejercicios del modo estudio.
   Cada elemento (una escuela, un hito, un par de conceptos…) tiene un id con prefijo del ejercicio
   («esc:», «tl:», «cmp:», «tr:») y una caja del 0 al 5. Acertar sube de caja y espacia más el siguiente repaso;
   fallar lo devuelve a la caja 0. Todo se guarda solo en este navegador. */
import { useEffect, useState } from "react";

const CLAVE = "psiconautas:repaso:v1";
const MIN = 60000;
const DIA = 86400000;
export const INTERVALOS = [10 * MIN, DIA, 3 * DIA, 7 * DIA, 16 * DIA, 35 * DIA];
let mem = null;

function leer() {
  if (mem) return mem;
  try { mem = JSON.parse(localStorage.getItem(CLAVE) || "{}") || {}; } catch (e) { mem = {}; }
  return mem;
}
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(mem)); } catch (e) { /* sin almacenamiento: solo esta sesión */ }
  try { window.dispatchEvent(new Event("psn-repaso")); } catch (e) { /* sin ventana */ }
}

/* res: 0 = no la sabía, 1 = casi, 2 = la sabía */
export function registrar(id, res) {
  const m = leer();
  const r = m[id] || { caja: 0, vistos: 0, aciertos: 0 };
  r.vistos += 1;
  if (res === 2) { r.caja = Math.min(5, r.caja + 1); r.aciertos += 1; }
  else if (res === 0) r.caja = 0;
  r.ult = Date.now();
  r.prox = r.ult + INTERVALOS[r.caja];
  m[id] = r;
  guardar();
}

export const estado = (id) => leer()[id] || null;
export const vencido = (id) => { const r = leer()[id]; return !!r && r.prox <= Date.now(); };

/* Orden de estudio: primero lo vencido (lo más atrasado antes), luego lo nuevo, luego lo que aún no toca. */
export function ordenar(ids) {
  const ahora = Date.now();
  const m = leer();
  const azar = () => Math.random();
  return [...ids].sort((a, b) => {
    const ra = m[a], rb = m[b];
    const pa = !ra ? 1 : ra.prox <= ahora ? 0 : 2;
    const pb = !rb ? 1 : rb.prox <= ahora ? 0 : 2;
    if (pa !== pb) return pa - pb;
    if (pa === 0) return ra.prox - rb.prox;
    if (pa === 2) return ra.prox - rb.prox;
    return azar() - 0.5;
  });
}

export function resumen(ids) {
  const m = leer();
  const ahora = Date.now();
  let nuevas = 0, hoy = 0, dominadas = 0, proximo = null;
  ids.forEach((id) => {
    const r = m[id];
    if (!r) { nuevas += 1; return; }
    if (r.prox <= ahora) hoy += 1;
    else if (proximo === null || r.prox < proximo) proximo = r.prox;
    if (r.caja >= 4) dominadas += 1;
  });
  return { nuevas, hoy, dominadas, proximo, total: ids.length };
}

export function cuando(ts) {
  if (!ts) return "";
  const d = ts - Date.now();
  if (d <= 0) return "ahora";
  if (d < 3600000) return `en ${Math.max(1, Math.round(d / MIN))} min`;
  if (d < DIA) return `en ${Math.round(d / 3600000)} h`;
  return `en ${Math.round(d / DIA)} días`;
}

export function reiniciar(prefijo) {
  const m = leer();
  Object.keys(m).forEach((k) => { if (!prefijo || k.startsWith(prefijo)) delete m[k]; });
  guardar();
}

/* Re-renderiza el componente cuando cambia el repaso (en esta u otra pestaña de la app). */
export function useRepaso() {
  const [, f] = useState(0);
  useEffect(() => {
    const h = () => f((x) => x + 1);
    window.addEventListener("psn-repaso", h);
    return () => window.removeEventListener("psn-repaso", h);
  }, []);
}
