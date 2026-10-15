import React, { useMemo } from "react";
import { normT, analiza } from "./Deteccion.js";
import Fuente from "./Fuente.jsx";

const palabras = (t) => new Set(normT(String(t || "")).split(" ").filter((w) => w.length > 5));

/* Ampliación de la ficha de un concepto: dónde se aplica (protocolos y técnicas de su escuela que lo mencionan)
   y qué otros conceptos de la misma escuela se le parecen por su definición. */
export default function FichaTermino({ concepto, escuelaId, conceptosEscuela, protocolos, procedimientos, onIrAConcepto, glosario = [], escuelas = [], onIrAOtro }) {
  const base = useMemo(() => normT(String(concepto.termino).split(" (")[0]), [concepto]);
  const aplica = useMemo(() => {
    if (base.length < 5) return [];
    const lista = [];
    if (protocolos[escuelaId]) lista.push({ ...protocolos[escuelaId], tipo: "protocolo" });
    (procedimientos[escuelaId] || []).filter((x) => x.tipo !== "fase").forEach((x) => lista.push(x));
    return lista.filter((x) => normT([x.nombre, x.condiciones, x.porQueFunciona, (x.fases || []).join(" ")].join(" ")).includes(base)).slice(0, 8);
  }, [base, escuelaId, protocolos, procedimientos]);
  const vecinos = useMemo(() => {
    const a = palabras(concepto.definicion);
    if (a.size < 3) return [];
    return conceptosEscuela
      .filter((c) => c.termino !== concepto.termino)
      .map((c) => { const b = palabras(c.definicion); let n = 0; a.forEach((w) => { if (b.has(w)) n += 1; }); return { c, s: n / Math.sqrt(a.size * (b.size || 1)) }; })
      .filter((x) => x.s > 0)
      .sort((x, y) => y.s - x.s)
      .slice(0, 4)
      .map((x) => x.c);
  }, [concepto, conceptosEscuela]);
  const temas = useMemo(() => analiza(String(concepto.termino) + ". " + String(concepto.definicion)).temas.slice(0, 4), [concepto]);
  const otros = useMemo(() => glosario.filter((g) => g.escuela !== escuelaId && g.tipo === concepto.tipo && base.length > 4 && normT(String(g.termino).split(" (")[0]) === base).slice(0, 5), [glosario, escuelaId, concepto, base]);
  const nombreEsc = (id) => (escuelas.find((e) => e.id === id) || {}).nombre || id;
  if (aplica.length === 0 && vecinos.length === 0 && temas.length === 0 && otros.length === 0) return null;
  return (
    <div className="psn-ficha-ext">
      {aplica.length > 0 && (
        <section>
          <h5>Dónde se aplica</h5>
          <ul>
            {aplica.map((x) => (
              <li key={x.nombre}>
                <details>
                  <summary><span className={"tipo " + (x.tipo === "protocolo" ? "p" : "t")}>{x.tipo === "protocolo" ? "Protocolo" : "Técnica"}</span> <strong>{x.nombre}</strong></summary>
                  {x.condiciones && <p><b>Condiciones: </b>{x.condiciones}</p>}
                  <div className="fuente"><Fuente texto={x.fuente} /></div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}
      {temas.length > 0 && (
        <section>
          <h5>Se relaciona con estos motivos de consulta</h5>
          <div className="psn-ficha-vecinos">{temas.map((t) => <span key={t.id} className="psn-ficha-tema">{t.t}</span>)}</div>
        </section>
      )}
      {otros.length > 0 && (
        <section>
          <h5>El mismo término en otras escuelas</h5>
          <div className="psn-ficha-vecinos">{otros.map((g) => <button key={g.escuela + g.termino} onClick={() => onIrAOtro && onIrAOtro(g.escuela, g.termino)}>{g.termino} · {nombreEsc(g.escuela)}</button>)}</div>
        </section>
      )}
      {vecinos.length > 0 && (
        <section>
          <h5>Conceptos vecinos en esta escuela</h5>
          <div className="psn-ficha-vecinos">
            {vecinos.map((c) => <button key={c.termino} onClick={() => onIrAConcepto(c.termino)}>{c.termino}</button>)}
          </div>
        </section>
      )}
    </div>
  );
}

/* Cobertura del diccionario: conceptos y enlaces por escuela, para ver dónde falta contenido. */
export function CoberturaDiccionario({ escuelas, glosario, enlaces, colorDe }) {
  const filas = useMemo(() => {
    const c = {}, t = {}, l = {};
    glosario.forEach((g) => { if (g.tipo === "concepto") c[g.escuela] = (c[g.escuela] || 0) + 1; else t[g.escuela] = (t[g.escuela] || 0) + 1; });
    (enlaces || []).forEach((e) => { [e.conceptoA.escuela, e.conceptoB.escuela].forEach((id) => { l[id] = (l[id] || 0) + 1; }); });
    return escuelas.map((e) => ({ e, c: c[e.id] || 0, t: t[e.id] || 0, l: l[e.id] || 0 })).sort((a, b) => a.c - b.c);
  }, [escuelas, glosario, enlaces]);
  const max = Math.max(...filas.map((f) => f.c), 1);
  const total = filas.reduce((s, f) => s + f.c, 0);
  const bajas = filas.filter((f) => f.c < 6);
  return (
    <details className="psn-detalles psn-cobertura">
      <summary>Cobertura del diccionario <small>— {total} conceptos en {filas.length} escuelas · {bajas.length} con menos de 6</small></summary>
      <p className="psn-prac-ayuda">Ordenadas de menos a más conceptos. Las marcadas en ámbar tienen menos de seis conceptos y son las que más se beneficiarían de nuevas lecturas.</p>
      <table className="psn-cob-tabla">
        <thead><tr><th>Escuela</th><th>Conceptos</th><th></th><th>Técnicas</th><th>Enlaces</th></tr></thead>
        <tbody>
          {filas.map(({ e, c, t, l }) => (
            <tr key={e.id} className={c < 6 ? "baja" : ""} style={{ "--pc": colorDe(e.perspectiva) }}>
              <th scope="row">{e.nombre}</th>
              <td>{c}</td>
              <td><span className="barra"><i style={{ width: `${(c / max) * 100}%` }} /></span></td>
              <td>{t}</td>
              <td>{l}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
