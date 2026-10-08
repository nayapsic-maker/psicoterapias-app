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

/* Sesión de terapia: dos personas conversando; los globos flotan sobre sus cabezas. */
export function EscenaSesion({ className = "" }) {
  return (
    <svg className={`psn-escena ${className}`} viewBox="0 0 480 320" role="img" aria-label="Ilustración animada: una terapeuta y un consultante conversan sentados frente a frente">
      <defs>
        <filter id="psn-som"><feDropShadow dx="0" dy="2" stdDeviation="0" floodColor="#15183C" floodOpacity="0.25" /></filter>
      </defs>
      <rect width="480" height="320" fill="#F3E9D2" />
      <g transform="translate(0 40)">
        <circle cx="240" cy="118" r="70" fill="#E9A100" opacity="0.9" />
        <path d="M0 214 H480 V280 H0Z" fill="#D9402A" />
        <rect y="206" width="480" height="8" fill="#15183C" />
        <g className="psn-planta">
          <path d="M40 206 q-10 -50 6 -86 q8 34 -6 86 M44 206 q18 -30 34 -52 q-4 36 -34 52 M40 206 q-26 -24 -34 -50 q30 10 34 50" fill="#1F8A68" stroke="#15183C" strokeWidth="2" />
          <rect x="26" y="200" width="32" height="26" rx="4" fill="#B4253F" stroke="#15183C" strokeWidth="2" />
        </g>
        <g>
          <circle cx="440" cy="40" r="18" fill="#FBF5E4" stroke="#15183C" strokeWidth="3" />
          <path className="psn-aguja" d="M440 40 V28" stroke="#15183C" strokeWidth="3" strokeLinecap="round" />
          <path d="M440 40 L449 44" stroke="#D9402A" strokeWidth="3" strokeLinecap="round" />
        </g>
        <Persona x={150} y={206} piel="#C98B5B" ropa="#2F4BB5" pelo="#15183C" retardo={0} />
        <Persona x={336} y={206} piel="#F0C39B" ropa="#1F8A68" pelo="#8B3A1E" flip retardo={1.2} />
      </g>
      <Burbuja x={96} y={14} color="#2F4BB5" />
      <g className="psn-burbuja psn-burbuja-b" transform="translate(300 14)">
        <path d="M0 0 h64 a10 10 0 0 1 10 10 v22 a10 10 0 0 1 -10 10 h-18 l12 12 l-26 -12 h-30 a10 10 0 0 1 -10 -10 v-22 a10 10 0 0 1 10 -10z" fill="#FBF5E4" stroke="#15183C" strokeWidth="2.5" />
        <path d="M18 22 q8 -12 16 0 q8 12 16 0" stroke="#1F8A68" strokeWidth="3.5" fill="none" strokeLinecap="round" className="psn-onda" />
      </g>
    </svg>
  );
}

function Fondo({ children, label, color = "#F3E9D2", alto = 300 }) {
  return (
    <svg className="psn-escena" viewBox={`0 0 480 ${alto}`} role="img" aria-label={label}>
      <defs>
        <filter id="psn-som"><feDropShadow dx="0" dy="2" stdDeviation="0" floodColor="#15183C" floodOpacity="0.25" /></filter>
      </defs>
      <rect width="480" height={alto} fill={color} />
      {children}
    </svg>
  );
}

/* Búsqueda: estantería, una persona y una lupa que barre los lomos. */
export function EscenaLectura() {
  const libros = ["#D9402A", "#2F4BB5", "#E9A100", "#1F8A68", "#B4253F", "#514D74", "#D9402A", "#2F4BB5", "#E9A100", "#1F8A68"];
  return (
    <Fondo label="Ilustración animada: una persona busca con una lupa entre los libros de una biblioteca">
      <rect x="0" y="236" width="480" height="64" fill="#D9402A" />
      <rect y="228" width="480" height="8" fill="#15183C" />
      {[60, 130].map((y, r) => (
        <g key={y}>
          <rect x="190" y={y + 44} width="270" height="6" fill="#15183C" />
          {libros.map((c, i) => (
            <rect key={i} className={r === 0 && i === 4 ? "psn-libro-sale" : ""} x={196 + i * 26} y={y + (i % 3) * 5} width="20" height={44 - (i % 3) * 5} rx="2" fill={c} stroke="#15183C" strokeWidth="2" />
          ))}
        </g>
      ))}
      <Persona x={110} y={228} piel="#F0C39B" ropa="#D9402A" pelo="#15183C" sentada={false} gesto={false} escala={1.05} />
      <g className="psn-lupa">
        <circle cx="262" cy="140" r="26" fill="#FBF5E4" fillOpacity="0.55" stroke="#15183C" strokeWidth="5" />
        <path d="M281 160 L304 186" stroke="#15183C" strokeWidth="9" strokeLinecap="round" />
      </g>
      <path d="M126 168 Q170 150 236 144" stroke="#D9402A" strokeWidth="11" strokeLinecap="round" fill="none" className="psn-brazo-lupa" />
    </Fondo>
  );
}

/* Comparación: una balanza oscila entre dos personas. */
export function EscenaBalanza() {
  return (
    <Fondo label="Ilustración animada: dos personas observan una balanza que oscila entre dos ideas">
      <rect y="248" width="480" height="52" fill="#D9402A" />
      <rect y="240" width="480" height="8" fill="#15183C" />
      <circle cx="240" cy="120" r="82" fill="#E9A100" opacity="0.85" />
      <path d="M240 90 V240 M200 240 H280" stroke="#15183C" strokeWidth="8" strokeLinecap="round" />
      <g className="psn-viga" style={{ transformOrigin: "240px 90px" }}>
        <path d="M120 90 H360" stroke="#15183C" strokeWidth="8" strokeLinecap="round" />
        <g className="psn-plato psn-plato-a" style={{ transformOrigin: "120px 90px" }}>
          <path d="M120 90 L92 150 M120 90 L148 150" stroke="#15183C" strokeWidth="3" />
          <path d="M84 150 H156 q-6 22 -36 22 q-30 0 -36 -22z" fill="#2F4BB5" stroke="#15183C" strokeWidth="3" />
          <circle cx="120" cy="136" r="12" fill="#FBF5E4" stroke="#15183C" strokeWidth="3" />
        </g>
        <g className="psn-plato psn-plato-b" style={{ transformOrigin: "360px 90px" }}>
          <path d="M360 90 L332 150 M360 90 L388 150" stroke="#15183C" strokeWidth="3" />
          <path d="M324 150 H396 q-6 22 -36 22 q-30 0 -36 -22z" fill="#1F8A68" stroke="#15183C" strokeWidth="3" />
          <path d="M360 124 l12 22 h-24z" fill="#FBF5E4" stroke="#15183C" strokeWidth="3" strokeLinejoin="round" />
        </g>
      </g>
      <Persona x={48} y={240} piel="#8D5A3B" ropa="#B4253F" pelo="#15183C" sentada={false} gesto={false} escala={0.95} />
      <Persona x={432} y={240} piel="#F0C39B" ropa="#514D74" pelo="#E9A100" sentada={false} gesto={false} flip retardo={1} escala={0.95} />
    </Fondo>
  );
}

/* Diccionario: dos personas construyen un puente tablón a tablón. */
export function EscenaPuente() {
  return (
    <Fondo label="Ilustración animada: dos personas construyen un puente entre dos acantilados">
      <circle cx="240" cy="96" r="58" fill="#E9A100" opacity="0.9" />
      <path d="M0 150 H150 V300 H0Z" fill="#1F8A68" stroke="#15183C" strokeWidth="4" />
      <path d="M330 150 H480 V300 H330Z" fill="#2F4BB5" stroke="#15183C" strokeWidth="4" />
      <rect y="268" width="480" height="32" fill="#D9402A" opacity="0.9" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} className="psn-tablon" style={{ animationDelay: `${i * 0.45}s`, transformOrigin: `${153 + i * 29}px 150px` }} x={152 + i * 29} y="146" width="26" height="10" rx="2" fill="#FBF5E4" stroke="#15183C" strokeWidth="2.5" />
      ))}
      <Persona x={78} y={150} piel="#C98B5B" ropa="#D9402A" pelo="#15183C" sentada={false} escala={0.95} />
      <Persona x={404} y={150} piel="#F0C39B" ropa="#E9A100" pelo="#8B3A1E" sentada={false} flip retardo={1} escala={0.95} />
    </Fondo>
  );
}

/* Psicoanálisis: diván, paciente que asocia y analista que escribe. */
export function EscenaDivan() {
  return (
    <Fondo label="Ilustración animada: una persona recostada en un diván asocia libremente mientras su analista escribe">
      <rect y="236" width="480" height="64" fill="#514D74" />
      <rect y="228" width="480" height="8" fill="#15183C" />
      <rect x="30" y="140" width="40" height="88" fill="#FBF5E4" stroke="#15183C" strokeWidth="3" />
      <path d="M44 156 h12 M44 172 h12" stroke="#15183C" strokeWidth="3" />
      <g className="psn-resp" style={{ transformOrigin: "180px 200px" }}>
        <rect x="70" y="190" width="240" height="40" rx="18" fill="#D9402A" stroke="#15183C" strokeWidth="3" />
        <rect x="88" y="168" width="150" height="26" rx="13" fill="#2F4BB5" stroke="#15183C" strokeWidth="3" />
        <rect x="226" y="172" width="66" height="18" rx="9" fill="#2F4BB5" stroke="#15183C" strokeWidth="3" />
        <circle cx="74" cy="176" r="19" fill="#C98B5B" stroke="#15183C" strokeWidth="3" />
        <path d="M56 170 q4 -16 22 -14 q8 4 4 14 q-14 -6 -26 0z" fill="#15183C" />
      </g>
      {[0, 1, 2].map((i) => (
        <circle key={i} className="psn-sube" style={{ animationDelay: `${i * 0.9}s` }} cx={96 + i * 22} cy="130" r={5 + i * 2} fill="#FBF5E4" stroke="#15183C" strokeWidth="2" />
      ))}
      <Persona x={396} y={228} piel="#F0C39B" ropa="#1F8A68" pelo="#514D74" flip gesto escala={1} />
      <g className="psn-pluma"><rect x="338" y="168" width="26" height="18" rx="2" fill="#FBF5E4" stroke="#15183C" strokeWidth="2.5" /></g>
    </Fondo>
  );
}

/* Humanista: presencia y respiración con aura que late. */
export function EscenaMeditacion() {
  return (
    <Fondo label="Ilustración animada: una persona respira con calma sentada en el suelo mientras un aura late a su alrededor">
      <rect y="250" width="480" height="50" fill="#1F8A68" />
      <rect y="242" width="480" height="8" fill="#15183C" />
      {[130, 100, 70].map((r, i) => (
        <circle key={r} className="psn-aura" style={{ animationDelay: `${i * 0.6}s` }} cx="240" cy="170" r={r} fill={["#E9A100", "#D9402A", "#2F4BB5"][i]} opacity="0.22" />
      ))}
      <g className="psn-resp" style={{ transformOrigin: "240px 242px" }}>
        <ellipse cx="240" cy="236" rx="70" ry="16" fill="#2F4BB5" stroke="#15183C" strokeWidth="3" />
        <path d="M206 232 L206 170 Q206 140 240 140 Q274 140 274 170 L274 232 Z" fill="#D9402A" stroke="#15183C" strokeWidth="3" />
        <path d="M214 196 Q240 214 266 196" stroke="#15183C" strokeWidth="3" fill="none" />
        <circle cx="240" cy="110" r="24" fill="#C98B5B" stroke="#15183C" strokeWidth="3" />
        <path d="M216 108 Q218 84 242 86 Q264 86 264 108 Q252 98 238 100 Q224 100 216 108Z" fill="#15183C" />
        <path d="M230 112 q4 3 8 0 M244 112 q4 3 8 0" stroke="#15183C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
      {[[80, 80], [400, 90], [110, 190], [380, 180]].map(([x, y], i) => (
        <path key={i} className="psn-deriva" style={{ animationDelay: `${i * 0.8}s` }} d={`M${x} ${y} q10 -16 22 0 q-8 12 -22 0z`} fill={["#1F8A68", "#E9A100", "#B4253F", "#2F4BB5"][i]} stroke="#15183C" strokeWidth="2" />
      ))}
    </Fondo>
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
