import React, { useRef } from "react";

/* ============================================================
   FIGURAS — ilustraciones vectoriales animadas (sin imágenes
   externas). Cada perspectiva tiene un glifo propio que condensa
   su idea central:
   humanista → espiral de crecimiento · psicodinámica → témpano
   (superficie / profundidad) · sistémica → red · conductual → bucle
   de contingencia · cognitivo-conductual → engranaje · integradora →
   círculos que se solapan · transpersonal → mandala.
   Se anima con CSS (index.css, clases .atlas-*) y respeta
   prefers-reduced-motion.
   ============================================================ */

function espiral(vueltas = 3.2, pasos = 90, r0 = 3, r1 = 40) {
  const pts = [];
  for (let i = 0; i <= pasos; i++) {
    const t = i / pasos;
    const a = t * vueltas * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return "M" + pts.join(" L");
}

const ESPIRAL = espiral();
const DIENTES = Array.from({ length: 10 }, (_, i) => i * 36);
const RAYOS = Array.from({ length: 16 }, (_, i) => i * 22.5);
const PENTAGONO = Array.from({ length: 5 }, (_, i) => {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return [50 + 34 * Math.cos(a), 50 + 34 * Math.sin(a)];
});

/* Cada glifo se dibuja en una caja 100×100 centrada en (50,50). */
function Glifo({ id, color }) {
  const trazo = { fill: "none", stroke: color, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (id) {
    case "humanista":
      return (
        <g>
          <g className="atlas-orbita" style={{ animationDuration: "46s" }}>
            <path d={ESPIRAL} {...trazo} opacity="0.9" />
          </g>
          <circle cx="50" cy="50" r="3.2" fill={color} className="atlas-pulso" />
          <circle cx="86" cy="50" r="3.4" fill={color} opacity="0.85" />
        </g>
      );
    case "psicodinamica":
      return (
        <g>
          <path d="M50 14 L66 44 L34 44 Z" {...trazo} fill={`${color}33`} />
          <path className="atlas-trazo" d="M10 44 Q22 38 34 44 T58 44 T90 44" {...trazo} strokeWidth="2" />
          <path d="M34 44 L18 72 L50 92 L82 72 L66 44" {...trazo} opacity="0.55" />
          <path className="atlas-trazo" d="M28 62 Q39 57 50 62 T72 62" {...trazo} strokeWidth="1.6" opacity="0.5" />
          <circle cx="50" cy="76" r="3" fill={color} className="atlas-pulso" />
        </g>
      );
    case "sistemica":
      return (
        <g>
          <g className="atlas-orbita-inv" style={{ animationDuration: "60s" }}>
            {PENTAGONO.map((a, i) =>
              PENTAGONO.slice(i + 1).map((b, j) => (
                <line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} {...trazo} strokeWidth="1.3" className="atlas-trazo" opacity="0.7" />
              ))
            )}
            {PENTAGONO.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r="5" fill={color} className="atlas-pulso" style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </g>
        </g>
      );
    case "conductual":
      return (
        <g>
          <g className="atlas-orbita" style={{ animationDuration: "9s" }}>
            <path d="M50 14 A36 36 0 0 1 86 50" {...trazo} />
            <path d="M80 42 L86 50 L93 42" {...trazo} />
            <path d="M50 86 A36 36 0 0 1 14 50" {...trazo} opacity="0.65" />
            <path d="M20 58 L14 50 L7 58" {...trazo} opacity="0.65" />
          </g>
          <circle cx="50" cy="50" r="7" fill={`${color}44`} stroke={color} strokeWidth="2" className="atlas-pulso" />
        </g>
      );
    case "cognitivo":
      return (
        <g>
          <g className="atlas-orbita" style={{ animationDuration: "18s" }}>
            <circle cx="50" cy="50" r="22" {...trazo} />
            {DIENTES.map((a) => (
              <rect key={a} x="46" y="18" width="8" height="9" rx="1.5" fill={color} transform={`rotate(${a} 50 50)`} />
            ))}
          </g>
          <circle cx="50" cy="50" r="8" {...trazo} className="atlas-respira" />
        </g>
      );
    case "integradora":
      return (
        <g className="atlas-orbita-inv" style={{ animationDuration: "30s" }}>
          <circle cx="50" cy="35" r="20" {...trazo} fill={`${color}22`} />
          <circle cx="37" cy="58" r="20" {...trazo} fill={`${color}22`} />
          <circle cx="63" cy="58" r="20" {...trazo} fill={`${color}22`} />
          <circle cx="50" cy="50" r="3" fill={color} />
        </g>
      );
    case "transpersonal":
      return (
        <g>
          <g className="atlas-orbita" style={{ animationDuration: "70s" }}>
            {RAYOS.map((a, i) => (
              <line key={a} x1="50" y1={i % 2 ? 12 : 6} x2="50" y2="24" {...trazo} strokeWidth="1.8" transform={`rotate(${a} 50 50)`} />
            ))}
          </g>
          <circle cx="50" cy="50" r="22" {...trazo} className="atlas-respira" />
          <circle cx="50" cy="50" r="12" {...trazo} opacity="0.7" />
          <circle cx="50" cy="50" r="3.4" fill={color} className="atlas-pulso" />
        </g>
      );
    default:
      return <circle cx="50" cy="50" r="20" {...trazo} />;
  }
}

/* Glifo suelto para tarjetas (esquina superior derecha). */
export function GlifoPerspectiva({ id, color }) {
  return (
    <svg className="atlas-glifo" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <Glifo id={id} color={color} />
    </svg>
  );
}

/* Constelación: las siete perspectivas alrededor de un núcleo. */
export function HeroAtlas({ perspectivas, totalEscuelas, totalTerminos, onIrAFundamentos, onIrAEscuelas, onActivarModoEstudio }) {
  const caja = useRef(null);
  const R = 205;
  const mover = (e) => {
    const el = caja.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const n = perspectivas.length;
  return (
    <section className="atlas-hero" onMouseMove={mover} aria-label="Presentación">
      <div>
        <div className="atlas-eyebrow">Atlas comparado · {n} perspectivas</div>
        <h1 className="atlas-titulo">
          Psicoterapias,
          <br />
          <em>comparadas.</em>
        </h1>
        <p className="atlas-bajada">
          Un mapa de {totalEscuelas} escuelas y {totalTerminos.toLocaleString("es")} términos para ver, lado a lado, qué cree cada una sobre el sufrimiento, el cambio y la verdad clínica.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={onIrAFundamentos}
            style={{ fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "12px 18px", cursor: "pointer", border: "1px solid var(--c-primary)", background: "var(--c-primary)", color: "#06091a" }}
          >
            Explorar las perspectivas →
          </button>
          <button
            onClick={onIrAEscuelas}
            style={{ fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "12px 18px", cursor: "pointer", border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-ink)" }}
          >
            Comparar escuelas
          </button>
          {onActivarModoEstudio && (
            <button
              onClick={onActivarModoEstudio}
              style={{ fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "12px 4px", cursor: "pointer", border: "none", background: "transparent", color: "var(--c-inkSoft)", textDecoration: "underline", textUnderlineOffset: 4 }}
            >
              Modo estudio
            </button>
          )}
        </div>
      </div>

      <div className="atlas-lienzo" ref={caja} style={{ "--px": 0, "--py": 0 }}>
        <svg viewBox="-70 0 740 600" role="img" aria-label="Constelación de las siete perspectivas de la psicoterapia">
          <defs>
            <radialGradient id="atlas-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--c-primary)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--c-primary)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g style={{ transform: "translate(calc(var(--px) * 10px), calc(var(--py) * 10px))", transition: "transform 0.25s ease-out" }}>
            <circle cx="300" cy="300" r="280" fill="url(#atlas-halo)" />
            <circle cx="300" cy="300" r={R} fill="none" stroke="var(--c-line)" strokeWidth="1" />
            <circle cx="300" cy="300" r={R + 52} fill="none" stroke="var(--c-line)" strokeWidth="1" strokeDasharray="2 8" className="atlas-orbita" style={{ animationDuration: "120s" }} />
            <circle cx="300" cy="300" r={R - 70} fill="none" stroke="var(--c-line)" strokeWidth="1" strokeDasharray="1 6" className="atlas-orbita-inv" style={{ animationDuration: "90s" }} />

            {/* líneas núcleo → perspectiva */}
            {perspectivas.map((p, i) => {
              const a = (-90 + (360 / n) * i) * (Math.PI / 180);
              return <line key={`l-${p.id}`} x1="300" y1="300" x2={300 + R * Math.cos(a)} y2={300 + R * Math.sin(a)} stroke={p.color} strokeWidth="1.2" className="atlas-trazo" opacity="0.55" />;
            })}
            {/* líneas entre perspectivas vecinas */}
            {perspectivas.map((p, i) => {
              const a1 = (-90 + (360 / n) * i) * (Math.PI / 180);
              const a2 = (-90 + (360 / n) * ((i + 1) % n)) * (Math.PI / 180);
              return <line key={`v-${p.id}`} x1={300 + R * Math.cos(a1)} y1={300 + R * Math.sin(a1)} x2={300 + R * Math.cos(a2)} y2={300 + R * Math.sin(a2)} stroke="var(--c-inkSoft)" strokeWidth="0.8" opacity="0.28" />;
            })}

            {/* núcleo */}
            <g className="atlas-respira">
              <circle cx="300" cy="300" r="46" fill="var(--c-cardBg)" stroke="var(--c-primary)" strokeWidth="1.6" />
              <text x="300" y="296" textAnchor="middle" style={{ font: "800 30px var(--f-display)" }} fill="var(--c-ink)">{totalEscuelas}</text>
              <text x="300" y="316" textAnchor="middle" style={{ font: "600 9.5px var(--f-mono)", letterSpacing: "0.16em" }} fill="var(--c-inkSoft)">ESCUELAS</text>
            </g>

            {/* perspectivas */}
            {perspectivas.map((p, i) => {
              const a = (-90 + (360 / n) * i) * (Math.PI / 180);
              const x = 300 + R * Math.cos(a);
              const y = 300 + R * Math.sin(a);
              const lx = 300 + (R + 66) * Math.cos(a);
              const ly = 300 + (R + 66) * Math.sin(a);
              const ancla = Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
              return (
                <g key={p.id}>
                  <g className="atlas-nodo" onClick={onIrAFundamentos} role="link" tabIndex={0} aria-label={p.nombre} onKeyDown={(e) => (e.key === "Enter" ? onIrAFundamentos() : null)}>
                    <circle cx={x} cy={y} r="44" fill="var(--c-cardBg)" stroke={p.color} strokeWidth="1.6" />
                    <g transform={`translate(${x - 38},${y - 38}) scale(0.76)`}>
                      <Glifo id={p.id} color={p.color} />
                    </g>
                    <title>{p.nombre}</title>
                  </g>
                  <text x={lx} y={ly + 3} textAnchor={ancla} style={{ font: "700 10.5px var(--f-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }} fill={p.color}>
                    {p.corto}
                  </text>
                </g>
              );
            })}

            {/* partículas en órbita */}
            <g className="atlas-orbita" style={{ animationDuration: "28s" }}>
              <circle cx="300" cy={300 - (R + 52)} r="3.4" fill="var(--c-gold)" />
              <circle cx={300 + (R + 52) * 0.7} cy={300 + (R + 52) * 0.7} r="2.2" fill="var(--c-primary)" />
            </g>
            <g className="atlas-orbita-inv" style={{ animationDuration: "36s" }}>
              <circle cx="300" cy={300 - (R - 70)} r="2.6" fill="var(--c-ink)" opacity="0.8" />
            </g>
          </g>
        </svg>
      </div>
    </section>
  );
}

/* Cinta continua con los nombres de las escuelas. */
export function CintaEscuelas({ items }) {
  const doble = [...items, ...items];
  return (
    <div className="atlas-cinta" aria-hidden="true">
      <div className="atlas-cinta-pista">
        {doble.map((it, i) => (
          <span key={i} style={{ "--pc": it.color }}>
            {it.nombre}
          </span>
        ))}
      </div>
    </div>
  );
}
