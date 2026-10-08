import React, { useMemo, useState, useEffect } from "react";
import { AUTORES, fotoAutor, slugsDeAutores } from "./Figuras.jsx";

/* ============================================================
   PSICONAUTAS — funciones diferenciales
   · LineaTiempoGlobal: historia de las escuelas con retratos.
   · MapaRed: red de perspectivas + territorios sin textos superpuestos.
   · CasoSieteMiradas, TraductorClinico, DebateSimulado.
   · QuizEscuela y RetoRetratos (modo estudio).
   Todo se calcula a partir de las fichas y el diccionario de la app.
   ============================================================ */

const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]+/g, " ").replace(/\s+/g, " ").trim();
const unir = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string").join(". ") : typeof v === "string" ? v : "");

/* Primeras oraciones de un texto, sin cortar a mitad de frase. */
export function oraciones(texto, max = 330) {
  const t = unir(texto).replace(/\s+/g, " ").trim();
  if (!t) return "";
  const partes = t.match(/[^.!?]+[.!?]+(\s|$)/g) || [t];
  let out = "";
  for (const p of partes) {
    if (out && (out + p).length > max) break;
    out += p;
    if (out.length >= max * 0.6) break;
  }
  return (out || partes[0]).trim();
}
const recortar = (t, n = 120) => {
  const s = oraciones(t, n);
  if (s.length <= n + 30) return s;
  return s.slice(0, n).replace(/\s+\S*$/, "") + "…";
};
function semilla(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)), ((h >>> 0) % 100000) / 100000);
}
const barajar = (arr, rnd = Math.random) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function Mini({ slug, tam = 40 }) {
  if (!AUTORES[slug]) return null;
  return <img className="psn-mini" src={fotoAutor(slug)} alt={`Retrato de ${AUTORES[slug].n}`} title={AUTORES[slug].n} width={tam} height={tam} loading="lazy" style={{ width: tam, height: tam }} />;
}

/* ------------------------------------------------------------ */
/*  LÍNEA DE TIEMPO                                             */
/* ------------------------------------------------------------ */
export function LineaTiempoGlobal({ escuelas, anioDe, colorDe, onIrAEscuela, perspectivas }) {
  const [filtro, setFiltro] = useState("todas");
  const items = useMemo(
    () => escuelas.map((e) => ({ e, anio: anioDe(e) })).filter((x) => x.anio).sort((a, b) => a.anio - b.anio || a.e.nombre.localeCompare(b.e.nombre)),
    [escuelas]
  );
  const visibles = items.filter((x) => filtro === "todas" || x.e.perspectiva === filtro);
  const porDecada = {};
  visibles.forEach((x) => {
    const d = Math.floor(x.anio / 10) * 10;
    (porDecada[d] = porDecada[d] || []).push(x);
  });
  const decadas = Object.keys(porDecada).map(Number).sort((a, b) => a - b);
  let lado = 0;
  return (
    <section className="psn-tl" aria-label="Línea de tiempo global de las escuelas">
      <div className="psn-tl-filtros">
        <button className={filtro === "todas" ? "on" : ""} onClick={() => setFiltro("todas")}>
          Todas · {items.length}
        </button>
        {perspectivas.map((p) => (
          <button key={p} className={filtro === p ? "on" : ""} style={{ "--pc": colorDe(p) }} onClick={() => setFiltro(p)}>
            {p} · {items.filter((x) => x.e.perspectiva === p).length}
          </button>
        ))}
      </div>
      <ol className="psn-tl-eje">
        {decadas.map((d) => (
          <li key={d} className="psn-tl-decada">
            <h4>
              <span>{d}</span>
              <small>{porDecada[d].length} {porDecada[d].length === 1 ? "escuela" : "escuelas"}</small>
            </h4>
            <ul>
              {porDecada[d].map(({ e, anio }) => {
                const slugs = slugsDeAutores(e.autores).slice(0, 2);
                lado += 1;
                return (
                  <li key={e.id} className={`psn-tl-item ${lado % 2 ? "izq" : "der"}`} style={{ "--pc": colorDe(e.perspectiva) }}>
                    <button onClick={() => onIrAEscuela(e.id)} title="Abrir ficha detallada">
                      <span className="psn-tl-anio">{anio}</span>
                      <span className="psn-tl-retratos">
                        {slugs.length ? slugs.map((s) => <Mini key={s} slug={s} tam={44} />) : <i className="psn-tl-punto" />}
                      </span>
                      <span className="psn-tl-texto">
                        <strong>{e.nombre}</strong>
                        <em>{e.perspectiva}</em>
                        {e.autores && <small>{e.autores.split(";")[0]}</small>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------ */
/*  MAPA CONCEPTUAL (red + territorios)                         */
/* ------------------------------------------------------------ */
const COLOR_REL = { "equivalente aproximado": "#1F8A68", "análogo funcional": "#2F4BB5", "solapamiento parcial": "#E9A100", "falso amigo": "#D9402A", "reinterpretación asimilativa": "#8A5CC2", inconmensurable: "#15183C" };

export function MapaRed({ escuelas, enlaces, colorDe, onIrAEscuela, perspectivas: persp0, nombreCorto }) {
  const perspectivas = useMemo(() => [...persp0.filter((p) => escuelas.some((e) => e.perspectiva === p)), ...new Set(escuelas.map((e) => e.perspectiva).filter((p) => !persp0.includes(p)))], [escuelas]);
  const [sel, setSel] = useState(null); // perspectiva
  const [escSel, setEscSel] = useState(null);
  const porId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e])), [escuelas]);
  const W = 900, H = 500, cx = W / 2, cy = H / 2, R = 180;
  const hubs = perspectivas.map((p, i) => {
    const a = (i / perspectivas.length) * 2 * Math.PI - Math.PI / 2;
    return { p, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), a };
  });
  const aristas = useMemo(() => {
    const m = {};
    enlaces.forEach((l) => {
      const A = porId[l.conceptoA?.escuela], B = porId[l.conceptoB?.escuela];
      if (!A || !B || A.perspectiva === B.perspectiva) return;
      const k = [A.perspectiva, B.perspectiva].sort().join("|");
      m[k] = (m[k] || 0) + 1;
    });
    return Object.entries(m).map(([k, n]) => ({ a: k.split("|")[0], b: k.split("|")[1], n }));
  }, [enlaces, porId]);
  const maxN = Math.max(1, ...aristas.map((x) => x.n));
  const hub = (p) => hubs.find((h) => h.p === p);
  const mostradas = sel ? [sel] : perspectivas;
  const esc = escSel ? porId[escSel] : null;
  const puentes = esc
    ? enlaces
        .filter((l) => l.conceptoA?.escuela === esc.id || l.conceptoB?.escuela === esc.id)
        .map((l) => {
          const otroLado = l.conceptoA.escuela === esc.id ? l.conceptoB : l.conceptoA;
          const propio = l.conceptoA.escuela === esc.id ? l.conceptoA : l.conceptoB;
          return { l, otro: porId[otroLado.escuela], otroC: otroLado.nombre, propioC: propio.nombre };
        })
        .filter((x) => x.otro)
    : [];
  return (
    <section className="psn-mapa" aria-label="Mapa conceptual de perspectivas y escuelas">
      <div className="psn-mapa-red">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Red de puentes documentados entre perspectivas">
          {aristas.map((x) => {
            const A = hub(x.a), B = hub(x.b);
            if (!A || !B) return null;
            const activo = !sel || sel === x.a || sel === x.b;
            return <line key={x.a + x.b} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#15183C" strokeOpacity={activo ? 0.55 : 0.08} strokeWidth={1 + (x.n / maxN) * 9} strokeLinecap="round" />;
          })}
          {hubs.map((h) => {
            const col = colorDe(h.p);
            const activo = !sel || sel === h.p;
            const dx = Math.cos(h.a) * 62, dy = Math.sin(h.a) * 62;
            const anchor = Math.cos(h.a) > 0.25 ? "start" : Math.cos(h.a) < -0.25 ? "end" : "middle";
            return (
              <g key={h.p} className="psn-hub" opacity={activo ? 1 : 0.3} onClick={() => { setSel(sel === h.p ? null : h.p); setEscSel(null); }} tabIndex={0} role="button" aria-label={`Perspectiva ${h.p}`} onKeyDown={(ev) => ev.key === "Enter" && setSel(sel === h.p ? null : h.p)}>
                <circle cx={h.x} cy={h.y} r={34} fill={col} stroke="#15183C" strokeWidth="4" />
                <text x={h.x} y={h.y + 6} textAnchor="middle" fill="#fff" style={{ font: "800 17px var(--f-display)" }}>
                  {escuelas.filter((e) => e.perspectiva === h.p).length}
                </text>
                <text x={h.x + dx} y={h.y + dy + 4} textAnchor={anchor} fill="var(--c-ink)" style={{ font: "800 14px var(--f-display)" }}>
                  {nombreCorto(h.p)}
                </text>
              </g>
            );
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--c-ink)" style={{ font: "800 18px var(--f-display)" }}>{enlaces.length}</text>
          <text x={cx} y={cy + 16} textAnchor="middle" fill="var(--c-inkSoft)" style={{ font: "500 11px var(--f-mono)" }}>puentes</text>
        </svg>
        <p className="psn-mapa-nota">Cada círculo es una perspectiva (con su número de escuelas); el grosor de la línea es la cantidad de puentes documentados entre ellas en el diccionario traslacional. Toca una perspectiva para enfocarla.</p>
      </div>
      <div className="psn-territorios">
        {mostradas.map((p) => {
          const col = colorDe(p);
          const lista = escuelas.filter((e) => e.perspectiva === p);
          const subs = [...new Set(lista.map((e) => (e.subfamilia || "Otras").replace(/^\d+\.\s*/, "")))];
          const retratos = [...new Set(lista.flatMap((e) => slugsDeAutores(e.autores)))].slice(0, 5);
          return (
            <article key={p} className="psn-terr" style={{ "--pc": col }}>
              <header>
                <h4>{p}</h4>
                <span>{retratos.map((s) => <Mini key={s} slug={s} tam={34} />)}</span>
              </header>
              {subs.map((sf) => (
                <div key={sf} className="psn-terr-sub">
                  <h5>{sf}</h5>
                  <div>
                    {lista
                      .filter((e) => (e.subfamilia || "Otras").replace(/^\d+\.\s*/, "") === sf)
                      .map((e) => (
                        <button key={e.id} className={escSel === e.id ? "on" : ""} onClick={() => setEscSel(escSel === e.id ? null : e.id)}>
                          {e.nombre}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </article>
          );
        })}
      </div>
      {esc && (
        <aside className="psn-mapa-detalle" style={{ "--pc": colorDe(esc.perspectiva) }}>
          <header>
            <div>
              <span className="psn-chip">{esc.perspectiva}</span>
              <h4>{esc.nombre}</h4>
              <p>{oraciones(esc.fundamentacion, 280)}</p>
            </div>
            <div className="psn-mapa-det-acc">
              {slugsDeAutores(esc.autores).slice(0, 3).map((s) => <Mini key={s} slug={s} tam={52} />)}
              <button className="psn-btn psn-btn-primario" onClick={() => onIrAEscuela(esc.id)}>Abrir ficha →</button>
            </div>
          </header>
          <h5>Puentes documentados ({puentes.length})</h5>
          {puentes.length === 0 && <p className="psn-vacio">Aún no hay puentes registrados para esta escuela: no significa que no existan, solo que no se han trazado.</p>}
          <ul>
            {puentes.slice(0, 8).map(({ l, otro, otroC, propioC }) => (
              <li key={l.id}>
                <span className="psn-rel" style={{ background: COLOR_REL[l.relacion] || "#514D74" }}>{l.relacion}</span>
                <p>
                  <em>{propioC}</em> ↔ <button onClick={() => setEscSel(otro.id)}>{otro.nombre}</button>: <em>{otroC}</em>
                </p>
              </li>
            ))}
          </ul>
          {puentes.length > 8 && <p className="psn-vacio">+{puentes.length - 8} más en el módulo Diccionario.</p>}
        </aside>
      )}
    </section>
  );
}

/* ------------------------------------------------------------ */
/*  CASO CLÍNICO EN 7 MIRADAS                                   */
/* ------------------------------------------------------------ */
const MIRADAS = {
  humanista: {
    mira: "La experiencia vivida de la persona, su sentido y su autenticidad.",
    rol: "Acompañar con presencia: empatía, aceptación y congruencia, sin dirigir.",
    preguntas: ["¿Qué siente esta persona que no se permite ser o decir?", "¿Qué condiciones de valía ha tenido que cumplir para sentirse aceptada?", "¿Qué sentido o valor está en juego en lo que le ocurre?", "¿Qué haría si se permitiera ser plenamente quien es?"],
    exito: "Mayor congruencia, autenticidad y sentido; no solo menos síntomas.",
  },
  psicodinamica: {
    mira: "El conflicto inconsciente, las defensas y los patrones relacionales que vienen de la historia temprana.",
    rol: "Interpretar y sostener el vínculo, trabajando con la transferencia y la contratransferencia.",
    preguntas: ["¿Qué patrón relacional se repite, y desde cuándo?", "¿Qué defensas aparecen ante la angustia?", "¿Qué se evita sentir o decir en la sesión?", "¿Qué despierta en el vínculo terapéutico (transferencia)?"],
    exito: "Insight, elaboración del conflicto y defensas más flexibles.",
  },
  sistemica: {
    mira: "El sistema: pautas de interacción, reglas, jerarquías y la función del síntoma.",
    rol: "Intervenir en el sistema (o en su lectura), con el terapeuta como parte de lo que observa.",
    preguntas: ["¿Quién más participa del problema, y cómo?", "¿Qué ocurre justo antes y justo después del síntoma?", "¿Qué función podría cumplir el síntoma en la familia?", "¿Qué cambiaría, para cada miembro, si el problema desapareciera?"],
    exito: "Cambio en las pautas de interacción y en la narrativa compartida.",
  },
  conductual: {
    mira: "La conducta observable y sus contingencias: antecedentes, conducta y consecuencias.",
    rol: "Analizar funcionalmente y diseñar el entrenamiento o la exposición, con medición.",
    preguntas: ["¿Qué conducta exactamente, con qué frecuencia, duración e intensidad?", "¿Qué la precede y qué la sigue?", "¿Qué la mantiene hoy (refuerzo, evitación)?", "¿Qué conducta alternativa se puede reforzar?"],
    exito: "Cambio medible en la conducta objetivo y generalización a la vida cotidiana.",
  },
  cognitivo: {
    mira: "Los pensamientos automáticos, las creencias y los esquemas que median la emoción y la conducta.",
    rol: "Colaborar empíricamente: contrastar creencias con evidencia y experimentos.",
    preguntas: ["¿Qué pasó por tu mente en ese momento?", "¿Qué evidencia hay a favor y en contra de ese pensamiento?", "¿Qué creencia de fondo sostiene esta reacción?", "¿Qué experimento pondría a prueba esa creencia?"],
    exito: "Reducción de síntomas con evidencia y un pensamiento más flexible.",
  },
  integradora: {
    mira: "La formulación individualizada, los factores comunes y el ajuste del tratamiento a la persona.",
    rol: "Combinar enfoques según la formulación, cuidando la alianza y la fase del cambio.",
    preguntas: ["¿En qué fase del cambio está la persona?", "¿Cómo es la alianza terapéutica hoy?", "¿Qué técnicas de distintas escuelas encajan con esta formulación?", "¿Qué evidencia respalda ese ajuste?"],
    exito: "Respuesta al tratamiento, alianza sólida y ajuste continuo.",
  },
  transpersonal: {
    mira: "La dimensión espiritual y transpersonal: estados de conciencia, sentido trascendente e integración.",
    rol: "Acompañar y facilitar la integración de experiencias que exceden la biografía individual.",
    preguntas: ["¿Qué lugar tienen la espiritualidad o la trascendencia en su vida?", "¿Qué experiencias de conexión o expansión ha tenido?", "¿Cómo integra experiencias no ordinarias de conciencia?", "¿Qué parte de sí quiere desarrollarse?"],
    exito: "Integración de la experiencia y una identidad más amplia.",
  },
};
const TEMAS = {
  ansiedad: ["ansied", "panico", "preocup", "miedo", "fobia", "nerv", "taquicardia", "evita"],
  "estado de ánimo": ["deprim", "triste", "anhedonia", "desanim", "sin ganas", "llanto", "culpa"],
  trauma: ["trauma", "abuso", "violencia", "accidente", "flashback", "pesadilla", "agresion"],
  duelo: ["duelo", "perdida", "falleci", "muert", "separacion"],
  "pareja y familia": ["pareja", "familia", "madre", "padre", "hijo", "hermano", "matrimonio", "conflicto familiar"],
  "adicciones": ["alcohol", "droga", "consumo", "adiccion", "sustancia", "juego"],
  "alimentación": ["comida", "atracon", "peso", "anorex", "bulim", "alimenta"],
  "identidad y sentido": ["sentido", "vacio", "identidad", "proposito", "existencial", "soledad"],
  "psicosis": ["voces", "alucin", "delirio", "paranoi", "psicosis"],
  "relaciones y personalidad": ["impulsiv", "abandono", "inestable", "relaciones intensas", "limite", "borderline", "personalidad"],
};
const CASOS_EJEMPLO = [
  { t: "Marta, 34 años", txt: "Marta consulta por ansiedad desde hace ocho meses, tras un ascenso. Duerme mal, evita las reuniones y se critica por «no estar a la altura». Cuenta que su padre era muy exigente y que ella siempre sintió que debía ganarse el cariño. Con su pareja discute más y se aísla." },
  { t: "Familia Rojas", txt: "Los padres traen a Daniel, de 15 años, que dejó de ir al colegio y pasa el día en su habitación. La madre habla por él y el padre casi no interviene. Hace un año falleció el abuelo y desde entonces hay tensión en casa." },
  { t: "Andrés, 47 años", txt: "Andrés llegó tras perder su empleo. Dice sentir vacío, sin sentido ni ganas de hacer nada, bebe más de lo habitual y repite que «ya nada importa». Siempre se definió por su trabajo; quisiera entender para qué vive." },
];

export function CasoSieteMiradas({ escuelas, perspectivas, colorDe, onIrAEscuela, idDe = () => null }) {
  const [caso, setCaso] = useState("");
  const [abierto, setAbierto] = useState(null);
  const q = norm(caso);
  const temas = Object.entries(TEMAS).filter(([, ks]) => ks.some((k) => q.includes(k))).map(([t]) => t);
  const palabras = [...new Set(q.split(" ").filter((w) => w.length > 4))];
  const sugerencias = (p) =>
    escuelas
      .filter((e) => e.perspectiva === p.nombre || idDe(e.perspectiva) === p.id)
      .map((e) => {
        const texto = norm([e.nombre, unir(e.psicopatologia), unir(e.presentaciones), unir(e.conceptos), unir(e.tecnicas)].join(" "));
        const sc = palabras.reduce((s, w) => s + (texto.includes(w.slice(0, 6)) ? 1 : 0), 0);
        return { e, sc };
      })
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 3);
  return (
    <section className="psn-caso">
      <p className="psn-intro">Escribe o elige un caso breve (ficticio o anonimizado). La app lo lee desde cada una de las siete perspectivas: qué miraría, qué preguntaría, qué buscaría lograr y qué escuelas de esa perspectiva revisar primero.</p>
      <div className="psn-caso-ejemplos">
        {CASOS_EJEMPLO.map((c) => (
          <button key={c.t} onClick={() => setCaso(c.txt)}>
            Ejemplo: {c.t}
          </button>
        ))}
      </div>
      <textarea value={caso} onChange={(e) => setCaso(e.target.value)} rows={5} placeholder="Describe el motivo de consulta, la historia relevante y el contexto…" aria-label="Caso clínico" />
      {temas.length > 0 && (
        <p className="psn-temas">
          Temas detectados: {temas.map((t) => <span key={t} className="psn-chip">{t}</span>)}
        </p>
      )}
      {caso.trim().length > 25 && (
        <>
          <div className="psn-miradas">
            {perspectivas.map((p) => {
              const m = MIRADAS[p.id];
              if (!m) return null;
              const col = colorDe(p.nombre);
              const abre = abierto === p.id;
              return (
                <article key={p.id} className={abre ? "on" : ""} style={{ "--pc": col }}>
                  <button className="psn-mirada-cab" onClick={() => setAbierto(abre ? null : p.id)} aria-expanded={abre}>
                    <h4>{p.nombre}</h4>
                    <span>{m.mira}</span>
                  </button>
                  {abre && (
                    <div className="psn-mirada-cuerpo">
                      <h5>Cómo lo formularía</h5>
                      <p>
                        {temas.length ? `Ante ${temas.join(" y ")}, ` : ""}esta perspectiva se centraría en: {m.mira.charAt(0).toLowerCase() + m.mira.slice(1)} {m.rol}
                      </p>
                      <h5>Preguntas que haría</h5>
                      <ul>{m.preguntas.map((x) => <li key={x}>{x}</li>)}</ul>
                      <h5>Qué buscaría lograr</h5>
                      <p>{m.exito}</p>
                      <h5>Escuelas para revisar primero</h5>
                      <div className="psn-mirada-esc">
                        {sugerencias(p).map(({ e }) => (
                          <button key={e.id} onClick={() => onIrAEscuela(e.id)}>
                            {e.nombre}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <p className="psn-aviso">Ejercicio de estudio: no sustituye el juicio clínico, el diagnóstico ni la supervisión. Las preguntas y metas sintetizan el enfoque general de cada perspectiva; el detalle de cada escuela está en su ficha.</p>
        </>
      )}
    </section>
  );
}

/* ------------------------------------------------------------ */
/*  TRADUCTOR DE LENGUAJE CLÍNICO                               */
/* ------------------------------------------------------------ */
export function TraductorClinico({ escuelas, glosario, enlaces, colorDe, onIrAEscuela, perspectivas }) {
  const [texto, setTexto] = useState("");
  const [elegido, setElegido] = useState(0);
  const porId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e])), [escuelas]);
  const q = norm(texto);
  const enlacesDe = (g) => {
    const nt = norm(g.termino);
    return enlaces.filter((l) => [l.conceptoA, l.conceptoB].some((c) => c.escuela === g.escuela && (norm(c.nombre).includes(nt) || nt.includes(norm(c.nombre)))));
  };
  const candidatos = useMemo(() => {
    if (q.length < 3) return [];
    const ordena = (lista) => lista.map((g) => ({ g, n: enlacesDe(g).length })).sort((a, b) => b.n - a.n).map((x) => x.g);
    const exactos = glosario.filter((g) => norm(g.termino).includes(q) || (norm(g.termino).length > 3 && q.includes(norm(g.termino))));
    if (exactos.length) return ordena(exactos).slice(0, 8);
    const ws = q.split(" ").filter((w) => w.length > 4);
    if (!ws.length) return [];
    return ordena(glosario
      .map((g) => ({ g, sc: ws.reduce((s, w) => s + (norm(g.termino + " " + g.definicion).includes(w.slice(0, 6)) ? 1 : 0), 0) }))
      .filter((x) => x.sc > 0)
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 24)
      .map((x) => x.g)).slice(0, 8);
  }, [q, glosario, enlaces]);
  useEffect(() => setElegido(0), [q]);
  const c = candidatos[elegido];
  const puentes = useMemo(() => {
    if (!c) return {};
    const nt = norm(c.termino);
    const out = {};
    enlaces.forEach((l) => {
      [[l.conceptoA, l.conceptoB], [l.conceptoB, l.conceptoA]].forEach(([yo, otro]) => {
        if (yo.escuela !== c.escuela) return;
        const ny = norm(yo.nombre);
        if (!(ny.includes(nt) || nt.includes(ny))) return;
        const E = porId[otro.escuela];
        if (!E) return;
        (out[E.perspectiva] = out[E.perspectiva] || []).push({ l, E, otro });
      });
    });
    return out;
  }, [c, enlaces, porId]);
  const origen = c ? porId[c.escuela] : null;
  const total = Object.values(puentes).reduce((s, a) => s + a.length, 0);
  return (
    <section className="psn-trad">
      <p className="psn-intro">Escribe un término o una frase clínica («resistencia», «apego», «pensamiento automático»…). El traductor busca la definición y muestra cómo se reformula —o se pierde— en cada perspectiva, con los puentes que documenta el diccionario traslacional.</p>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej.: resistencia, refuerzo, inconsciente, esquema…" aria-label="Término clínico a traducir" />
      {q.length >= 3 && candidatos.length === 0 && <p className="psn-vacio">No encontré ese término en el glosario. Prueba con otra palabra más específica.</p>}
      {candidatos.length > 1 && (
        <div className="psn-trad-cands" role="tablist" aria-label="Coincidencias">
          {candidatos.map((g, i) => (
            <button key={g.escuela + g.termino} className={i === elegido ? "on" : ""} onClick={() => setElegido(i)}>
              {g.termino}
              <small>{porId[g.escuela]?.nombre}</small>
            </button>
          ))}
        </div>
      )}
      {c && origen && (
        <div className="psn-trad-res">
          <article className="psn-trad-origen" style={{ "--pc": colorDe(origen.perspectiva) }}>
            <span className="psn-chip">{origen.perspectiva} · {origen.nombre}</span>
            <h4>{c.termino}</h4>
            <p>{c.definicion}</p>
          </article>
          <h5>Cómo se dice en las demás perspectivas ({total} {total === 1 ? "puente" : "puentes"})</h5>
          <div className="psn-trad-grid">
            {perspectivas.map((p) => {
              const lista = puentes[p] || [];
              return (
                <article key={p} style={{ "--pc": colorDe(p) }} className={lista.length ? "" : "vacia"}>
                  <h6>{p}</h6>
                  {lista.length === 0 ? (
                    <p className="psn-vacio">Sin puente documentado para este término.</p>
                  ) : (
                    lista.slice(0, 3).map(({ l, E, otro }) => (
                      <div key={l.id} className="psn-trad-puente">
                        <span className="psn-rel" style={{ background: COLOR_REL[l.relacion] || "#514D74" }}>{l.relacion}</span>
                        <strong>{otro.nombre}</strong>
                        <button onClick={() => onIrAEscuela(E.id)}>{E.nombre}</button>
                        <p>{oraciones(l.nota, 300)}</p>
                      </div>
                    ))
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------ */
/*  DEBATE SIMULADO                                             */
/* ------------------------------------------------------------ */
const TEMAS_DEBATE = [
  { k: "psicopatologia", t: "¿Qué es el sufrimiento psíquico?" },
  { k: "ontologia", t: "¿Qué es una persona?" },
  { k: "epistemologia", t: "¿Cómo se conoce lo clínico?" },
  { k: "criterioVerdad", t: "¿Qué cuenta como verdad?" },
  { k: "metodologia", t: "¿Cómo se trabaja en terapia?" },
  { k: "tecnicas", t: "¿Qué produce el cambio?" },
];

export function DebateSimulado({ escuelas, enlaces, colorDe }) {
  const ordenadas = useMemo(() => [...escuelas].sort((a, b) => a.perspectiva.localeCompare(b.perspectiva) || a.nombre.localeCompare(b.nombre)), [escuelas]);
  const [ida, setIda] = useState("");
  const [idb, setIdb] = useState("");
  const [tema, setTema] = useState("psicopatologia");
  const A = escuelas.find((e) => e.id === ida), B = escuelas.find((e) => e.id === idb);
  const tt = TEMAS_DEBATE.find((x) => x.k === tema);
  const dicho = (e) => (tema === "tecnicas" ? (Array.isArray(e.tecnicas) ? "Para producir cambio recurre a: " + e.tecnicas.filter((x) => typeof x === "string").slice(0, 5).join("; ") + "." : oraciones(e.tecnicas)) : oraciones(e[tema], 360));
  const puentes = A && B ? enlaces.filter((l) => (l.conceptoA.escuela === A.id && l.conceptoB.escuela === B.id) || (l.conceptoA.escuela === B.id && l.conceptoB.escuela === A.id)) : [];
  const elige = (valor, set) => (
    <select value={valor} onChange={(e) => set(e.target.value)}>
      <option value="">— elige una escuela —</option>
      {ordenadas.map((e) => (
        <option key={e.id} value={e.id} disabled={e.id === ida || e.id === idb}>
          {e.perspectiva.split("-")[0]} · {e.nombre}
        </option>
      ))}
    </select>
  );
  const Voz = ({ e, lado }) => {
    const s = slugsDeAutores(e.autores)[0];
    return (
      <div className={`psn-voz ${lado}`} style={{ "--pc": colorDe(e.perspectiva) }}>
        <div className="psn-voz-id">
          {s ? <Mini slug={s} tam={56} /> : <i className="psn-tl-punto" />}
          <strong>{e.nombre}</strong>
          <small>{e.perspectiva}</small>
        </div>
        <blockquote>{dicho(e) || "Esta ficha aún no desarrolla este punto."}</blockquote>
      </div>
    );
  };
  return (
    <section className="psn-debate">
      <p className="psn-intro">Elige dos escuelas y un tema. La app arma el cruce de posturas con lo que dice la ficha de cada una —sin inventar argumentos— y añade los puentes que el diccionario documenta entre ambas.</p>
      <div className="psn-debate-sel">
        <label>Escuela A {elige(ida, setIda)}</label>
        <label>Escuela B {elige(idb, setIdb)}</label>
        <label>
          Tema
          <select value={tema} onChange={(e) => setTema(e.target.value)}>
            {TEMAS_DEBATE.map((x) => <option key={x.k} value={x.k}>{x.t}</option>)}
          </select>
        </label>
      </div>
      {A && B ? (
        <div className="psn-debate-escena">
          <p className="psn-mod"><b>Moderación:</b> «{tt.t}». {A.nombre} responde desde la perspectiva {A.perspectiva}; {B.nombre}, desde {B.perspectiva}.</p>
          <Voz e={A} lado="izq" />
          <Voz e={B} lado="der" />
          <p className="psn-mod">
            <b>Qué dice el diccionario:</b>{" "}
            {puentes.length ? `hay ${puentes.length} ${puentes.length === 1 ? "puente documentado" : "puentes documentados"} entre ambas.` : "no hay puentes documentados entre estas dos escuelas; eso no impide trazarlos, pero advierte que quizá no comparten vocabulario."}
          </p>
          {puentes.slice(0, 3).map((l) => (
            <div key={l.id} className="psn-voz-puente">
              <span className="psn-rel" style={{ background: COLOR_REL[l.relacion] || "#514D74" }}>{l.relacion}</span>
              <p><em>{l.conceptoA.nombre}</em> ↔ <em>{l.conceptoB.nombre}</em></p>
              <p>{oraciones(l.nota, 340)}</p>
            </div>
          ))}
          <p className="psn-mod"><b>Para pensar:</b> ¿qué tendría que concederle {A.nombre} a {B.nombre} para que la conversación fuera posible, y qué perdería al hacerlo?</p>
        </div>
      ) : (
        <p className="psn-vacio">Elige las dos escuelas para empezar el cruce.</p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------ */
/*  MODO ESTUDIO: cuestionario y reflexión por escuela          */
/* ------------------------------------------------------------ */
export function QuizEscuela({ e, escuelas }) {
  const rnd = useMemo(() => semilla(e.id), [e.id]);
  const preguntas = useMemo(() => {
    const otras = escuelas.filter((x) => x.perspectiva !== e.perspectiva);
    const pick = (n, f) => barajar(otras.map(f).filter(Boolean), rnd).slice(0, n);
    const qs = [];
    const ct = recortar(e.criterioVerdad, 130);
    if (ct) qs.push({ q: `¿Qué criterio de verdad sostiene «${e.nombre}»?`, ok: ct, malas: pick(3, (x) => recortar(x.criterioVerdad, 130)) });
    const conc = (e.conceptos || []).filter((c) => typeof c === "string");
    if (conc.length) {
      const ok = conc[Math.floor(rnd() * conc.length)];
      qs.push({ q: `¿Cuál de estos conceptos pertenece a «${e.nombre}»?`, ok, malas: pick(3, (x) => (x.conceptos || []).find((c) => typeof c === "string" && !conc.includes(c))) });
    }
    const aut = (e.autores || "").split(";")[0].trim();
    if (aut) qs.push({ q: `¿Qué autor/a se asocia a «${e.nombre}»?`, ok: aut, malas: pick(3, (x) => (x.autores || "").split(";")[0].trim()).filter((n) => n !== aut) });
    const perspectivas = [...new Set(escuelas.map((x) => x.perspectiva))];
    qs.push({ q: `¿A qué perspectiva pertenece «${e.nombre}»?`, ok: e.perspectiva, malas: barajar(perspectivas.filter((p) => p !== e.perspectiva), rnd).slice(0, 3) });
    return qs.map((x) => ({ ...x, opciones: barajar([x.ok, ...[...new Set(x.malas)].filter((m) => m && m !== x.ok).slice(0, 3)], rnd) })).filter((x) => x.opciones.length >= 3);
  }, [e.id]);
  const [resp, setResp] = useState({});
  const [nota, setNota] = useState("");
  const clave = `psiconautas:nota:${e.id}`;
  useEffect(() => { try { setNota(localStorage.getItem(clave) || ""); } catch { setNota(""); } setResp({}); }, [e.id]);
  const guardar = (v) => { setNota(v); try { localStorage.setItem(clave, v); } catch { /* sin almacenamiento */ } };
  const aciertos = preguntas.filter((p, i) => resp[i] === p.ok).length;
  const hechas = Object.keys(resp).length;
  return (
    <section className="psn-quiz">
      <header>
        <h4>Modo estudio · ponte a prueba</h4>
        <span className="psn-chip">{hechas ? `${aciertos}/${preguntas.length} correctas` : `${preguntas.length} preguntas`}</span>
      </header>
      {preguntas.map((p, i) => (
        <fieldset key={i}>
          <legend>{i + 1}. {p.q}</legend>
          {p.opciones.map((o) => {
            const sel = resp[i] === o;
            const resuelta = resp[i] !== undefined;
            return (
              <button key={o} disabled={resuelta} className={resuelta ? (o === p.ok ? "ok" : sel ? "mal" : "") : ""} onClick={() => setResp({ ...resp, [i]: o })}>
                {o}
              </button>
            );
          })}
        </fieldset>
      ))}
      <div className="psn-quiz-refl">
        <h5>Para reflexionar</h5>
        <ol>
          <li>Explica con tus palabras qué entiende «{e.nombre}» por sufrimiento y cómo lo enfrentaría otra perspectiva.</li>
          <li>¿Qué límites reconoce la propia evidencia de esta escuela? ¿Qué aceptarías y qué no?</li>
          <li>Piensa en un caso: ¿en qué situación elegirías esta escuela, y cuándo no?</li>
        </ol>
        <textarea value={nota} onChange={(ev) => guardar(ev.target.value)} rows={4} placeholder="Tu diario de estudio (se guarda solo en este navegador)…" aria-label="Diario de estudio" />
      </div>
    </section>
  );
}

/* Adivina quién: se muestra una síntesis y hay que elegir el retrato. */
export function RetoRetratos() {
  const conS = useMemo(() => Object.keys(AUTORES).filter((s) => AUTORES[s].s), []);
  const [ronda, setRonda] = useState(0);
  const [elegida, setElegida] = useState(null);
  const [aciertos, setAciertos] = useState(0);
  const [jugadas, setJugadas] = useState(0);
  const { ok, opciones } = useMemo(() => {
    const o = conS[Math.floor(Math.random() * conS.length)];
    return { ok: o, opciones: barajar([o, ...barajar(conS.filter((s) => s !== o)).slice(0, 3)]) };
  }, [ronda]);
  const responde = (s) => {
    if (elegida) return;
    setElegida(s);
    setJugadas((j) => j + 1);
    if (s === ok) setAciertos((a) => a + 1);
  };
  return (
    <section className="psn-reto">
      <header>
        <h4>Reto: ¿quién lo sostiene?</h4>
        <span className="psn-chip">{aciertos}/{jugadas}</span>
      </header>
      <blockquote>{AUTORES[ok].s}</blockquote>
      <div className="psn-reto-op">
        {opciones.map((s) => (
          <button key={s} disabled={!!elegida} className={elegida ? (s === ok ? "ok" : s === elegida ? "mal" : "") : ""} onClick={() => responde(s)}>
            <img src={fotoAutor(s)} alt="" width="64" height="64" />
            <span>{AUTORES[s].n}</span>
          </button>
        ))}
      </div>
      {elegida && (
        <p className="psn-reto-fin">
          {elegida === ok ? "¡Correcto! " : `Era ${AUTORES[ok].n}. `}{AUTORES[ok].r}.{" "}
          <button className="psn-btn" onClick={() => { setElegida(null); setRonda(ronda + 1); }}>Otra →</button>
        </p>
      )}
    </section>
  );
}
