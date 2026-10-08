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
  psicodinamica: ["freud", "jung", "adler"],
  sistemica: ["satir", "haley", "bertalanffy"],
  conductual: ["skinner", "pavlov", "watson"],
  cognitivo: ["beck", "ellis", "bandura", "kabatzinn"],
  integradora: ["lazarus", "prochaska", "stricker", "goldfried", "jeromefrank"],
  transpersonal: ["grof", "assagioli", "jung"],
};

function textoCredito(slug) {
  const a = AUTORES[slug];
  return a ? `${a.n} · Foto: ${a.f}, ${a.l}, vía Wikimedia Commons` : "";
}

/* ---------- Retratos ---------- */
/* Retrato circular o, si no hay foto libre, monograma sobre el color de la perspectiva. */
export function Avatar({ slug, tam = 48, className = "", color }) {
  const a = AUTORES[slug];
  if (!a) return null;
  if (a.foto === false) {
    const ini = a.n.split(" ").filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w)).map((w) => w[0]).slice(0, 2).join("");
    return (
      <span className={`psn-mono ${className}`} title={`${a.n} · sin retrato libre disponible`} style={{ width: tam, height: tam, fontSize: tam * 0.36, background: color || "var(--c-gold)" }}>
        {ini}
      </span>
    );
  }
  return <img className={className} src={fotoAutor(slug)} alt={`Retrato de ${a.n}`} title={textoCredito(slug)} width={tam} height={tam} loading="lazy" style={{ width: tam, height: tam }} />;
}

export function GaleriaAutores({ slugs, color, titulo = "Voces de este módulo" }) {
  const lista = slugs.filter((s) => AUTORES[s]);
  if (!lista.length) return null;
  return (
    <aside className="psn-galeria" aria-label={titulo} style={{ "--pc": color || "var(--c-gold)" }}>
      <span className="psn-galeria-titulo">{titulo}</span>
      <ul>
        {lista.map((s) => (
          <li key={s} title={textoCredito(s)}>
            <Avatar slug={s} tam={56} color={color} />
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
            <Avatar slug={s} tam={52} color={color} />
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
        <Avatar key={s} slug={s} tam={58} color={color} />
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
      <p>Imágenes obtenidas de Wikimedia Commons; cada obra conserva su licencia y autoría.</p>
    </details>
  );
}


/* Logo: la Ψ de la psicología cuyo astil central es un telescopio que apunta a una estrella. */
export function LogoPsiconautas({ size = 28, className = "" }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Logo de Psiconautas: una Ψ cuyo astil central es un telescopio apuntando a una estrella" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`oro-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFD76A" />
          <stop offset=".5" stopColor="#FFF0B8" />
          <stop offset="1" stopColor="#E8A100" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29.5" stroke="#F3E9D2" strokeOpacity=".3" strokeWidth="1" />
      <path d="M32 2.5v3M32 58.5v3M2.5 32h3M58.5 32h3" stroke="#F3E9D2" strokeOpacity=".5" strokeWidth="1" />
      <path d="M17.5 18v10.5a14.5 14.5 0 0 0 29 0V18" stroke="#F3E9D2" strokeWidth="3.2" />
      <path d="M24 53.5h16M32 43v10.5" stroke="#F3E9D2" strokeWidth="3.2" />
      <g transform="rotate(14 32 43)">
        <path d="M30.2 43 L29.4 26 h5.2 L33.8 43z" fill={`url(#oro-${id})`} stroke="#F3E9D2" strokeWidth="1.4" />
        <path d="M29.2 26 L28.3 14.5 h7.4 L34.8 26z" fill={`url(#oro-${id})`} stroke="#F3E9D2" strokeWidth="1.4" />
        <path d="M27.4 14.5 L26.6 9.5 h10.8 l-.8 5z" fill="#FFF6D6" stroke="#F3E9D2" strokeWidth="1.4" />
        <path d="M29.6 19.5h4.8M29.9 32h4.2" stroke="#7A4E00" strokeWidth="1" strokeOpacity=".55" />
      </g>
      <path d="M51 6c.5 4 2 5.5 6 6-4 .5-5.5 2-6 6-.5-4-2-5.5-6-6 4-.5 5.5-2 6-6z" fill="#FFE08A" stroke="none" />
      <circle cx="46" cy="22" r="1" fill="#FFE08A" stroke="none" />
      <circle cx="57" cy="24" r=".9" fill="#FFE08A" stroke="none" />
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
  // Ψ: constelación con la forma de la psicología
  { pts: [[1295, 150], [1295, 232], [1332, 268], [1369, 232], [1369, 150], [1332, 118], [1332, 268], [1332, 338]], lineas: [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7]] },
  { pts: [[130, 360], [210, 318], [262, 392], [350, 350], [398, 430], [300, 470]], lineas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]] },
  { pts: [[1180, 760], [1262, 720], [1320, 800], [1410, 770], [1456, 850]], lineas: [[0, 1], [1, 2], [2, 3], [3, 4]] },
];

function MedallonObjeto({ id }) {
  const cr = "#F3E9D2";
  const oro = "#FFD76A";
  const icono = {
    libro: (
      <g fill="none" stroke={cr} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M30 50 Q45 42 60 50 Q75 42 90 50 V78 Q75 70 60 78 Q45 70 30 78Z" fill="#2a2f86" fillOpacity=".6" />
        <path d="M60 50 V78" />
        <path d="M36 56 Q45 52 54 56 M36 62 Q45 58 54 62 M66 56 Q75 52 84 56 M66 62 Q75 58 84 62" strokeWidth="1.4" strokeOpacity=".7" />
        <path d="M44 38 l2.5 5 5.5 .8 -4 3.9 .9 5.5 -4.9 -2.6 -4.9 2.6 .9 -5.5 -4 -3.9 5.5 -.8z" fill={oro} stroke="none" transform="translate(16 -10) scale(.9)" />
      </g>
    ),
    probeta: (
      <g fill="none" stroke={cr} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <g transform="rotate(28 60 60)">
          <path d="M52 30 V80 a8 8 0 0 0 16 0 V30" fill="#2a2f86" fillOpacity=".5" />
          <path d="M50 30 H70" />
          <path d="M52 62 H68 V80 a8 8 0 0 1 -16 0Z" fill={oro} stroke="none" fillOpacity=".9" />
          <circle cx="58" cy="70" r="1.6" fill="#fff" stroke="none" />
          <circle cx="63" cy="76" r="1.2" fill="#fff" stroke="none" />
        </g>
        <circle cx="86" cy="40" r="2.4" fill={oro} stroke="none" />
        <circle cx="34" cy="86" r="1.8" fill={oro} stroke="none" />
      </g>
    ),
    matraz: (
      <g fill="none" stroke={cr} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M52 32 H68 V52 L86 84 Q89 90 82 90 H38 Q31 90 34 84 L52 52Z" fill="#2a2f86" fillOpacity=".5" />
        <path d="M44 70 H76 L86 84 Q89 90 82 90 H38 Q31 90 34 84Z" fill="#3de0b5" stroke="none" fillOpacity=".85" />
        <path d="M50 32 H70" />
        <circle cx="54" cy="80" r="2" fill="#fff" stroke="none" fillOpacity=".8" />
        <circle cx="66" cy="76" r="1.5" fill="#fff" stroke="none" fillOpacity=".8" />
      </g>
    ),
    cerebro: (
      <g fill="none" stroke={cr} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M60 36 C48 32 38 40 40 50 C32 54 32 66 40 70 C40 80 52 86 60 80 C68 86 80 80 80 70 C88 66 88 54 80 50 C82 40 72 32 60 36Z" fill="#7a2f6a" fillOpacity=".55" />
        <path d="M60 36 V80 M46 52 Q52 50 54 58 M74 52 Q68 50 66 58 M48 68 Q54 66 56 72 M72 68 Q66 66 64 72" strokeWidth="1.6" />
      </g>
    ),
    microscopio: (
      <g fill="none" stroke={cr} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <g transform="rotate(-18 60 60)">
          <rect x="54" y="30" width="12" height="30" rx="3" fill="#2a2f86" fillOpacity=".6" />
          <path d="M58 60 V68 M62 60 V68" />
          <path d="M48 70 H72" />
        </g>
        <path d="M42 88 H80 M70 56 a16 16 0 0 1 0 28" />
        <circle cx="52" cy="34" r="2.2" fill={oro} stroke="none" />
      </g>
    ),
    atomo: (
      <g fill="none" stroke={cr} strokeWidth="1.8">
        {[0, 60, 120].map((r) => <ellipse key={r} cx="60" cy="60" rx="30" ry="11" transform={`rotate(${r} 60 60)`} />)}
        <circle cx="60" cy="60" r="4.5" fill={oro} stroke="none" />
      </g>
    ),
  }[id];
  const col = { libro: ["#6c4fe0", "#241a78"], probeta: ["#1fb5a6", "#0b3b6e"], matraz: ["#2d6bff", "#101b6a"], cerebro: ["#d6477a", "#4a1760"], microscopio: ["#e8941a", "#5a2a6a"], atomo: ["#8b5cf6", "#17205e"] }[id];
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
      <ellipse cx="44" cy="34" rx="22" ry="12" fill="#fff" fillOpacity=".1" transform="rotate(-24 44 34)" />
      {icono}
    </svg>
  );
}

const MEDALLONES = [
  { id: "libro", lado: "i", y: 12, d: 0 },
  { id: "cerebro", lado: "i", y: 42, d: -5 },
  { id: "microscopio", lado: "i", y: 72, d: -9 },
  { id: "probeta", lado: "d", y: 20, d: -3 },
  { id: "matraz", lado: "d", y: 50, d: -7 },
  { id: "atomo", lado: "d", y: 78, d: -11 },
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
        <span key={m.id} className={`psn-medallon ${m.lado}`} style={{ top: `${m.y}%`, animationDelay: `${m.d}s` }}>
          <MedallonObjeto id={m.id} />
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
            <Avatar slug={(AUTORES_POR_PERSPECTIVA[p.id] || ["freud"]).find((s) => AUTORES[s] && AUTORES[s].foto !== false) || "freud"} tam={34} />
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
