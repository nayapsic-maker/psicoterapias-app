import React from "react";

/* ============================================================
   PSICONAUTAS — piezas visuales
   · HeroMision: cartel de misión (título + ventana de cabina con la
     ilustración principal, estrellas que titilan y un sello giratorio).
   · PlanetaPerspectiva: cada perspectiva es un planeta ilustrado
     (imágenes en /public/img, generadas con Canva y exportadas).
   · CintaEscuelas: cinta continua con los nombres de las escuelas.
   Todo el movimiento es CSS y respeta prefers-reduced-motion.
   ============================================================ */

const BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) || "/";
export const imgPlaneta = (id) => `${BASE}img/${id}.jpg`;

const ESTRELLAS = [
  { x: 6, y: 14, s: 16, d: 0 },
  { x: 92, y: 10, s: 22, d: 0.8 },
  { x: 84, y: 82, s: 14, d: 1.6 },
  { x: 12, y: 84, s: 12, d: 2.2 },
  { x: 50, y: 6, s: 10, d: 1.1 },
  { x: 97, y: 48, s: 12, d: 0.4 },
];

function Estrella({ s }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true">
      <path d="M12 0 C12.6 7.5 16.5 11.4 24 12 C16.5 12.6 12.6 16.5 12 24 C11.4 16.5 7.5 12.6 0 12 C7.5 11.4 11.4 7.5 12 0Z" fill="currentColor" />
    </svg>
  );
}

/* Sello circular con texto en órbita (SVG textPath). */
function Sello({ texto, className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="psn-circ" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="#E9A100" stroke="#15183C" strokeWidth="3" />
      <text style={{ font: "800 11.5px var(--f-mono)", letterSpacing: "0.16em" }} fill="#15183C">
        <textPath href="#psn-circ">{texto}</textPath>
      </text>
      <path d="M60 36 L66 54 L84 60 L66 66 L60 84 L54 66 L36 60 L54 54Z" fill="#15183C" />
    </svg>
  );
}

export function HeroMision({ perspectivas, totalEscuelas, totalTerminos, onIrAFundamentos, onIrAComparar, onModoEstudio }) {
  return (
    <section className="psn-hero" aria-label="Presentación">
      <div className="psn-hero-top">
        <div>
          <div className="psn-eyebrow">Misión Nº 7 · tripulación: {perspectivas.length} perspectivas</div>
          <h1 className="psn-titulo">
            Psico<span>nautas</span>
          </h1>
          <p className="psn-sub">El cosmos psicoterapéutico</p>
        </div>
        <div className="psn-bajada">
          <p>
            Una expedición por {totalEscuelas} escuelas de psicoterapia y {totalTerminos.toLocaleString("es")} términos. Cada perspectiva es un planeta con su propia gravedad: su forma de entender el sufrimiento, el cambio y lo que cuenta como verdad clínica.
          </p>
          <div className="psn-botones">
            <button className="psn-btn psn-btn-primario" onClick={onIrAFundamentos}>
              Despegar: explorar las perspectivas →
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
        <img src={`${BASE}img/hero.jpg`} alt="Un psiconauta flota en el espacio con una linterna frente a una nebulosa con forma de cerebro, rodeada de planetas" width="1920" height="1080" />
        {ESTRELLAS.map((e, i) => (
          <span key={i} className="psn-estrella" style={{ left: `${e.x}%`, top: `${e.y}%`, animationDelay: `${e.d}s`, color: i % 2 ? "#E9A100" : "#fff" }}>
            <Estrella s={e.s} />
          </span>
        ))}
        <Sello className="psn-sello" texto={`${totalEscuelas} ESCUELAS · ${perspectivas.length} PLANETAS · `} />
        <figcaption>Ilustración generada con Canva · estilo cartel espacial de los años 60</figcaption>
      </figure>

      <ul className="psn-leyenda" aria-label="Perspectivas">
        {perspectivas.map((p) => (
          <li key={p.id} style={{ "--pc": p.color }}>
            <img src={imgPlaneta(p.id)} alt="" width="34" height="34" loading="lazy" />
            <span>{p.corto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Planeta ilustrado de una perspectiva (esquina de la tarjeta). */
export function PlanetaPerspectiva({ id, color }) {
  return (
    <span className="psn-planeta" style={{ "--pc": color }} aria-hidden="true">
      <img src={imgPlaneta(id)} alt="" width="84" height="84" loading="lazy" />
    </span>
  );
}

/* Cinta continua con los nombres de las escuelas. */
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
