import React, { useMemo, useState } from "react";
import { PARALELOS, EXTRAS } from "./datos/paralelos.js";
import Fuente from "./Fuente.jsx";
import { recortar } from "./Funciones.jsx";

/* Paralelos entre perspectivas: matriz por perspectiva y modo «traducir de A a B». */
export default function Paralelos({ glosario, escuelas, colorDe, perspectivas, onIrAEscuela, nudos = [] }) {
  const LISTA = useMemo(
    () => [
      ...nudos.map((n) => ({ id: n.id, titulo: n.nombre, pregunta: n.descripcion, celdas: n.porPerspectiva.map((c) => ({ e: c.escuela, t: c.termino, texto: c.definicion })), ...(EXTRAS[n.id] || {}) })),
      ...PARALELOS,
    ],
    [nudos]
  );
  const [pid, setPid] = useState(LISTA[0].id);
  const [de, setDe] = useState("");
  const [a, setA] = useState("");
  const porId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e])), [escuelas]);
  const gl = useMemo(() => Object.fromEntries(glosario.map((g) => [g.escuela + "|" + g.termino, g])), [glosario]);
  const par = LISTA.find((p) => p.id === pid) || LISTA[0];
  const celdas = par.celdas
    .map((c) => ({ ...c, g: gl[c.e + "|" + c.t], E: porId[c.e] }))
    .filter((c) => c.E);
  const por = (p) => celdas.filter((c) => c.E.perspectiva === p);
  const hayTraduccion = de && a && de !== a;
  const Celda = ({ c }) => (
    <div className="psn-par-celda">
      <b>{c.t}</b>
      <p>{c.texto || c.matiz}</p>
      {c.g && (
        <details>
          <summary>Definición del glosario</summary>
          <p>{c.g.definicion}</p>
          {c.g.fuente && <small className="psn-fuente"><Fuente texto={c.g.fuente} /></small>}
        </details>
      )}
      <button onClick={() => onIrAEscuela(c.E.id)}>{c.E.nombre}</button>
    </div>
  );
  return (
    <section className="psn-paralelos">
      <p className="psn-intro">Cada tema reúne el término con que cada perspectiva responde a la misma pregunta clínica, y permite traducir de una perspectiva a otra. Los temas con «diferencia clave» y «falso amigo» traen matices de síntesis orientativa; en los demás, la definición es la de la propia perspectiva.</p>
      <div className="psn-trad-cands" role="tablist" aria-label="Paralelos">
        {LISTA.map((p) => (
          <button key={p.id} className={p.id === pid ? "on" : ""} onClick={() => setPid(p.id)}>{p.titulo}</button>
        ))}
      </div>
      <p><b>{par.pregunta}</b></p>
      <div className="psn-par-selector">
        <label>Traducir de{" "}
          <select value={de} onChange={(e) => setDe(e.target.value)}>
            <option value="">—</option>
            {perspectivas.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label>a{" "}
          <select value={a} onChange={(e) => setA(e.target.value)}>
            <option value="">—</option>
            {perspectivas.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>
      {hayTraduccion ? (
        <div className="psn-trad-grid">
          {[de, a].map((p) => (
            <article key={p} style={{ "--pc": colorDe(p) }} className={por(p).length ? "" : "vacia"}>
              <h6>{p}</h6>
              {por(p).length ? por(p).map((c) => <Celda key={c.e + c.t} c={c} />) : <p className="psn-vacio">Sin término verificado en esta perspectiva para este paralelo.</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className="psn-trad-grid">
          {perspectivas.map((p) => (
            <article key={p} style={{ "--pc": colorDe(p) }} className={por(p).length ? "" : "vacia"}>
              <h6>{p}</h6>
              {por(p).length ? por(p).map((c) => <Celda key={c.e + c.t} c={c} />) : <p className="psn-vacio">Sin término verificado en esta perspectiva para este paralelo.</p>}
            </article>
          ))}
        </div>
      )}
      {par.diferencia && <p className="psn-aviso"><b>Diferencia clave:</b> {par.diferencia}</p>}
      {par.falso && <p className="psn-aviso"><b>Falso amigo:</b> {par.falso}</p>}
    </section>
  );
}
