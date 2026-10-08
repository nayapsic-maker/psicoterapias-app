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
  psicodinamica: ["freud", "jung", "adler", "melanieklein", "donaldwinnicott"],
  sistemica: ["satir", "haley", "bertalanffy", "michaelwhite", "maraselvinipalazzoli"],
  conductual: ["skinner", "pavlov", "watson", "thorndike", "linehan"],
  cognitivo: ["beck", "ellis", "bandura", "kabatzinn", "donaldmeichenbaum"],
  integradora: ["lazarus", "prochaska", "stricker", "goldfried", "jeromefrank"],
  transpersonal: ["grof", "assagioli", "jung", "maslow", "james"],
};

function textoCredito(slug) {
  const a = infoAutor(slug);
  if (!a) return "";
  return a.foto === false ? `${a.n} · sin retrato disponible` : `${a.n} · Foto: ${a.f}, ${a.l}, vía Wikimedia Commons`;
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
export function Avatar({ slug, tam = 48, className = "", desplaza = 0, color }) {
  const a = infoAutor(slug);
  if (!a) return null;
  if (a.foto === false) {
    const ini = a.n.split(" ").filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w)).map((w) => w[0]).slice(0, 2).join("");
    return (
      <span className={`psn-mono ${className}`} title={`${a.n} · sin retrato disponible`} style={{ width: tam, height: tam, fontSize: tam * 0.36, background: color || "var(--c-primary)" }}>
        {ini}
      </span>
    );
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
              <strong>{(infoAutor(s) || {}).n || s}</strong>
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


/* Galería con las voces de las siete perspectivas (5 por cada una). */
export function GaleriaTodasLasVoces({ nombreDe, colorDe }) {
  const ids = Object.keys(AUTORES_POR_PERSPECTIVA);
  return (
    <aside className="psn-voces-todas" aria-label="Voces de las siete perspectivas">
      <span className="psn-galeria-titulo">Escuelas en diálogo · cinco voces por perspectiva</span>
      <div>
        {ids.map((id) => {
          const slugs = AUTORES_POR_PERSPECTIVA[id];
          const desp = desplazamientos(slugs);
          return (
            <section key={id} style={{ "--pc": colorDe(id) }}>
              <h5>{nombreDe(id)}</h5>
              <ul>
                {slugs.map((s, i) => (
                  <li key={s} title={textoCredito(s)}>
                    <Avatar slug={s} tam={46} desplaza={desp[i]} />
                    <span>{(infoAutor(s) || {}).n || s}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </aside>
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
      <p>Imágenes obtenidas de Wikimedia Commons; cada obra conserva su licencia y autoría. Algunas imágenes se obtuvieron por búsqueda web y pertenecen a sus titulares; si una persona no tiene retrato disponible se muestra un monograma con sus iniciales.</p>
    </details>
  );
}


/* Logo: la Ψ de la psicología en líneas finas y blancas. */
export function LogoPsiconautas({ size = 28, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Logo de Psiconautas: la letra Ψ de la psicología" style={{ flexShrink: 0 }}>
      <path d="M15 11v17a17 17 0 0 0 34 0V11" />
      <path d="M32 6v50" />
      <path d="M24 57h16" />
      <path d="M15 11l-2.4-4.4M15 11l2.4-4.4M49 11l-2.4-4.4M49 11l2.4-4.4M32 6l-2.6 4.6M32 6l2.6 4.6" strokeWidth="1.6" />
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

/* Constelaciones-símbolo para los márgenes: Ψ, cerebro, libro abierto y mariposa de Psique. */
const FORMAS = {
  psi: { vb: [100, 160], pts: [[20, 30], [20, 88], [50, 116], [80, 88], [80, 30], [50, 6], [50, 150]], lin: [[0, 1], [1, 2], [2, 3], [3, 4], [5, 2], [2, 6]] },
  cerebro: {
    vb: [100, 100],
    pts: [[10, 54], [14, 38], [26, 26], [42, 18], [58, 18], [74, 26], [86, 40], [88, 56], [78, 68], [64, 72], [58, 84], [46, 86], [38, 76], [24, 70], [14, 64], [50, 28], [48, 50], [42, 64], [26, 52], [68, 48]],
    lin: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 0], [3, 15], [15, 16], [16, 17], [18, 16], [16, 19]],
  },
  libro: {
    vb: [100, 100],
    pts: [[8, 26], [50, 34], [92, 26], [8, 74], [50, 82], [92, 74], [20, 42], [40, 46], [20, 54], [40, 58], [60, 46], [80, 42], [60, 58], [80, 54]],
    lin: [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [5, 2], [1, 4], [6, 7], [8, 9], [10, 11], [12, 13]],
  },
  mariposa: {
    vb: [100, 100],
    pts: [[50, 30], [50, 82], [38, 14], [62, 14], [24, 16], [8, 32], [14, 56], [50, 56], [76, 16], [92, 32], [86, 56], [24, 66], [30, 86], [42, 80], [76, 66], [70, 86], [58, 80], [50, 66]],
    lin: [[0, 1], [0, 2], [0, 3], [7, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 7], [7, 11], [11, 12], [12, 13], [13, 17], [7, 14], [14, 15], [15, 16], [16, 17], [7, 4]],
  },
};
function Constelacion({ id }) {
  const F = FORMAS[id];
  const [w, h] = F.vb;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} overflow="visible">
      <g stroke="#F3E9D2" strokeOpacity=".55" strokeWidth="1" strokeDasharray="2 3.5" strokeLinecap="round">
        {F.lin.map(([a, b], i) => <line key={i} x1={F.pts[a][0]} y1={F.pts[a][1]} x2={F.pts[b][0]} y2={F.pts[b][1]} />)}
      </g>
      {F.pts.map(([x, y], i) => (
        <g key={i} className="psn-tit" style={{ animationDelay: `${(i % 7) * 0.7}s`, animationDuration: "4.8s" }}>
          <circle cx={x} cy={y} r="4.4" fill="#FFF3C9" fillOpacity=".16" />
          <circle cx={x} cy={y} r={i % 5 === 0 ? 2.1 : 1.4} fill="#FFF8DE" />
        </g>
      ))}
    </svg>
  );
}

const MEDALLONES = [
  { id: "mariposa", lado: "i", y: 13, d: 0 },
  { id: "libro", lado: "i", y: 56, d: -6 },
  { id: "psi", lado: "d", y: 10, d: -3 },
  { id: "cerebro", lado: "d", y: 52, d: -8 },
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
        <span key={m.id} className={`psn-medallon constelacion ${m.lado} ${m.id}`} style={{ top: `${m.y}%`, animationDelay: `${m.d}s` }}>
          <Constelacion id={m.id} />
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
