import React, { useMemo, useState } from "react";
import { PARALELOS } from "./datos/paralelos.js";
import Fuente from "./Fuente.jsx";
import { recortar } from "./Funciones.jsx";

/* Paralelos entre perspectivas: matriz por perspectiva y modo «traducir de A a B». */
export default function Paralelos({ glosario, escuelas, colorDe, idDe, perspectivas, onIrAEscuela }) {
  const [pid, setPid] = useState(PARALELOS[0].id);
  const [de, setDe] = useState("");
  const [a, setA] = useState("");
  const porId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e])), [escuelas]);
  const gl = useMemo(() => Object.fromEntries(glosario.map((g) => [g.escuela + "|" + g.termino, g])), [glosario]);
  const par = PARALELOS.find((p) => p.id === pid);
  const celdas = par.celdas
    .map((c) => ({ ...c, g: gl[c.e + "|" + c.t], E: porId[c.e] }))
    .filter((c) => c.g && c.E);
  const por = (p) => celdas.filter((c) => c.E.perspectiva === p);
  const hayTraduccion = de && a && de !== a;
  const Celda = ({ c }) => (
    <div className="psn-par-celda">
      <b>{c.t}</b>
      <p>{c.matiz}</p>
      <details>
        <summary>Definición del glosario</summary>
        <p>{c.g.definicion}</p>
        {c.g.fuente && <small className="psn-fuente"><Fuente texto={c.g.fuente} /></small>}
      </details>
      <button onClick={() => onIrAEscuela(c.E.id)}>{c.E.nombre}</button>
    </div>
  );
  return (
    <section className="psn-paralelos">
      <h5 className="psn-sub-h">Paralelos entre perspectivas</h5>
      <p className="psn-intro">Cada paralelo reúne términos del glosario que responden a la misma pregunta clínica. Los matices son síntesis orientativa; la definición y la fuente de cada término vienen del glosario.</p>
      <div className="psn-trad-cands" role="tablist" aria-label="Paralelos">
        {PARALELOS.map((p) => (
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
      <p className="psn-aviso"><b>Diferencia clave:</b> {par.diferencia}</p>
      <p className="psn-aviso"><b>Falso amigo:</b> {par.falso}</p>
    </section>
  );
}
