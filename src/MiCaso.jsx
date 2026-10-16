import React, { useState, useEffect, useMemo, useRef } from "react";
import { analiza, semejantes, RIESGOS, normT } from "./Deteccion.js";
import { MIRADAS, CASOS, fotoCaso, NOCION_NODO } from "./Funciones2.jsx";
import { citaDe, sinMarcas } from "./Citas.js";
import Fuente, { useBibliografia } from "./Fuente.jsx";
import { indicacionDe } from "./datos/indicaciones.js";

/* ============================================================
   MI LECTURA DE UN CASO
   La persona escribe un caso (idealmente anonimizado) y obtiene un informe que:
   · pone la seguridad primero, · muestra qué se detectó y por qué (y deja corregirlo),
   · lee el caso desde las siete perspectivas, · propone protocolos y técnicas verificados de la biblioteca
     con su fuente en APA, · señala convergencias y tensiones entre escuelas y · cita todo.
   Nada se envía a ningún servidor: los casos se guardan solo en este navegador.
   ============================================================ */

const CLAVE = "psiconautas:casos:v1";
const CAMPOS = [
  { k: "datos", t: "Datos generales", ph: "Edad aproximada, contexto de la consulta (individual, pareja, familia), quién deriva, formato…", filas: 2 },
  { k: "motivo", t: "Motivo de consulta", ph: "¿Qué trae a la persona, con qué intensidad y desde cuándo? Usa sus palabras cuando puedas.", filas: 4 },
  { k: "historia", t: "Historia relevante", ph: "Eventos, pérdidas, experiencias tempranas, tratamientos previos…", filas: 3 },
  { k: "contexto", t: "Contexto y relaciones", ph: "Pareja, familia, trabajo o estudios, red de apoyo, cultura y creencias…", filas: 3 },
  { k: "salud", t: "Salud, sueño y sustancias", ph: "Enfermedades, medicación, sueño, alcohol u otras sustancias…", filas: 2 },
  { k: "seguridad", t: "Seguridad", ph: "Ideas de muerte o autolesión, riesgo para otros, violencia en el entorno. Si no hay, escríbelo («no refiere ideación suicida»).", filas: 2 },
  { k: "recursos", t: "Recursos y fortalezas", ph: "¿Qué le ha ayudado? ¿Qué valora de sí? ¿Quién la apoya?", filas: 2 },
  { k: "meta", t: "Qué espera de la terapia", ph: "Objetivos de la persona y cómo reconocería el cambio.", filas: 2 },
];

const PENDIENTES = [
  { k: "seguridad", t: "Seguridad: ideas de muerte o autolesión, riesgo para otros, violencia en el entorno.", re: /suicid|autolesi|muerte|violenc|riesgo|seguridad|maltrat/ },
  { k: "curso", t: "Curso: desde cuándo, qué lo desencadenó, qué lo mejora o empeora.", re: /desde (hace|que)|meses|anos|semanas|desencaden|empeora|mejora|comenz|inici/ },
  { k: "func", t: "Funcionamiento: sueño, trabajo o estudio, vida social, autocuidado.", re: /sueno|duerm|trabaj|estudi|amig|apetito|autocuidado/ },
  { k: "salud", t: "Salud y sustancias: enfermedades, medicación, alcohol y otras drogas.", re: /medic|enfermedad|alcohol|droga|sustancia|consumo|salud/ },
  { k: "hist", t: "Historia: tratamientos previos, eventos vitales importantes, antecedentes familiares.", re: /tratamiento previo|terapia previa|antecedente|infancia|adolescen|falleci|separaci|divorci/ },
  { k: "rec", t: "Contexto y recursos: red de apoyo, fortalezas, cultura y creencias.", re: /apoyo|fortaleza|recurso|amig|familia|fe |cultura|cree/ },
  { k: "exp", t: "Expectativas: qué espera de la terapia y cómo sabrá que ha cambiado.", re: /espera|quiere|objetivo|meta|cambio|quisiera/ },
];

/* Datos que podrían identificar a la persona. */
function posiblesIdentificadores(texto) {
  const out = [];
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(texto)) out.push("un correo electrónico");
  if (/(\+?\d[\d\s().-]{8,}\d)/.test(texto)) out.push("un número de teléfono o de documento");
  if (/\b(?:se llama|llamad[oa]|me llamo|nombre es|apellid[oa])\s+[A-ZÁÉÍÓÚ][a-záéíóúñ]+/.test(texto)) out.push("un nombre propio tras «se llama…»");
  if (/\b(?:Sr\.|Sra\.|Srta\.|Dr\.|Dra\.|don|doña)\s+[A-ZÁÉÍÓÚ]/.test(texto)) out.push("un tratamiento seguido de un apellido");
  if (/\b(?:calle|avenida|av\.|carrera|cra\.)\s+[A-ZÁÉÍÓÚ0-9]/i.test(texto)) out.push("una dirección");
  return out;
}

const CLAVE_NOTAS = "psiconautas:lectura-casos:v1";
const campos0 = (e) => ({ datos: "", motivo: e.c.motivo, historia: e.c.historia, contexto: e.c.contexto, salud: "", seguridad: "", recursos: e.c.recursos, meta: e.c.meta });
function notas() { try { return JSON.parse(localStorage.getItem(CLAVE_NOTAS) || "{}") || {}; } catch (e) { return {}; } }
function guardarNotas(o) { try { localStorage.setItem(CLAVE_NOTAS, JSON.stringify(o)); } catch (e) { /* sin almacenamiento: solo esta sesión */ } }
const armar = () => { const n = notas(); return CASOS.map((e, i) => ({ id: "c" + i, titulo: e.t, ejemplo: i, campos: campos0(e), apagados: [], formulacion: "", siguiente: "", ...(n["c" + i] || {}) })); };

/* Temas de contexto (quién, dónde): orientan poco por sí solos y solo suman si hay otro tema clínico en juego. */
const CONTEXTO = new Set(["familia", "pareja", "soledad", "trabajo", "cultura", "genero", "infancia", "salud", "sueno", "dependencia"]);

/* Puntaje de un protocolo o técnica frente a los temas del caso, según las indicaciones curadas (datos/indicaciones.js).
   El primer tema de la lista de indicaciones pesa más. null = el elemento no figura como candidato autónomo. */
function puntuar(escuelaId, item, temas) {
  const ind = indicacionDe(escuelaId, item.nombre);
  if (!ind) return { s: 0, hit: [] };
  let s = 0;
  let clinico = false;
  const hit = [];
  temas.forEach((t) => {
    const pos = ind.indexOf(t.id);
    if (pos < 0) return;
    const peso = Math.min(1.6, 0.8 + 0.3 * (t.score || 1));
    const ctx = CONTEXTO.has(t.id);
    s += (pos === 0 ? 3 : 2) * peso * (ctx ? 0.5 : 1);
    if (!ctx) clinico = true;
    hit.push(t);
  });
  return { s: clinico ? s : 0, hit };
}

function Cita({ fuente }) {
  const c = citaDe(fuente);
  return <span className="psn-mc-cita">{c.enTexto && <em>{c.enTexto}</em>}</span>;
}

export function LecturaCasos({ escuelas, perspectivas, colorDe, idDe, glosario, nudos, enlaces, protocolos, procedimientos, protocolosListos, onIrAEscuela, onIrAProtocolos }) {
  const [casos, setCasos] = useState(armar);
  const [idAct, setIdAct] = useState(null);
  const [copiado, setCopiado] = useState("");
  const [abierta, setAbierta] = useState(null);
  const informeRef = useRef(null);
  const topRef = useRef(null);
  const bibLista = useBibliografia();

  const caso = casos.find((c) => c.id === idAct) || null;
  useEffect(() => { guardarNotas(Object.fromEntries(casos.map((c) => [c.id, { formulacion: c.formulacion, siguiente: c.siguiente, apagados: c.apagados }]))); }, [casos]);

  /* La galería de casos (Protocolos y Técnicas) abre el caso elegido. */
  useEffect(() => {
    const abrir = (i) => { setIdAct("c" + i); setTimeout(() => topRef.current && topRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 120); };
    if (typeof window.__casoPendiente === "number") { abrir(window.__casoPendiente); window.__casoPendiente = null; }
    const h = (ev) => abrir(ev.detail);
    window.addEventListener("psn-caso", h);
    return () => window.removeEventListener("psn-caso", h);
  }, []);

  const cambiar = (parche) => setCasos((prev) => prev.map((c) => (c.id === idAct ? { ...c, ...parche } : c)));

  const vac = { campos: campos0({ c: {} }), apagados: [], formulacion: "", siguiente: "", titulo: "" };
  const cs_ = caso || vac;
  const texto = CAMPOS.map((c) => cs_.campos[c.k] || "").join(". ");
  const det = useMemo(() => analiza(texto), [texto]);
  const temas = det.temas.filter((t) => !cs_.apagados.includes(t.id));
  const riesgos = det.riesgos;
  const q = normT(texto);
  const longitud = texto.replace(/[.\s]/g, "").length;
  const ids = useMemo(() => posiblesIdentificadores(texto), [texto]);
  const porEscuela = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e])), [escuelas]);

  /* Conceptos del diccionario que dialogan con el caso, por perspectiva. */
  const conceptosDe = (p) => {
    const out = [];
    temas.flatMap((t) => t.nociones || []).concat(det.nociones.map((n) => (typeof n === "string" ? n : n.id))).forEach((n) => {
      if (out.length >= 3) return;
      const nodo = nudos.find((x) => x.id === NOCION_NODO[n]);
      const y = nodo && nodo.porPerspectiva.find((z) => idDe(z.perspectiva) === p.id);
      if (y && !out.some((o) => o.termino === y.termino)) out.push({ ...y, nocion: nodo.nombre });
    });
    if (out.length < 2 && glosario.length && texto.trim().length > 60) {
      semejantes(texto, glosario, (g) => { const E = porEscuela[g.escuela]; return E && idDe(E.perspectiva) === p.id && g.tipo === "concepto"; }, 2 - out.length)
        .forEach((g) => { if (!out.some((o) => o.termino === g.termino)) out.push({ escuela: g.escuela, termino: g.termino, definicion: g.definicion, fuente: g.fuente, nocion: "semejanza con el relato" }); });
    }
    return out;
  };

  /* Protocolos y técnicas candidatos, por perspectiva. */
  const candidatos = useMemo(() => {
    if (!protocolosListos || !temas.length) return {};
    const res = {};
    perspectivas.forEach((p) => {
      const lista = [];
      escuelas.filter((e) => e.perspectiva === p.nombre || idDe(e.perspectiva) === p.id).forEach((e) => {
        const items = [];
        if (protocolos[e.id]) items.push({ ...protocolos[e.id], tipo: "protocolo", _principal: true });
        (procedimientos[e.id] || []).filter((x) => x.tipo !== "fase").forEach((x) => items.push(x));
        items.forEach((it) => {
          const { s, hit } = puntuar(e.id, it, temas);
          if (s >= 2.4) lista.push({ it, e, s: s + (it.tipo === "protocolo" ? 0.6 : 0), hit });
        });
      });
      lista.sort((a, b) => b.s - a.s);
      res[p.id] = lista.slice(0, 3);
    });
    return res;
  }, [protocolosListos, temas, escuelas, perspectivas, protocolos, procedimientos]);

  /* Convergencias (varias perspectivas apuntan al mismo tema) y tensiones (enlaces entre las escuelas propuestas). */
  const convergencias = useMemo(() => {
    const m = {};
    Object.entries(candidatos).forEach(([pid, lista]) => lista.forEach((c) => c.hit.forEach((t) => { (m[t.id] = m[t.id] || { t, p: new Set() }).p.add(pid); })));
    return Object.values(m).filter((x) => x.p.size >= 3).sort((a, b) => b.p.size - a.p.size).slice(0, 4);
  }, [candidatos]);
  const tensiones = useMemo(() => {
    // Solo entre las escuelas que encabezan cada perspectiva: son diferencias de fondo, no del caso concreto.
    const esc = new Set(Object.values(candidatos).map((l) => l[0]).filter(Boolean).map((c) => c.e.id));
    const out = [];
    (enlaces || []).forEach((l) => {
      const a = l.conceptoA.escuela, b = l.conceptoB.escuela;
      if (a !== b && esc.has(a) && esc.has(b) && ["falso amigo", "inconmensurable"].includes(l.relacion)) out.push(l);
    });
    return out.slice(0, 3);
  }, [candidatos, enlaces]);
  const lagunas = useMemo(() => {
    if (!protocolosListos) return [];
    const cubiertos = new Set(Object.values(candidatos).flat().flatMap((c) => c.hit.map((t) => t.id)));
    return temas.filter((t) => !CONTEXTO.has(t.id) && !RIESGOS[t.id] && !cubiertos.has(t.id));
  }, [candidatos, temas, protocolosListos]);
  const pendientes = PENDIENTES.filter((x) => !x.re.test(q));
  

  /* ---------- Referencias del informe (APA, sin repetidos) ---------- */
  const referencias = useMemo(() => {
    const r = new Map();
    const add = (f) => { if (!f) return; (citaDe(f).referencias || []).forEach((ref) => { if (!r.has(ref)) r.set(ref, { referencia: ref }); }); };
    Object.values(candidatos).flat().forEach((c) => add(c.it.fuente));
    perspectivas.forEach((p) => conceptosDe(p).forEach((c) => add(c.fuente)));
    return [...r.values()].sort((a, b) => sinMarcas(a.referencia).localeCompare(sinMarcas(b.referencia), "es"));
  }, [candidatos, temas, texto, bibLista]); // eslint-disable-line

  /* ---------- Exportar ---------- */
  const informeTexto = () => {
    const L = [];
    L.push(`LECTURA DEL CASO: ${caso.titulo}`, "");
    CAMPOS.forEach((c) => { if (caso.campos[c.k].trim()) L.push(`${c.t}: ${caso.campos[c.k].trim()}`); });
    if (riesgos.length) { L.push("", "SEGURIDAD"); riesgos.forEach((r) => L.push(`- ${RIESGOS[r]}`)); }
    if (temas.length) L.push("", "Temas detectados: " + temas.map((t) => t.t).join("; "));
    L.push("", "LECTURA POR PERSPECTIVA");
    perspectivas.forEach((p) => {
      const m = MIRADAS[p.id]; if (!m) return;
      L.push("", `${p.nombre}: ${m.problema}`);
      (candidatos[p.id] || []).forEach((c) => L.push(`  · ${c.it.nombre} (${c.e.nombre}) ${citaDe(c.it.fuente).enTexto || ""}`));
    });
    if (caso.formulacion.trim()) L.push("", "MI FORMULACIÓN", caso.formulacion.trim());
    if (caso.siguiente.trim()) L.push("", "SIGUIENTE PASO", caso.siguiente.trim());
    if (pendientes.length) { L.push("", "PARA COMPLETAR EL CASO"); pendientes.forEach((x) => L.push(`- ${x.t}`)); }
    if (referencias.length) { L.push("", "REFERENCIAS"); referencias.forEach((r) => L.push(sinMarcas(r.referencia))); }
    L.push("", "Ejercicio de estudio y orientación: no sustituye el juicio clínico, el diagnóstico ni la supervisión.");
    return L.join("\n");
  };
  const copiar = async (que, txt) => {
    try { await navigator.clipboard.writeText(txt); setCopiado(que); setTimeout(() => setCopiado(""), 1800); } catch (e) { setCopiado("no se pudo copiar"); }
  };
  const descargar = () => {
    const blob = new Blob([informeTexto()], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `lectura-${caso.titulo.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, "-").slice(0, 40) || "caso"}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  };

  return (
    <section className="psn-mc" ref={topRef}>
      <div className="psn-mc-casos" role="tablist" aria-label="Los cinco casos">
        {CASOS.map((c, i) => (
          <button key={c.t} role="tab" aria-selected={idAct === "c" + i} className={idAct === "c" + i ? "on" : ""} onClick={() => setIdAct("c" + i)} title={c.sub}>
            <img loading="lazy" decoding="async" src={fotoCaso(c.av)} alt="" width="26" height="26" /> {c.t}
          </button>
        ))}
      </div>
      {!caso && <p className="psn-mc-vacio">Elige uno de los cinco casos para ver cómo lo leería cada perspectiva, qué protocolos y técnicas de la biblioteca podrían encajar y dónde discrepan las escuelas.</p>}
      {caso && (
      <div className="psn-mc-cuerpo">
        <div className="psn-mc-entrada">
          <h3 className="psn-mc-caso-t">{caso.titulo}</h3>
          <p className="psn-mc-caso-s">{CASOS[caso.ejemplo].sub}</p>
          <dl className="psn-mc-ficha">
            {CAMPOS.filter((c) => (caso.campos[c.k] || "").trim()).map((c) => (
              <React.Fragment key={c.k}><dt>{c.t}</dt><dd>{caso.campos[c.k]}</dd></React.Fragment>
            ))}
          </dl>
          <p className="psn-mc-prog">Caso ficticio de práctica. Tus notas (formulación y siguiente paso) se guardan solo en este navegador.</p>
        </div>

        <article className="psn-mc-informe" ref={informeRef}>
          <header className="psn-mc-informe-cab">
            <h3>Lectura del caso <small>{caso.titulo}</small></h3>
            <div className="psn-mc-exportar">
              <button onClick={() => window.print()} title="Abre el cuadro de impresión; elige «Guardar como PDF»">Imprimir / PDF</button>
              <button onClick={() => copiar("informe", informeTexto())}>{copiado === "informe" ? "Copiado ✓" : "Copiar informe"}</button>
              <button onClick={descargar}>Descargar .txt</button>
            </div>
          </header>

          {longitud < 60 && (
            <p className="psn-mc-vacio">Escribe al menos el motivo de consulta (unas dos o tres frases) y aquí aparecerá la lectura: qué se detecta, cómo lo ve cada perspectiva, qué protocolos y técnicas de la biblioteca podrían encajar y qué falta preguntar.</p>
          )}

          {riesgos.length > 0 && (
            <section className="psn-mc-riesgo" role="alert">
              <h4>1 · Seguridad primero</h4>
              <ul>{riesgos.map((r) => <li key={r}>{RIESGOS[r]}</li>)}</ul>
              <p>Hasta que no esté valorado el riesgo, lo que sigue es secundario.</p>
            </section>
          )}

          {longitud >= 60 && (
            <>
              <section>
                <h4>{riesgos.length ? "2" : "1"} · Lo que se leyó en el relato</h4>
                {temas.length === 0 ? (
                  <p>No se reconocieron temas clínicos habituales. Añade síntomas, vínculos, hechos recientes o contexto, o escribe tu propia formulación más abajo.</p>
                ) : (
                  <ul className="psn-mc-temas">
                    {det.temas.slice(0, 14).map((t) => {
                      const apagado = caso.apagados.includes(t.id);
                      return (
                        <li key={t.id} className={apagado ? "off" : ""}>
                          <span><b>{t.t}</b> <em>«{t.evidencia.slice(0, 3).join("», «")}»</em></span>
                          <button onClick={() => cambiar({ apagados: apagado ? caso.apagados.filter((x) => x !== t.id) : [...caso.apagados, t.id] })} aria-pressed={apagado} title={apagado ? "Volver a considerarlo" : "No es esto: quitarlo de la lectura"}>
                            {apagado ? "Volver a incluir" : "No es esto"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {det.negados.length > 0 && <p className="psn-mc-nota">El texto niega o descarta: {det.negados.map((n) => n.t.toLowerCase()).join(", ")}.</p>}
                <p className="psn-mc-nota">La detección es léxica: lee palabras, no personas. Si algo está mal leído, quítalo y la lectura se recalcula.</p>
              </section>

              <section>
                <h4>{riesgos.length ? "3" : "2"} · Siete miradas sobre el mismo caso</h4>
                <div className="psn-mc-miradas">
                  {perspectivas.map((p) => {
                    const m = MIRADAS[p.id];
                    if (!m) return null;
                    const col = colorDe(p.nombre);
                    const cs = conceptosDe(p);
                    const abre = abierta === p.id;
                    return (
                      <article key={p.id} style={{ "--pc": col }} className={abre ? "on" : ""}>
                        <button className="cab" onClick={() => setAbierta(abre ? null : p.id)} aria-expanded={abre}>
                          <h5>{p.nombre}</h5>
                          <span>{m.problema}</span>
                        </button>
                        {(
                          <div className="cuerpo">
                            <h6>Qué mira</h6>
                            <p>{m.mira}</p>
                            <h6>Cómo concibe el problema</h6>
                            <p>{m.concepcion}</p>
                            <h6>Rol del terapeuta</h6>
                            <p>{m.rol}</p>
                            <h6>Qué buscaría lograr</h6>
                            <p>{m.exito}</p>
                            <h6>Preguntas que haría</h6>
                            <ul>{m.preguntas.map((x) => <li key={x}>{x}</li>)}</ul>
                            {cs.length > 0 && (
                              <>
                                <h6>Conceptos que dialogan con el relato</h6>
                                <ul className="conc">
                                  {cs.map((c) => (
                                    <li key={c.termino}>
                                      <button onClick={() => onIrAEscuela(c.escuela)}>{c.termino}</button>
                                      <em>{c.nocion}</em>
                                      <span>{String(c.definicion).split(" (")[0].slice(0, 220)}{String(c.definicion).length > 220 ? "…" : ""}</span>
                                      {c.fuente && <Cita fuente={c.fuente} />}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                            <h6>Qué podría pasar por alto</h6>
                            <p>{m.limites}</p>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
                <p className="psn-mc-nota">Cada perspectiva se resume con su lógica general; el detalle verificado y citado de cada escuela está en su ficha.</p>
                <div className="psn-mc-matriz" role="region" aria-label="Matriz comparativa" tabIndex={0}>
                  <table>
                    <caption>Las siete lecturas, una al lado de otra</caption>
                    <thead><tr><th>Perspectiva</th><th>Formula el problema como</th><th>Busca lograr</th><th>Puede pasar por alto</th></tr></thead>
                    <tbody>
                      {perspectivas.map((p) => { const m = MIRADAS[p.id]; return m ? (
                        <tr key={p.id} style={{ "--pc": colorDe(p.nombre) }}><th scope="row">{p.nombre}</th><td>{m.problema}</td><td>{m.exito}</td><td>{m.limites}</td></tr>
                      ) : null; })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h4>{riesgos.length ? "4" : "3"} · Protocolos y técnicas de la biblioteca que podrían encajar</h4>
                {!protocolosListos && <p className="psn-mc-nota">Cargando protocolos y técnicas…</p>}
                {protocolosListos && temas.length === 0 && <p>Sin temas detectados no hay con qué emparejar protocolos.</p>}
                {protocolosListos && temas.length > 0 && (
                  <div className="psn-mc-protos">
                    {perspectivas.map((p) => {
                      const lista = candidatos[p.id] || [];
                      return (
                        <div key={p.id} className="psn-mc-proto-grupo" style={{ "--pc": colorDe(p.nombre) }}>
                          <h5>{p.nombre}</h5>
                          {lista.length === 0 ? <p className="psn-mc-nota">Ningún protocolo ni técnica documentado encaja claramente con los temas detectados.</p> : (
                            <ul>
                              {lista.map(({ it, e, hit }) => (
                                <li key={e.id + it.nombre}>
                                  <details>
                                    <summary>
                                      <span className={"tipo " + (it.tipo === "protocolo" ? "p" : "t")}>{it.tipo === "protocolo" ? "Protocolo" : "Técnica"}</span>
                                      <strong>{it.nombre}</strong>
                                      <small>{e.nombre}</small>
                                    </summary>
                                    <p className="encaja">Encaja con: {hit.map((t) => t.t).join(", ")}.</p>
                                    {it.poblacion && <p><b>Población: </b>{it.poblacion}</p>}
                                    {it.condiciones && <p><b>Condiciones: </b>{it.condiciones}</p>}
                                    <ol className="pasos">{(it.fases || []).map((f, i) => <li key={i}>{f}</li>)}</ol>
                                    <div className="fuente"><Fuente texto={it.fuente} /><span className="acc"><button onClick={() => onIrAProtocolos(e.id)}>Abrir en Protocolos y Técnicas</button> <button onClick={() => onIrAEscuela(e.id)}>Ficha de la escuela</button></span></div>
                                  </details>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {lagunas.length > 0 && (
                  <div className="psn-mc-conv">
                    <h5>Lo que esta biblioteca todavía no cubre</h5>
                    <p>No hay un protocolo ni una técnica documentados para: {lagunas.map((t) => t.t.toLowerCase()).join(", ")}. Las lecturas por perspectiva sirven de orientación, pero conviene buscar fuentes específicas.</p>
                  </div>
                )}
                {convergencias.length > 0 && (
                  <div className="psn-mc-conv">
                    <h5>Dónde convergen varias perspectivas</h5>
                    <ul>{convergencias.map(({ t, p }) => <li key={t.id}><b>{t.t}</b>: {p.size} perspectivas ofrecen un protocolo o técnica para esto ({[...p].map((id) => (perspectivas.find((x) => x.id === id) || {}).nombre).join(", ")}).</li>)}</ul>
                  </div>
                )}
                {tensiones.length > 0 && (
                  <div className="psn-mc-conv tension">
                    <h5>Si combinas las escuelas que encabezan cada lista, ojo con estas diferencias de fondo</h5>
                    <ul>{tensiones.map((l) => <li key={l.id}><b>{l.relacion}</b> entre «{l.conceptoA.nombre}» ({(porEscuela[l.conceptoA.escuela] || {}).nombre}) y «{l.conceptoB.nombre}» ({(porEscuela[l.conceptoB.escuela] || {}).nombre}). {String(l.nota || "").split(". ")[0]}.</li>)}</ul>
                  </div>
                )}
              </section>
            </>
          )}

          <section>
            <h4>{longitud >= 60 ? (riesgos.length ? "5" : "4") : "·"} · Tu formulación y el siguiente paso</h4>
            <label className="psn-mc-libre">
              <span>Mi formulación (hipótesis de trabajo)</span>
              <textarea rows={4} value={caso.formulacion} onChange={(e) => cambiar({ formulacion: e.target.value })} placeholder="¿Qué crees que mantiene el problema y qué lo hace comprensible en la historia de esta persona?" />
            </label>
            <label className="psn-mc-libre">
              <span>Siguiente paso</span>
              <textarea rows={2} value={caso.siguiente} onChange={(e) => cambiar({ siguiente: e.target.value })} placeholder="Qué harías primero y qué llevarías a supervisión." />
            </label>
          </section>

          {longitud >= 60 && pendientes.length > 0 && (
            <section>
              <h4>Para completar el caso, convendría preguntar</h4>
              <ul className="psn-mc-pend">{pendientes.map((x) => <li key={x.k}>{x.t}</li>)}</ul>
              <p className="psn-mc-nota">Aparecen los apartados sobre los que el texto no dice nada.</p>
            </section>
          )}

          {referencias.length > 0 && (
            <section className="psn-mc-refs">
              <h4>Referencias <button onClick={() => copiar("refs", referencias.map((r) => sinMarcas(r.referencia)).join("\n"))}>{copiado === "refs" ? "Copiadas ✓" : "Copiar en APA"}</button></h4>
              <ul>{referencias.map((r) => <li key={r.referencia}>{r.referencia.split("*").map((x, i) => (i % 2 ? <i key={i}>{x}</i> : x))}</li>)}</ul>
            </section>
          )}

          <p className="psn-mc-pie">Ejercicio de estudio y orientación: no sustituye el juicio clínico, el diagnóstico ni la supervisión. Las lecturas por perspectiva son síntesis generales de redacción propia; los protocolos y las técnicas provienen de la biblioteca y se citan con su fuente.</p>
        </article>
      </div>
      )}
    </section>
  );
}
