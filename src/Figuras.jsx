import React from "react";
import { AUTORES } from "./autores.js";

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

/* ---------- Personas animadas ---------- */
function Persona({ x, y, piel, ropa, pelo, flip, retardo = 0, gesto = true, sentada = true, escala = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -escala : escala} ${escala})`}>
      {sentada && (
        <>
          <rect x="-24" y="-8" width="72" height="18" rx="9" fill={ropa} filter="url(#psn-som)" opacity="0.92" />
          <rect x="38" y="2" width="16" height="52" rx="8" fill={ropa} opacity="0.85" />
          <rect x="34" y="50" width="30" height="10" rx="5" fill="#15183C" />
        </>
      )}
      <g className="psn-resp" style={{ animationDelay: `${retardo}s` }}>
        <path d="M-26 0 L-26 -50 Q-26 -80 0 -80 Q26 -80 26 -50 L26 0 Z" fill={ropa} />
        {gesto && (
          <g className="psn-brazo" style={{ animationDelay: `${retardo + 0.4}s` }}>
            <path d="M8 -66 Q34 -50 42 -32" stroke={ropa} strokeWidth="12" strokeLinecap="round" fill="none" />
            <circle cx="43" cy="-30" r="6.5" fill={piel} />
          </g>
        )}
        <g className="psn-cabeza" style={{ animationDelay: `${retardo + 0.2}s` }}>
          <rect x="-6" y="-90" width="12" height="14" fill={piel} />
          <circle cx="0" cy="-106" r="21" fill={piel} />
          <path d="M-22 -108 Q-20 -132 2 -130 Q24 -130 22 -108 Q12 -120 -4 -118 Q-16 -116 -22 -108Z" fill={pelo} />
          <circle cx="8" cy="-106" r="2.3" fill="#15183C" className="psn-ojo" />
        </g>
      </g>
    </g>
  );
}

function Burbuja({ x, y, texto, color }) {
  return (
    <g className="psn-burbuja" transform={`translate(${x} ${y})`}>
      <path d="M0 0 h64 a10 10 0 0 1 10 10 v22 a10 10 0 0 1 -10 10 h-34 l-12 12 v-12 h-18 a10 10 0 0 1 -10 -10 v-22 a10 10 0 0 1 10 -10z" fill="#FBF5E4" stroke="#15183C" strokeWidth="2.5" />
      {texto ? (
        <text x="37" y="27" textAnchor="middle" style={{ font: "800 15px var(--f-display)" }} fill={color}>{texto}</text>
      ) : (
        [0, 1, 2].map((i) => <circle key={i} className="psn-punto" style={{ animationDelay: `${i * 0.25}s` }} cx={22 + i * 15} cy="21" r="4.2" fill={color} />)
      )}
    </g>
  );
}

/* Sesión de terapia: dos personas conversando, plantas, ventana y reloj. */
export function EscenaSesion({ className = "" }) {
  return (
    <svg className={`psn-escena ${className}`} viewBox="0 0 480 280" role="img" aria-label="Ilustración animada: una terapeuta y un consultante conversan sentados frente a frente">
      <defs>
        <filter id="psn-som"><feDropShadow dx="0" dy="2" stdDeviation="0" floodColor="#15183C" floodOpacity="0.25" /></filter>
      </defs>
      <rect width="480" height="280" fill="#F3E9D2" />
      <circle cx="380" cy="86" r="60" fill="#E9A100" opacity="0.9" />
      <rect x="318" y="26" width="120" height="120" rx="60" fill="none" stroke="#15183C" strokeWidth="3" />
      <path d="M0 214 H480 V280 H0Z" fill="#D9402A" />
      <rect y="206" width="480" height="8" fill="#15183C" />
      <g className="psn-planta">
        <path d="M40 206 q-10 -50 6 -86 q8 34 -6 86 M44 206 q18 -30 34 -52 q-4 36 -34 52 M40 206 q-26 -24 -34 -50 q30 10 34 50" fill="#1F8A68" stroke="#15183C" strokeWidth="2" />
        <rect x="26" y="200" width="32" height="26" rx="4" fill="#B4253F" stroke="#15183C" strokeWidth="2" />
      </g>
      <g className="psn-reloj">
        <circle cx="236" cy="52" r="18" fill="#FBF5E4" stroke="#15183C" strokeWidth="3" />
        <path className="psn-aguja" d="M236 52 V40" stroke="#15183C" strokeWidth="3" strokeLinecap="round" />
        <path d="M236 52 L245 56" stroke="#D9402A" strokeWidth="3" strokeLinecap="round" />
      </g>
      <Persona x={150} y={206} piel="#C98B5B" ropa="#2F4BB5" pelo="#15183C" retardo={0} />
      <Persona x={336} y={206} piel="#F0C39B" ropa="#1F8A68" pelo="#8B3A1E" flip retardo={1.2} />
      <Burbuja x={92} y={52} color="#2F4BB5" />
      <g style={{ animationDelay: "2s" }} className="psn-burbuja psn-burbuja-b">
        <path d="M0 0 h64 a10 10 0 0 1 10 10 v22 a10 10 0 0 1 -10 10 h-18 v12 l-12 -12 h-34 a10 10 0 0 1 -10 -10 v-22 a10 10 0 0 1 10 -10z" transform="translate(300 88)" fill="#FBF5E4" stroke="#15183C" strokeWidth="2.5" />
        <path d="M322 109 q8 -12 16 0 q8 12 16 0" transform="translate(0 0)" stroke="#1F8A68" strokeWidth="3.5" fill="none" strokeLinecap="round" className="psn-onda" />
      </g>
    </svg>
  );
}

/* Grupo en círculo: cinco personas, cada una con su propio ritmo. */
export function EscenaGrupo({ className = "" }) {
  const gente = [
    { x: 60, piel: "#C98B5B", ropa: "#2F4BB5", pelo: "#15183C" },
    { x: 150, piel: "#F0C39B", ropa: "#D9402A", pelo: "#8B3A1E" },
    { x: 240, piel: "#8D5A3B", ropa: "#E9A100", pelo: "#15183C" },
    { x: 330, piel: "#F0C39B", ropa: "#1F8A68", pelo: "#E9A100" },
    { x: 420, piel: "#C98B5B", ropa: "#B4253F", pelo: "#514D74" },
  ];
  return (
    <svg className={`psn-escena ${className}`} viewBox="0 0 480 220" role="img" aria-label="Ilustración animada: cinco personas conversando en círculo">
      <defs>
        <filter id="psn-som"><feDropShadow dx="0" dy="2" stdDeviation="0" floodColor="#15183C" floodOpacity="0.25" /></filter>
      </defs>
      <rect width="480" height="220" fill="#F3E9D2" />
      <ellipse cx="240" cy="188" rx="230" ry="16" fill="#15183C" opacity="0.18" />
      {gente.map((g, i) => (
        <Persona key={i} x={g.x} y={186} piel={g.piel} ropa={g.ropa} pelo={g.pelo} sentada={false} gesto={i % 2 === 0} retardo={i * 0.7} escala={0.95} />
      ))}
    </svg>
  );
}

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
          <p>
            Un recorrido por {totalEscuelas} escuelas de psicoterapia y {totalTerminos.toLocaleString("es")} términos. Cada perspectiva responde a su manera qué es el sufrimiento, qué produce el cambio y qué cuenta como verdad clínica.
          </p>
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
        <EscenaSesion />
        <figcaption>La relación terapéutica, en movimiento · ilustración propia</figcaption>
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
