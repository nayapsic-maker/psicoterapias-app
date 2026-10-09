import React, { useMemo, useState, useEffect } from "react";
import { AUTORES, Avatar, slugsDeAutores, desplazamientos } from "./Figuras.jsx";

/* ============================================================
   PSICONAUTAS — funciones diferenciales
   · LineaTiempoGlobal: historia de las escuelas con retratos.
   · MapaRed: red de perspectivas + territorios sin textos superpuestos.
   · CasoSieteMiradas, TraductorClinico, DebateSimulado.
   · QuizEscuela y RetoRetratos (modo estudio).
   Todo se calcula a partir de las fichas y el diccionario de la app.
   ============================================================ */

export const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]+/g, " ").replace(/\s+/g, " ").trim();
export const unir = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string").join(". ") : typeof v === "string" ? v : "");

/* Primeras oraciones de un texto, sin cortar a mitad de frase. */
export function oraciones(texto, max = 330) {
  const crudo = unir(texto).replace(/\s+/g, " ").trim();
  if (!crudo) return "";
  // Los puntos de abreviaturas y citas (et al., p., pp., s. f., cap., iniciales) no cierran oración.
  const t = crudo.replace(/\b(et al|pp?|s\. ?f|cap|caps|ed|eds|vol|n\.º|núm|cf|Dr|Dra|Sr|Sra|ej|etc|vs|ca|aprox)\.|\b([A-ZÁÉÍÓÚ])\.(?=\s?[A-ZÁÉÍÓÚ])/g, (m) => m.replace(/\./g, "\u0001"));
  const partes = (t.match(/[^.!?]+[.!?]+(\s|$)/g) || [t]).map((x) => x.replace(/\u0001/g, "."));
  let out = "";
  for (const p of partes) {
    if (out && (out + p).length > max) break;
    out += p;
    if (out.length >= max * 0.6) break;
  }
  return (out || partes[0]).trim();
}
export const recortar = (t, n = 120) => {
  const s = oraciones(t, n);
  if (s.length <= n + 30) return s;
  return s.slice(0, n).replace(/\s+\S*$/, "") + "…";
};
export function semilla(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)), ((h >>> 0) % 100000) / 100000);
}
export const barajar = (arr, rnd = Math.random) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function Mini({ slug, tam = 40, desplaza = 0 }) {
  return <Avatar slug={slug} tam={tam} className="psn-mini" desplaza={desplaza} />;
}


/* Emblema de perspectiva: se usa cuando una escuela no tiene retrato de autor con licencia libre. */
export function Emblema({ perspectiva, color, tam = 44 }) {
  const p = (perspectiva || "").toLowerCase();
  let dibujo;
  if (p.startsWith("human")) dibujo = <path d="M12 20 C4 14.5 3.2 9.5 6.2 6.8 C8.6 4.7 11 6 12 8 C13 6 15.4 4.7 17.8 6.8 C20.8 9.5 20 14.5 12 20Z" fill="currentColor" />;
  else if (p.startsWith("psicod")) dibujo = (<><path d="M12 3 L16 11 H8Z" fill="currentColor" /><path d="M3 11 H21" stroke="currentColor" strokeWidth="1.6" /><path d="M6.5 12.5 H17.5 L12 21Z" fill="currentColor" opacity="0.5" /></>);
  else if (p.startsWith("sist")) dibujo = (<><path d="M12 6 L6 17 H18Z" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="6" r="2.8" fill="currentColor" /><circle cx="6" cy="17" r="2.8" fill="currentColor" /><circle cx="18" cy="17" r="2.8" fill="currentColor" /></>);
  else if (p.startsWith("conduc")) dibujo = (<><circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeDasharray="3.2 2.6" /><circle cx="12" cy="12" r="3.2" fill="currentColor" /></>);
  else if (p.startsWith("cogn")) dibujo = (<><path d="M12 3 a6 6 0 0 0 -3.2 11 v2.2 h6.4 v-2.2 A6 6 0 0 0 12 3z" fill="currentColor" /><path d="M9.6 19 h4.8 M10.6 21.4 h2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>);
  else if (p.startsWith("integ")) dibujo = (<><circle cx="9" cy="12" r="5.6" fill="currentColor" opacity="0.65" /><circle cx="15" cy="12" r="5.6" fill="currentColor" opacity="0.65" /></>);
  else dibujo = <path d="M12 2.5 C12.7 8.4 15.6 11.3 21.5 12 C15.6 12.7 12.7 15.6 12 21.5 C11.3 15.6 8.4 12.7 2.5 12 C8.4 11.3 11.3 8.4 12 2.5Z" fill="currentColor" />;
  return (
    <span className="psn-emblema" style={{ width: tam, height: tam, background: color }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={tam * 0.62} height={tam * 0.62} style={{ color: "#fff" }}>{dibujo}</svg>
    </span>
  );
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
                const desp = desplazamientos(slugs);
                lado += 1;
                return (
                  <li key={e.id} className={`psn-tl-item ${lado % 2 ? "izq" : "der"}`} style={{ "--pc": colorDe(e.perspectiva) }}>
                    <button onClick={() => onIrAEscuela(e.id)} title="Abrir ficha detallada">
                      <span className="psn-tl-anio">{anio}</span>
                      <span className="psn-tl-retratos">
                        {slugs.length ? slugs.map((s, i) => <Mini key={s} slug={s} tam={44} desplaza={desp[i]} />) : <Emblema perspectiva={e.perspectiva} color={colorDe(e.perspectiva)} tam={44} />}
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
export const COLOR_REL = { "equivalente aproximado": "#1F8A68", "análogo funcional": "#2F4BB5", "solapamiento parcial": "#B8892B", "falso amigo": "#8E2F3E", "reinterpretación asimilativa": "#8A5CC2", inconmensurable: "#1D2B26" };

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
            return <line key={x.a + x.b} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#1D2B26" strokeOpacity={activo ? 0.55 : 0.08} strokeWidth={1 + (x.n / maxN) * 9} strokeLinecap="round" />;
          })}
          {hubs.map((h) => {
            const col = colorDe(h.p);
            const activo = !sel || sel === h.p;
            const dx = Math.cos(h.a) * 62, dy = Math.sin(h.a) * 62;
            const anchor = Math.cos(h.a) > 0.25 ? "start" : Math.cos(h.a) < -0.25 ? "end" : "middle";
            return (
              <g key={h.p} className="psn-hub" opacity={activo ? 1 : 0.3} onClick={() => { setSel(sel === h.p ? null : h.p); setEscSel(null); }} tabIndex={0} role="button" aria-label={`Perspectiva ${h.p}`} onKeyDown={(ev) => ev.key === "Enter" && setSel(sel === h.p ? null : h.p)}>
                <circle cx={h.x} cy={h.y} r={34} fill={col} stroke="#1D2B26" strokeWidth="4" />
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
          const retratos = [...new Set(lista.flatMap((e) => slugsDeAutores(e.autores).filter((s) => AUTORES[s] && AUTORES[s].foto !== false)))].slice(0, 5);
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
              {(() => { const ss = slugsDeAutores(esc.autores).slice(0, 3); const d = desplazamientos(ss); return ss.map((s, i) => <Mini key={s} slug={s} tam={52} desplaza={d[i]} />); })()}
              <button className="psn-btn psn-btn-primario" onClick={() => onIrAEscuela(esc.id)}>Abrir ficha →</button>
            </div>
          </header>
          <h5>Puentes documentados ({puentes.length})</h5>
          {puentes.length === 0 && <p className="psn-vacio">Aún no hay puentes registrados para esta escuela: no significa que no existan, solo que no se han trazado.</p>}
          <ul>
            {puentes.slice(0, 8).map(({ l, otro, otroC, propioC }) => (
              <li key={l.id}>
                <span className="psn-rel" style={{ background: COLOR_REL[l.relacion] || "#4F5E57" }}>{l.relacion}</span>
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
            <Avatar slug={s} tam={64} />
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

/* Retratos (o ilustración / emblema) junto a cada sub-perspectiva. */
export function AvataresSub({ escuelas, escuelaId, color, perspectiva }) {
  const e = (escuelas || []).find((x) => x.id === escuelaId);
  const slugs = e ? slugsDeAutores(e.autores).slice(0, 2) : [];
  const desp = desplazamientos(slugs);
  return (
    <span className="psn-tl-retratos" style={{ flex: "none", alignSelf: "center" }}>
      {slugs.length ? slugs.map((s, i) => <Mini key={s} slug={s} tam={40} desplaza={desp[i]} />) : <Emblema perspectiva={perspectiva} color={color} tam={40} />}
    </span>
  );
}
