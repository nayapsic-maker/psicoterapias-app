import React from "react";
import { AUTORES, ALIAS_AUTOR } from "./autores.js";

/* ============================================================
   PSICONAUTAS — piezas visuales
   · Retratos reales de autores (Wikimedia Commons, licencias libres).
   · Personas animadas en SVG: una sesión de terapia y un grupo.
   · HeroMision, GaleriaAutores, RetratosPerspectiva, CintaEscuelas.
   Todo el movimiento es CSS y respeta prefers-reduced-motion.
   ============================================================ */

const BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) || "/";
export const fotoAutor = (slug) => `${BASE}img/autores/${slug}.jpg`;

// Autores representativos por perspectiva (ids de FUNDAMENTOS_PERSPECTIVAS).
export const AUTORES_POR_PERSPECTIVA = {
  humanista: ["rogers", "maslow", "frankl", "seligman", "yalom"],
  psicodinamica: ["freud", "jung", "adler", "melanieklein", "winnicott"],
  sistemica: ["satir", "haley", "bertalanffy", "michaelwhite", "maraselvinipalazzoli"],
  conductual: ["skinner", "pavlov", "watson", "thorndike", "wolpe"],
  cognitivo: ["beck", "ellis", "bandura", "kabatzinn", "donaldmeichenbaum"],
  integradora: ["lazarus", "prochaska", "stricker", "goldfried", "jeromefrank"],
  transpersonal: ["grof", "assagioli", "jung", "maslow", "kenwilber"],
};

function textoCredito(slug) {
  const a = infoAutor(slug);
  if (!a) return "";
  return a.foto === false ? `${a.n} · ilustración representativa (no es un retrato)` : `${a.n} · Foto: ${a.f}, ${a.l}, vía Wikimedia Commons`;
}

/* ---------- Retratos ---------- */
/* Ilustraciones representativas (genéricas) para quienes no tienen retrato con licencia libre. */
const POOL = { m: 8, f: 4 };
const FEMENINOS = new Set(["natalie", "laura", "miriam", "lynne", "emmy", "elisabeth", "bonnie", "oliva", "maria", "edith", "jessica", "donna", "alessandra", "mary", "cloé", "cloe", "giuliana", "insoo", "mara", "susan", "barbara", "geraldine", "catherine", "marsha", "mavis", "sona", "janet", "marjorie", "judith", "christine", "ana", "virginia", "karen", "melanie", "anna", "lynn", "sandra", "nancy", "ellen", "lisa", "carolyn", "kirsten"]);
function hash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}
function infoAutor(slug) {
  if (AUTORES[slug]) return AUTORES[slug];
  if (slug && slug.startsWith("g:")) return { n: slug.slice(2), foto: false, g: FEMENINOS.has(norm1(slug.slice(2).split(" ")[0])) ? "f" : "m", generico: true };
  return null;
}
const norm1 = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
export function tieneFoto(slug) {
  const a = infoAutor(slug);
  return !!a && a.foto !== false;
}
const rutaPool = (slug, a, desplaza = 0) => {
  const g = a.g === "f" ? "f" : "m";
  const i = (hash(slug) + desplaza) % POOL[g];
  return `${BASE}img/autores/pool-${g}${i + 1}.jpg`;
};

/* Retrato circular; si no hay foto libre, ilustración representativa genérica (no es un retrato). */
export function Avatar({ slug, tam = 48, className = "", desplaza = 0 }) {
  const a = infoAutor(slug);
  if (!a) return null;
  if (a.foto === false) {
    return <img className={className} src={rutaPool(slug, a, desplaza)} alt={`Ilustración representativa para ${a.n} (no es un retrato)`} title={`${a.n} · ilustración representativa, sin retrato con licencia libre`} width={tam} height={tam} loading="lazy" style={{ width: tam, height: tam }} />;
  }
  return <img className={className} src={fotoAutor(slug)} alt={`Retrato de ${a.n}`} title={textoCredito(slug)} width={tam} height={tam} loading="lazy" style={{ width: tam, height: tam }} />;
}

/* Reparte desplazamientos para que dos autores del mismo género no repitan ilustración dentro de una lista. */
function desplazamientos(slugs) {
  const usados = { m: new Set(), f: new Set() };
  return slugs.map((s) => {
    const a = infoAutor(s);
    if (!a || a.foto !== false) return 0;
    const g = a.g === "f" ? "f" : "m";
    let d = 0;
    while (d < POOL[g] && usados[g].has((hash(s) + d) % POOL[g])) d++;
    usados[g].add((hash(s) + d) % POOL[g]);
    return d;
  });
}

export function GaleriaAutores({ slugs, color, titulo = "Voces de este módulo" }) {
  const lista = slugs.filter((s) => infoAutor(s));
  const desp = desplazamientos(lista);
  if (!lista.length) return null;
  return (
    <aside className="psn-galeria" aria-label={titulo} style={{ "--pc": color || "var(--c-gold)" }}>
      <span className="psn-galeria-titulo">{titulo}</span>
      <ul>
        {lista.map((s, i) => (
          <li key={s} title={textoCredito(s)}>
            <Avatar slug={s} tam={56} desplaza={desp[i]} />
            <span>
              <strong>{infoAutor(s).n}</strong>
              {infoAutor(s).a && <em>{infoAutor(s).a}</em>}
              {infoAutor(s).r && <small>{infoAutor(s).r}</small>}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

const claveNombre = (n) => n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]+/g, "");

/* Retrato circular suelto (p. ej. filósofos de la ciencia). */
export function Retrato({ slug, tam = 64 }) {
  const a = AUTORES[slug];
  if (!a) return null;
  return (
    <img className="psn-retrato-flota" src={fotoAutor(slug)} alt={`Retrato de ${a.n}`} title={textoCredito(slug)} width={tam} height={tam} loading="lazy" style={{ width: tam, height: tam }} />
  );
}

/* Retratos de quienes figuran en el campo «autores» de una escuela, con una frase que resume su enfoque. */
export function RetratosEscuela({ autores, color }) {
  const lista = slugsDeAutores(autores).slice(0, 5);
  if (!lista.length) return null;
  const desp = desplazamientos(lista);
  return (
    <div className="psn-retratos-escuela" style={{ "--pc": color }}>
      {lista.map((s, i) => {
        const a = infoAutor(s);
        return (
          <figure key={s} title={textoCredito(s)}>
            <Avatar slug={s} tam={52} desplaza={desp[i]} />
            <figcaption>
              <strong>{a.n}</strong>
              {a.a && <em> {a.a}</em>}
              {a.q ? (
                <blockquote>
                  «{a.q}»<cite> — {a.qf}</cite>
                </blockquote>
              ) : (
                a.s && <p>{a.s}</p>
              )}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

/* Dos retratos superpuestos en la esquina de la tarjeta de perspectiva. */
export function RetratosPerspectiva({ id, color }) {
  const slugs = (AUTORES_POR_PERSPECTIVA[id] || []).slice(0, 2);
  const desp = desplazamientos(slugs);
  return (
    <span className="psn-retratos" style={{ "--pc": color }} aria-hidden="true">
      {slugs.map((s, i) => (
        <Avatar key={s} slug={s} tam={58} desplaza={desp[i]} />
      ))}
    </span>
  );
}

export function CreditosFotos() {
  const lista = Object.keys(AUTORES).filter((s) => AUTORES[s].foto !== false);
  return (
    <details className="psn-creditos">
      <summary>Créditos de las fotografías</summary>
      <ul>
        {lista.map((s) => (
          <li key={s}>
            {AUTORES[s].n}: {AUTORES[s].f} · {AUTORES[s].l}
          </li>
        ))}
      </ul>
      <p>Imágenes obtenidas de Wikimedia Commons; cada obra conserva su licencia y autoría. Cuando una persona no tiene retrato con licencia libre se muestra una ilustración genérica, hecha en Canva, que no pretende reproducir su rostro.</p>
    </details>
  );
}


/* Logo: la Ψ de la psicología, dorada y detallada, con estrellas alrededor. */
export function LogoPsiconautas({ size = 28, className = "" }) {
  const id = React.useId().replace(/:/g, "");
  const cup = "M17 17v11a15 15 0 0 0 30 0V17";
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Logo de Psiconautas: la letra Ψ de la psicología, dorada, rodeada de estrellas" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`oro-${id}`} gradientUnits="userSpaceOnUse" x1="10" y1="4" x2="54" y2="58">
          <stop offset="0" stopColor="#FFEFB0" />
          <stop offset=".5" stopColor="#FFD25A" />
          <stop offset="1" stopColor="#E39A00" />
        </linearGradient>
        <radialGradient id={`halo-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFD25A" stopOpacity=".26" />
          <stop offset="1" stopColor="#FFD25A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="31" cy="34" r="27" fill={`url(#halo-${id})`} />
      <g stroke="#F3E9D2" strokeWidth="7.2" opacity=".95">
        <path d={cup} />
        <path d="M32 12v41" />
        <path d="M23 54h18" strokeWidth="5.4" />
      </g>
      <g stroke={`url(#oro-${id})`} strokeWidth="4.6">
        <path d={cup} />
        <path d="M32 12v41" />
        <path d="M23 54h18" strokeWidth="2.8" />
      </g>
      <g stroke="#FFFBE6" strokeWidth=".9" opacity=".85">
        <path d="M15.3 18v10a16.7 16.7 0 0 0 4 10.8" />
        <path d="M30.6 14v37" />
      </g>
      <g fill={`url(#oro-${id})`} stroke="#F3E9D2" strokeWidth="1.2">
        <path d="M17 7.5l3 5.2-3 4.3-3-4.3z" />
        <path d="M47 7.5l3 5.2-3 4.3-3-4.3z" />
        <path d="M32 3.5l3.4 6-3.4 4.8-3.4-4.8z" />
      </g>
      <path d="M54 8c.7 5 2.4 6.9 7.4 7.6-5 .7-6.7 2.6-7.4 7.6-.7-5-2.4-6.9-7.4-7.6 5-.7 6.7-2.6 7.4-7.6z" fill="#FFE9A8" />
      <path d="M54 4v3M54 24v3M43 15.6h3M62 15.6h3" stroke="#FFE9A8" strokeWidth=".9" opacity=".7" />
      <path d="M9 38c.4 2.8 1.4 3.8 4.2 4.2-2.8.4-3.8 1.4-4.2 4.2-.4-2.8-1.4-3.8-4.2-4.2 2.8-.4 3.8-1.4 4.2-4.2z" fill="#FFE9A8" />
      <circle cx="56" cy="40" r="1.3" fill="#FFE9A8" />
      <circle cx="6" cy="14" r="1" fill="#FFE9A8" />
      <circle cx="58" cy="52" r=".9" fill="#FFE9A8" />
    </svg>
  );
}

/* ---------- Cosmos de fondo ----------
   Capas: cielo degradado → nebulosas → estrellas (con destellos) → constelaciones →
   órbitas → medallones-objeto en los márgenes laterales (nunca bajo el texto). */
function rnd(seed) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const COLORES_ESTRELLA = ["#ffffff", "#ffffff", "#dbe6ff", "#fff0c4", "#ffd9b8"];
const W = 1600, H = 1000;

const CONSTELACIONES = [
  { pts: [[130, 360], [210, 318], [262, 392], [350, 350], [398, 430], [300, 470]], lineas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]] },
  { pts: [[1180, 760], [1262, 720], [1320, 800], [1410, 770], [1456, 850]], lineas: [[0, 1], [1, 2], [2, 3], [3, 4]] },
];

function MedallonObjeto({ id }) {
  const cr = "#F3E9D2";
  const oro = "#FFD76A";
  const icono = {
    libro: (
      <g strokeLinejoin="round" strokeLinecap="round">
        <rect x="35" y="26" width="52" height="70" rx="3" fill="#1d2a78" stroke={cr} strokeWidth="2" />
        <path d="M35 26 V96" stroke="#0e1650" strokeWidth="6" />
        <rect x="42" y="32" width="41" height="58" rx="1.5" fill="none" stroke={oro} strokeWidth="1" strokeOpacity=".8" />
        <text x="62.5" y="48" textAnchor="middle" fill={oro} style={{ font: "700 5.4px Georgia, serif", letterSpacing: "0.3px" }}>PRINCIPLES</text>
        <text x="62.5" y="55" textAnchor="middle" fill={cr} style={{ font: "italic 5px Georgia, serif" }}>of</text>
        <text x="62.5" y="63" textAnchor="middle" fill={oro} style={{ font: "700 5.4px Georgia, serif", letterSpacing: "0.3px" }}>PSYCHOLOGY</text>
        <path d="M50 70 H75" stroke={oro} strokeWidth=".8" strokeOpacity=".8" />
        <path d="M62.5 74 c1.2 3.4 2.6 4.8 6 5.6 -3.4 .8 -4.8 2.2 -6 5.6 -1.2 -3.4 -2.6 -4.8 -6 -5.6 3.4 -.8 4.8 -2.2 6 -5.6z" fill={oro} stroke="none" />
      </g>
    ),
    divan: (
      <g strokeLinejoin="round" strokeLinecap="round" fill="none" stroke={cr} strokeWidth="2.2">
        <path d="M28 78 V62 a8 8 0 0 1 8 -8 H44 a6 6 0 0 1 6 6 V66 H86 a8 8 0 0 1 8 8 V78 Z" fill="#7a2f5a" fillOpacity=".75" />
        <path d="M28 78 H94 M34 78 V88 M88 78 V88" />
        <path d="M54 66 Q70 58 86 66" strokeOpacity=".8" />
        <ellipse cx="46" cy="58" rx="7" ry="5" fill={oro} fillOpacity=".9" stroke="none" />
        <path d="M30 44 q4 -6 8 0 M44 38 q3 -5 6 0" strokeWidth="1.4" strokeOpacity=".7" />
        <path d="M82 38 c.9 2.6 2 3.7 4.6 4.6 -2.6 .9 -3.7 2 -4.6 4.6 -.9 -2.6 -2 -3.7 -4.6 -4.6 2.6 -.9 3.7 -2 4.6 -4.6z" fill={oro} stroke="none" />
      </g>
    ),
    cerebro: (
      <g fill="none" stroke={cr} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M60 32 C47 27 36 36 38 47 C29 51 29 65 38 69 C38 80 51 87 60 80 C69 87 82 80 82 69 C91 65 91 51 82 47 C84 36 73 27 60 32Z" fill="#7a2f6a" fillOpacity=".6" />
        <path d="M60 32 V80 M44 48 Q51 45 54 54 M76 48 Q69 45 66 54 M46 66 Q53 63 56 70 M74 66 Q67 63 64 70 M47 38 Q55 36 58 43 M73 38 Q65 36 62 43" strokeWidth="1.7" />
        <path d="M60 80 v8 M54 90 h12" strokeWidth="2" />
      </g>
    ),
    mariposa: (
      <g strokeLinejoin="round" strokeLinecap="round">
        <path d="M60 58 C48 34 24 36 24 54 C24 64 40 66 60 62Z" fill="#4fd9ee" fillOpacity=".85" stroke={cr} strokeWidth="1.6" />
        <path d="M60 58 C72 34 96 36 96 54 C96 64 80 66 60 62Z" fill="#4fd9ee" fillOpacity=".85" stroke={cr} strokeWidth="1.6" />
        <path d="M60 64 C46 66 34 74 38 86 C42 94 54 88 60 70Z" fill="#b58cff" fillOpacity=".9" stroke={cr} strokeWidth="1.6" />
        <path d="M60 64 C74 66 86 74 82 86 C78 94 66 88 60 70Z" fill="#b58cff" fillOpacity=".9" stroke={cr} strokeWidth="1.6" />
        <circle cx="39" cy="50" r="5" fill="#fff" fillOpacity=".5" /><circle cx="81" cy="50" r="5" fill="#fff" fillOpacity=".5" />
        <circle cx="46" cy="80" r="3" fill={oro} fillOpacity=".9" /><circle cx="74" cy="80" r="3" fill={oro} fillOpacity=".9" />
        <path d="M32 46 q10 -4 20 2 M88 46 q-10 -4 -20 2" fill="none" stroke={cr} strokeWidth="1" strokeOpacity=".7" />
        <path d="M60 52 V84" stroke={cr} strokeWidth="3.6" />
        <path d="M60 52 C56 42 50 38 46 36 M60 52 C64 42 70 38 74 36" fill="none" stroke={cr} strokeWidth="1.4" />
        <circle cx="46" cy="36" r="1.6" fill={oro} stroke="none" /><circle cx="74" cy="36" r="1.6" fill={oro} stroke="none" />
      </g>
    ),
  }[id];
  const col = { libro: ["#6c4fe0", "#241a78"], divan: ["#c2417a", "#3d1560"], cerebro: ["#d6477a", "#4a1760"], mariposa: ["#2d6bff", "#101b6a"] }[id];
  return (
    <svg viewBox="0 0 120 120" overflow="visible">
      <defs>
        <radialGradient id={`mg-${id}`} cx="34%" cy="28%" r="80%">
          <stop offset="0" stopColor={col[0]} />
          <stop offset="1" stopColor={col[1]} />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill={`url(#mg-${id})`} />
      <circle cx="60" cy="60" r="52" fill="none" stroke={cr} strokeOpacity=".5" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="57" fill="none" stroke={oro} strokeOpacity=".35" strokeWidth=".8" strokeDasharray="1 5" strokeLinecap="round" />
      <ellipse cx="44" cy="30" rx="22" ry="11" fill="#fff" fillOpacity=".1" transform="rotate(-24 44 30)" />
      {icono}
    </svg>
  );
}

/* Constelación con la forma de la Ψ, para el margen derecho. */
function ConstelacionPsi() {
  const P = [[20, 30], [20, 88], [50, 116], [80, 88], [80, 30], [50, 6], [50, 150]];
  const L = [[0, 1], [1, 2], [2, 3], [3, 4], [5, 2], [2, 6]];
  return (
    <svg viewBox="0 0 100 160" overflow="visible">
      <g stroke="#FFD76A" strokeOpacity=".5" strokeWidth="1.3" strokeDasharray="2 4">
        {L.map(([a, b], i) => <line key={i} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} />)}
      </g>
      {P.map(([x, y], i) => (
        <g key={i} className="psn-tit" style={{ animationDelay: `${i * 0.7}s`, animationDuration: "4.5s" }}>
          <circle cx={x} cy={y} r="7" fill="#FFE9A8" fillOpacity=".14" />
          <circle cx={x} cy={y} r="2.8" fill="#FFF3C9" />
        </g>
      ))}
    </svg>
  );
}

const MEDALLONES = [
  { id: "libro", lado: "i", y: 16, d: 0 },
  { id: "divan", lado: "i", y: 58, d: -6 },
  { id: "psi", lado: "d", y: 11, d: -3 },
  { id: "cerebro", lado: "d", y: 43, d: -8 },
  { id: "mariposa", lado: "d", y: 70, d: -11 },
];

export function Cosmos() {
  const { estrellas, destellos } = React.useMemo(() => {
    const r = rnd(20261008);
    const est = Array.from({ length: 340 }, (_, i) => {
      const g = r();
      const tam = g > 0.95 ? 2.6 : g > 0.8 ? 1.9 : g > 0.45 ? 1.3 : 0.9;
      return { x: r() * W, y: r() * H, tam, col: COLORES_ESTRELLA[Math.floor(r() * COLORES_ESTRELLA.length)], d: r() * 8, t: 2.6 + r() * 5, anim: i % 3 === 0 };
    });
    const des = Array.from({ length: 16 }, () => ({ x: 60 + r() * (W - 120), y: 40 + r() * (H - 80), s: 7 + r() * 9, col: COLORES_ESTRELLA[Math.floor(r() * 4)], d: r() * 6 }));
    return { estrellas: est, destellos: des };
  }, []);
  return (
    <div className="psn-cosmos" aria-hidden="true">
      <div className="psn-nebulosa n1" />
      <div className="psn-nebulosa n2" />
      <div className="psn-nebulosa n3" />
      <svg className="psn-capa" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#F3E9D2" strokeOpacity=".07" strokeWidth="1">
          <ellipse cx="800" cy="1180" rx="1150" ry="520" />
          <ellipse cx="800" cy="1180" rx="1500" ry="760" />
          <ellipse cx="-80" cy="-120" rx="620" ry="380" transform="rotate(20 -80 -120)" />
        </g>
        {estrellas.map((s, i) => (
          <circle key={i} className={s.anim ? "psn-tit" : ""} cx={s.x} cy={s.y} r={s.tam} fill={s.col} fillOpacity={s.tam > 1.5 ? 0.95 : 0.7} style={s.anim ? { animationDelay: `${s.d}s`, animationDuration: `${s.t}s` } : undefined} />
        ))}
        {destellos.map((s, i) => (
          <g key={i} className="psn-tit" style={{ animationDelay: `${s.d}s`, animationDuration: "5s" }} transform={`translate(${s.x} ${s.y})`}>
            <circle r={s.s * 0.9} fill={s.col} fillOpacity=".12" />
            <path d={`M0 ${-s.s} C1 ${-s.s / 4} ${s.s / 4} -1 ${s.s} 0 C${s.s / 4} 1 1 ${s.s / 4} 0 ${s.s} C-1 ${s.s / 4} ${-s.s / 4} 1 ${-s.s} 0 C${-s.s / 4} -1 -1 ${-s.s / 4} 0 ${-s.s}Z`} fill={s.col} />
          </g>
        ))}
        {CONSTELACIONES.map((c, i) => (
          <g key={i} stroke="#FFD76A" strokeOpacity=".32" strokeWidth="1.1" fill="#FFE9A8">
            {c.lineas.map(([a, b], k) => <line key={k} x1={c.pts[a][0]} y1={c.pts[a][1]} x2={c.pts[b][0]} y2={c.pts[b][1]} strokeDasharray="2 5" />)}
            {c.pts.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="2.8" stroke="none" fillOpacity=".9" />)}
          </g>
        ))}
      </svg>
      <b className="psn-fugaz f1" />
      <b className="psn-fugaz f2" />
      {MEDALLONES.map((m) => (
        <span key={m.id} className={`psn-medallon ${m.lado}${m.id === "psi" ? " psi" : ""}`} style={{ top: `${m.y}%`, animationDelay: `${m.d}s` }}>
          {m.id === "psi" ? <ConstelacionPsi /> : <MedallonObjeto id={m.id} />}
        </span>
      ))}
    </div>
  );
}

/* ---------- Ilustraciones (Canva, estilo plano) ---------- */
const ALT_ESCENA = {
  sesion: "Ilustración: dos personas conversan sentadas frente a frente en una sala luminosa",
  grupo: "Ilustración: un grupo conversa en círculo en una sala con plantas",
  balanza: "Ilustración: dos personas junto a una balanza, una sostiene un cerebro y la otra un corazón",
  puente: "Ilustración: dos personas construyen un puente tablón a tablón entre dos acantilados",
  divan: "Ilustración: sesión psicoanalítica con una persona recostada en un diván y su analista tomando notas",
  meditacion: "Ilustración: una persona medita sentada rodeada de plantas",
  debate: "Ilustración: dos personas debaten en atriles frente a un público",
};
export function Escena({ nombre }) {
  if (!ALT_ESCENA[nombre]) return null;
  return <img className="psn-escena" src={`${BASE}img/escenas/${nombre}.jpg`} alt={ALT_ESCENA[nombre]} loading="lazy" />;
}
export const EscenaSesion = () => <Escena nombre="sesion" />;

/* Slugs de los autores de un campo «autores»: los conocidos (con foto o ilustración propia) y, si no, genéricos. */
export function slugsDeAutores(autores) {
  const vistos = new Set();
  const conocidos = [];
  const genericos = [];
  (autores || "").split(/;| y | e /).forEach((t) => {
    const nombre = t.replace(/\(.*?\)/g, "").replace(/[,.]+$/g, "").replace(/\s+/g, " ").trim();
    if (!nombre) return;
    const sl = ALIAS_AUTOR[claveNombre(nombre)];
    if (sl && AUTORES[sl]) {
      if (!vistos.has(sl)) { vistos.add(sl); conocidos.push(sl); }
    } else if (nombre.split(" ").length >= 2 && nombre.split(" ").length <= 5 && !nombre.includes(",") && /^[A-ZÁÉÍÓÚÑ]/.test(nombre)) {
      const g = "g:" + nombre;
      if (!vistos.has(g)) { vistos.add(g); genericos.push(g); }
    }
  });
  // primero quienes tienen foto real, luego ilustraciones propias, luego genéricos
  const conFoto = conocidos.filter((s) => AUTORES[s].foto !== false);
  const sinFoto = conocidos.filter((s) => AUTORES[s].foto === false);
  return [...conFoto, ...sinFoto, ...genericos];
}
export { desplazamientos };
export { AUTORES };

/* ---------- Portada ---------- */
const FUNDADORES = ["freud", "jung", "rogers", "skinner", "beck", "satir", "maslow", "pavlov", "frankl", "perls", "bandura", "adler"];

export function HeroMision({ perspectivas, totalEscuelas, totalTerminos, onIrAFundamentos, onIrAComparar, onModoEstudio }) {
  return (
    <section className="psn-hero" aria-label="Presentación">
      <div className="psn-hero-top">
        <div>
          <div className="psn-eyebrow">Expedición clínica · {perspectivas.length} perspectivas</div>
          <h1 className="psn-titulo">
            Psico<span>nautas</span>
          </h1>
          <p className="psn-sub">El cosmos psicoterapéutico</p>
        </div>
        <div className="psn-bajada">
          <p>Un recorrido por diferentes términos y perspectivas acerca de la psicoterapia. Cada perspectiva responde a su manera qué es el sufrimiento, qué produce el cambio y qué cuenta como verdad clínica.</p>
          <div className="psn-botones">
            <button className="psn-btn psn-btn-primario" onClick={onIrAFundamentos}>
              Explorar las perspectivas →
            </button>
            <button className="psn-btn" onClick={onIrAComparar}>
              Comparar escuelas
            </button>
            {onModoEstudio && (
              <button className="psn-btn psn-btn-texto" onClick={onModoEstudio}>
                Modo estudio
              </button>
            )}
          </div>
        </div>
      </div>

      <figure className="psn-cabina">
        <Escena nombre="sesion" />
      </figure>

      <div className="psn-fundadores" aria-label="Algunas de las voces de la psicología">
        <div className="psn-fundadores-pista">
          {[...FUNDADORES, ...FUNDADORES].map((s, i) => (
            <figure key={i} title={textoCredito(s)}>
              <img src={fotoAutor(s)} alt={i < FUNDADORES.length ? `Retrato de ${AUTORES[s].n}` : ""} width="84" height="84" loading="lazy" />
              <figcaption>{AUTORES[s].n}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <ul className="psn-leyenda" aria-label="Perspectivas">
        {perspectivas.map((p) => (
          <li key={p.id} style={{ "--pc": p.color }}>
            <Avatar slug={(AUTORES_POR_PERSPECTIVA[p.id] || ["freud"]).find((s) => tieneFoto(s)) || "freud"} tam={34} />
            <span>{p.corto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CintaEscuelas({ items }) {
  const doble = [...items, ...items];
  return (
    <div className="psn-cinta" aria-hidden="true">
      <div className="psn-cinta-pista">
        {doble.map((it, i) => (
          <span key={i} style={{ "--pc": it.color }}>
            {it.nombre}
          </span>
        ))}
      </div>
    </div>
  );
}
