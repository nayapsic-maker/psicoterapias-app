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
