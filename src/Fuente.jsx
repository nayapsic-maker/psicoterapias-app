import React, { useEffect, useState } from "react";
import { citaDe, cargarBibliografia, bibliografiaLista, bibliografiaModulo, sinMarcas } from "./Citas.js";

/* Pinta una referencia con cursivas (*texto*). */
export function ApaTexto({ texto }) {
  return <>{String(texto).split("*").map((x, i) => (i % 2 ? <i key={i}>{x}</i> : x))}</>;
}

export function useBibliografia() {
  const [, set] = useState(bibliografiaLista());
  useEffect(() => { if (!bibliografiaLista()) cargarBibliografia().then(() => set(true)); }, []);
  return bibliografiaLista();
}

/* Fuente de un dato: cita en el texto + referencia(s) en APA 7, con botón para copiar.
   Si la cadena no se puede resolver, se muestra tal cual. */
export default function Fuente({ texto, compacta = false, soloReferencia = false, estilo }) {
  useBibliografia();
  const [ok, setOk] = useState(false);
  if (!texto) return null;
  const c = citaDe(texto);
  if (!c.ok || !c.referencias.length) {
    return <span className="psn-fuente-apa" style={estilo}>{c.enTexto || ""}{c.enTexto ? " " : ""}<span className="psn-fuente-cruda">{String(texto).replace(/\*/g, "")}</span></span>;
  }
  const copiar = async () => {
    try { await navigator.clipboard.writeText(c.referencias.map(sinMarcas).join("\n")); setOk(true); setTimeout(() => setOk(false), 1500); } catch (e) { /* sin portapapeles */ }
  };
  return (
    <span className={"psn-fuente-apa" + (compacta ? " compacta" : "")} style={estilo}>
      {c.enTexto && !soloReferencia && <span className="psn-fuente-intexto">{c.enTexto}</span>}
      {c.referencias.map((r, i) => (
        <span key={i} className="psn-fuente-ref"><ApaTexto texto={r} /></span>
      ))}
      {!soloReferencia && <button type="button" className="psn-fuente-copiar" onClick={copiar} title="Copiar la referencia en formato APA 7">{ok ? "Copiada ✓" : "Copiar APA"}</button>}
    </span>
  );
}

/* Panel de revisión: referencias cuya fuente no trae editorial, páginas o título del artículo. */
export function RefsIncompletas() {
  const lista = useBibliografia();
  const [abierto, setAbierto] = useState(false);
  if (!lista) return null;
  // eslint-disable-next-line
  const m = bibliografiaModulo();
  if (!m) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <button type="button" onClick={() => setAbierto(!abierto)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 11, fontWeight: 700, padding: 0, color: "inherit" }}>
        {abierto ? "▾" : "▸"} {m.REFS_INCOMPLETAS.length} referencias a las que falta editorial, páginas o título (completar con la fuente)
      </button>
      {abierto && (
        <ol style={{ fontSize: 12, lineHeight: 1.5, paddingLeft: 20, maxHeight: 260, overflowY: "auto" }}>
          {m.REFS_INCOMPLETAS.map((k) => <li key={k}><ApaTexto texto={m.REFS[k] || k} /></li>)}
        </ol>
      )}
    </div>
  );
}
