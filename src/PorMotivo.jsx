import React, { useMemo, useState } from "react";
import { LEXICO } from "./Deteccion.js";
import { indicacionDe } from "./datos/indicaciones.js";
import Fuente, { useBibliografia } from "./Fuente.jsx";

/* Protocolos y técnicas por motivo de consulta: cruza los temas clínicos con las indicaciones curadas de cada fuente. */
export default function PorMotivo({ escuelas, perspectivas, protocolos, procedimientos, listos, colorDe, onIrAEscuela, idDe }) {
  useBibliografia();
  const [tema, setTema] = useState(null);
  const [soloProtocolos, setSoloProtocolos] = useState(false);

  const items = useMemo(() => {
    if (!listos) return [];
    const out = [];
    escuelas.forEach((e) => {
      const lista = [];
      if (protocolos[e.id]) lista.push({ ...protocolos[e.id], tipo: "protocolo" });
      (procedimientos[e.id] || []).filter((x) => x.tipo !== "fase").forEach((x) => lista.push(x));
      lista.forEach((it) => {
        const ind = indicacionDe(e.id, it.nombre);
        if (ind) out.push({ it, e, ind });
      });
    });
    return out;
  }, [escuelas, protocolos, procedimientos, listos]);

  const temas = useMemo(() => {
    const cuenta = {};
    items.forEach(({ ind }) => ind.forEach((t) => { cuenta[t] = (cuenta[t] || 0) + 1; }));
    return LEXICO.filter((l) => cuenta[l.id]).map((l) => ({ id: l.id, t: l.t, n: cuenta[l.id] })).sort((a, b) => b.n - a.n);
  }, [items]);

  const lista = useMemo(() => {
    if (!tema) return [];
    return items
      .filter(({ ind, it }) => ind.includes(tema) && (!soloProtocolos || it.tipo === "protocolo"))
      .sort((a, b) => a.ind.indexOf(tema) - b.ind.indexOf(tema) || (a.it.tipo === "protocolo" ? -1 : 1));
  }, [items, tema, soloProtocolos]);

  const porPersp = useMemo(() => {
    const m = new Map();
    lista.forEach((x) => { const k = x.e.perspectiva; if (!m.has(k)) m.set(k, []); m.get(k).push(x); });
    return [...m.entries()];
  }, [lista]);

  if (!listos) return null;
  const nombreTema = (temas.find((x) => x.id === tema) || {}).t;
  return (
    <details className="psn-prac psn-motivo">
      <summary>
        <span className="psn-prac-t">Protocolos y técnicas por motivo de consulta</span>
        <span className="psn-prac-s">Elige qué quieres tratar y mira qué propone cada perspectiva, con su fuente</span>
      </summary>
      <div className="psn-prac-cuerpo">
        <div className="psn-motivo-temas" role="group" aria-label="Motivos de consulta">
          {temas.map((x) => (
            <button key={x.id} className={tema === x.id ? "on" : ""} onClick={() => setTema(tema === x.id ? null : x.id)}>{x.t} <small>{x.n}</small></button>
          ))}
        </div>
        {tema && (
          <>
            <p className="psn-motivo-cab">
              <b>{lista.length}</b> propuestas para «{nombreTema}» en {porPersp.length} perspectivas.{" "}
              <label><input type="checkbox" checked={soloProtocolos} onChange={(e) => setSoloProtocolos(e.target.checked)} /> solo protocolos completos</label>
            </p>
            {porPersp.map(([p, xs]) => (
              <section key={p} className="psn-motivo-grupo" style={{ "--pc": colorDe(p) }}>
                <h5>{p}</h5>
                <ul>
                  {xs.map(({ it, e, ind }) => (
                    <li key={e.id + it.nombre}>
                      <details>
                        <summary>
                          <span className={"tipo " + (it.tipo === "protocolo" ? "p" : "t")}>{it.tipo === "protocolo" ? "Protocolo" : "Técnica"}</span>
                          <strong>{it.nombre}</strong>
                          <small>{e.nombre}</small>
                        </summary>
                        {ind.length > 1 && <p className="psn-motivo-otros">También indicado en: {ind.filter((t) => t !== tema).map((t) => (temas.find((x) => x.id === t) || {}).t || t).join(", ")}.</p>}
                        {it.poblacion && <p><b>Población: </b>{it.poblacion}</p>}
                        {it.condiciones && <p><b>Condiciones: </b>{it.condiciones}</p>}
                        {(it.fases || []).length > 0 && <ol className="pasos">{it.fases.map((f, i) => <li key={i}>{f}</li>)}</ol>}
                        <div className="fuente"><Fuente texto={it.fuente} /><span className="acc"><button onClick={() => onIrAEscuela(e.id)}>Ficha de la escuela</button></span></div>
                      </details>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
        {!tema && <p className="psn-prac-ayuda">Cada elemento figura aquí solo si su fuente declara a qué problema se aplica. Los pasos y la cita completa están dentro de cada uno.</p>}
      </div>
    </details>
  );
}
