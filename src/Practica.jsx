import React, { useEffect, useMemo, useState } from "react";
import { MIRADAS } from "./Funciones2.jsx";
import { registrar, ordenar, resumen, cuando, useRepaso } from "./Repaso.js";

/* ============================================================
   EJERCICIOS DEL MODO ESTUDIO
   Todos eligen qué mostrar con el repaso espaciado (Repaso.js): primero lo que toca repasar, luego lo nuevo.
   Nada se escribe: se elige, se relaciona o se autoevalúa.
   ============================================================ */

const azar = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const unico = (a) => [...new Set(a)];
const primeraFrase = (t, max = 300) => {
  const s = String(t || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const corte = s.slice(0, max);
  const p = Math.max(corte.lastIndexOf(". "), corte.lastIndexOf("; "));
  return (p > 120 ? corte.slice(0, p + 1) : corte.replace(/\s\S*$/, "")) + "…";
};

/* Texto largo con «ver completo»: nunca se recorta sin poder desplegarlo. */
function Desplegable({ texto, max = 300 }) {
  const [abierto, setAbierto] = useState(false);
  const t = String(texto || "").replace(/\s+/g, " ").trim();
  const corto = primeraFrase(t, max);
  return (
    <>
      {abierto || corto === t ? t : corto}{" "}
      {corto !== t && <button type="button" className="psn-prac-mas" onClick={() => setAbierto((v) => !v)}>{abierto ? "ver menos" : "ver completo"}</button>}
    </>
  );
}

function Panel({ titulo, sub, children, abierto = false, resumenIds, clase = "" }) {
  useRepaso();
  const r = resumenIds ? resumen(resumenIds) : null;
  return (
    <details className={"psn-prac " + clase} open={abierto}>
      <summary>
        <span className="psn-prac-t">{titulo}</span>
        {sub && <span className="psn-prac-s">{sub}</span>}
        {r && <span className="psn-prac-r" title="Repaso espaciado: lo que toca repasar hoy, lo nuevo y lo ya dominado">{r.hoy > 0 ? `${r.hoy} para repasar` : r.nuevas > 0 ? `${r.nuevas} nuevas` : r.proximo ? `próximo repaso ${cuando(r.proximo)}` : "al día"}</span>}
      </summary>
      <div className="psn-prac-cuerpo">{children}</div>
    </details>
  );
}

function Resumen({ ids }) {
  useRepaso();
  const r = resumen(ids);
  return (
    <p className="psn-prac-resumen" aria-live="polite">
      <b>{r.hoy}</b> para repasar hoy · <b>{r.nuevas}</b> nuevas · <b>{r.dominadas}</b> dominadas de {r.total}
      {r.hoy === 0 && r.proximo ? ` · próximo repaso ${cuando(r.proximo)}` : ""}
    </p>
  );
}

/* ---------------------------------------------------------------------------
   1 · ADIVINA LA ESCUELA (Introducción)
   --------------------------------------------------------------------------- */
export function AdivinaEscuela({ escuelas, glosario, anioOrigen, colorDe, onIrAEscuela }) {
  const pool = useMemo(() => escuelas.filter((e) => (e.tecnicas || []).length >= 2 && glosario.some((g) => g.escuela === e.id && g.tipo === "concepto" && String(g.definicion).length > 40)), [escuelas, glosario]);
  const ids = useMemo(() => pool.map((e) => "esc:" + e.id), [pool]);
  const [ronda, setRonda] = useState(null);
  const [pistas, setPistas] = useState(1);
  const [resp, setResp] = useState(null);
  const [sesion, setSesion] = useState({ ok: 0, n: 0 });

  const nueva = () => {
    const top = ordenar(ids).slice(0, 4);
    const id = top[Math.floor(Math.random() * top.length)];
    const e = pool.find((x) => "esc:" + x.id === id);
    const conceptos = glosario.filter((g) => g.escuela === e.id && g.tipo === "concepto" && String(g.definicion).length > 40);
    const c = conceptos[Math.floor(Math.random() * conceptos.length)];
    const mismos = azar(escuelas.filter((x) => x.id !== e.id && x.perspectiva === e.perspectiva)).slice(0, 2);
    const otros = azar(escuelas.filter((x) => x.id !== e.id && x.perspectiva !== e.perspectiva)).slice(0, 3 - mismos.length);
    setRonda({ e, c, tecnicas: (e.tecnicas || []).slice(0, 3), opciones: azar([e, ...mismos, ...otros]) });
    setPistas(1);
    setResp(null);
  };

  const elegir = (x) => {
    if (resp) return;
    setResp(x.id);
    const ok = x.id === ronda.e.id;
    registrar("esc:" + ronda.e.id, ok ? (pistas <= 2 ? 2 : 1) : 0);
    setSesion((s) => ({ ok: s.ok + (ok ? 1 : 0), n: s.n + 1 }));
  };

  useEffect(() => { if (pool.length) nueva(); }, []); // eslint-disable-line
  const info = ronda && anioOrigen[ronda.e.id];
  return (
    <Panel titulo="Adivina la escuela" sub="Tres pistas, cuatro opciones: ¿de qué escuela se trata?" abierto resumenIds={ids} clase="psn-prac-intro">
      {ronda && (
        <div>
          <ol className="psn-prac-pistas">
            <li>
              <b>Una idea central</b>
              <p>{pistas >= 2 && <em>«{ronda.c.termino}»: </em>}<Desplegable texto={ronda.c.definicion} /></p>
            </li>
            {pistas >= 2 && (
              <li>
                <b>Técnicas que usa</b>
                <p>{ronda.tecnicas.map((t) => String(t).split(" (")[0]).join(" · ")}</p>
              </li>
            )}
            {pistas >= 3 && info && (
              <li>
                <b>Cuándo y de dónde nace</b>
                <p>{info.anio}. {info.hito}</p>
              </li>
            )}
          </ol>
          {!resp && pistas < 3 && <button className="psn-prac-link" onClick={() => setPistas((p) => p + 1)}>Dame otra pista ({pistas}/3)</button>}
          <div className="psn-prac-opciones" role="group" aria-label="Opciones">
            {ronda.opciones.map((o) => {
              const correcta = resp && o.id === ronda.e.id;
              const mala = resp && o.id === resp && o.id !== ronda.e.id;
              return <button key={o.id} disabled={!!resp} className={correcta ? "ok" : mala ? "mal" : ""} onClick={() => elegir(o)}>{o.nombre}</button>;
            })}
          </div>
          {resp && (
            <div className={"psn-prac-fb " + (resp === ronda.e.id ? "ok" : "mal")} role="status">
              <p><b>{resp === ronda.e.id ? "Correcto." : "No era esa."}</b> Era <b>{ronda.e.nombre}</b> <span style={{ color: colorDe(ronda.e.perspectiva) }}>({ronda.e.perspectiva})</span>{ronda.e.autores ? ` · ${ronda.e.autores}` : ""}{info ? ` · ${info.anio}` : ""}.</p>
              <div className="psn-prac-acc">
                <button className="psn-btn psn-btn-primario" onClick={nueva}>Siguiente</button>
                <button className="psn-btn" onClick={() => onIrAEscuela(ronda.e.id)}>Ver la ficha de la escuela</button>
              </div>
            </div>
          )}
          <p className="psn-prac-sesion">Esta sesión: {sesion.ok} de {sesion.n}. <Resumen ids={ids} /></p>
        </div>
      )}
    </Panel>
  );
}

/* ---------------------------------------------------------------------------
   4 · ¿QUIÉN LO DIRÍA? + abogado del diablo (Comparación)
   --------------------------------------------------------------------------- */
const CAMPOS_CMP = [
  { k: "definicion", t: "Definición", get: (p) => p.contexto && p.contexto.definicion },
  { k: "rolTerapeuta", t: "Rol del terapeuta", get: (p) => p.contexto && p.contexto.rolTerapeuta },
  { k: "mecanismosCambio", t: "Mecanismos de cambio", get: (p) => p.contexto && p.contexto.mecanismosCambio },
  { k: "psicopatologia", t: "Psicopatología", get: (p) => p.contexto && p.contexto.psicopatologia },
  { k: "criterioVerdad", t: "Criterio de verdad", get: (p) => p.criterioVerdad },
  { k: "unidadAnalisis", t: "Unidad de análisis", get: (p) => p.unidadAnalisis },
  { k: "relacionMenteCuerpo", t: "Relación mente-cuerpo", get: (p) => p.relacionMenteCuerpo },
  { k: "epistemologia", t: "Epistemología", get: (p) => p.epistemologia },
];
const ENMASCARA = /(humanista[s]?|existencial(?:es|ista)?|psicodin[aá]mic[oa]s?|psicoan[aá]lisis|psicoanal[ií]tic[oa]s?|sist[eé]mic[oa]s?|familiar(?:es)?|conductual(?:es|ismo)?|cognitiv[oa]s?|integrador[a]?|ecl[eé]ctic[oa]s?|transpersonal(?:es)?)/gi;

export function QuienLoDiria({ perspectivas, colorDe }) {
  const pool = useMemo(() => {
    const out = [];
    perspectivas.forEach((p) => CAMPOS_CMP.forEach((c) => { const t = c.get(p); if (t && String(t).length > 70) out.push({ id: `cmp:${p.id}:${c.k}`, p, c, t: String(t) }); }));
    return out;
  }, [perspectivas]);
  const ids = useMemo(() => pool.map((x) => x.id), [pool]);
  const [it, setIt] = useState(null);
  const [resp, setResp] = useState(null);
  const [sesion, setSesion] = useState({ ok: 0, n: 0 });
  const nueva = () => { const top = ordenar(ids).slice(0, 5); const id = top[Math.floor(Math.random() * top.length)]; setIt(pool.find((x) => x.id === id)); setResp(null); };
  const elegir = (p) => { if (resp) return; setResp(p.id); const ok = p.id === it.p.id; registrar(it.id, ok ? 2 : 0); setSesion((s) => ({ ok: s.ok + (ok ? 1 : 0), n: s.n + 1 })); };
  useEffect(() => { if (pool.length) nueva(); }, []); // eslint-disable-line
  const objecion = (pid) => (MIRADAS[pid] && MIRADAS[pid].limites) || null;
  return (
    <Panel titulo="¿Quién lo diría?" sub="Adivina la perspectiva y enfréntala a su abogado del diablo" abierto resumenIds={ids} clase="psn-prac-intro">
      {it && (
        <div>
          <p className="psn-prac-campo">{it.c.t}</p>
          <blockquote className="psn-prac-cita"><Desplegable texto={it.t.replace(ENMASCARA, "…")} max={340} /></blockquote>
          <div className="psn-prac-opciones" role="group" aria-label="Perspectivas">
            {perspectivas.map((p) => {
              const correcta = resp && p.id === it.p.id; const mala = resp && p.id === resp && p.id !== it.p.id;
              return <button key={p.id} disabled={!!resp} className={correcta ? "ok" : mala ? "mal" : ""} onClick={() => elegir(p)}>{p.nombre}</button>;
            })}
          </div>
          {resp && (
            <div className={"psn-prac-fb " + (resp === it.p.id ? "ok" : "mal")} role="status">
              <p><b>{resp === it.p.id ? "Correcto." : "No era esa."}</b> Era <b style={{ color: colorDe(it.p.nombre) }}>{it.p.nombre}</b>.</p>
              {objecion(it.p.id) && <div className="psn-prac-abogado"><b>Abogado del diablo.</b> Si defendieras esta postura, desde otra escuela te objetarían que puede <Desplegable texto={objecion(it.p.id)} max={260} /></div>}
              {resp !== it.p.id && objecion(resp) && <div className="psn-prac-abogado"><b>Y la que elegiste.</b> La postura de {perspectivas.find((p) => p.id === resp).nombre} también tiene su punto ciego: <Desplegable texto={objecion(resp)} max={200} /></div>}
              <div className="psn-prac-acc"><button className="psn-btn psn-btn-primario" onClick={nueva}>Siguiente</button></div>
            </div>
          )}
          <p className="psn-prac-sesion">Esta sesión: {sesion.ok} de {sesion.n}. <Resumen ids={ids} /></p>
        </div>
      )}
    </Panel>
  );
}

/* ---------------------------------------------------------------------------
   5 · TRADUCE A CIEGAS (Diccionario y traductor)
   --------------------------------------------------------------------------- */
const LECTURA_REL = {
  "equivalente aproximado": "Dicen casi lo mismo con otro vocabulario.",
  "análogo funcional": "Cumplen una función parecida, aunque la teoría detrás sea distinta.",
  "solapamiento parcial": "Se cruzan solo en parte: conviene no igualarlos.",
  "falso amigo": "Suenan parecido o se usan en el mismo lugar, pero no significan lo mismo.",
  inconmensurable: "No hay un puente directo entre ambos.",
};
export function TraduceACiegas({ enlaces, glosario, escuelas, colorDe, onIrAEscuela }) {
  const porEsc = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e])), [escuelas]);
  const pool = useMemo(() => enlaces.filter((l) => l.conceptoA.escuela !== l.conceptoB.escuela && porEsc[l.conceptoA.escuela] && porEsc[l.conceptoB.escuela]), [enlaces, porEsc]);
  const ids = useMemo(() => pool.map((l) => "tr:" + l.id), [pool]);
  const [q, setQ] = useState(null);
  const [resp, setResp] = useState(null);
  const [sesion, setSesion] = useState({ ok: 0, n: 0 });
  const nueva = () => {
    const top = ordenar(ids).slice(0, 5); const id = top[Math.floor(Math.random() * top.length)];
    const l = pool.find((x) => "tr:" + x.id === id);
    const inv = Math.random() < 0.5;
    const de = inv ? l.conceptoB : l.conceptoA, a = inv ? l.conceptoA : l.conceptoB;
    const otros = unico([...glosario.filter((g) => g.escuela === a.escuela && g.tipo === "concepto").map((g) => g.termino), ...pool.flatMap((x) => [x.conceptoA, x.conceptoB]).filter((c) => c.escuela === a.escuela).map((c) => c.nombre)]).filter((n) => n !== a.nombre);
    setQ({ l, de, a, opciones: azar([a.nombre, ...azar(otros).slice(0, 3)]) });
    setResp(null);
  };
  useEffect(() => { if (pool.length) nueva(); }, []); // eslint-disable-line
  const elegir = (n) => { if (resp) return; setResp(n); const ok = n === q.a.nombre; registrar("tr:" + q.l.id, ok ? 2 : 0); setSesion((s) => ({ ok: s.ok + (ok ? 1 : 0), n: s.n + 1 })); };
  return (
    <Panel titulo="Traduce a ciegas" sub="¿Cómo se dice esto en otra escuela?" abierto resumenIds={ids} clase="psn-prac-intro">
      {q && (
        <div>
          <p className="psn-prac-campo">En <b style={{ color: colorDe(porEsc[q.de.escuela].perspectiva) }}>{porEsc[q.de.escuela].nombre}</b> se dice</p>
          <blockquote className="psn-prac-cita">«{q.de.nombre}»</blockquote>
          <p className="psn-prac-campo">¿Qué concepto de <b style={{ color: colorDe(porEsc[q.a.escuela].perspectiva) }}>{porEsc[q.a.escuela].nombre}</b> le corresponde?</p>
          <div className="psn-prac-opciones" role="group" aria-label="Opciones">
            {q.opciones.map((n) => {
              const correcta = resp && n === q.a.nombre; const mala = resp && n === resp && n !== q.a.nombre;
              return <button key={n} disabled={!!resp} className={correcta ? "ok" : mala ? "mal" : ""} onClick={() => elegir(n)}>{n}</button>;
            })}
          </div>
          {resp && (
            <div className={"psn-prac-fb " + (resp === q.a.nombre ? "ok" : "mal")} role="status">
              <p><b>{resp === q.a.nombre ? "Correcto." : "No era esa."}</b> La respuesta es «{q.a.nombre}». Tipo de puente: <b>{q.l.relacion}</b>. {LECTURA_REL[q.l.relacion] || ""}</p>
              {q.l.nota && <details><summary>Por qué</summary><p>{q.l.nota}</p></details>}
              <div className="psn-prac-acc"><button className="psn-btn psn-btn-primario" onClick={nueva}>Siguiente</button><button className="psn-btn" onClick={() => onIrAEscuela(q.a.escuela)}>Ver la escuela</button></div>
            </div>
          )}
          <p className="psn-prac-sesion">Esta sesión: {sesion.ok} de {sesion.n}. <Resumen ids={ids} /></p>
        </div>
      )}
    </Panel>
  );
}
