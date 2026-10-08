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
  humanista: ["rogers", "maslow", "frankl"],
  psicodinamica: ["freud", "jung", "adler"],
  sistemica: ["satir", "haley", "bertalanffy"],
  conductual: ["skinner", "pavlov", "watson"],
  cognitivo: ["beck", "ellis", "bandura"],
  integradora: ["kabatzinn", "seligman", "yalom"],
  transpersonal: ["grof", "assagioli", "jung"],
};

function textoCredito(slug) {
  const a = AUTORES[slug];
  return a ? `${a.n} · Foto: ${a.f}, ${a.l}, vía Wikimedia Commons` : "";
}

/* ---------- Retratos ---------- */
export function GaleriaAutores({ slugs, color, titulo = "Voces de este módulo" }) {
  const lista = slugs.filter((s) => AUTORES[s]);
  if (!lista.length) return null;
  return (
    <aside className="psn-galeria" aria-label={titulo} style={{ "--pc": color || "var(--c-gold)" }}>
      <span className="psn-galeria-titulo">{titulo}</span>
      <ul>
        {lista.map((s) => (
          <li key={s} title={textoCredito(s)}>
            <img src={fotoAutor(s)} alt={`Retrato de ${AUTORES[s].n}`} width="64" height="64" loading="lazy" />
            <span>
              <strong>{AUTORES[s].n}</strong>
              <em>{AUTORES[s].a}</em>
              <small>{AUTORES[s].r}</small>
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
  if (!autores) return null;
  const vistos = new Set();
  const lista = [];
  autores.split(/;| y | e /).forEach((t) => {
    const nombre = t.replace(/\(.*?\)/g, "").replace(/[,.]+$/g, "").trim();
    const sl = ALIAS_AUTOR[claveNombre(nombre)];
    if (sl && AUTORES[sl] && !vistos.has(sl)) {
      vistos.add(sl);
      lista.push(sl);
    }
  });
  if (!lista.length) return null;
  return (
    <div className="psn-retratos-escuela" style={{ "--pc": color }}>
      {lista.slice(0, 4).map((s) => {
        const a = AUTORES[s];
        return (
          <figure key={s} title={textoCredito(s)}>
            <img src={fotoAutor(s)} alt={`Retrato de ${a.n}`} width="52" height="52" loading="lazy" />
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
  return (
    <span className="psn-retratos" style={{ "--pc": color }} aria-hidden="true">
      {slugs.map((s) => (
        <img key={s} src={fotoAutor(s)} alt="" width="64" height="64" loading="lazy" />
      ))}
    </span>
  );
}

export function CreditosFotos() {
  const lista = Object.keys(AUTORES);
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
      <p>Imágenes obtenidas de Wikimedia Commons; cada obra conserva su licencia y autoría.</p>
    </details>
  );
}


/* Logo: la Ψ de la psicología cuyo brazo central es un telescopio que apunta a una estrella. */
export function LogoPsiconautas({ size = 28, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Logo de Psiconautas: una Ψ con un telescopio apuntando a una estrella" style={{ flexShrink: 0 }}>
      <path d="M8 13 V22 Q8 34 24 34 Q40 34 40 22 V13" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M24 34 V44.5 M17.5 44.5 H30.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <g transform="rotate(24 24 34)">
        <path d="M20.6 31 L19 11 H29 L27.4 31 Z" fill="#FFC233" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="17" y="6.5" width="14" height="5.5" rx="2" fill="#FFC233" stroke="currentColor" strokeWidth="2.2" />
        <path d="M20.2 21 H27.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
      <path d="M41 2.5 C41.4 5.4 42.6 6.6 45.5 7 C42.6 7.4 41.4 8.6 41 11.5 C40.6 8.6 39.4 7.4 36.5 7 C39.4 6.6 40.6 5.4 41 2.5Z" fill="#FFC233" />
    </svg>
  );
}


/* ---------- Cosmos de fondo: estrellas luminosas y planetas-objeto ---------- */
function rnd(seed) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const COLORES_ESTRELLA = ["#ffffff", "#ffffff", "#cfe0ff", "#ffe39a", "#ffd0a8"];

const PLANETAS = [
  { id: "libro", cls: "p1", tam: 118 },
  { id: "probeta", cls: "p2", tam: 128 },
  { id: "cerebro", cls: "p3", tam: 104 },
  { id: "matraz", cls: "p4", tam: 116 },
  { id: "atomo", cls: "p5", tam: 86 },
  { id: "psi", cls: "p6", tam: 82 },
];

function Esfera({ id, c1, c2 }) {
  return (
    <>
      <defs>
        <radialGradient id={`pg-${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="40" fill={`url(#pg-${id})`} />
    </>
  );
}

function DibujoPlaneta({ id }) {
  const ink = "#15183C";
  switch (id) {
    case "libro":
      return (
        <svg viewBox="0 0 120 120">
          <Esfera id={id} c1="#9a7bff" c2="#3a2a9a" />
          <ellipse cx="60" cy="62" rx="56" ry="13" fill="none" stroke="#ffd36b" strokeWidth="3" transform="rotate(-14 60 62)" />
          <path d="M26 56 Q43 47 60 56 Q77 47 94 56 V80 Q77 71 60 80 Q43 71 26 80Z" fill="#fbf1d8" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M60 56 V80" stroke={ink} strokeWidth="2.5" />
          <path d="M32 61 Q43 56 54 61 M32 67 Q43 62 54 67 M66 61 Q77 56 88 61 M66 67 Q77 62 88 67" stroke="#b9a77a" strokeWidth="1.6" fill="none" />
        </svg>
      );
    case "probeta":
      return (
        <svg viewBox="0 0 120 120">
          <Esfera id={id} c1="#52e0c4" c2="#0b6b66" />
          <g transform="rotate(32 60 60)">
            <rect x="48" y="14" width="24" height="92" rx="12" fill="#e9f6ff" fillOpacity="0.55" stroke={ink} strokeWidth="3" />
            <path d="M50 62 H70 V94 Q70 104 60 104 Q50 104 50 94Z" fill="#ffc233" />
            <rect x="44" y="11" width="32" height="7" rx="3.5" fill="#fbf1d8" stroke={ink} strokeWidth="2.5" />
            <circle cx="56" cy="76" r="3" fill="#fff" fillOpacity="0.8" />
            <circle cx="64" cy="86" r="2.2" fill="#fff" fillOpacity="0.8" />
            <circle cx="58" cy="52" r="2.6" fill="#ffc233" />
          </g>
        </svg>
      );
    case "cerebro":
      return (
        <svg viewBox="0 0 120 120">
          <Esfera id={id} c1="#ff9ec0" c2="#b02a5e" />
          <path d="M60 28 V92 M36 44 Q48 40 52 52 Q44 58 38 66 M84 44 Q72 40 68 52 Q76 58 82 66 M40 80 Q52 76 56 86 M80 80 Q68 76 64 86 M44 34 Q54 32 58 40 M76 34 Q66 32 62 40" stroke="#fff4e4" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "matraz":
      return (
        <svg viewBox="0 0 120 120">
          <defs>
            <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7dffc8" />
              <stop offset="1" stopColor="#1f8a68" />
            </linearGradient>
          </defs>
          <path d="M48 14 H72 V42 L100 96 Q106 108 92 108 H28 Q14 108 20 96 L48 42Z" fill="#e9f6ff" fillOpacity="0.4" stroke="#fbf1d8" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M40 72 L80 72 L97 100 Q100 104 94 104 H26 Q20 104 23 100Z" fill="url(#liq)" />
          <circle cx="52" cy="90" r="4" fill="#fff" fillOpacity="0.75" />
          <circle cx="68" cy="84" r="3" fill="#fff" fillOpacity="0.75" />
          <circle cx="60" cy="96" r="2.4" fill="#fff" fillOpacity="0.75" />
          <rect x="44" y="10" width="32" height="8" rx="4" fill="#fbf1d8" stroke={ink} strokeWidth="2.5" />
        </svg>
      );
    case "atomo":
      return (
        <svg viewBox="0 0 120 120">
          <Esfera id={id} c1="#ffb066" c2="#c2410c" />
          {[0, 60, 120].map((r) => (
            <ellipse key={r} cx="60" cy="60" rx="52" ry="17" fill="none" stroke="#fff4e4" strokeWidth="3" transform={`rotate(${r} 60 60)`} />
          ))}
          <circle cx="60" cy="60" r="8" fill="#fff4e4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 120">
          <Esfera id={id} c1="#4c6bff" c2="#101b5c" />
          <path d="M38 40 V54 Q38 76 60 76 Q82 76 82 54 V40 M60 30 V92" stroke="#ffc233" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      );
  }
}

export function Cosmos() {
  const estrellas = React.useMemo(() => {
    const r = rnd(20261008);
    return Array.from({ length: 190 }, () => {
      const g = r();
      const tam = g > 0.93 ? 3.2 : g > 0.75 ? 2.2 : g > 0.4 ? 1.6 : 1.1;
      const col = COLORES_ESTRELLA[Math.floor(r() * COLORES_ESTRELLA.length)];
      return { x: r() * 100, y: r() * 100, tam, col, d: r() * 6, t: 2.4 + r() * 4 };
    });
  }, []);
  return (
    <div className="psn-cosmos" aria-hidden="true">
      {estrellas.map((e, i) => (
        <i key={i} style={{ left: `${e.x}%`, top: `${e.y}%`, width: e.tam, height: e.tam, background: e.col, boxShadow: `0 0 ${e.tam * 4}px ${e.tam}px ${e.col}88`, animationDelay: `${e.d}s`, animationDuration: `${e.t}s` }} />
      ))}
      <b className="psn-fugaz f1" />
      <b className="psn-fugaz f2" />
      {PLANETAS.map((p) => (
        <span key={p.id} className={`psn-planeta-obj ${p.cls}`} style={{ width: p.tam, height: p.tam }}>
          <DibujoPlaneta id={p.id} />
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

/* Slugs con retrato a partir de un campo «autores». */
export function slugsDeAutores(autores) {
  const vistos = new Set();
  const lista = [];
  (autores || "").split(/;| y | e /).forEach((t) => {
    const nombre = t.replace(/\(.*?\)/g, "").replace(/[,.]+$/g, "").trim();
    const sl = ALIAS_AUTOR[claveNombre(nombre)];
    if (sl && AUTORES[sl] && !vistos.has(sl)) {
      vistos.add(sl);
      lista.push(sl);
    }
  });
  return lista;
}
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
            <img src={fotoAutor((AUTORES_POR_PERSPECTIVA[p.id] || ["freud"])[0])} alt="" width="34" height="34" loading="lazy" />
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
