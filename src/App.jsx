import React, { useState, useEffect, useMemo, useCallback, useRef, lazy } from "react";
import { LineaTiempoGlobal, MapaRed, QuizEscuela, RetoRetratos, AvataresSub } from "./Funciones.jsx";
/* Módulos pesados de uso ocasional: se descargan al abrirse por primera vez (Suspense está en main.jsx). */
const carga = (importar, nombre) => lazy(() => importar().then((m) => ({ default: m[nombre] })));
const LecturaCasos = carga(() => import("./MiCaso.jsx"), "LecturaCasos");
const AdivinaEscuela = carga(() => import("./Practica.jsx"), "AdivinaEscuela");
const QuienLoDiria = carga(() => import("./Practica.jsx"), "QuienLoDiria");
const TraduceACiegas = carga(() => import("./Practica.jsx"), "TraduceACiegas");
import PorMotivo from "./PorMotivo.jsx";
import FichaTermino, { CoberturaDiccionario } from "./FichaTermino.jsx";
import Fuente, { RefsIncompletas } from "./Fuente.jsx";
import Paralelos from "./Paralelos.jsx";
import { ESCUELAS_SEED } from "./datos/escuelas.js";
import { GLOSARIO } from "./datos/glosario.js";
import { ENLACES_SEED } from "./datos/enlaces.js";
import { CONCEPTOS_TRANSVERSALES } from "./datos/transversales.js";
import { AUTORES_TEORICOS } from "./datos/autoresTeoricos.js";
import { CITAS_AMPLIADAS } from "./datos/citasAmpliadas.js";
import { PLANES_SEED } from "./datos/planes.js";
import { FILOSOFIA_ESCUELA } from "./datos/filosofia.js";
import { FUNDAMENTOS_PERSPECTIVAS } from "./datos/fundamentos.js";
import { SUBPERSPECTIVAS } from "./datos/subperspectivas.js";
const CasoSieteMiradas = carga(() => import("./Funciones2.jsx"), "CasoSieteMiradas");
const TraductorClinico = carga(() => import("./Funciones2.jsx"), "TraductorClinico");
const DebateSimulado = carga(() => import("./Funciones2.jsx"), "DebateSimulado");
const TarjetasRepaso = carga(() => import("./Funciones2.jsx"), "TarjetasRepaso");
const GaleriaCasos = carga(() => import("./Funciones2.jsx"), "GaleriaCasos");
const RosaDeEjes = carga(() => import("./Funciones2.jsx"), "RosaDeEjes");
const ExamenSimulado = carga(() => import("./Funciones2.jsx"), "ExamenSimulado");
const TorreSupuestos = carga(() => import("./Funciones2.jsx"), "TorreSupuestos");
import { LogoPsiconautas, HeroMision, RetratosPerspectiva, GaleriaAutores, CreditosFotos, AUTORES_POR_PERSPECTIVA, RetratosEscuela, Retrato, GaleriaTodasLasVoces } from "./Figuras.jsx";
import { BandaPerspectiva } from "./Placas.jsx";
import { Search, BookOpen, Network, ClipboardList, Languages, ChevronRight, ChevronDown, Plus, Trash2, Save, Download, Upload, X, Stamp, AlertTriangle, FileText, Home, Scale, RotateCcw, Copy } from "./Iconos.jsx";

/* ============================================================
   PALETA Y TOKENS
   Papel: #F2EFE6  Tinta: #1E2A28  Primario clínico: #4A6B70
   Sello evidencia: #9C6B4A  Alerta/falso amigo: #7A4A52
   Afinidad/equivalente: #5C7A5E
   ============================================================ */
const COLORS = {
  paper: "#F5F1E6", paperDark: "#E7E3D4", ink: "#12292E", inkSoft: "#46606A",
  primary: "#14606B", primaryDark: "#0C2F36", clay: "#B8741A", garnet: "#9E3B3B",
  sage: "#3F7D4E", gold: "#B8741A", line: "#CFC8B0", cardBg: "#FAF7EE", onAcento: "#FFFFFF", hover: "#FAF6EC", hoverEtiqueta: "#CFC8B0", aviso: "#FBF3E9",
};

/* Sistema de temas: COLORS es un objeto MUTABLE referenciado por
   propiedad (COLORS.paper, COLORS.ink...) en miles de puntos del archivo,
   nunca desestructurado en constantes de módulo. Esto permite cambiar de
   tema en tiempo de ejecución con Object.assign(COLORS, TEMA_X) — todas
   las referencias existentes recogen el valor nuevo en el siguiente
   render sin tener que tocar una por una las miles de líneas que ya usan
   COLORS.algo. Solo hace falta forzar un re-render tras la mutación (ver
   `cambiarTema` dentro de App). Tres temas: claro (original), oscuro
   (paleta reducida en luminancia pero conservando el tono "papel
   envejecido") y alto contraste (blanco/negro/amarillo puro, pensado para
   baja visión, no para estética).
   Nota de diseño: PERSPECTIVA_COLOR y RELACION_INFO —la codificación de
   color de perspectivas y tipos de relación— NO cambian con el tema, para
   no romper la asociación de color aprendida por el usuario entre
   módulos; solo cambia la paleta "estructural" (fondo, tinta, tarjetas).
   */
const TEMA_CLARO = {
  paper: "#F5F1E6", paperDark: "#E7E3D4", ink: "#12292E", inkSoft: "#46606A",
  primary: "#14606B", primaryDark: "#0C2F36", clay: "#B8741A", garnet: "#9E3B3B",
  sage: "#3F7D4E", gold: "#B8741A", line: "#CFC8B0", cardBg: "#FAF7EE", onAcento: "#FFFFFF", hover: "#FAF6EC", hoverEtiqueta: "#CFC8B0", aviso: "#FBF3E9",
};
const TEMA_OSCURO = {
  // primaryDark se usa como fondo de la barra de cabecera, que tiene texto
  // e iconos en blanco fijo (no dinámico) por herencia del diseño
  // original; por eso aquí se deja en negro en vez de en el amarillo de
  // acento — texto blanco sobre amarillo puro sería justo el tipo de bajo
  // contraste que este tema existe para evitar.
  paper: "#000000", paperDark: "#0A0A0A", ink: "#FFFFFF", inkSoft: "#E0E0E0",
  primary: "#FFD400", primaryDark: "#000000", clay: "#FFD400", garnet: "#FF6B6B",
  sage: "#7CFFB2", gold: "#FFD400", line: "#FFFFFF", cardBg: "#000000", onAcento: "#000000", hover: "#1C1C1C", hoverEtiqueta: "#2B2B2B", aviso: "#141414",
};
const TEMAS = { claro: TEMA_CLARO, oscuro: TEMA_OSCURO };
const TEMA_STORAGE_KEY = "psicoterapias:tema";
// Publica los tokens de color como variables CSS en <html>, para que la
// hoja de estilos global (index.css: fondos, texturas, brillos) use la
// misma paleta que los estilos en línea.
function aplicarVarsTema(nombre) {
  try {
    const r = document.documentElement;
    const t = TEMAS[nombre] || TEMA_CLARO;
    r.dataset.tema = nombre;
    r.style.setProperty("--canvas", nombre === "oscuro" ? "#000000" : "#0B3640");
    r.style.setProperty("--canvas-mod", nombre === "oscuro" ? "#000000" : "#071A1F");
    r.style.setProperty("--sombra", nombre === "oscuro" ? "#FFD400" : "#B8741A");
    Object.entries(t).forEach(([k, v]) => r.style.setProperty(`--c-${k}`, v));
    // En modo oscuro los colores de perspectiva se aclaran para conservar contraste sobre fondo azul noche.
    if (typeof PERSPECTIVA_COLOR !== "undefined") Object.assign(PERSPECTIVA_COLOR, nombre === "oscuro" ? PERSP_COLOR_OSCURO : PERSP_COLOR_CLARO);
  } catch (e) {}
}
const PERSP_COLOR_CLARO = { "Humanista-existencial": "#A9701A", "Psicodinámica": "#9B3550", "Sistémica": "#2F5F9E", "Sistémica y familiar": "#2F5F9E", "Conductual": "#2E7D5B", "Cognitivo-Conductual": "#B4552A", "Integradora": "#6B4C9A", "Integradora y ecléctica": "#6B4C9A", "Transpersonal": "#157A86" };
const PERSP_COLOR_OSCURO = { "Humanista-existencial": "#E8B452", "Psicodinámica": "#E58AA4", "Sistémica": "#86AEE6", "Sistémica y familiar": "#86AEE6", "Conductual": "#79D1A4", "Cognitivo-Conductual": "#EE9E78", "Integradora": "#BDA6E6", "Integradora y ecléctica": "#BDA6E6", "Transpersonal": "#6FD0DA" };
if (typeof document !== "undefined") aplicarVarsTema("claro");

/* Paleta reservada para ESTADO DEL SISTEMA (íntegro / advertencia / error),
   deliberadamente distinta de PERSPECTIVA_COLOR y RELACION_INFO: estas tres
   capas semánticas (perspectiva teórica, tipo de relación traslacional,
   salud de los datos) pueden coexistir en la misma pantalla, así que
   ninguna comparte hex con las otras dos. Se usa en el indicador global,
   el panel "Salud de los datos" y el badge de cobertura por ficha. */
const STATUS_COLORS = {
  ok: "#3A8F5C",
  advertencia: "#C9962E",
  error: "#B8433D",
  neutro: COLORS.inkSoft,
};

// Mapea el id de FUNDAMENTOS_PERSPECTIVAS al nombre corto usado en escuela.perspectiva
// (FUNDAMENTOS_PERSPECTIVAS usa nombres largos como "Sistémica y familiar" para mostrar,
// pero ESCUELAS_SEED usa el nombre corto "Sistémica"; sin este mapeo, cualquier comparación
// directa contra p.nombre falla silenciosamente para sistémica e integradora).
const NOMBRE_CORTO_PERSPECTIVA = {
  humanista: "Humanista-existencial",
  psicodinamica: "Psicodinámica",
  sistemica: "Sistémica",
  conductual: "Conductual",
  cognitivo: "Cognitivo-Conductual",
  integradora: "Integradora",
  transpersonal: "Transpersonal",
};

// Paleta más profunda y saturada que la original (tonos joya en vez de
// apagados), conservando la misma lógica de un color por perspectiva —
// se propaga sola a las 74 escuelas, la línea de tiempo, el mapa
// conceptual, la tabla comparativa y los chips, todos referenciados por
// esta misma constante.
const PERSPECTIVA_COLOR = {
  "Humanista-existencial": "#946000",
  "Psicodinámica": "#C01F4F",
  "Sistémica": "#2457D6",
  "Sistémica y familiar": "#2457D6",
  "Conductual": "#0B7A55",
  "Cognitivo-Conductual": "#B23A09",
  "Integradora": "#7340D6",
  "Integradora y ecléctica": "#7340D6",
  "Transpersonal": "#086A79",
};


/* Colores de relación traslacional: deliberadamente distintos de los 7
   colores de PERSPECTIVA_COLOR (antes «equivalente aproximado» compartía
   el verde de Conductual, «solapamiento parcial» el dorado de Humanista-
   existencial y «falso amigo» el granate de Psicodinámica — una escuela
   podía aparecer con el mismo color que una relación semánticamente no
   relacionada con ella, generando ambigüedad visual). */
const RELACION_INFO = {
  "equivalente aproximado": { color: "#2E7D5B", abrev: "≈ EQ" },
  "análogo funcional": { color: "#4A6B70", abrev: "⟷ AF" },
  "solapamiento parcial": { color: "#9C6B4A", abrev: "∩ SP" },
  "falso amigo": { color: "#A83232", abrev: "✗ FA" },
  "reinterpretación asimilativa": { color: "#8A7F6A", abrev: "↺ RA" },
  "inconmensurable": { color: "#3A2E2E", abrev: "⊘ IN" },
};

/* ============================================================
   TOKENS COMPARTIDOS (evitan repetir literales de estilo en los
   componentes nuevos; el resto del archivo conserva su estilo
   inline original para no arriesgar regresiones en 10.000 líneas
   ya probadas)
   ============================================================ */
const FONT_MONO = "var(--f-mono)";
const FONT_SERIF = "var(--f-display)";
// Estilo tipográfico ÚNICO para cualquier referencia bibliográfica plana
// (una entrada de CITAS_AMPLIADAS en formato string o de e.referencias),
// usado consistentemente en toda la app para que las 74 fichas de escuela
// muestren su bibliografía con la misma fuente, el mismo tamaño y el
// mismo interlineado — antes, según de qué campo del dato viniera la
// referencia, se renderizaba con hasta tres tamaños/colores distintos.
// Es una función (no un objeto estático) porque COLORS es mutable y se
// reasigna al cambiar de tema; un objeto capturado una sola vez al cargar
// el módulo dejaría la bibliografía con el color del tema inicial para
// siempre, sin reaccionar al selector de tema claro/oscuro/alto contraste.
function estiloReferenciaBibliografica() {
  return {
    margin: "0 0 8px",
    fontFamily: "var(--f-text)",
    fontSize: 12,
    lineHeight: 1.55,
    color: COLORS.ink,
    textIndent: -18,
    paddingLeft: 18,
  };
}
const FONT_TEXTO = "var(--f-text)";
const CAMPO_STYLE = { width: "100%", padding: 6, borderRadius: 8, border: `1px solid ${COLORS.line}` };

/* Clasificación aproximada del criterio de verdad declarado en cada
   escuela, para el sello visual del módulo 0/1 (recomendación estética
   "sello por criterio de verdad"). Es una heurística por palabras clave
   sobre el propio texto de `criterioVerdad`; no sustituye ni reescribe
   ese texto, solo lo resume en una etiqueta breve. */
const CRITERIOS_VERDAD = [
  // «verificable/verificado» se retiró deliberadamente del disparador de
  // correspondencia: es un término genérico que también aparece en textos
  // fenomenológicos, pragmáticos y de Psicosíntesis (t3) sin implicar
  // verificación empírico-analítica — su presencia producía falsos
  // positivos que etiquetaban escuelas explícitamente anti-positivistas
  // como «correspondencia empírica». Los disparadores restantes son más
  // específicos del léxico empírico-analítico propiamente dicho.
  { clave: "correspondencia", test: /correspondencia|\bempíric|\bobservable|\bexperimental\b/i, abrev: "COR", label: "Correspondencia empírica", color: "#4A6B70" },
  { clave: "pragmatico", test: /pragmátic/i, abrev: "PRAG", label: "Pragmático", color: "#9C6B4A" },
  { clave: "coherencia", test: /coherencia/i, abrev: "COH", label: "Coherencia narrativa/sistémica", color: "#5C7A5E" },
  { clave: "hermeneutico", test: /hermenéutic|narrativ/i, abrev: "HERM", label: "Hermenéutico-narrativo", color: "#8A6420" },
  // Se amplió con «empátic» y «experiencial» (con límite de palabra, para
  // no capturar «experimental» por error): varias escuelas humanistas y
  // psicodinámicas relacionales describen su criterio de verdad como
  // resonancia empática o vivencia experiencial sin usar literalmente la
  // palabra «fenomenológico», y antes del ajuste quedaban sin clasificar.
  { clave: "fenomenologico", test: /fenomenológic|empátic|\bexperiencial\b/i, abrev: "FEN", label: "Fenomenológico", color: "#8B5FA3" },
  { clave: "intersubjetivo", test: /intersubjetiv/i, abrev: "INTS", label: "Intersubjetivo", color: "#7A4A52" },
];
function clasificarCriterioVerdad(texto) {
  if (!texto) return { abrev: "—", label: "Sin registrar", color: COLORS.inkSoft };
  const hits = CRITERIOS_VERDAD.filter((c) => c.test.test(texto));
  // Antes esto se etiquetaba «MIXTO», un nombre que en realidad describe
  // el caso de 2+ coincidencias (más abajo) y no el de 0 coincidencias.
  // Con 0 coincidencias lo honesto es decir que el criterio no encaja en
  // ninguno de los 6 ejes catalogados —p. ej. el criterio «político» de
  // la terapia feminista (h10) o la «asunción de agencia» existencial
  // (h4)— en vez de forzarlo dentro de una de las seis categorías.
  if (hits.length === 0) return { abrev: "PROPIO", label: "Criterio propio (fuera de los 6 ejes catalogados)", color: COLORS.inkSoft };
  if (hits.length === 1) return hits[0];
  return { abrev: hits.map((h) => h.abrev).join("+"), label: hits.map((h) => h.label).join(" / "), color: hits[0].color };
}

/* Extrae el año más antiguo (1850-2029) mencionado en un texto, como
   aproximación para ubicar cada escuela en la línea de tiempo del
   módulo de Perspectivas. Es deliberadamente aproximado: se apoya en
   el propio texto de `fundamentacion` ya existente en cada escuela,
   sin necesidad de añadir un campo nuevo a los datos. */
function extraerAnio(texto) {
  if (!texto) return null;
  const anios = [...texto.matchAll(/\b(1[89]\d{2}|20[0-2]\d)\b/g)].map((m) => parseInt(m[1], 10));
  if (anios.length === 0) return null;
  return Math.min(...anios);
}

/* ============================================================
   COORDENADAS FILOSÓFICAS POR PERSPECTIVA (Módulo 0)
   Basado en clasificaciones.docx (paradigmas de Guba y Lincoln,
   Burrell y Morgan) y en la tabla transversal comparativa (7.3)
   de documento_psicoterapias.docx
   ============================================================ */
const CLASIFICACION_FILOSOFICA_PERSPECTIVA = {
  psicodinamica: {
    ejeIndependenciaCantidad: "Realismo metafísico y Dualismo: la realidad intrapsíquica existe objetivamente y opera mediante el conflicto de instancias (yo vs. ello).",
    ejeNaturalezaSustancia: "Idealismo objetivo / Materialismo: oscila entre el anclaje biológico-pulsional y las representaciones psíquicas puras.",
    metaEje: "Proceso: el síntoma es el resultado dinámico de «fuerzas de sentido contrario» que pugnan por la descarga o la represión.",
    ismos: "Realismo / Racionalismo: prima el intelecto interpretativo para «hacer consciente lo inconsciente».",
    hessen: "Objetivismo. El analista opera con neutralidad de cirujano. Criterio de verdad: Coherencia lógica (del sentido reconstruido en la interpretación).",
    wolff: "Dualismo: reafirma una escisión intrínseca constitutiva del sujeto (consciente vs. inconsciente, o sujeto vs. mundo).",
    crotty: { epistemologia: "Objetivismo.", perspectiva: "Positivismo hermenéutico.", metodos: "Asociación libre, atención flotante y diván." },
  },
  conductual: {
    ejeIndependenciaCantidad: "Realismo metafísico y Monismo: el entorno exterior moldea al organismo. «Los síntomas son la enfermedad»; no hay trauma oculto.",
    ejeNaturalezaSustancia: "Materialismo / Fisicalismo: el sustrato básico es el comportamiento físico e interacciones directas con el ambiente.",
    metaEje: "Proceso: centrada estrictamente en el devenir de adquisición mediante el condicionamiento y aprendizaje.",
    ismos: "Realismo y Empirismo radical: el conocimiento válido proviene exclusivamente de la observación experimental directa.",
    hessen: "Objetivismo empírico. El terapeuta prescribe acciones basándose en contingencias. Criterio de verdad: Evidencia (datos medibles y observables directamente).",
    wolff: "Monismo: rechaza formalmente el modelo dualista médico subyacente que separa la «mente enferma» del «cuerpo que se comporta».",
    crotty: { epistemologia: "Objetivismo.", perspectiva: "Positivismo conductual.", metodos: "Procedimientos operantes, moldeamiento y exposición directa." },
  },
  cognitivo: {
    ejeIndependenciaCantidad: "Realismo empírico: mantiene un anclaje realista pero asume que la cognición media entre el entorno y el organismo.",
    ejeNaturalezaSustancia: "Naturaleza dual / Idealismo relacional: otorga valor causal a inobservables (los «esquemas cognitivos» y creencias).",
    metaEje: "Estructura y Proceso: las «estructuras de pensamiento» desadaptativas alteran el procesamiento constante de la realidad.",
    ismos: "Racionalismo: asume que la «actividad cognitiva determina el comportamiento»; se curan los «pensamientos irracionales».",
    hessen: "Objetivismo / Apriorismo. Busca corregir las distorsiones del paciente. Criterio de verdad: Evidencia y Coherencia lógica (contrastación de hipótesis empíricas y racionalidad).",
    wolff: "Dualismo metodológico: separa e interviene en un plano de «eventos privados» (cognición) para alterar un plano externo (conducta).",
    crotty: { epistemologia: "Objetivismo (transitando al construccionismo en modelos posracionalistas).", perspectiva: "—", metodos: "Reestructuración cognitiva, diálogo socrático." },
  },
  humanista: {
    ejeIndependenciaCantidad: "Holismo: el individuo es una totalidad integrada (más que la suma de sus partes biológicas).",
    ejeNaturalezaSustancia: "Idealismo objetivo / Espiritualismo: reivindica dimensiones inmateriales (autorrealización, amor, valores superiores).",
    metaEje: "Proceso: concibe al organismo según su «tendencia actualizante», su devenir fluido y su espontaneidad existencial.",
    ismos: "Empirismo fenomenológico: el conocimiento auténtico emana de experimentar el mundo fenoménico interior.",
    hessen: "Subjetivismo. El terapeuta interactúa desde la autenticidad, sin máscaras. Criterio de verdad: Vivencia (el «darse cuenta» y la experiencia sentida inmediata).",
    wolff: "Monismo fenomenológico: trata al paciente no como objeto biomédico, sino como «sujeto singular e irrepetible».",
    crotty: { epistemologia: "Subjetivismo.", perspectiva: "Fenomenología existencial.", metodos: "Relación terapéutica empática y congruencia incondicional." },
  },
  sistemica: {
    ejeIndependenciaCantidad: "Idealismo Subjetivo y Pluralismo relacional: realidad co-creada por la recursividad entre lo observado y el observador.",
    ejeNaturalezaSustancia: "Monismo neutral: el sustrato vital no es material físico ni espíritu abstracto, sino «información» y comunicación relacional.",
    metaEje: "Estructura y Proceso: se interviene en las «pautas transaccionales» jerárquicas y las dinámicas circulares de retroalimentación.",
    ismos: "Criticismo y Constructivismo: las realidades sintomáticas son «narrativas» mantenidas por el juego interaccional.",
    hessen: "Subjetivismo transaccional. Postura de «no saber» frente a familias expertas. Criterio de verdad: Coherencia lógica (narrativa útil) y Evidencia (cambio sistémico).",
    wolff: "Monismo relacional: el sufrimiento no reside «dentro» del individuo, sino en el tejido de interacciones globales.",
    crotty: { epistemologia: "Construccionismo.", perspectiva: "Cibernética y Teoría General de Sistemas.", metodos: "Interrupción de pautas, reformulación y circularidad." },
  },
  integradora: {
    ejeIndependenciaCantidad: "Pluralismo ontológico: requiere contemplar dimensiones simultáneas contradictorias (conductual, afectiva, cognitiva y vincular).",
    ejeNaturalezaSustancia: "Naturaleza plural: la sustancia clínica son los diversos factores (comunes o específicos) que componen la experiencia global.",
    metaEje: "Proceso: no patologiza el ser estático, sino que concibe el problema como un estancamiento en «soluciones que fracasan».",
    ismos: "Empirismo y Racionalismo: combina pragmáticamente qué técnicas funcionan (empírico) con andamiajes teóricos (racional).",
    hessen: "Pragmatismo. El terapeuta opera como un «camaleón» adaptativo. Criterio de verdad: Evidencia (utilidad clínica y eficacia comprobada en investigación).",
    wolff: "Pluralismo funcional: busca que el ensamblaje de múltiples principios rinda un «resultado mejor que cada terapia por separado».",
    crotty: { epistemologia: "Construccionismo pragmático.", perspectiva: "Integracionismo.", metodos: "Síntesis de procesos, factores comunes y recondicionamiento." },
  },
  transpersonal: {
    ejeIndependenciaCantidad: "Monismo Participativo: la identidad sana requiere ir «más allá (trans) de lo individual», conectando con la vida y el cosmos.",
    ejeNaturalezaSustancia: "Idealismo objetivo / Espiritualismo: choque radical con el materialismo mecanicista al validar la dimensión espiritual inmaterial.",
    metaEje: "Proceso multidimensional: plantea un desarrollo evolutivo mediante «fulcros» dentro de una Gran Holoarquía (espectro).",
    ismos: "Intuicionismo / Antirrealismo mecanicista: se apoya en saberes ancestrales y místicos ajenos a la epistemología científica occidental.",
    hessen: "Subjetivismo radical. El clínico se abstiene de dirigir y sólo «ayuda al paciente a descubrir lo que hay dentro de él». Criterio de verdad: Vivencia (experiencias cumbre y estados holotrópicos).",
    wolff: "Monismo de Espectro: superación total del dualismo espacio-tiempo; el último estadío es la «Conciencia de Unidad (Atman)».",
    crotty: { epistemologia: "Subjetivismo participativo.", perspectiva: "Psicología Integral / Trascendental.", metodos: "Facilitación de estados no ordinarios (ej. respiración holotrópica)." },
  },
};

/* ============================================================
   AÑOS DE ORIGEN VERIFICADOS POR ESCUELA (para la línea de tiempo
   del módulo 1). A diferencia de una extracción automática de años
   desde el texto de fundamentación —que puede capturar la fecha de
   una cita secundaria en vez de la fecha fundacional—, esta tabla
   fue construida y contrastada manualmente contra múltiples fuentes
   académicas de alto rigor (APA, Springer, ScienceDirect, PubMed,
   NCBI/StatPearls, biografías académicas de los autores, editoriales
   de los textos fundacionales) en julio de 2026. El criterio de
   selección es el año de la obra o el evento fundacional más citado
   como origen de la escuela, no el año de una edición posterior ni
   el de un artículo que simplemente la menciona. Se documenta la
   fuente de cada dato; donde la literatura difiere sobre el año
   exacto (frecuente en escuelas que maduraron gradualmente a lo
   largo de una década), se anota con "~" y se prioriza el hito de
   publicación o fundación institucional más reconocido. No sustituye
   ni reescribe el texto de `fundamentacion` de cada escuela: sólo
   ubica el punto en el eje temporal. */
const ANIO_ORIGEN = {
  // ---------- HUMANISTA-EXISTENCIAL ----------
  h1: { anio: 1942, hito: "Introduce la terapia no directiva.", fuente: "Rogers, C. R. (1942). *Counseling and psychotherapy*." },
  h2: { anio: 1998, hito: "Discurso presidencial de Seligman ante la American Psychological Association que lanza el programa de Psicología Positiva.", fuente: null },
  h3: { anio: 1951, hito: "Obra fundacional de la terapia gestalt.", fuente: "Perls, F., Hefferline, R., y Goodman, P. (1951). *Gestalt therapy: Excitement and growth in the human personality*." },
  h3b: { anio: 1954, hito: "Fundación del Instituto Gestalt de Cleveland, segundo instituto gestáltico de la historia; el Ciclo de la Experiencia se sistematiza con Miriam Polster y Bill Warner y se consolida en Polster y Polster (1973) y Zinker (1977).", fuente: "Polster, E., y Polster, M. (1973). *Gestalt therapy integrated: Contours of theory and practice*." },
  h3c: { anio: 1993, hito: "Recopilación que cristaliza el giro relacional-dialógico; antecedente directo en Wheeler (1991).", fuente: "Yontef, G. M. (1993). *Awareness, dialogue and process: Essays on Gestalt therapy*." },
  h4: { anio: 1958, hito: "Libro que introduce la psicología existencial en la psiquiatría estadounidense.", fuente: "May, R., Angel, E., y Ellenberger, H. F. (Eds.). (1958). *Existence: A new dimension in psychiatry and psychology*." },
  h5: { anio: 1988, hito: "Consolidación de la escuela existencial británica.", fuente: "Van Deurzen, E. (1988). *Existential counselling in practice*." },
  h6: { anio: 1946, hito: "Difusión de la logoterapia; los primeros escritos de Frankl son de 1938.", fuente: "Frankl, V. E. (1946). *El hombre en busca de sentido*." },
  h6b: { anio: 1991, hito: "Ruptura formal entre Frankl y Längle: Frankl renuncia a la presidencia honoraria de la GLE-International; Längle sistematiza por primera vez el Análisis Existencial Personal como núcleo clínico independiente.", fuente: "Längle, A. (1993). *Die «Personale Existenzanalyse» (PEA) als therapeutisches Konzept*. GLE." },
  h6c: { anio: 1964, hito: "Validación psicométrica fundacional del Purpose in Life Test; el manual técnico del programa de cinco pasos se publica en 1973.", fuente: "Crumbaugh, J. C., y Maholick, L. T. (1964). An experimental study in existentialism. *Journal of Clinical Psychology, 20*(2)." },
  h6d: { anio: 2007, hito: "Sistematización fundacional del modelo como psicoterapia clínica estructurada.", fuente: "Martínez, E. (2007). *Psicoterapia y sentido de vida: Psicología clínica de orientación logoterapéutica*. Herder." },
  h6e: { anio: 1971, hito: "Primer esfuerzo de investigación empírica y de estandarización de constructos logoterapéuticos (Logotest, 1971); tesis doctoral inédita.", fuente: "Lukas, E. (1972). *Logotherapie als Persönlichkeitstheorie* [Tesis doctoral inédita]. Universidad de Viena." },
  h7: { anio: 1983, hito: "Primer artículo de Miller sobre entrevista motivacional.", fuente: "Miller, W. R. (1983). Motivational interviewing with problem drinkers. *Behavioural Psychotherapy, 11*(2)." },
  h8: { anio: 1985, hito: "Convergencia de integración humanista documentada desde mediados de los años ochenta (Rowan, Erskine).", fuente: null },
  h9: { anio: 1978, hito: "Primer libro de divulgación clínica del método.", fuente: "Gendlin, E. T. (1978). *Focusing*." },
  h10: { anio: 1972, hito: "Obra fundacional más citada del movimiento; Chesler ya había cofundado la Association for Women in Psychology en 1969.", fuente: "Chesler, P. (1972). *Women and madness*." },
  h11: { anio: 1942, hito: "Primeros escritos de daseinsanálisis; Boss consolida el enfoque en 1957.", fuente: null },
  // ---------- PSICODINÁMICA ----------
  p1: { anio: 1900, hito: "Obra fundacional del psicoanálisis.", fuente: "Freud, S. (1900). *La interpretación de los sueños*." },
  p2: { anio: 1936, hito: "Obra que formula la psicología del yo.", fuente: "Freud, A. (1936). *El yo y los mecanismos de defensa*." },
  p3: { anio: 1932, hito: "Obra fundacional del psicoanálisis kleiniano de niños.", fuente: "Klein, M. (1932). *El psicoanálisis de niños*." },
  p3b: { anio: 1940, hito: "Primer quiebre metapsicológico sistemático de la Escuela Independiente.", fuente: "Fairbairn, W. R. D. (1940). Schizoid factors in the personality." },
  p4: { anio: 1983, hito: "Preludio del psicoanálisis relacional; Mitchell bautiza y sistematiza la escuela en 1988.", fuente: "Greenberg, J. R., y Mitchell, S. A. (1983). *Object relations in psychoanalytic theory*. Harvard University Press." },
  p4b: { anio: 1984, hito: "Formalizado y bautizado como «campo intersubjetivo» en Contexts of Being (1992).", fuente: "Atwood, G. E., y Stolorow, R. D. (1984). *Structures of subjectivity: Explorations in psychoanalytic phenomenology*. Analytic Press." },
  p5: { anio: 1978, hito: "Primer manual publicado de la familia; siguen Strupp y Binder (1984) y Luborsky (1984).", fuente: "Davanloo, H. (1978). *Basic principles and technique in short-term dynamic psychotherapy*." },
  p10: { anio: 1967, hito: "Artículo fundacional del modelo estructural; la formalización clínica de la TFP es de 1989 (Kernberg, Selzer, Koenigsberg, Carr y Appelbaum).", fuente: "Kernberg, O. F. (1967). Borderline personality organization. *Journal of the American Psychoanalytic Association, 15*(3), 641–685." },
  p6: { anio: 1953, hito: "Discurso de Roma.", fuente: "Lacan, J. (1953). Función y campo de la palabra y del lenguaje en psicoanálisis." },
  p7: { anio: 1911, hito: "Ruptura de Adler con la Sociedad Psicoanalítica de Viena.", fuente: null },
  p8: { anio: 1913, hito: "Ruptura de Jung con Freud (1913) tras Símbolos de transformación (1911–1912); primer pilar experimental: Jung y Riklin (1904), origen de la teoría de los complejos.", fuente: "Jung, C. G. (1912/1952). *Símbolos de transformación*." },
  p9: { anio: 1971, hito: "Obra inaugural de la psicología del self.", fuente: "Kohut, H. (1971). *Análisis del self*." },
  // ---------- SISTÉMICA ----------
  s1: { anio: 1966, hito: "Primera presentación sistemática de la teoría familiar de Bowen.", fuente: null },
  s2: { anio: 1974, hito: "Obra fundacional de la terapia estructural.", fuente: "Minuchin, S. (1974). *Families and family therapy*. Harvard University Press." },
  s3: { anio: 1959, hito: "Fundación del Mental Research Institute (Jackson) en Palo Alto.", fuente: null },
  s4: { anio: 1971, hito: "Constitución formal del equipo de Milán tras su ruptura con el psicoanálisis; el Centro per lo Studio della Famiglia había sido fundado por Selvini Palazzoli en 1967.", fuente: "Armijo Núñez, B., Gómez Macías, V., y Suárez Rodríguez, T. (2014). Terapia de la escuela de Milán. En A. Moreno Fernández (Ed.), *Manual de terapia sistémica* (pp. 266–296). Desclée De Brouwer." },
  s5: { anio: 1978, hito: "Fundación formal del Brief Family Therapy Center de Milwaukee por de Shazer y Berg.", fuente: "Beyebach, M. (2014). Terapia breve centrada en soluciones. En A. Moreno Fernández (Ed.), *Manual de terapia sistémica* (pp. 353–378). Desclée De Brouwer." },
  s6: { anio: 1990, hito: "Obra fundacional de la terapia narrativa.", fuente: "White, M., y Epston, D. (1990). *Narrative means to therapeutic ends*. Norton." },
  s7: { anio: 1964, hito: "Obra fundacional más citada de la terapia familiar experiencial (1.ª ed.; 3.ª ed. revisada, 1983); complementada por el trabajo de Whitaker desde los años sesenta, documentado en Napier y Whitaker (1978).", fuente: "Satir, V. (1964). *Conjoint family therapy*. Science and Behavior Books." },
  s8: { anio: 1973, hito: "Obra fundacional de la terapia familiar contextual.", fuente: "Boszormenyi-Nagy, I., y Spark, G. M. (1973). *Invisible loyalties*. Harper & Row." },
  // ---------- CONDUCTUAL / COGNITIVO-CONDUCTUAL ----------
  c1: { anio: 1958, hito: "Obra fundacional de la desensibilización sistemática.", fuente: "Wolpe, J. (1958). *Psychotherapy by reciprocal inhibition*. Stanford University Press." },
  c2: { anio: 1955, hito: "Formulación inicial de la terapia racional, luego TREC.", fuente: null },
  c3: { anio: 1967, hito: "Primer libro de Beck sobre la depresión.", fuente: "Beck, A. T. (1967). *Depression: Causes and treatment*." },
  c4: { anio: 1999, hito: "Primer manual de ACT.", fuente: "Hayes, S. C., Strosahl, K. D., y Wilson, K. G. (1999). *Acceptance and commitment therapy*. Guilford Press." },
  c5: { anio: 1993, hito: "Manual fundacional de la terapia dialéctico-conductual.", fuente: "Linehan, M. M. (1993). *Cognitive-behavioral treatment of borderline personality disorder*. Guilford Press." },
  c6: { anio: 1991, hito: "Formulación inicial de la psicoterapia analítico-funcional.", fuente: "Kohlenberg, R. J., y Tsai, M. (1991). *Functional analytic psychotherapy: Creating intense and curative therapeutic relationships*. Plenum Press." },
  c7: { anio: 1990, hito: "Primeros escritos de Young sobre terapia de esquemas para trastornos de personalidad.", fuente: null },
  c8: { anio: 2002, hito: "Manual fundacional de la terapia cognitiva basada en mindfulness.", fuente: "Segal, Z. V., Williams, J. M. G., y Teasdale, J. D. (2002). *Mindfulness-based cognitive therapy for depression*. Guilford Press." },
  c10: { anio: 1963, hito: "Libro fundacional de la teoría del aprendizaje social.", fuente: "Bandura, A., y Walters, R. H. (1963). *Social learning and personality development*. Holt." },
  c11: { anio: 1924, hito: "Bases del interconductismo.", fuente: "Kantor, J. R. (1924–1926). *Principles of psychology* (Vols. I y II). Principia Press." },
  c17: { anio: 1974, hito: "Artículo fundacional de la reestructuración racional sistemática.", fuente: "Goldfried, M. R., Decenteceo, E. T., y Weinberg, L. (1974). Systematic rational restructuring as a self-control technique. *Behavior Therapy, 5*, 247–254." },
  c18: { anio: 1971, hito: "Primeros escritos de Maultsby sobre terapia de conducta racional.", fuente: null },
  c19: { anio: 1971, hito: "Entrenamiento en autoinstrucciones.", fuente: null },
  c20: { anio: 1974, hito: "Primeros desarrollos del entrenamiento en inoculación de estrés.", fuente: null },
  c21: { anio: 1971, hito: "Primer programa de entrenamiento en el manejo de la ansiedad.", fuente: "Suinn, R. M., y Richardson, F. (1971). Anxiety management training: A nonspecific behavior therapy program for anxiety control. *Behavior Therapy, 2*, 498–510." },
  c22: { anio: 1971, hito: "Artículo fundacional de la terapia de solución de problemas.", fuente: "D'Zurilla, T. J., y Goldfried, M. R. (1971). Problem solving and behavior modification. *Journal of Abnormal Psychology, 78*(1), 107–126." },
  c23: { anio: 1970, hito: "Artículo fundacional de la terapia de autocontrol.", fuente: "Kanfer, F. H. (1970). Self-regulation: Research issues and speculations. En C. Neuringer y J. L. Michael (Eds.), *Behavior modification in clinical psychology*. Appleton-Century-Crofts." },
  c12: { anio: 1967, hito: "Artículo fundacional de la terapia implosiva.", fuente: "Stampfl, T. G., y Levis, D. J. (1967). Essentials of implosive therapy: A learning-theory-based psychodynamic behavioral therapy. *Journal of Abnormal Psychology, 72*(6), 496–503." },
  c13: { anio: 1935, hito: "Uno de los primeros casos publicados de aversión clásica; Kantorovich había reportado un uso similar para el alcoholismo hacia 1930.", fuente: "Max, L. W. (1935). Breaking up a homosexual fixation by the conditioned reaction technique: A case study. *Psychological Bulletin, 32*, 734." },
  c14: { anio: 1949, hito: "Considerado por buena parte de la historiografía el primer manual sistemático de terapia de conducta.", fuente: "Salter, A. (1949). *Conditioned reflex therapy*." },
  c15: { anio: 1965, hito: "Artículo fundacional de la economía de fichas; se consolida en el libro de 1968.", fuente: "Ayllon, T., y Azrin, N. H. (1965). The measurement and reinforcement of behavior of psychotics. *Journal of the Experimental Analysis of Behavior, 8*(6), 357–383." },
  c16: { anio: 1971, hito: "Artículo fundacional del contrato conductual en familias de delincuentes.", fuente: "Stuart, R. B. (1971). Behavioral contracting within the families of delinquents. *Journal of Behavior Therapy and Experimental Psychiatry*." },
  c24: { anio: 1987, hito: "Estudio fundacional del programa UCLA de intervención conductual temprana.", fuente: "Lovaas, O. I. (1987). Behavioral treatment and normal educational and intellectual functioning in young autistic children. *Journal of Consulting and Clinical Psychology, 55*(1), 3–9." },
  c25: { anio: 1966, hito: "Artículo fundacional de la sensibilización encubierta.", fuente: "Cautela, J. R. (1966). Treatment of compulsive behavior by covert sensitization. *Psychological Reports, 16*, 33–41." },
  c26: { anio: 1996, hito: "Análisis de componentes que sustenta la activación conductual.", fuente: "Jacobson, N. S., Dobson, K. S., Truax, P. A., Addis, M. E., Koerner, K., Gollan, J. K., Gortner, E., y Prince, S. E. (1996). A component analysis of cognitive-behavioral treatment for depression. *Journal of Consulting and Clinical Psychology, 64*(2)." },
  c27: { anio: 1996, hito: "Libro fundacional de la terapia conductual integral de pareja.", fuente: "Jacobson, N. S., y Christensen, A. (1996). *Integrative couple therapy: Promoting acceptance and change*. W. W. Norton." },
  c29: { anio: 2005, hito: "Primera obra editada sobre compasión y psicoterapia; la formulación sistemática de la CFT es de 2010.", fuente: "Gilbert, P. (Ed.). (2005). *Compassion: Conceptualisations, research and use in psychotherapy*. Routledge." },
  c30: { anio: 2013, hito: "Primer ensayo sobre RO-DBT en anorexia nerviosa del adulto.", fuente: "Lynch, T. R., Gray, K. L. H., Hempel, R. J., Titley, M., Chen, E. Y., y O'Mahen, H. A. (2013). Radically open-dialectical behavior therapy for adult anorexia nervosa. *BMC Psychiatry, 13*, 293." },
  // ---------- INTEGRADORA ----------
  i1: { anio: 1936, hito: "Artículo que inaugura la tesis de los factores comunes.", fuente: "Rosenzweig, S. (1936). Some implicit common factors in diverse methods of psychotherapy. *American Journal of Orthopsychiatry*." },
  i2: { anio: 1967, hito: "Artículo que acuña el término «eclecticismo técnico».", fuente: "Lazarus, A. A. (1967). In support of technical eclecticism. *Psychological Reports, 21*(2), 415–416." },
  i3: { anio: 1977, hito: "Integración teórica influyente entre psicoanálisis y terapia conductual.", fuente: "Wachtel, P. L. (1977). *Psychoanalysis and behavior therapy*. Basic Books." },
  i4: { anio: 1992, hito: "Artículo seminal sobre integración asimilativa.", fuente: "Messer, S. B. (1992). A critical examination of belief structures in integrative and eclectic psychotherapy. En J. C. Norcross y M. R. Goldfried (Eds.), *Handbook of psychotherapy integration*. Basic Books." },
  i5: { anio: 1979, hito: "Primer artículo formal de la Selección Sistemática de Tratamiento.", fuente: "Beutler, L. E. (1979). Toward specific psychological therapies for specific conditions. *Journal of Consulting and Clinical Psychology, 47*(5)." },
  // ---------- TRANSPERSONAL ----------
  t1: { anio: 1969, hito: "Maslow declara que está desarrollando «una cuarta psicología trascendental»; el grupo fundador (Maslow, Sutich, Grof, Fadiman) se reunió en Menlo Park en 1967 para bautizar la «psicología transpersonal».", fuente: "Maslow, A. H. (1969). *Toward a humanistic biology*." },
  t2: { anio: 1969, hito: "Fundación del Journal of Transpersonal Psychology (Sutich).", fuente: null },
  t3: { anio: 1965, hito: "Manual fundacional de la psicosíntesis; su origen está en la tesis de 1911.", fuente: "Assagioli, R. (1965). *Psychosynthesis: A manual of principles and techniques*." },
  t4: { anio: 1975, hito: "Desarrollo de la respiración holotrópica tras la prohibición legal del LSD (1973–1975).", fuente: null },
  t5: { anio: 1977, hito: "Obra fundacional de la psicología integral.", fuente: "Wilber, K. (1977). *The spectrum of consciousness*." },
  t6: { anio: 1988, hito: "Modelo dinámico-dialéctico del desarrollo transpersonal.", fuente: "Washburn, M. (1988). *The ego and the dynamic ground*." },
};

/* ============================================================
   AUTORES TEÓRICOS (Fase 0 — piloto, hoja de ruta "teorías
   fundantes"). Separación ontológica deliberada respecto de
   ESCUELAS_SEED: aquí van teorías de base (a menudo de psicología
   experimental, biología o filosofía) que fundamentan varias
   escuelas clínicas sin ser ellas mismas una línea psicoterapéutica
   administrada por su autor (Pavlov y Watson no tienen un protocolo
   clínico propio de N sesiones; su condicionamiento clásico lo
   aplican, cada una a su manera, varias escuelas ya modeladas).

   Relación con las escuelas: CADA ESCUELA declara sus propias
   teorías fundantes en su campo `fundamentosTeoricos: [...]` (array
   de ids de este archivo). Esa es la ÚNICA fuente de verdad —
   deliberadamente NO se guarda la relación inversa aquí, para evitar
   el mismo tipo de desincronización que ya tuvimos que corregir una
   vez en la reclasificación conductual. La dirección inversa
   ("¿qué escuelas fundamenta este autor?") se calcula en tiempo de
   ejecución con `escuelasFundamentadasPor()`, más abajo. */
function escuelasFundamentadasPor(autorId, escuelas) {
  return escuelas.filter((e) => (e.fundamentosTeoricos || []).includes(autorId));
}

/* Qué perspectivas fundamenta un autor: las de todas las escuelas que lo
   citan en fundamentosTeoricos, MÁS la de su propia escuela si administra
   una (esTambienEscuelaPropia) — un autor híbrido como Rogers fundamenta
   Humanista-existencial a través de h1 (la suya) aunque nadie más lo cite.
   Un autor como Jung, que fundamenta tanto su propia Psicología Analítica
   (Psicodinámica, p8) como corrientes de la Psicología Transpersonal (t3),
   debe mostrar AMBAS perspectivas, no solo una — este es precisamente el
   caso que motiva el color combinado en vez de un color único por autor. */
function perspectivasDeAutor(autor, escuelas) {
  const fundamentadas = escuelasFundamentadasPor(autor.id, escuelas);
  const propia = autor.esTambienEscuelaPropia ? escuelas.find((e) => e.id === autor.esTambienEscuelaPropia) : null;
  const todas = propia ? [propia, ...fundamentadas] : fundamentadas;
  return [...new Set(todas.map((e) => e.perspectiva).filter(Boolean))];
}

/* Construye un gradiente CSS que reparte el color de cada perspectiva en
   franjas iguales — así un autor de una sola perspectiva se ve como un
   color sólido, y un autor híbrido (p. ej. Jung: Psicodinámica + Transpersonal)
   se ve inequívocamente partido en dos franjas de color, sin depender de
   que el usuario lea el texto para notar que fundamenta más de una. */
function gradientePerspectivas(perspectivas, direccion = "to bottom") {
  const colores = perspectivas.map((p) => PERSPECTIVA_COLOR[p] || COLORS.inkSoft);
  if (colores.length === 0) return COLORS.line;
  if (colores.length === 1) return colores[0];
  const paso = 100 / colores.length;
  const stops = colores.map((c, i) => `${c} ${(i * paso).toFixed(1)}%, ${c} ${((i + 1) * paso).toFixed(1)}%`).join(", ");
  return `linear-gradient(${direccion}, ${stops})`;
}

/* Clasificación filosófica por escuela/subescuela específica.
   Fuente: los 5 PDF de "Fundamentos filosóficos de la psicoterapia
   [perspectiva]" — cubren en detalle psicodinámica, conductual,
   sistémica, transpersonal e integradora/ecléctica. Claves = id de
   escuela en ESCUELAS_SEED. Donde el PDF describe una corriente sin
   escuela modelada 1:1 (p. ej. "Terapias postmodernas" agrupando
   s5/s6), se replica el bloque en cada escuela correspondiente. */
const DEBATES_PERSPECTIVAS = {
  humanista: [
    {
      pregunta: "¿Es posible una no-directividad plena, o toda intervención orienta encubiertamente?",
      posturas: [
        {
          nombre: "No-directividad como condición técnica",
          texto:
            "Rogers confía en que el cliente accede a sus propios recursos de autocomprensión si el terapeuta ofrece «un clima de actitudes facilitadoras», sin dirigir el contenido (Rodríguez Morejón, 2012, p. 167).",
        },
        {
          nombre: "Objeción de la directividad encubierta",
          texto:
            "La sola selección de qué reflejar, qué silenciar o qué enfatizar ya orienta la sesión; la no-directividad plena sería, en el mejor de los casos, un ideal regulativo más que una práctica lograble.",
        },
      ],
    },
    {
      pregunta: "¿Rechazar el diagnóstico es una virtud clínica o una limitación ante cuadros graves?",
      posturas: [
        {
          nombre: "Rechazo del modelo médico",
          texto:
            "Van Deurzen y Adams sostienen que los problemas humanos son «problemas en el vivir» y no enfermedades a etiquetar (Van Deurzen y Adams, 2016, p. 18).",
        },
        {
          nombre: "Objeción desde la especificidad diagnóstica",
          texto:
            "Sin categorías diagnósticas se corre el riesgo de perder la especificidad de tratamiento que requieren cuadros graves (psicosis, TOC severo), donde la falta de técnica estructurada es una de las críticas más citadas al humanismo.",
        },
      ],
    },
  ],
  psicodinamica: [
    {
      pregunta: "¿Neutralidad analítica o coparticipación inevitable del analista?",
      posturas: [
        {
          nombre: "Abstinencia y neutralidad clásicas",
          texto:
            "El psicoanálisis clásico sostiene la neutralidad técnica del analista como condición para que emerja la transferencia sin contaminarla con la subjetividad del terapeuta.",
        },
        {
          nombre: "Giro relacional: coparticipación ineludible",
          texto:
            "Mitchell y el psicoanálisis relacional afirman que el analista «no es pantalla en blanco, sino participante ineludible»: la neutralidad pura es, para esta corriente, un mito de una psicología de una sola persona (Gabbard, 2002, pp. 54–55).",
        },
      ],
    },
    {
      pregunta: "¿El inconsciente se descubre o se co-construye en el proceso analítico?",
      posturas: [
        {
          nombre: "Determinismo psíquico lineal (clásico)",
          texto:
            "El inconsciente dinámico es una realidad psíquica que antecede a la cura y que la interpretación descubre progresivamente (Rodríguez Morejón, 2012, pp. 68–69).",
        },
        {
          nombre: "Constructivismo dialéctico (relacional)",
          texto:
            "Las corrientes relacionales conciben el conocimiento clínico como algo que se genera en la intersubjetividad analista-paciente, no que preexista a ella (Tabla 6, documento_psicoterapias.docx).",
        },
      ],
    },
  ],
  sistemica: [
    {
      pregunta: "¿Existe el individuo aparte del sistema, o solo hay pautas relacionales?",
      posturas: [
        {
          nombre: "Primacía del sistema",
          texto:
            "Bowen afirma que «la familia es una unidad emocional» en la que un cambio en una parte produce cambios compensatorios en las demás (Bowen, 1978, p. 3).",
        },
        {
          nombre: "Objeción de la pérdida del individuo",
          texto:
            "Una de las críticas más constantes al enfoque sistémico es que «puede perder al individuo en el sistema», diluyendo el sufrimiento singular en la descripción del patrón relacional.",
        },
      ],
    },
    {
      pregunta: "¿Puede el terapeuta observar el sistema sin intervenir en él?",
      posturas: [
        {
          nombre: "Primera cibernética: observación externa",
          texto:
            "Los modelos estructural y estratégico suponen que el terapeuta puede diagnosticar la estructura o el circuito desde una posición relativamente externa al sistema.",
        },
        {
          nombre: "Segunda cibernética: reflexividad del observador",
          texto:
            "Milán y post-Milán abandonan esa posición: el terapeuta no está fuera del sistema que observa, y la neutralidad se redefine como curiosidad reflexiva compartida; la neutralidad original del grupo de Milán era la actitud de no tomar partido por ningún miembro de la familia (Moreno, 2014, p. 283).",
        },
      ],
    },
  ],
  conductual: [
    {
      pregunta: "¿Mecanicismo o síntesis con la emoción?",
      posturas: [
        {
          nombre: "Crítica del mecanicismo",
          texto:
            "Una crítica histórica frecuente es que el conductismo «trata a las personas como máquinas», reduciendo la experiencia a variables medibles.",
        },
        {
          nombre: "Respuesta de la tercera generación",
          texto:
            "Hayes y Hofmann sitúan la tercera generación (ACT, DBT, FAP) como una respuesta explícita a esa crítica, centrada en la emoción y la aceptación en vez de solo en el control sintomático (Hayes y Hofmann, 2018, p. 24).",
        },
      ],
    },
    {
      pregunta: "¿Puede el conductismo dar cuenta de la conducta verbal y el pensamiento?",
      posturas: [
        {
          nombre: "Objeción del «tema pendiente»",
          texto:
            "«Por lo que respecta a la polémica cognitivo/conductual se diría que es el tema pendiente de la conducta verbal. La cuestión es que la terapia de conducta no ha incorporado la conducta verbal, y lo más que hace en la práctica es hablar» (Pérez Álvarez, 1996).",
        },
        {
          nombre: "Respuesta contextualista funcional",
          texto:
            "ACT y la teoría del marco relacional (Hayes) responden extendiendo el análisis conductual al lenguaje mismo, tratando los eventos verbales como conductas gobernadas por los mismos principios de aprendizaje relacional, sin necesidad de postular representaciones mentales.",
        },
      ],
    },
  ],
  cognitivo: [
    {
      pregunta: "¿El síntoma es la enfermedad o solo su expresión superficial?",
      posturas: [
        {
          nombre: "Objeción psicodinámica",
          texto:
            "La crítica clásica sostiene que la terapia cognitiva es «superficial»: atiende el síntoma y no la raíz inconsciente del malestar.",
        },
        {
          nombre: "Respuesta desde la evidencia",
          texto:
            "La terapia cognitiva responde con evidencia de que el cambio sintomático conlleva mejoras más amplias en la personalidad, y que los mecanismos específicos (p. ej., la reestructuración cognitiva en depresión) importan por sí mismos (Chambless, 2002; Wampold e Imel, 2015).",
        },
      ],
    },
    {
      pregunta: "¿La cognición causa la emoción, o ambas emergen juntas de un mismo proceso?",
      posturas: [
        {
          nombre: "Primacía cognitiva clásica",
          texto:
            "Beck y Ellis sostienen que el contenido de la cognición (creencia, pensamiento automático) precede causalmente y determina la respuesta emocional, de modo que cambiar la cognición es la vía primaria de cambio.",
        },
        {
          nombre: "Objeción del giro relacional/mindfulness",
          texto:
            "Corrientes como la MBCT cuestionan que sea necesario cambiar el contenido de la cognición: proponen que basta con cambiar la relación (descentramiento) con ella, sin entrar en un debate sobre qué causa qué.",
        },
      ],
    },
  ],
  integradora: [
    {
      pregunta: "¿Eclecticismo como pragmatismo legítimo o como falta de identidad teórica?",
      posturas: [
        {
          nombre: "Pragmatismo técnico",
          texto:
            "Lazarus defiende tomar técnicas eficaces de muchas orientaciones sin suscribir las teorías que las originaron (Goldfried et al., 2019, cap. 2, y Norcross y Alexander, 2019, cap. 1, en Norcross y Goldfried, Eds.; paráfrasis).",
        },
        {
          nombre: "Objeción del sincretismo",
          texto:
            "La crítica más repetida es que esta postura exige dominar demasiadas teorías y corre el riesgo de ser «aprendiz de todo, maestro de nada».",
        },
      ],
    },
    {
      pregunta: "¿Es medible la contribución real de los factores comunes frente a las técnicas específicas?",
      posturas: [
        {
          nombre: "Tesis del efecto Dodo",
          texto:
            "Wampold defiende que buena parte de la varianza de resultado se explica por ingredientes compartidos por toda terapia, más que por técnicas específicas (Wampold y Ulvenes, 2019, cap. 3, en Norcross y Goldfried, Eds.).",
        },
        {
          nombre: "Objeción metodológica",
          texto:
            "De Felice et al. cuestionan la cifra habitual del «30-70 %» atribuida a los factores comunes, porque depende de tratar factores comunes y específicos como predictores independientes, cuando en realidad están correlacionados (De Felice et al., 2019).",
        },
      ],
    },
  ],
};

/* ============================================================
   PROTOCOLOS ESTANDARIZADOS (Módulo 2)
   Solo para escuelas con manual publicado. Las demás se marcan
   «sin protocolo estandarizado» y conservan sus técnicas (no se inventan protocolos).
   ============================================================ */
const PROTOCOLOS_SEED = {}; // se rellena al cargar src/datos/protocolos.js


const TEXTOS_FUNDAMENTALES = {
  h1: ["Rogers, C. (1951). Client-Centered Therapy. Houghton Mifflin.", "Rogers, C. (1961). On Becoming a Person. Houghton Mifflin.", "Maslow, A. H. (1970). Motivation and Personality. Harper & Row."],
  h3: ["Perls, F., Hefferline, R., Goodman, P. (1951). Gestalt Therapy. Julian Press.", "Yontef, G. (1993). Awareness, Dialogue and Process. Gestalt Journal Press."],
  h3b: ["Polster, E., Polster, M. (1973). Gestalt Therapy Integrated: Contours of Theory and Practice. Brunner/Mazel.", "Zinker, J. (1977). El proceso creativo en la terapia guestáltica. Paidós."],
  h3c: ["Yontef, G. M. (1993). Awareness, Dialogue and Process: Essays on Gestalt Therapy.", "Wheeler, G. (1991). Gestalt Reconsidered: A New Approach to Contact and Resistance."],
  h7: ["Miller, W. R., Rollnick, S. (1991). Motivational Interviewing: Preparing People to Change Addictive Behavior. Guilford Press.", "Miller, W. R., Rollnick, S. (2015). La entrevista motivacional (3.ª ed.). Paidós."],
  h8: ["Gimeno-Bayón, A., Rosal, R. (2001). Psicoterapia Integradora Humanista. Volumen I. Desclée de Brouwer.", "Gimeno-Bayón, A., Rosal, R. (2017). Manual práctico de Psicoterapia Integradora Humanista. Desclée de Brouwer."],
  h9: ["Gendlin, E. T. (1981). Focusing: proceso y técnica del enfoque corporal. Mensajero.", "Greenberg, L., Rice, L., Elliott, R. (1993). Facilitating Emotional Change. Guilford Press."],
  h6e: ["Lukas, E. (1971/1972). Logotherapie als Persönlichkeitstheorie. Tesis doctoral inédita, Universidad de Viena.", "Guttmann, D. (1998). Logoterapia para profesionales: trabajo social significativo. Desclée de Brouwer."],
  h4: ["Yalom, I. D. (1980). Existential Psychotherapy. Basic Books.", "May, R. (1950). The Meaning of Anxiety. Ronald Press."],
  h5: ["Van Deurzen, E. (2010). Everyday Mysteries (2.ª ed.). Routledge.", "Van Deurzen, E., Adams, M. (2016). Skills in Existential Counselling & Psychotherapy (2.ª ed.). SAGE."],
  h6: ["Frankl, V. E. (1946/1992). El hombre en busca de sentido.", "Frankl, V. E. (1969). The Will to Meaning. World Publishing."],
  h6b: ["Längle, A. (1993). Die 'Personale Existenzanalyse' (PEA) als therapeutisches Konzept. GLE.", "Längle, A. (2000). Praxis der Personalen Existenzanalyse. Facultas."],
  h6c: ["Crumbaugh, J. C., Maholick, L. T. (1964). An experimental study in existentialism. Journal of Clinical Psychology, 20(2).", "Crumbaugh, J. C. (1973). Logoanálisis."],
  h6d: ["Martínez, E. (2007). Psicoterapia y sentido de vida. Psicología clínica de orientación logoterapéutica. Herder.", "Martínez, E. (2011). Los modos de ser inauténticos. El Manual Moderno."],
  h10: ["Brown, L. S. (1994). Subversive Dialogues: Theory in Feminist Therapy. Basic Books.", "Burstow, B. (1992). Radical Feminist Therapy. Sage."],
  p1: ["Breuer, J., Freud, S. (1895). Estudios sobre la histeria.", "Freud, S. (1900). La interpretación de los sueños.", "Freud, S. (1901). Psicopatología de la vida cotidiana.", "Freud, S. (1905). Tres ensayos de teoría sexual.", "Freud, S. (1917). Conferencias de introducción al psicoanálisis.", "Freud, S. (1923). El yo y el ello."],
  p2: ["Hartmann, H. (1939/1958). Ego Psychology and the Problem of Adaptation. International Universities Press.", "Freud, A. (1936). El yo y los mecanismos de defensa."],
  p3: ["Klein, M. (1932). El psicoanálisis de niños.", "Klein, M. (1946). Notes on Some Schizoid Mechanisms.", "Klein, M. (1957). Envidia y gratitud."],
  p3b: ["Fairbairn, W. R. D. (1952). Psychoanalytic Studies of the Personality. Routledge & Kegan Paul.", "Winnicott, D. W. (1965). The Maturational Processes and the Facilitating Environment. Hogarth Press.", "Balint, M. (1968). The Basic Fault: Therapeutic Aspects of Regression. Tavistock."],
  p4: ["Greenberg, J. R., Mitchell, S. A. (1983). Object Relations in Psychoanalytic Theory. Harvard University Press.", "Mitchell, S. A. (1988). Relational Concepts in Psychoanalysis. Harvard University Press.", "Aron, L. (1996). A Meeting of Minds. Analytic Press."],
  p4b: ["Atwood, G. E., Stolorow, R. D. (1984). Structures of Subjectivity. Analytic Press.", "Stolorow, R. D., Atwood, G. E. (1992). Contexts of Being. Analytic Press.", "Orange, D. M., Stolorow, R. D. (1998). Self-disclosure and intersubjectivity theory. Psychoanalytic Inquiry, 18(4)."],
  p5: ["Strupp, H. H., Binder, J. L. (1984). Psychotherapy in a New Key: A Guide to Time-Limited Dynamic Psychotherapy. Basic Books.", "Luborsky, L. (1977). Measuring a pervasive psychic structure in psychotherapy: The CCRT.", "Luborsky, L. (1984). Principles of Psychoanalytic Psychotherapy: A Manual for Supportive-Expressive Treatment. Basic Books.", "Davanloo, H. (1978). Basic Principles and Technique in Short-Term Dynamic Psychotherapy. Spectrum.", "Davanloo, H. (1980). Short-Term Dynamic Psychotherapy. Jason Aronson.", "Davanloo, H. (2000). Intensive Short-term Dynamic Psychotherapy: Selected Papers of Habib Davanloo. Wiley.", "Malan, D. H. (1979). Individual Psychotherapy and the Science of Psychodynamics. Butterworth.", "Lemma, A., Target, M., Fonagy, P. (2011). Terapia dinámica interpersonal breve. Una guía clínica. Editorial Mediterráneo."],
  p10: ["Kernberg, O. F. (1967). Borderline personality organization. Journal of the American Psychoanalytic Association, 15(3).", "Kernberg, O. F. (1975). Borderline Conditions and Pathological Narcissism. Jason Aronson.", "Kernberg, O. F. (1984). Severe Personality Disorders: Psychotherapeutic Strategies. Yale University Press.", "Kernberg, O. F., Selzer, M. A., Koenigsberg, H. W., Carr, A. C., Appelbaum, A. H. (1989). Psychodynamic Psychotherapy of Borderline Patients. Basic Books.", "Yeomans, F. E., Selzer, M. A., Clarkin, J. F. (1992). Treating the Borderline Patient: A Contract-Based Approach. Basic Books.", "Yeomans, F. E., Clarkin, J. F., Kernberg, O. F. (2015). Transference-Focused Psychotherapy for Borderline Personality Disorder: A Clinical Guide. APA Publishing."],
  p6: ["Lacan, J. (1932). De la psychose paranoïaque dans ses rapports avec la personnalité (tesis doctoral).", "Lacan, J. (1949). El estadio del espejo como formador de la función del yo.", "Lacan, J. (1953). Función y campo de la palabra y del lenguaje en psicoanálisis (Discurso de Roma).", "Lacan, J. (1966). Écrits. Seuil.", "Lacan, J. (1973). Le Séminaire, Livre XI. Seuil."],
  p7: ["Adler, A. (1912). Über den nervösen Charakter. Bergmann.", "Adler, A. (1927/1998). Understanding Human Nature. Hazelden.", "Adler, A. (1935). El sentido de la vida.", "Adler, A. (1929). The Science of Living. Allen & Unwin."],
  p8: ["Jung, C. G. (1904). Investigaciones experimentales sobre las asociaciones de sujetos sanos (con F. Riklin).", "Jung, C. G. (1912/1952). Símbolos de transformación.", "Jung, C. G. (1921). Tipos psicológicos.", "Jung, C. G. (1928). Las relaciones entre el yo y lo inconsciente.", "Jung, C. G. (1944). Psicología y Alquimia.", "Jung, C. G. (1954). Los arquetipos y lo inconsciente colectivo.", "Jung, C. G. (1957). La función transcendente.", "Jung, C. G. (2009). El Libro Rojo (Liber Novus).", "Jung, C. G. (1959). The Archetypes and the Collective Unconscious. Princeton University Press.", "Jung, C. G. (1963). Memories, Dreams, Reflections. Pantheon Books."],
  s1: ["Bowen, M. (1978). Family Therapy in Clinical Practice. Jason Aronson.", "Kerr, M. E., Bowen, M. (1988). Family Evaluation. Norton."],
  s2: ["Minuchin, S. (1974/1977). Familias y terapia familiar. Gedisa.", "Minuchin, S., Fishman, H. C. (1981). Family Therapy Techniques. Harvard University Press.", "Minuchin, S., Rosman, B. L., Baker, L. (1978). Psychosomatic Families: Anorexia Nervosa in Context. Harvard University Press."],
  s3: ["Watzlawick, P., Weakland, J., Fisch, R. (1974). Change. Norton.", "Haley, J. (1976). Problem-Solving Therapy. Jossey-Bass.", "Watzlawick, P., Beavin, J. H., Jackson, D. D. (1967). Pragmatics of Human Communication. Norton.", "Bateson, G., Jackson, D. D., Haley, J., Weakland, J. (1956). Toward a theory of schizophrenia. Behavioral Science, 1.", "Haley, J. (1963). Strategies of Psychotherapy. Grune & Stratton."],
  s4: ["Selvini Palazzoli, M., Boscolo, L., Cecchin, G., Prata, G. (1975). Paradoja y contraparadoja. Jason Aronson.", "Selvini Palazzoli, M., Boscolo, L., Cecchin, G., Prata, G. (1980). Hipotetización, circularidad y neutralidad: tres directrices para el buen desarrollo de la sesión. Family Process, 19.", "Boscolo, L., Cecchin, G., Hoffman, L., Penn, P. (1987). Milan Systemic Family Therapy. Basic Books.", "Selvini Palazzoli, M. et al. (1988/1990). Los juegos psicóticos en la familia."],
  s5: ["De Shazer, S. (1985). Keys to Solution in Brief Therapy. Norton.", "De Shazer, S. (1988). Clues: Investigating Solutions in Brief Therapy. Norton.", "De Shazer, S. (1984). The death of resistance. Family Process, 23.", "De Shazer, S., Berg, I. K. (1997). «What works?» Family Process, 36."],
  s6: ["White, M., Epston, D. (1990). Narrative Means to Therapeutic Ends. Norton.", "White, M. (2007). Maps of Narrative Practice. Norton.", "Freedman, J., Combs, G. (1996). Narrative Therapy: The Social Construction of Preferred Realities. Norton."],
  s7: ["Satir, V. (1964/1983). Conjoint Family Therapy. Science and Behavior Books.", "Satir, V. (1972). Peoplemaking. Science and Behavior Books.", "Napier, A. Y., Whitaker, C. A. (1978). The Family Crucible. Harper & Row.", "Whitaker, C. A., Bumberry, W. M. (1988). Dancing with the Family. Brunner/Mazel."],
  s8: ["Boszormenyi-Nagy, I., Spark, G. (1973). Invisible Loyalties. Harper & Row.", "Boszormenyi-Nagy, I., Krasner, B. (1986). Between Give and Take. Brunner/Mazel.", "Boszormenyi-Nagy, I., & Framo, J. L. (Eds.). (1965). Intensive family therapy: Theoretical and practical aspects. Harper & Row."],
  c6: ["Kohlenberg, R. J., Tsai, M. (1991). Functional Analytic Psychotherapy. Plenum Press.", "Tsai, M. et al. (2009). A Guide to Functional Analytic Psychotherapy. Springer."],
  i1: ["Rosenzweig, S. (1936). Some implicit common factors in diverse methods of psychotherapy. American Journal of Orthopsychiatry, 6(3).", "Frank, J. D., & Frank, J. B. (1991). Persuasion and healing: A comparative study of psychotherapy (3.ª ed.). Johns Hopkins University Press.",
      "Norcross, J. C., & Goldfried, M. R. (Eds.). (2019). Handbook of psychotherapy integration (3.ª ed.). Oxford University Press. [El archivo de la biblioteca figura como 2005, pero es la 3.ª edición.]",
      "Wampold, B. E., & Ulvenes, P. G. (2019). Integration of common factors and specific ingredients. En J. C. Norcross & M. R. Goldfried (Eds.), Handbook of psychotherapy integration (3.ª ed., cap. 3). Oxford University Press.", "Goldfried, M. R. (1980). Toward the delineation of therapeutic change principles. American Psychologist, 35(11).", "Wampold, B. E. (2001/2015). The Great Psychotherapy Debate. Routledge."],
  i2: ["Lazarus, A. A. (1967). In support of technical eclecticism. Psychological Reports, 21(2), 415–416.", "Lazarus, A. A. (1989). The Practice of Multimodal Therapy. Johns Hopkins University Press."],
  i3: ["Wachtel, P. L. (1977). Psychoanalysis and Behavior Therapy: Toward an Integration. Basic Books.", "Prochaska, J. O., DiClemente, C. C. (1984). The Transtheoretical Approach. Dow Jones-Irwin.", "Prochaska, J. O., Norcross, J. C. (1999). Systems of Psychotherapy (4.ª ed.). Brooks/Cole."],
  i4: ["Messer, S. B. (1992). A critical examination of belief structures in integrative and eclectic psychotherapy.", "Stricker, G., & Gold, J. R. (1996). Psychotherapy integration: An assimilative, psychodynamic approach. Clinical Psychology: Science and Practice, 3(1), 47-58.", "Gold, J., Stricker, G. (2001). A relational psychodynamic perspective on assimilative integration. Journal of Psychotherapy Integration, 11."],
  i5: ["Beutler, L. E. (1983). Eclectic Psychotherapy: A Systematic Approach. Pergamon Press.", "Beutler, L. E., Clarkin, J. F. (1990). Systematic Treatment Selection. Brunner/Mazel."],
  t1: ["Maslow, A. H. (1971). La amplitud de la naturaleza humana (The Farther Reaches of Human Nature). Editorial Trillas.", "Maslow, A. H. (1969). Toward a Humanistic Biology.", "Maslow, A. H. (1964). Religions, Values, and Peak-Experiences. Ohio State University Press.", "Maslow, A. H. (1967). A Theory of Metamotivation: The Biological Rooting of the Value-Life."],
  t3: ["Assagioli, R. (1965). Psychosynthesis: A Manual of Principles and Techniques. Hobbs, Dorman.", "Ferrucci, P. (1982). Psicosíntesis (Qué somos y qué podemos ser). Editorial Sirio."],
  t4: ["Grof, S. (1975). Realms of the Human Unconscious. Viking Press.", "Grof, S. (1980). LSD Psychotherapy. Hunter House.", "Grof, S. (1985). Beyond the Brain. State University of New York Press.", "Grof, S., Grof, C. (1989). Spiritual Emergency. J. P. Tarcher.", "Grof, C., Grof, S. (1990). The Stormy Search for the Self. J. P. Tarcher.", "Grof, S., Grof, C. (2010/2023). Holotropic Breathwork: A New Approach to Self-Exploration and Therapy. SUNY Press."],
  t5: ["Wilber, K. (1977). The Spectrum of Consciousness. Quest Books.", "Wilber, K. (1979). No Boundary. Center Publications.", "Wilber, K. (1980). El proyecto Atman. Editorial Kairós.", "Wilber, K. (1982). Up from Eden. Anchor Press.", "Wilber, K. (1983). Los tres ojos del conocimiento. Editorial Kairós.", "Wilber, K. (1994). Psicología integral (Transformations of Consciousness, 1986). Editorial Kairós.", "Wilber, K. (1995). Sexo, Ecología, Espiritualidad. Editorial Gaia.", "Wilber, K. (1996). Breve historia de todas las cosas. Editorial Kairós."],
};

/* ============================================================
   SUB-VARIANTES INTERNAS DE ESCUELA (Módulo 1, solo humanista)
   Algunas escuelas del árbol agrupan, en rigor, varias corrientes
   con ontología, epistemología, conceptos y manual propios. Se
   documentan aquí con el mismo nivel de detalle que una ficha de
   escuela completa, basado en fuentes primarias citadas.
   ============================================================ */
const SUBVARIANTES_ESCUELA = {
  h1: [
    {
      nombre: "Vertiente rogeriana (Enfoque Centrado en la Persona)",
      autores: "Carl Rogers",
      definicionTextual: "Rogers «no refundó la psicopatología sino que, asumiendo las caracterizaciones existentes, se propuso acompañar a las personas desde otros roles, con otras actitudes»",
      fuenteDefinicion: "Tobón, S., Correa, L. (2022). Psicología Clínica: una perspectiva humanista. Fundación Universitaria María Cano.",
      ontologia: "El organismo posee una tendencia actualizante innata; el self es una estructura fenoménica que puede volverse congruente o incongruente con la experiencia.",
      epistemologia: "El conocimiento clínico se obtiene adoptando el marco de referencia interno del cliente, no observándolo desde fuera.",
      conceptosClave: ["Tendencia actualizante", "Consideración positiva incondicional", "Congruencia o autenticidad"],
      manual: "Rosal, R., Gimeno-Bayón, A. (2001). Introducción al modelo de la psicología humanista. FUOC.",
    },
    {
      nombre: "Vertiente maslowiana (Psicología de la Autorrealización)",
      autores: "Abraham Maslow",
      definicionTextual: "Aunque Maslow no era un clínico en activo, sus ideas han influido significativamente en la práctica de la psicoterapia: no desarrolló un sistema de técnicas sino un enfoque ético de las relaciones humanas (paráfrasis del prólogo de Frager; formulación literal no verificada en la biblioteca).",
      fuenteDefinicion: "Frager, R., en Maslow, A. H. (1970). Motivation and Personality. Harper & Row.",
      ontologia: "Persona organizada por una jerarquía de necesidades (seguridad, pertenencia, amor, autoestima) cuya satisfacción conduce a la autorrealización, «objetivo último de toda terapia».",
      epistemologia: "El conocimiento terapéutico es ético-relacional, no técnico: se sistematiza en principios de conducta del terapeuta, no en procedimientos.",
      conceptosClave: ["Jerarquía de necesidades", "Autorrealización", "Valores del Ser (B-Values)", "Atmósfera permisiva"],
      manual: "Maslow, A. H. (1954/1970). Motivación y Personalidad. Harper & Row.",
    },
  ],
  h3: [
    {
      nombre: "Gestalt clásica",
      autores: "Fritz Perls, Laura Perls, Paul Goodman, Ralph Hefferline",
      definicionTextual: "«El centro de nuestro tiempo como acontecimientos humanos conscientes en el tiempo y en el espacio es el presente. No existe otra realidad salvo el presente»",
      fuenteDefinicion: "Perls, F. (1942/1975). Ego, Hunger and Aggression, p. 119.",
      ontologia: "Ontología del momento: la realidad humana se da exclusivamente en el límite de contacto entre organismo y ambiente; no hay un pasado real, solo un presente continuo.",
      epistemologia: "El conocimiento válido proviene de la experiencia sensorial y visceral directa, no del intelecto; conocer es vivenciar la formación y destrucción de gestalten en la conciencia.",
      metodologia: "Fenomenología conductista centrada estrictamente en el «cómo» y el «ahora», prohibiendo el «por qué».",
      criterioVerdad: "«Lo obvio»: la verdad está en la superficie del individuo (tono de voz, postura, tensión muscular); la forma es el verdadero contenido de la neurosis.",
      conceptosClave: ["Aquí y ahora", "Awareness (darse cuenta)", "Contacto", "Figura-fondo", "Capas de la neurosis"],
      manual: "Perls, F., Hefferline, R., Goodman, P. (1951/2002). Gestalt Therapy. Julian Press.",
    },
    {
      nombre: "Escuela de Cleveland / proceso creativo",
      autores: "Joseph Zinker, Erving y Miriam Polster, Claudio Naranjo",
      definicionTextual: "«El experimento guestáltico es una forma de pensar en voz alta, una concreción de la propia imaginación, una aventura creadora»",
      fuenteDefinicion: "Zinker, J. (1977). El proceso creativo en la terapia guestáltica, p. 108.",
      ontologia: "La vida y la personalidad humana son, en su esencia, una obra de arte en constante desarrollo; el ser humano es ontológicamente un creador de sentido.",
      epistemologia: "El conocimiento se genera expandiendo (stretching) los límites del autoconcepto mediante el «experimentar» estético y el ensayo de formas de ser inéditas.",
      metodologia: "Diseño de experimentos «a la medida» (tailor-made) y estrategia de técnicas supresivas, expresivas y de integración (Naranjo).",
      criterioVerdad: "La Buena Forma («Good Form»): una experiencia es sana si fluye rítmicamente, con elegancia y resolución estética, en contraste con el comportamiento truncado de la patología.",
      conceptosClave: ["El experimento", "Polaridades", "Moldeo revolucionario", "Indiferencia creativa", "Estética terapéutica"],
      manual: "Naranjo, C. (1990). La vieja y novísima Gestalt: actitud y práctica.",
    },
    {
      nombre: "Gestalt relacional y fenomenológica (contemporánea)",
      autores: "Gary Yontef, Philip Brownell, Lynne Jacobs, Michael Clemmens",
      definicionTextual: "«La terapia gestáltica es un sistema psicoterapéutico que combina diálogo y fenomenología en una metodología clínica unificada»",
      fuenteDefinicion: "Yontef, G. (1995). Proceso y diálogo en Gestalt, p. 221.",
      ontologia: "Profundamente interactiva: el sí mismo no existe en aislamiento, sino en un «campo de dos personas» co-creado con el otro.",
      epistemologia: "El conocimiento clínico no lo posee el terapeuta-experto ni se extrae del paciente: se co-construye por vía hermenéutica entre dos percepciones fenomenológicas del mundo.",
      metodologia: "Método fenomenológico modificado (epoché, descripción, horizontalización) sostenido dentro de una relación dialógica de inclusión.",
      criterioVerdad: "Confirmación dialógica: la verdad de la experiencia clínica se confirma y valida con el sujeto en la interacción; es contextual y revisable.",
      conceptosClave: ["Relación dialógica", "Teoría de campo", "Inclusión", "Alteridad"],
      manual: "Brownell, P. (2009/2010). Gestalt Therapy: A Guide to Contemporary Practice. Springer.",
    },
  ],
  h5: [
    {
      nombre: "Análisis existencial fenomenológico (van Deurzen)",
      autores: "Emmy van Deurzen",
      definicionTextual: "Se centra en «la exploración de la forma particular de ver la vida, el mundo y a sí misma de la persona»",
      fuenteDefinicion: "Van Deurzen, E. (2002). Existential Counselling & Psychotherapy in Practice. SAGE.",
      ontologia: "La existencia se despliega en cuatro dimensiones o «mundos»: Umwelt (físico), Mitwelt (social), Eigenwelt (personal) y Überwelt (espiritual/ideal).",
      epistemologia: "El conocimiento clínico surge de examinar las creencias asumidas y no cuestionadas sobre la existencia, retando sus polaridades y contradicciones.",
      conceptosClave: ["Cuatro dimensiones del mundo relacional", "Sedimentación", "Investigación filosófica dialogal"],
      manual: "Van Deurzen, E., Adams, M. (2011/2016). Skills in Existential Counselling & Psychotherapy. SAGE.",
    },
    {
      nombre: "Método fenomenológico relacional (Spinelli)",
      autores: "Ernesto Spinelli",
      definicionTextual: "El objetivo es «permanecer lo más posible enfocados en las impresiones inmediatas en vez de dirigirnos hacia explicaciones teóricas sobre la experiencia»",
      fuenteDefinicion: "Spinelli, E. (2005). The Interpreted World. SAGE.",
      ontologia: "El mundo relacional se examina en cuatro ámbitos vividos en el aquí y ahora de la sesión: el ámbito «Yo», «Tú», «nosotros» y «Ellos».",
      epistemologia: "El conocimiento se somete a la incertidumbre constante de la vida; ningún saber previo (valores, creencias, conceptos) queda exento de revisión al confrontarse con la experiencia viva.",
      conceptosClave: ["Epoché, descripción y horizontalización", "Cuatro ámbitos de la experiencia relacional"],
      manual: "Spinelli, E. (2007). Practising Existential Psychotherapy: The Relational World. SAGE.",
    },
  ],
  h6: [
    {
      nombre: "Logoterapia clásica",
      autores: "Viktor Frankl",
      definicionTextual: "La intención paradójica es «un procedimiento en donde se invita al paciente a desear precisamente aquello que teme»",
      fuenteDefinicion: "Frankl, V. (1994). Logoterapia y Análisis Existencial. Herder.",
      conceptosClave: ["Intención paradójica", "Derreflexión", "Apelación (psicoterapia apelativa)"],
      manual: "Frankl, V. (1994). Logoterapia y Análisis Existencial. Herder; Guberman, M. y Pérez Soto, E. (2005). Diccionario de logoterapia. Grupo Editorial Lumen.",
    },
    {
      nombre: "Análisis Existencial Personal (Escuela de Viena contemporánea)",
      autores: "Alfried Längle",
      definicionTextual: "El AEP se concibe como el proceso intra e interpersonal por el que la persona se constituye a sí misma al tomar posición ante una situación dada (paráfrasis; el texto de 1993 no está en la biblioteca, véase Längle, 2007).",
      fuenteDefinicion: "Längle, A. (1993); Längle, A. (2007). Análisis existencial: la búsqueda de sentido y una afirmación de la vida.",
      conceptosClave: ["Autodistanciamiento (AD)", "Toma de Posición Personal", "Método de Búsqueda de Sentido"],
      manual: "Längle, S. (2003). Niveles operativos para la aplicación de los métodos analítico-existenciales.",
    },
    {
      nombre: "Logoterapia aplicada",
      autores: "Elisabeth Lukas",
      definicionTextual: "La modificación de actitudes «es una herramienta contra el sufrimiento inevitable», que consiste en sustituir pautas patológicas por otras constructivas",
      fuenteDefinicion: "Lukas, E. (1980/1995). Psicoterapia en dignidad. San Pablo.",
      conceptosClave: ["Modificación de actitudes", "Grupos de derreflexión"],
      manual: "Lukas, E. (1980/1995). Psicoterapia en dignidad. Ed. San Pablo.",
    },
    {
      nombre: "Psicoterapia Centrada en el Sentido / Modelo CAYA (escuela latinoamericana)",
      autores: "Efrén Martínez",
      definicionTextual: "Las huellas de sentido son las razones cotidianas para vivir: momentos pequeños o grandes que llenan la vida de sentido y que el diálogo socrático ayuda a seguir (paráfrasis; el manual de 2009 no está en la biblioteca, véase Martínez Ortiz, 2012).",
      fuenteDefinicion: "Martínez, E. (2009). Buscando el sentido de la vida. Manual del facilitador; Martínez Ortiz, E. (2012). El diálogo socrático en la psicoterapia.",
      conceptosClave: ["Huellas de sentido", "Diálogo socrático (mayéutica logoterapéutica)", "Proyecto de Vida Directo"],
      manual: "Martínez, E. (2009). Buscando el sentido de la vida. Manual del facilitador. Ed. CAA.",
    },
    {
      nombre: "Logoanálisis (aproximación norteamericana)",
      autores: "James C. Crumbaugh",
      definicionTextual: "El logoanálisis es «un proceso y un método para estimular las capacidades creativas de un individuo mediante el pensamiento innovador que analice las propias experiencias vitales»",
      fuenteDefinicion: "Crumbaugh, J. C. (1973), citado en Guttmann, D. (1998). Logoterapia para profesionales. Desclée de Brouwer.",
      conceptosClave: ["Programa de 5 pasos hacia la autoconfianza y la tarea vital"],
      manual: "Guttmann, D. (1998). Logoterapia para profesionales. Desclée de Brouwer.",
    },
  ],
  h10: [
    {
      nombre: "Terapia feminista integradora y multicultural",
      autores: "Laura S. Brown, Oliva Espín, Maria P. P. Root",
      definicionTextual: "«La práctica de la terapia informada por las filosofías y análisis políticos feministas... que conduce tanto a la terapeuta como a la clienta hacia estrategias y soluciones que promueven la resistencia feminista, la transformación y el cambio social»",
      fuenteDefinicion: "Brown, L. S. (1994). Subversive Dialogues: Theory in Feminist Therapy. Basic Books.",
      ontologia: "Ser humano biopsicosocial y espiritual atravesado por la intersección de raza, clase, género y orientación sexual (interseccionalidad).",
      epistemologia: "Los márgenes son un nuevo centro epistémico: la sabiduría clínica reside en las voces silenciadas por la opresión, no en la neutralidad del experto.",
      conceptosClave: ["Subversión", "Empoderamiento en cuatro ejes", "Interseccionalidad"],
      manual: "Brown, L. S. (1994). Subversive Dialogues: Theory in Feminist Therapy. Basic Books.",
    },
    {
      nombre: "Terapia radicalmente feminista",
      autores: "Bonnie Burstow, Mary Daly, Audre Lorde",
      definicionTextual: "«La terapia o consejería feminista es un encuentro o serie de encuentros altamente personales y fundamentalmente políticos entre mujeres. Se basa en la solidaridad entre mujeres»",
      fuenteDefinicion: "Burstow, B. (1992). Radical Feminist Therapy. Sage.",
      ontologia: "El mundo se divide por la violencia estructural del patriarcado sobre las mujeres, con énfasis en la violación material, institucional y médica del cuerpo femenino.",
      epistemologia: "El conocimiento auténtico no reside en los textos, sino que se genera dialógicamente en el encuentro de mujer a mujer; rechaza el positivismo y la neutralidad de la ciencia mental.",
      conceptosClave: ["Solidaridad", "Empatía política", "Guiones (scripts)", "Mujer como cuerpo"],
      manual: "Burstow, B. (1992). Radical Feminist Therapy. Sage.",
    },
  ],
};

/* ============================================================
   PROCEDIMIENTOS CLÍNICOS SISTEMATIZADOS (Módulo 1 y 2)
   Distintos de PROTOCOLOS_SEED: son secuencias de «momentos» o
   actitudes terapéuticas documentadas en manuales y capítulos
   clínicos, pero sin validación por ensayo clínico aleatorizado.
   ============================================================ */
const PROCEDIMIENTOS_CLINICOS = {}; // se rellena al cargar src/datos/protocolos.js

// Los protocolos y procedimientos (~490 KB) viven en su propio archivo y se cargan tras el primer pintado:
// los objetos se rellenan en el sitio, de modo que el resto del código los sigue leyendo igual.
let _promesaProtocolos = null;
function cargarProtocolos() {
  if (!_promesaProtocolos) {
    _promesaProtocolos = import("./datos/protocolos.js").then((m) => {
      Object.assign(PROTOCOLOS_SEED, m.PROTOCOLOS_SEED);
      Object.assign(PROCEDIMIENTOS_CLINICOS, m.PROCEDIMIENTOS_CLINICOS);
    });
  }
  return _promesaProtocolos;
}
const protocolosCargados = () => Object.keys(PROTOCOLOS_SEED).length > 0;


const NOTA_SIN_PROTOCOLO =
  "En la bibliografía revisada no se identificó un manual estandarizado, con fases o sesiones definidas, para esta escuela. En varios casos (p. ej., Centrada en Soluciones, Narrativa, existencial británica) la ausencia de protocolización es una posición epistemológica deliberada, no una laguna. Sus procedimientos puntuales figuran como técnicas, no como protocolos.";

// Notas verificadas sobre por qué una escuela no tiene protocolo propio (solo donde la fuente lo dice).
const SIN_PROTOCOLO_NOTAS = {
  i5: "Beutler y Harwood (2000, pp. v–vii) advierten que su guía no es un manual como los demás: trabaja con principios empíricos transferibles entre teorías y deja que el terapeuta elija las técnicas, que presenta solo como ejemplos.",
};


/* ============================================================
   CONCEPTOS TRANSVERSALES (Módulo 3 — eje de organización)
   Ocho nudos conceptuales que atraviesan las cinco perspectivas.
   Para cada uno se ofrece el término propio y la definición nativa
   de cada perspectiva (con su escuela de referencia), de modo que
   la comparación no borre las diferencias de fundamento.
   ============================================================ */
const ENLACES_TECNICAS_SEED = [
  {
    id: "t1",
    conceptoA: { escuela: "h1", nombre: "Empatía" },
    conceptoB: { escuela: "p4", nombre: "Metacomunicación" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas hacen explícito y comprensible el estado interno del paciente dentro de la relación, pero la empatía rogeriana es una actitud continua de comprensión del marco interno del cliente; la metacomunicación relacional es un acto puntual de hablar sobre lo que ocurre en la relación misma.",
  },
  {
    id: "t2",
    conceptoA: { escuela: "h1", nombre: "Reflejo" },
    conceptoB: { escuela: "c3", nombre: "Registro de pensamientos" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas hacen consciente algo no verbalizado, pero el reflejo es una intervención del terapeuta en el momento mismo de la sesión; el registro de pensamientos es una tarea escrita que el propio paciente realiza entre sesiones sobre sus pensamientos automáticos.",
  },
  {
    id: "t3",
    conceptoA: { escuela: "h2", nombre: "Tres cosas buenas" },
    conceptoB: { escuela: "c15", nombre: "Economía de fichas" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas son tareas estructuradas y repetibles, pero las tres cosas buenas entrenan la atención hacia lo positivo sin ninguna consecuencia contingente externa; la economía de fichas administra reforzadores externos contingentes a conductas específicas.",
  },
  {
    id: "t4",
    conceptoA: { escuela: "h2", nombre: "Indagación apreciativa" },
    conceptoB: { escuela: "s4", nombre: "Connotación positiva" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas redefinen una situación resaltando lo que funciona, pero la indagación apreciativa es un método de intervención grupal centrado en amplificar fortalezas; la connotación positiva redefine el síntoma mismo como un intento de cuidar la cohesión familiar.",
  },
  {
    id: "t5",
    conceptoA: { escuela: "h3", nombre: "Silla vacía" },
    conceptoB: { escuela: "p8", nombre: "Imaginación activa" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas dan voz dramatizada a contenidos internos no integrados, pero la silla vacía dramatiza un diálogo en el aquí y ahora de la sesión; la imaginación activa es un diálogo consciente con imágenes del inconsciente, sin puesta en escena física.",
  },
  {
    id: "t6",
    conceptoA: { escuela: "h3", nombre: "Experimento" },
    conceptoB: { escuela: "c4", nombre: "Desesperanza creativa" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas proponen que el cliente actúe en vivo en vez de solo hablar, pero el experimento gestáltico es abierto y puede tomar cualquier forma dramática; la desesperanza creativa tiene un objetivo específico —constatar el fracaso del control— dentro de una secuencia protocolizada.",
  },
  {
    id: "t7",
    conceptoA: { escuela: "h4", nombre: "El aquí y ahora" },
    conceptoB: { escuela: "s4", nombre: "Preguntas circulares" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas trabajan con el material presente de la sesión, pero el aquí y ahora explora la experiencia inmediata del individuo frente al terapeuta; las preguntas circulares exploran relaciones entre terceros ausentes, con foco relacional-familiar, no individual-fenomenológico.",
  },
  {
    id: "t8",
    conceptoA: { escuela: "h4", nombre: "Trabajo con sueños" },
    conceptoB: { escuela: "p1", nombre: "Interpretación" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas trabajan el material onírico, pero el trabajo con sueños existencial busca la preocupación existencial actual expresada en el sueño; la interpretación freudiana busca el deseo inconsciente reprimido tras el contenido manifiesto.",
  },
  {
    id: "t9",
    conceptoA: { escuela: "h5", nombre: "Mapeo de las dimensiones" },
    conceptoB: { escuela: "i2", nombre: "Perfil de modalidad" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas evalúan sistemáticamente varios planos de la experiencia, pero el mapeo de las dimensiones explora las cuatro dimensiones ontológicas universales de la existencia; el perfil de modalidad evalúa siete modalidades como instrumento clínico, sin compromiso ontológico.",
  },
  {
    id: "t10",
    conceptoA: { escuela: "h5", nombre: "Clarificación de valores" },
    conceptoB: { escuela: "i1", nombre: "Rationale y ritual" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas explicitan un marco de referencia para el paciente, pero la clarificación de valores ayuda al cliente a identificar sus propios valores sin dirigirlos; el rationale y ritual es una explicación del terapeuta sobre el problema y el tratamiento, más directiva.",
  },
  {
    id: "t11",
    conceptoA: { escuela: "h6", nombre: "Intención paradójica" },
    conceptoB: { escuela: "s3", nombre: "Giro de 180°" },
    relacion: "equivalente aproximado",
    fidelidad: "media",
    nota:
      "Ambas invierten deliberadamente la relación del cliente con su síntoma, pero la intención paradójica opera a nivel individual y noético; el giro de 180° estratégico opera a nivel de la interacción familiar completa.",
  },
  {
    id: "t12",
    conceptoA: { escuela: "h6", nombre: "Derreflexión" },
    conceptoB: { escuela: "c4", nombre: "Defusión" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas redirigen la atención lejos de la lucha directa con el síntoma, pero la derreflexión redirige la atención hacia el sentido y las tareas externas; la defusión cambia la relación con el pensamiento mismo sin necesidad de un sentido externo.",
  },
  {
    id: "t13",
    conceptoA: { escuela: "h7", nombre: "OARS" },
    conceptoB: { escuela: "p2", nombre: "Intervenciones de apoyo" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas son conjuntos de microhabilidades del terapeuta, pero OARS busca evocar el propio discurso de cambio del cliente ambivalente; las intervenciones de apoyo buscan fortalecer un yo debilitado mediante tranquilización, sin ese objetivo evocador.",
  },
  {
    id: "t14",
    conceptoA: { escuela: "h7", nombre: "Evocar" },
    conceptoB: { escuela: "c6", nombre: "Las cinco reglas (observar, evocar, reforzar, verificar, generalizar)" },
    relacion: "falso amigo",
    fidelidad: "media",
    nota:
      "Comparten la palabra «evocar»: en MI es provocar que el cliente articule sus propias razones de cambio; en FAP es generar condiciones para que aparezca una conducta clínicamente relevante ya identificada, dentro de una secuencia técnica más amplia.",
  },
  {
    id: "t15",
    conceptoA: { escuela: "p1", nombre: "Asociación libre" },
    conceptoB: { escuela: "s6", nombre: "Conversaciones de externalización" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas generan material verbal amplio, pero la asociación libre no tiene estructura ni dirección impuesta; las conversaciones de externalización siguen una estructura conversacional deliberada que separa a la persona de su problema.",
  },
  {
    id: "t16",
    conceptoA: { escuela: "p2", nombre: "Análisis de las defensas" },
    conceptoB: { escuela: "c3", nombre: "Flecha descendente" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas descienden de lo superficial a lo profundo, pero el análisis de las defensas identifica la operación defensiva antes que el contenido oculto; la flecha descendente desciende mediante preguntas sucesivas hasta la creencia nuclear.",
  },
  {
    id: "t17",
    conceptoA: { escuela: "p3", nombre: "Análisis de la contratransferencia" },
    conceptoB: { escuela: "c5", nombre: "Análisis en cadena" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambos son procedimientos analíticos retrospectivos, pero el análisis de la contratransferencia examina las reacciones del propio terapeuta; el análisis en cadena reconstruye los eventos del paciente que condujeron a una conducta-problema.",
  },
  {
    id: "t18",
    conceptoA: { escuela: "p3", nombre: "Contención" },
    conceptoB: { escuela: "s1", nombre: "Destriangulación" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas regulan una intensidad emocional excesiva, pero la contención metaboliza internamente un estado emocional insoportable del paciente; la destriangulación es una maniobra relacional para que un miembro se retire de un triángulo familiar.",
  },
  {
    id: "t19",
    conceptoA: { escuela: "p4", nombre: "Autorrevelación juiciosa" },
    conceptoB: { escuela: "i1", nombre: "Reencuadre y reparación de la alianza" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas intervienen sobre la relación terapéutica cuando surge una dificultad, pero la autorrevelación comparte contenido propio del terapeuta; la reparación de la alianza usa reencuadre y negociación explícita, sin necesariamente revelar contenido personal.",
  },
  {
    id: "t20",
    conceptoA: { escuela: "p5", nombre: "Formulación del CCRT" },
    conceptoB: { escuela: "i3", nombre: "Emparejar proceso y etapa" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas requieren una evaluación inicial que organiza la intervención, pero el CCRT identifica un patrón relacional nuclear de contenido biográfico; emparejar proceso y etapa identifica la fase de disposición al cambio, sin contenido relacional biográfico.",
  },
  {
    id: "t21",
    conceptoA: { escuela: "p5", nombre: "Límite temporal" },
    conceptoB: { escuela: "i3", nombre: "Prevención de recaídas" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas anticipan el fin o la continuidad del proceso, pero el límite temporal fija de antemano la duración total como material clínico; la prevención de recaídas anticipa riesgos después de que el cambio ya ocurrió.",
  },
  {
    id: "t22",
    conceptoA: { escuela: "p6", nombre: "Escansión" },
    conceptoB: { escuela: "h4", nombre: "El aquí y ahora" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas puntúan el momento presente de un modo poco convencional, pero la escansión interrumpe la sesión misma para dar peso a un significante; el aquí y ahora explora la experiencia inmediata sin interrumpir la duración convencional de la sesión.",
  },
  {
    id: "t23",
    conceptoA: { escuela: "p6", nombre: "Rechazo de la demanda" },
    conceptoB: { escuela: "s2", nombre: "Escenificación" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas alteran el formato esperado de la interacción, pero el rechazo de la demanda no satisface el pedido explícito del paciente para hacer emerger su deseo; la escenificación pide representar en vivo la interacción problemática, sin negar una demanda.",
  },
  {
    id: "t24",
    conceptoA: { escuela: "p7", nombre: "Actuar «como si»" },
    conceptoB: { escuela: "h3", nombre: "Experimento" },
    relacion: "equivalente aproximado",
    fidelidad: "media",
    nota:
      "Ambas invitan a ensayar en vivo una conducta nueva, pero actuar «como si» es una tarea conductual específica de ensayar la cualidad deseada; el experimento gestáltico es una categoría más amplia y abierta de acción dramatizada.",
  },
  {
    id: "t25",
    conceptoA: { escuela: "p7", nombre: "«La pregunta»" },
    conceptoB: { escuela: "s5", nombre: "Pregunta del milagro" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas usan una pregunta hipotética, pero «la pregunta» distingue un problema orgánico de uno psicológico preguntando qué cambiaría sin el síntoma; la pregunta del milagro construye directamente el objetivo del tratamiento, sin el fin diagnóstico diferencial.",
  },
  {
    id: "t26",
    conceptoA: { escuela: "p8", nombre: "Amplificación" },
    conceptoB: { escuela: "c2", nombre: "Imaginería racional-emotiva" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas usan material simbólico o imaginado, pero la amplificación relaciona el símbolo con paralelos mitológicos y culturales; la imaginería racional-emotiva practica sentir una emoción alternativa ante una situación imaginada, sin relación con mitología.",
  },
  {
    id: "t27",
    conceptoA: { escuela: "s1", nombre: "Genograma" },
    conceptoB: { escuela: "h5", nombre: "Mapeo de las dimensiones" },
    relacion: "análogo funcional",
    fidelidad: "baja",
    nota:
      "Ambos son instrumentos de evaluación estructurada al inicio del proceso, pero el genograma representa generaciones familiares y patrones emocionales; el mapeo de las dimensiones explora las cuatro dimensiones existenciales de un individuo.",
  },
  {
    id: "t28",
    conceptoA: { escuela: "s2", nombre: "Joining (acomodación)" },
    conceptoB: { escuela: "h1", nombre: "Empatía" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas son posturas relacionales de acomodación al otro, pero el joining es una acomodación estratégica y deliberada como condición técnica para reestructurar; la empatía es una actitud genuina sostenida durante toda la terapia, no solo una fase técnica inicial.",
  },
  {
    id: "t29",
    conceptoA: { escuela: "s3", nombre: "Reencuadre" },
    conceptoB: { escuela: "c2", nombre: "Debate (disputa) racional" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota:
      "Ambas cambian el significado atribuido a una situación, pero el reencuadre opera sobre la función del síntoma en el sistema relacional; el debate racional opera sobre la validez lógica de una creencia individual, sin relación con la función relacional.",
  },
  {
    id: "t30",
    conceptoA: { escuela: "s4", nombre: "Preguntas circulares" },
    conceptoB: { escuela: "c3", nombre: "Flecha descendente" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas son secuencias de preguntas dirigidas, pero las preguntas circulares exploran relaciones entre terceros dentro de un sistema; la flecha descendente desciende dentro de la cognición de un solo individuo, sin relación con terceros.",
  },
  {
    id: "t31",
    conceptoA: { escuela: "s5", nombre: "Preguntas de escala" },
    conceptoB: { escuela: "c5", nombre: "DEAR MAN" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas son herramientas breves estructuradas, pero las preguntas de escala cuantifican subjetivamente el progreso hacia una meta; DEAR MAN es una secuencia de habilidades de comunicación asertiva, sin relación con cuantificar el progreso terapéutico.",
  },
  {
    id: "e255",
    clusterId: "motivacion",
    conceptoA: { escuela: "s5", nombre: "Posiciones del cliente (visitante, quejoso, comprador)" },
    conceptoB: { escuela: "h7", nombre: "Modelo Transteórico del Cambio (etapas de preparación)" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota: "Ambos clasifican el grado de disposición del consultante hacia el cambio para ajustar la intervención, pero desde arquitecturas distintas: la tipología de de Shazer y Berg describe una relación conversacional con la demanda de terapia (¿quién define el problema y quién tiene el control sobre resolverlo?), sin pretensión de mapear un proceso intrapsíquico secuencial; el Modelo Transteórico de Prochaska y DiClemente —que la EM adopta— postula estadios universales y ordenados (precontemplación, contemplación, preparación, acción, mantenimiento) con base empírica propia. Tratarlos como sinónimos ocultaría que la posición del cliente en TBCS puede oscilar sesión a sesión sin implicar una progresión estructurada.",
  },
  {
    id: "e256",
    clusterId: "lenguaje_narrativa",
    conceptoA: { escuela: "s6", nombre: "Lo ausente pero implícito (doble escucha)" },
    conceptoB: { escuela: "h9", nombre: "Sensación sentida (felt sense)" },
    relacion: "análogo funcional",
    fidelidad: "baja",
    nota: "Ambas técnicas parten de la premisa de que hay algo relevante no dicho explícitamente que el terapeuta debe ayudar a hacer emergente. Pero su naturaleza es distinta en un punto decisivo: lo ausente pero implícito de White es un contenido discursivo y moral —un valor o compromiso de vida transgredido, recuperable mediante preguntas deconstructivas sobre el lenguaje del relato—, mientras que la sensación sentida de Gendlin es un referente corporal preverbal, accesible por atención directa al cuerpo, no por análisis del discurso. Es una analogía funcional en el gesto clínico (atender a lo no dicho), no una equivalencia de mecanismo ni de sustrato (uno es lingüístico-narrativo, el otro somático-experiencial); no debe leerse como que White proponga un acceso corporal al problema.",
  },
  {
    id: "e257",
    clusterId: "resistencia",
    conceptoA: { escuela: "s4", nombre: "Prescripción Invariable" },
    conceptoB: { escuela: "s2", nombre: "Reestructuración de límites (boundary making)" },
    relacion: "análogo funcional",
    fidelidad: "media",
    nota: "Ambas técnicas persiguen fortalecer la frontera del subsistema parental frente a una coalición intergeneracional encubierta, y ambas provienen de la primera cibernética. Pero difieren en mecanismo: la Prescripción Invariable de Selvini Palazzoli opera de forma indirecta y ritualizada —salidas secretas de los padres sin explicación a los hijos, cuyo efecto depende de la opacidad del encuadre—, mientras que la reestructuración de límites de Minuchin es una intervención directa y en vivo dentro de la sesión (escenificación, desequilibramiento) que el terapeuta dirige abiertamente como experto. No es una relación de fundamento —Milán no deriva esta técnica de Minuchin— sino una convergencia funcional entre dos linajes de la primera cibernética que llegaron a un objetivo estructural similar por vías clínicas opuestas (secreto ritual vs. transparencia directiva).",
  },
  {
    id: "t32",
    conceptoA: { escuela: "s6", nombre: "Documentos terapéuticos" },
    conceptoB: { escuela: "h2", nombre: "Tres cosas buenas" },
    relacion: "falso amigo",
    fidelidad: "baja",
    nota:
      "Ambas dejan un registro entre sesiones, pero los documentos terapéuticos son cartas o certificados que consolidan un cambio de identidad ya logrado; el ejercicio de tres cosas buenas es una tarea diaria de entrenamiento atencional, no de consolidación identitaria.",
  },
  {
    id: "t33",
    conceptoA: { escuela: "c1", nombre: "Desensibilización sistemática" },
    conceptoB: { escuela: "s3", nombre: "Giro de 180°" },
    relacion: "análogo funcional",
    fidelidad: "baja",
    nota:
      "Ambas son procedimientos técnicos estructurados con pasos secuenciales, pero la desensibilización empareja relajación con una jerarquía gradual de estímulos; el giro de 180° invierte la solución intentada por la familia, sin jerarquía graduada de exposición.",
  },
  {
    id: "t34",
    conceptoA: { escuela: "i2", nombre: "Puenteo (bridging)" },
    conceptoB: { escuela: "h3", nombre: "Silla vacía" },
    relacion: "análogo funcional",
    fidelidad: "baja",
    nota:
      "Ambas usan un punto de entrada antes de abordar el núcleo del problema, pero el puenteo entra por la modalidad preferida del cliente antes de moverse a la modalidad que requiere intervención; la silla vacía entra directamente por la dramatización emocional.",
  },
  {
    id: "t35",
    conceptoA: { escuela: "i4", nombre: "Asimilar técnicas (silla vacía, exposición, mindfulness) resignificadas en el marco anfitrión" },
    conceptoB: { escuela: "h3", nombre: "Silla vacía" },
    relacion: "reinterpretación asimilativa",
    fidelidad: "alta",
    nota:
      "Esta técnica integradora consiste precisamente en tomar prestada la silla vacía gestáltica y resignificarla dentro de una teoría anfitriona distinta —por ejemplo, leerla en clave psicodinámica como puesta en escena de un objeto interno—, cambiando su fundamento sin cambiar su forma externa.",
  },
];

const STORAGE_KEY = "psicoterapias:datos-v1";

async function cargarDatos() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* clave inexistente o corrupta: usar semilla */
  }
  return null;
}

async function guardarDatos(datos) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    return true;
  } catch (e) {
    console.error("No se pudo guardar:", e);
    return false;
  }
}

/* ============================================================
   GLOSARIO CLICABLE DE CONCEPTOS Y TÉCNICAS (Módulo 1)
   Definiciones parafraseadas de las obras más reconocidas para
   cada concepto/técnica, no limitadas al Excel de origen.
   Clave de búsqueda: escuela + término (con reintento por término
   solo, para técnicas compartidas entre escuelas).
   Cobertura: primera tanda curada (2-3 términos por escuela,
   priorizando los de mayor centralidad); el resto muestra un
   estado de "verificación pendiente" en vez de una definición
   de baja calidad. Se amplía por iteraciones.
   ============================================================ */
function distanciaLevenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let fila = Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) fila[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let anterior = fila[0];
    fila[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = fila[j];
      fila[j] = a[i - 1] === b[j - 1] ? anterior : 1 + Math.min(anterior, fila[j], fila[j - 1]);
      anterior = temp;
    }
  }
  return fila[b.length];
}

// Dado un término buscado y una lista de candidatos (strings), devuelve
// hasta `max` sugerencias ordenadas por cercanía, solo si la distancia
// relativa es razonable (< 40% de la longitud del término más largo) —
// evita sugerir algo completamente distinto solo porque técnicamente
// tiene la distancia de edición más baja de una lista.
function sugerirTerminos(query, candidatos, max = 3) {
  const q = normalizarTermino(query);
  if (q.length < 3) return [];
  const palabrasQ = q.split(/\s+/).filter(Boolean);
  const candidatosUnicos = [...new Set(candidatos)].filter((c) => c && normalizarTermino(c) !== q);
  const puntuados = candidatosUnicos
    .map((c) => {
      const cNorm = normalizarTermino(c);
      const palabrasC = cNorm.split(/\s+/).filter(Boolean);
      // Compara: (a) frase completa contra frase completa, y (b) cada
      // palabra de la búsqueda contra cada palabra del candidato — así
      // "difusión" encuentra "Defusión cognitiva" por la palabra
      // "defusión" aunque el resto de la frase no se parezca, sin el bug
      // de comparar una frase larga contra una sola palabra corta (lo
      // que antes inflaba la distancia artificialmente).
      const distCompleta = distanciaLevenshtein(q, cNorm);
      let distMejorPalabra = Infinity;
      let baseMejorPalabra = 1;
      for (const pq of palabrasQ) {
        for (const pc of palabrasC) {
          const d = distanciaLevenshtein(pq, pc);
          if (d < distMejorPalabra) {
            distMejorPalabra = d;
            baseMejorPalabra = Math.max(pq.length, pc.length);
          }
        }
      }
      const baseCompleta = Math.max(q.length, cNorm.length);
      const ratioCompleta = distCompleta / Math.max(baseCompleta, 1);
      const ratioPalabra = distMejorPalabra / Math.max(baseMejorPalabra, 1);
      const usaPalabra = ratioPalabra < ratioCompleta;
      return { c, dist: usaPalabra ? distMejorPalabra : distCompleta, ratio: usaPalabra ? ratioPalabra : ratioCompleta };
    })
    .filter((x) => x.dist > 0 && x.dist <= 3 && x.ratio < 0.45)
    .sort((a, b) => a.ratio - b.ratio || a.c.length - b.c.length);
  const vistos = new Set();
  const resultado = [];
  for (const p of puntuados) {
    if (vistos.has(p.c)) continue;
    vistos.add(p.c);
    resultado.push(p.c);
    if (resultado.length >= max) break;
  }
  return resultado;
}

// Trunca un texto respetando el sentido: busca el último punto, punto y
// coma, o coma antes del límite objetivo (dentro de un margen razonable)
// para que el fragmento termine en una unidad de sentido completa, no a
// mitad de palabra o de cláusula. Si no encuentra ningún límite natural
// cercano, cae a un corte por palabra completa como respaldo.
function truncarConSentido(texto, objetivo = 160, margen = 60) {
  if (!texto) return "";
  if (texto.length <= objetivo) return texto;
  const ventana = texto.slice(0, objetivo + margen);
  const cortes = [".", ";", ":"];
  let mejorCorte = -1;
  for (const c of cortes) {
    const idx = ventana.lastIndexOf(c);
    if (idx > objetivo - margen && idx > mejorCorte) mejorCorte = idx;
  }
  if (mejorCorte > 0) return texto.slice(0, mejorCorte + 1);
  // Sin puntuación cercana: corta en la última coma o, si tampoco hay,
  // en el último espacio antes del objetivo, para no partir una palabra.
  const idxComa = ventana.lastIndexOf(",");
  if (idxComa > objetivo - margen) return texto.slice(0, idxComa) + "…";
  const idxEspacio = texto.slice(0, objetivo).lastIndexOf(" ");
  return texto.slice(0, idxEspacio > 0 ? idxEspacio : objetivo) + "…";
}

function normalizarTermino(t) {
  return (t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[«»""]/g, "")
    .replace(/\(.*?\)/g, "")
    .trim();
}

function coincideConcepto(entrada, escuelaId, termino) {
  const tNorm = normalizarTermino(termino);
  if (entrada.escuela !== escuelaId) return false;
  const eNorm = normalizarTermino(entrada.nombre);
  if (eNorm === tNorm) return true;
  // La coincidencia por substring (includes) es un riesgo real de
  // precisión con términos cortos: "Yo" o "Self" podrían "coincidir"
  // dentro de nombres de conceptos que no tienen relación real. Se exige
  // un mínimo de 4 caracteres en el término más corto de los dos antes
  // de aceptar una coincidencia parcial, y además que empiece o termine
  // en un límite de palabra (no en medio de otra palabra).
  const masCorto = eNorm.length <= tNorm.length ? eNorm : tNorm;
  const masLargo = eNorm.length <= tNorm.length ? tNorm : eNorm;
  if (masCorto.length < 4) return false;
  const idx = masLargo.indexOf(masCorto);
  if (idx === -1) return false;
  const antes = idx === 0 || masLargo[idx - 1] === " ";
  const despues = idx + masCorto.length === masLargo.length || masLargo[idx + masCorto.length] === " ";
  return antes && despues;
}

function enlacesDeConcepto(enlaces, escuelaId, termino) {
  return enlaces.filter((l) => coincideConcepto(l.conceptoA, escuelaId, termino) || coincideConcepto(l.conceptoB, escuelaId, termino));
}

function buscarEnGlosario(escuelaId, termino) {
  const tNorm = normalizarTermino(termino);
  // 1. coincidencia exacta dentro de la misma escuela
  let hit = GLOSARIO.find((g) => g.escuela === escuelaId && normalizarTermino(g.termino) === tNorm);
  if (hit) return hit;
  // 2. coincidencia parcial dentro de la misma escuela
  hit = GLOSARIO.find(
    (g) => g.escuela === escuelaId && (normalizarTermino(g.termino).includes(tNorm) || tNorm.includes(normalizarTermino(g.termino)))
  );
  if (hit) return hit;
  // 3. coincidencia exacta en cualquier escuela (términos/técnicas compartidas)
  hit = GLOSARIO.find((g) => normalizarTermino(g.termino) === tNorm);
  if (hit) return hit;
  // 4. coincidencia parcial en cualquier escuela
  hit = GLOSARIO.find((g) => normalizarTermino(g.termino).includes(tNorm) || tNorm.includes(normalizarTermino(g.termino)));
  return hit || null;
}

const PERSPECTIVA_ID_POR_NOMBRE = {
  "Humanista-existencial": "humanista",
  "Psicodinámica": "psicodinamica",
  "Sistémica": "sistemica",
  "Conductual": "conductual",
  "Cognitivo-Conductual": "cognitivo",
  "Integradora": "integradora",
  "Transpersonal": "transpersonal",
};

/* ============================================================
   COMPONENTES DE INTERFAZ
   ============================================================ */

function Sello({ children, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "var(--f-display)",
        fontStyle: "italic",
        fontSize: 11,
        letterSpacing: "0.03em",
        color: color,
        border: `1px solid ${color}`,
        borderRadius: 6,
        padding: "1px 8px",
        transform: "rotate(-1.5deg)",
        background: COLORS.cardBg,
      }}
    >
      {children}
    </span>
  );
}

/* Sello estampado con el criterio de verdad de la escuela (recomendación
   estética: "ver de un vistazo" la epistemología, no solo la perspectiva). */
function SelloCriterio({ texto }) {
  const c = clasificarCriterioVerdad(texto);
  return (
    <span
      title={c.label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: 9.5,
        letterSpacing: "0.04em",
        color: COLORS.onAcento,
        background: c.color,
        borderRadius: 6,
        padding: "2px 7px",
        transform: "rotate(1.2deg)",
        boxShadow: "1px 1px 0 rgba(30,42,40,0.15)",
      }}
    >
      <Stamp size={10} /> {c.abrev}
    </span>
  );
}

/* Indicador de cuántos enlaces traslacionales tiene una escuela — antes
   solo se veía este número al entrar al Diccionario y buscar manualmente;
   ahora es visible directamente en la cabecera de la ficha (y, más abajo,
   también en el listado de escuelas dentro de cada perspectiva), como
   señal rápida de qué tan conectada está esa escuela en el diccionario
   metateórico. 0 enlaces se marca con un tono distinto (sin alarmismo:
   simplemente todavía no se ha trazado ningún puente para esa escuela). */
function BadgeEnlaces({ escuelaId, enlaces, onIrADiccionario, small }) {
  const n = (enlaces || []).filter((l) => l.conceptoA?.escuela === escuelaId || l.conceptoB?.escuela === escuelaId).length;
  const vacio = n === 0;
  return (
    <span
      role={onIrADiccionario ? "button" : undefined}
      tabIndex={onIrADiccionario ? 0 : undefined}
      onClick={onIrADiccionario ? () => onIrADiccionario(escuelaId, null) : undefined}
      onKeyDown={onIrADiccionario ? activarConTeclado(() => onIrADiccionario(escuelaId, null)) : undefined}
      title={vacio ? "Sin enlaces traslacionales registrados todavía" : `${n} enlace(s) traslacional(es) — clic para verlos en el Diccionario`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: small ? 8.5 : 9.5,
        color: vacio ? COLORS.inkSoft : COLORS.onAcento,
        background: vacio ? "transparent" : COLORS.primary,
        border: vacio ? `1px dashed ${COLORS.line}` : "none",
        borderRadius: 10,
        padding: small ? "1px 6px" : "2px 8px",
        cursor: onIrADiccionario ? "pointer" : "default",
      }}
    >
      <Network size={small ? 8 : 9.5} /> {n}
    </span>
  );
}

/* Barra de fidelidad para los enlaces del diccionario traslacional
   (alta/media/baja → longitud proporcional, con el color de la relación). */
function BarraFidelidad({ nivel, color }) {
  const valor = { completa: 1, alta: 0.85, media: 0.62, baja: 0.32 }[nivel] ?? 0.5;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 46, height: 5, borderRadius: 6, background: COLORS.line, overflow: "hidden", display: "inline-block" }}>
        <span style={{ display: "block", height: "100%", width: `${valor * 100}%`, background: color || COLORS.primary, borderRadius: 3 }} />
      </span>
      <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft }}>{nivel}</span>
    </span>
  );
}

function Etiqueta({ children }) {
  return (
    <span
      style={{
        fontFamily: "var(--f-mono)",
        fontSize: 10.5,
        color: COLORS.inkSoft,
        background: COLORS.paperDark,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 8,
        padding: "2px 6px",
        marginRight: 6,
        marginBottom: 6,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function EtiquetaDefinible({ termino, escuelaId, tipo, onAbrir, color, icono, contador }) {
  return (
    <span
      onClick={() => onAbrir(escuelaId, termino, tipo)}
      title={icono === "→" ? "Ver en el diccionario traslacional" : "Ver definición"}
      style={{
        fontFamily: "var(--f-mono)",
        fontSize: 10.5,
        color: color || COLORS.ink,
        background: COLORS.cardBg,
        border: `1px solid ${color || COLORS.primary}`,
        borderRadius: 8,
        padding: "2px 6px",
        marginRight: 6,
        marginBottom: 6,
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        cursor: "pointer",
      }}
    >
      {termino}
      {typeof contador === "number" && contador > 0 && (
        <span style={{ fontSize: 8.5, background: COLORS.garnet, color: COLORS.onAcento, borderRadius: 14, padding: "0 4px" }}>{contador}</span>
      )}
      <span style={{ fontSize: 9, opacity: 0.7 }}>{icono || "ⓘ"}</span>
    </span>
  );
}

function PanelHistorial({ historial, onCerrar }) {
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const tipos = ["todos", ...new Set(historial.map((h) => h.tipo))];
  const visibles = filtroTipo === "todos" ? historial : historial.filter((h) => h.tipo === filtroTipo);
  const colorAccion = { creado: COLORS.sage, editado: COLORS.gold, eliminado: COLORS.garnet };

  return (
    <div
      onClick={onCerrar}
      style={{ position: "fixed", inset: 0, background: "rgba(30,42,40,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="psq-modal"
        style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 14, maxWidth: 640, width: "100%", maxHeight: "80vh", overflowY: "auto", padding: 24, position: "relative", boxShadow: "0 10px 40px rgba(0,0,0,0.25)" }}
      >
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: COLORS.inkSoft,
          }}
          onMouseEnter={(ev) => {
            ev.currentTarget.style.background = COLORS.paperDark;
            ev.currentTarget.style.color = COLORS.ink;
          }}
          onMouseLeave={(ev) => {
            ev.currentTarget.style.background = "transparent";
            ev.currentTarget.style.color = COLORS.inkSoft;
          }}
        >
          <X size={17} />
        </button>
        <h3 style={{ fontFamily: "var(--f-display)", fontSize: 19, margin: "0 0 4px" }}>Historial de ediciones</h3>
        <p style={{ fontSize: 12, color: COLORS.inkSoft, margin: "0 0 14px", fontFamily: "var(--f-text)" }}>
          Registro automático de creaciones, ediciones y eliminaciones en esta sesión de la aplicación, detectado por comparación de cada guardado con el anterior.
        </p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {tipos.map((t) => (
            <Boton key={t} small variant={filtroTipo === t ? "default" : "ghost"} onClick={() => setFiltroTipo(t)}>
              {t}
            </Boton>
          ))}
        </div>

        {visibles.length === 0 ? (
          <VacioAviso texto="Aún no se ha registrado ningún cambio en esta sesión." />
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {visibles.map((h, i) => (
              <div key={i} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderLeft: `3px solid ${colorAccion[h.accion] || COLORS.primary}`, borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", color: colorAccion[h.accion] || COLORS.primary, fontWeight: 700 }}>
                    {h.accion}
                  </span>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.inkSoft }}>{h.tipo}</span>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.inkSoft, marginLeft: "auto" }}>
                    {new Date(h.ts).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div style={{ fontFamily: "var(--f-text)", fontSize: 13, color: COLORS.ink, marginTop: 2 }}>{h.nombre}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ModalDefinicion({ dato, onCerrar, onIrAProtocolo, onIrAEscuela }) {
  if (!dato) return null;
  const { termino, tipo, encontrado, escuelaId } = dato;
  const tieneProtocolo = escuelaId && ((PROCEDIMIENTOS_CLINICOS[escuelaId] && PROCEDIMIENTOS_CLINICOS[escuelaId].length > 0) || PROTOCOLOS_SEED[escuelaId]);
  return (
    <div
      onClick={onCerrar}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,42,40,0.55)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="psq-modal"
        style={{
          background: COLORS.paper,
          border: `1px solid ${COLORS.line}`,
          borderRadius: 14,
          maxWidth: 620,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: 24,
          position: "relative",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}
      >
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: COLORS.inkSoft,
          }}
          onMouseEnter={(ev) => {
            ev.currentTarget.style.background = COLORS.paperDark;
            ev.currentTarget.style.color = COLORS.ink;
          }}
          onMouseLeave={(ev) => {
            ev.currentTarget.style.background = "transparent";
            ev.currentTarget.style.color = COLORS.inkSoft;
          }}
        >
          <X size={17} />
        </button>
        <Sello color={tipo === "técnica" ? COLORS.clay : COLORS.primary}>{tipo || "término"}</Sello>
        <h3 style={{ fontFamily: "var(--f-display)", fontSize: 19, margin: "10px 0 14px" }}>{termino}</h3>
        {encontrado ? (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", color: COLORS.primary, marginBottom: 3 }}>Definición</div>
              <p style={{ fontFamily: "var(--f-text)", fontSize: 14.5, lineHeight: 1.6, color: COLORS.ink, margin: 0 }}>{dato.definicion}</p>
            </div>
            {dato.funcion && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", color: COLORS.sage, marginBottom: 3 }}>Función</div>
                <p style={{ fontFamily: "var(--f-text)", fontSize: 14, lineHeight: 1.6, color: COLORS.ink, margin: 0 }}>{dato.funcion}</p>
              </div>
            )}
            {dato.contextos && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", color: COLORS.garnet, marginBottom: 3 }}>Contextos / dificultades</div>
                <p style={{ fontFamily: "var(--f-text)", fontSize: 14, lineHeight: 1.6, color: COLORS.ink, margin: 0 }}>{dato.contextos}</p>
              </div>
            )}
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: COLORS.inkSoft, borderTop: `1px dashed ${COLORS.line}`, paddingTop: 10 }}>
              — <Fuente texto={dato.fuente} />
            </div>
            {escuelaId && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.line}` }}>
                {onIrAEscuela && (
                  <Boton small variant="ghost" onClick={() => { onIrAEscuela(escuelaId); onCerrar(); }}>
                    → ver ficha de la escuela
                  </Boton>
                )}
                {tieneProtocolo && onIrAProtocolo && (
                  <Boton small variant="ghost" onClick={() => { onIrAProtocolo(escuelaId); onCerrar(); }}>
                    → ver protocolo en el planificador
                  </Boton>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: COLORS.aviso, border: `1px solid ${COLORS.gold}`, borderRadius: 12, padding: 12 }}>
            <AlertTriangle size={16} color={COLORS.gold} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 13.5, lineHeight: 1.5, color: COLORS.ink }}>{dato.mensajePendiente}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* Ficha corta del autor teórico (Fase 0 del módulo de teorías
   fundantes). Reutiliza el mismo lenguaje visual de ModalDefinicion,
   pero para AUTORES_TEORICOS en vez de GLOSARIO — deliberadamente un
   componente separado, para no mezclar "concepto de una escuela" con
   "teoría fundante de varias escuelas" bajo la misma forma. */
function ModalAutorTeorico({ autor, onCerrar, escuelasFundamentadas, perspectivas, onIrAEscuela }) {
  if (!autor) return null;
  const persps = perspectivas || [];
  const esHibridoDePerspectivas = persps.length > 1;
  // Agrupa las escuelas fundamentadas por perspectiva, para que el
  // deslinde entre "fundamenta esto en Psicodinámica" y "fundamenta esto
  // en Transpersonal" (p. ej. Jung) sea explícito y no solo cromático.
  const escuelasPorPerspectiva = {};
  (escuelasFundamentadas || []).forEach((e) => {
    if (!escuelasPorPerspectiva[e.perspectiva]) escuelasPorPerspectiva[e.perspectiva] = [];
    escuelasPorPerspectiva[e.perspectiva].push(e);
  });
  return (
    <div
      onClick={onCerrar}
      style={{ position: "fixed", inset: 0, background: "rgba(30,42,40,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="psq-modal"
        style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 14, maxWidth: 640, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: 0, position: "relative", boxShadow: "0 10px 40px rgba(0,0,0,0.25)" }}
      >
        <div style={{ height: 6, background: gradientePerspectivas(persps, "to right") }} />
        <div style={{ padding: 24 }}>
          <button
          onClick={onCerrar}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: COLORS.inkSoft,
          }}
          onMouseEnter={(ev) => {
            ev.currentTarget.style.background = COLORS.paperDark;
            ev.currentTarget.style.color = COLORS.ink;
          }}
          onMouseLeave={(ev) => {
            ev.currentTarget.style.background = "transparent";
            ev.currentTarget.style.color = COLORS.inkSoft;
          }}
        >
          <X size={17} />
        </button>
          <Sello color={COLORS.inkSoft}>{autor.esTambienEscuelaPropia ? "teoría fundante · autor híbrido" : "teoría fundante"}</Sello>
          <h3 style={{ fontFamily: "var(--f-display)", fontSize: 19, margin: "10px 0 2px" }}>{autor.nombre}</h3>
          <p style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft, margin: "0 0 8px" }}>{autor.autoresPrincipales} · {autor.disciplina}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
            {persps.map((p) => (
              <span
                key={p}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLORS.onAcento,
                  background: PERSPECTIVA_COLOR[p] || COLORS.inkSoft,
                  borderRadius: 8,
                  padding: "2px 8px",
                }}
              >
                {p}
              </span>
            ))}
            {persps.length === 0 && (
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, fontStyle: "italic" }}>ninguna escuela lo cita todavía en fundamentosTeoricos</span>
            )}
          </div>

          {esHibridoDePerspectivas && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "8px 12px", marginBottom: 14 }}>
              <span style={{ fontFamily: "var(--f-text)", fontSize: 12.5, color: COLORS.ink, fontStyle: "italic" }}>
                Autor de doble filiación: fundamenta escuelas en {persps.length} perspectivas distintas ({persps.join(" y ")}). No es un solapamiento accidental — cada perspectiva abajo agrupa las escuelas concretas que lo citan en ese terreno.
              </span>
            </div>
          )}

          {autor.esTambienEscuelaPropia && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "8px 12px", marginBottom: 14 }}>
              <span style={{ fontFamily: "var(--f-text)", fontSize: 12.5, color: COLORS.ink, fontStyle: "italic" }}>
                Este autor administra también su propia escuela clínica en la app.
              </span>
              <Boton small onClick={() => { onIrAEscuela(autor.esTambienEscuelaPropia); onCerrar(); }}>
                → ver ficha completa
              </Boton>
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, textTransform: "uppercase", color: COLORS.primary, marginBottom: 3 }}>Obra nuclear</div>
            <p style={{ fontFamily: FONT_MONO, fontSize: 12, lineHeight: 1.6, color: COLORS.ink, margin: 0 }}>{autor.obraNuclear}</p>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, textTransform: "uppercase", color: COLORS.primary, marginBottom: 3 }}>Aporte y síntesis</div>
            <TextoConCitas texto={autor.aporteSintesis} />
          </div>
          {(autor.ontologia || autor.epistemologia) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 12, marginBottom: 12 }}>
              {autor.ontologia && (
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, textTransform: "uppercase", color: COLORS.sage, marginBottom: 3 }}>Ontología</div>
                  <p style={{ fontFamily: "var(--f-text)", fontSize: 13, lineHeight: 1.5, color: COLORS.ink, margin: 0 }}>{autor.ontologia}</p>
                </div>
              )}
              {autor.epistemologia && (
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, textTransform: "uppercase", color: COLORS.sage, marginBottom: 3 }}>Epistemología</div>
                  <p style={{ fontFamily: "var(--f-text)", fontSize: 13, lineHeight: 1.5, color: COLORS.ink, margin: 0 }}>{autor.epistemologia}</p>
                </div>
              )}
            </div>
          )}
          {autor.conceptosAportados && autor.conceptosAportados.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, textTransform: "uppercase", color: COLORS.garnet, marginBottom: 5 }}>Conceptos aportados</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {autor.conceptosAportados.map((c, i) => (
                  <span key={i} style={{ fontFamily: FONT_MONO, fontSize: 10.5, border: `1px solid ${COLORS.line}`, borderRadius: 20, padding: "2px 9px", color: COLORS.ink }}>{c}</span>
                ))}
              </div>
            </div>
          )}
          {escuelasFundamentadas && escuelasFundamentadas.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.line}` }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, textTransform: "uppercase", color: COLORS.ink, marginBottom: 8 }}>
                Fundamenta {escuelasFundamentadas.length} escuela{escuelasFundamentadas.length === 1 ? "" : "s"} en esta app
              </div>
              {Object.entries(escuelasPorPerspectiva).map(([persp, lista]) => (
                <div key={persp} style={{ marginBottom: 8 }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: 700, color: PERSPECTIVA_COLOR[persp] || COLORS.inkSoft, marginBottom: 4 }}>
                    en {persp}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {lista.map((e) => (
                      <Boton
                        key={e.id}
                        small
                        variant="ghost"
                        style={{ borderColor: PERSPECTIVA_COLOR[persp] || COLORS.line }}
                        onClick={() => { onIrAEscuela(e.id); onCerrar(); }}
                      >
                        {e.nombre}
                      </Boton>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {autor.fuentesVerificacion && (
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, borderTop: `1px dashed ${COLORS.line}`, marginTop: 14, paddingTop: 10 }}>
              Verificación: {autor.fuentesVerificacion}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Helper de accesibilidad: permite activar con Enter/Espacio cualquier
   elemento no nativo (div/span) que actúe como control de navegación
   por clic, sin tener que reescribir cada onKeyDown a mano. */
function activarConTeclado(fn) {
  return (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      fn();
    }
  };
}

function MenuOpcion({ icon, label, detalle, onClick, activo, tono }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        border: "none",
        background: activo ? COLORS.paperDark : "transparent",
        borderRadius: 12,
        padding: "8px 10px",
        cursor: onClick ? "pointer" : "default",
        textAlign: "left",
        color: tono || COLORS.ink,
      }}
      onMouseEnter={onClick ? (ev) => { if (!activo) ev.currentTarget.style.background = COLORS.paperDark; } : undefined}
      onMouseLeave={onClick ? (ev) => { if (!activo) ev.currentTarget.style.background = "transparent"; } : undefined}
    >
      <span style={{ width: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: tono || COLORS.inkSoft }}>{icon}</span>
      <span style={{ display: "grid" }}>
        <span style={{ fontFamily: "var(--f-text)", fontSize: 13, fontWeight: 500 }}>{label}</span>
        {detalle && <span style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.inkSoft }}>{detalle}</span>}
      </span>
    </button>
  );
}

function Boton({ children, onClick, variant = "default", small, title, style, disabled, "aria-label": ariaLabel }) {
  const base = {
    fontFamily: "var(--f-mono)",
    fontSize: small ? 11 : 12.5,
    padding: small ? "4px 8px" : "7px 14px",
    borderRadius: 8,
    cursor: disabled ? "default" : "pointer",
    border: `1px solid ${document.documentElement.dataset.tema === "claro" ? COLORS.primaryDark : COLORS.line}`,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "background 0.15s",
    opacity: disabled ? 0.4 : 1,
  };
  const variants = {
    default: { background: COLORS.primary, color: document.documentElement.dataset.tema === "claro" ? COLORS.cardBg : "#0A1612" },
    ghost: { background: "transparent", color: document.documentElement.dataset.tema === "claro" ? COLORS.primaryDark : COLORS.ink },
    danger: { background: "transparent", color: COLORS.garnet, border: `1px solid ${COLORS.garnet}` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }} title={title} aria-label={ariaLabel || title}>
      {children}
    </button>
  );
}

function CampoTexto({ label, value, onChange, area }) {
  const Comp = area ? "textarea" : "input";
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <Comp
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={area ? 3 : undefined}
        style={{
          width: "100%",
          fontFamily: "var(--f-text)",
          fontSize: 13.5,
          padding: "6px 8px",
          border: `1px solid ${COLORS.line}`,
          borderRadius: 8,
          background: COLORS.cardBg,
          color: COLORS.ink,
          boxSizing: "border-box",
          resize: area ? "vertical" : undefined,
        }}
      />
    </label>
  );
}

function ListaEditable({ label, items, onChange }) {
  const [nuevo, setNuevo] = useState("");
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ marginBottom: 6 }}>
        {items.map((it, i) => (
          <Etiqueta key={i}>
            {it}{" "}
            <span
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              style={{ cursor: "pointer", color: COLORS.garnet, marginLeft: 4 }}
            >
              ×
            </span>
          </Etiqueta>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && nuevo.trim()) {
              onChange([...items, nuevo.trim()]);
              setNuevo("");
            }
          }}
          placeholder="Añadir y pulsar Enter…"
          style={{
            flex: 1,
            fontSize: 12.5,
            padding: "4px 8px",
            border: `1px solid ${COLORS.line}`,
            borderRadius: 8,
          }}
        />
      </div>
    </div>
  );
}

/* ---------- MÓDULO 0: FUNDAMENTOS ---------- */
function fragmentoCoincidencia(texto, query, ventana = 100) {
  if (!texto) return "";
  const t = String(texto);
  const idx = t.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return t.length > ventana * 2 ? t.slice(0, ventana * 2) + "…" : t;
  const inicio = Math.max(0, idx - ventana);
  const fin = Math.min(t.length, idx + query.length + ventana);
  return (inicio > 0 ? "…" : "") + t.slice(inicio, fin) + (fin < t.length ? "…" : "");
}

function ModuloBuscador({ escuelas, enlaces, enlacesTecnicas, planes, onIrAEscuela, onIrADiccionario, irA, modoEstudio, terminoInicial }) {
  const [q, setQ] = useState(terminoInicial || "");
  // Pool de términos candidatos para sugerencias "¿quisiste decir...?":
  // nombres de escuela, autores, conceptos/técnicas del glosario y los 21
  // nudos transversales — todo lo que alguien razonablemente escribiría
  // buscando algo que sí existe en la app, con una errata o variante.
  const poolSugerencias = useMemo(() => {
    const nombres = escuelas.map((e) => e.nombre);
    const autores = escuelas.flatMap((e) => (e.autores || "").split(/[;,]/).map((a) => a.trim())).filter(Boolean);
    const glosario = GLOSARIO.map((g) => g.termino);
    const transversales = CONCEPTOS_TRANSVERSALES.map((c) => c.nombre);
    return [...nombres, ...autores, ...glosario, ...transversales];
  }, [escuelas]);
  // Filtros facetados: se combinan con la búsqueda de texto y también
  // funcionan solos (modo "explorar"), sin necesidad de escribir nada —
  // útil para preguntas del tipo "muéstrame todas las escuelas con
  // criterio pragmático" o "todas las sistémicas", sin saber qué palabra buscar.
  const [filtroPerspectivas, setFiltroPerspectivas] = useState([]);
  const [filtroCriterios, setFiltroCriterios] = useState([]);
  const [soloConProcedimientos, setSoloConProcedimientos] = useState(false);
  // Búsqueda restringida solo al campo de autores: "Beck" en modo normal
  // trae de vuelta cualquier escuela que lo mencione de pasada en la
  // fundamentación (p. ej. como antecedente citado); en este modo, solo
  // las escuelas donde Beck es efectivamente uno de los autores.
  const [soloAutor, setSoloAutor] = useState(false);
  const hayFiltrosFacetados = filtroPerspectivas.length > 0 || filtroCriterios.length > 0 || soloConProcedimientos || soloAutor;
  const togglePerspectiva = (p) => setFiltroPerspectivas((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  const toggleCriterio = (c) => setFiltroCriterios((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  const limpiarFiltros = () => {
    setFiltroPerspectivas([]);
    setFiltroCriterios([]);
    setSoloConProcedimientos(false);
    setSoloAutor(false);
  };
  // Un criterio de verdad puede ser mixto (p. ej. "pragmático y coherencia
  // narrativa"), por lo que se comprueba contra TODAS las claves que
  // coincidan en el texto, no solo la primera — reutiliza la misma regla
  // que ya pinta el SelloCriterio en las fichas de escuela.
  const criteriosDeEscuela = (e) => {
    const hits = CRITERIOS_VERDAD.filter((c) => c.test.test(e.criterioVerdad || "")).map((c) => c.clave);
    // Sin esta rama, una escuela con criterio de verdad genuinamente fuera
    // de los 6 ejes (p. ej. «político» en la terapia feminista, o
    // «asunción de agencia» en la existencial de Yalom) desaparecería sin
    // rastro apenas se marcara cualquier chip de criterio — quedaría
    // invisible para siempre en modo filtro, lo cual sería impreciso.
    return hits.length > 0 ? hits : ["propio"];
  };

  const resultados = useMemo(() => {
    const hayQuery = q && q.trim().length >= 2;
    if (!hayQuery && !hayFiltrosFacetados) return null;
    // Insensible a tildes/diacríticos (NFD + strip de marcas combinantes):
    // antes "reaccion" no encontraba "reacción" ni "títere" con "titere".
    // No reutiliza normalizarTermino() tal cual porque esa función también
    // quita el contenido entre paréntesis, lo cual sirve para comparar
    // nombres de conceptos pero recortaría texto relevante en una búsqueda
    // libre sobre fundamentación/evidencia.
    const sinTildes = (t) => (t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const f = sinTildes(q);
    const incluye = (t) => hayQuery && sinTildes(t).includes(f);
    const enTitulo = (t) => sinTildes(t).includes(f);

    const escuelasR = escuelas
      .filter((e) => {
        const filo = FILOSOFIA_ESCUELA[e.id];
        if (!hayQuery) return true;
        if (soloAutor) return incluye(e.autores);
        return (
          incluye(e.nombre) ||
              incluye(e.autores) ||
              incluye(e.fundamentacion) ||
              incluye(e.psicopatologia) ||
              incluye(e.ontologia) ||
              incluye(e.epistemologia) ||
              incluye(e.metodologia) ||
              incluye(e.criterioVerdad) ||
              incluye(e.evidencia) ||
              incluye(e.notaDistincion) ||
              incluye(filo?.mapaDecisional) ||
              incluye(filo?.clasificacionesHistoricas) ||
              (e.conceptos || []).some(incluye) ||
              (e.tecnicas || []).some(incluye) ||
              (e.presentaciones || []).some(incluye) ||
              (e.contraindicaciones || []).some(incluye)
        );
      })
      .filter((e) => filtroPerspectivas.length === 0 || filtroPerspectivas.includes(e.perspectiva))
      .filter((e) => filtroCriterios.length === 0 || criteriosDeEscuela(e).some((c) => filtroCriterios.includes(c)))
      .filter((e) => !soloConProcedimientos || (PROCEDIMIENTOS_CLINICOS[e.id] && PROCEDIMIENTOS_CLINICOS[e.id].length > 0))
      .map((e) => ({
        ...e,
        _frag: hayQuery
          ? fragmentoCoincidencia(
              [e.fundamentacion, e.ontologia, e.epistemologia, e.metodologia, e.criterioVerdad, e.psicopatologia, e.evidencia].find(incluye) || e.fundamentacion,
              q
            )
          : e.fundamentacion,
      }));

    if (!hayQuery) {
      // Modo "solo filtros": no tiene sentido barrer glosario, enlaces,
      // etc. por texto vacío (devolvería todo y ahogaría el resultado
      // relevante), así que en este modo el buscador se comporta como
      // un explorador de escuelas por facetas.
      return {
        escuelasR,
        conceptosR: [], tecnicasR: [], enlacesR: [], enlacesTecR: [], perspectivasR: [],
        protocolosR: [], procedimientosR: [], subvariantesR: [], transversalesR: [], textosR: [], planesR: [],
      };
    }

    const conceptosR = GLOSARIO.filter((g) => g.tipo === "concepto" && (incluye(g.termino) || incluye(g.definicion) || incluye(g.fuente))).map((g) => ({
      ...g,
      _frag: fragmentoCoincidencia(g.definicion, q),
    }));
    const tecnicasR = GLOSARIO.filter(
      (g) => g.tipo === "técnica" && (incluye(g.termino) || incluye(g.definicion) || incluye(g.funcion) || incluye(g.contextos) || incluye(g.fuente))
    ).map((g) => ({ ...g, _frag: fragmentoCoincidencia([g.definicion, g.funcion, g.contextos].find(incluye) || g.definicion, q) }));

    const enlacesR = enlaces
      .filter((l) => incluye(l.conceptoA.nombre) || incluye(l.conceptoB.nombre) || incluye(l.nota) || incluye(l.relacion))
      .map((l) => ({ ...l, _frag: fragmentoCoincidencia(l.nota, q) }));
    const enlacesTecR = (enlacesTecnicas || [])
      .filter((l) => incluye(l.conceptoA.nombre) || incluye(l.conceptoB.nombre) || incluye(l.nota))
      .map((l) => ({ ...l, _frag: fragmentoCoincidencia(l.nota, q) }));

    const perspectivasR = FUNDAMENTOS_PERSPECTIVAS.filter(
      (p) =>
        incluye(p.nombre) ||
        incluye(p.origenHistorico) ||
        incluye(p.unidadAnalisis) ||
        incluye(p.relacionMenteCuerpo) ||
        incluye(p.ontologia) ||
        incluye(p.epistemologia) ||
        incluye(p.metodologia) ||
        incluye(p.criterioVerdad) ||
        incluye(p.puenteFilosofico) ||
        (p.contexto && Object.values(p.contexto).some(incluye))
    ).map((p) => ({
      ...p,
      _frag: fragmentoCoincidencia(
        [p.origenHistorico, p.ontologia, p.epistemologia, p.metodologia, p.criterioVerdad, ...(p.contexto ? Object.values(p.contexto) : [])].find(incluye) ||
          p.origenHistorico,
        q
      ),
    }));

    const protocolosR = Object.entries(PROTOCOLOS_SEED)
      .filter(([id, p]) => incluye(p.nombre) || incluye(p.fuente) || incluye(p.poblacion) || (p.fases || []).some(incluye))
      .map(([id, p]) => ({ escuelaId: id, ...p, _frag: fragmentoCoincidencia((p.fases || []).find(incluye) || p.poblacion || p.fuente, q) }));

    const procedimientosR = Object.entries(PROCEDIMIENTOS_CLINICOS)
      .flatMap(([id, procs]) => procs.map((p) => ({ escuelaId: id, ...p })))
      .filter((p) => incluye(p.nombre) || incluye(p.fuente) || incluye(p.condiciones) || (p.fases || []).some(incluye))
      .map((p) => ({ ...p, _frag: fragmentoCoincidencia((p.fases || []).find(incluye) || p.condiciones || p.fuente, q) }));

    const subvariantesR = Object.entries(SUBVARIANTES_ESCUELA)
      .flatMap(([id, subs]) => subs.map((sv) => ({ escuelaId: id, ...sv })))
      .filter(
        (sv) =>
          incluye(sv.nombre) ||
          incluye(sv.autores) ||
          incluye(sv.definicionTextual) ||
          incluye(sv.ontologia) ||
          incluye(sv.epistemologia) ||
          incluye(sv.metodologia) ||
          incluye(sv.criterioVerdad) ||
          incluye(sv.manual) ||
          (sv.conceptosClave || []).some(incluye)
      )
      .map((sv) => ({
        ...sv,
        _frag: fragmentoCoincidencia(
          [sv.definicionTextual, sv.ontologia, sv.epistemologia, sv.metodologia, sv.criterioVerdad, sv.manual].find(incluye) || sv.definicionTextual,
          q
        ),
      }));

    const transversalesR = CONCEPTOS_TRANSVERSALES.flatMap((c) =>
      c.porPerspectiva
        .filter((pp) => incluye(pp.termino) || incluye(pp.definicion) || incluye(pp.perspectiva))
        .map((pp) => ({ cluster: c.nombre, ...pp, _frag: fragmentoCoincidencia(pp.definicion, q) }))
    );

    const textosR = Object.entries(TEXTOS_FUNDAMENTALES)
      .flatMap(([id, libros]) => libros.map((libro) => ({ escuelaId: id, libro })))
      .filter((x) => incluye(x.libro));

    const planesR = (planes || [])
      .filter((p) => incluye(p.presentacionNativa) || incluye(p.grupoTransversal) || (p.pasos || []).some(incluye))
      .map((p) => ({ ...p, _frag: fragmentoCoincidencia((p.pasos || []).find(incluye) || p.presentacionNativa, q) }));

    // orden por relevancia: coincidencia en el título primero
    const porRelevancia = (arr, getTitulo) => [...arr].sort((a, b) => Number(enTitulo(getTitulo(b))) - Number(enTitulo(getTitulo(a))));

    return {
      escuelasR: porRelevancia(escuelasR, (e) => e.nombre),
      conceptosR: porRelevancia(conceptosR, (g) => g.termino),
      tecnicasR: porRelevancia(tecnicasR, (g) => g.termino),
      enlacesR,
      enlacesTecR,
      perspectivasR,
      protocolosR,
      procedimientosR,
      subvariantesR,
      transversalesR,
      textosR,
      planesR,
    };
  }, [q, escuelas, enlaces, enlacesTecnicas, planes, filtroPerspectivas, filtroCriterios, soloConProcedimientos, soloAutor]);

  const total = resultados
    ? resultados.escuelasR.length +
      resultados.conceptosR.length +
      resultados.tecnicasR.length +
      resultados.enlacesR.length +
      resultados.enlacesTecR.length +
      resultados.perspectivasR.length +
      resultados.protocolosR.length +
      resultados.procedimientosR.length +
      resultados.subvariantesR.length +
      resultados.transversalesR.length +
      resultados.textosR.length +
      resultados.planesR.length
    : 0;

  return (
    <div>
      <Cabecera
        icono={<Search size={18} />}
        titulo="Buscador global" autores={["freud","rogers","skinner","beck"]} tituloAutores="Voces que encontrarás"
        subtitulo="Búsqueda unificada sobre escuelas, autores, conceptos, protocolos y enlaces traslacionales, con sugerencias ortográficas cuando el término no se encuentra."
      />

      <div style={{ margin: "16px 0 20px", position: "relative" }}>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Escribe al menos 2 letras — p. ej. «ansiedad», «Yalom», «reencuadre», «transferencia»… (o usa los filtros de abajo sin escribir nada)"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: 15,
            fontFamily: "var(--f-text)",
            border: `1.5px solid ${COLORS.primary}`,
            borderRadius: 12,
            outline: "none",
          }}
        />
      </div>

      <div style={{ marginBottom: 20, display: "grid", gap: 10 }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.04em", color: COLORS.inkSoft, marginBottom: 5, textTransform: "uppercase" }}>
            Perspectiva
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {Object.values(NOMBRE_CORTO_PERSPECTIVA).map((p) => {
              const activo = filtroPerspectivas.includes(p);
              const color = PERSPECTIVA_COLOR[p] || COLORS.inkSoft;
              return (
                <button
                  key={p}
                  onClick={() => togglePerspectiva(p)}
                  title={`Filtrar por perspectiva: ${p}`}
                  style={{
                    fontFamily: FONT_MONO, fontSize: 10.5, padding: "4px 9px", borderRadius: 12,
                    border: `1px solid ${color}`, cursor: "pointer",
                    background: activo ? color : "transparent", color: activo ? COLORS.cardBg : color,
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.04em", color: COLORS.inkSoft, marginBottom: 5, textTransform: "uppercase" }}>
            Criterio de verdad epistemológico
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CRITERIOS_VERDAD.map((c) => {
              const activo = filtroCriterios.includes(c.clave);
              return (
                <button
                  key={c.clave}
                  onClick={() => toggleCriterio(c.clave)}
                  title={`Filtrar por criterio de verdad: ${c.label}`}
                  style={{
                    fontFamily: FONT_MONO, fontSize: 10.5, padding: "4px 9px", borderRadius: 12,
                    border: `1px solid ${c.color}`, cursor: "pointer",
                    background: activo ? c.color : "transparent", color: activo ? COLORS.cardBg : c.color,
                  }}
                >
                  {c.label}
                </button>
              );
            })}
            {(() => {
              const activo = filtroCriterios.includes("propio");
              return (
                <button
                  onClick={() => toggleCriterio("propio")}
                  title="Escuelas cuyo criterio de verdad declarado no encaja en ninguno de los 6 ejes catalogados (p. ej. político, existencial-agencial)"
                  style={{
                    fontFamily: FONT_MONO, fontSize: 10.5, padding: "4px 9px", borderRadius: 12,
                    border: `1px dashed ${COLORS.inkSoft}`, cursor: "pointer",
                    background: activo ? COLORS.inkSoft : "transparent", color: activo ? COLORS.cardBg : COLORS.inkSoft,
                  }}
                >
                  Criterio propio / fuera de los 6 ejes
                </button>
              );
            })()}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => setSoloConProcedimientos((v) => !v)}
            title="Mostrar solo escuelas con procedimientos clínicos intra-sesión documentados en la app"
            style={{
              fontFamily: FONT_MONO, fontSize: 10.5, padding: "4px 9px", borderRadius: 12,
              border: `1px solid ${COLORS.gold}`, cursor: "pointer",
              background: soloConProcedimientos ? COLORS.gold : "transparent", color: soloConProcedimientos ? COLORS.cardBg : COLORS.gold,
            }}
          >
            Solo con procedimientos clínicos documentados
          </button>
          <button
            onClick={() => setSoloAutor((v) => !v)}
            title="Buscar el término SOLO en el campo de autores de cada escuela, no en el resto del texto — evita que 'Beck' traiga escuelas que solo lo mencionan de pasada"
            style={{
              fontFamily: FONT_MONO, fontSize: 10.5, padding: "4px 9px", borderRadius: 12,
              border: `1px solid ${COLORS.clay}`, cursor: "pointer",
              background: soloAutor ? COLORS.clay : "transparent", color: soloAutor ? COLORS.cardBg : COLORS.clay,
            }}
          >
            Buscar solo por autor
          </button>
          {hayFiltrosFacetados && (
            <button
              onClick={limpiarFiltros}
              style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.inkSoft, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              limpiar filtros
            </button>
          )}
        </div>
      </div>

      {!resultados && (
        <VacioAviso texto="Escribe un término arriba, o marca uno o más filtros, para explorar las escuelas y el resto de los módulos de la aplicación." />
      )}

      {resultados && total === 0 && (
        <div>
          <VacioAviso texto={q.trim().length >= 2 ? `Sin resultados para «${q}» en ningún módulo.` : "Ninguna escuela cumple con los filtros seleccionados."} />
          {q.trim().length >= 3 &&
            (() => {
              const sugerencias = sugerirTerminos(q, poolSugerencias, 4);
              if (sugerencias.length === 0) return null;
              return (
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--f-text)", fontSize: 13, color: COLORS.inkSoft, fontStyle: "italic" }}>¿Quisiste decir…?</span>
                  {sugerencias.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQ(s)}
                      style={{
                        fontFamily: FONT_MONO, fontSize: 11.5, padding: "4px 11px", borderRadius: 14, cursor: "pointer",
                        border: `1px solid ${COLORS.gold}`, background: "transparent", color: COLORS.gold, fontWeight: 700,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              );
            })()}
        </div>
      )}

      {resultados && total > 0 && (
        <div style={{ display: "grid", gap: 24 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: COLORS.inkSoft }}>{total} resultados encontrados, ordenados por relevancia dentro de cada bloque</div>

          {resultados.perspectivasR.length > 0 && (
            <BloqueResultados titulo="Perspectivas y su contexto" color={COLORS.primary}>
              {resultados.perspectivasR.map((p) => (
                <ResultadoItem
                  query={q}
                  modoEstudio={modoEstudio}
                  key={p.id}
                  color={PERSPECTIVA_COLOR[p.nombre]}
                  etiqueta={p.nombre}
                  titulo={p.nombre}
                  texto={p._frag}
                  onClick={() => irA("fundamentos")}
                />
              ))}
            </BloqueResultados>
          )}

          {resultados.escuelasR.length > 0 && (
            <BloqueResultados titulo="Escuelas" color={COLORS.primary}>
              {resultados.escuelasR.map((e) => (
                <ResultadoItem
                  query={q}
                  modoEstudio={modoEstudio}
                  key={e.id}
                  color={PERSPECTIVA_COLOR[e.perspectiva]}
                  etiqueta={e.perspectiva}
                  titulo={e.nombre}
                  texto={e._frag}
                  onClick={() => onIrAEscuela(e.id)}
                />
              ))}
            </BloqueResultados>
          )}

          {resultados.subvariantesR.length > 0 && (
            <BloqueResultados titulo="Sub-variantes internas de escuela" color={COLORS.gold}>
              {resultados.subvariantesR.map((sv, i) => {
                const e = escuelas.find((x) => x.id === sv.escuelaId);
                return (
                  <ResultadoItem
                    query={q}
                    modoEstudio={modoEstudio}
                    key={"sv" + i}
                    color={e ? PERSPECTIVA_COLOR[e.perspectiva] : COLORS.gold}
                    etiqueta={e?.nombre || sv.escuelaId}
                    titulo={sv.nombre}
                    texto={sv._frag}
                    onClick={() => onIrAEscuela(sv.escuelaId)}
                  />
                );
              })}
            </BloqueResultados>
          )}

          {resultados.conceptosR.length > 0 && (
            <BloqueResultados titulo="Conceptos del glosario" color={COLORS.garnet}>
              {resultados.conceptosR.map((g, i) => (
                <ResultadoItem
                  query={q}
                  modoEstudio={modoEstudio}
                  key={i}
                  color={PERSPECTIVA_COLOR[escuelas.find((e) => e.id === g.escuela)?.perspectiva] || COLORS.garnet}
                  etiqueta={escuelas.find((e) => e.id === g.escuela)?.nombre || g.escuela}
                  titulo={g.termino}
                  texto={g._frag}
                  onClick={() => onIrADiccionario(g.escuela, g.termino)}
                />
              ))}
            </BloqueResultados>
          )}

          {resultados.tecnicasR.length > 0 && (
            <BloqueResultados titulo="Técnicas del glosario" color={COLORS.clay}>
              {resultados.tecnicasR.map((g, i) => (
                <ResultadoItem
                  query={q}
                  modoEstudio={modoEstudio}
                  key={i}
                  color={PERSPECTIVA_COLOR[escuelas.find((e) => e.id === g.escuela)?.perspectiva] || COLORS.clay}
                  etiqueta={escuelas.find((e) => e.id === g.escuela)?.nombre || g.escuela}
                  titulo={g.termino}
                  texto={g._frag}
                  onClick={() => onIrADiccionario(g.escuela, g.termino)}
                />
              ))}
            </BloqueResultados>
          )}

          {resultados.transversalesR.length > 0 && (
            <BloqueResultados titulo="Nudos temáticos transversales" color={COLORS.ink}>
              {resultados.transversalesR.map((t, i) => (
                <ResultadoItem
                  query={q}
                  modoEstudio={modoEstudio}
                  key={"tr" + i}
                  color={PERSPECTIVA_COLOR[t.perspectiva] || COLORS.ink}
                  etiqueta={`${t.cluster} · ${t.perspectiva}`}
                  titulo={t.termino}
                  texto={t._frag}
                  onClick={() => t.escuela && onIrADiccionario(t.escuela, t.termino)}
                />
              ))}
            </BloqueResultados>
          )}

          {(resultados.enlacesR.length > 0 || resultados.enlacesTecR.length > 0) && (
            <BloqueResultados titulo="Enlaces traslacionales (diccionario)" color={COLORS.sage}>
              {resultados.enlacesR.map((l) => (
                <ResultadoItem
                  query={q}
                  modoEstudio={modoEstudio}
                  key={l.id}
                  color={COLORS.sage}
                  etiqueta={l.relacion}
                  titulo={`${l.conceptoA.nombre} ↔ ${l.conceptoB.nombre}`}
                  texto={l._frag}
                  onClick={() => onIrADiccionario(l.conceptoA.escuela, l.conceptoA.nombre)}
                />
              ))}
              {resultados.enlacesTecR.map((l) => (
                <ResultadoItem
                  query={q}
                  modoEstudio={modoEstudio}
                  key={l.id}
                  color={COLORS.sage}
                  etiqueta={l.relacion}
                  titulo={`${l.conceptoA.nombre} ↔ ${l.conceptoB.nombre} (técnica)`}
                  texto={l._frag}
                  onClick={() => onIrADiccionario(l.conceptoA.escuela, l.conceptoA.nombre)}
                />
              ))}
            </BloqueResultados>
          )}

          {(resultados.protocolosR.length > 0 || resultados.procedimientosR.length > 0) && (
            <BloqueResultados titulo="Protocolos y procedimientos clínicos" color={COLORS.garnet}>
              {resultados.protocolosR.map((p, i) => {
                const e = escuelas.find((x) => x.id === p.escuelaId);
                return (
                  <ResultadoItem
                    query={q}
                    modoEstudio={modoEstudio}
                    key={"proto" + i}
                    color={e ? PERSPECTIVA_COLOR[e.perspectiva] : COLORS.garnet}
                    etiqueta={e?.nombre || p.escuelaId}
                    titulo={p.nombre}
                    texto={p._frag}
                    onClick={() => onIrAEscuela(p.escuelaId)}
                  />
                );
              })}
              {resultados.procedimientosR.map((p, i) => {
                const e = escuelas.find((x) => x.id === p.escuelaId);
                return (
                  <ResultadoItem
                    query={q}
                    modoEstudio={modoEstudio}
                    key={"proc" + i}
                    color={e ? PERSPECTIVA_COLOR[e.perspectiva] : COLORS.garnet}
                    etiqueta={e?.nombre || p.escuelaId}
                    titulo={p.nombre}
                    texto={p._frag}
                    onClick={() => onIrAEscuela(p.escuelaId)}
                  />
                );
              })}
            </BloqueResultados>
          )}

          {resultados.textosR.length > 0 && (
            <BloqueResultados titulo="Textos y manuales fundamentales" color={COLORS.inkSoft}>
              {resultados.textosR.map((t, i) => {
                const e = escuelas.find((x) => x.id === t.escuelaId);
                return (
                  <ResultadoItem
                    query={q}
                    modoEstudio={modoEstudio}
                    key={"txt" + i}
                    color={e ? PERSPECTIVA_COLOR[e.perspectiva] : COLORS.inkSoft}
                    etiqueta={e?.nombre || t.escuelaId}
                    titulo={t.libro}
                    texto=""
                    onClick={() => onIrAEscuela(t.escuelaId)}
                  />
                );
              })}
            </BloqueResultados>
          )}

          {resultados.planesR.length > 0 && (
            <BloqueResultados titulo="Planes de sesión guardados" color={COLORS.inkSoft}>
              {resultados.planesR.map((p) => {
                const e = escuelas.find((x) => x.id === p.escuela);
                return (
                  <ResultadoItem
                    query={q}
                    modoEstudio={modoEstudio}
                    key={p.id}
                    color={e ? PERSPECTIVA_COLOR[e.perspectiva] : COLORS.inkSoft}
                    etiqueta={e?.nombre || p.escuela}
                    titulo={p.presentacionNativa}
                    texto={p._frag}
                    onClick={() => irA("planificador")}
                  />
                );
              })}
            </BloqueResultados>
          )}
        </div>
      )}
    </div>
  );
}

function BloqueResultados({ titulo, color, children }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.04em", color, marginBottom: 10, borderBottom: `1px solid ${color}`, paddingBottom: 6 }}>
        {titulo}
      </div>
      <div style={{ display: "grid", gap: 8 }}>{children}</div>
    </div>
  );
}

// Índice de términos del glosario aptos para auto-enlazar dentro de un
// texto de nota — SOLO términos de 12+ caracteres, para evitar que una
// palabra corta y común (p. ej. "Self", "Yo", "Apego") dispare enlaces
// por todas partes sin relación real con lo que el texto está diciendo.
// Ordenado de más largo a más corto para que, si un término es substring
// de otro más específico, se prefiera siempre el más largo.
let _indiceGlosarioMenciones = null;
function indiceGlosarioParaMenciones() {
  if (_indiceGlosarioMenciones) return _indiceGlosarioMenciones;
  const vistos = new Set();
  const items = [];
  GLOSARIO.forEach((g) => {
    const t = g.termino.trim();
    if (t.length < 12 || vistos.has(t.toLowerCase())) return;
    vistos.add(t.toLowerCase());
    items.push({ termino: t, escuela: g.escuela });
  });
  items.sort((a, b) => b.termino.length - a.termino.length);
  _indiceGlosarioMenciones = items;
  return items;
}

/* Envuelve, dentro de un texto de nota, las menciones literales de otros
   términos del glosario en spans clicables que llevan directo a ese
   concepto en el propio diccionario — sin tocar el término de la propia
   escuela actual (eso ya se resalta aparte) ni palabras cortas y
   ambiguas. Es deliberadamente conservador: prefiere no enlazar algo
   dudoso antes que enlazar de más. */
function NotaConMenciones({ texto, escuelaActualId, onIrAConcepto }) {
  const indice = indiceGlosarioParaMenciones();
  if (!texto) return null;
  const partes = [];
  let resto = texto;
  let cursor = 0;
  const encontrados = [];
  indice.forEach(({ termino, escuela }) => {
    if (escuela === escuelaActualId) return; // no auto-enlazar la propia escuela dentro de su propia nota
    let desde = 0;
    while (true) {
      const idx = texto.indexOf(termino, desde);
      if (idx === -1) break;
      encontrados.push({ inicio: idx, fin: idx + termino.length, termino, escuela });
      desde = idx + termino.length;
    }
  });
  if (encontrados.length === 0) {
    return <>{texto}</>;
  }
  // Descarta solapamientos: si dos coincidencias se pisan, gana la que
  // aparece primero en el texto (y, por el orden de indice, la más larga).
  encontrados.sort((a, b) => a.inicio - b.inicio);
  const sinSolape = [];
  let ultimoFin = -1;
  encontrados.forEach((f) => {
    if (f.inicio >= ultimoFin) {
      sinSolape.push(f);
      ultimoFin = f.fin;
    }
  });
  const nodos = [];
  let pos = 0;
  sinSolape.forEach((f, i) => {
    if (f.inicio > pos) nodos.push(texto.slice(pos, f.inicio));
    nodos.push(
      <span
        key={i}
        onClick={(ev) => {
          ev.stopPropagation();
          onIrAConcepto && onIrAConcepto(f.escuela, f.termino);
        }}
        title={`Ir a «${f.termino}» en el diccionario`}
        style={{ textDecoration: "underline", textDecorationStyle: "dotted", cursor: "pointer", color: "inherit", fontWeight: 600 }}
      >
        {texto.slice(f.inicio, f.fin)}
      </span>
    );
    pos = f.fin;
  });
  if (pos < texto.length) nodos.push(texto.slice(pos));
  return <>{nodos}</>;
}

function TextoResaltado({ texto, query }) {
  if (!query || !texto) return <>{texto}</>;
  const partes = String(texto).split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {partes.map((parte, i) =>
        parte.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} style={{ background: "#F4D35E", color: COLORS.ink, padding: "0 1px", borderRadius: 2 }}>
            {parte}
          </mark>
        ) : (
          <React.Fragment key={i}>{parte}</React.Fragment>
        )
      )}
    </>
  );
}

function ResultadoItem({ color, etiqueta, titulo, texto, onClick, query, modoEstudio }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={activarConTeclado(onClick)}
      style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer" }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color, textTransform: "uppercase" }}>{etiqueta}</span>
        <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 14 }}>
          <TextoResaltado texto={titulo} query={query} />
        </span>
      </div>
      {texto && (
        <p
          style={{
            margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5, color: COLORS.ink,
            overflow: modoEstudio ? "visible" : "hidden", textOverflow: modoEstudio ? "clip" : "ellipsis",
            display: modoEstudio ? "block" : "-webkit-box", WebkitLineClamp: modoEstudio ? "unset" : 2, WebkitBoxOrient: "vertical",
          }}
        >
          <TextoResaltado texto={texto} query={query} />
        </p>
      )}
    </div>
  );
}

// Una escuela representativa por perspectiva, elegida por ser la más
// históricamente fundacional o citada dentro de su perspectiva — sirve de
// puerta de entrada directa desde la Introducción sin tener que primero
// elegir la perspectiva y luego buscar una escuela dentro de ella.
/* Línea de tiempo GLOBAL: todas las escuelas y todas las teorías fundantes
   de las 7 perspectivas en un solo eje horizontal, coloreadas por su
   perspectiva de origen. Reutiliza la heurística extraerAnio() ya usada
   en la línea de tiempo por perspectiva del Módulo de Escuelas, pero sin
   filtrar por una perspectiva: aquí la vista es deliberadamente
   panorámica, así que prioriza legibilidad (solo etiqueta al pasar el
   cursor) sobre mostrar los ~110 nombres todos a la vez. */
/* Contenedor de pan/zoom reutilizable: envuelve cualquier SVG y permite
   acercar/alejar con la rueda del mouse (centrado en el cursor) o con
   pellizco táctil, y desplazarse arrastrando. Se usa tanto en las líneas
   de tiempo como en el mapa conceptual, para no duplicar la lógica de
   gestos tres veces. */
/* Exporta cualquier tabla (columnas + filas de texto) como imagen PNG,
   dibujándola directamente en un <canvas> — no depende de ninguna
   librería de captura de pantalla externa (no disponible en este
   entorno), así que funciona igual para cualquier tabla de la app:
   basta con darle las columnas y las filas ya como texto plano. */
function exportarTablaComoImagen({ titulo, columnas, filas, colorAcento = "#7A4A52" }) {
  const PAD = 24, FILA_H = 30, COL_MIN = 130, FUENTE = "13px Georgia, serif", FUENTE_HEAD = "bold 11px ui-monospace, monospace";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Calcula el ancho de cada columna según el contenido más largo (con
  // tope, para que una celda con un párrafo no dispare el ancho total).
  ctx.font = FUENTE;
  const anchos = columnas.map((c, i) => {
    let max = ctx.measureText(c.label).width;
    filas.forEach((f) => {
      const w = ctx.measureText(String(f[i] ?? "")).width;
      if (w > max) max = w;
    });
    return Math.min(Math.max(max + 24, COL_MIN), 320);
  });
  const anchoTotal = anchos.reduce((a, b) => a + b, 0) + PAD * 2;
  const altoTitulo = titulo ? 46 : 10;
  const altoTotal = altoTitulo + FILA_H * (filas.length + 1) + PAD;

  canvas.width = anchoTotal;
  canvas.height = altoTotal;

  // Fondo papel + título
  ctx.fillStyle = "#FBF7EE";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let y = PAD;
  if (titulo) {
    ctx.fillStyle = "#2A2018";
    ctx.font = "bold 17px Georgia, serif";
    ctx.fillText(titulo, PAD, y + 14);
    y += 34;
  }

  // Encabezado
  ctx.fillStyle = colorAcento;
  ctx.fillRect(PAD, y, anchoTotal - PAD * 2, FILA_H);
  ctx.fillStyle = "#fff";
  ctx.font = FUENTE_HEAD;
  let x = PAD + 10;
  columnas.forEach((c, i) => {
    ctx.fillText(c.label.toUpperCase(), x, y + 19);
    x += anchos[i];
  });
  y += FILA_H;

  // Filas
  ctx.font = FUENTE;
  filas.forEach((f, ri) => {
    ctx.fillStyle = ri % 2 === 0 ? "#FBF7EE" : "#F1E9D8";
    ctx.fillRect(PAD, y, anchoTotal - PAD * 2, FILA_H);
    ctx.fillStyle = "#2A2018";
    x = PAD + 10;
    f.forEach((valor, ci) => {
      let texto = String(valor ?? "");
      const maxW = anchos[ci] - 16;
      while (ctx.measureText(texto).width > maxW && texto.length > 3) {
        texto = texto.slice(0, -2);
      }
      if (texto !== String(valor ?? "") ) texto = texto.slice(0, -1) + "…";
      ctx.fillText(texto, x, y + 19);
      x += anchos[ci];
    });
    y += FILA_H;
  });

  // Borde
  ctx.strokeStyle = "#D8CBAE";
  ctx.strokeRect(PAD, altoTitulo, anchoTotal - PAD * 2, FILA_H * (filas.length + 1));

  const enlace = document.createElement("a");
  enlace.download = `${(titulo || "tabla").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  enlace.href = canvas.toDataURL("image/png");
  enlace.click();
}

/* Botón reutilizable de "exportar como imagen", pensado para colocarse
   junto a cualquier tabla de la app sin repetir el wiring cada vez. */
function BotonExportarImagen({ onClick, etiqueta = "exportar imagen" }) {
  return (
    <button
      onClick={onClick}
      title="Descarga esta tabla como imagen PNG"
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, fontFamily: FONT_MONO, fontSize: 10.5,
        padding: "5px 11px", borderRadius: 14, border: `1px solid ${COLORS.line}`, background: COLORS.cardBg,
        color: COLORS.ink, cursor: "pointer",
      }}
    >
      <Download size={12} /> {etiqueta}
    </button>
  );
}

function ContenedorPanZoom({ children, altura = 420, escalaMin = 0.5, escalaMax = 4, escalaInicial = 1, focoExterno = null }) {
  const [transform, setTransform] = useState({ x: 0, y: 0, k: escalaInicial });
  const [arrastrando, setArrastrando] = useState(false);
  const ultimaPos = useRef({ x: 0, y: 0 });
  const pinchDist = useRef(null);
  const contRef = useRef(null);

  // Permite que un componente padre (p. ej. el mapa conceptual, al hacer
  // clic en un nodo) dispare un "vuelo" programático hacia una región
  // concreta, igual que el zoom dirigido de Prezi al elegir un marco.
  useEffect(() => {
    if (focoExterno) setTransform(focoExterno);
  }, [focoExterno]);

  const aplicarZoom = (deltaK, cx, cy) => {
    setTransform((t) => {
      const nuevoK = Math.min(escalaMax, Math.max(escalaMin, t.k * deltaK));
      // Mantiene el punto (cx, cy) fijo en pantalla al hacer zoom (zoom
      // "hacia el cursor", no hacia la esquina superior izquierda).
      const factor = nuevoK / t.k;
      return { k: nuevoK, x: cx - (cx - t.x) * factor, y: cy - (cy - t.y) * factor };
    });
  };

  const onWheel = (ev) => {
    ev.preventDefault();
    const rect = contRef.current.getBoundingClientRect();
    const cx = ev.clientX - rect.left;
    const cy = ev.clientY - rect.top;
    aplicarZoom(ev.deltaY < 0 ? 1.12 : 0.89, cx, cy);
  };
  const onMouseDown = (ev) => {
    setArrastrando(true);
    ultimaPos.current = { x: ev.clientX, y: ev.clientY };
  };
  const onMouseMove = (ev) => {
    if (!arrastrando) return;
    const dx = ev.clientX - ultimaPos.current.x;
    const dy = ev.clientY - ultimaPos.current.y;
    ultimaPos.current = { x: ev.clientX, y: ev.clientY };
    setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  };
  const onMouseUp = () => setArrastrando(false);

  const distTouch = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  const onTouchStart = (ev) => {
    if (ev.touches.length === 2) pinchDist.current = distTouch(ev.touches);
    else if (ev.touches.length === 1) {
      setArrastrando(true);
      ultimaPos.current = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    }
  };
  const onTouchMove = (ev) => {
    if (ev.touches.length === 2 && pinchDist.current) {
      ev.preventDefault();
      const nuevaDist = distTouch(ev.touches);
      const rect = contRef.current.getBoundingClientRect();
      const cx = (ev.touches[0].clientX + ev.touches[1].clientX) / 2 - rect.left;
      const cy = (ev.touches[0].clientY + ev.touches[1].clientY) / 2 - rect.top;
      aplicarZoom(nuevaDist / pinchDist.current, cx, cy);
      pinchDist.current = nuevaDist;
    } else if (ev.touches.length === 1 && arrastrando) {
      const dx = ev.touches[0].clientX - ultimaPos.current.x;
      const dy = ev.touches[0].clientY - ultimaPos.current.y;
      ultimaPos.current = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
    }
  };
  const onTouchEnd = () => {
    setArrastrando(false);
    pinchDist.current = null;
  };

  const reset = () => setTransform({ x: 0, y: 0, k: escalaInicial });
  const zoomBoton = (mult) => {
    const rect = contRef.current.getBoundingClientRect();
    aplicarZoom(mult, rect.width / 2, rect.height / 2);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "flex", flexDirection: "column", gap: 5 }}>
        <button className="psq-zoom-btn" onClick={() => zoomBoton(1.3)} title="Acercar" style={ESTILO_BOTON_ZOOM}>＋</button>
        <button className="psq-zoom-btn" onClick={() => zoomBoton(0.77)} title="Alejar" style={ESTILO_BOTON_ZOOM}>－</button>
        <button className="psq-zoom-btn" onClick={reset} title="Restablecer vista" style={{ ...ESTILO_BOTON_ZOOM, fontSize: 12 }}>⟲</button>
      </div>
      <div
        ref={contRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          height: altura, overflow: "hidden", borderRadius: 12,
          background: `radial-gradient(1200px 500px at 50% -10%, ${COLORS.primary}12, transparent 60%), ${COLORS.paperDark}`,
          boxShadow: `inset 0 0 0 1px ${COLORS.line}`,
          cursor: arrastrando ? "grabbing" : "grab", touchAction: "none", position: "relative",
        }}
      >
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
            transformOrigin: "0 0",
            transition: arrastrando ? "none" : "transform 0.08s linear",
            width: "100%", height: "100%",
          }}
        >
          {children}
        </div>
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, marginTop: 4, textAlign: "center" }}>
        rueda del mouse o pellizco para hacer zoom · arrastra para mover · {Math.round(transform.k * 100)}%
      </div>
    </div>
  );
}
const ESTILO_BOTON_ZOOM = {
  width: 30, height: 30, borderRadius: "50%", border: "none", background: COLORS.cardBg,
  color: COLORS.ink, fontSize: 15, fontWeight: 700, cursor: "pointer", lineHeight: 1,
  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
};

function LineaDeTiempoGlobal({ escuelas, modoEstudio, onIrAEscuela }) {
  const [hover, setHover] = useState(null);
  const anioDe = (e) => (ANIO_ORIGEN[e.id] ? ANIO_ORIGEN[e.id].anio : extraerAnio(e.fundamentacion || e.origenHistorico));
  const conAnio = escuelas.map((e) => ({ e, anio: anioDe(e) })).filter((x) => x.anio);

  const teorias = AUTORES_TEORICOS.map((a) => ({ a, anio: extraerAnio(a.obraNuclear) || extraerAnio(a.aporteSintesis) })).filter((x) => x.anio);
  // Color de una teoría fundante: el de la perspectiva de la escuela que
  // funda (esTambienEscuelaPropia) o, si solo es citada como fundamento
  // por otras, el de la primera escuela que la cita.
  const colorDeTeoria = (a) => {
    if (a.esTambienEscuelaPropia) {
      const esc = escuelas.find((e) => e.id === a.esTambienEscuelaPropia);
      if (esc) return PERSPECTIVA_COLOR[esc.perspectiva];
    }
    const citante = escuelas.find((e) => (e.fundamentosTeoricos || []).includes(a.id));
    return citante ? PERSPECTIVA_COLOR[citante.perspectiva] : COLORS.inkSoft;
  };

  if (conAnio.length === 0) return <VacioAviso texto="Ninguna escuela tiene un año identificable." />;

  const todosAnios = [...conAnio.map((x) => x.anio), ...teorias.map((x) => x.anio)];
  const anioMin = Math.min(...todosAnios) - 3;
  const anioMax = Math.max(...todosAnios, new Date().getFullYear() - 5) + 3;
  // Lienzo mucho más ancho y alto que antes (2200×520 vs. 1100×260):
  // ahora que hay zoom y desplazamiento, conviene separar más los puntos
  // en vez de apretarlos para que quepan en una vista fija — el usuario
  // hace zoom hacia la década que le interesa en vez de forzar toda la
  // línea de tiempo en una vista pequeña y saturada.
  const W = 2200, H = 520, PAD = 50;
  const x = (anio) => PAD + ((anio - anioMin) / (anioMax - anioMin)) * (W - PAD * 2);
  const yEje = H / 2;
  const decadas = [];
  for (let d = Math.ceil(anioMin / 10) * 10; d <= anioMax; d += 10) decadas.push(d);

  // Distribuye las escuelas en varias filas por encima/debajo del eje
  // para reducir solapamiento entre las ~74 escuelas, agrupando por
  // cercanía temporal en vez de alternar simplemente por índice.
  const filas = 5;
  const escuelasOrdenadas = [...conAnio].sort((a, b) => a.anio - b.anio);

  return (
    <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "20px 16px", marginBottom: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <ContenedorPanZoom altura={480} escalaMin={0.4} escalaMax={5} escalaInicial={0.6}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ overflow: "visible", display: "block" }}>
          <line x1={PAD} y1={yEje} x2={W - PAD} y2={yEje} stroke={COLORS.line} strokeWidth={2} />
          {decadas.map((d) => (
            <g key={d}>
              <line x1={x(d)} y1={yEje - 6} x2={x(d)} y2={yEje + 6} stroke={COLORS.line} strokeWidth={2} />
              <text x={x(d)} y={yEje + 26} textAnchor="middle" fontFamily={FONT_MONO} fontSize={13} fill={COLORS.inkSoft}>{d}</text>
            </g>
          ))}

          {teorias.map(({ a, anio }, i) => {
            const cy = yEje - 190;
            const activo = hover === `t-${a.id}`;
            const color = colorDeTeoria(a);
            const clicable = a.esTambienEscuelaPropia && escuelas.some((e) => e.id === a.esTambienEscuelaPropia);
            return (
              <g
                key={a.id}
                style={{ cursor: clicable ? "pointer" : "default" }}
                onMouseEnter={() => setHover(`t-${a.id}`)}
                onMouseLeave={() => setHover(null)}
                onClick={clicable ? () => onIrAEscuela && onIrAEscuela(a.esTambienEscuelaPropia) : undefined}
              >
                <line x1={x(anio)} y1={yEje} x2={x(anio)} y2={cy} stroke={color} strokeWidth={activo ? 2.5 : 1.3} opacity={activo ? 0.9 : 0.4} strokeDasharray="3,3" />
                <rect x={x(anio) - 6} y={cy - 6} width={12} height={12} transform={`rotate(45 ${x(anio)} ${cy})`} fill={color} stroke={COLORS.paper} strokeWidth={1.3} opacity={activo ? 1 : 0.8} />
                {activo && (
                  <>
                    <text x={x(anio)} y={cy - 16} textAnchor="middle" fontFamily={FONT_SERIF} fontWeight={700} fontSize={16} fill={color}>{anio}</text>
                    <text x={x(anio)} y={cy - 34} textAnchor="middle" fontFamily={FONT_MONO} fontSize={13} fill={COLORS.ink}>
                      {(a.autoresPrincipales || a.nombre).length > 40 ? (a.autoresPrincipales || a.nombre).slice(0, 38) + "…" : a.autoresPrincipales || a.nombre}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {escuelasOrdenadas.map(({ e, anio }, i) => {
            const fila = i % filas;
            const arriba = fila % 2 === 0;
            const distancia = 34 + Math.floor(fila / 2) * 32;
            const cy = arriba ? yEje + distancia : yEje - distancia + 100;
            const activo = hover === e.id;
            const color = PERSPECTIVA_COLOR[e.perspectiva];
            return (
              <g
                key={e.id}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover(e.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onIrAEscuela && onIrAEscuela(e.id)}
                onKeyDown={activarConTeclado(() => onIrAEscuela && onIrAEscuela(e.id))}
              >
                <line x1={x(anio)} y1={yEje} x2={x(anio)} y2={cy} stroke={color} strokeWidth={activo ? 2.5 : 1.3} opacity={activo ? 0.9 : 0.45} />
                <circle cx={x(anio)} cy={cy} r={activo ? 9 : 6} fill={color} stroke={COLORS.paper} strokeWidth={1.5} />
                {activo && (
                  <text
                    x={x(anio)}
                    y={arriba ? cy + 22 : cy - 16}
                    textAnchor="middle"
                    fontFamily={FONT_SERIF}
                    fontWeight={700}
                    fontSize={15}
                    fill={color}
                  >
                    {anio} · {e.nombre.length > 36 ? e.nombre.slice(0, 34) + "…" : e.nombre}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </ContenedorPanZoom>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8, justifyContent: "center" }}>
        {[...new Set(escuelas.map((e) => e.perspectiva))].map((persp) => (
          <span key={persp} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: PERSPECTIVA_COLOR[persp], display: "inline-block" }} />
            {persp}
          </span>
        ))}
        <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, fontStyle: "italic" }}>● escuela · ◆ teoría fundante — pasa el cursor o toca para ver el nombre</span>
      </div>
    </div>
  );
}

/* Mapa conceptual espacial: perspectivas como nodos-hub grandes, escuelas
   como satélites agrupados por subfamilia alrededor de su hub, todo
   posicionado en un lienzo 2D navegable con pan/zoom. Al hacer clic en
   una perspectiva, la vista "vuela" (zoom + desplazamiento animado) hacia
   ese cúmulo — como un marco de Prezi — en vez de simplemente desplegar
   una lista. Al hacer clic en una escuela se abre su ficha completa. */
// Vocabulario controlado para extraer UNA palabra clave ontológica de la
// prosa de cada escuela — igual que OBJETIVOS_CLINICOS, es una heurística
// por palabras clave, no una clasificación filosófica curada a mano.
const PALABRAS_CLAVE_ONTOLOGIA = [
  "fenomenológ", "fenomenolog", "constructiv", "positivis", "hermenéutic", "hermeneutic",
  "estructural", "empiris", "pragmatis", "holis", "mecanicis", "materialis",
  "realis", "idealis", "dialéctic", "dialectic", "sistémic", "sistemic",
  "cibernétic", "cibernetic", "conductis", "existencial", "transpersonal", "espiritual",
];
function palabraClaveOntologia(texto) {
  const t = (texto || "").toLowerCase();
  for (const kw of PALABRAS_CLAVE_ONTOLOGIA) {
    const idx = t.indexOf(kw);
    if (idx !== -1) {
      // Extrae la palabra completa a partir de la raíz encontrada (p. ej.
      // "fenomenológ" → "fenomenológica" o "fenomenología", lo que haya).
      const resto = t.slice(idx).match(/^[a-záéíóúñ]+/);
      return resto ? resto[0] : kw;
    }
  }
  return null;
}

// Busca años de nacimiento/muerte del autor principal de una escuela,
// cruzando el primer nombre de e.autores contra AUTORES_TEORICOS (donde
// autoresPrincipales suele traer el patrón "Nombre Apellido (aaaa-aaaa)").
// Es un cruce por apellido, best-effort: no todas las escuelas tienen a
// su autor principal como nodo propio en AUTORES_TEORICOS, en cuyo caso
// se muestra solo el nombre sin años.
function buscarAniosAutor(escuela) {
  const primerAutor = (escuela.autores || "").split(/[;,]/)[0]?.trim();
  if (!primerAutor) return null;
  const apellido = primerAutor.split(" ").pop();
  if (!apellido || apellido.length < 3) return null;
  const match = AUTORES_TEORICOS.find((a) => (a.autoresPrincipales || "").includes(apellido));
  if (!match) return null;
  const m = (match.autoresPrincipales || "").match(/\((\d{4})\s*[-–]\s*(\d{4}|\S*)\)/);
  return m ? `${m[1]}–${m[2]}` : null;
}

// Nombre corto de subfamilia para la etiqueta siempre visible del nodo:
// quita la numeración inicial ("1. ", "4. ") y recorta a ~5 palabras.
function nombreCortoSubfamilia(sf) {
  if (!sf) return "otras";
  const sinNumero = sf.replace(/^\d+\.\s*/, "");
  const palabras = sinNumero.split(" ");
  return palabras.length > 5 ? palabras.slice(0, 5).join(" ") + "…" : sinNumero;
}

function MapaConceptualEscuelas({ escuelas, onIrAEscuela }) {
  const [seleccionId, setSeleccionId] = useState(null);
  const [foco, setFoco] = useState(null); // null = vista general
  const [perspFocalizada, setPerspFocalizada] = useState(null);

  const W = 2200, H = 1700;
  const cx = W / 2, cy = H / 2;
  const perspectivas = [...new Set(escuelas.map((e) => e.perspectiva))];
  const RADIO_HUBS = 620;

  // Layout determinista: un hub por perspectiva en círculo alrededor del
  // centro; dentro de cada hub, sus escuelas en un anillo propio,
  // agrupadas por subfamilia (mismo ángulo aproximado) para que las
  // divisiones internas se noten espacialmente, no solo por color.
  const layout = useMemo(() => {
    const hubs = perspectivas.map((persp, i) => {
      const angulo = (i / perspectivas.length) * 2 * Math.PI - Math.PI / 2;
      const idPersp = PERSPECTIVA_ID_POR_NOMBRE[persp];
      const fund = FUNDAMENTOS_PERSPECTIVAS.find((f) => f.id === idPersp);
      return { persp, x: cx + RADIO_HUBS * Math.cos(angulo), y: cy + RADIO_HUBS * Math.sin(angulo), color: PERSPECTIVA_COLOR[persp], fund };
    });
    const nodos = [];
    hubs.forEach((hub) => {
      const escuelasP = escuelas.filter((e) => e.perspectiva === hub.persp);
      const subfamilias = [...new Set(escuelasP.map((e) => e.subfamilia || "otras"))];
      const anguloSub = (2 * Math.PI) / subfamilias.length;
      subfamilias.forEach((sf, si) => {
        const escuelasSf = escuelasP.filter((e) => (e.subfamilia || "otras") === sf);
        const anguloBase = si * anguloSub;
        escuelasSf.forEach((e, ei) => {
          // Distribuye en 2 anillos concéntricos dentro del sector de la
          // subfamilia para que no queden todas apiladas en una sola línea.
          const anillo = 150 + (ei % 2) * 80;
          const jitter = (Math.floor(ei / 2) - escuelasSf.length / 4) * (anguloSub / Math.max(escuelasSf.length / 2, 1));
          const ang = anguloBase + anguloSub / 2 + jitter;
          // Etiqueta siempre visible: SOLO el nombre de la subfamilia
          // (abreviado). El resto (autor, años, definición) vive en el
          // recuadro que se abre al hacer clic, no permanentemente en el
          // lienzo — así el mapa queda legible con las ~74 escuelas.
          nodos.push({
            e, hub, subfamilia: sf, etiqueta: nombreCortoSubfamilia(sf), aniosAutor: buscarAniosAutor(e),
            x: hub.x + anillo * Math.cos(ang),
            y: hub.y + anillo * Math.sin(ang),
          });
        });
      });
    });
    // Radio de "territorio" de cada hub: debe abarcar realmente el
    // cúmulo de satélites que contiene (antes era un círculo fijo de
    // r=70 que no correspondía a nada — los satélites llegaban hasta
    // ~230 de distancia y quedaban muy por fuera del círculo dibujado,
    // lo que hacía que el círculo pareciera un adorno sin sentido).
    hubs.forEach((hub) => {
      const distancias = nodos.filter((n) => n.hub.persp === hub.persp).map((n) => Math.hypot(n.x - hub.x, n.y - hub.y));
      hub.radioTerritorio = distancias.length > 0 ? Math.max(...distancias) + 45 : 90;
    });
    return { hubs, nodos };
  }, [escuelas]);

  const volarA = (x, y, k) => {
    const anchoVisible = 900;
    const altoVisible = 560;
    setFoco({ x: anchoVisible / 2 - x * k, y: altoVisible / 2 - y * k, k });
  };

  const irAHub = (hub) => {
    setPerspFocalizada(hub.persp);
    setSeleccionId(null);
    volarA(hub.x, hub.y, 1.15);
  };
  const volverAVistaGeneral = () => {
    setPerspFocalizada(null);
    setSeleccionId(null);
    setFoco({ x: 900 / 2 - cx * 0.4, y: 560 / 2 - cy * 0.4, k: 0.4 });
  };

  // El panel de detalle se controla por CLIC, no por hover: con hover,
  // mover el cursor desde el punto hacia el panel de abajo para leerlo
  // con calma cerraba el panel a mitad de camino (además de contribuir
  // al parpadeo, porque el texto que aparecía/desaparecía cambiaba la
  // geometría bajo el propio cursor). Con clic, la selección se queda
  // fija hasta elegir otra cosa.
  const nodoSeleccion = layout.nodos.find((n) => n.e.id === seleccionId);

  // Buscador que "vuela" directo a una escuela por nombre, sin tener que
  // ubicarla manualmente dentro del territorio de su perspectiva.
  const [buscarEscuela, setBuscarEscuela] = useState("");
  const coincidenciasBusqueda =
    buscarEscuela.trim().length >= 2
      ? layout.nodos.filter((n) => n.e.nombre.toLowerCase().includes(buscarEscuela.trim().toLowerCase())).slice(0, 6)
      : [];
  const volarANodo = (n) => {
    setPerspFocalizada(n.hub.persp);
    setSeleccionId(n.e.id);
    volarA(n.x, n.y, 2.2);
    setBuscarEscuela("");
  };

  return (
    <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "18px 16px", marginBottom: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ position: "relative", maxWidth: 280, marginBottom: 10 }}>
        <input
          value={buscarEscuela}
          onChange={(ev) => setBuscarEscuela(ev.target.value)}
          placeholder="Ir directo a una escuela…"
          style={{ ...CAMPO_STYLE, fontSize: 12.5, fontFamily: "var(--f-text)", padding: "6px 10px" }}
        />
        {coincidenciasBusqueda.length > 0 && (
          <div style={{ position: "absolute", zIndex: 6, top: "100%", left: 0, right: 0, background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, marginTop: 3 }}>
            {coincidenciasBusqueda.map((n) => (
              <div
                key={n.e.id}
                onClick={() => volarANodo(n)}
                style={{ padding: "6px 10px", cursor: "pointer", borderBottom: `1px solid ${COLORS.line}`, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: n.hub.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "Georgia,serif", fontSize: 12.5 }}>{n.e.nombre}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8, alignItems: "center" }}>
        <button
          onClick={volverAVistaGeneral}
          style={{
            fontFamily: FONT_MONO, fontSize: 10.5, padding: "6px 13px", borderRadius: 16, cursor: "pointer",
            border: `1px solid ${COLORS.primaryDark}`, background: !perspFocalizada ? COLORS.primaryDark : "transparent", color: !perspFocalizada ? COLORS.cardBg : COLORS.primaryDark,
            transform: !perspFocalizada ? "scale(1.04)" : "scale(1)", boxShadow: !perspFocalizada ? `0 3px 10px ${COLORS.primaryDark}45` : "none",
            transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
          }}
        >
          ⊙ vista general
        </button>
        {layout.hubs.map((hub) => (
          <button
            key={hub.persp}
            onClick={() => irAHub(hub)}
            style={{
              fontFamily: FONT_MONO, fontSize: 10.5, padding: "6px 13px", borderRadius: 16, cursor: "pointer",
              border: `1.5px solid ${hub.color}`, background: perspFocalizada === hub.persp ? hub.color : "transparent", color: perspFocalizada === hub.persp ? COLORS.cardBg : hub.color, fontWeight: 700,
              transform: perspFocalizada === hub.persp ? "scale(1.04)" : "scale(1)", boxShadow: perspFocalizada === hub.persp ? `0 3px 10px ${hub.color}55` : "none",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
            }}
          >
            {hub.persp}
          </button>
        ))}
      </div>

      <ContenedorPanZoom altura={560} escalaMin={0.25} escalaMax={5} escalaInicial={0.4} focoExterno={foco}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ overflow: "visible", display: "block" }}>
          {/* Líneas de hub a cada escuela */}
          {layout.nodos.map((n) => (
            <line
              key={"l-" + n.e.id}
              x1={n.hub.x} y1={n.hub.y} x2={n.x} y2={n.y}
              stroke={n.hub.color} strokeWidth={seleccionId === n.e.id ? 2.5 : 1} opacity={seleccionId === n.e.id ? 0.8 : 0.22}
            />
          ))}

          {/* Territorio + hub de cada perspectiva. El círculo grande ahora
              SÍ corresponde a algo: es la envolvente real del cúmulo de
              escuelas de esa perspectiva (radioTerritorio calculado en el
              layout), no un adorno de tamaño arbitrario. */}
          {layout.hubs.map((hub) => (
            <g key={hub.persp} style={{ cursor: "pointer" }} onClick={() => irAHub(hub)}>
              <circle cx={hub.x} cy={hub.y} r={hub.radioTerritorio} fill={hub.color} opacity={0.06} stroke={hub.color} strokeWidth={1.5} strokeDasharray="6,5" />
              <circle cx={hub.x} cy={hub.y} r={16} fill={hub.color} />
              <text x={hub.x} y={hub.y - hub.radioTerritorio - 18} textAnchor="middle" fontFamily={FONT_SERIF} fontWeight={700} fontSize={26} fill={hub.color}>
                {hub.persp}
              </text>
            </g>
          ))}

          {/* Escuelas satélite: círculo de tamaño CONSTANTE (no cambia con
              la selección) para que la geometría bajo el cursor nunca se
              mueva — esa era la causa real del parpadeo, no el hover en
              sí. La etiqueta corta va siempre visible debajo del punto. */}
          {layout.nodos.map((n) => {
            const activo = seleccionId === n.e.id;
            return (
              <g
                key={n.e.id}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={() => setSeleccionId(n.e.id)}
                onKeyDown={activarConTeclado(() => setSeleccionId(n.e.id))}
              >
                <circle cx={n.x} cy={n.y} r={10} fill={n.hub.color} stroke={activo ? COLORS.gold : COLORS.paper} strokeWidth={activo ? 3 : 1.5} opacity={0.9} />
                <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={700} fontSize={9} fill={COLORS.onAcento} style={{ pointerEvents: "none" }}>
                  {n.e.nombre.charAt(0)}
                </text>
                <text
                  x={n.x}
                  y={n.y + 22}
                  textAnchor="middle"
                  fontFamily={FONT_MONO}
                  fontWeight={activo ? 700 : 400}
                  fontSize={11}
                  fill={activo ? n.hub.color : COLORS.inkSoft}
                  style={{ pointerEvents: "none" }}
                >
                  {n.etiqueta}
                </text>
              </g>
            );
          })}
        </svg>
      </ContenedorPanZoom>

      {nodoSeleccion && (
        <div style={{ marginTop: 8, background: COLORS.paperDark, borderLeft: `4px solid ${nodoSeleccion.hub.color}`, borderRadius: 5, padding: "10px 14px", maxWidth: 420 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: nodoSeleccion.hub.color, textTransform: "uppercase" }}>
              {nodoSeleccion.hub.persp} · {nodoSeleccion.subfamilia}
            </div>
            <button onClick={() => setSeleccionId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.inkSoft, fontFamily: FONT_MONO, fontSize: 11 }}>
              ✕ cerrar
            </button>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => onIrAEscuela && onIrAEscuela(nodoSeleccion.e.id)}
            onKeyDown={activarConTeclado(() => onIrAEscuela && onIrAEscuela(nodoSeleccion.e.id))}
            style={{ cursor: "pointer" }}
            title="Abrir la ficha completa de esta escuela"
          >
            <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 15, marginTop: 2, textDecoration: "underline", textDecorationColor: COLORS.line }}>
              {nodoSeleccion.e.nombre}
            </div>
          </div>
          {/* Solo lo pedido: autor, años de nacimiento/muerte (si se
              encuentran por cruce con AUTORES_TEORICOS), año de fundación
              de la escuela y definición — nada de ontología/epistemología
              aquí (esas quedan reservadas a la ficha completa). */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 10px", marginTop: 4, fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.inkSoft }}>
            {nodoSeleccion.e.autores && <span>👤 {nodoSeleccion.e.autores}</span>}
            {nodoSeleccion.aniosAutor && <span>· {nodoSeleccion.aniosAutor}</span>}
            {ANIO_ORIGEN[nodoSeleccion.e.id] && <span>· escuela fundada ≈ {ANIO_ORIGEN[nodoSeleccion.e.id].anio}</span>}
          </div>
          <p style={{ margin: "6px 0 0", fontFamily: "var(--f-text)", fontSize: 12, color: COLORS.ink, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {truncarConSentido(nodoSeleccion.e.fundamentacion, 150, 70)}
          </p>
        </div>
      )}
      {!nodoSeleccion && (
        <p style={{ margin: "8px 2px 0", fontFamily: "var(--f-text)", fontSize: 11.5, color: COLORS.inkSoft, fontStyle: "italic" }}>
          Cada punto muestra el nombre de su subfamilia. Clic en una perspectiva para acercarte a su territorio; clic en un punto para abrir su recuadro (autor, años, fundación y definición) fijo aquí abajo; clic en el nombre del recuadro para abrir la ficha completa.
        </p>
      )}
    </div>
  );
}

const ESCUELA_REPRESENTATIVA_POR_PERSPECTIVA = {
  "Psicodinámica": { id: "p1", motivo: "el psicoanálisis clásico de Freud, punto de partida histórico de toda la perspectiva" },
  "Humanista-existencial": { id: "h1", motivo: "el Enfoque Centrado en la Persona de Rogers, cofundador del movimiento humanista" },
  "Conductual": { id: "c1", motivo: "la desensibilización sistemática de Wolpe, primer protocolo conductual sistematizado" },
  "Cognitivo-Conductual": { id: "c3", motivo: "la Terapia Cognitiva de Beck, la más citada e investigada de la perspectiva" },
  "Sistémica": { id: "s2", motivo: "la Terapia Estructural de Minuchin, uno de los modelos sistémicos más influyentes" },
  "Transpersonal": { id: "t1", motivo: "la psicología humanista-transpersonal de Maslow, puente hacia lo transpersonal" },
  "Integradora": { id: "i2", motivo: "el Eclecticismo Técnico de Lazarus, pionero explícito del movimiento de integración" },
};

function DetalleCobertura({ escuelas, enlaces, glosario, protocolos, nudos }) {
  const [abierto, setAbierto] = useState(false);
  const stats = [
    { n: 7, label: "perspectivas", color: COLORS.ink },
    { n: escuelas.length, label: "escuelas", color: COLORS.garnet },
    { n: enlaces.length, label: "enlaces traslacionales", color: COLORS.clay },
    { n: glosario.length, label: "términos de glosario", color: COLORS.sage },
    { n: protocolos, label: "protocolos y técnicas", color: COLORS.gold },
    { n: nudos, label: "nudos temáticos", color: COLORS.ink },
  ];
  return (
    <div style={{ marginBottom: 22 }}>
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 0",
          color: COLORS.inkSoft,
          fontFamily: "var(--f-mono)",
          fontSize: 11,
        }}
      >
        <span>
          {escuelas.length} escuelas · {glosario.length} términos · {protocolos} protocolos y técnicas — alcance completo del contenido
        </span>
        <ChevronDown size={12} style={{ transform: abierto ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", flexShrink: 0 }} />
      </button>
      {abierto && (
        <div
          className="psq-fade-in"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(120px, 100%), 1fr))", gap: 10, marginTop: 10 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="psq-tarjeta-viva" style={{ background: COLORS.cardBg, borderLeft: `1px solid ${COLORS.line}`, borderRight: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}`, borderTop: `3px solid ${s.color}`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: 22, color: s.color }}>{s.n}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.inkSoft, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Una línea por perspectiva para la introducción (síntesis orientativa de redacción propia). */
const RESUMEN_PERSPECTIVA = {
  humanista: "El sufrimiento como bloqueo del crecimiento y del sentido; el cambio nace de la relación y de la experiencia presente.",
  psicodinamica: "El sufrimiento como conflicto en gran parte inconsciente; el cambio llega al hacer consciente lo que se repite.",
  sistemica: "El problema vive en las relaciones; se cambia el sistema y no solo a la persona.",
  conductual: "La conducta se aprende en contextos; se cambia modificando sus antecedentes y consecuencias.",
  cognitivo: "El malestar depende de cómo se interpreta lo que ocurre; se cambia examinando pensamientos y conductas.",
  integradora: "Combina recursos de varios enfoques según la persona, el momento y la evidencia.",
  transpersonal: "Incluye la dimensión espiritual y los estados ampliados de conciencia en el proceso de cambio.",
};

function ModuloIntroduccion({ irA, modoEstudio, setModoEstudio, escuelas, onIrAEscuela, enlaces }) {
  const perspectivas = FUNDAMENTOS_PERSPECTIVAS;
  const camposTablaIntro = [
    { key: "definicion", label: "Definición", get: (p) => p.contexto?.definicion },
    { key: "ontologia", label: "Ontología del psiquismo", get: (p) => p.ontologia },
    { key: "criterioVerdad", label: "Criterio de verdad", get: (p) => p.criterioVerdad },
    { key: "rolTerapeuta", label: "Rol del terapeuta", get: (p) => p.contexto?.rolTerapeuta },
  ];
  return (
    <div className="psq-aparece">
      <HeroMision
        perspectivas={perspectivas.map((p) => ({ id: p.id, nombre: p.nombre, corto: NOMBRE_CORTO_PERSPECTIVA[p.id] || p.nombre, color: PERSPECTIVA_COLOR[p.nombre] }))}
        totalEscuelas={escuelas.length}
        totalTerminos={GLOSARIO.length}
        onIrAFundamentos={() => irA("fundamentos")}
        onIrAComparar={() => irA("comparacion")}
        onModoEstudio={setModoEstudio ? () => setModoEstudio((v) => !v) : undefined}
      />
      {modoEstudio && <AdivinaEscuela escuelas={escuelas} glosario={GLOSARIO} anioOrigen={ANIO_ORIGEN} colorDe={(p) => PERSPECTIVA_COLOR[p]} onIrAEscuela={onIrAEscuela} />}
      <CreditosFotos />
      {modoEstudio && <RetoRetratos />}
      {modoEstudio && <TarjetasRepaso glosario={GLOSARIO} escuelas={escuelas} colorDe={(p) => PERSPECTIVA_COLOR[p]} />}


      {/* Resumen de cobertura: discreto por defecto (una línea elegante),
          con el desglose completo disponible al desplegar — evita que la
          app abra con una pared de cifras compitiendo con el contenido. */}
      <DetalleCobertura
        escuelas={escuelas}
        enlaces={ENLACES_SEED}
        glosario={GLOSARIO}
        protocolos={Object.keys(PROTOCOLOS_SEED).length + Object.values(PROCEDIMIENTOS_CLINICOS).reduce((a, v) => a + v.length, 0)}
        nudos={CONCEPTOS_TRANSVERSALES.length}
      />

      {setModoEstudio && modoEstudio && (
        <div className="psn-barra-estudio">
          <span>◆ Modo estudio activo: todo se muestra extendido y sin truncar.</span>
          <button onClick={() => setModoEstudio(false)}>Desactivar</button>
        </div>
      )}

      {modoEstudio && (
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.gold, marginBottom: 10, fontWeight: 700 }}>
          ◆ modo estudio — tarjetas expandidas con historia y dilemas, no solo la definición
        </div>
      )}

      {!modoEstudio && (
        <div className="psn-persp-lista" role="list">
          {perspectivas.map((p) => {
            const color = PERSPECTIVA_COLOR[p.nombre];
            const def = p.contexto?.definicion || p.origenHistorico || "";
            const resumen = RESUMEN_PERSPECTIVA[p.id] || def.slice(0, 120) + "…";
            return (
              <details key={p.id} className="psn-persp" style={{ "--pc": color }} role="listitem">
                <summary>
                  <b>{p.nombre}</b>
                  <span>{resumen}</span>
                </summary>
                <div className="psn-persp-cuerpo">
                  <RetratosPerspectiva id={p.id} color={color} />
                  <p>{def}</p>
                  <Boton variant="ghost" onClick={() => irA("fundamentos")}>Ver esta perspectiva →</Boton>
                </div>
              </details>
            );
          })}
        </div>
      )}
      {modoEstudio && (
      <div style={{ display: "grid", gridTemplateColumns: modoEstudio ? "1fr" : "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
        {perspectivas.map((p) => {
          const color = PERSPECTIVA_COLOR[p.nombre];
          return (
            <div
              key={p.id}
              onClick={() => irA("fundamentos")}
              className="psq-tarjeta-viva"
              style={{ background: COLORS.cardBg, borderLeft: `1px solid ${COLORS.line}`, borderRight: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}`, borderTop: `4px solid ${color}`, borderRadius: 12, padding: 16, cursor: "pointer" }}
            >
              <RetratosPerspectiva id={p.id} color={color} />
              <Sello color={color}>{p.nombre}</Sello>
              {modoEstudio ? (
                <>
                  <p style={{ margin: "10px 0 6px", fontFamily: "var(--f-text)", fontSize: 13, lineHeight: 1.6, color: COLORS.ink }}>
                    {p.contexto?.definicion || p.origenHistorico}
                  </p>
                  {p.contexto?.historia && (
                    <>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, textTransform: "uppercase", marginTop: 8 }}>Historia y surgimiento</div>
                      <p style={{ margin: "3px 0 6px", fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.55, color: COLORS.inkSoft }}>{p.contexto.historia}</p>
                    </>
                  )}
                  {p.contexto?.dilemas && (
                    <>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, textTransform: "uppercase", marginTop: 8 }}>Evolución y dilemas</div>
                      <p style={{ margin: "3px 0 0", fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.55, color: COLORS.inkSoft }}>{p.contexto.dilemas}</p>
                    </>
                  )}
                </>
              ) : (
                <p style={{ margin: "10px 0 0", fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5, color: COLORS.ink }}>
                  {(p.contexto?.definicion?.slice(0, 200) || p.origenHistorico.slice(0, 200))}…
                </p>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Tabla comparativa compacta: un primer contraste de las 7
          perspectivas lado a lado, antes de profundizar en cualquiera de
          ellas — reutiliza el mismo componente TablaComparativa del
          Módulo de Comparación, con solo 4 campos para no saturar a
          alguien que recién entra a la app. */}
      <details className="psn-detalles" open={modoEstudio || undefined}>
        <summary>Primer contraste <small>— las 7 perspectivas lado a lado</small></summary>
        <div style={{ padding: "6px 14px 14px" }}>
      <TablaComparativa
        entidades={perspectivas}
        campos={camposTablaIntro}
        colorDe={(p) => PERSPECTIVA_COLOR[p.nombre] || COLORS.primary}
        idDe={(p) => p.id}
        nombreDe={(p) => p.nombre}
        truncarA={modoEstudio ? undefined : 140}
      />
        </div>
      </details>

      {/* Línea de tiempo global: TODAS las escuelas y TODAS las teorías
          fundantes (AUTORES_TEORICOS) de las 7 perspectivas en un solo
          eje, coloreadas por perspectiva de origen — a diferencia de la
          línea de tiempo por perspectiva del Módulo de Escuelas, esta da
          una vista panorámica de cómo se entrelazó históricamente todo
          el campo. */}
      <details className="psn-detalles" open={modoEstudio || undefined}>
        <summary>Línea de tiempo <small>— escuelas y teorías fundantes</small></summary>
        <div style={{ padding: "6px 14px 14px" }}>
      <LineaTiempoGlobal
        escuelas={escuelas}
        anioDe={(e) => (ANIO_ORIGEN[e.id] ? ANIO_ORIGEN[e.id].anio : extraerAnio(e.fundamentacion || e.origenHistorico))}
        colorDe={(p) => PERSPECTIVA_COLOR[p]}
        perspectivas={nombresPerspectivas(escuelas)}
        onIrAEscuela={onIrAEscuela}
      />
        </div>
      </details>

      {/* Mapa conceptual: árbol perspectiva → subfamilia → escuela,
          coloreado por perspectiva, con la definición de cada escuela
          disponible al pasar el cursor o tocar (sin tener que abrir la
          ficha completa para tener una primera idea de qué es). */}
      <details className="psn-detalles" open={modoEstudio || undefined}>
        <summary>Mapa conceptual <small>— las escuelas y sus divisiones</small></summary>
        <div style={{ padding: "6px 14px 14px" }}>
      <MapaRed
        escuelas={escuelas}
        enlaces={enlaces || ENLACES_SEED}
        colorDe={(p) => PERSPECTIVA_COLOR[p]}
        perspectivas={nombresPerspectivas(escuelas)}
        nombreCorto={(p) => NOMBRE_CORTO_PERSPECTIVA[PERSPECTIVA_ID_POR_NOMBRE[p]] || p}
        onIrAEscuela={onIrAEscuela}
      />
        </div>
      </details>

    </div>
  );
}

/* Tabla comparativa genérica: filas = categorías, columnas = entidades
   (perspectivas o escuelas). Pensada para ver de un vistazo TODAS las
   categorías a la vez en vez de cambiar de pestaña una por una — la
   vista de tarjetas de abajo sigue existiendo para lectura profunda de
   una sola categoría. Cada celda usa TextoConCitas con `truncar` para no
   desbordar la tabla con párrafos largos; "leer más" expande in situ. */
function TablaComparativa({ entidades, campos, colorDe, idDe, nombreDe, onClickEntidad, truncarA = 200 }) {
  const [expandidas, setExpandidas] = useState(() => new Set());
  const [ocultarVacias, setOcultarVacias] = useState(false);
  const [filaHover, setFilaHover] = useState(null);
  const toggleCelda = (k) =>
    setExpandidas((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });

  if (entidades.length === 0) {
    return <VacioAviso texto="Selecciona al menos una entidad para comparar." />;
  }

  // "Ocultar filas sin contenido" — antes, comparar 4-5 escuelas con
  // categorías poco pobladas (p. ej. "unidad de análisis" en escuelas
  // recién creadas) dejaba la tabla llena de guiones "— sin registrar —"
  // que obligaban a hacer scroll vertical sin aportar nada comparativo.
  // Aquí se filtra por fila, no por columna: una fila se oculta solo si
  // NINGUNA de las entidades seleccionadas tiene contenido en ese campo.
  const camposVisibles = ocultarVacias ? campos.filter((c) => entidades.some((ent) => !!c.get(ent))) : campos;
  const nOcultos = campos.length - camposVisibles.length;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.inkSoft, cursor: "pointer" }}>
          <input type="checkbox" checked={ocultarVacias} onChange={(ev) => setOcultarVacias(ev.target.checked)} />
          Ocultar categorías sin contenido en ninguna de estas entidades
        </label>
        {ocultarVacias && nOcultos > 0 && (
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft }}>({nOcultos} oculta{nOcultos !== 1 ? "s" : ""})</span>
        )}
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, marginLeft: "auto" }}>
          clic en una celda para expandirla · clic en el encabezado para abrir la ficha
        </span>
        <BotonExportarImagen
          onClick={() =>
            exportarTablaComoImagen({
              titulo: "Tabla comparativa",
              columnas: [{ label: "Categoría" }, ...entidades.map((ent) => ({ label: nombreDe(ent) }))],
              filas: camposVisibles.map((c) => [c.label, ...entidades.map((ent) => c.get(ent) || "—")]),
              colorAcento: COLORS.ink,
            })
          }
        />
      </div>
      <div style={{ overflowX: "auto", maxWidth: "100%", border: `1px solid ${COLORS.line}`, borderRadius: 12, maxHeight: "70vh", overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `160px repeat(${entidades.length}, minmax(min(220px, 100%), 1fr))`, minWidth: 160 + entidades.length * 220 }}>
          {/* Cabecera de columnas */}
          <div style={{ background: COLORS.paperDark, borderBottom: `2px solid ${COLORS.line}`, padding: 8, position: "sticky", top: 0, left: 0, zIndex: 3 }} />
          {entidades.map((ent) => (
            <div
              key={idDe(ent)}
              onClick={onClickEntidad ? () => onClickEntidad(ent) : undefined}
              style={{
                background: colorDe(ent),
                color: COLORS.onAcento,
                borderBottom: `2px solid ${COLORS.line}`,
                padding: "8px 10px",
                fontFamily: "Georgia,serif",
                fontWeight: 700,
                fontSize: 12.5,
                cursor: onClickEntidad ? "pointer" : "default",
                position: "sticky",
                top: 0,
                zIndex: 2,
              }}
            >
              {nombreDe(ent)}
            </div>
          ))}
          {/* Filas por categoría */}
          {camposVisibles.map((c, i) => (
            <React.Fragment key={c.key}>
              <div
                onMouseEnter={() => setFilaHover(c.key)}
                onMouseLeave={() => setFilaHover((f) => (f === c.key ? null : f))}
                style={{
                  background: filaHover === c.key ? COLORS.hoverEtiqueta : COLORS.paperDark,
                  borderTop: i > 0 ? `1px solid ${COLORS.line}` : "none",
                  borderRight: `1px solid ${COLORS.line}`,
                  padding: "10px 8px",
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLORS.inkSoft,
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  transition: "background 0.12s",
                }}
              >
                {c.label}
              </div>
              {entidades.map((ent) => {
                const texto = c.get(ent);
                const key = idDe(ent) + "|" + c.key;
                const expandida = expandidas.has(key);
                return (
                  <div
                    key={key}
                    onMouseEnter={() => setFilaHover(c.key)}
                    onMouseLeave={() => setFilaHover((f) => (f === c.key ? null : f))}
                    onClick={texto && texto.length > truncarA ? () => toggleCelda(key) : undefined}
                    style={{
                      borderTop: i > 0 ? `1px solid ${COLORS.line}` : "none",
                      borderLeft: `1px solid ${COLORS.line}`,
                      padding: "10px 10px",
                      background: filaHover === c.key ? COLORS.hover : COLORS.cardBg,
                      cursor: texto && texto.length > truncarA ? "pointer" : "default",
                      transition: "background 0.12s",
                    }}
                  >
                    {texto ? (
                      <>
                        <TextoConCitas texto={texto} tamano={12} truncar={expandida ? undefined : truncarA} />
                        {texto.length > truncarA && (
                          <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.garnet }}>{expandida ? "▲ contraer" : "▼ ver todo"}</span>
                        )}
                      </>
                    ) : (
                      <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.inkSoft, fontStyle: "italic" }}>— sin registrar —</span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft }}>
        {camposVisibles.length} categorías × {entidades.length} entidades
      </div>
    </div>
  );
}

/* Selector de escuelas para el modo "Escuelas" del comparador: búsqueda +
   chips removibles, con un tope de 5 (más allá de eso la tabla deja de
   ser legible en pantallas normales). */
function SelectorEscuelasComparador({ escuelas, seleccionadas, setSeleccionadas, maxSeleccion = 5 }) {
  const [q, setQ] = useState("");
  const disponibles = useMemo(() => {
    if (!q.trim()) return [];
    const f = q.toLowerCase();
    return escuelas.filter((e) => !seleccionadas.includes(e.id) && (e.nombre.toLowerCase().includes(f) || e.autores.toLowerCase().includes(f))).slice(0, 8);
  }, [q, escuelas, seleccionadas]);
  const escuelasSel = seleccionadas.map((id) => escuelas.find((e) => e.id === id)).filter(Boolean);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {escuelasSel.map((e) => {
          const color = PERSPECTIVA_COLOR[e.perspectiva] || COLORS.primary;
          return (
            <span
              key={e.id}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontFamily: FONT_MONO, fontSize: 11, color: COLORS.onAcento, background: color,
                borderRadius: 14, padding: "3px 6px 3px 10px",
              }}
            >
              {e.nombre}
              <button
                onClick={() => setSeleccionadas(seleccionadas.filter((id) => id !== e.id))}
                aria-label={`Quitar ${e.nombre} de la comparación`}
                style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: "50%", color: COLORS.cardBg, cursor: "pointer", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={10} />
              </button>
            </span>
          );
        })}
        {escuelasSel.length === 0 && (
          <span style={{ fontFamily: "ui-serif,Georgia,serif", fontStyle: "italic", fontSize: 12, color: COLORS.inkSoft }}>
            Ninguna escuela seleccionada todavía — busca abajo y añade hasta {maxSeleccion}.
          </span>
        )}
      </div>
      {seleccionadas.length < maxSeleccion && (
        <div style={{ position: "relative", maxWidth: 360 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Buscar escuela para añadir (${seleccionadas.length}/${maxSeleccion})…`}
            style={{ width: "100%", padding: "7px 10px", fontSize: 12.5, fontFamily: "var(--f-text)", border: `1px solid ${COLORS.line}`, borderRadius: 4 }}
          />
          {disponibles.length > 0 && (
            <div style={{ position: "absolute", zIndex: 5, top: "100%", left: 0, right: 0, background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 8, marginTop: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
              {disponibles.map((e) => (
                <div
                  key={e.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSeleccionadas([...seleccionadas, e.id]);
                    setQ("");
                  }}
                  onKeyDown={activarConTeclado(() => {
                    setSeleccionadas([...seleccionadas, e.id]);
                    setQ("");
                  })}
                  style={{ padding: "6px 10px", cursor: "pointer", fontFamily: "ui-serif,Georgia,serif", fontSize: 12.5, borderBottom: `1px solid ${COLORS.line}` }}
                >
                  <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: PERSPECTIVA_COLOR[e.perspectiva], marginRight: 6 }}>{e.perspectiva}</span>
                  {e.nombre}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ModuloComparacion({ escuelas, onIrAEscuela, modoEstudio, enlaces }) {
  const perspectivas = FUNDAMENTOS_PERSPECTIVAS;
  const [campo, setCampo] = useState("definicion");
  // Antes este módulo solo exponía los 6 campos narrativos guardados bajo
  // `p.contexto`, dejando fuera precisamente las cuatro coordenadas
  // filosóficas (ontología, epistemología, metodología, criterio de
  // verdad) que son el eje central de la app y que
  // ya existen, completas, como campos de nivel superior de cada
  // perspectiva — simplemente no estaban conectadas a esta pantalla. Se
  // añaden aquí junto con unidad de análisis y relación mente-cuerpo, que
  // completan las siete coordenadas filosóficas documentadas por
  // perspectiva. `get` desacopla el origen del dato (contexto vs. nivel
  // superior) de la lista de pestañas.
  const campos = [
    { key: "definicion", label: "Definición", grupo: "narrativo", get: (p) => p.contexto?.definicion },
    { key: "historia", label: "Historia y surgimiento", grupo: "narrativo", get: (p) => p.contexto?.historia },
    { key: "dilemas", label: "Evolución y dilemas", grupo: "narrativo", get: (p) => p.contexto?.dilemas },
    { key: "psicopatologia", label: "Psicopatología", grupo: "narrativo", get: (p) => p.contexto?.psicopatologia },
    { key: "rolTerapeuta", label: "Rol del terapeuta", grupo: "narrativo", get: (p) => p.contexto?.rolTerapeuta },
    { key: "mecanismosCambio", label: "Mecanismos de cambio", grupo: "narrativo", get: (p) => p.contexto?.mecanismosCambio },
    { key: "ontologia", label: "Ontología del psiquismo", grupo: "filosofico", get: (p) => p.ontologia },
    { key: "epistemologia", label: "Epistemología", grupo: "filosofico", get: (p) => p.epistemologia },
    { key: "metodologia", label: "Metodología", grupo: "filosofico", get: (p) => p.metodologia },
    { key: "criterioVerdad", label: "Criterio de verdad", grupo: "filosofico", get: (p) => p.criterioVerdad },
    { key: "unidadAnalisis", label: "Unidad de análisis", grupo: "filosofico", get: (p) => p.unidadAnalisis },
    { key: "relacionMenteCuerpo", label: "Relación mente-cuerpo", grupo: "filosofico", get: (p) => p.relacionMenteCuerpo },
  ];
  const campoActual = campos.find((c) => c.key === campo) || campos[0];

  // Campos a nivel de ESCUELA individual (distintos de los de perspectiva:
  // aquí se usan directamente los campos ya presentes en cada ficha de
  // ESCUELAS_SEED, incluyendo listas —conceptos, técnicas, presentaciones—
  // que se renderizan como texto con viñetas simples).
  const listaATexto = (arr) => (Array.isArray(arr) && arr.length > 0 ? arr.map((x) => `• ${x}`).join("\n") : null);
  const camposEscuela = [
    { key: "fundamentacion", label: "Fundamentación", get: (e) => e.fundamentacion },
    { key: "ontologia", label: "Ontología", get: (e) => e.ontologia },
    { key: "epistemologia", label: "Epistemología", get: (e) => e.epistemologia },
    { key: "metodologia", label: "Metodología", get: (e) => e.metodologia },
    { key: "criterioVerdad", label: "Criterio de verdad", get: (e) => e.criterioVerdad },
    { key: "psicopatologia", label: "Psicopatología", get: (e) => e.psicopatologia },
    { key: "conceptos", label: "Conceptos clave", get: (e) => listaATexto(e.conceptos) },
    { key: "tecnicas", label: "Técnicas", get: (e) => listaATexto(e.tecnicas) },
    { key: "presentaciones", label: "Presentaciones clínicas", get: (e) => listaATexto(e.presentaciones) },
    { key: "evidencia", label: "Evidencia", get: (e) => e.evidencia },
    { key: "contraindicaciones", label: "Contraindicaciones", get: (e) => listaATexto(e.contraindicaciones) },
    { key: "notaDistincion", label: "Distinción de escuelas afines", get: (e) => e.notaDistincion },
  ];

  // Nivel de comparación: perspectivas completas (7, fijas) o escuelas
  // sueltas elegidas libremente (comparación cruzada entre perspectivas).
  const [nivel, setNivel] = useState("perspectivas"); // "perspectivas" | "escuelas"
  const [vista, setVista] = useState("rosa"); // "rosa" | "torre" | "tarjetas" | "tabla"
  const [escuelasSeleccionadas, setEscuelasSeleccionadas] = useState([]);
  const escuelasComparadas = escuelasSeleccionadas.map((id) => escuelas.find((e) => e.id === id)).filter(Boolean);

  return (
    <div style={{ minHeight: "60vh" }}>
      <Cabecera
        icono={<Scale size={18} />}
        titulo="Comparar, perspectiva por perspectiva" todasVoces
        subtitulo="Comparación campo por campo entre perspectivas completas o escuelas seleccionadas, conservando en cada columna el vocabulario propio de su marco teórico."
      />
      {modoEstudio && <QuienLoDiria perspectivas={perspectivas} colorDe={(p) => PERSPECTIVA_COLOR[p]} />}
      <details className="psn-detalles">
        <summary>Debate simulado <small>— dos escuelas frente a frente</small></summary>
        <DebateSimulado modoEstudio={modoEstudio} escuelas={escuelas} enlaces={enlaces || ENLACES_SEED} colorDe={(p) => PERSPECTIVA_COLOR[p]} />
      </details>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", margin: "16px 0" }}>
        <div style={{ display: "flex", gap: 4, background: COLORS.paperDark, borderRadius: 20, padding: 3 }}>
          <button
            onClick={() => setNivel("perspectivas")}
            style={{
              fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
              background: nivel === "perspectivas" ? COLORS.primary : "transparent", color: nivel === "perspectivas" ? COLORS.cardBg : COLORS.inkSoft,
            }}
          >
            7 perspectivas
          </button>
          <button
            onClick={() => setNivel("escuelas")}
            style={{
              fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
              background: nivel === "escuelas" ? COLORS.primary : "transparent", color: nivel === "escuelas" ? COLORS.cardBg : COLORS.inkSoft,
            }}
          >
            Escuelas sueltas
          </button>
        </div>
        <div style={{ display: "flex", gap: 4, background: COLORS.paperDark, borderRadius: 20, padding: 3 }}>
          <button
            onClick={() => setVista("rosa")}
            title="Dial de ejes con pétalos por perspectiva"
            style={{
              fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
              background: vista === "rosa" ? COLORS.garnet : "transparent", color: vista === "rosa" ? COLORS.cardBg : COLORS.inkSoft,
            }}
          >
            Rosa de ejes
          </button>
          <button
            onClick={() => setVista("torre")}
            title="Los seis supuestos filosóficos apilados; compara dos perspectivas y mira dónde se abre la grieta"
            style={{
              fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
              background: vista === "torre" ? COLORS.garnet : "transparent", color: vista === "torre" ? COLORS.cardBg : COLORS.inkSoft,
            }}
          >
            Torre de supuestos
          </button>
          <button
            onClick={() => setVista("tarjetas")}
            title="Ver una categoría a la vez, en profundidad"
            style={{
              fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
              background: vista === "tarjetas" ? COLORS.garnet : "transparent", color: vista === "tarjetas" ? COLORS.cardBg : COLORS.inkSoft,
            }}
          >
            Tarjetas
          </button>
          <button
            onClick={() => setVista("tabla")}
            title="Ver todas las categorías a la vez en una tabla"
            style={{
              fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
              background: vista === "tabla" ? COLORS.garnet : "transparent", color: vista === "tabla" ? COLORS.cardBg : COLORS.inkSoft,
            }}
          >
            Tabla comparativa
          </button>
        </div>
      </div>

      {nivel === "escuelas" && (
        <SelectorEscuelasComparador escuelas={escuelas} seleccionadas={escuelasSeleccionadas} setSeleccionadas={setEscuelasSeleccionadas} />
      )}

      {nivel === "perspectivas" && vista === "torre" && (
        <TorreSupuestos perspectivas={perspectivas} colorDe={(p) => PERSPECTIVA_COLOR[p.nombre] || COLORS.primary} />
      )}

      {nivel === "perspectivas" && vista === "rosa" && (
        <RosaDeEjes campos={campos.filter((c) => c.grupo === "narrativo")} perspectivas={perspectivas} colorDe={(p) => PERSPECTIVA_COLOR[p.nombre] || COLORS.primary} modoEstudio={modoEstudio} />
      )}

      {nivel === "perspectivas" && vista === "tarjetas" && (
        <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, textTransform: "uppercase", marginBottom: 4 }}>
              Ejes narrativos (síntesis clínica)
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {campos
                .filter((c) => c.grupo === "narrativo")
                .map((c) => (
                  <Boton key={c.key} small variant={campo === c.key ? "default" : "ghost"} onClick={() => setCampo(c.key)}>
                    {c.label}
                  </Boton>
                ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 4 }}>
              Coordenadas filosóficas
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {campos
                .filter((c) => c.grupo === "filosofico")
                .map((c) => (
                  <Boton key={c.key} small variant={campo === c.key ? "default" : "ghost"} onClick={() => setCampo(c.key)}>
                    {c.label}
                  </Boton>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------- PERSPECTIVAS · TARJETAS (vista original) ---------- */}
      {nivel === "perspectivas" && vista === "tarjetas" && (
        <div style={{ display: "grid", gap: 14 }}>
          {perspectivas.map((p) => {
            const color = PERSPECTIVA_COLOR[p.nombre] || COLORS.primary;
            const texto = campoActual.get(p);
            if (!texto) return null;
            return (
              <div key={p.id} style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderLeft: `5px solid ${color}`, borderRadius: 12, padding: 16 }}>
                <Sello color={color}>{p.nombre}</Sello>
                <p style={{ margin: "8px 0 0", fontFamily: "var(--f-text)", fontSize: 13.5, lineHeight: 1.6, color: COLORS.ink }}>{texto}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- PERSPECTIVAS · TABLA ---------- */}
      {nivel === "perspectivas" && vista === "tabla" && (
        <TablaComparativa
          entidades={perspectivas}
          campos={campos}
          colorDe={(p) => PERSPECTIVA_COLOR[p.nombre] || COLORS.primary}
          idDe={(p) => p.id}
          nombreDe={(p) => p.nombre}
          truncarA={modoEstudio ? undefined : 200}
        />
      )}

      {/* ---------- ESCUELAS · TARJETAS ---------- */}
      {nivel === "escuelas" && vista === "tarjetas" && escuelasComparadas.length > 0 && (
        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {camposEscuela.map((c) => (
              <Boton key={c.key} small variant={campo === c.key ? "default" : "ghost"} onClick={() => setCampo(c.key)}>
                {c.label}
              </Boton>
            ))}
          </div>
          {(() => {
            const cE = camposEscuela.find((c) => c.key === campo) || camposEscuela[0];
            return escuelasComparadas.map((e) => {
              const color = PERSPECTIVA_COLOR[e.perspectiva] || COLORS.primary;
              const texto = cE.get(e);
              return (
                <div key={e.id} style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderLeft: `5px solid ${color}`, borderRadius: 12, padding: 16 }}>
                  <Sello color={color}>{e.perspectiva}</Sello>
                  <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 14, margin: "4px 0 6px" }}>{e.nombre}</div>
                  {texto ? (
                    <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 13.5, lineHeight: 1.6, color: COLORS.ink, whiteSpace: "pre-line" }}>{texto}</p>
                  ) : (
                    <TextoVacio texto="Sin registrar para esta escuela." />
                  )}
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* ---------- ESCUELAS · TABLA ---------- */}
      {nivel === "escuelas" && vista === "tabla" && escuelasComparadas.length > 0 && (
        <TablaComparativa
          entidades={escuelasComparadas}
          campos={camposEscuela}
          colorDe={(e) => PERSPECTIVA_COLOR[e.perspectiva] || COLORS.primary}
          idDe={(e) => e.id}
          nombreDe={(e) => e.nombre}
          onClickEntidad={onIrAEscuela ? (e) => onIrAEscuela(e.id) : undefined}
          truncarA={modoEstudio ? undefined : 160}
        />
      )}

      {nivel === "escuelas" && escuelasComparadas.length === 0 && (
        <VacioAviso texto="Añade escuelas con el buscador de arriba para empezar a compararlas — puedes mezclar escuelas de perspectivas distintas." />
      )}

      <div style={{ marginTop: 24, background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", color: COLORS.garnet, marginBottom: 10 }}>
          Número de escuelas modeladas por perspectiva
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {perspectivas.map((p) => {
            const color = PERSPECTIVA_COLOR[p.nombre] || COLORS.primary;
            const n = escuelas.filter((e) => e.perspectiva === NOMBRE_CORTO_PERSPECTIVA[p.id]).length;
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: COLORS.ink }}>
                  {p.nombre}: {n}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ marginTop: 20, fontFamily: "var(--f-text)", fontSize: 12, color: COLORS.inkSoft, fontStyle: "italic" }}>
        Para comparar conceptos específicos entre escuelas (no solo fichas completas) con su tipo de relación popperiano exacto, usa el Diccionario traslacional.
      </p>
      {modoEstudio && (
        <ExamenSimulado escuelas={escuelas} enlaces={enlaces || ENLACES_SEED} perspectivas={perspectivas} colorDe={(p) => PERSPECTIVA_COLOR[p.nombre || p]} />
      )}
    </div>
  );
}

function ModuloPerspectivas({ escuelas, setEscuelas, filtro, setFiltro, onAbrirDefinicion, onIrADiccionario, enlaces, setEnlaces, planes, setPlanes, focoEscuela, integridad, modoEstudio, setModoEstudio }) {
  const [perspectivaId, setPerspectivaId] = useState(FUNDAMENTOS_PERSPECTIVAS[0].id);
  const [escuelaAbierta, setEscuelaAbierta] = useState(null);
  const [vistaPanorama, setVistaPanorama] = useState(false);
  const [vistaLinea, setVistaLinea] = useState(false);
  const [editando, setEditando] = useState(null);
  const [toastGuardado, setToastGuardado] = useState(null);
  useEffect(() => {
    if (!toastGuardado) return;
    const t = setTimeout(() => setToastGuardado((cur) => (cur?.ts === toastGuardado.ts ? null : cur)), 4500);
    return () => clearTimeout(t);
  }, [toastGuardado]);
  const [vistaAutores, setVistaAutores] = useState(false);
  const [autorGlobalAbierto, setAutorGlobalAbierto] = useState(null);

  useEffect(() => {
    if (!focoEscuela) return;
    const e = escuelas.find((x) => x.id === focoEscuela.id);
    if (!e) return;
    const pid = PERSPECTIVA_ID_POR_NOMBRE[e.perspectiva];
    if (pid) setPerspectivaId(pid);
    setEscuelaAbierta(e.id);
    setVistaPanorama(false);
    // Mismo bug que en el clic de resultado de búsqueda: este efecto es el
    // que usan TODOS los saltos entre módulos (grafo del diccionario,
    // enlaces del glosario, notaDistincion, "atrás" del recorrido...). Si
    // el buscador global tenía texto de una búsqueda anterior, la ficha
    // recién abierta quedaba oculta detrás de `resultadosFiltro`.
    if (setFiltro) setFiltro("");
  }, [focoEscuela]);

  const persp = FUNDAMENTOS_PERSPECTIVAS.find((p) => p.id === perspectivaId);
  const color = PERSPECTIVA_COLOR[persp.nombre];
  const escuelaActual = escuelas.find((e) => e.id === escuelaAbierta);

  // Modo estudio: recorrer secuencialmente las escuelas de la perspectiva
  // actual con las flechas del teclado (← →), sin volver al árbol cada
  // vez — pensado para revisión de estudio continuada, no solo consulta
  // puntual de una ficha aislada.
  const escuelasPerspActual = useMemo(() => escuelas.filter((e) => e.perspectiva === persp?.nombre), [escuelas, persp]);
  const indiceEstudio = escuelaAbierta ? escuelasPerspActual.findIndex((e) => e.id === escuelaAbierta) : -1;
  const irAIndiceEstudio = (i) => {
    if (i < 0 || i >= escuelasPerspActual.length) return;
    setEscuelaAbierta(escuelasPerspActual[i].id);
  };
  useEffect(() => {
    if (!modoEstudio || !escuelaAbierta) return;
    const onKey = (ev) => {
      // No interceptar flechas si el foco está en un campo editable, o el
      // modo estudio sabotearía la edición de texto normal de la ficha.
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (ev.key === "ArrowRight") irAIndiceEstudio(indiceEstudio + 1);
      if (ev.key === "ArrowLeft") irAIndiceEstudio(indiceEstudio - 1);
      if (ev.key === "Escape") setModoEstudio(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modoEstudio, escuelaAbierta, indiceEstudio, escuelasPerspActual]);

  const resultadosFiltro = useMemo(() => {
    if (!filtro) return null;
    const f = filtro.toLowerCase();
    return escuelas.filter(
      (e) =>
        e.nombre.toLowerCase().includes(f) ||
        e.autores.toLowerCase().includes(f) ||
        (e.conceptos || []).some((c) => c.toLowerCase().includes(f))
    );
  }, [escuelas, filtro]);

  function actualizarEscuela(id, campo, valor) {
    // Vista previa de impacto para ediciones de alto riesgo: cambiar el
    // `id` de una escuela deja huérfanas todas las referencias que otros
    // módulos guardan como texto plano (enlaces, planes, glosario), y
    // cambiar `perspectiva` a un valor no reconocido rompe silenciosamente
    // el mapeo con FUNDAMENTOS_PERSPECTIVAS/PERSPECTIVA_COLOR. En vez de
    // dejar que el usuario lo descubra después en el panel de integridad,
    // se avisa ANTES de aplicar el cambio, con el conteo exacto.
    if (campo === "id" && valor !== id) {
      const enlacesAfectados = enlaces.filter((l) => l.conceptoA?.escuela === id || l.conceptoB?.escuela === id).length;
      const planesAfectados = planes.filter((p) => p.escuela === id).length;
      const glosarioAfectado = GLOSARIO.filter((g) => g.escuela === id).length;
      const yaExiste = escuelas.some((e) => e.id === valor);
      if (yaExiste) {
        window.alert(`El id "${valor}" ya está en uso por otra escuela. Elige uno distinto.`);
        return;
      }
      const total = enlacesAfectados + planesAfectados + glosarioAfectado;
      if (total > 0) {
        const confirma = window.confirm(
          `Cambiar el id de "${id}" a "${valor}" dejará huérfanos:\n` +
            `${enlacesAfectados} enlace(s) traslacional(es), ${planesAfectados} plan(es), ${glosarioAfectado} entrada(s) de glosario.\n\n` +
            `Aparecerán como problemas en el panel "Salud de los datos" hasta que los corrijas a mano. ¿Continuar de todos modos?`
        );
        if (!confirma) return;
      }
    }
    if (campo === "perspectiva" && !FUNDAMENTOS_PERSPECTIVAS.some((p) => p.nombre === valor)) {
      const confirma = window.confirm(
        `"${valor}" no coincide con ninguna de las perspectivas reconocidas (${FUNDAMENTOS_PERSPECTIVAS.map((p) => p.nombre).join(", ")}).\n\n` +
          `La escuela dejará de tener color de perspectiva y podría no aparecer en el árbol de navegación. ¿Continuar de todos modos?`
      );
      if (!confirma) return;
    }
    setEscuelas(escuelas.map((e) => (e.id === id ? { ...e, [campo]: valor, _editado: Date.now() } : e)));
  }
  function borrarEscuela(id) {
    const escuela = escuelas.find((e) => e.id === id);
    const enlacesAfectados = enlaces.filter((l) => l.conceptoA?.escuela === id || l.conceptoB?.escuela === id).length;
    const planesAfectados = planes.filter((p) => p.escuela === id).length;
    const glosarioAfectado = GLOSARIO.filter((g) => g.escuela === id).length;
    const totalAfectado = enlacesAfectados + planesAfectados + glosarioAfectado;
    const mensaje =
      totalAfectado > 0
        ? `¿Eliminar «${escuela?.nombre || id}»? Esta acción no se puede deshacer.\n\n` +
          `Quedarían huérfanos: ${enlacesAfectados} enlace(s) traslacional(es), ${planesAfectados} plan(es) de sesión` +
          (glosarioAfectado > 0 ? ` y ${glosarioAfectado} entrada(s) de glosario (curadas de fábrica, no editables desde aquí).` : ".") +
          `\n\nLos enlaces y planes afectados se eliminarán automáticamente junto con la escuela.`
        : `¿Eliminar «${escuela?.nombre || id}»? Esta acción no se puede deshacer.`;
    if (!window.confirm(mensaje)) return;
    setEscuelas(escuelas.filter((e) => e.id !== id));
    setEnlaces(enlaces.filter((l) => l.conceptoA?.escuela !== id && l.conceptoB?.escuela !== id));
    setPlanes(planes.filter((p) => p.escuela !== id));
    setEscuelaAbierta(null);
  }
  function crearEscuela(nombrePersp) {
    const nueva = {
      id: "e" + Date.now(),
      perspectiva: nombrePersp,
      nombre: "Nueva escuela",
      autores: "",
      fundamentacion: "",
      ontologia: "",
      epistemologia: "",
      metodologia: "",
      criterioVerdad: "",
      conceptos: [],
      psicopatologia: "",
      tecnicas: [],
      evidencia: "",
      presentaciones: [],
    };
    setEscuelas([...escuelas, nueva]);
    setEscuelaAbierta(nueva.id);
    setEditando(nueva.id);
  }
  function irAEscuela(id) {
    setEscuelaAbierta(id);
    setVistaPanorama(false);
  }
  function irAPerspectiva(id) {
    setPerspectivaId(id);
    setEscuelaAbierta(null);
    setVistaPanorama(false);
  }
  function irAEscuelaDesdeAutor(id) {
    const e = escuelas.find((x) => x.id === id);
    if (!e) return;
    const pid = PERSPECTIVA_ID_POR_NOMBRE[e.perspectiva];
    if (pid) setPerspectivaId(pid);
    setEscuelaAbierta(id);
    setVistaAutores(false);
    setAutorGlobalAbierto(null);
  }

  return (
    <div
      key={perspectivaId}
      className="psq-fade-in"
      style={{
        // Identidad visual por perspectiva: una mancha de color difuminada
        // detrás del encabezado, tejida con el patrón de puntos existente,
        // para que cada una de las 7 perspectivas "se sienta" distinta al
        // entrar — no solo por el color de los chips, sino por el propio
        // fondo de la pantalla. Cambia con transición suave de color.
        position: "relative",
        backgroundImage: `radial-gradient(${(PERSPECTIVA_COLOR[FUNDAMENTOS_PERSPECTIVAS.find((p) => p.id === perspectivaId)?.nombre] || COLORS.primary)}14 1px, transparent 1.5px), radial-gradient(560px 320px at 6% 0%, ${(PERSPECTIVA_COLOR[FUNDAMENTOS_PERSPECTIVAS.find((p) => p.id === perspectivaId)?.nombre] || COLORS.primary)}22, transparent 65%), radial-gradient(420px 280px at 96% 6%, ${(PERSPECTIVA_COLOR[FUNDAMENTOS_PERSPECTIVAS.find((p) => p.id === perspectivaId)?.nombre] || COLORS.primary)}14, transparent 60%)`,
        backgroundSize: "22px 22px, auto, auto",
        transition: "background-image 0.4s ease",
        margin: "-8px",
        padding: 8,
      }}
    >
      <SelloPerspectiva color={PERSPECTIVA_COLOR[FUNDAMENTOS_PERSPECTIVAS.find((p) => p.id === perspectivaId)?.nombre] || COLORS.primary} />
      <BandaPerspectiva id={perspectivaId} />
      <Cabecera
        icono={<Network size={18} />}
        titulo="Escuelas Psicoterapéuticas"
        subtitulo="Recorrido continuo desde los fundamentos filosóficos de cada perspectiva hasta la técnica clínica concreta de cada escuela, con línea de tiempo y mapa conceptual como apoyo."
        colorAcento={PERSPECTIVA_COLOR[FUNDAMENTOS_PERSPECTIVAS.find((p) => p.id === perspectivaId)?.nombre]}
        autores={AUTORES_POR_PERSPECTIVA[perspectivaId]}
        tituloAutores="Voces de esta perspectiva"
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0 20px" }}>
        {FUNDAMENTOS_PERSPECTIVAS.map((p) => {
          const c = PERSPECTIVA_COLOR[p.nombre];
          const activo = p.id === perspectivaId;
          const n = escuelas.filter((e) => e.perspectiva === NOMBRE_CORTO_PERSPECTIVA[p.id]).length;
          return (
            <span
              key={p.id}
              onClick={() => irAPerspectiva(p.id)}
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 11.5,
                fontWeight: activo ? 700 : 400,
                padding: "7px 12px",
                borderRadius: 20,
                cursor: "pointer",
                color: activo ? COLORS.onAcento : c,
                background: activo ? c : COLORS.cardBg,
                border: `1.5px solid ${c}`,
                transform: activo ? "scale(1.045)" : "scale(1)",
                boxShadow: activo ? `0 4px 14px ${c}55` : "none",
                transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, color 0.18s ease",
                display: "inline-block",
              }}
              onMouseEnter={(ev) => { if (!activo) ev.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(ev) => { if (!activo) ev.currentTarget.style.transform = "scale(1)"; }}
            >
              {p.nombre} <span style={{ opacity: 0.75 }}>({n})</span>
            </span>
          );
        })}
      </div>

      <div
        onClick={() => setVistaAutores(!vistaAutores)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: "0 0 20px",
          padding: "10px 14px",
          borderRadius: 14,
          cursor: "pointer",
          background: vistaAutores ? COLORS.ink : COLORS.cardBg,
          border: `1.5px solid ${COLORS.ink}`,
          width: "fit-content",
        }}
      >
        <BookOpen size={14} color={vistaAutores ? COLORS.cardBg : COLORS.ink} />
        <span style={{ fontFamily: "Georgia,serif", fontSize: 13, fontWeight: 700, color: vistaAutores ? COLORS.onAcento : COLORS.ink }}>
          Autores y teorías fundantes ({AUTORES_TEORICOS.length})
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: vistaAutores ? COLORS.cardBg : COLORS.inkSoft }}>{vistaAutores ? "ocultar ▲" : "ver ▼"}</span>
      </div>

      {vistaAutores && (
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <p style={{ fontFamily: "var(--f-text)", fontSize: 12.5, color: COLORS.inkSoft, marginTop: 0, marginBottom: 14, fontStyle: "italic" }}>
            Teorías de base (a menudo de psicología experimental, biología o filosofía) que fundamentan varias escuelas clínicas, separadas deliberadamente de las escuelas mismas: sus autores no administran una psicoterapia propia.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 10 }}>
            {AUTORES_TEORICOS.map((autor) => {
              const n = escuelasFundamentadasPor(autor.id, escuelas).length;
              const persps = perspectivasDeAutor(autor, escuelas);
              const esHibridoDePerspectivas = persps.length > 1;
              return (
                <div
                  key={autor.id}
                  onClick={() => setAutorGlobalAbierto(autor)}
                  style={{ cursor: "pointer", display: "flex", border: `1px solid ${COLORS.line}`, borderRadius: 12, overflow: "hidden", background: COLORS.paperDark }}
                >
                  <div style={{ width: 5, flexShrink: 0, background: gradientePerspectivas(persps, "to bottom") }} />
                  <div style={{ padding: 12, flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 14, color: COLORS.ink, marginBottom: 3 }}>{autor.nombre}</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, marginBottom: 6 }}>{autor.autoresPrincipales}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                      {persps.map((p) => (
                        <span
                          key={p}
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: 9,
                            fontWeight: 700,
                            color: PERSPECTIVA_COLOR[p] || COLORS.inkSoft,
                            border: `1px solid ${PERSPECTIVA_COLOR[p] || COLORS.line}`,
                            borderRadius: 8,
                            padding: "1px 6px",
                          }}
                        >
                          {p}
                        </span>
                      ))}
                      {persps.length === 0 && (
                        <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: COLORS.inkSoft, fontStyle: "italic" }}>sin escuela citada aún</span>
                      )}
                    </div>
                    {esHibridoDePerspectivas && (
                      <div style={{ fontFamily: "var(--f-text)", fontSize: 10, color: COLORS.inkSoft, fontStyle: "italic", marginBottom: 6 }}>
                        fundamenta escuelas en {persps.length} perspectivas distintas
                      </div>
                    )}
                    <span style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, color: COLORS.onAcento, background: COLORS.sage, borderRadius: 20, padding: "2px 9px" }}>
                      fundamenta {n} escuela{n === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {autorGlobalAbierto && (
        <ModalAutorTeorico
          autor={autorGlobalAbierto}
          onCerrar={() => setAutorGlobalAbierto(null)}
          escuelasFundamentadas={escuelasFundamentadasPor(autorGlobalAbierto.id, escuelas)}
          perspectivas={perspectivasDeAutor(autorGlobalAbierto, escuelas)}
          onIrAEscuela={irAEscuelaDesdeAutor}
        />
      )}

      {resultadosFiltro ? (
        <div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 10 }}>
            {resultadosFiltro.length} resultado{resultadosFiltro.length !== 1 ? "s" : ""} para «{filtro}» en todas las perspectivas
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 10 }}>
            {resultadosFiltro.map((e) => {
              const c = PERSPECTIVA_COLOR[e.perspectiva];
              return (
                <div
                  key={e.id}
                  onClick={() => {
                    setPerspectivaId(FUNDAMENTOS_PERSPECTIVAS.find((p) => p.nombre === e.perspectiva)?.id || perspectivaId);
                    irAEscuela(e.id);
                    // Sin esto, el filtro global seguía activo tras seleccionar un
                    // resultado: `resultadosFiltro` seguía siendo verdadero y la
                    // ficha nunca se mostraba (el usuario quedaba atrapado en la
                    // lista de resultados). Se limpia al abrir la ficha.
                    if (setFiltro) setFiltro("");
                  }}
                  style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderLeft: `4px solid ${c}`, borderRadius: 12, padding: 12, cursor: "pointer" }}
                >
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: c }}>{e.perspectiva}</div>
                  <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5 }}>{e.nombre}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : escuelaActual ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Boton small variant="ghost" onClick={() => setEscuelaAbierta(null)}>
              ← volver a {persp.nombre}
            </Boton>
            <Boton small variant={modoEstudio ? "default" : "ghost"} onClick={() => setModoEstudio((v) => !v)} title="Recorre las escuelas de esta perspectiva con las flechas ← → del teclado">
              {modoEstudio ? "✓ modo estudio activo" : "modo estudio"}
            </Boton>
            {modoEstudio && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Boton small variant="ghost" onClick={() => irAIndiceEstudio(indiceEstudio - 1)} disabled={indiceEstudio <= 0}>
                  ←
                </Boton>
                <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.inkSoft }}>
                  {indiceEstudio + 1} / {escuelasPerspActual.length} en {persp.nombre}
                </span>
                <Boton small variant="ghost" onClick={() => irAIndiceEstudio(indiceEstudio + 1)} disabled={indiceEstudio >= escuelasPerspActual.length - 1}>
                  →
                </Boton>
                <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, fontStyle: "italic" }}>usa ← → del teclado · Esc para salir</span>
              </div>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <FichaEscuela
              e={escuelaActual}
              editando={editando === escuelaActual.id}
              onEditar={() => setEditando(escuelaActual.id)}
              onGuardar={() => {
                const conteo = {
                  conceptos: (escuelaActual.conceptos || []).length,
                  tecnicas: (escuelaActual.tecnicas || []).length,
                  tieneProtocolo: !!PROTOCOLOS_SEED[escuelaActual.id],
                  tieneCitas: !!CITAS_AMPLIADAS[escuelaActual.id],
                };
                setToastGuardado({ nombre: escuelaActual.nombre, ...conteo, ts: Date.now() });
                setEditando(null);
              }}
              onCambiar={(campo, valor) => actualizarEscuela(escuelaActual.id, campo, valor)}
              onBorrar={() => borrarEscuela(escuelaActual.id)}
              onAbrirDefinicion={onAbrirDefinicion}
              onIrADiccionario={onIrADiccionario}
              enlaces={enlaces}
              escuelas={escuelas}
              onIrAEscuela={irAEscuela}
              integridad={integridad}
              modoEstudio={modoEstudio}
            />
          </div>
        </div>
      ) : (
        <div>
          <FichaFundamento p={persp} onIrAEscuela={irAEscuela} escuelas={escuelas} enlaces={enlaces} />

          <div
            onClick={() => setVistaLinea(!vistaLinea)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 18,
              padding: "12px 16px",
              borderRadius: 14,
              cursor: "pointer",
              background: vistaLinea ? color : COLORS.paperDark,
              border: `1.5px solid ${color}`,
              transition: "background 0.15s",
            }}
          >
            <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5, color: vistaLinea ? COLORS.onAcento : COLORS.ink }}>
              🕓 Línea de tiempo de {persp.nombre}
            </span>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: vistaLinea ? "#fff" : color, fontWeight: 700 }}>
              {vistaLinea ? "ocultar ▲" : "ver ▼"}
            </span>
          </div>
          {vistaLinea && (
            <div style={{ marginTop: 10, background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: "18px 14px 10px" }}>
              <LineaDeTiempoPerspectiva
                escuelas={escuelas.filter((e) => e.perspectiva === NOMBRE_CORTO_PERSPECTIVA[persp.id])}
                color={color}
                onIrAEscuela={irAEscuela}
                teorias={AUTORES_TEORICOS.filter((a) => {
                  const escuelasDePersp = escuelas.filter((e) => e.perspectiva === NOMBRE_CORTO_PERSPECTIVA[persp.id]);
                  const idsDePersp = new Set(escuelasDePersp.map((e) => e.id));
                  return escuelasDePersp.some((e) => (e.fundamentosTeoricos || []).includes(a.id)) || (a.esTambienEscuelaPropia && idsDePersp.has(a.esTambienEscuelaPropia));
                })}
              />
            </div>
          )}

          <div
            onClick={() => setVistaPanorama(!vistaPanorama)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 18,
              padding: "12px 16px",
              borderRadius: 14,
              cursor: "pointer",
              background: vistaPanorama ? persp && PERSPECTIVA_COLOR[persp.nombre] : COLORS.paperDark,
              border: `1.5px solid ${persp && PERSPECTIVA_COLOR[persp.nombre]}`,
              transition: "background 0.15s",
            }}
          >
            <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5, color: vistaPanorama ? COLORS.onAcento : COLORS.ink }}>
              📊 Panorama de protocolos, técnicas y procedimientos de {persp.nombre}
            </span>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: vistaPanorama ? "#fff" : PERSPECTIVA_COLOR[persp.nombre], fontWeight: 700 }}>
              {vistaPanorama ? "ocultar ▲" : "ver ▼"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <Boton small variant="ghost" onClick={() => crearEscuela(persp.nombre)}>
              <Plus size={12} /> añadir escuela a esta perspectiva
            </Boton>
          </div>

          {vistaPanorama && (
            <div style={{ marginTop: 14 }}>
              <FichaPerspectiva nombrePerspectiva={NOMBRE_CORTO_PERSPECTIVA[persp.id]} escuelas={escuelas} onIrADiccionario={onIrADiccionario} />
            </div>
          )}
        </div>
      )}

      {toastGuardado && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 40,
            background: COLORS.primaryDark,
            color: "#fff",
            borderRadius: 14,
            padding: "12px 16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            maxWidth: 300,
            fontFamily: "var(--f-text)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 6 }}>✓ Guardado: {toastGuardado.nombre}</div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, lineHeight: 1.7, color: "#D8DEDA" }}>
            <div>✓ {toastGuardado.conceptos} concepto(s) · {toastGuardado.tecnicas} técnica(s)</div>
            <div>{toastGuardado.tieneProtocolo ? "✓" : "⚠"} protocolo {toastGuardado.tieneProtocolo ? "asociado" : "no sembrado aún"}</div>
            <div>{toastGuardado.tieneCitas ? "✓" : "⚠"} citas ampliadas {toastGuardado.tieneCitas ? "presentes" : "no sembradas aún"}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function SeccionClasificacionFilosoficaInterna({ clasif, color }) {
  if (!clasif) return <TextoVacio texto="Sin clasificación filosófica ampliada registrada para esta perspectiva." />;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.clay, textTransform: "uppercase", marginBottom: 3 }}>Eje 1 — Independencia y cantidad</div>
          <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{clasif.ejeIndependenciaCantidad}</p>
        </div>
        <div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.clay, textTransform: "uppercase", marginBottom: 3 }}>Eje 2 — Naturaleza de la sustancia</div>
          <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{clasif.ejeNaturalezaSustancia}</p>
        </div>
        <div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.clay, textTransform: "uppercase", marginBottom: 3 }}>Meta-eje</div>
          <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{clasif.metaEje}</p>
        </div>
      </div>
      <div style={{ borderTop: `1px dashed ${COLORS.gold}`, paddingTop: 10, marginBottom: 10 }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Los grandes «ismos»</div>
        <p style={{ margin: "0 0 8px", fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{clasif.ismos}</p>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Hessen (incluye criterio de verdad)</div>
        <p style={{ margin: "0 0 8px", fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{clasif.hessen}</p>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Wolff</div>
        <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{clasif.wolff}</p>
      </div>
      {clasif.crotty && (
        <div style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: 10 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.primary, textTransform: "uppercase", marginBottom: 4 }}>Esquema de Crotty</div>
          {clasif.crotty.epistemologia && <p style={{ margin: "0 0 4px", fontFamily: "var(--f-text)", fontSize: 12 }}><strong>Epistemología: </strong>{clasif.crotty.epistemologia}</p>}
          {clasif.crotty.perspectiva && <p style={{ margin: "0 0 4px", fontFamily: "var(--f-text)", fontSize: 12 }}><strong>Perspectiva teórica: </strong>{clasif.crotty.perspectiva}</p>}
          {(clasif.crotty.metodos || clasif.crotty.metodologia) && <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12 }}><strong>Metodología / métodos: </strong>{clasif.crotty.metodos || clasif.crotty.metodologia}</p>}
        </div>
      )}
      <p style={{ marginTop: 10, marginBottom: 0, fontFamily: "var(--f-text)", fontSize: 10.5, color: COLORS.inkSoft, fontStyle: "italic" }}>
        Fuente: Clasificación filosófica de las perspectivas psicoterapéuticas.docx y los PDF «Fundamentos filosóficos de la psicoterapia [perspectiva]».
      </p>
    </div>
  );
}

function SeccionClasificacionFilosoficaEscuelaInterna({ filo }) {
  if (!filo) return <TextoVacio texto="Esta escuela aún no tiene una clasificación filosófica ampliada propia; solo las perspectivas cubiertas por los 5 PDF de fundamentos («Fundamentos filosóficos de la psicoterapia [perspectiva]») la traen a nivel de escuela específica." />;
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Mapa decisional de la ontología</div>
        <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{filo.mapaDecisional}</p>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Clasificaciones históricas (Ismos / Hessen / Wolff)</div>
        <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{filo.clasificacionesHistoricas}</p>
      </div>
      {filo.crotty && (
        <div style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: 10 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.primary, textTransform: "uppercase", marginBottom: 4 }}>Esquema de Crotty</div>
          {filo.crotty.epistemologia && filo.crotty.epistemologia !== "—" && <p style={{ margin: "0 0 4px", fontFamily: "var(--f-text)", fontSize: 12 }}><strong>Epistemología: </strong>{filo.crotty.epistemologia}</p>}
          {filo.crotty.perspectiva && filo.crotty.perspectiva !== "—" && <p style={{ margin: "0 0 4px", fontFamily: "var(--f-text)", fontSize: 12 }}><strong>Perspectiva teórica: </strong>{filo.crotty.perspectiva}</p>}
          {filo.crotty.metodologia && filo.crotty.metodologia !== "—" && <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12 }}><strong>Metodología / métodos: </strong>{filo.crotty.metodologia}</p>}
        </div>
      )}
      <p style={{ marginTop: 10, marginBottom: 0, fontFamily: "var(--f-text)", fontSize: 10.5, color: COLORS.inkSoft, fontStyle: "italic" }}>
        Fuente: PDF «Fundamentos filosóficos de la psicoterapia [perspectiva]».
      </p>
    </div>
  );
}

function TextoVacio({ texto }) {
  return (
    <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5, color: COLORS.inkSoft, fontStyle: "italic" }}>
      {texto}
    </p>
  );
}

function SeccionContextoInterna({ contexto, color }) {
  const campos = [
    { key: "definicion", label: "Definición de la perspectiva" },
    { key: "historia", label: "Contexto histórico y surgimiento" },
    { key: "dilemas", label: "Evolución y dilemas epistemológicos" },
    { key: "psicopatologia", label: "Concepción de la psicopatología" },
    { key: "rolTerapeuta", label: "El rol y la postura del terapeuta" },
    { key: "mecanismosCambio", label: "Mecanismos de cambio terapéutico" },
  ];
  if (!contexto) return <TextoVacio texto="Sin contexto general registrado para esta perspectiva." />;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {campos.map((c, i) =>
        contexto[c.key] ? (
          <div key={i} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>
            <div style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{c.label}</div>
            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 13, lineHeight: 1.55, color: COLORS.ink }}>{contexto[c.key]}</p>
          </div>
        ) : null
      )}
    </div>
  );
}

function SeccionSubperspectivasInterna({ perspectivaId, color, onIrAEscuela, escuelas, enlaces }) {
  const data = SUBPERSPECTIVAS[perspectivaId];
  const [comparando, setComparando] = useState([]);
  if (!data) return <TextoVacio texto="Esta perspectiva no tiene sub-perspectivas documentadas por separado." />;
  let ultimaSubfamilia = null;

  function alternarComparar(escuelaId) {
    if (!escuelaId) return;
    setComparando((prev) => {
      if (prev.includes(escuelaId)) return prev.filter((x) => x !== escuelaId);
      if (prev.length >= 3) return prev;
      return [...prev, escuelaId];
    });
  }

  const escuelasComparadas = (escuelas || []).filter((e) => comparando.includes(e.id));

  return (
    <div>
      {comparando.length > 0 && (
        <div style={{ marginBottom: 14, background: COLORS.cardBg, border: `1.5px solid ${color}`, borderRadius: 12, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", color, fontWeight: 700 }}>
              Comparador rápido ({comparando.length}/3 seleccionadas)
            </span>
            <span onClick={() => setComparando([])} style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: COLORS.inkSoft, cursor: "pointer", textDecoration: "underline" }}>
              limpiar selección
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${escuelasComparadas.length}, 1fr)`, gap: 12, overflowX: "auto" }}>
            {escuelasComparadas.map((e) => (
              <div key={e.id} style={{ background: COLORS.paperDark, borderRadius: 8, padding: 10, minWidth: 200 }}>
                <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{e.nombre}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", color: COLORS.primary, marginBottom: 2 }}>Conceptos clave</div>
                <ul style={{ margin: "0 0 8px", paddingLeft: 16, fontSize: 11.5, fontFamily: "var(--f-text)", lineHeight: 1.4 }}>
                  {(e.conceptos || []).slice(0, 3).map((c, i) => <li key={i}>{c}</li>)}
                </ul>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", color: COLORS.clay, marginBottom: 2 }}>Técnicas</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, fontFamily: "var(--f-text)", lineHeight: 1.4 }}>
                  {(e.tecnicas || []).slice(0, 3).map((c, i) => <li key={i}>{c}</li>)}
                </ul>
                <span
                  role="link"
                  tabIndex={0}
                  onClick={() => onIrAEscuela && onIrAEscuela(e.id)}
                  onKeyDown={activarConTeclado(() => onIrAEscuela && onIrAEscuela(e.id))}
                  style={{ display: "inline-block", marginTop: 8, fontFamily: "var(--f-mono)", fontSize: 10, color, cursor: "pointer", textDecoration: "underline" }}
                >
                  → ficha completa
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        {data.lista.map((sp, i) => {
          const mostrarHeader = sp.subfamilia && sp.subfamilia !== ultimaSubfamilia;
          ultimaSubfamilia = sp.subfamilia || ultimaSubfamilia;
          const enConstruccion = /pendiente de fuente primaria/i.test(sp.definicion || "");
          return (
            <React.Fragment key={i}>
              {mostrarHeader && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: i === 0 ? 0 : 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: color, fontWeight: 700 }}>
                    {sp.subfamilia}
                  </span>
                  <span style={{ flex: 1, height: 1, background: COLORS.line }} />
                </div>
              )}
              <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10, background: COLORS.paperDark, borderRadius: 8, padding: "8px 10px", marginLeft: sp.subfamilia ? 16 : 0, display: "flex", gap: 8, alignItems: "flex-start" }}>
                {sp.escuela && escuelas && (
                  <input
                    type="checkbox"
                    checked={comparando.includes(sp.escuela)}
                    onChange={() => alternarComparar(sp.escuela)}
                    title="Añadir al comparador rápido"
                    style={{ marginTop: 4, cursor: "pointer", accentColor: color }}
                  />
                )}
                <AvataresSub escuelas={escuelas} escuelaId={sp.escuela} color={color} perspectiva={(FUNDAMENTOS_PERSPECTIVAS.find((p) => p.id === perspectivaId) || {}).nombre} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: 13.5 }}>{sp.nombre}</span>
                    {sp.escuela && enlaces && <BadgeEnlaces escuelaId={sp.escuela} enlaces={enlaces} small />}
                    {!sp.escuela && (
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: COLORS.garnet, border: `1px solid ${COLORS.garnet}`, borderRadius: 6, padding: "0 5px" }}>
                        no modelada como escuela aparte
                      </span>
                    )}
                    {enConstruccion && (
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: COLORS.onAcento, background: COLORS.clay, borderRadius: 6, padding: "1px 6px", letterSpacing: 0.3 }}>
                        ⚠ en construcción — falta fuente primaria
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "2px 0 6px", fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5, color: COLORS.ink }}>{sp.definicion}</p>
                  {sp.escuela && onIrAEscuela && (
                    <span
                      role="link"
                      tabIndex={0}
                      onClick={() => onIrAEscuela(sp.escuela)}
                      onKeyDown={activarConTeclado(() => onIrAEscuela(sp.escuela))}
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: 10.5,
                        color: color,
                        cursor: "pointer",
                        textDecoration: "underline",
                        textUnderlineOffset: 2,
                        fontWeight: 700,
                      }}
                    >
                      → ver ficha detallada de esta escuela
                    </span>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", color: COLORS.garnet, marginBottom: 8 }}>
        Convergencias y divergencias entre estas sub-perspectivas
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {data.tabla.map((fila, i) => (
          <div key={i} style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 12 }}>
            <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{fila.aspecto}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 10 }}>
              <div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.sage, marginBottom: 2 }}>CONVERGE</div>
                <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{fila.convergencia}</p>
              </div>
              <div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.garnet, marginBottom: 2 }}>DIVERGE</div>
                <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{fila.divergencia}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Línea de tiempo interactiva de las escuelas de una perspectiva,
   ubicadas aproximadamente por el año más antiguo mencionado en su
   fundamentación (extraerAnio). No añade ni modifica datos: solo los
   proyecta espacialmente. Las escuelas sin año detectable se listan
   aparte, sin perderse. */
function LineaDeTiempoPerspectiva({ escuelas, color, onIrAEscuela, teorias = [] }) {
  const [hover, setHover] = useState(null);
  const anioDe = (e) => (ANIO_ORIGEN[e.id] ? ANIO_ORIGEN[e.id].anio : extraerAnio(e.fundamentacion || e.origenHistorico));
  const fuenteDe = (e) => (ANIO_ORIGEN[e.id] ? ANIO_ORIGEN[e.id].fuente : null);
  const hitoDe = (e) => (ANIO_ORIGEN[e.id] ? ANIO_ORIGEN[e.id].hito : null);
  const conAnio = escuelas
    .map((e) => ({ e, anio: anioDe(e), fuente: fuenteDe(e), hito: hitoDe(e) }))
    .filter((x) => x.anio)
    .sort((a, b) => a.anio - b.anio);
  const sinAnio = escuelas.filter((e) => !anioDe(e));

  // Teorías fundantes (AUTORES_TEORICOS) citadas por al menos una escuela de
  // esta perspectiva concreta, o que son ellas mismas la teoría fundante de
  // una escuela de esta perspectiva (esTambienEscuelaPropia, p. ej. Jung/p8).
  // El año se aproxima con la misma heurística extraerAnio() aplicada a
  // obraNuclear (que siempre trae el año de la publicación fundacional, a
  // diferencia de autoresPrincipales, que trae años de nacimiento/muerte y
  // distorsionaría la fecha). Un mismo teórico puede así aparecer en más de
  // una perspectiva si fundamenta escuelas en ambas (p. ej. Jung en
  // Psicodinámica vía p8 y en Transpersonal vía t3), que es precisamente el
  // comportamiento pedido: cada perspectiva muestra solo sus propias teorías
  // fundantes, no una lista global.
  const teoriasConAnio = teorias
    .map((t) => ({ t, anio: extraerAnio(t.obraNuclear) || extraerAnio(t.aporteSintesis) }))
    .filter((x) => x.anio)
    .sort((a, b) => a.anio - b.anio);

  if (conAnio.length === 0 && teoriasConAnio.length === 0) {
    return <VacioAviso texto="Ninguna escuela ni teoría fundante de esta perspectiva menciona un año identificable para ubicarla en la línea de tiempo." />;
  }

  const todosLosAnios = [...conAnio.map((x) => x.anio), ...teoriasConAnio.map((x) => x.anio)];
  const anioMin = Math.min(...todosLosAnios) - 3;
  const anioMax = Math.max(...todosLosAnios, new Date().getFullYear() - 5) + 3;
  const W = 1500, H = 300, PAD = 50;
  const x = (anio) => PAD + ((anio - anioMin) / (anioMax - anioMin)) * (W - PAD * 2);
  const decadas = [];
  for (let d = Math.ceil(anioMin / 10) * 10; d <= anioMax; d += 10) decadas.push(d);
  const yEje = H / 2 + 20;

  return (
    <div>
      <ContenedorPanZoom altura={280} escalaMin={0.5} escalaMax={5} escalaInicial={0.68}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ overflow: "visible", display: "block" }}>
        <line x1={PAD} y1={yEje} x2={W - PAD} y2={yEje} stroke={COLORS.line} strokeWidth={2} />
        {decadas.map((d) => (
          <g key={d}>
            <line x1={x(d)} y1={yEje - 4} x2={x(d)} y2={yEje + 4} stroke={COLORS.line} strokeWidth={1.5} />
            <text x={x(d)} y={yEje + 20} textAnchor="middle" fontFamily={FONT_MONO} fontSize={9} fill={COLORS.inkSoft}>{d}</text>
          </g>
        ))}

        {/* Teorías fundantes: fila fija por encima del eje, marcador de
            diamante en vez de círculo, color dorado para no competir con el
            color propio de la perspectiva (reservado a las escuelas). */}
        {teoriasConAnio.map(({ t, anio }, i) => {
          const cy = yEje - 58;
          const activo = hover === `teoria-${t.id}`;
          const esClicable = t.esTambienEscuelaPropia && escuelas.some((e) => e.id === t.esTambienEscuelaPropia);
          return (
            <g
              key={t.id}
              role={esClicable ? "button" : undefined}
              tabIndex={esClicable ? 0 : undefined}
              aria-label={`Teoría fundante: ${t.nombre}`}
              style={{ cursor: esClicable ? "pointer" : "default" }}
              onMouseEnter={() => setHover(`teoria-${t.id}`)}
              onMouseLeave={() => setHover(null)}
              onClick={esClicable ? () => onIrAEscuela(t.esTambienEscuelaPropia) : undefined}
              onKeyDown={esClicable ? activarConTeclado(() => onIrAEscuela(t.esTambienEscuelaPropia)) : undefined}
            >
              <line x1={x(anio)} y1={yEje} x2={x(anio)} y2={cy} stroke={COLORS.gold} strokeWidth={activo ? 2 : 1} opacity={activo ? 0.9 : 0.4} strokeDasharray="2,2" />
              <rect x={x(anio) - 4.5} y={cy - 4.5} width={9} height={9} transform={`rotate(45 ${x(anio)} ${cy})`} fill={COLORS.gold} stroke={COLORS.paper} strokeWidth={1.2} />
              <text x={x(anio)} y={cy - 10} textAnchor="middle" fontFamily={FONT_SERIF} fontWeight={activo ? 700 : 400} fontSize={activo ? 11 : 9.5} fill={activo ? COLORS.gold : COLORS.inkSoft}>
                {anio}
              </text>
              {activo && (
                <text x={x(anio)} y={cy - 24} textAnchor="middle" fontFamily={FONT_MONO} fontSize={9} fill={COLORS.ink}>
                  {(t.autoresPrincipales || t.nombre).length > 38 ? (t.autoresPrincipales || t.nombre).slice(0, 36) + "…" : (t.autoresPrincipales || t.nombre)}
                </text>
              )}
            </g>
          );
        })}

        {conAnio.map(({ e, anio }, i) => {
          const arriba = i % 2 === 0;
          const cy = arriba ? yEje - 34 : yEje + 34;
          const activo = hover === e.id;
          return (
            <g
              key={e.id}
              role="button"
              tabIndex={0}
              aria-label={`Abrir ficha de ${e.nombre}`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHover(e.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onIrAEscuela(e.id)}
              onKeyDown={activarConTeclado(() => onIrAEscuela(e.id))}
            >
              <line x1={x(anio)} y1={yEje} x2={x(anio)} y2={cy} stroke={color} strokeWidth={activo ? 2 : 1} opacity={activo ? 0.9 : 0.45} />
              <circle cx={x(anio)} cy={yEje} r={activo ? 5.5 : 4} fill={color} stroke={COLORS.paper} strokeWidth={1.5} />
              <text
                x={x(anio)}
                y={arriba ? cy - 6 : cy + 14}
                textAnchor="middle"
                fontFamily={FONT_SERIF}
                fontWeight={activo ? 700 : 400}
                fontSize={activo ? 11.5 : 10}
                fill={activo ? color : COLORS.ink}
              >
                {anio}
              </text>
              {activo && (
                <text x={x(anio)} y={arriba ? cy - 20 : cy + 28} textAnchor="middle" fontFamily={FONT_MONO} fontSize={9.5} fill={COLORS.ink}>
                  {e.nombre.length > 34 ? e.nombre.slice(0, 32) + "…" : e.nombre}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      </ContenedorPanZoom>
      {teoriasConAnio.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 2, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, background: COLORS.gold, transform: "rotate(45deg)", display: "inline-block" }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft }}>teoría fundante (◆) · escuela clínica (●)</span>
        </div>
      )}
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, textAlign: "center", marginTop: 4 }}>
        clic sobre un punto para abrir la ficha completa · pase el cursor sobre un punto para ver la fuente del año
      </div>
      {hover && (conAnio.find((x) => x.e.id === hover)?.hito || conAnio.find((x) => x.e.id === hover)?.fuente) && (
        <div style={{ marginTop: 8, background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 5, padding: "8px 12px", fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.ink }}>
          <strong>{conAnio.find((x) => x.e.id === hover).e.nombre}</strong> ({conAnio.find((x) => x.e.id === hover).anio}) — {conAnio.find((x) => x.e.id === hover).hito}{conAnio.find((x) => x.e.id === hover).fuente && <Fuente texto={conAnio.find((x) => x.e.id === hover).fuente} compacta />}
        </div>
      )}
      {sinAnio.length > 0 && (
        <div style={{ marginTop: 14, borderTop: `1px dashed ${COLORS.line}`, paddingTop: 10 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, marginBottom: 6, textTransform: "uppercase" }}>
            Sin año verificado todavía (no se omiten, solo no tienen posición en el eje)
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sinAnio.map((e) => (
              <span
                key={e.id}
                role="link"
                tabIndex={0}
                onClick={() => onIrAEscuela(e.id)}
                onKeyDown={activarConTeclado(() => onIrAEscuela(e.id))}
                style={{ fontFamily: FONT_MONO, fontSize: 10.5, color, border: `1px solid ${color}`, borderRadius: 8, padding: "3px 8px", cursor: "pointer" }}
              >
                {e.nombre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FichaFundamento({ p, onIrAEscuela, escuelas, enlaces }) {
  const color = PERSPECTIVA_COLOR[p.nombre];
  const clasif = CLASIFICACION_FILOSOFICA_PERSPECTIVA[p.id];
  const debates = DEBATES_PERSPECTIVAS[p.id] || [];
  return (
    <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 20, position: "relative" }}>
      <h3 style={{ fontFamily: "var(--f-display)", fontSize: 20, color: COLORS.ink, marginTop: 0, marginBottom: 14, borderBottom: `2px solid ${color}`, paddingBottom: 8, maxWidth: "70%" }}>
        {p.nombre}
      </h3>

      {/* Las 7 perspectivas comparten exactamente este mismo orden de secciones
          plegables, de modo que la estructura sea idéntica de una a otra; cuando
          una sección carece de contenido propio se muestra "sin registrar" en
          vez de omitirse, para no romper la comparabilidad entre perspectivas. */}

      <Desplegable titulo="1 · Contexto general" color={color} defaultAbierto={false}>
        <SeccionContextoInterna contexto={p.contexto} color={color} />
      </Desplegable>

      <Desplegable titulo="2 · Sub-perspectivas que componen este bloque" color={color} defaultAbierto={false}>
        <SeccionSubperspectivasInterna perspectivaId={p.id} color={color} onIrAEscuela={onIrAEscuela} escuelas={escuelas} enlaces={enlaces} />
      </Desplegable>

      <Desplegable titulo="3 · Fundamentos filosóficos" subtitulo="origen · unidad de análisis · mente-cuerpo · ontología · epistemología · metodología · criterio de verdad" color={color} defaultAbierto={false}>
        <BloqueFundamento titulo="Origen histórico" texto={p.origenHistorico} />
        <BloqueFundamento titulo="Unidad de análisis" texto={p.unidadAnalisis} />
        <BloqueFundamento titulo="Relación mente-cuerpo" texto={p.relacionMenteCuerpo} />
        <BloqueFundamento titulo="Ontología del psiquismo" texto={p.ontologia} />
        <BloqueFundamento titulo="Epistemología" texto={p.epistemologia} />
        <BloqueFundamento titulo="Metodología" texto={p.metodologia} />
        <BloqueFundamento titulo="Criterio de verdad / evidencia" texto={p.criterioVerdad} destacado />
        <BloqueFundamento titulo="Puente con clasificaciones.docx" texto={p.puenteFilosofico} />
      </Desplegable>

      <Desplegable titulo="4 · Clasificación filosófica ampliada" subtitulo="mapa ontológico · ismos · Hessen · Wolff · Crotty" color={COLORS.clay} defaultAbierto={false}>
        <SeccionClasificacionFilosoficaInterna clasif={clasif} color={color} />
      </Desplegable>

      <Desplegable titulo="5 · Debates abiertos" color={COLORS.garnet} defaultAbierto={false}>
        {debates.length === 0 ? (
          <TextoVacio texto="Sin debates abiertos registrados para esta perspectiva." />
        ) : (
          debates.map((d, i) => (
            <div key={i} style={{ marginBottom: 14, background: COLORS.paperDark, borderRadius: 12, padding: 12 }}>
              <div style={{ fontFamily: "var(--f-display)", fontSize: 14.5, fontWeight: 700, marginBottom: 8, color: COLORS.ink }}>{d.pregunta}</div>
              {d.posturas.map((pos, j) => (
                <div key={j} style={{ marginBottom: 10 }}>
                  <span
                    style={{
                      fontFamily: "var(--f-mono)",
                      fontSize: 10,
                      color: COLORS.onAcento,
                      background: j === 0 ? color : COLORS.inkSoft,
                      borderRadius: 8,
                      padding: "2px 7px",
                      display: "inline-block",
                      marginBottom: 5,
                    }}
                  >
                    {pos.nombre}
                  </span>
                  <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 13.5, lineHeight: 1.55, color: COLORS.ink }}>{pos.texto}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </Desplegable>
    </div>
  );
}

/* truncar: si se pasa un número de caracteres, el texto se recorta y se
   ofrece un toggle «leer más / leer menos». El texto original NUNCA se
   modifica ni se pierde: sigue completo en el estado de la app; esto solo
   afecta a cuánto se muestra en pantalla en un momento dado (pensado para
   la vista compacta de fichas largas). */
function TextoConCitas({ texto, tamano = 14, color: colorTexto = COLORS.ink, colorAcento, truncar, colorToggle }) {
  const [expandido, setExpandido] = useState(false);
  if (!texto) return null;
  const debeTruncar = truncar && !expandido && texto.length > truncar;
  const textoMostrado = debeTruncar ? texto.slice(0, truncar).replace(/\s+\S*$/, "") + "…" : texto;
  const partes = textoMostrado.split(/(«[^»]*»)/g);
  return (
    <div>
      <p style={{ margin: 0, maxWidth: "70ch", fontFamily: "var(--f-text)", fontSize: tamano, lineHeight: 1.55, color: colorTexto }}>
        {partes.map((parte, i) =>
          parte.startsWith("«") && parte.endsWith("»") ? (
            <span
              key={i}
              style={{
                fontStyle: "italic",
                color: colorAcento || COLORS.clay,
                background: "rgba(199,123,61,0.08)",
                borderLeft: `2.5px solid ${colorAcento || COLORS.clay}`,
                padding: "0 5px",
                margin: "0 1px",
                borderRadius: "0 3px 3px 0",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              {parte}
            </span>
          ) : (
            parte
          )
        )}
      </p>
      {truncar && texto.length > truncar && (
        <button
          onClick={() => setExpandido(!expandido)}
          style={{
            marginTop: 4,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: FONT_MONO,
            fontSize: 10.5,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: colorToggle || COLORS.primary,
          }}
        >
          {expandido ? "‹ leer menos" : "leer más ›"}
        </button>
      )}
    </div>
  );
}

function Desplegable({ titulo, subtitulo, color, defaultAbierto = false, children, vacio, vacioTexto }) {
  const [abierta, setAbierta] = useState(defaultAbierto);
  // Sincroniza cuando defaultAbierto pasa a true dinámicamente (p. ej. al
  // activar el modo estudio, que fuerza defaultAbierto=true en todas las
  // secciones para maximizar el contenido visible sin clics extra). No
  // se sincroniza en la dirección contraria para no cerrar de golpe algo
  // que el usuario abrió manualmente al salir del modo estudio.
  useEffect(() => {
    if (defaultAbierto) setAbierta(true);
  }, [defaultAbierto]);
  if (vacio) {
    return (
      <div style={{ marginBottom: 10, border: `1px dashed ${COLORS.line}`, borderRadius: 12, padding: "10px 14px" }}>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.05em", color: COLORS.inkSoft }}>
          {titulo}
        </span>
        <span style={{ fontFamily: "var(--f-text)", fontSize: 12, color: COLORS.inkSoft, fontStyle: "italic", marginLeft: 8 }}>
          — {vacioTexto || "sin registrar todavía"}
        </span>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 10, border: `1px solid ${COLORS.line}`, borderRadius: 12, overflow: "hidden" }}>
      <div
        className="psn-desp-cab"
        onClick={() => setAbierta(!abierta)}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "9px 14px", background: COLORS.paperDark }}
      >
        {abierta ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {(() => {
          // El título ya no compite tipográficamente con el subtítulo
          // monoespaciado vecino: el número de sección se separa en un
          // pequeño distintivo circular, y el resto del título pasa a
          // serif (la familia reservada al contenido principal en toda
          // la app), dejando el monoespaciado solo para metadatos.
          const m = (titulo || "").match(/^(\d+[a-z]?)\s*·\s*(.*)$/);
          if (!m) {
            return (
              <span style={{ fontFamily: "var(--f-display)", fontSize: 13, fontWeight: 700, color: color || COLORS.primary }}>{titulo}</span>
            );
          }
          return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 20, height: 20, borderRadius: "50%", background: color || COLORS.primary,
                  color: COLORS.onAcento, fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, flexShrink: 0,
                }}
              >
                {m[1]}
              </span>
              <span style={{ fontFamily: "var(--f-display)", fontSize: 13, fontWeight: 700, color: color || COLORS.primary }}>{m[2]}</span>
            </span>
          );
        })()}
        {subtitulo && (
          <span className="psn-desp-sub" style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.inkSoft, textTransform: "none" }}>{subtitulo}</span>
        )}
      </div>
      {abierta && <div style={{ padding: "14px", background: COLORS.cardBg }}>{children}</div>}
    </div>
  );
}

/* Tira de chips «de un vistazo»: previsualiza las cuatro coordenadas
   filosóficas en una sola línea, en la cabecera de la ficha, para no
   obligar a leer los cuatro párrafos completos (§2 · Coordenadas
   filosóficas, más abajo) solo para ubicarse. El texto NUNCA se acorta
   en la fuente de datos: aquí solo se muestra una vista previa; el
   texto íntegro sigue disponible al abrir esa sección. */
/* Traduce, a nivel de una sola escuela, el resultado del verificador de
   integridad global (calcularIntegridad) a una línea compacta en la propia
   ficha: así el efecto de una edición se ve en el mismo lugar donde se hizo,
   sin tener que abrir el panel global de "Salud de los datos" para
   comprobar si "se plasmó" en glosario/protocolo/citas. */
function BadgeCobertura({ escuelaId, integridad }) {
  const enGlosario = GLOSARIO.filter((g) => g.escuela === escuelaId).length;
  const tieneProtocolo = !!PROTOCOLOS_SEED[escuelaId];
  const tieneCitas = !!CITAS_AMPLIADAS[escuelaId];
  const problemasPropios = integridad.problemas.filter((p) => p.escuela === escuelaId);

  const Item = ({ label, valor, ok }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <span style={{ color: COLORS.inkSoft }}>{label}:</span>
      <span style={{ fontWeight: 700, color: ok === false ? COLORS.inkSoft : ok === true ? STATUS_COLORS.ok : COLORS.ink }}>{valor}</span>
    </span>
  );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14, fontFamily: "var(--f-mono)", fontSize: 10.5 }}>
      <Item label="Glosario" valor={enGlosario} ok={enGlosario > 0} />
      <Item label="Protocolo" valor={tieneProtocolo ? "✓" : "✗"} ok={tieneProtocolo} />
      <Item label="Citas" valor={tieneCitas ? "✓" : "✗"} ok={tieneCitas} />
      {problemasPropios.length > 0 && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: STATUS_COLORS.error, fontWeight: 700 }}>
          <AlertTriangle size={11} /> {problemasPropios.length} problema{problemasPropios.length !== 1 ? "s" : ""} de referencia
        </span>
      )}
    </div>
  );
}

function ChipsCoordenadas({ ontologia, epistemologia, metodologia, criterioVerdad, color }) {
  const campos = [
    { label: "Ontol.", texto: ontologia },
    { label: "Epist.", texto: epistemologia },
    { label: "Metod.", texto: metodologia },
    { label: "Verdad", texto: criterioVerdad, destacado: true },
  ].filter((c) => c.texto);
  if (campos.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
      {campos.map((c, i) => (
        <span
          key={i}
          title={c.texto}
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: 4,
            maxWidth: 260,
            fontFamily: "var(--f-text)",
            fontSize: 11.5,
            color: COLORS.inkSoft,
            background: c.destacado ? "rgba(156,107,74,0.08)" : COLORS.paperDark,
            border: `1px solid ${c.destacado ? COLORS.clay : COLORS.line}`,
            borderRadius: 20,
            padding: "3px 10px 3px 4px",
            overflow: "hidden",
          }}
        >
          <span style={{ fontFamily: FONT_MONO, fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: c.destacado ? COLORS.clay : color }}>{c.label}</span>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.texto}</span>
        </span>
      ))}
    </div>
  );
}

function BloqueFundamento({ titulo, texto, destacado, truncar }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", color: destacado ? COLORS.clay : COLORS.primary, marginBottom: 3 }}>
        {titulo}
      </div>
      {texto ? <TextoConCitas texto={texto} truncar={truncar} /> : <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 14, color: COLORS.inkSoft, fontStyle: "italic" }}>—</p>}
    </div>
  );
}

// Garabato decorativo, amistoso y suelto: un racimo de círculos tipo
// "flor" con un pétalo más grande flotando cerca, en el color de la
// perspectiva activa. Nada de simbolismo institucional (ni sellos, ni
// timbres) — solo una forma orgánica y alegre, muy tenue, que aparece
// con un pequeño rebote cada vez que cambia la perspectiva.
function SelloPerspectiva({ color }) {
  const petalos = Array.from({ length: 6 }, (_, i) => {
    const ang = (i / 6) * 2 * Math.PI;
    return { cx: 100 + 42 * Math.cos(ang), cy: 100 + 42 * Math.sin(ang), r: 26 - (i % 2) * 4 };
  });
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      width={160}
      height={160}
      className="psq-sello-girar"
      style={{ position: "absolute", top: 0, right: 0, opacity: 0.13, pointerEvents: "none" }}
    >
      {petalos.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={color} />
      ))}
      <circle cx="100" cy="100" r="20" fill={color} />
      <circle cx="168" cy="55" r="12" fill={color} />
      <circle cx="30" cy="150" r="7" fill={color} />
    </svg>
  );
}

function nombresPerspectivas(escuelas) {
  const orden = FUNDAMENTOS_PERSPECTIVAS.map((p) => p.id);
  return [...new Set(escuelas.map((e) => e.perspectiva))].sort((x, y) => orden.indexOf(PERSPECTIVA_ID_POR_NOMBRE[x]) - orden.indexOf(PERSPECTIVA_ID_POR_NOMBRE[y]));
}
function Cabecera({ icono, titulo, subtitulo, colorAcento, autores, tituloAutores, todasVoces }) {
  // El filete bajo el título: un solo color cuando la pantalla pertenece a
  // una perspectiva concreta (colorAcento), o un degradado con las 7
  // perspectivas cuando el módulo las mira todas a la vez — un mismo
  // recurso visual, discreto, que ata toda la app a la misma identidad de
  // color sin repetir la mancha grande de fondo en cada pantalla.
  const gradienteSiete = `linear-gradient(to right, ${Object.values(PERSPECTIVA_COLOR).slice(0, 7).join(", ")})`;
  return (
    <div style={{ paddingBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: colorAcento || COLORS.ink }}>
        <span style={{ display: "flex", color: colorAcento || COLORS.ink }}>{icono}</span>
        <h2 style={{ fontFamily: "var(--f-display)", fontSize: 23, fontWeight: 600, margin: 0, color: COLORS.ink, letterSpacing: "-0.01em" }}>{titulo}</h2>
      </div>
      {subtitulo && <p style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 7, maxWidth: 760, lineHeight: 1.55, fontFamily: "var(--f-text)" }}>{subtitulo}</p>}
      <div style={{ height: 3, borderRadius: 2, marginTop: 14, background: colorAcento || gradienteSiete, opacity: colorAcento ? 0.85 : 0.55, transition: "background 0.4s ease" }} />
      {todasVoces && (
        <GaleriaTodasLasVoces nombreDe={(id) => (FUNDAMENTOS_PERSPECTIVAS.find((p) => p.id === id) || {}).nombre} colorDe={(id) => PERSPECTIVA_COLOR[(FUNDAMENTOS_PERSPECTIVAS.find((p) => p.id === id) || {}).nombre]} />
      )}
      {autores && (
        <div className="psn-cab-fila">
          <GaleriaAutores slugs={autores} color={colorAcento} titulo={tituloAutores} />
        </div>
      )}
    </div>
  );
}

/* ---------- MÓDULO 1: ÁRBOL DE PERSPECTIVAS ---------- */
function FichaPerspectiva({ nombrePerspectiva, escuelas, onIrADiccionario }) {
  const id = PERSPECTIVA_ID_POR_NOMBRE[nombrePerspectiva];
  const color = PERSPECTIVA_COLOR[nombrePerspectiva];
  const fund = FUNDAMENTOS_PERSPECTIVAS.find((f) => f.id === id);
  const escuelasP = escuelas.filter((e) => e.perspectiva === nombrePerspectiva);
  const idsEscuelasP = new Set(escuelasP.map((e) => e.id));
  const conceptosGlosario = GLOSARIO.filter((g) => g.tipo === "concepto" && idsEscuelasP.has(g.escuela));
  const tecnicasGlosario = GLOSARIO.filter((g) => g.tipo === "técnica" && idsEscuelasP.has(g.escuela));
  const protocolosP = escuelasP
    .map((e) => ({ escuela: e, protocolo: PROTOCOLOS_SEED[e.id] }))
    .filter((x) => x.protocolo);
  const sinProtocolo = escuelasP.filter((e) => !PROTOCOLOS_SEED[e.id]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Sello color={color}>
            <Stamp size={12} /> panorama de perspectiva
          </Sello>
        </div>
        <h3 style={{ fontFamily: "var(--f-display)", fontSize: 21, marginTop: 6, marginBottom: 14, borderBottom: `2px solid ${color}`, paddingBottom: 8 }}>{nombrePerspectiva}</h3>
        {fund && (
          <>
            <BloqueFundamento titulo="Origen histórico" texto={fund.origenHistorico} />
            <BloqueFundamento titulo="Unidad de análisis" texto={fund.unidadAnalisis} />
            <BloqueFundamento titulo="Relación mente-cuerpo" texto={fund.relacionMenteCuerpo} />
            <div style={{ fontSize: 11.5, fontFamily: "var(--f-mono)", color: COLORS.primary, marginTop: 6 }}>
              Ver ontología, epistemología, metodología, criterio de verdad y debates abiertos completos en el Módulo 0 · Fundamentos.
            </div>
          </>
        )}
      </div>

      {conceptosGlosario.length > 0 && (
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", color: COLORS.primary, marginBottom: 8 }}>
            Conceptos centrales de la perspectiva ({conceptosGlosario.length}) — definiciones del Glosario traslacional
          </div>
          <div>
            {conceptosGlosario.map((c, i) => (
              <Etiqueta key={i}>
                <span
                  role={onIrADiccionario ? "link" : undefined}
                  tabIndex={onIrADiccionario ? 0 : undefined}
                  onClick={() => onIrADiccionario && onIrADiccionario(c.escuela, c.termino)}
                  onKeyDown={onIrADiccionario ? activarConTeclado(() => onIrADiccionario(c.escuela, c.termino)) : undefined}
                  style={{ cursor: onIrADiccionario ? "pointer" : "default" }}
                >
                  {c.termino} <span style={{ opacity: 0.6, fontSize: 9 }}>({escuelasP.find((e) => e.id === c.escuela)?.nombre})</span>
                </span>
              </Etiqueta>
            ))}
          </div>
          <p style={{ marginTop: 10, fontFamily: "var(--f-text)", fontSize: 11.5, color: COLORS.inkSoft, fontStyle: "italic" }}>
            Haz clic en cualquier concepto para ver su definición completa, cita y equivalentes en el Diccionario traslacional.
          </p>
        </div>
      )}

      {tecnicasGlosario.length > 0 && (
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", color: COLORS.primary, marginBottom: 8 }}>
            Técnicas de la perspectiva ({tecnicasGlosario.length}) — definiciones del Glosario traslacional
          </div>
          <div>
            {tecnicasGlosario.map((t, i) => (
              <Etiqueta key={i}>
                <span
                  role={onIrADiccionario ? "link" : undefined}
                  tabIndex={onIrADiccionario ? 0 : undefined}
                  onClick={() => onIrADiccionario && onIrADiccionario(t.escuela, t.termino)}
                  onKeyDown={onIrADiccionario ? activarConTeclado(() => onIrADiccionario(t.escuela, t.termino)) : undefined}
                  style={{ cursor: onIrADiccionario ? "pointer" : "default" }}
                >
                  {t.termino} <span style={{ opacity: 0.6, fontSize: 9 }}>({escuelasP.find((e) => e.id === t.escuela)?.nombre})</span>
                </span>
              </Etiqueta>
            ))}
          </div>
          <p style={{ marginTop: 10, fontFamily: "var(--f-text)", fontSize: 11.5, color: COLORS.inkSoft, fontStyle: "italic" }}>
            Haz clic en cualquier técnica para ver su Definición, Función y Contextos completos en el Diccionario traslacional.
          </p>
        </div>
      )}

      <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", color: COLORS.sage, marginBottom: 10 }}>
          Protocolos disponibles en esta perspectiva ({protocolosP.length} de {escuelasP.length} escuelas)
        </div>
        {protocolosP.length === 0 && (
          <p style={{ fontFamily: "var(--f-text)", fontSize: 13, color: COLORS.inkSoft }}>
            Ninguna escuela de esta perspectiva cuenta, en el material de referencia, con manual estandarizado publicado.
          </p>
        )}
        {protocolosP.map(({ escuela, protocolo }, i) => (
          <div key={i} style={{ borderLeft: `3px solid ${COLORS.sage}`, paddingLeft: 10, marginBottom: 12 }}>
            <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5 }}>
              {escuela.nombre} — {protocolo.nombre}
            </div>
            <div style={{ marginBottom: 6 }}><Fuente texto={protocolo.fuente} /></div>
            <div style={{ fontFamily: "var(--f-text)", fontSize: 12.5 }}>
              <strong>Población: </strong>
              {protocolo.poblacion}
            </div>
          </div>
        ))}
        {sinProtocolo.length > 0 && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${COLORS.line}` }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: COLORS.inkSoft, marginBottom: 6 }}>
              Sin protocolo estandarizado en la bibliografía revisada (solo técnicas):
            </div>
            {sinProtocolo.map((e) => (
              <Etiqueta key={e.id}>{e.nombre}</Etiqueta>
            ))}
          </div>
        )}
      </div>

      {escuelasP.some((e) => PROCEDIMIENTOS_CLINICOS[e.id]) && (
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", color: COLORS.garnet, marginBottom: 10 }}>
            Procedimientos clínicos sistematizados (momentos terapéuticos, no validados por ensayo clínico)
          </div>
          {escuelasP
            .filter((e) => PROCEDIMIENTOS_CLINICOS[e.id])
            .map((e) => (
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>{e.nombre}</div>
                {PROCEDIMIENTOS_CLINICOS[e.id].map((proc, i) => (
                  <Etiqueta key={i}>{proc.nombre}</Etiqueta>
                ))}
              </div>
            ))}
        </div>
      )}

      {SUBVARIANTES_ESCUELA && escuelasP.some((e) => SUBVARIANTES_ESCUELA[e.id]) && (
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", color: color, marginBottom: 10 }}>
            Escuelas con sub-variantes internas documentadas
          </div>
          {escuelasP
            .filter((e) => SUBVARIANTES_ESCUELA[e.id])
            .map((e) => (
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>
                  {e.nombre} <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: COLORS.inkSoft }}>({SUBVARIANTES_ESCUELA[e.id].length})</span>
                </div>
                {SUBVARIANTES_ESCUELA[e.id].map((sv, i) => (
                  <Etiqueta key={i}>{sv.nombre}</Etiqueta>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function VacioAviso({ texto, icono }) {
  return (
    <div
      style={{
        border: `1.5px dashed ${COLORS.line}`,
        borderRadius: 10,
        padding: "34px 24px",
        textAlign: "center",
        color: COLORS.inkSoft,
        background: `repeating-linear-gradient(135deg, transparent, transparent 10px, ${COLORS.paperDark}55 10px, ${COLORS.paperDark}55 20px)`,
      }}
    >
      <div style={{ marginBottom: 10, opacity: 0.55 }}>
        {icono || <Search size={26} strokeWidth={1.3} color={COLORS.inkSoft} />}
      </div>
      <p style={{ fontFamily: "var(--f-text)", fontSize: 13.5, lineHeight: 1.5, margin: 0, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
        {texto}
      </p>
    </div>

  );
}

// Detecta si un paso empieza con un prefijo de agrupación tipo "Fase 1 —",
// "Sesión 3:", "Paso 2 (10 min)" etc., para poder agrupar automáticamente
// los pasos de CUALQUIER protocolo o técnica en tarjetas por sesión/fase
// sin tener que re-etiquetar manualmente ~168 entradas una por una.
function detectarGrupoPaso(texto) {
  const m = (texto || "").match(/^(Fase|Sesión|Sesion|Paso|Momento|Etapa)\s+(\d+)\s*[—\-:(]/i);
  return m ? `${m[1]} ${m[2]}` : null;
}

/* Reemplaza la lista <ol> plana usada hasta ahora por TODOS los
   protocolos y técnicas de la app: agrupa automáticamente los pasos que
   comparten un prefijo de fase/sesión en tarjetas colapsables (abiertas
   por defecto solo la primera), y dentro de cada tarjeta ofrece una
   casilla de progreso por paso (solo visual, de sesión de lectura — no
   se guarda entre visitas) para que revisar un protocolo largo se pueda
   hacer "marcando" avance en vez de solo leyendo un bloque de texto. */
// Extrae una duración aproximada en minutos de un paso, si el propio
// texto la declara (patrones típicos ya presentes en los datos: "(10-15
// min)", "(45 min)", "Fase 3 (5-10 min)"). Toma el extremo superior del
// rango como estimación conservadora.
function extraerMinutosPaso(texto) {
  const m = (texto || "").match(/\((\d+)(?:\s*[-–a]\s*(\d+))?\s*min/i);
  if (!m) return 0;
  return m[2] ? parseInt(m[2], 10) : parseInt(m[1], 10);
}

function PasosInteractivos({ pasos, colorAcento = COLORS.sage }) {
  const [completados, setCompletados] = useState(() => new Set());
  const [gruposAbiertos, setGruposAbiertos] = useState(() => new Set([0]));
  const toggleCompletado = (idx) =>
    setCompletados((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  const toggleGrupo = (gi) =>
    setGruposAbiertos((prev) => {
      const next = new Set(prev);
      next.has(gi) ? next.delete(gi) : next.add(gi);
      return next;
    });
  const reiniciarProgreso = () => setCompletados(new Set());
  const marcarTodo = () => setCompletados(new Set(pasos.map((_, i) => i)));

  const minutosPorPaso = useMemo(() => pasos.map(extraerMinutosPaso), [pasos]);
  const minutosTotales = minutosPorPaso.reduce((a, b) => a + b, 0);

  // Agrupa pasos consecutivos que comparten grupo detectado; los pasos
  // sin prefijo de grupo detectable quedan como "grupo suelto" propio,
  // preservando el orden original.
  const grupos = useMemo(() => {
    const out = [];
    pasos.forEach((texto, idx) => {
      const etiquetaGrupo = detectarGrupoPaso(texto);
      const anterior = out[out.length - 1];
      if (etiquetaGrupo && anterior && anterior.etiqueta === etiquetaGrupo) {
        anterior.items.push({ texto, idx });
      } else {
        out.push({ etiqueta: etiquetaGrupo || `Paso ${idx + 1}`, esGrupoReal: !!etiquetaGrupo, items: [{ texto, idx }] });
      }
    });
    return out;
  }, [pasos]);

  const usaGrupos = grupos.some((g) => g.esGrupoReal && g.items.length > 1);
  const totalCompletados = completados.size;

  const encabezado = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
      <BarraProgresoPasos completados={totalCompletados} total={pasos.length} color={colorAcento} minutosTotales={minutosTotales} />
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={marcarTodo} style={ESTILO_BOTON_PASOS(colorAcento)}>marcar todo</button>
        <button onClick={reiniciarProgreso} style={ESTILO_BOTON_PASOS(colorAcento)}>⟲ reiniciar</button>
      </div>
    </div>
  );

  if (!usaGrupos) {
    // Sin fases/sesiones detectables: lista de tarjetas numeradas con
    // casilla de progreso, más interactiva que un <ol> plano aunque no
    // haya agrupación posible.
    return (
      <div>
        {encabezado}
        <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
          {pasos.map((texto, idx) => (
            <PasoIndividual key={idx} numero={idx + 1} texto={texto} completado={completados.has(idx)} onToggle={() => toggleCompletado(idx)} color={colorAcento} minutos={minutosPorPaso[idx]} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {encabezado}
      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        {grupos.map((g, gi) => {
          const abierto = gruposAbiertos.has(gi);
          const completadosGrupo = g.items.filter((it) => completados.has(it.idx)).length;
          const minutosGrupo = g.items.reduce((a, it) => a + minutosPorPaso[it.idx], 0);
          return (
            <div key={gi} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 12, overflow: "hidden" }}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleGrupo(gi)}
                onKeyDown={activarConTeclado(() => toggleGrupo(gi))}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
                  background: completadosGrupo === g.items.length ? `${colorAcento}22` : COLORS.paperDark, padding: "8px 12px",
                  transition: "background 0.15s",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, color: colorAcento }}>
                  {completadosGrupo === g.items.length ? "✓" : abierto ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  {g.etiqueta}
                  <span style={{ color: COLORS.inkSoft, fontWeight: 400 }}>
                    ({completadosGrupo}/{g.items.length}{minutosGrupo > 0 ? ` · ~${minutosGrupo} min` : ""})
                  </span>
                </span>
              </div>
              {abierto && (
                <div style={{ padding: "10px 12px", display: "grid", gap: 6 }}>
                  {g.items.map((it) => (
                    <PasoIndividual key={it.idx} numero={it.idx + 1} texto={it.texto} completado={completados.has(it.idx)} onToggle={() => toggleCompletado(it.idx)} color={colorAcento} quitarPrefijo={g.esGrupoReal} minutos={minutosPorPaso[it.idx]} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
const ESTILO_BOTON_PASOS = (color) => ({
  fontFamily: FONT_MONO, fontSize: 9.5, padding: "3px 9px", borderRadius: 12, cursor: "pointer",
  border: `1px solid ${color}`, background: "transparent", color,
});
function BarraProgresoPasos({ completados, total, color, minutosTotales = 0 }) {
  if (total <= 1) return null;
  const pct = Math.round((completados / total) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 180 }}>
      <div style={{ flex: 1, height: 5, background: COLORS.paperDark, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width 0.2s ease" }} />
      </div>
      <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, flexShrink: 0 }}>
        {completados}/{total} pasos{minutosTotales > 0 ? ` · ~${minutosTotales} min totales` : ""}
      </span>
    </div>
  );
}
function PasoIndividual({ numero, texto, completado, onToggle, color, quitarPrefijo, minutos = 0 }) {
  const [expandido, setExpandido] = useState(false);
  const [destello, setDestello] = useState(false);
  const manejarToggle = () => {
    if (!completado) {
      // Micro-animación de destello solo al MARCAR (no al desmarcar): un
      // breve pulso de escala en la casilla, para que "completar un
      // paso" tenga una recompensa visual momentánea, no solo un cambio
      // de color instantáneo y frío.
      setDestello(true);
      setTimeout(() => setDestello(false), 320);
    }
    onToggle();
  };
  // Dentro de una tarjeta de grupo, quita el prefijo redundante ("Fase 1
  // — ") del texto del paso, porque el encabezado del grupo ya lo dice.
  const textoLimpio = quitarPrefijo ? (texto || "").replace(/^(Fase|Sesión|Sesion|Paso|Momento|Etapa)\s+\d+\s*[—\-:(][^)]*\)?\s*[—\-:]?\s*/i, "") : texto;
  const esLargo = (textoLimpio || "").length > 240;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <button
        onClick={manejarToggle}
        title={completado ? "Marcar como pendiente" : "Marcar como leído/hecho"}
        style={{
          flexShrink: 0, width: 20, height: 20, borderRadius: "50%", marginTop: 1, cursor: "pointer",
          border: `1.5px solid ${completado ? color : COLORS.line}`, background: completado ? color : "transparent",
          color: COLORS.onAcento, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_MONO,
          transform: destello ? "scale(1.35)" : "scale(1)",
          boxShadow: destello ? `0 0 0 5px ${color}33` : "none",
          transition: "transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.32s ease, background 0.15s ease, border-color 0.15s ease",
        }}
      >
        {completado ? "✓" : numero}
      </button>

      <div style={{ flex: 1 }}>
        {minutos > 0 && (
          <span style={{ fontFamily: FONT_MONO, fontSize: 9, color, background: `${color}18`, padding: "1px 6px", borderRadius: 14, marginRight: 6 }}>
            ⏱ ~{minutos} min
          </span>
        )}
        <p
          onClick={esLargo ? () => setExpandido((v) => !v) : undefined}
          style={{
            margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.55, display: "inline",
            color: completado ? COLORS.inkSoft : COLORS.ink, textDecoration: completado ? "line-through" : "none",
            cursor: esLargo ? "pointer" : "default",
          }}
        >
          <span
            style={{
              display: esLargo && !expandido ? "-webkit-box" : "inline",
              WebkitLineClamp: esLargo && !expandido ? 2 : "unset",
              WebkitBoxOrient: "vertical",
              overflow: esLargo && !expandido ? "hidden" : "visible",
            }}
          >
            {textoLimpio}
          </span>
          {esLargo && <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color, marginLeft: 6 }}>{expandido ? "▲" : "▼"}</span>}
        </p>
      </div>
    </div>
  );
}

function DetalleCondiciones({ texto }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div style={{ marginTop: 6 }}>
      <span
        onClick={() => setAbierto(!abierto)}
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 10.5,
          color: COLORS.garnet,
          cursor: "pointer",
          textDecoration: "underline",
          textUnderlineOffset: 2,
        }}
      >
        {abierto ? "▾ ocultar condiciones y delimitaciones" : "▸ ver condiciones y delimitaciones (enlace)"}
      </span>
      {abierto && (
        <p style={{ margin: "6px 0 0", fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.55, color: COLORS.ink, background: COLORS.aviso, border: `1px solid ${COLORS.gold}`, borderRadius: 8, padding: 10 }}>
          {texto}
        </p>
      )}
    </div>
  );
}

function FichaEscuela({ e, editando, onEditar, onGuardar, onCambiar, onBorrar, onAbrirDefinicion, onIrADiccionario, enlaces, escuelas, onIrAEscuela, integridad, modoEstudio }) {
  const color = PERSPECTIVA_COLOR[e.perspectiva];
  const filo = FILOSOFIA_ESCUELA[e.id];
  const subvariantes = SUBVARIANTES_ESCUELA[e.id];
  const procedimientos = PROCEDIMIENTOS_CLINICOS[e.id];
  const citas = CITAS_AMPLIADAS[e.id];
  // Por defecto la ficha es compacta (contenido sucinto): trunca texto
  // largo y limita listas. El modo estudio fuerza la vista extendida sin
  // truncar nada, con independencia de lo que el usuario haya elegido
  // manualmente — es la diferencia de densidad de contenido que separa
  // "consulta rápida" de "revisión de estudio a fondo".
  const [vistaCompactaManual, setVistaCompactaManual] = useState(true);
  const vistaCompacta = modoEstudio ? false : vistaCompactaManual;
  const setVistaCompacta = setVistaCompactaManual;
  const [autorAbierto, setAutorAbierto] = useState(null);
  return (
    <div style={{ position: "relative", marginTop: 14 }}>
      {/* Pestaña de carpeta: refuerza la metáfora de "expediente clínico" */}
      <div
        style={{
          position: "absolute",
          top: -14,
          left: 18,
          background: color,
          color: COLORS.onAcento,
          fontFamily: FONT_MONO,
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          padding: "4px 12px 6px",
          borderRadius: "5px 5px 0 0",
          boxShadow: "0 -1px 0 rgba(0,0,0,0.05) inset",
        }}
      >
        expediente · {e.perspectiva}
      </div>
      <div style={{ background: COLORS.cardBg, borderLeft: `1px solid ${COLORS.line}`, borderRight: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}`, borderTop: `3px solid ${color}`, borderRadius: "0 6px 6px 6px", padding: 20 }}>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 10, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
        <span style={{ color }}>{e.perspectiva}</span>
        {e.subfamilia && (
          <>
            <ChevronRight size={11} style={{ opacity: 0.5 }} />
            <span>{e.subfamilia}</span>
          </>
        )}
        <ChevronRight size={11} style={{ opacity: 0.5 }} />
        <span style={{ color: COLORS.ink, fontWeight: 700 }}>{e.nombre}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          {editando ? (
            <>
              <input
                value={e.nombre}
                onChange={(ev) => onCambiar("nombre", ev.target.value)}
                style={{ fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 700, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "4px 8px", width: "100%" }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <label style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.inkSoft }}>id:</label>
                <input
                  value={e.id}
                  onChange={(ev) => onCambiar("id", ev.target.value)}
                  title="Cambiar el id rompe cualquier referencia guardada como texto en otros módulos hasta que se corrija"
                  style={{ fontFamily: "var(--f-mono)", fontSize: 11, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "3px 6px", width: 140 }}
                />
                <span style={{ fontFamily: "ui-serif,Georgia,serif", fontStyle: "italic", fontSize: 10.5, color: STATUS_COLORS.advertencia }}>
                  ⚠ afecta enlaces, planes y glosario existentes
                </span>
              </div>
            </>
          ) : (
            <h3 style={{ fontFamily: "var(--f-display)", fontSize: 20, margin: 0, color: COLORS.ink }}>{e.nombre}</h3>
          )}
          <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <Sello color={color}>{e.perspectiva}</Sello>
            <SelloCriterio texto={e.criterioVerdad} />
            <BadgeEnlaces escuelaId={e.id} enlaces={enlaces} onIrADiccionario={onIrADiccionario} />
            {e._editado && (
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.inkSoft, marginLeft: 8 }}>
                ✎ editado {new Date(e._editado).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          {!editando && <RetratosEscuela autores={e.autores} color={color} />}
          {modoEstudio && !editando && <QuizEscuela e={e} escuelas={escuelas} />}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {!editando && (
            <Boton small variant="ghost" onClick={() => setVistaCompacta(!vistaCompacta)}>
              {vistaCompacta ? "vista completa" : "vista compacta"}
            </Boton>
          )}
          {editando ? (
            <Boton small onClick={onGuardar}>
              <Save size={12} /> guardar
            </Boton>
          ) : (
            <Boton small variant="ghost" onClick={onEditar}>
              editar
            </Boton>
          )}
          <Boton small variant="danger" onClick={onBorrar} aria-label={`Eliminar la escuela ${e.nombre}`} title="Eliminar esta escuela">
            <Trash2 size={12} />
          </Boton>
        </div>
      </div>

      {!editando && (e.ontologia || e.epistemologia || e.metodologia || e.criterioVerdad) && (
        <ChipsCoordenadas ontologia={e.ontologia} epistemologia={e.epistemologia} metodologia={e.metodologia} criterioVerdad={e.criterioVerdad} color={color} />
      )}

      {!editando && integridad && <BadgeCobertura escuelaId={e.id} integridad={integridad} />}

      {editando ? (
        <ListaEditable
          label="Fundamentos teóricos (ids de AUTORES_TEORICOS, p. ej. «pavlov-watson»)"
          items={e.fundamentosTeoricos || []}
          onChange={(v) => onCambiar("fundamentosTeoricos", v)}
        />
      ) : (
        (e.fundamentosTeoricos || []).length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center", marginBottom: 14, padding: "8px 10px", background: COLORS.paperDark, borderRadius: 12, border: `1px solid ${COLORS.line}` }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: COLORS.ink }}>
              <BookOpen size={12} /> Fundamentos teóricos:
            </span>
            {e.fundamentosTeoricos.map((id) => {
              const autor = AUTORES_TEORICOS.find((a) => a.id === id);
              if (!autor) return null;
              return (
                <span
                  key={id}
                  onClick={() => setAutorAbierto(autor)}
                  title={`Ver ficha de ${autor.nombre}`}
                  style={{
                    cursor: "pointer",
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 700,
                    color: COLORS.onAcento,
                    background: COLORS.inkSoft,
                    borderRadius: 20,
                    padding: "3px 11px",
                  }}
                >
                  {autor.nombre.split("(")[0].trim()} ↗
                </span>
              );
            })}
          </div>
        )
      )}

      {(() => {
        const comoHibrido = AUTORES_TEORICOS.find((a) => a.esTambienEscuelaPropia === e.id);
        if (!comoHibrido) return null;
        const otras = escuelasFundamentadasPor(comoHibrido.id, escuelas || []);
        if (otras.length === 0) return null;
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center", marginBottom: 14, padding: "8px 10px", background: "#F0EDE4", borderRadius: 12, border: `1px dashed ${COLORS.ink}` }}>
            <span style={{ fontFamily: "var(--f-text)", fontSize: 12, fontStyle: "italic", color: COLORS.ink }}>
              Esta escuela es, además, teoría fundante de:
            </span>
            {otras.map((o) => (
              <Boton key={o.id} small variant="ghost" onClick={() => onIrAEscuela(o.id)}>
                {o.nombre}
              </Boton>
            ))}
          </div>
        );
      })()}

      {autorAbierto && (
        <ModalAutorTeorico
          autor={autorAbierto}
          onCerrar={() => setAutorAbierto(null)}
          escuelasFundamentadas={escuelasFundamentadasPor(autorAbierto.id, escuelas || [])}
          onIrAEscuela={onIrAEscuela}
        />
      )}

      {editando ? (
        <CampoTexto label="Autores" value={e.autores} onChange={(v) => onCambiar("autores", v)} />
      ) : (
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: COLORS.inkSoft, marginTop: -4, marginBottom: 14 }}>{e.autores}</p>
      )}

      {editando ? (
        <>
          <CampoTexto label="Fundamentación (con cita breve y referencia)" value={e.fundamentacion} onChange={(v) => onCambiar("fundamentacion", v)} area />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18, marginTop: 6 }}>
            <CampoTexto label="Ontología" value={e.ontologia} onChange={(v) => onCambiar("ontologia", v)} area />
            <CampoTexto label="Epistemología" value={e.epistemologia} onChange={(v) => onCambiar("epistemologia", v)} area />
            <CampoTexto label="Metodología" value={e.metodologia} onChange={(v) => onCambiar("metodologia", v)} area />
            <CampoTexto label="Criterio de verdad" value={e.criterioVerdad} onChange={(v) => onCambiar("criterioVerdad", v)} area />
          </div>
          <ListaEditable label="Conceptos centrales" items={e.conceptos || []} onChange={(v) => onCambiar("conceptos", v)} />
          <CampoTexto label="Psicopatología (en sus propios términos)" value={e.psicopatologia} onChange={(v) => onCambiar("psicopatologia", v)} area />
          <ListaEditable label="Técnicas" items={e.tecnicas || []} onChange={(v) => onCambiar("tecnicas", v)} />
          <ListaEditable label="Presentaciones clínicas propias" items={e.presentaciones || []} onChange={(v) => onCambiar("presentaciones", v)} />
          <CampoTexto label="Evidencia" value={e.evidencia} onChange={(v) => onCambiar("evidencia", v)} area />
          <ListaEditable label="Contraindicaciones" items={e.contraindicaciones || []} onChange={(v) => onCambiar("contraindicaciones", v)} />
          <CampoTexto label="Nota de distinción frente a escuelas afines (cita ids entre backticks, p. ej. `h3`)" value={e.notaDistincion} onChange={(v) => onCambiar("notaDistincion", v)} area />
        </>
      ) : (
        <div key={vistaCompacta ? "compact" : "full"}>
          {/* Todas las escuelas comparten exactamente este mismo orden de secciones
              plegables. Las secciones sin contenido para una escuela concreta se
              muestran igualmente, marcadas "sin registrar", en vez de omitirse —
              así la estructura no varía de una escuela a otra, aunque el contenido
              disponible sí lo haga (p. ej. no todas tienen protocolo, sub-variantes
              o clasificación filosófica ampliada). Vista compacta: todas las
              secciones arrancan plegadas para minimizar la densidad tipográfica,
              se ocultan las secciones secundarias (biografía, presentaciones,
              sub-variantes, procedimientos, clasificación filosófica ampliada)
              detrás de un solo acceso a vista completa, y se agrega una tira de
              resumen numérico para escanear la ficha sin abrir nada. */}

          {vistaCompacta && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12, padding: "8px 10px", background: COLORS.paperDark, borderRadius: 12, fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.inkSoft }}>
              <span><strong style={{ color: COLORS.ink }}>{e.autores || "—"}</strong></span>
              <span>·</span>
              <span>{(e.conceptos || []).length} conceptos</span>
              <span>·</span>
              <span>{(e.tecnicas || []).length} técnicas</span>
              <span>·</span>
              <span>{(e.presentaciones || []).length} presentaciones</span>
              <span>·</span>
              <span>{(e.contraindicaciones || []).length} contraindicaciones</span>
              <span>·</span>
              <span>{(e.referencias || []).length} referencias</span>
              {subvariantes && (
                <>
                  <span>·</span>
                  <span>{subvariantes.length} sub-variantes</span>
                </>
              )}
              {procedimientos && (
                <>
                  <span>·</span>
                  <span>{procedimientos.length} procedimientos</span>
                </>
              )}
            </div>
          )}

          {modoEstudio && (
            <div style={{ marginBottom: 14, background: COLORS.paperDark, border: `1px dashed ${color}`, borderRadius: 14, padding: 14, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              {/* Brújula filosófica: solo aparece en modo estudio. La vista
                  normal ya muestra estas cuatro coordenadas como texto en
                  la sección 2, pero en modo estudio se busca una síntesis
                  visual de un vistazo que la vista sucinta no necesita. */}
              <svg viewBox="0 0 140 140" width="120" height="120" style={{ flexShrink: 0 }} role="img" aria-label="Brújula de las cuatro coordenadas filosóficas">
                <circle cx="70" cy="70" r="62" fill="none" stroke={COLORS.line} strokeWidth="1" />
                <circle cx="70" cy="70" r="4" fill={color} />
                <line x1="70" y1="28" x2="70" y2="112" stroke={COLORS.line} strokeWidth="1" strokeDasharray="2,3" />
                <line x1="52" y1="70" x2="88" y2="70" stroke={COLORS.line} strokeWidth="1" strokeDasharray="2,3" />
                <text x="70" y="20" textAnchor="middle" fontFamily={FONT_MONO} fontSize="7.5" fill={color} fontWeight="700">ONTOLOGÍA</text>
                <text x="70" y="126" textAnchor="middle" fontFamily={FONT_MONO} fontSize="7.5" fill={color} fontWeight="700">CRITERIO DE VERDAD</text>
                <text x="12" y="73" textAnchor="start" fontFamily={FONT_MONO} fontSize="7.5" fill={color} fontWeight="700">EPISTEM.</text>
                <text x="128" y="73" textAnchor="end" fontFamily={FONT_MONO} fontSize="7.5" fill={color} fontWeight="700">MÉTODO</text>
              </svg>
              <div style={{ flex: 1, minWidth: 200, display: "grid", gap: 6 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: color, fontWeight: 700, textTransform: "uppercase" }}>◆ Modo estudio — síntesis rápida antes del detalle</div>
                <div style={{ fontFamily: "var(--f-text)", fontSize: 12, color: COLORS.inkSoft, lineHeight: 1.5 }}>
                  <strong style={{ color: COLORS.ink }}>{e.autores}</strong> · {e.perspectiva}{e.subfamilia ? ` · ${e.subfamilia}` : ""}
                  {ANIO_ORIGEN[e.id] && <> · origen ≈ {ANIO_ORIGEN[e.id].anio}</>}
                </div>
              </div>
            </div>
          )}

          <Desplegable titulo="1 · Fundamentación" color={color} defaultAbierto={modoEstudio}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              {/«.*»/.test(e.fundamentacion) && (
                <span style={{ fontSize: 9.5, fontFamily: "var(--f-mono)", color: COLORS.clay, border: `1px solid ${COLORS.clay}`, borderRadius: 6, padding: "0 5px" }}>
                  cita textual verificable
                </span>
              )}
            </div>
            {e.fundamentacion ? <TextoConCitas texto={e.fundamentacion} truncar={vistaCompacta ? 180 : undefined} /> : <p style={{ margin: 0 }}><TextoVacio texto="Sin fundamentación registrada." /></p>}
          </Desplegable>

          {e.biografiaAutor && !vistaCompacta && (
            <Desplegable titulo="1b · Biografía y trayectoria del autor" color={color} defaultAbierto={modoEstudio}>
              <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 13.5, lineHeight: 1.6, color: COLORS.ink }}>
                {e.biografiaAutor}
              </p>
            </Desplegable>
          )}

          <Desplegable titulo="2 · Coordenadas filosóficas" subtitulo="ontología · epistemología · metodología · criterio de verdad" color={color} defaultAbierto={modoEstudio}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
              <BloqueFundamento titulo="Ontología" texto={e.ontologia} truncar={vistaCompacta ? 140 : undefined} />
              <BloqueFundamento titulo="Epistemología" texto={e.epistemologia} truncar={vistaCompacta ? 140 : undefined} />
              <BloqueFundamento titulo="Metodología" texto={e.metodologia} truncar={vistaCompacta ? 140 : undefined} />
              <BloqueFundamento titulo="Criterio de verdad" texto={e.criterioVerdad} destacado truncar={vistaCompacta ? 140 : undefined} />
            </div>
          </Desplegable>

          <Desplegable titulo="3 · Conceptos centrales" subtitulo="clic → diccionario traslacional" color={color} defaultAbierto={modoEstudio}>
            {(e.conceptos || []).length === 0 ? (
              <TextoVacio texto="Sin conceptos centrales registrados." />
            ) : (
              <>
                {(vistaCompacta ? (e.conceptos || []).slice(0, 5) : e.conceptos || []).map((c, i) => (
                  <EtiquetaDefinible
                    key={i}
                    termino={c}
                    escuelaId={e.id}
                    tipo="concepto"
                    onAbrir={onIrADiccionario}
                    color={color}
                    icono="→"
                    contador={enlaces ? enlacesDeConcepto(enlaces, e.id, c).length : 0}
                  />
                ))}
                {vistaCompacta && (e.conceptos || []).length > 5 && (
                  <span
                    onClick={() => setVistaCompacta(false)}
                    style={{ cursor: "pointer", fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, textDecoration: "underline", marginLeft: 4 }}
                  >
                    +{(e.conceptos || []).length - 5} más — ver vista completa
                  </span>
                )}
              </>
            )}
          </Desplegable>

          <Desplegable titulo="4 · Psicopatología" subtitulo="en sus propios términos" color={color} defaultAbierto={modoEstudio}>
            {e.psicopatologia ? <TextoConCitas texto={e.psicopatologia} truncar={vistaCompacta ? 180 : undefined} /> : <TextoVacio texto="Sin psicopatología registrada." />}
          </Desplegable>

          <Desplegable titulo="5 · Técnicas" subtitulo="clic para ver definición" color={COLORS.clay} defaultAbierto={modoEstudio}>
            {(e.tecnicas || []).length === 0 ? (
              <TextoVacio texto="Sin técnicas registradas." />
            ) : (
              <>
                {(vistaCompacta ? (e.tecnicas || []).slice(0, 5) : e.tecnicas || []).map((c, i) => (
                  <EtiquetaDefinible key={i} termino={c} escuelaId={e.id} tipo="técnica" onAbrir={onAbrirDefinicion} color={COLORS.clay} />
                ))}
                {vistaCompacta && (e.tecnicas || []).length > 5 && (
                  <span
                    onClick={() => setVistaCompacta(false)}
                    style={{ cursor: "pointer", fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, textDecoration: "underline", marginLeft: 4 }}
                  >
                    +{(e.tecnicas || []).length - 5} más — ver vista completa
                  </span>
                )}
              </>
            )}
          </Desplegable>

          <Desplegable titulo="6 · Presentaciones clínicas propias" subtitulo="nativas" color={COLORS.clay} defaultAbierto={modoEstudio}>
            {(e.presentaciones || []).length === 0 ? (
              <TextoVacio texto="Sin presentaciones clínicas propias registradas." />
            ) : (
              <>
                {(vistaCompacta ? (e.presentaciones || []).slice(0, 3) : e.presentaciones || []).map((c, i) => <Etiqueta key={i}>{c}</Etiqueta>)}
                {vistaCompacta && (e.presentaciones || []).length > 3 && (
                  <span
                    onClick={() => setVistaCompacta(false)}
                    style={{ cursor: "pointer", fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, textDecoration: "underline", marginLeft: 4 }}
                  >
                    +{(e.presentaciones || []).length - 3} más — ver vista completa
                  </span>
                )}
              </>
            )}
          </Desplegable>

          <Desplegable titulo="7 · Evidencia" color={color} defaultAbierto={modoEstudio}>
            {e.evidencia ? <TextoConCitas texto={e.evidencia} truncar={vistaCompacta ? 180 : undefined} /> : <TextoVacio texto="Sin evidencia registrada." />}
            {e.notasClinicas && (
              <div style={{ background: COLORS.paperDark, borderRadius: 8, padding: 10, marginBottom: 10, borderLeft: `3px solid ${COLORS.garnet}` }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", color: COLORS.garnet, marginBottom: 3 }}>
                  Notas clínicas · técnicas contraindicadas
                </div>
                <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5, color: COLORS.ink }}>{e.notasClinicas}</p>
              </div>
            )}
          </Desplegable>

          {/* 7b y 7c se muestran también en vista compacta —a diferencia de las
              secciones secundarias 8-10— porque son información de seguridad
              clínica (contraindicaciones) y de integridad conceptual (notaDistincion)
              que no conviene ocultar detrás de un clic adicional; antes de este
              cambio ambos campos existían en ESCUELAS_SEED pero no se renderizaban
              en ningún componente, quedando invisibles para el usuario. */}
          <Desplegable
            titulo="7b · Contraindicaciones"
            subtitulo="cuándo NO aplicar esta escuela o su técnica"
            color={COLORS.garnet}
            defaultAbierto={modoEstudio}
            vacio={(e.contraindicaciones || []).length === 0}
            vacioTexto="sin contraindicaciones específicas registradas para esta escuela en el material de referencia"
          >
            {(e.contraindicaciones || []).length > 0 && (
              <>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, fontFamily: "var(--f-text)", lineHeight: 1.55, color: COLORS.ink }}>
                  {(vistaCompacta ? (e.contraindicaciones || []).slice(0, 3) : e.contraindicaciones || []).map((c, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{c}</li>
                  ))}
                </ul>
                {vistaCompacta && (e.contraindicaciones || []).length > 3 && (
                  <span
                    onClick={() => setVistaCompacta(false)}
                    style={{ cursor: "pointer", fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, textDecoration: "underline" }}
                  >
                    +{(e.contraindicaciones || []).length - 3} más — ver vista completa
                  </span>
                )}
              </>
            )}
          </Desplegable>

          {e.notaDistincion && (
            <Desplegable
              titulo="7c · Distinción de escuelas afines"
              subtitulo="para no confundir con fichas cercanas"
              color={COLORS.gold}
              defaultAbierto={modoEstudio}
            >
              <TextoConCitas texto={e.notaDistincion} truncar={vistaCompacta ? 180 : undefined} />
            </Desplegable>
          )}

          {!vistaCompacta && (
          <Desplegable titulo="8 · Sub-variantes de esta escuela" color={color} defaultAbierto={modoEstudio} vacio={!subvariantes} vacioTexto="no aplica: esta escuela no se subdivide en corrientes o variantes internas documentadas por separado">
            {subvariantes && (
              <>
                <p style={{ fontSize: 11.5, fontFamily: "var(--f-text)", color: COLORS.inkSoft, fontStyle: "italic", marginTop: 0, marginBottom: 12 }}>
                  Esta escuela agrupa, en rigor, varias corrientes internas con ontología, epistemología, conceptos y manual propios.
                </p>
                {subvariantes.map((sv, i) => (
                  <div key={i} style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
                    <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 14.5, marginBottom: 2 }}>{sv.nombre}</div>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 8 }}>{sv.autores}</div>

                    <div style={{ marginBottom: 8 }}>
                      <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 13, lineHeight: 1.55, fontStyle: "italic", color: COLORS.ink }}>
                        «{sv.definicionTextual}»
                      </p>
                      <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.inkSoft, marginTop: 2 }}>— {sv.fuenteDefinicion}</div>
                    </div>

                    {(sv.ontologia || sv.epistemologia || sv.metodologia || sv.criterioVerdad) && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 10, marginBottom: 8 }}>
                        {sv.ontologia && (
                          <div>
                            <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.primary, textTransform: "uppercase" }}>Ontología</div>
                            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{sv.ontologia}</p>
                          </div>
                        )}
                        {sv.epistemologia && (
                          <div>
                            <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.primary, textTransform: "uppercase" }}>Epistemología</div>
                            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{sv.epistemologia}</p>
                          </div>
                        )}
                        {sv.metodologia && (
                          <div>
                            <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.primary, textTransform: "uppercase" }}>Metodología</div>
                            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{sv.metodologia}</p>
                          </div>
                        )}
                        {sv.criterioVerdad && (
                          <div>
                            <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.clay, textTransform: "uppercase" }}>Criterio de verdad</div>
                            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.5 }}>{sv.criterioVerdad}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {sv.conceptosClave && (
                      <div style={{ marginBottom: 6 }}>
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Conceptos clave</div>
                        {sv.conceptosClave.map((c, j) => (
                          <Etiqueta key={j}>{c}</Etiqueta>
                        ))}
                      </div>
                    )}

                    {sv.manual && (
                      <div style={{ fontSize: 11.5, fontFamily: "var(--f-text)", color: COLORS.inkSoft, borderTop: `1px dashed ${COLORS.line}`, paddingTop: 6, marginTop: 6 }}>
                        <strong>Manual/texto de referencia: </strong>
                        {sv.manual}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </Desplegable>
          )}

          {!vistaCompacta && (
          <>
          <Desplegable
            titulo="9 · Procedimientos clínicos documentados"
            subtitulo="momentos terapéuticos y protocolo, no ensayo clínico"
            color={COLORS.sage}
            defaultAbierto={modoEstudio}
            vacio={!procedimientos && !PROTOCOLOS_SEED[e.id] && !TEXTOS_FUNDAMENTALES[e.id]}
          >
            <div style={{ borderBottom: procedimientos ? `1px dashed ${COLORS.line}` : "none", paddingBottom: procedimientos ? 12 : 0, marginBottom: procedimientos ? 12 : 0 }}>
              {PROTOCOLOS_SEED[e.id] ? (
                <span style={{ fontSize: 11.5, fontFamily: "var(--f-mono)", color: COLORS.sage }}>
                  ✓ Protocolo estandarizado disponible («{PROTOCOLOS_SEED[e.id].nombre}») — ver Módulo 2 · Planificador.
                </span>
              ) : (
                <div>
                  <span style={{ fontSize: 11.5, fontFamily: "var(--f-mono)", color: COLORS.inkSoft }}>
                    Sin protocolo estandarizado en la bibliografía revisada; sus procedimientos puntuales figuran como técnicas en el módulo de Protocolos y técnicas.
                  </span>
                  {TEXTOS_FUNDAMENTALES[e.id] && (
                    <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, fontFamily: "var(--f-text)", color: COLORS.ink }}>
                      {TEXTOS_FUNDAMENTALES[e.id].map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            {procedimientos && (
              <>
                <p style={{ fontSize: 11.5, fontFamily: "var(--f-text)", color: COLORS.inkSoft, fontStyle: "italic", marginTop: 0, marginBottom: 12 }}>
                  Secuencias de «momentos» terapéuticos documentadas en manuales y capítulos clínicos, distintas de un protocolo validado por ensayo clínico aleatorizado. En esta perspectiva, no manualizar la técnica es a menudo una posición epistemológica, no una laguna (cf. Módulo 0).
                </p>
                {procedimientos.map((proc, i) => (
                  <div key={i} style={{ borderLeft: `3px solid ${COLORS.sage}`, paddingLeft: 12, marginBottom: 14 }}>
                    <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5, marginBottom: 2 }}>{proc.nombre}</div>
                    <div style={{ marginBottom: 6 }}><Fuente texto={proc.fuente} /></div>
                    <PasosInteractivos pasos={proc.fases} colorAcento={COLORS.sage} />
                    {proc.porQueFunciona && (
                      <div style={{ background: COLORS.paperDark, borderRadius: 8, padding: 10, marginTop: 6, marginBottom: 6, borderLeft: `3px solid ${COLORS.clay}` }}>
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", color: COLORS.clay, marginBottom: 3 }}>Por qué / para qué funciona</div>
                        <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.5, color: COLORS.ink }}>{proc.porQueFunciona}</p>
                      </div>
                    )}
                    {proc.condiciones && <DetalleCondiciones texto={proc.condiciones} />}
                  </div>
                ))}
              </>
            )}
          </Desplegable>

          <Desplegable titulo="10 · Clasificación filosófica ampliada" subtitulo="mapa decisional · Crotty" color={COLORS.clay} defaultAbierto={modoEstudio} vacio={!filo} vacioTexto="no aplica: consulta la clasificación filosófica ampliada de la perspectiva general en el Módulo 0">
            <SeccionClasificacionFilosoficaEscuelaInterna filo={filo} />
          </Desplegable>
          </>
          )}

          {vistaCompacta && (
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, textAlign: "center", padding: "6px 0 2px", borderTop: `1px dashed ${COLORS.line}`, marginTop: 4 }}>
              sub-variantes, procedimientos clínicos y clasificación filosófica ampliada ocultos en vista compacta —{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer", color }} onClick={() => setVistaCompacta(false)}>
                ver vista completa
              </span>
            </div>
          )}

          <Desplegable titulo="11 · Referencias" color={COLORS.garnet} defaultAbierto={modoEstudio} vacio={!citas && (e.referencias || []).length === 0}>
            {(citas?.length > 0 || (e.referencias || []).length > 0) && (
              <div style={{ borderRadius: 8, padding: 10, border: `1px solid ${COLORS.line}` }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", color: COLORS.inkSoft, marginBottom: 8 }}>
                  Referencias bibliográficas ({(citas?.length || 0) + (e.referencias || []).length})
                </div>
                {/* Estilo tipográfico ÚNICO para toda referencia bibliográfica plana
                    (source-string), sea de CITAS_AMPLIADAS o de e.referencias — antes
                    cada origen de dato tenía su propio tamaño/color/interlineado
                    (12.5px/tinta vs. 11.5px/gris), lo que hacía que la lista se viera
                    con dos tipografías distintas sin ninguna razón de contenido. Las
                    citas con idea+fuente (objeto, no string) siguen usando su propio
                    formato de tarjeta con comillas, porque son un tipo de contenido
                    distinto (una cita textual con comentario) y no una referencia
                    bibliográfica plana — no deberían verse igual entre sí. */}
                {citas &&
                  citas.map((c, i) =>
                    typeof c === "string" ? (
                      <p key={`cita-${i}`} style={estiloReferenciaBibliografica()}>
                        <Fuente texto={c} soloReferencia />
                      </p>
                    ) : (
                      <div key={`cita-${i}`} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                        <span style={{ fontFamily: "Georgia,serif", fontSize: 22, color: color, lineHeight: 1, flexShrink: 0 }}>\u201c</span>
                        <div>
                          <p style={{ margin: 0, fontFamily: "var(--f-text)", fontStyle: "italic", fontSize: 13.5, lineHeight: 1.55, color: COLORS.ink }}>{c.idea}</p>
                          <div style={{ marginTop: 3 }}><Fuente texto={c.fuente} /></div>
                        </div>
                      </div>
                    )
                  )}
                {(e.referencias || []).length > 0 &&
                  e.referencias.map((r, i) => (
                    <p key={`ref-${i}`} style={estiloReferenciaBibliografica()}>
                      <Fuente texto={r} soloReferencia />
                    </p>
                  ))}
              </div>
            )}
          </Desplegable>
        </div>
      )}
    </div>
    </div>
  );
}


/* ---------- MÓDULO 2: PLANIFICADOR ---------- */
/* Vista de tabla comparativa del Módulo de Protocolos: una fila por
   protocolo/procedimiento documentado, ordenable por columna con un clic.
   Complementa (no sustituye) la vista de tarjetas: la tabla sirve para
   escanear rápido "¿qué escuelas tienen protocolo validado vs. solo
   técnica?" o "¿cuál tiene más fases?", algo que exigía antes desplegar
   cada perspectiva y cada escuela una por una. */

// Vocabulario controlado de "objetivo clínico central", para poder filtrar
// protocolos y técnicas por lo que persiguen y no solo por escuela de
// origen. IMPORTANTE: es una clasificación HEURÍSTICA por palabras clave
// sobre el nombre/condiciones/mecanismo ya redactados en la app, no una
// etiqueta curada a mano protocolo por protocolo (eso, con ~120 entradas,
// excedería con mucho el alcance de esta iteración). Se homogeniza
// deliberadamente a una lista corta y fija de objetivos —en vez de dejar
// que cada protocolo declare el suyo con sus propias palabras— para que el
// filtro tenga sentido; el precio de esa homogeneización es que algunos
// matices específicos de una técnica concreta no quedan capturados por
// ninguna etiqueta y caen en "sin clasificar". Debe leerse como un primer
// filtro orientativo, no como una taxonomía clínica validada.
//
// Nota de accesibilidad: los colores de esta lista se usan como fondo de
// una insignia con texto BLANCO encima (ver TablaProtocolosGenerica). Se
// verificó el contraste de cada uno contra blanco (fórmula WCAG); 5 de
// los 17 originales caían por debajo de 4.5:1 (el mínimo AA para texto
// pequeño) — se oscurecieron ligeramente esos 5 sin cambiar el resto de
// la paleta, para que la insignia siga siendo legible en cualquier tema.
const OBJETIVOS_CLINICOS = [
  { id: "evitacion_rumiacion", label: "Reduce evitación / rumiación", kw: ["evitaci", "rumiaci", "evasión"], color: "#8A5A44" },
  { id: "tolerancia_malestar", label: "Aumenta tolerancia al malestar", kw: ["tolerancia al malestar", "malestar", "distress", "crisis"], color: "#B0413E" },
  { id: "reestructura_cognicion", label: "Reestructura pensamiento / creencias", kw: ["cognitiv", "pensamiento", "creencia", "esquema", "distorsi"], color: "#3F6B5A" },
  { id: "reduce_ansiedad_exposicion", label: "Reduce ansiedad vía exposición", kw: ["exposición", "exposicion", "ansiedad", "miedo", "fobia", "desensibiliz"], color: "#A05E24" },
  { id: "repara_alianza_vinculo", label: "Repara alianza / vínculo", kw: ["alianza", "vínculo", "vinculo", "apego", "ruptura", "relación terapéutica"], color: "#4A5A8A" },
  { id: "reestructura_familia", label: "Reestructura patrón familiar/relacional", kw: ["familia", "sistema familiar", "límites", "limites", "jerarquía", "subsistema"], color: "#6B4A8A" },
  { id: "activacion_conductual", label: "Activación conductual / refuerzo", kw: ["activación conductual", "activacion conductual", "refuerzo positivo", "refuerzo negativo", "programación de actividades", "contingencia", "modelado", "aprendizaje observacional"], color: "#6E6132" },
  { id: "sentido_valores", label: "Trabaja sentido / valores", kw: ["voluntad de sentido", "búsqueda de sentido", "busqueda de sentido", "vacío existencial", "vacio existencial", "valores actitudinales", "acción valiosa", "accion valiosa", "trascendencia", "propósito vital", "proposito vital", "bienestar", "fortalezas"], color: "#3B6E61" },
  { id: "regulacion_emocional", label: "Regula la emoción", kw: ["regulación emocional", "regulacion emocional", "desregulación", "afecto"], color: "#8A4A5A" },
  { id: "insight_inconsciente", label: "Insight sobre conflicto inconsciente", kw: ["inconsciente", "insight", "interpretaci", "conflicto intrapsíquico", "conflicto inconsciente", "transferencia"], color: "#5A6B8A" },
  { id: "reencuadre_narrativo", label: "Reencuadra el relato / lenguaje", kw: ["narrativ", "relato dominante", "reencuadre", "externalizaci del problema", "historia alternativa"], color: "#616E32" },
  { id: "autoconocimiento_experiencial", label: "Autoconocimiento experiencial/corporal", kw: ["experiencial", "experiment", "corporal", "sensación", "sensacion", "awareness", "cuerpo", "focusing", "felt sense", "despliegue evocativo", "mindfulness", "atención plena", "atencion plena", "fenomenológic", "fenomenologic"], color: "#3F8A6E" },
  { id: "motivacion_cambio", label: "Trabaja motivación/ambivalencia al cambio", kw: ["motivaci", "ambivalencia", "disposición al cambio", "etapa de cambio", "cambio de conducta", "proceso de cambio", "pregunta del milagro", "futuro preferido"], color: "#A66B2E" },
  { id: "autorregulacion_habilidades", label: "Entrena habilidades de autorregulación", kw: ["entrenamiento en habilidades", "déficit de habilidades", "deficit de habilidades", "autocontrol", "autorregulaci"], color: "#2E7A8A" },
  { id: "reduce_sintoma_somatico", label: "Reduce síntoma corporal/somático", kw: ["somátic", "somatic", "síntoma físico", "relajación", "respiración"], color: "#8A2E5A" },
  { id: "insight_desarrollo_self", label: "Trabaja estructura del self / desarrollo temprano", kw: ["self", "narcisis", "desarrollo temprano", "objeto interno", "individuación"], color: "#5A3F8A" },
  { id: "justicia_relacional_social", label: "Trabaja justicia relacional / social", kw: ["justicia", "poder", "opresión", "opresion", "multicultural", "feminis", "mérito", "merito", "lealtad", "dar y recibir", "ética relacional", "etica relacional"], color: "#8C6B24" },
];
function inferirObjetivosClinicos(texto) {
  const t = (texto || "").toLowerCase();
  const encontrados = OBJETIVOS_CLINICOS.filter((o) => o.kw.some((k) => t.includes(k)));
  if (encontrados.length === 0) return [{ id: "sin_clasificar", label: "Sin clasificar", color: null }];
  // Tope de 3 objetivos por fila: incluso con palabras clave específicas,
  // un texto largo (protocolos de 5-7 fases) puede tocar de pasada más de
  // tres temas sin que todos sean igual de centrales. Se prioriza la
  // coincidencia por la frase MÁS LARGA encontrada (más específica, menos
  // probable que sea una mención incidental) antes de recortar a 3.
  const conEspecificidad = encontrados.map((o) => {
    const mejorMatch = o.kw.filter((k) => t.includes(k)).sort((a, b) => b.length - a.length)[0];
    return { o, especificidad: mejorMatch.length };
  });
  conEspecificidad.sort((a, b) => b.especificidad - a.especificidad);
  return conEspecificidad.slice(0, 3).map((x) => x.o);
}
// Alias retro-compatible: algunos usos previos solo necesitan el primero.
function inferirObjetivoClinico(texto) {
  return inferirObjetivosClinicos(texto)[0];
}

/* Franja de filtro por objetivo clínico homogenizado, reutilizada por las
   dos tablas (protocolos y técnicas). */
function FiltroObjetivos({ objetivoActivo, setObjetivoActivo, objetivosPresentes }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
      <button
        onClick={() => setObjetivoActivo(null)}
        style={{
          fontFamily: FONT_MONO, fontSize: 10, padding: "3px 9px", borderRadius: 12, cursor: "pointer",
          border: `1px solid ${COLORS.line}`, background: !objetivoActivo ? COLORS.primary : "transparent", color: !objetivoActivo ? COLORS.cardBg : COLORS.inkSoft,
        }}
      >
        todos los objetivos
      </button>
      {OBJETIVOS_CLINICOS.filter((o) => objetivosPresentes.has(o.id)).map((o) => (
        <button
          key={o.id}
          onClick={() => setObjetivoActivo((cur) => (cur === o.id ? null : o.id))}
          style={{
            fontFamily: FONT_MONO, fontSize: 10, padding: "3px 9px", borderRadius: 12, cursor: "pointer",
            border: `1px solid ${o.color}`,
            background: objetivoActivo === o.id ? o.color : "transparent",
            color: objetivoActivo === o.id ? COLORS.onAcento : o.color,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* Paleta determinista por subfamilia (dentro de cada perspectiva hay
   varias subfamilias — p. ej. Conductual tiene "Terapias Contextuales",
   "Neoconductismo Mediacional", etc.) para poder distinguir visualmente,
   dentro de una misma tabla, de qué corriente concreta viene cada fila,
   no solo de qué perspectiva general. */
const PALETA_SUBFAMILIA = ["#8A5A44", "#3F6B5A", "#4A5A8A", "#6E6132", "#6B4A8A", "#3B6E61", "#8A4A5A", "#5A6B8A"];
const colorSubfamiliaCache = new Map();
function colorDeSubfamilia(subfamilia) {
  const key = subfamilia || "—";
  if (!colorSubfamiliaCache.has(key)) {
    colorSubfamiliaCache.set(key, PALETA_SUBFAMILIA[colorSubfamiliaCache.size % PALETA_SUBFAMILIA.length]);
  }
  return colorSubfamiliaCache.get(key);
}

function TablaProtocolosGenerica({ filas, ordenTabla, cambiarOrden, tituloVacio }) {
  const [objetivoActivo, setObjetivoActivo] = useState(null);
  const [filaHover, setFilaHover] = useState(null);
  const [fuenteExpandida, setFuenteExpandida] = useState(null);
  const objetivosPresentes = useMemo(() => new Set(filas.flatMap((f) => f.objetivos.map((o) => o.id))), [filas]);
  const filasFiltradas = objetivoActivo ? filas.filter((f) => f.objetivos.some((o) => o.id === objetivoActivo)) : filas;

  if (filas.length === 0) {
    return <VacioAviso texto={tituloVacio} />;
  }
  const columnas = [
    { key: "subfamilia", label: "Subfamilia", ancho: "13%" },
    { key: "escuela", label: "Escuela", ancho: "17%" },
    { key: "nombre", label: "Nombre", ancho: "20%" },
    { key: "objetivo", label: "Objetivo clínico", ancho: "20%" },
    { key: "fases", label: "Fases", ancho: "6%" },
    { key: "fuente", label: "Fuente", ancho: "24%" },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <FiltroObjetivos objetivoActivo={objetivoActivo} setObjetivoActivo={setObjetivoActivo} objetivosPresentes={objetivosPresentes} />
        <BotonExportarImagen
          onClick={() =>
            exportarTablaComoImagen({
              titulo: "Protocolos y técnicas",
              columnas: columnas.map((c) => ({ label: c.label })),
              filas: filasFiltradas.map((f) => [f.subfamilia || f.perspectiva, f.escuela, f.nombre, f.objetivos.map((o) => o.label).join(" / "), f.fases || "—", f.fuente]),
              colorAcento: COLORS.garnet,
            })
          }
        />
      </div>
      {/* maxHeight + overflowY:auto con cabecera sticky: antes, una tabla
          con 20-30 filas no tenía ningún límite de alto, así que quedaba
          "enterrada" dentro del desplegable de la perspectiva y era fácil
          perder de vista dónde empezaba o terminaba. width:"100%" +
          boxSizing:"border-box" (en vez de solo maxWidth) aseguran que el
          contenedor establece un límite real de ancho propio, para que el
          overflowX:auto interno funcione de verdad y no dependa de que el
          contenedor de la app entera lo contenga por accidente. */}
      <div
        style={{
          overflow: "auto", width: "100%", boxSizing: "border-box",
          border: `1px solid ${COLORS.line}`, borderRadius: 14, maxHeight: "60vh",
        }}
      >
        <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse", fontFamily: "var(--f-text)", fontSize: 12.5, tableLayout: "fixed" }}>
          <colgroup>
            {columnas.map((c) => (
              <col key={c.key} style={{ width: c.ancho }} />
            ))}
          </colgroup>
          <thead>
            <tr style={{ background: COLORS.paperDark }}>
              {columnas.map((c) => (
                <th
                  key={c.key}
                  onClick={() => cambiarOrden(c.key)}
                  title="Clic para ordenar"
                  style={{
                    textAlign: "left", padding: "8px 10px", cursor: "pointer", fontFamily: FONT_MONO, fontSize: 10,
                    textTransform: "uppercase", color: COLORS.inkSoft, borderBottom: `2px solid ${COLORS.line}`,
                    position: "sticky", top: 0, background: COLORS.paperDark, zIndex: 1,
                  }}
                >
                  {c.label} {ordenTabla.col === c.key ? (ordenTabla.asc ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filasFiltradas.map((f, i) => {
              const key = f.escuelaId + "|" + f.nombre;
              const hover = filaHover === key;
              const fuenteLarga = (f.fuente || "").length > 90;
              const fuenteAbierta = fuenteExpandida === key;
              return (
                <tr
                  key={key}
                  onMouseEnter={() => setFilaHover(key)}
                  onMouseLeave={() => setFilaHover((k) => (k === key ? null : k))}
                  style={{
                    borderBottom: `1px solid ${COLORS.line}`,
                    background: hover ? COLORS.hover : i % 2 === 0 ? "transparent" : COLORS.paperDark,
                    transition: "background 0.1s",
                  }}
                >
                  <td style={{ padding: "7px 10px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, maxWidth: "100%" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: colorDeSubfamilia(f.subfamilia), display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, whiteSpace: "normal", wordBreak: "break-word" }}>{f.subfamilia || f.perspectiva}</span>
                    </span>
                  </td>
                  <td style={{ padding: "7px 10px", wordBreak: "break-word" }}>{f.escuela}</td>
                  <td style={{ padding: "7px 10px", wordBreak: "break-word", fontWeight: hover ? 700 : 400 }}>{f.nombre}</td>
                  <td style={{ padding: "7px 10px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {f.objetivos.map((obj) => (
                        <span
                          key={obj.id}
                          style={{
                            fontFamily: FONT_MONO, fontSize: 9.5, padding: "1px 6px", borderRadius: 6, display: "inline-block",
                            color: obj.color ? COLORS.onAcento : COLORS.inkSoft,
                            background: obj.color || "transparent",
                            border: obj.color ? "none" : `1px dashed ${COLORS.line}`,
                            opacity: objetivoActivo && obj.id !== objetivoActivo ? 0.45 : 1,
                            whiteSpace: "normal",
                          }}
                        >
                          {obj.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "7px 10px", textAlign: "center" }}>{f.fases || "—"}</td>
                  <td
                    onClick={fuenteLarga ? () => setFuenteExpandida((k) => (k === key ? null : key)) : undefined}
                    style={{
                      padding: "7px 10px", color: COLORS.inkSoft, fontSize: 11,
                      cursor: fuenteLarga ? "pointer" : "default",
                      wordBreak: "break-word",
                      display: "-webkit-box",
                      WebkitLineClamp: fuenteAbierta ? "unset" : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: fuenteAbierta ? "visible" : "hidden",
                    }}
                    title={fuenteLarga ? "Clic para ver la fuente completa" : undefined}
                  >
                    <Fuente texto={f.fuente} soloReferencia />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "6px 2px", fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft }}>{filasFiltradas.length} de {filas.length} filas · clic en una fuente larga para expandirla · clic en el encabezado para ordenar</div>
    </div>
  );
}

/* Las dos tablas pedidas: protocolos (curso completo del tratamiento) y
   técnicas con procedimiento (intervención puntual), completamente
   separadas para no mezclar ambas unidades de análisis en una sola vista. */
/* Comparador de hasta 3 protocolos/técnicas lado a lado: selección libre
   desde un buscador, cada columna con sus propios pasos interactivos
   (PasosInteractivos), para poder cotejar la estructura de sesión de,
   por ejemplo, DBT vs. Terapia Cognitiva vs. Activación Conductual sin
   ir cambiando de pestaña. */
function ComparadorProtocolos({ filas }) {
  const [seleccion, setSeleccion] = useState([]); // hasta 3 índices de `filas`
  const [buscar, setBuscar] = useState("");

  const disponibles = filas.filter(
    (f, i) => !seleccion.includes(i) && (f.nombre.toLowerCase().includes(buscar.toLowerCase()) || f.escuela.toLowerCase().includes(buscar.toLowerCase()))
  );

  const agregar = (idxEnFilas) => {
    if (seleccion.length >= 3) return;
    setSeleccion((s) => [...s, idxEnFilas]);
    setBuscar("");
  };
  const quitar = (idx) => setSeleccion((s) => s.filter((i) => i !== idx));

  return (
    <div>
      {seleccion.length < 3 && (
        <div style={{ marginBottom: 14, position: "relative", maxWidth: 420 }}>
          <input
            value={buscar}
            onChange={(ev) => setBuscar(ev.target.value)}
            placeholder={`Añadir protocolo o técnica a comparar (${seleccion.length}/3)…`}
            style={{ ...CAMPO_STYLE, fontFamily: "var(--f-text)", fontSize: 13 }}
          />
          {buscar.trim().length >= 2 && (
            <div style={{ position: "absolute", zIndex: 5, top: "100%", left: 0, right: 0, background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, maxHeight: 220, overflowY: "auto" }}>
              {disponibles.slice(0, 8).map((f) => {
                const idxReal = filas.indexOf(f);
                return (
                  <div
                    key={idxReal}
                    onClick={() => agregar(idxReal)}
                    style={{ padding: "7px 12px", cursor: "pointer", borderBottom: `1px solid ${COLORS.line}` }}
                  >
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 12.5, fontWeight: 700 }}>{f.nombre}</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: PERSPECTIVA_COLOR[f.perspectiva] }}>{f.escuela}</div>
                  </div>
                );
              })}
              {disponibles.length === 0 && <div style={{ padding: 10, fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.inkSoft }}>Sin coincidencias.</div>}
            </div>
          )}
        </div>
      )}

      {seleccion.length === 0 && <VacioAviso texto="Añade hasta 3 protocolos o técnicas para compararlos lado a lado, paso a paso." />}

      {seleccion.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${seleccion.length}, minmax(min(260px, 100%), 1fr))`, gap: 14, alignItems: "start" }}>
          {seleccion.map((idx) => {
            const f = filas[idx];
            const color = f.tipo === "protocolo" ? COLORS.garnet : COLORS.clay;
            return (
              <div key={idx} style={{ borderLeft: `1px solid ${COLORS.line}`, borderRight: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}`, borderTop: `4px solid ${color}`, borderRadius: 14, padding: 14, background: COLORS.cardBg }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: PERSPECTIVA_COLOR[f.perspectiva] }}>{f.escuela}</div>
                    <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 14 }}>{f.nombre}</div>
                  </div>
                  <button onClick={() => quitar(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.inkSoft, flexShrink: 0 }} title="Quitar de la comparación">
                    <X size={14} />
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, margin: "6px 0 10px" }}>
                  {f.objetivos.map((o) => (
                    <span key={o.id} style={{ fontFamily: FONT_MONO, fontSize: 9, padding: "1px 6px", borderRadius: 6, color: o.color ? COLORS.onAcento : COLORS.inkSoft, background: o.color || "transparent", border: o.color ? "none" : `1px dashed ${COLORS.line}` }}>
                      {o.label}
                    </span>
                  ))}
                </div>
                {f.pasosCompletos.length > 0 ? (
                  <PasosInteractivos pasos={f.pasosCompletos} colorAcento={color} />
                ) : (
                  <VacioAviso texto="Sin pasos documentados." />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TablaProtocolos({ filas, ordenTabla, cambiarOrden }) {
  const [filtroTipo, setFiltroTipo] = useState("ambas"); // "ambas" | "protocolos" | "tecnicas"
  const soloProtocolos = filas.filter((f) => f.tipo === "protocolo");
  const soloTecnicas = filas.filter((f) => f.tipo === "técnica");
  const subfamiliasPresentes = useMemo(() => [...new Set(filas.map((f) => f.subfamilia || f.perspectiva))], [filas]);

  const botonTipo = (id, label) => (
    <button
      onClick={() => setFiltroTipo(id)}
      style={{
        fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
        background: filtroTipo === id ? COLORS.primary : "transparent", color: filtroTipo === id ? COLORS.cardBg : COLORS.inkSoft,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, background: COLORS.paperDark, borderRadius: 20, padding: 3, width: "fit-content" }}>
        {botonTipo("ambas", `Ambas (${filas.length})`)}
        {botonTipo("protocolos", `Solo protocolos (${soloProtocolos.length})`)}
        {botonTipo("tecnicas", `Solo técnicas (${soloTecnicas.length})`)}
      </div>

      {/* Leyenda de subfamilia: mismo color determinista que usan las
          filas de la tabla, para poder leer el punto de color sin tener
          que pasar el cursor por cada fila. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft }}>
        {subfamiliasPresentes.map((sf) => (
          <span key={sf} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: colorDeSubfamilia(sf), display: "inline-block" }} />
            {sf}
          </span>
        ))}
      </div>

      {(filtroTipo === "ambas" || filtroTipo === "protocolos") && (
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14, maxWidth: "100%", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 6, background: COLORS.garnet, display: "inline-block" }} />
            <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 14.5, color: COLORS.ink }}>Protocolos</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft }}>
              ({soloProtocolos.length}) — estructuran el curso completo del tratamiento, con técnicas propias en cada momento terapéutico
            </span>
          </div>
          <TablaProtocolosGenerica filas={soloProtocolos} ordenTabla={ordenTabla} cambiarOrden={cambiarOrden} tituloVacio="Ningún protocolo coincide con la búsqueda actual." />
        </div>
      )}
      {(filtroTipo === "ambas" || filtroTipo === "tecnicas") && (
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14, maxWidth: "100%", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 6, background: COLORS.clay, display: "inline-block" }} />
            <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 14.5, color: COLORS.ink }}>Técnicas con procedimiento documentado</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft }}>({soloTecnicas.length}) — intervención puntual, aunque tenga varios pasos</span>
          </div>
          <TablaProtocolosGenerica filas={soloTecnicas} ordenTabla={ordenTabla} cambiarOrden={cambiarOrden} tituloVacio="Ninguna técnica coincide con la búsqueda actual." />
        </div>
      )}
    </div>
  );
}

function ModuloPlanificador({ irA, escuelas, foco, modoEstudio, setModoEstudio, onIrAEscuela, enlaces }) {
  const [q, setQ] = useState("");
  const [vista, setVista] = useState("rosa"); // "rosa" | "torre" | "tarjetas" | "tabla"
  const [ordenTabla, setOrdenTabla] = useState({ col: "perspectiva", asc: true });
  const [indiceEstudio, setIndiceEstudio] = useState(0);
  useEffect(() => {
    if (!foco) return;
    const id = "protocolo-" + foco.escuelaId;
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => clearTimeout(t);
  }, [foco]);

  // Coincide si el término aparece en el nombre de la escuela o en el
  // nombre de cualquiera de sus protocolos/técnicas documentadas — antes
  // no existía ninguna forma de localizar un protocolo sin desplegar las
  // 7 perspectivas una por una a mano.
  const qNorm = q.trim().toLowerCase();
  const coincideEscuela = (e) => {
    if (!qNorm) return true;
    if (e.nombre.toLowerCase().includes(qNorm)) return true;
    if (PROTOCOLOS_SEED[e.id]?.nombre?.toLowerCase().includes(qNorm)) return true;
    if ((PROCEDIMIENTOS_CLINICOS[e.id] || []).some((p) => p.nombre.toLowerCase().includes(qNorm))) return true;
    return false;
  };

  // Distingue protocolos genuinos (estructuran el curso completo del tratamiento en
  // distintos momentos terapéuticos, con técnicas diferentes en cada uno) de técnicas
  // con procedimiento documentado (una intervención puntual, aunque tenga varios pasos).
  // Las entradas de PROCEDIMIENTOS_CLINICOS marcadas con tipo: "técnica" NO cuentan como
  // protocolo; las marcadas "protocolo" o sin campo tipo (aún no auditadas en otras
  // perspectivas) sí cuentan, para no alterar el conteo de escuelas no revisadas todavía.
  const esTecnicaProc = (proc) => proc.tipo === "técnica";
  // «fase»: detalle de una fase o de la estructura de sesión de un protocolo; se muestra dentro del protocolo, no cuenta como protocolo ni como técnica.
  const esFaseProc = (proc) => proc.tipo === "fase";
  const esProtocoloProc = (proc) => !esTecnicaProc(proc) && !esFaseProc(proc);
  const totalTecnicasProc = Object.values(PROCEDIMIENTOS_CLINICOS).reduce(
    (acc, arr) => acc + arr.filter(esTecnicaProc).length,
    0
  );
  const totalProtocolos =
    Object.keys(PROTOCOLOS_SEED).length +
    Object.values(PROCEDIMIENTOS_CLINICOS).reduce((acc, arr) => acc + arr.filter(esProtocoloProc).length, 0);

  // Filas planas para la vista de tabla: una fila por protocolo/procedimiento
  // documentado, con las columnas suficientes para comparar de un vistazo
  // fuente, tipo y extensión sin tener que abrir cada desplegable anidado
  // (la vista de tarjetas obliga a desplegar perspectiva → escuela →
  // protocolo, tres niveles, para ver un solo dato comparativo).
  const filasTabla = useMemo(() => {
    const filas = [];
    escuelas.filter(coincideEscuela).forEach((e) => {
      if (PROTOCOLOS_SEED[e.id]) {
        const p = PROTOCOLOS_SEED[e.id];
        const textoObjetivo = [p.nombre, p.fuente, p.condiciones, p.porQueFunciona, (p.fases || []).join(" ")].join(" ");
        filas.push({
          escuelaId: e.id,
          escuela: e.nombre,
          perspectiva: e.perspectiva,
          subfamilia: e.subfamilia,
          nombre: p.nombre,
          tipo: "protocolo",
          fases: p.fases?.length || 0,
          pasosCompletos: p.fases || [],
          fuente: p.fuente,
          objetivos: inferirObjetivosClinicos(textoObjetivo),
        });
      }
      (PROCEDIMIENTOS_CLINICOS[e.id] || []).filter((p) => !esFaseProc(p)).forEach((p) => {
        const textoObjetivo = [p.nombre, p.fuente, p.condiciones, p.porQueFunciona, (p.fases || []).join(" ")].join(" ");
        filas.push({
          escuelaId: e.id,
          escuela: e.nombre,
          perspectiva: e.perspectiva,
          subfamilia: e.subfamilia,
          nombre: p.nombre,
          tipo: esTecnicaProc(p) ? "técnica" : "protocolo",
          fases: p.fases?.length || 0,
          pasosCompletos: p.fases || [],
          fuente: p.fuente,
          objetivos: inferirObjetivosClinicos(textoObjetivo),
        });
      });
    });
    const { col, asc } = ordenTabla;
    const dir = asc ? 1 : -1;
    return [...filas].sort((a, b) => {
      if (col === "fases") return (a.fases - b.fases) * dir;
      if (col === "objetivo") return String(a.objetivos?.[0]?.label || "").localeCompare(String(b.objetivos?.[0]?.label || "")) * dir;
      return String(a[col] || "").localeCompare(String(b[col] || "")) * dir;
    });
  }, [escuelas, qNorm, ordenTabla]);

  const cambiarOrden = (col) => setOrdenTabla((cur) => (cur.col === col ? { col, asc: !cur.asc } : { col, asc: true }));

  // Modo estudio: recorre secuencialmente filasTabla (mismo orden que la
  // vista de tabla, respetando el filtro de búsqueda activo) con ← →,
  // haciendo scroll y resaltando temporalmente la tarjeta de la escuela
  // correspondiente, esté en vista de tarjetas o de tabla.
  useEffect(() => {
    if (indiceEstudio >= filasTabla.length) setIndiceEstudio(Math.max(0, filasTabla.length - 1));
  }, [filasTabla.length, indiceEstudio]);
  useEffect(() => {
    if (!modoEstudio) return;
    const onKey = (ev) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (ev.key === "ArrowRight") setIndiceEstudio((i) => Math.min(i + 1, filasTabla.length - 1));
      if (ev.key === "ArrowLeft") setIndiceEstudio((i) => Math.max(i - 1, 0));
      if (ev.key === "Escape") setModoEstudio(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modoEstudio, filasTabla.length, setModoEstudio]);
  const filaEstudio = modoEstudio ? filasTabla[indiceEstudio] : null;
  useEffect(() => {
    if (!filaEstudio) return;
    const el = document.getElementById("protocolo-" + filaEstudio.escuelaId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [filaEstudio]);

  return (
    <div>
      <Cabecera
        icono={<ClipboardList size={18} />}
        titulo="Protocolos y Técnicas"
        subtitulo="Protocolos completos y técnicas puntuales, con pasos interactivos, objetivo clínico clasificado y comparación de hasta tres a la vez."
      />
      <GaleriaCasos />
      <PorMotivo escuelas={escuelas} perspectivas={FUNDAMENTOS_PERSPECTIVAS} protocolos={PROTOCOLOS_SEED} procedimientos={PROCEDIMIENTOS_CLINICOS} listos={protocolosCargados()} colorDe={(p) => PERSPECTIVA_COLOR[p]} onIrAEscuela={onIrAEscuela} />
      <LecturaCasos
        escuelas={escuelas}
        perspectivas={FUNDAMENTOS_PERSPECTIVAS}
        colorDe={(p) => PERSPECTIVA_COLOR[p]}
        idDe={(n) => PERSPECTIVA_ID_POR_NOMBRE[n] || (n.startsWith("Sist") ? "sistemica" : n.startsWith("Integr") ? "integradora" : null)}
        glosario={GLOSARIO}
        nudos={CONCEPTOS_TRANSVERSALES}
        enlaces={enlaces}
        protocolos={PROTOCOLOS_SEED}
        procedimientos={PROCEDIMIENTOS_CLINICOS}
        protocolosListos={protocolosCargados()}
        onIrAEscuela={onIrAEscuela}
        onIrAProtocolos={onIrAEscuela}
      />

      {/* Banda fija con la distinción operativa, siempre visible al entrar
          al módulo — antes esta diferencia solo se insinuaba con un matiz
          de color de borde entre desplegables, sin ninguna definición
          explícita en ningún lugar del módulo. */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: "12px 16px", margin: "14px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1, minWidth: 220 }}>
          <ClipboardList size={16} color={COLORS.sage} style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13, color: COLORS.sage }}>Protocolo</div>
            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.45, color: COLORS.ink }}>
              Estructura el curso <strong>completo</strong> del tratamiento en varias fases o sesiones. Suele combinar distintas técnicas dentro de sí (p. ej. la DBT combina mindfulness, tolerancia al malestar y regulación emocional).
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1, minWidth: 220 }}>
          <Stamp size={16} color={COLORS.clay} style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13, color: COLORS.clay }}>Técnica</div>
            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.45, color: COLORS.ink }}>
              Una intervención <strong>puntual</strong> dentro de una sesión, aunque tenga varios pasos internos (p. ej. el diálogo socrático o la silla vacía). No organiza por sí sola el curso completo del tratamiento.
            </p>
          </div>
        </div>
      </div>

      <div style={{ margin: "14px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <input
          value={q}
          onChange={(ev) => setQ(ev.target.value)}
          placeholder="Buscar protocolo, técnica o escuela (p. ej. «exposición», «DBT», «Gestalt»)…"
          style={{ ...CAMPO_STYLE, maxWidth: 420, fontFamily: "var(--f-text)", fontSize: 13 }}
        />
        <div style={{ display: "flex", gap: 4, background: COLORS.paperDark, borderRadius: 20, padding: 3 }}>
          <button
            onClick={() => setVista("tarjetas")}
            title="Ver perspectiva → escuela → protocolo, en profundidad"
            style={{
              fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
              background: vista === "tarjetas" ? COLORS.garnet : "transparent", color: vista === "tarjetas" ? COLORS.cardBg : COLORS.inkSoft,
            }}
          >
            Tarjetas
          </button>
          <button
            onClick={() => setVista("tabla")}
            title="Ver todos los protocolos y técnicas en una sola tabla comparable y ordenable"
            style={{
              fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
              background: vista === "tabla" ? COLORS.garnet : "transparent", color: vista === "tabla" ? COLORS.cardBg : COLORS.inkSoft,
            }}
          >
            Tabla comparativa
          </button>
          <button
            onClick={() => setVista("comparar")}
            title="Comparar hasta 3 protocolos o técnicas lado a lado, paso a paso"
            style={{
              fontFamily: FONT_MONO, fontSize: 11, padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
              background: vista === "comparar" ? COLORS.garnet : "transparent", color: vista === "comparar" ? COLORS.cardBg : COLORS.inkSoft,
            }}
          >
            Comparar
          </button>
        </div>
        {qNorm && (
          <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.inkSoft }}>
            filtrando por «{q}»
          </span>
        )}
      </div>

      {vista === "tabla" && <TablaProtocolos filas={filasTabla} ordenTabla={ordenTabla} cambiarOrden={cambiarOrden} />}
      {vista === "comparar" && <ComparadorProtocolos filas={filasTabla} />}

      {modoEstudio && filaEstudio && (
        <div
          style={{
            position: "sticky", top: 4, zIndex: 5, marginBottom: 10,
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            background: COLORS.paperDark, border: `1px solid ${COLORS.gold}`, borderRadius: 12, padding: "6px 10px",
          }}
        >
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.gold, fontWeight: 700 }}>◆ modo estudio</span>
          <Boton small variant="ghost" onClick={() => setIndiceEstudio((i) => Math.max(i - 1, 0))} disabled={indiceEstudio <= 0}>←</Boton>
          <span style={{ fontFamily: "Georgia,serif", fontSize: 12.5, fontWeight: 700 }}>{filaEstudio.nombre}</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: PERSPECTIVA_COLOR[filaEstudio.perspectiva] }}>{filaEstudio.escuela}</span>
          <Boton small variant="ghost" onClick={() => setIndiceEstudio((i) => Math.min(i + 1, filasTabla.length - 1))} disabled={indiceEstudio >= filasTabla.length - 1}>→</Boton>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, marginLeft: "auto" }}>
            {indiceEstudio + 1} / {filasTabla.length} · ← → · Esc para salir
          </span>
        </div>
      )}

      {vista === "tarjetas" && (
      <div style={{ display: "grid", gap: 12, marginTop: 4 }}>
        {[...new Set(escuelas.map((e) => e.perspectiva))].map((persp, ip) => {
            const cPersp = PERSPECTIVA_COLOR[persp];
            const escuelasP = escuelas.filter(
              (e) => e.perspectiva === persp && (PROTOCOLOS_SEED[e.id] || PROCEDIMIENTOS_CLINICOS[e.id]) && coincideEscuela(e)
            );
            // Antes las escuelas sin PROTOCOLOS_SEED ni PROCEDIMIENTOS_CLINICOS
            // quedaban completamente invisibles en este módulo, aunque la app
            // ya tenía preparada una PLANTILLA_GENERAL y una NOTA_SIN_PROTOCOLO
            // precisamente para este caso (varias veces una ausencia
            // deliberada, no una laguna — cf. Centrada en Soluciones, Narrativa,
            // existencial británica). Ahora se listan también, colapsadas, con
            // la plantilla general adaptable.
            const escuelasSinProtocolo = escuelas.filter(
              (e) => e.perspectiva === persp && !PROTOCOLOS_SEED[e.id] && !PROCEDIMIENTOS_CLINICOS[e.id] && coincideEscuela(e)
            );
            if (escuelasP.length === 0 && escuelasSinProtocolo.length === 0) return null;
            const nProtocolos = escuelasP.reduce(
              (acc, e) =>
                acc +
                (PROTOCOLOS_SEED[e.id] ? 1 : 0) +
                (PROCEDIMIENTOS_CLINICOS[e.id]?.filter(esProtocoloProc).length || 0),
              0
            );
            const nTecnicas = escuelasP.reduce(
              (acc, e) => acc + (PROCEDIMIENTOS_CLINICOS[e.id]?.filter(esTecnicaProc).length || 0),
              0
            );
            return (
              <Desplegable
                key={persp}
                titulo={persp}
                subtitulo={`${escuelasP.length} escuela${escuelasP.length !== 1 ? "s" : ""} · ${nProtocolos} protocolo${nProtocolos !== 1 ? "s" : ""}${nTecnicas > 0 ? ` · ${nTecnicas} técnica${nTecnicas !== 1 ? "s" : ""} con procedimiento` : ""}${escuelasSinProtocolo.length > 0 ? ` · ${escuelasSinProtocolo.length} sin protocolo propio` : ""}`}
                color={cPersp}
                defaultAbierto={!!qNorm || modoEstudio}
              >
                {escuelasP.map((e) => {
                  const nEscuela = (PROTOCOLOS_SEED[e.id] ? 1 : 0) + (PROCEDIMIENTOS_CLINICOS[e.id]?.filter(esProtocoloProc).length || 0);
                  const nEscuelaTec = PROCEDIMIENTOS_CLINICOS[e.id]?.filter(esTecnicaProc).length || 0;
                  const esFoco = foco && foco.escuelaId === e.id;
                  return (
                    <div key={e.id} id={"protocolo-" + e.id} style={esFoco ? { outline: `2px solid ${cPersp}`, borderRadius: 12, transition: "outline 0.3s" } : undefined}>
                    <Desplegable titulo={e.nombre} subtitulo={`${nEscuela} protocolo${nEscuela !== 1 ? "s" : ""}${nEscuelaTec > 0 ? ` · ${nEscuelaTec} técnica${nEscuelaTec !== 1 ? "s" : ""}` : ""}`} color={cPersp} defaultAbierto={!!qNorm || modoEstudio}>
                      {(() => {
                        const protocolosEscuela = [
                          ...(PROTOCOLOS_SEED[e.id] ? [{ ...PROTOCOLOS_SEED[e.id], _origen: "principal" }] : []),
                          ...(PROCEDIMIENTOS_CLINICOS[e.id] || []).filter(esProtocoloProc),
                        ];
                        const tecnicasEscuela = (PROCEDIMIENTOS_CLINICOS[e.id] || []).filter(esTecnicaProc);
                        return (
                          <>
                            {protocolosEscuela.length > 0 && (
                              <div style={{ marginBottom: 14 }}>
                                {/* Cabecera de sección PROTOCOLOS: separación explícita y
                                    permanente (no solo un color de borde sutil) frente a las
                                    técnicas, con la definición operativa repetida aquí mismo
                                    para que quede claro sin tener que ir al encabezado del
                                    módulo — un protocolo estructura el curso COMPLETO del
                                    tratamiento en fases/sesiones, típicamente combinando
                                    varias técnicas distintas dentro de sí. */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingBottom: 6, borderBottom: `2px solid ${COLORS.sage}` }}>
                                  <ClipboardList size={15} color={COLORS.sage} />
                                  <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5, color: COLORS.sage }}>
                                    Protocolos ({protocolosEscuela.length})
                                  </span>
                                  <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft }}>— estructura completa del tratamiento por fases/sesiones</span>
                                </div>
                                {protocolosEscuela.map((p, i) => (
                                  <Desplegable key={i} titulo={p.nombre} subtitulo="protocolo" color={COLORS.sage} defaultAbierto={false}>
                                    <div style={{ marginBottom: 6 }}><Fuente texto={p.fuente} /></div>
                                    <PasosInteractivos pasos={p.fases} colorAcento={COLORS.sage} />
                                    {p.porQueFunciona && (
                                      <div style={{ background: COLORS.paperDark, borderRadius: 8, padding: 10, marginTop: 6, borderLeft: `3px solid ${COLORS.garnet}` }}>
                                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", color: COLORS.garnet, marginBottom: 3 }}>Por qué / para qué funciona</div>
                                        <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.5, color: COLORS.ink }}>{p.porQueFunciona}</p>
                                      </div>
                                    )}
                                    {p.condiciones && <DetalleCondiciones texto={p.condiciones} />}
                                    {p._origen === "principal" && (PROCEDIMIENTOS_CLINICOS[e.id] || []).filter(esFaseProc).map((f, k) => (
                                      <Desplegable key={"f" + k} titulo={f.nombre} subtitulo="detalle del protocolo" color={COLORS.sage} defaultAbierto={false}>
                                        <div style={{ marginBottom: 6 }}><Fuente texto={f.fuente} /></div>
                                        <PasosInteractivos pasos={f.fases} colorAcento={COLORS.sage} />
                                        {f.porQueFunciona && <p style={{ margin: "6px 0 0", fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.5, color: COLORS.ink }}><strong>Por qué funciona: </strong>{f.porQueFunciona}</p>}
                                        {f.condiciones && <DetalleCondiciones texto={f.condiciones} />}
                                      </Desplegable>
                                    ))}
                                    {tecnicasEscuela.length > 0 && (
                                      <p style={{ margin: "8px 0 0", fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, fontStyle: "italic" }}>
                                        Este protocolo puede combinar, entre otras, las {tecnicasEscuela.length} técnicas listadas más abajo — un protocolo no es una técnica adicional, es el marco de sesión que las organiza.
                                      </p>
                                    )}
                                  </Desplegable>
                                ))}
                              </div>
                            )}

                            {protocolosEscuela.length === 0 && (
                              <div style={{ marginBottom: 14 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, paddingBottom: 6, borderBottom: `2px dashed ${COLORS.line}` }}>
                                  <ClipboardList size={15} color={COLORS.inkSoft} />
                                  <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5, color: COLORS.inkSoft }}>Protocolos (0)</span>
                                  <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft }}>— sin protocolo estandarizado en la bibliografía revisada</span>
                                </div>
                                {SIN_PROTOCOLO_NOTAS[e.id] && (
                                  <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.5, color: COLORS.inkSoft, fontStyle: "italic" }}>{SIN_PROTOCOLO_NOTAS[e.id]}</p>
                                )}
                              </div>
                            )}

                            {tecnicasEscuela.length > 0 && (
                              <div>
                                {/* Cabecera de sección TÉCNICAS: mismo tratamiento visual que
                                    arriba pero con color e ícono distintos (Stamp, prestado del
                                    resto de la app para "intervención puntual"), y su propia
                                    definición operativa — evita que el usuario tenga que inferir
                                    la diferencia solo por un matiz de color de borde. */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingBottom: 6, borderBottom: `2px solid ${COLORS.clay}` }}>
                                  <Stamp size={15} color={COLORS.clay} />
                                  <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5, color: COLORS.clay }}>
                                    Técnicas ({tecnicasEscuela.length})
                                  </span>
                                  <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft }}>— intervención puntual, aunque tenga varios pasos internos</span>
                                </div>
                                {tecnicasEscuela.map((proc, i) => (
                                  <Desplegable key={i} titulo={proc.nombre} subtitulo="técnica" color={COLORS.clay} defaultAbierto={false}>
                                    <div style={{ marginBottom: 6 }}><Fuente texto={proc.fuente} /></div>
                                    <PasosInteractivos pasos={proc.fases} colorAcento={COLORS.clay} />
                                    {proc.porQueFunciona && (
                                      <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 10, marginBottom: 6, borderLeft: `3px solid ${COLORS.clay}` }}>
                                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", color: COLORS.clay, marginBottom: 3 }}>Por qué / para qué funciona</div>
                                        <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.5, color: COLORS.ink }}>{proc.porQueFunciona}</p>
                                      </div>
                                    )}
                                    {proc.condiciones && <DetalleCondiciones texto={proc.condiciones} />}
                                  </Desplegable>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </Desplegable>
                    </div>
                  );
                })}
                {escuelasSinProtocolo.length > 0 && (
                  <Desplegable
                    titulo={`Escuelas sin protocolo propio (${escuelasSinProtocolo.length})`}
                    subtitulo="sin manual estandarizado — a menudo una posición epistemológica deliberada, no una laguna"
                    color={COLORS.inkSoft}
                    defaultAbierto={false}
                  >
                    <p style={{ fontSize: 11.5, fontFamily: "var(--f-text)", color: COLORS.inkSoft, fontStyle: "italic", marginTop: 0, marginBottom: 10 }}>
                      {NOTA_SIN_PROTOCOLO}
                    </p>
                    {escuelasSinProtocolo.map((e) => (
                      <div key={e.id} id={"protocolo-" + e.id} style={{ marginBottom: 10 }}>
                        <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13, marginBottom: 4, color: COLORS.ink }}>{e.nombre}</div>
                        <p style={{ margin: 0, fontSize: 12, fontFamily: "var(--f-text)", color: COLORS.inkSoft }}>{SIN_PROTOCOLO_NOTAS[e.id] || "Sin protocolo estandarizado en la bibliografía revisada."}</p>
                      </div>
                    ))}
                  </Desplegable>
                )}
              </Desplegable>
            );
          })}
        </div>
      )}

    </div>
  );
}

/* ---------- MÓDULO 3: DICCIONARIO TRASLACIONAL ---------- */
/* Traductor en vivo: el usuario escribe un concepto o técnica de
   cualquier escuela y, mientras teclea, la app sugiere los términos
   que coinciden y adelanta —con una barra de fidelidad— cuántos
   equivalentes trazados tiene cada uno en otras perspectivas, antes
   de entrar al glosario completo (recomendación interactiva). */
function TraductorEnVivo({ escuelas, enlaces, tipo, onSeleccionar }) {
  const [q, setQ] = useState("");
  const resultados = useMemo(() => {
    if (!q || q.trim().length < 2) return [];
    const f = q.trim().toLowerCase();
    return GLOSARIO.filter((g) => g.tipo === tipo && normalizarTermino(g.termino).includes(normalizarTermino(f)))
      .map((g) => {
        const escuela = escuelas.find((e) => e.id === g.escuela);
        const eq = escuela ? enlacesDeConcepto(enlaces, g.escuela, g.termino) : [];
        return { g, escuela, eq };
      })
      .filter((r) => r.escuela)
      .sort((a, b) => normalizarTermino(a.g.termino).indexOf(f) - normalizarTermino(b.g.termino).indexOf(f))
      .slice(0, 8);
  }, [q, tipo, enlaces, escuelas]);

  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <div style={{ position: "relative" }}>
        <Languages size={14} style={{ position: "absolute", left: 10, top: 10, color: COLORS.inkSoft }} />
        <input
          value={q}
          onChange={(ev) => setQ(ev.target.value)}
          placeholder={`Traductor en vivo: escribe un ${tipo === "técnica" ? "técnica" : "concepto"} de cualquier escuela…`}
          style={{ width: "100%", padding: "9px 12px 9px 32px", borderRadius: 12, border: `1.5px solid ${COLORS.primary}`, fontFamily: FONT_MONO, fontSize: 12.5 }}
        />
      </div>
      {resultados.length > 0 && (
        <div style={{ position: "absolute", zIndex: 5, top: "calc(100% + 4px)", left: 0, right: 0, background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, boxShadow: "0 6px 18px rgba(30,42,40,0.12)", maxHeight: 340, overflowY: "auto" }}>
          {resultados.map(({ g, escuela, eq }, i) => {
            const c = PERSPECTIVA_COLOR[escuela.perspectiva];
            const mejor = eq.reduce(
              (m, l) => {
                const v = { alta: 3, media: 2, baja: 1 }[l.fidelidad] || 0;
                return v > m.v ? { v, f: l.fidelidad } : m;
              },
              { v: 0, f: null }
            );
            return (
              <div
                key={g.escuela + g.termino + i}
                onClick={() => {
                  onSeleccionar(g.escuela, g.termino);
                  setQ("");
                }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", borderBottom: i < resultados.length - 1 ? `1px solid ${COLORS.paperDark}` : "none" }}
                onMouseEnter={(ev) => (ev.currentTarget.style.background = COLORS.paperDark)}
                onMouseLeave={(ev) => (ev.currentTarget.style.background = COLORS.cardBg)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.termino}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: c }}>{escuela.nombre}</div>
                </div>
                {eq.length > 0 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft }}>{eq.length} equiv.</span>
                    {mejor.f && <BarraFidelidad nivel={mejor.f} color={COLORS.sage} />}
                  </div>
                ) : (
                  <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, fontStyle: "italic", flexShrink: 0 }}>sin enlaces aún</span>
                )}
              </div>
            );
          })}
        </div>
      )}
      {resultados.length === 0 && q.trim().length >= 3 && (
        (() => {
          const sugerencias = sugerirTerminos(q, GLOSARIO.filter((g) => g.tipo === tipo).map((g) => g.termino), 4);
          if (sugerencias.length === 0) return null;
          return (
            <div style={{ position: "absolute", zIndex: 5, top: "calc(100% + 4px)", left: 0, right: 0, background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--f-text)", fontSize: 12, color: COLORS.inkSoft, fontStyle: "italic" }}>¿Quisiste decir…?</span>
              {sugerencias.map((s) => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  style={{
                    fontFamily: FONT_MONO, fontSize: 11, padding: "3px 9px", borderRadius: 12, cursor: "pointer",
                    border: `1px solid ${COLORS.gold}`, background: "transparent", color: COLORS.gold, fontWeight: 700,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
}

/* Vista de grafo del diccionario traslacional: complementa la vista de
   lista con una lectura espacial de la red de enlaces — qué escuelas están
   más conectadas (grado del nodo), y de qué tipo son esas conexiones
   (color de la arista, según RELACION_INFO) y con qué fidelidad (opacidad).
   Layout circular determinista (agrupado por perspectiva) en vez de una
   simulación de fuerzas, para que la posición de cada escuela sea estable
   entre renders y no "salte" al pasar el mouse. */
/* Vista "por escuela": elige una escuela y ve TODOS sus enlaces
   salientes de una vez, agrupados por tipo de relación — antes había
   que entrar concepto por concepto dentro de esa escuela para
   reconstruir mentalmente su red completa de equivalencias. */
function VistaEnlacesPorEscuela({ escuelas, enlaces, onIrAEscuela }) {
  const [escuelaId, setEscuelaId] = useState(escuelas[0]?.id || null);
  const escuela = escuelas.find((e) => e.id === escuelaId);

  const enlacesDeEscuela = useMemo(() => {
    if (!escuelaId) return [];
    return enlaces.filter((l) => l.conceptoA?.escuela === escuelaId || l.conceptoB?.escuela === escuelaId);
  }, [enlaces, escuelaId]);

  const agrupados = useMemo(() => {
    const g = {};
    enlacesDeEscuela.forEach((l) => {
      g[l.relacion] = g[l.relacion] || [];
      g[l.relacion].push(l);
    });
    return g;
  }, [enlacesDeEscuela]);

  return (
    <div>
      <select
        value={escuelaId || ""}
        onChange={(ev) => setEscuelaId(ev.target.value)}
        style={{ ...CAMPO_STYLE, maxWidth: 420, fontFamily: "var(--f-text)", fontSize: 13, marginBottom: 12 }}
      >
        {[...escuelas].sort((a, b) => a.perspectiva.localeCompare(b.perspectiva) || a.nombre.localeCompare(b.nombre)).map((e) => (
          <option key={e.id} value={e.id}>
            {e.perspectiva} — {e.nombre}
          </option>
        ))}
      </select>

      {escuela && (
        <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 12 }}>
          {enlacesDeEscuela.length} enlace{enlacesDeEscuela.length !== 1 ? "s" : ""} salientes de <strong style={{ color: PERSPECTIVA_COLOR[escuela.perspectiva] }}>{escuela.nombre}</strong>
        </div>
      )}

      {enlacesDeEscuela.length === 0 && <VacioAviso texto="Esta escuela todavía no tiene enlaces traslacionales registrados." />}

      {Object.entries(agrupados).map(([relacion, lista]) => {
        const info = RELACION_INFO[relacion] || { color: COLORS.primary, abrev: "?" };
        return (
          <div key={relacion} style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, color: info.color, marginBottom: 8 }}>
              {info.abrev} {relacion} ({lista.length})
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {lista.map((l) => {
                const esA = l.conceptoA?.escuela === escuelaId;
                const propio = esA ? l.conceptoA : l.conceptoB;
                const otro = esA ? l.conceptoB : l.conceptoA;
                const otraEscuela = escuelas.find((e) => e.id === otro?.escuela);
                return (
                  <div key={l.id} style={{ borderLeft: `3px solid ${info.color}`, paddingLeft: 12, background: COLORS.paperDark, borderRadius: 8, padding: "8px 12px" }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 13, marginBottom: 3 }}>
                      <strong>{propio?.nombre}</strong> ↔ <strong>{otro?.nombre}</strong>{" "}
                      <span
                        onClick={() => otraEscuela && onIrAEscuela && onIrAEscuela(otraEscuela.id)}
                        style={{ fontFamily: FONT_MONO, fontSize: 10, color: PERSPECTIVA_COLOR[otraEscuela?.perspectiva] || COLORS.inkSoft, cursor: otraEscuela ? "pointer" : "default", textDecoration: otraEscuela ? "underline" : "none" }}
                      >
                        ({otraEscuela?.nombre || "escuela eliminada"})
                      </span>
                    </div>
                    <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.5, color: COLORS.inkSoft }}>{l.nota}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GrafoTraslacional({ escuelas, enlaces, filtro, onIrAEscuela }) {
  const [nodoActivo, setNodoActivo] = useState(null);
  const [enlaceActivo, setEnlaceActivo] = useState(null);
  // Filtros propios del grafo: por tipo de relación y por fidelidad
  // declarada. Se combinan (AND) con el filtro de texto que ya venía
  // de la barra superior del módulo. Vacío = sin restricción.
  const [relacionesActivas, setRelacionesActivas] = useState([]);
  const [fidelidadesActivas, setFidelidadesActivas] = useState([]);
  const [perspectivasActivas, setPerspectivasActivas] = useState([]);
  const toggleRelacion = (r) => setRelacionesActivas((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));
  const toggleFidelidad = (fd) => setFidelidadesActivas((cur) => (cur.includes(fd) ? cur.filter((x) => x !== fd) : [...cur, fd]));
  const togglePerspectiva = (p) => setPerspectivasActivas((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  const perspectivaDeEscuela = (id) => escuelas.find((e) => e.id === id)?.perspectiva;

  const enlacesFiltrados = useMemo(
    () =>
      enlaces.filter((l) => {
        if (relacionesActivas.length > 0 && !relacionesActivas.includes(l.relacion)) return false;
        if (fidelidadesActivas.length > 0 && !fidelidadesActivas.includes(l.fidelidad)) return false;
        if (perspectivasActivas.length > 0) {
          // "Perspectivas involucradas": el enlace debe tocar AL MENOS UNA
          // de las perspectivas marcadas por alguno de sus dos lados —
          // combinado (AND) con los filtros de relación y fidelidad de
          // arriba, no en lugar de ellos. Con 2+ perspectivas marcadas,
          // esto además permite acotar a "enlaces entre X y Y" si se
          // marcan ambas y se revisa que cada lado caiga en una distinta.
          const pA = perspectivaDeEscuela(l.conceptoA?.escuela);
          const pB = perspectivaDeEscuela(l.conceptoB?.escuela);
          if (!perspectivasActivas.includes(pA) && !perspectivasActivas.includes(pB)) return false;
        }
        return true;
      }),
    [enlaces, relacionesActivas, fidelidadesActivas, perspectivasActivas, escuelas]
  );

  const nodos = useMemo(() => {
    const ids = new Set();
    enlacesFiltrados.forEach((l) => {
      if (l.conceptoA?.escuela) ids.add(l.conceptoA.escuela);
      if (l.conceptoB?.escuela) ids.add(l.conceptoB.escuela);
    });
    const lista = escuelas.filter((e) => ids.has(e.id));
    lista.sort((a, b) => (a.perspectiva || "").localeCompare(b.perspectiva || "") || a.nombre.localeCompare(b.nombre));
    const grado = new Map();
    const vecinos = new Map();
    enlacesFiltrados.forEach((l) => {
      const idA = l.conceptoA?.escuela, idB = l.conceptoB?.escuela;
      if (idA) grado.set(idA, (grado.get(idA) || 0) + 1);
      if (idB) grado.set(idB, (grado.get(idB) || 0) + 1);
      if (idA && idB) {
        if (!vecinos.has(idA)) vecinos.set(idA, new Set());
        if (!vecinos.has(idB)) vecinos.set(idB, new Set());
        vecinos.get(idA).add(idB);
        vecinos.get(idB).add(idA);
      }
    });
    const n = lista.length || 1;
    const cx = 400, cy = 320, r = Math.min(280, 100 + n * 5);
    return lista.map((e, i) => {
      const ang = (2 * Math.PI * i) / n - Math.PI / 2;
      return { ...e, x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), ang, grado: grado.get(e.id) || 0, vecinos: vecinos.get(e.id) || new Set() };
    });
  }, [escuelas, enlacesFiltrados]);

  const posPorId = useMemo(() => new Map(nodos.map((n) => [n.id, n])), [nodos]);
  const f = (filtro || "").toLowerCase().trim();
  const coincide = (n) => !f || n.nombre.toLowerCase().includes(f) || (n.perspectiva || "").toLowerCase().includes(f);
  // Al pasar el mouse por un nodo, se resalta su vecindario inmediato y se
  // atenúa el resto — antes solo el texto buscado atenuaba, así que con
  // redes densas era difícil seguir visualmente las conexiones de un nodo.
  const nodoHover = nodos.find((n) => n.id === nodoActivo);

  if (escuelas.length > 0 && enlaces.length > 0 && nodos.length === 0) {
    return (
      <div style={{ display: "grid", gap: 10 }}>
        <PanelFiltrosGrafo
          relacionesActivas={relacionesActivas}
          toggleRelacion={toggleRelacion}
          fidelidadesActivas={fidelidadesActivas}
          toggleFidelidad={toggleFidelidad}
          perspectivasActivas={perspectivasActivas}
          togglePerspectiva={togglePerspectiva}
        />
        <VacioAviso texto="Ningún enlace cumple con los filtros de tipo de relación / fidelidad seleccionados." />
      </div>
    );
  }
  if (nodos.length === 0) {
    return <VacioAviso texto="Aún no hay enlaces traslacionales para dibujar el grafo." />;
  }

  return (
    <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 14 }}>
      <p style={{ fontSize: 11.5, fontFamily: "var(--f-text)", color: COLORS.inkSoft, fontStyle: "italic", marginTop: 0, marginBottom: 10 }}>
        Cada nodo es una escuela con al menos un enlace traslacional (color = perspectiva, tamaño = número de enlaces). Cada línea es un enlace, coloreada por tipo de relación y con opacidad según la fidelidad declarada. Pasa el mouse sobre un nodo para resaltar su vecindario; clic en un nodo abre su ficha; clic en una línea muestra la nota de distorsión completa.
      </p>
      <PanelFiltrosGrafo
        relacionesActivas={relacionesActivas}
        toggleRelacion={toggleRelacion}
        fidelidadesActivas={fidelidadesActivas}
        toggleFidelidad={toggleFidelidad}
        perspectivasActivas={perspectivasActivas}
        togglePerspectiva={togglePerspectiva}
      />
      <svg viewBox="0 0 800 640" style={{ width: "100%", height: "auto", maxHeight: 640, display: "block", marginTop: 10 }} role="img" aria-label="Grafo de enlaces traslacionales entre escuelas">
        {enlacesFiltrados.map((l) => {
          const a = posPorId.get(l.conceptoA?.escuela);
          const b = posPorId.get(l.conceptoB?.escuela);
          if (!a || !b) return null;
          const info = RELACION_INFO[l.relacion] || { color: COLORS.inkSoft };
          const opacidad = { alta: 0.85, media: 0.55, baja: 0.3 }[l.fidelidad] ?? 0.5;
          const activo = enlaceActivo?.id === l.id;
          const tocaHover = nodoHover && (a.id === nodoHover.id || b.id === nodoHover.id);
          const atenuadoTexto = !!f && !(coincide(a) && coincide(b));
          const atenuadoHover = nodoHover && !tocaHover;
          const atenuado = atenuadoTexto || atenuadoHover;
          return (
            <line
              key={l.id}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={info.color}
              strokeWidth={activo || tocaHover ? 3 : 1.4}
              opacity={atenuado ? 0.06 : activo ? 1 : opacidad}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setEnlaceActivo(l)}
              onClick={() => setEnlaceActivo(l)}
            >
              <title>{`${l.conceptoA?.nombre} ↔ ${l.conceptoB?.nombre} · ${l.relacion} · fidelidad ${l.fidelidad}`}</title>
            </line>
          );
        })}
        {nodos.map((n) => {
          const radio = 7 + Math.min(n.grado, 10) * 1.1;
          const atenuadoTexto = !!f && !coincide(n);
          const atenuadoHover = nodoHover && n.id !== nodoHover.id && !nodoHover.vecinos.has(n.id);
          const atenuado = atenuadoTexto || atenuadoHover;
          // Ancla del texto según el lado del círculo donde cae el nodo,
          // para que las etiquetas no invadan sistemáticamente el centro
          // del grafo (mitad derecha → texto a la derecha, mitad
          // izquierda → texto a la izquierda de su nodo).
          const mitadDerecha = Math.cos(n.ang) >= 0;
          const anchorX = mitadDerecha ? n.x + radio + 4 : n.x - radio - 4;
          const anchorAnchor = mitadDerecha ? "start" : "end";
          const resaltado = nodoHover?.id === n.id || (nodoHover && nodoHover.vecinos.has(n.id));
          return (
            <g
              key={n.id}
              onClick={() => onIrAEscuela && onIrAEscuela(n.id)}
              onMouseEnter={() => setNodoActivo(n.id)}
              onMouseLeave={() => setNodoActivo((cur) => (cur === n.id ? null : cur))}
              style={{ cursor: onIrAEscuela ? "pointer" : "default" }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={radio}
                fill={PERSPECTIVA_COLOR[n.perspectiva] || COLORS.inkSoft}
                opacity={atenuado ? 0.15 : resaltado ? 1 : 0.85}
                stroke={resaltado ? COLORS.ink : "#fff"}
                strokeWidth={resaltado ? 2.5 : 1.5}
              />
              <text
                x={anchorX}
                y={n.y}
                dy={3}
                textAnchor={anchorAnchor}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 9,
                  fontWeight: resaltado ? 700 : 400,
                  fill: atenuado ? "transparent" : COLORS.ink,
                  pointerEvents: "none",
                }}
              >
                {n.nombre.length > 22 ? n.nombre.slice(0, 20) + "…" : n.nombre}
              </text>
              <title>{`${n.nombre} (${n.perspectiva}) · ${n.grado} enlace(s)`}</title>
            </g>
          );
        })}
      </svg>
      {enlaceActivo && (
        <div style={{ marginTop: 10, padding: 10, background: COLORS.paperDark, borderRadius: 12, border: `1px solid ${COLORS.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: (RELACION_INFO[enlaceActivo.relacion] || {}).color, display: "inline-block" }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: COLORS.ink }}>
              {enlaceActivo.relacion} · fidelidad {enlaceActivo.fidelidad}
            </span>
            <button
              onClick={() => setEnlaceActivo(null)}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: COLORS.inkSoft }}
              aria-label="Cerrar detalle del enlace"
            >
              <X size={13} />
            </button>
          </div>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 13, marginBottom: 4 }}>
            {enlaceActivo.conceptoA?.nombre} ↔ {enlaceActivo.conceptoB?.nombre}
          </div>
          {enlaceActivo.nota && (
            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.5, color: COLORS.inkSoft }}>
              <NotaConMenciones
                texto={enlaceActivo.nota}
                escuelaActualId={enlaceActivo.conceptoA?.escuela}
                onIrAConcepto={(escId) => onIrAEscuela && onIrAEscuela(escId)}
              />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* Fila de chips para filtrar el grafo por tipo de relación y por
   fidelidad, doblando además como leyenda de colores (cada chip ya
   muestra el color exacto que tendrán las líneas del grafo). */
function PanelFiltrosGrafo({ relacionesActivas, toggleRelacion, fidelidadesActivas, toggleFidelidad, perspectivasActivas, togglePerspectiva }) {
  const fidelidades = [
    { clave: "alta", label: "Fidelidad alta" },
    { clave: "media", label: "Fidelidad media" },
    { clave: "baja", label: "Fidelidad baja" },
  ];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.03em" }}>Relación:</span>
        {Object.entries(RELACION_INFO).map(([nombre, info]) => {
          const activo = relacionesActivas.includes(nombre);
          return (
            <button
              key={nombre}
              onClick={() => toggleRelacion(nombre)}
              title={`Filtrar por relación: ${nombre}`}
              style={{
                fontFamily: FONT_MONO, fontSize: 10, padding: "3px 8px", borderRadius: 10,
                border: `1px solid ${info.color}`, cursor: "pointer",
                background: activo ? info.color : "transparent", color: activo ? COLORS.cardBg : info.color,
              }}
            >
              {info.abrev} {nombre}
            </button>
          );
        })}
      </div>
      {togglePerspectiva && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.03em" }}>Perspectivas involucradas:</span>
          {Object.entries(PERSPECTIVA_COLOR)
            .filter(([nombre]) => !["Sistémica y familiar", "Integradora y ecléctica"].includes(nombre))
            .map(([nombre, color]) => {
              const activo = perspectivasActivas.includes(nombre);
              return (
                <button
                  key={nombre}
                  onClick={() => togglePerspectiva(nombre)}
                  title={`Solo enlaces donde participe ${nombre}`}
                  style={{
                    fontFamily: FONT_MONO, fontSize: 10, padding: "3px 8px", borderRadius: 10,
                    border: `1px solid ${color}`, cursor: "pointer",
                    background: activo ? color : "transparent", color: activo ? COLORS.cardBg : color,
                  }}
                >
                  {nombre}
                </button>
              );
            })}
          {perspectivasActivas.length >= 2 && (
            <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, fontStyle: "italic" }}>
              (marca 2 para ver los cruces entre ellas)
            </span>
          )}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.03em" }}>Fidelidad:</span>
        {fidelidades.map((fd) => {
          const activo = fidelidadesActivas.includes(fd.clave);
          return (
            <button
              key={fd.clave}
              onClick={() => toggleFidelidad(fd.clave)}
              style={{
                fontFamily: FONT_MONO, fontSize: 10, padding: "3px 8px", borderRadius: 10,
                border: `1px solid ${COLORS.inkSoft}`, cursor: "pointer",
                background: activo ? COLORS.inkSoft : "transparent", color: activo ? COLORS.cardBg : COLORS.inkSoft,
              }}
            >
              {fd.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ModuloDiccionario({ escuelas, enlaces, setEnlaces, enlacesTecnicas, setEnlacesTecnicas, filtro, focoInicial, onIrAEscuela, modoEstudio, setModoEstudio }) {
  const [vista, setVista] = useState("glosario"); // "glosario" | "tecnicas" | "psicopatologias"
  const [subVistaTecnicas, setSubVistaTecnicas] = useState("navegar"); // "navegar" | "comparar"
  const [vistaGlosario, setVistaGlosario] = useState("lista"); // "lista" | "grafo" — orientación complementaria: el grafo muestra de un vistazo qué escuelas están más conectadas y por qué tipo de relación
  const [escuelaGlosario, setEscuelaGlosario] = useState(focoInicial?.escuelaId || escuelas[0]?.id);
  const [conceptoGlosario, setConceptoGlosario] = useState(focoInicial?.termino || null);
  const [escuelaTecnica, setEscuelaTecnica] = useState(escuelas[0]?.id);
  const [tecnicaGlosario, setTecnicaGlosario] = useState(null);
  const [filosofiaCienciaAbierta, setFilosofiaCienciaAbierta] = useState(false);
  const [nuevoA, setNuevoA] = useState({ escuela: escuelas[0]?.id, nombre: "" });
  const [nuevoB, setNuevoB] = useState({ escuela: escuelas[0]?.id, nombre: "" });
  const [relacion, setRelacion] = useState("análogo funcional");
  const [fidelidad, setFidelidad] = useState("media");
  const [nota, setNota] = useState("");
  const [formAbierto, setFormAbierto] = useState(false);

  // Modo estudio: recorre con ← → las entradas de GLOSARIO de la escuela
  // actualmente seleccionada (mismo orden que GlosarioPorEscuela), solo
  // cuando la vista de lista está activa y hay una escuela elegida.
  const entradasEstudioGlosario = useMemo(
    () => GLOSARIO.filter((g) => g.escuela === escuelaGlosario),
    [escuelaGlosario]
  );
  useEffect(() => {
    if (!modoEstudio || vista !== "glosario" || vistaGlosario !== "lista") return;
    const onKey = (ev) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (entradasEstudioGlosario.length === 0) return;
      const iActual = entradasEstudioGlosario.findIndex((g) => g.termino === conceptoGlosario);
      if (ev.key === "ArrowRight") {
        const siguiente = entradasEstudioGlosario[Math.min(iActual + 1, entradasEstudioGlosario.length - 1)] || entradasEstudioGlosario[0];
        setConceptoGlosario(siguiente.termino);
      }
      if (ev.key === "ArrowLeft") {
        const anterior = entradasEstudioGlosario[Math.max(iActual - 1, 0)] || entradasEstudioGlosario[0];
        setConceptoGlosario(anterior.termino);
      }
      if (ev.key === "Escape") setModoEstudio(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modoEstudio, vista, vistaGlosario, entradasEstudioGlosario, conceptoGlosario, setModoEstudio]);

  useEffect(() => {
    if (focoInicial) {
      setVista("glosario");
      setEscuelaGlosario(focoInicial.escuelaId);
      setConceptoGlosario(focoInicial.termino);
    }
  }, [focoInicial]);

  function agregarEnlace() {
    if (!nuevoA.nombre || !nuevoB.nombre) return;
    setEnlaces([...enlaces, { id: "e" + Date.now(), conceptoA: nuevoA, conceptoB: nuevoB, relacion, fidelidad, nota }]);
    setNuevoA({ escuela: escuelas[0]?.id, nombre: "" });
    setNuevoB({ escuela: escuelas[0]?.id, nombre: "" });
    setNota("");
    setFormAbierto(false);
  }

  return (
    <div>
      <Cabecera
        icono={<Languages size={18} />}
        titulo="Diccionario metateórico y traslacional"
        subtitulo="Equivalencias, analogías, falsos amigos e inconmensurabilidades entre escuelas: cada enlace documenta un puente conceptual con pérdidas, nunca una identidad."
      />
      <details className="psn-detalles">
        <summary>Traductor de lenguaje clínico <small>— un término, siete vocabularios</small></summary>
        <TraductorClinico nudos={CONCEPTOS_TRANSVERSALES} idDe={(n) => PERSPECTIVA_ID_POR_NOMBRE[n] || (n.startsWith("Sist") ? "sistemica" : n.startsWith("Integr") ? "integradora" : null)} perspectivasFund={FUNDAMENTOS_PERSPECTIVAS} escuelas={escuelas} glosario={GLOSARIO} enlaces={enlaces} colorDe={(p) => PERSPECTIVA_COLOR[p]} onIrAEscuela={onIrAEscuela} perspectivas={nombresPerspectivas(escuelas)} />
      </details>
      {modoEstudio && <TraduceACiegas enlaces={enlaces || ENLACES_SEED} glosario={GLOSARIO} escuelas={escuelas} colorDe={(p) => PERSPECTIVA_COLOR[p]} onIrAEscuela={onIrAEscuela} />}
      <CoberturaDiccionario escuelas={escuelas} glosario={GLOSARIO} enlaces={enlaces || ENLACES_SEED} colorDe={(p) => PERSPECTIVA_COLOR[p]} />

      <div style={{ marginTop: 12, marginBottom: 4 }}>
        <div
          onClick={() => setFilosofiaCienciaAbierta((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "10px 14px",
          }}
        >
          {filosofiaCienciaAbierta ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span style={{ fontFamily: "var(--f-display)", fontSize: 13.5, fontWeight: 700 }}>¿Qué es la inconmensurabilidad? Posiciones en filosofía de la ciencia</span>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft }}>(Kuhn, Popper, Feyerabend, Lakatos — por qué este diccionario no fuerza equivalencias)</span>
        </div>
        {filosofiaCienciaAbierta && (
          <div style={{ background: COLORS.cardBg, borderLeft: `1px solid ${COLORS.line}`, borderRight: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}`, borderTop: "none", borderRadius: "0 0 6px 6px", padding: "14px 18px", display: "grid", gap: 12 }}>
            <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, lineHeight: 1.6, color: COLORS.ink }}>
              La <strong>inconmensurabilidad</strong> es la tesis de que dos marcos teóricos pueden carecer de un criterio común bajo el cual comparar o traducir sin pérdida sus enunciados centrales — no es simplemente que estén en desacuerdo (el desacuerdo presupone un terreno común donde contradecirse), sino que ni siquiera comparten por completo el vocabulario observacional ni los criterios de qué cuenta como evidencia relevante.
            </p>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Thomas Kuhn (1962) — el origen del término</div>
<Retrato slug="thomaskuhn" tam={76} />
              <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.55, color: COLORS.inkSoft }}>
                Acuñó «inconmensurabilidad» para describir la relación entre paradigmas científicos sucesivos: no solo cambian las teorías, cambian los propios términos observacionales (un «átomo» newtoniano y uno cuántico no denotan lo mismo), de modo que los partidarios de paradigmas rivales literalmente «viven en mundos distintos» y no pueden zanjar su disputa apelando a datos neutrales compartidos por ambos.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Karl Popper — inconmensurabilidad moderada y falsable</div>
<Retrato slug="karlpopper" tam={76} /><Retrato slug="imrelakatos" tam={76} />
              <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.55, color: COLORS.inkSoft }}>
                Popper, y su alumno Lakatos después, aceptaron que los marcos teóricos difieren en supuestos de fondo, pero rechazaron la versión fuerte kuhniana de mundos incomunicables: para ellos, el desacuerdo racional entre programas de investigación rivales sigue siendo posible porque ambos pueden, en principio, formular predicciones contrastables y ser sometidos a crítica —la inconmensurabilidad es un obstáculo real pero superable mediante el esfuerzo deliberado de traducción crítica, no una barrera absoluta—. Esta app adopta una versión próxima a esta posición moderada: cada enlace del diccionario es precisamente ese esfuerzo de traducción crítica, con su «nota de distorsión» documentando lo que se pierde en el intento.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Paul Feyerabend — inconmensurabilidad radical</div>
<Retrato slug="paulfeyerabend" tam={76} />
              <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.55, color: COLORS.inkSoft }}>
                Llevó la tesis más lejos que el propio Kuhn: si los marcos son radicalmente inconmensurables, ningún criterio metodológico universal puede arbitrar entre ellos («todo vale», anarquismo epistemológico), y la elección entre paradigmas rivales se parece más a una conversión que a una inferencia racional. Es la posición que hace más plausible la existencia de pares genuinamente «inconmensurables» en este diccionario (marcados así, no como «falsos amigos» ni «análogos débiles»): a veces no hay, ni en principio, un vocabulario compartido para arbitrar la comparación.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 3 }}>Cómo se usa esto en el diccionario de la app</div>
              <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12, lineHeight: 1.55, color: COLORS.inkSoft }}>
                La mayoría de los enlaces de este diccionario asumen la postura popperiano-lakatosiana moderada: la traducción entre escuelas es posible pero tiene un costo, documentado explícitamente en cada «nota de distorsión». Los enlaces marcados como <strong>inconmensurable</strong> son los casos, más cercanos a Kuhn o Feyerabend, en que ni siquiera ese puente con pérdidas parece sostenerse honestamente — dos escuelas que no comparten un criterio de verdad común bajo el cual sus enunciados centrales puedan siquiera contradecirse.
              </p>
            </div>
          </div>
        )}
      </div>

      <details className="psn-detalles">
        <summary>Conceptos transversales y paralelos <small>— {CONCEPTOS_TRANSVERSALES.length + 2} temas: cómo cada perspectiva responde a la misma pregunta, con modo «traducir de A a B»</small></summary>
        <Paralelos nudos={CONCEPTOS_TRANSVERSALES} glosario={GLOSARIO} escuelas={escuelas} colorDe={(p) => PERSPECTIVA_COLOR[p]} onIrAEscuela={onIrAEscuela} perspectivas={nombresPerspectivas(escuelas)} />
      </details>

      <PanelEstadisticasDiccionario enlaces={enlaces} escuelas={escuelas} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "14px 0" }}>
        {Object.entries(RELACION_INFO).map(([k, v]) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontFamily: "var(--f-mono)", color: v.color }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: v.color, display: "inline-block" }} />
            {k}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <Boton small variant={vista === "glosario" ? "default" : "ghost"} onClick={() => setVista("glosario")}>
          glosario de conceptos y equivalentes
        </Boton>
        <Boton small variant={vista === "tecnicas" ? "default" : "ghost"} onClick={() => setVista("tecnicas")}>
          técnicas: glosario y comparador
        </Boton>
        <Boton small variant={vista === "psicopatologias" ? "default" : "ghost"} onClick={() => setVista("psicopatologias")}>
          comparar psicopatologías por escuela
        </Boton>
        {vista === "glosario" && (
          <div style={{ marginLeft: "auto" }}>
            <Boton small onClick={() => setFormAbierto(!formAbierto)}>
              <Plus size={13} /> {formAbierto ? "cancelar" : "nuevo enlace"}
            </Boton>
          </div>
        )}
      </div>

      {vista === "glosario" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <Boton small variant={vistaGlosario === "lista" ? "default" : "ghost"} onClick={() => setVistaGlosario("lista")}>
              vista lista
            </Boton>
            <Boton small variant={vistaGlosario === "grafo" ? "default" : "ghost"} onClick={() => setVistaGlosario("grafo")}>
              <Network size={12} /> vista de grafo
            </Boton>
            <Boton small variant={vistaGlosario === "porescuela" ? "default" : "ghost"} onClick={() => setVistaGlosario("porescuela")}>
              vista por escuela
            </Boton>
          </div>
          {vistaGlosario === "grafo" ? (
            <GrafoTraslacional escuelas={escuelas} enlaces={enlaces} filtro={filtro} onIrAEscuela={onIrAEscuela} />
          ) : vistaGlosario === "porescuela" ? (
            <VistaEnlacesPorEscuela escuelas={escuelas} enlaces={enlaces} onIrAEscuela={onIrAEscuela} />
          ) : (
            <>
              {modoEstudio && entradasEstudioGlosario.length > 0 && (
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10,
                    background: COLORS.paperDark, border: `1px solid ${COLORS.gold}`, borderRadius: 12, padding: "6px 10px",
                  }}
                >
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.gold, fontWeight: 700 }}>◆ modo estudio</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft }}>
                    glosario de {escuelas.find((e) => e.id === escuelaGlosario)?.nombre}
                  </span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, marginLeft: "auto" }}>
                    {entradasEstudioGlosario.findIndex((g) => g.termino === conceptoGlosario) + 1} / {entradasEstudioGlosario.length} · ← → · Esc para salir
                  </span>
                </div>
              )}
              <TraductorEnVivo
                escuelas={escuelas}
                enlaces={enlaces}
                tipo="concepto"
                onSeleccionar={(escuelaId, termino) => {
                  setEscuelaGlosario(escuelaId);
                  setConceptoGlosario(termino);
                }}
              />
              <GlosarioPorEscuela
                escuelas={escuelas}
                enlaces={enlaces}
                escuelaGlosario={escuelaGlosario}
                setEscuelaGlosario={(id) => {
                  setEscuelaGlosario(id);
                  setConceptoGlosario(null);
                }}
                conceptoGlosario={conceptoGlosario}
                setConceptoGlosario={setConceptoGlosario}
                filtro={filtro}
                tipo="concepto"
              />
            </>
          )}
        </>
      )}

      {vista === "tecnicas" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <Boton small variant={subVistaTecnicas === "navegar" ? "default" : "ghost"} onClick={() => setSubVistaTecnicas("navegar")}>
              navegar con equivalentes
            </Boton>
            <Boton small variant={subVistaTecnicas === "comparar" ? "default" : "ghost"} onClick={() => setSubVistaTecnicas("comparar")}>
              vista comparativa rápida
            </Boton>
          </div>
          {subVistaTecnicas === "navegar" ? (
            <>
              <TraductorEnVivo
                escuelas={escuelas}
                enlaces={enlacesTecnicas}
                tipo="técnica"
                onSeleccionar={(escuelaId, termino) => {
                  setEscuelaTecnica(escuelaId);
                  setTecnicaGlosario(termino);
                }}
              />
              <GlosarioPorEscuela
                escuelas={escuelas}
                enlaces={enlacesTecnicas}
                escuelaGlosario={escuelaTecnica}
                setEscuelaGlosario={(id) => {
                  setEscuelaTecnica(id);
                  setTecnicaGlosario(null);
                }}
                conceptoGlosario={tecnicaGlosario}
                setConceptoGlosario={setTecnicaGlosario}
                filtro={filtro}
                tipo="técnica"
              />
            </>
          ) : (
            <ComparadorCampo escuelas={escuelas} campo="tecnicas" filtro={filtro} colorEtiqueta={COLORS.clay} />
          )}
        </div>
      )}

      {vista === "psicopatologias" && <ComparadorPsicopatologias escuelas={escuelas} filtro={filtro} />}

      {formAbierto && vista === "glosario" && (
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div className="psq-2col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 4, textTransform: "uppercase" }}>Concepto A</div>
              <select value={nuevoA.escuela} onChange={(e) => setNuevoA({ ...nuevoA, escuela: e.target.value })} style={{ width: "100%", marginBottom: 6, padding: 6, borderRadius: 8, border: `1px solid ${COLORS.line}` }}>
                {escuelas.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
              <input placeholder="nombre del concepto" value={nuevoA.nombre} onChange={(e) => setNuevoA({ ...nuevoA, nombre: e.target.value })} style={{ width: "100%", padding: 6, borderRadius: 8, border: `1px solid ${COLORS.line}` }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 4, textTransform: "uppercase" }}>Concepto B</div>
              <select value={nuevoB.escuela} onChange={(e) => setNuevoB({ ...nuevoB, escuela: e.target.value })} style={{ width: "100%", marginBottom: 6, padding: 6, borderRadius: 8, border: `1px solid ${COLORS.line}` }}>
                {escuelas.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
              <input placeholder="nombre del concepto" value={nuevoB.nombre} onChange={(e) => setNuevoB({ ...nuevoB, nombre: e.target.value })} style={{ width: "100%", padding: 6, borderRadius: 8, border: `1px solid ${COLORS.line}` }} />
            </div>
          </div>

          <div className="psq-2col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 }}>
            <label>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 4, textTransform: "uppercase" }}>Tipo de relación</div>
              <select value={relacion} onChange={(e) => setRelacion(e.target.value)} style={{ width: "100%", padding: 6, borderRadius: 8, border: `1px solid ${COLORS.line}` }}>
                {Object.keys(RELACION_INFO).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft, marginBottom: 4, textTransform: "uppercase" }}>Grado de fidelidad</div>
              <select value={fidelidad} onChange={(e) => setFidelidad(e.target.value)} style={{ width: "100%", padding: 6, borderRadius: 8, border: `1px solid ${COLORS.line}` }}>
                <option value="alta">alta</option>
                <option value="media">media</option>
                <option value="baja">baja</option>
              </select>
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <CampoTexto label="Nota de distorsión (con fundamento filosófico)" value={nota} onChange={setNota} area />
          </div>
          <Boton onClick={agregarEnlace}>
            <Save size={13} /> guardar enlace
          </Boton>
        </div>
      )}
    </div>
  );
}

/* Panel de estadísticas del diccionario traslacional: da una lectura de
   conjunto del corpus (cuántos enlaces hay de cada tipo, con qué
   fidelidad, qué escuelas concentran más conexiones y cuáles siguen sin
   ninguna) antes de perderse en la navegación concepto por concepto.
   Todo se deriva en vivo de `enlaces` y `escuelas`, así que nunca se
   desactualiza respecto a los datos reales de la app. */
function PanelEstadisticasDiccionario({ enlaces, escuelas }) {
  const [abierto, setAbierto] = useState(false);
  const stats = useMemo(() => {
    const porRelacion = {};
    const porFidelidad = { alta: 0, media: 0, baja: 0 };
    const grado = new Map();
    enlaces.forEach((l) => {
      porRelacion[l.relacion] = (porRelacion[l.relacion] || 0) + 1;
      if (l.fidelidad) porFidelidad[l.fidelidad] = (porFidelidad[l.fidelidad] || 0) + 1;
      [l.conceptoA?.escuela, l.conceptoB?.escuela].forEach((id) => {
        if (id) grado.set(id, (grado.get(id) || 0) + 1);
      });
    });
    const topEscuelas = [...grado.entries()]
      .map(([id, n]) => ({ e: escuelas.find((x) => x.id === id), n }))
      .filter((x) => x.e)
      .sort((a, b) => b.n - a.n)
      .slice(0, 5);
    const sinEnlaces = escuelas.filter((e) => !grado.has(e.id));
    return { porRelacion, porFidelidad, topEscuelas, sinEnlaces, total: enlaces.length };
  }, [enlaces, escuelas]);

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        onClick={() => setAbierto(!abierto)}
        style={{
          display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
          background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "10px 14px",
        }}
      >
        {abierto ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span style={{ fontFamily: "var(--f-display)", fontSize: 13.5, fontWeight: 700 }}>Estadísticas del diccionario</span>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: COLORS.inkSoft }}>
          ({stats.total} enlaces · {stats.sinEnlaces.length} escuela{stats.sinEnlaces.length !== 1 ? "s" : ""} todavía sin ninguno)
        </span>
      </div>
      {abierto && (
        <div style={{ background: COLORS.cardBg, borderLeft: `1px solid ${COLORS.line}`, borderRight: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}`, borderTop: "none", borderRadius: "0 0 6px 6px", padding: 16, display: "grid", gap: 16 }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>Por tipo de relación</div>
            <div style={{ display: "grid", gap: 4 }}>
              {Object.entries(RELACION_INFO).map(([nombre, info]) => {
                const n = stats.porRelacion[nombre] || 0;
                const pct = stats.total > 0 ? Math.round((n / stats.total) * 100) : 0;
                return (
                  <div key={nombre} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 150, fontFamily: FONT_MONO, fontSize: 10.5, color: info.color, flexShrink: 0 }}>{info.abrev} {nombre}</span>
                    <div style={{ flex: 1, background: COLORS.paperDark, borderRadius: 6, height: 10, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, background: info.color, height: "100%" }} />
                    </div>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, width: 42, textAlign: "right", flexShrink: 0 }}>{n} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>Por fidelidad declarada</div>
            <div style={{ display: "flex", gap: 14 }}>
              {["alta", "media", "baja"].map((f) => (
                <span key={f} style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.ink }}>
                  {f}: <strong>{stats.porFidelidad[f] || 0}</strong>
                </span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>Escuelas más conectadas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {stats.topEscuelas.map(({ e, n }) => (
                <span
                  key={e.id}
                  style={{
                    fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.onAcento,
                    background: PERSPECTIVA_COLOR[e.perspectiva] || COLORS.primary,
                    borderRadius: 12, padding: "3px 9px",
                  }}
                >
                  {e.nombre} ({n})
                </span>
              ))}
            </div>
          </div>
          {stats.sinEnlaces.length > 0 && (
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.garnet, textTransform: "uppercase", marginBottom: 6 }}>
                Todavía sin ningún enlace ({stats.sinEnlaces.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {stats.sinEnlaces.map((e) => (
                  <span
                    key={e.id}
                    style={{
                      fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.garnet,
                      border: `1px dashed ${COLORS.garnet}`, borderRadius: 12, padding: "2px 8px",
                    }}
                  >
                    {e.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Comparadores de referencia rápida (técnicas / psicopatología) ---------- */
function ComparadorCampo({ escuelas, campo, filtro, colorEtiqueta }) {
  const perspectivas = [...new Set(escuelas.map((e) => e.perspectiva))];
  const f = (filtro || "").toLowerCase();

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {perspectivas.map((persp) => {
        const color = PERSPECTIVA_COLOR[persp];
        const escuelasP = escuelas.filter((e) => e.perspectiva === persp);
        const escuelasVisibles = f
          ? escuelasP.filter(
              (e) => e.nombre.toLowerCase().includes(f) || (e[campo] || []).some((t) => t.toLowerCase().includes(f))
            )
          : escuelasP;
        if (escuelasVisibles.length === 0) return null;
        return (
          <div key={persp}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: color, display: "inline-block" }} />
              <h3 style={{ fontFamily: "var(--f-display)", fontSize: 16, margin: 0, color: COLORS.ink }}>{persp}</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 14, marginBottom: 6 }}>
              {escuelasVisibles.map((e) => (
                <div key={e.id} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{e.nombre}</div>
                  <div>
                    {(e[campo] || []).map((t, i) => (
                      <Etiqueta key={i}>
                        <span style={{ color: colorEtiqueta }}>{t}</span>
                      </Etiqueta>
                    ))}
                    {(e[campo] || []).length === 0 && (
                      <span style={{ fontFamily: "var(--f-text)", fontSize: 12, color: COLORS.inkSoft, fontStyle: "italic" }}>Sin registrar todavía.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ComparadorPsicopatologias({ escuelas, filtro }) {
  const perspectivas = [...new Set(escuelas.map((e) => e.perspectiva))];
  const f = (filtro || "").toLowerCase();

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: COLORS.aviso, border: `1px solid ${COLORS.gold}`, borderRadius: 12, padding: 12, marginBottom: 4 }}>
        <AlertTriangle size={15} color={COLORS.gold} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 12.5, color: COLORS.ink, lineHeight: 1.5 }}>
          Esta comparación pone una al lado de otra las concepciones de psicopatología <em>en los propios términos de cada escuela</em>. No implica que describan el mismo fenómeno: comparar no es igualar. Para la traducción explícita entre conceptos —con su tipo de relación y su nota de distorsión— usa el glosario.
        </p>
      </div>
      {perspectivas.map((persp) => {
        const color = PERSPECTIVA_COLOR[persp];
        const escuelasP = escuelas.filter((e) => e.perspectiva === persp);
        const escuelasVisibles = f
          ? escuelasP.filter((e) => e.nombre.toLowerCase().includes(f) || (e.psicopatologia || "").toLowerCase().includes(f))
          : escuelasP;
        if (escuelasVisibles.length === 0) return null;
        return (
          <div key={persp}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: color, display: "inline-block" }} />
              <h3 style={{ fontFamily: "var(--f-display)", fontSize: 16, margin: 0, color: COLORS.ink }}>{persp}</h3>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {escuelasVisibles.map((e) => (
                <div key={e.id} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{e.nombre}</div>
                  <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 13.5, lineHeight: 1.55, color: COLORS.ink }}>{e.psicopatologia}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Vista de grafo radial para el diccionario traslacional: el concepto
   elegido queda en el centro y sus equivalentes en otras escuelas se
   disponen alrededor, con la arista coloreada según el tipo de relación
   (recomendación interactiva: alternativa de red a la lista). No agrega
   ni quita enlaces: es una proyección visual de los mismos `nodos`
   que ya muestra la vista de lista. */
function GrafoConceptual({ centro, colorCentro, nodos, onIrA }) {
  const [activo, setActivo] = useState(null);
  if (nodos.length === 0) return null;
  const W = 640, H = Math.max(320, 110 + nodos.length * 6), CX = W / 2, CY = H / 2;
  const R = Math.min(CX, CY) - 70;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {nodos.map((n, i) => {
        const ang = (i / nodos.length) * Math.PI * 2 - Math.PI / 2;
        const nx = CX + R * Math.cos(ang);
        const ny = CY + R * Math.sin(ang);
        const esActivo = activo === i;
        return (
          <g key={n.l.id}>
            <line x1={CX} y1={CY} x2={nx} y2={ny} stroke={n.info.color} strokeWidth={esActivo ? 2.5 : 1.4} opacity={esActivo ? 0.9 : 0.5} />
            <text
              x={(CX + nx) / 2}
              y={(CY + ny) / 2 - 5}
              textAnchor="middle"
              fontFamily={FONT_MONO}
              fontSize={8.5}
              fontWeight={700}
              fill={n.info.color}
            >
              {n.info.abrev}
            </text>
          </g>
        );
      })}
      {/* nodo central */}
      <circle cx={CX} cy={CY} r={26} fill={colorCentro} stroke={COLORS.paper} strokeWidth={2.5} />
      <text x={CX} y={CY + 4} textAnchor="middle" fontFamily={FONT_SERIF} fontWeight={700} fontSize={9.5} fill={COLORS.onAcento}>
        {centro.length > 16 ? centro.slice(0, 14) + "…" : centro}
      </text>
      {/* nodos periféricos */}
      {nodos.map((n, i) => {
        const ang = (i / nodos.length) * Math.PI * 2 - Math.PI / 2;
        const nx = CX + R * Math.cos(ang);
        const ny = CY + R * Math.sin(ang);
        const esActivo = activo === i;
        return (
          <g
            key={"n" + n.l.id}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setActivo(i)}
            onMouseLeave={() => setActivo(null)}
            onClick={() => onIrA(n)}
          >
            <circle cx={nx} cy={ny} r={esActivo ? 21 : 18} fill={n.otroColor} stroke={COLORS.paper} strokeWidth={2} />
            <text x={nx} y={ny + 3.5} textAnchor="middle" fontFamily={FONT_SERIF} fontWeight={700} fontSize={8} fill={COLORS.onAcento}>
              {n.otro.nombre.length > 13 ? n.otro.nombre.slice(0, 11) + "…" : n.otro.nombre}
            </text>
            {esActivo && (
              <text x={nx} y={ny + (ny > CY ? 34 : -28)} textAnchor="middle" fontFamily={FONT_MONO} fontSize={9} fill={COLORS.ink}>
                {n.otraEscuela?.nombre || "escuela eliminada"} · fidelidad {n.l.fidelidad}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function GlosarioPorEscuela({ escuelas, enlaces, escuelaGlosario, setEscuelaGlosario, conceptoGlosario, setConceptoGlosario, filtro, tipo = "concepto" }) {
  const perspectivas = [...new Set(escuelas.map((e) => e.perspectiva))];
  const escuelaActual = escuelas.find((e) => e.id === escuelaGlosario);
  const conceptosEscuela = GLOSARIO.filter((g) => g.escuela === escuelaGlosario && g.tipo === tipo);
  const conceptoActual = conceptosEscuela.find((c) => normalizarTermino(c.termino) === normalizarTermino(conceptoGlosario));
  const color = escuelaActual ? PERSPECTIVA_COLOR[escuelaActual.perspectiva] : COLORS.primary;

  const equivalentes = conceptoActual ? enlacesDeConcepto(enlaces, escuelaGlosario, conceptoActual.termino) : [];
  const [vistaEquivalentes, setVistaEquivalentes] = useState("lista"); // "lista" | "grafo"

  const nodos = useMemo(
    () =>
      equivalentes.map((l) => {
        const otro = coincideConcepto(l.conceptoA, escuelaGlosario, conceptoActual?.termino) ? l.conceptoB : l.conceptoA;
        const otraEscuela = escuelas.find((e) => e.id === otro.escuela);
        const otroColor = otraEscuela ? PERSPECTIVA_COLOR[otraEscuela.perspectiva] : COLORS.primary;
        const info = RELACION_INFO[l.relacion] || { color: COLORS.primary, abrev: "?" };
        return { l, otro, otraEscuela, otroColor, info };
      }),
    [equivalentes, escuelaGlosario, conceptoActual, escuelas]
  );

  const escuelasConCoincidencia = useMemo(() => {
    if (!filtro) return escuelas.map((e) => e.id);
    const f = filtro.toLowerCase();
    return escuelas
      .filter(
        (e) =>
          e.nombre.toLowerCase().includes(f) ||
          GLOSARIO.some((g) => g.escuela === e.id && g.tipo === tipo && g.termino.toLowerCase().includes(f))
      )
      .map((e) => e.id);
  }, [filtro, escuelas, tipo]);

  return (
    <div className="psq-side-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
      <div>
        {perspectivas.map((persp) => {
          const pColor = PERSPECTIVA_COLOR[persp];
          const escuelasP = escuelas.filter((e) => e.perspectiva === persp && escuelasConCoincidencia.includes(e.id));
          if (escuelasP.length === 0) return null;
          return (
            <div key={persp} style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: pColor, textTransform: "uppercase", marginBottom: 4 }}>{persp}</div>
              {escuelasP.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setEscuelaGlosario(e.id)}
                  style={{
                    padding: "6px 10px",
                    marginBottom: 3,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "var(--f-display)",
                    fontSize: 12.5,
                    border: `1px solid ${escuelaGlosario === e.id ? pColor : COLORS.line}`,
                    background: escuelaGlosario === e.id ? COLORS.paperDark : COLORS.cardBg,
                  }}
                >
                  {e.nombre}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div>
        {escuelaActual && (
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <Sello color={color}>{escuelaActual.perspectiva}</Sello>
            <h3 style={{ fontFamily: "var(--f-display)", fontSize: 19, margin: "8px 0 14px" }}>{escuelaActual.nombre}</h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {conceptosEscuela.map((c, i) => (
                <span
                  key={i}
                  onClick={() => setConceptoGlosario(c.termino)}
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 11,
                    padding: "4px 9px",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: `1px solid ${normalizarTermino(conceptoGlosario) === normalizarTermino(c.termino) ? color : COLORS.line}`,
                    background: normalizarTermino(conceptoGlosario) === normalizarTermino(c.termino) ? color : COLORS.cardBg,
                    color: normalizarTermino(conceptoGlosario) === normalizarTermino(c.termino) ? COLORS.onAcento : COLORS.ink,
                  }}
                >
                  {c.termino}
                </span>
              ))}
            </div>

            {conceptoActual ? (
              <div style={{ borderTop: `1px dashed ${COLORS.line}`, paddingTop: 14 }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", color: COLORS.primary, marginBottom: 6 }}>
                  {escuelaActual.nombre} → {conceptoActual.termino}
                </div>
                <p style={{ margin: "0 0 8px", fontFamily: "var(--f-text)", fontSize: 14.5, lineHeight: 1.6, color: COLORS.ink }}>
                  {conceptoActual.definicion}
                </p>
                <div style={{ marginBottom: 16 }}><Fuente texto={conceptoActual.fuente} /></div>
                <FichaTermino concepto={conceptoActual} escuelaId={escuelaGlosario} conceptosEscuela={conceptosEscuela} protocolos={PROTOCOLOS_SEED} procedimientos={PROCEDIMIENTOS_CLINICOS} onIrAConcepto={setConceptoGlosario} glosario={GLOSARIO} escuelas={escuelas} onIrAOtro={(esc, term) => { setEscuelaGlosario(esc); setConceptoGlosario(term); }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, textTransform: "uppercase", color: COLORS.garnet }}>
                    Ver equivalentes en otras perspectivas
                  </div>
                  {nodos.length > 0 && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <Boton small variant={vistaEquivalentes === "lista" ? "default" : "ghost"} onClick={() => setVistaEquivalentes("lista")}>
                        lista
                      </Boton>
                      <Boton small variant={vistaEquivalentes === "grafo" ? "default" : "ghost"} onClick={() => setVistaEquivalentes("grafo")}>
                        <Network size={11} /> grafo
                      </Boton>
                    </div>
                  )}
                </div>
                {nodos.length === 0 ? (
                  <p style={{ fontFamily: "var(--f-text)", fontSize: 12.5, color: COLORS.inkSoft, fontStyle: "italic" }}>
                    Aún no se ha registrado un enlace traslacional para este concepto. Recuerda que, según la inconmensurabilidad popperiana, la ausencia de un equivalente registrado no implica que no pueda haberlo — solo que todavía no se ha trazado el puente con su nota de distorsión correspondiente.
                  </p>
                ) : vistaEquivalentes === "grafo" ? (
                  <GrafoConceptual
                    centro={conceptoActual.termino}
                    colorCentro={color}
                    nodos={nodos}
                    onIrA={(n) => {
                      if (!n.otraEscuela) return;
                      setEscuelaGlosario(n.otraEscuela.id);
                      setConceptoGlosario(n.otro.nombre);
                    }}
                  />
                ) : (
                  nodos.map(({ l, otro, otraEscuela, otroColor, info }) => (
                    <div key={l.id} style={{ borderLeft: `3px solid ${info.color}`, paddingLeft: 12, marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <span
                          style={{
                            fontFamily: "var(--f-mono)",
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: info.color,
                            border: `1px solid ${info.color}`,
                            borderRadius: 20,
                            padding: "2px 8px",
                          }}
                        >
                          {info.abrev} · {l.relacion}
                        </span>
                        <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13.5 }}>{otro.nombre}</span>
                        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: otroColor }}>({otraEscuela?.nombre || "escuela eliminada"})</span>
                        <span style={{ marginLeft: "auto" }}><BarraFidelidad nivel={l.fidelidad} color={info.color} /></span>
                      </div>
                      <p style={{ margin: 0, fontFamily: "var(--f-text)", fontSize: 13, lineHeight: 1.5, color: COLORS.ink }}>
                        <NotaConMenciones
                          texto={l.nota}
                          escuelaActualId={escuelaGlosario}
                          onIrAConcepto={(esc, term) => {
                            setEscuelaGlosario(esc);
                            setConceptoGlosario(term);
                          }}
                        />
                      </p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                        {otraEscuela && (
                          <Boton
                            small
                            variant="ghost"
                            onClick={() => {
                              setEscuelaGlosario(otraEscuela.id);
                              setConceptoGlosario(otro.nombre);
                            }}
                          >
                            <ChevronRight size={11} /> ir a «{otro.nombre}»
                          </Boton>
                        )}
                        <Boton
                          small
                          variant="ghost"
                          title="Copia una referencia corta a este enlace (p. ej. para citarlo en una nota)"
                          onClick={() => navigator.clipboard?.writeText(`Diccionario traslacional → ${l.id}`)}
                        >
                          <Copy size={11} /> copiar referencia
                        </Boton>
                        <Boton
                          small
                          variant="ghost"
                          title="Copia una cita completa y legible de este enlace, lista para pegar fuera de la app"
                          onClick={() =>
                            navigator.clipboard?.writeText(
                              `Según el Diccionario traslacional de esta app (enlace ${l.id}), «${conceptoGlosario}» (${escuelas.find((e) => e.id === escuelaGlosario)?.nombre || escuelaGlosario}) y «${otro.nombre}» (${otraEscuela?.nombre || "—"}) son un caso de "${l.relacion}" (fidelidad ${l.fidelidad}): ${l.nota}`
                            )
                          }
                        >
                          <Copy size={11} /> copiar cita
                        </Boton>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <VacioAviso texto="Elige un concepto de la lista de arriba para ver su definición y sus equivalentes en otras perspectivas." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   APP PRINCIPAL
   ============================================================ */
const TABS = [
  { id: "intro", label: "Introducción", icono: Home },
  { id: "buscador", label: "Buscador global", icono: Search },
  { id: "fundamentos", label: "Escuelas Psicoterapéuticas", icono: Network },
  { id: "planificador", label: "Protocolos y Técnicas", icono: ClipboardList },
  { id: "diccionario", label: "Diccionario", icono: Languages },
  { id: "comparacion", label: "Comparación", icono: Scale },
];

// Verificador de integridad "en vivo": la MISMA regla que corre dentro de la
// app (recalculada en cada cambio de estado vía useIntegridad, más abajo)
// corre también en tests/data-integrity.test.js sobre los datos semilla —
// así la app y la suite de pruebas nunca pueden desincronizarse sobre qué
// cuenta como "roto". Distingue dos niveles:
//   - `problemas`: referencias rotas de verdad (ids que no existen). Siempre
//     accionables y nunca esperables.
//   - `advertencias`: ausencias de contenido opcional (sin protocolo, sin
//     citas ampliadas) — normal en una app que se puebla por iteraciones,
//     NO se tratan como errores.
function calcularIntegridad(escuelas, enlaces, enlacesTecnicas, planes) {
  const idsEscuela = new Set(escuelas.map((e) => e.id));
  const idsClusterValidos = new Set(CONCEPTOS_TRANSVERSALES.map((c) => c.id));
  const problemas = [];
  const advertencias = [];

  function chequearColeccionEnlaces(coleccion, origenModulo) {
    coleccion.forEach((l) => {
      if (!idsEscuela.has(l.conceptoA?.escuela)) {
        problemas.push({
          tipo: "enlace_huerfano",
          id: l.id,
          escuela: null,
          modulo: origenModulo,
          detalle: `«${l.conceptoA?.nombre || "?"}» → escuela inexistente "${l.conceptoA?.escuela}"`,
        });
      }
      if (!idsEscuela.has(l.conceptoB?.escuela)) {
        problemas.push({
          tipo: "enlace_huerfano",
          id: l.id,
          escuela: null,
          modulo: origenModulo,
          detalle: `«${l.conceptoB?.nombre || "?"}» → escuela inexistente "${l.conceptoB?.escuela}"`,
        });
      }
      // clusterId debe apuntar a uno de los 21 nudos reales de
      // CONCEPTOS_TRANSVERSALES; un clusterId inventado o mal tecleado
      // dejaba el enlace invisible en el agrupador del Módulo 3 sin que
      // ningún chequeo lo detectara antes de este cambio.
      if (l.clusterId && !idsClusterValidos.has(l.clusterId)) {
        problemas.push({
          tipo: "clusterId_huerfano",
          id: l.id,
          escuela: null,
          modulo: origenModulo,
          detalle: `enlace "${l.id}" → clusterId inexistente "${l.clusterId}"`,
        });
      }
    });
  }
  chequearColeccionEnlaces(enlaces, "diccionario");
  chequearColeccionEnlaces(enlacesTecnicas, "diccionario");

  planes.forEach((p) => {
    if (!idsEscuela.has(p.escuela)) {
      problemas.push({ tipo: "plan_huerfano", id: p.id, escuela: null, modulo: "planificador", detalle: `plan "${p.id}" → escuela inexistente "${p.escuela}"` });
    }
  });

  GLOSARIO.forEach((g, i) => {
    if (!idsEscuela.has(g.escuela)) {
      problemas.push({ tipo: "glosario_huerfano", id: `glosario-${i}`, escuela: null, modulo: "diccionario", detalle: `«${g.termino}» → escuela inexistente "${g.escuela}"` });
    }
  });

  const idsVistos = new Set();
  escuelas.forEach((e) => {
    if (idsVistos.has(e.id)) {
      problemas.push({ tipo: "id_duplicado", id: e.id, escuela: e.id, modulo: "fundamentos", detalle: `id de escuela duplicado: "${e.id}"` });
    }
    idsVistos.add(e.id);

    for (const ftId of e.fundamentosTeoricos || []) {
      if (!AUTORES_TEORICOS.some((a) => a.id === ftId)) {
        problemas.push({ tipo: "autor_teorico_huerfano", id: e.id, escuela: e.id, modulo: "fundamentos", detalle: `${e.id}: fundamentosTeoricos referencia autor inexistente "${ftId}"` });
      }
    }
    if (e.notaDistincion) {
      const refs = [...e.notaDistincion.matchAll(/`([a-zA-Z0-9]+)`/g)].map((m) => m[1]);
      refs.forEach((ref) => {
        if (!idsEscuela.has(ref)) {
          problemas.push({ tipo: "notaDistincion_huerfana", id: e.id, escuela: e.id, modulo: "fundamentos", detalle: `${e.id}: notaDistincion referencia \`${ref}\` inexistente` });
        }
      });
    }

    // Advertencias por escuela: contenido opcional aún no sembrado en esta
    // iteración. No son errores; se muestran aparte y con otro color.
    if (!CITAS_AMPLIADAS[e.id]) advertencias.push({ tipo: "sin_citas", escuela: e.id, modulo: "fundamentos", detalle: `${e.nombre}: sin CITAS_AMPLIADAS` });
    if (!PROTOCOLOS_SEED[e.id]) advertencias.push({ tipo: "sin_protocolo", escuela: e.id, modulo: "fundamentos", detalle: `${e.nombre}: sin protocolo en PROTOCOLOS_SEED` });
    if (!GLOSARIO.some((g) => g.escuela === e.id)) advertencias.push({ tipo: "sin_glosario", escuela: e.id, modulo: "fundamentos", detalle: `${e.nombre}: sin entradas de glosario` });
  });

  // Chequeo inverso de fundamentosTeoricos: todo nodo de AUTORES_TEORICOS
  // debería estar citado por al menos una escuela (o ser él mismo una
  // "escuela híbrida" vía esTambienEscuelaPropia); si no, es un nodo
  // fantasma que nadie referencia y queda invisible salvo navegación manual.
  const idsAutorCitados = new Set(escuelas.flatMap((e) => e.fundamentosTeoricos || []));
  AUTORES_TEORICOS.forEach((a) => {
    if (!idsAutorCitados.has(a.id) && !a.esTambienEscuelaPropia) {
      advertencias.push({ tipo: "autor_teorico_fantasma", escuela: null, modulo: "fundamentos", detalle: `AUTORES_TEORICOS: "${a.id}" (${a.nombre}) no está citado por fundamentosTeoricos de ninguna escuela` });
    }
  });

  return { problemas, advertencias, ok: problemas.length === 0 };
}

// Pura, sin dependencias de estado de App: se declara a nivel de módulo
// (no anidada dentro de App) para poder importarla y probarla de forma
// aislada desde /tests sin tener que montar todo el componente.
function fusionarConSemilla(guardados, semilla) {
  if (!guardados) return semilla;
  const porId = new Map(semilla.map((x) => [x.id, x]));
  // Resincroniza el campo "perspectiva" (taxonomía estructural) desde la semilla más
  // reciente para cualquier escuela ya guardada, preservando el resto de sus campos
  // (que sí pueden reflejar ediciones legítimas del usuario). Esto evita que una
  // reclasificación de perspectivas hecha en el código (p. ej. separar Conductual de
  // Cognitivo) quede "atascada" mostrando la categoría antigua en sesiones ya guardadas.
  // NOTA: usada para enlaces/enlacesTecnicas, que el usuario puede crear libremente
  // (Módulo 3) y por tanto nunca deben sobrescribirse con la semilla del código.
  const actualizados = guardados.map((g) => {
    const s = porId.get(g.id);
    return s && s.perspectiva !== g.perspectiva ? { ...g, perspectiva: s.perspectiva } : g;
  });
  const idsGuardados = new Set(guardados.map((x) => x.id));
  const faltantes = semilla.filter((x) => !idsGuardados.has(x.id));
  return faltantes.length > 0 ? [...actualizados, ...faltantes] : actualizados;
}

export default function App() {
  const [tab, setTabRaw] = useState("intro");
  // Tema visual (claro / oscuro / alto contraste). COLORS es mutado
  // directamente (ver definición de TEMAS más arriba); `temaVersion` no
  // se lee en ningún sitio, solo existe para forzar el re-render de todo
  // el árbol tras la mutación — sin memoización de componentes en esta
  // app, un solo cambio de estado en la raíz basta para que las miles de
  // referencias a COLORS.algo en los hijos recojan el valor nuevo.
  const [tema, setTema] = useState("claro");
  const [, setTemaVersion] = useState(0);
  function cambiarTema(nuevo, persistir = true) {
    Object.assign(COLORS, TEMAS[nuevo] || TEMA_CLARO);
    aplicarVarsTema(nuevo);
    setTema(nuevo);
    setTemaVersion((v) => v + 1);
    if (!persistir) return;
    try {
      window.localStorage.setItem(TEMA_STORAGE_KEY, nuevo);
    } catch (e) {}
  }
  useEffect(() => {
    try {
      let guardado = window.localStorage.getItem(TEMA_STORAGE_KEY);
      if (guardado === "alto-contraste") guardado = "oscuro";
      if (guardado && TEMAS[guardado]) {
        Object.assign(COLORS, TEMAS[guardado]);
        aplicarVarsTema(guardado);
        setTema(guardado);
        setTemaVersion((v) => v + 1);
      }
    } catch (e) {}
  }, []);
  // Cada entrada del recorrido guarda no solo la pestaña (módulo) visitada,
  // sino —cuando aplica— la entidad concreta dentro de ese módulo (escuela,
  // término del glosario, protocolo), para que la orientación sea granular
  // ("Diccionario · Rumiación (c26)") y no solo a nivel de módulo
  // ("Diccionario"). `detalle` es la etiqueta legible; `restaurar` guarda
  // los datos mínimos (serializables, no funciones) para poder saltar de
  // vuelta exactamente a ese punto con el botón "atrás".
  const [historialNav, setHistorialNav] = useState([{ id: "intro", ts: Date.now(), detalle: null, restaurar: null }]);
  function setTab(id, detalle, restaurar) {
    setTabRaw(id);
    setHistorialNav((prev) => {
      const ultimo = prev[prev.length - 1];
      if (ultimo?.id === id && ultimo?.detalle === (detalle || null)) return prev;
      const nuevo = [...prev, { id, ts: Date.now(), detalle: detalle || null, restaurar: restaurar || null }];
      return nuevo.slice(-10);
    });
  }
  const [buscadorMovil, setBuscadorMovil] = useState(false);
  useEffect(() => { const h = (ev) => { window.__casoPendiente = ev.detail; if (tab !== "planificador") setTab("planificador", "Caso de práctica"); }; window.addEventListener("psn-caso", h); return () => window.removeEventListener("psn-caso", h); }, []);
  useEffect(() => { try { document.documentElement.dataset.vista = tab; } catch (e) {} }, [tab]);
  const [, setProtocolosListos] = useState(protocolosCargados());
  useEffect(() => {
    // Los protocolos pesan ~0,5 MB: se piden cuando la página ya pintó, para no competir con la primera carga.
    const pedir = () => cargarProtocolos().then(() => setProtocolosListos(true));
    const id = window.requestIdleCallback ? window.requestIdleCallback(pedir, { timeout: 2500 }) : setTimeout(pedir, 1200);
    return () => { if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(id); else clearTimeout(id); };
  }, []);
  const [escuelas, setEscuelas] = useState(ESCUELAS_SEED);
  const [enlaces, setEnlaces] = useState(ENLACES_SEED);
  const [enlacesTecnicas, setEnlacesTecnicas] = useState(ENLACES_TECNICAS_SEED);
  const [planes, setPlanes] = useState(PLANES_SEED);
  const [filtro, setFiltro] = useState("");
  const [cargado, setCargado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [definicionModal, setDefinicionModal] = useState(null);
  const [focoGlosario, setFocoGlosario] = useState(null);
  const [focoEscuela, setFocoEscuela] = useState(null);
  const [focoPlanificador, setFocoPlanificador] = useState(null);
  const [ultimaEdicion, setUltimaEdicion] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialAbierto, setHistorialAbierto] = useState(false);
  const [panelIntegridadAbierto, setPanelIntegridadAbierto] = useState(false);
  const [statsAbiertas, setStatsAbiertas] = useState(false);
  const [masOpcionesAbierto, setMasOpcionesAbierto] = useState(false);
  const [mostrarAdvertenciasIntegridad, setMostrarAdvertenciasIntegridad] = useState(false);
  // Modo estudio: interruptor global (no por módulo) para poder recorrer
  // secuencialmente con ← → el contenido del módulo activo sin perderlo al
  // cambiar de pestaña. Cada módulo que lo soporta (Perspectivas,
  // Protocolos, Diccionario) define su propia noción de "siguiente/
  // anterior" apropiada a su tipo de contenido; el interruptor en sí es
  // uno solo y vive aquí, no duplicado por módulo.
  const [modoEstudio, setModoEstudio] = useState(false);
  /* Al entrar en modo estudio la pantalla pasa al tema oscuro con un destello; al salir vuelve al tema anterior. */
  const temaPrevioRef = useRef(null);
  const primeraRef = useRef(true);
  const [destello, setDestello] = useState({ n: 0, entra: true });
  const modoPrevioRef = useRef(false);
  useEffect(() => {
    if (primeraRef.current) { primeraRef.current = false; return; }
    if (modoPrevioRef.current === modoEstudio) return;
    modoPrevioRef.current = modoEstudio;
    try { document.documentElement.dataset.estudio = modoEstudio ? "1" : "0"; } catch (e) {}
    if (modoEstudio) {
      temaPrevioRef.current = tema;
      if (tema !== "oscuro") cambiarTema("oscuro", false);
    } else if (temaPrevioRef.current) {
      cambiarTema(temaPrevioRef.current, false);
      temaPrevioRef.current = null;
    }
    setDestello((d) => ({ n: d.n + 1, entra: modoEstudio }));
  }, [modoEstudio]); // eslint-disable-line
  // Recalculado automáticamente en cada render donde cambien estos cuatro
  // estados (useMemo, no un botón "verificar" ni un intervalo): es el mismo
  // chequeo que corre en tests/data-integrity.test.js sobre los datos
  // semilla, así que la app y la suite de pruebas nunca pueden desincronizarse
  // sobre qué cuenta como "roto".
  const integridad = useMemo(() => calcularIntegridad(escuelas, enlaces, enlacesTecnicas, planes), [escuelas, enlaces, enlacesTecnicas, planes, Object.keys(PROTOCOLOS_SEED).length]);
  const prevSnapshotRef = useRef(null);
  const acabaDeCargarRef = useRef(false);
  const inputBuscadorRef = useRef(null);
  const contenidoRef = useRef(null);
  const [coincidenciasPagina, setCoincidenciasPagina] = useState({ total: 0, indice: 0, soportado: true });
  const [terminoBuscadorGlobal, setTerminoBuscadorGlobal] = useState("");

  // Buscador de cabecera: resalta coincidencias de texto EN la pantalla que
  // ya se está viendo (como Ctrl+F), en vez de solo filtrar listas. Usa la
  // CSS Custom Highlight API (sin tocar el DOM que React administra, así
  // que no hay riesgo de choque con el reconciliador) y navega entre
  // coincidencias con Enter/Shift+Enter. Si el navegador no soporta la API
  // (fallback), o si no hay ninguna coincidencia visible en este módulo, se
  // ofrece un enlace directo al Buscador global, que sí encuentra el
  // término en cualquier escuela/concepto aunque no esté en pantalla.
  useEffect(() => {
    const soportado = typeof CSS !== "undefined" && "highlights" in CSS && typeof Highlight === "function";
    if (!soportado) {
      setCoincidenciasPagina({ total: 0, indice: 0, soportado: false });
      return;
    }
    if (!filtro || filtro.trim().length < 2 || !contenidoRef.current) {
      CSS.highlights.delete("psq-buscar");
      CSS.highlights.delete("psq-buscar-actual");
      setCoincidenciasPagina({ total: 0, indice: 0, soportado: true });
      return;
    }
    const termino = filtro.trim().toLowerCase();
    const walker = document.createTreeWalker(contenidoRef.current, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement && n.parentElement.closest("script,style") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const rangos = [];
    let nodo;
    while ((nodo = walker.nextNode())) {
      const texto = nodo.textContent.toLowerCase();
      let desde = 0;
      let pos;
      while ((pos = texto.indexOf(termino, desde)) !== -1) {
        const r = new Range();
        r.setStart(nodo, pos);
        r.setEnd(nodo, pos + termino.length);
        rangos.push(r);
        desde = pos + termino.length;
      }
    }
    CSS.highlights.set("psq-buscar", new Highlight(...rangos));
    setCoincidenciasPagina((prev) => ({ total: rangos.length, indice: rangos.length ? 0 : 0, soportado: true }));
    if (rangos.length) {
      CSS.highlights.set("psq-buscar-actual", new Highlight(rangos[0]));
      rangos[0].startContainer.parentElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      CSS.highlights.delete("psq-buscar-actual");
    }
    return () => {
      CSS.highlights.delete("psq-buscar");
      CSS.highlights.delete("psq-buscar-actual");
    };
  }, [filtro, tab]);

  function irACoincidencia(direccion) {
    if (!coincidenciasPagina.total || !contenidoRef.current) return;
    const termino = filtro.trim().toLowerCase();
    const walker = document.createTreeWalker(contenidoRef.current, NodeFilter.SHOW_TEXT);
    const rangos = [];
    let nodo;
    while ((nodo = walker.nextNode())) {
      const texto = nodo.textContent.toLowerCase();
      let desde = 0;
      let pos;
      while ((pos = texto.indexOf(termino, desde)) !== -1) {
        const r = new Range();
        r.setStart(nodo, pos);
        r.setEnd(nodo, pos + termino.length);
        rangos.push(r);
        desde = pos + termino.length;
      }
    }
    if (!rangos.length) return;
    const nuevoIndice = (coincidenciasPagina.indice + direccion + rangos.length) % rangos.length;
    CSS.highlights.set("psq-buscar-actual", new Highlight(rangos[nuevoIndice]));
    rangos[nuevoIndice].startContainer.parentElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    setCoincidenciasPagina((prev) => ({ ...prev, indice: nuevoIndice }));
  }

  // Atajos de teclado para orientarse rápido en una app con mucho contenido:
  // «/» enfoca el buscador global desde cualquier pestaña (salvo si ya se
  // está escribiendo en otro campo), «Esc» cierra el modal de definición
  // abierto o, si el foco está en el buscador, limpia el filtro.
  useEffect(() => {
    function alPresionarTecla(ev) {
      const activo = document.activeElement;
      const enCampoTexto = activo && (activo.tagName === "INPUT" || activo.tagName === "TEXTAREA" || activo.isContentEditable);
      if (ev.key === "/" && !enCampoTexto) {
        ev.preventDefault();
        inputBuscadorRef.current?.focus();
      } else if (ev.key === "Escape") {
        if (definicionModal) {
          setDefinicionModal(null);
        } else if (activo === inputBuscadorRef.current) {
          setFiltro("");
          inputBuscadorRef.current?.blur();
        }
      }
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [definicionModal]);

  function registrarCambios(prevArr, currArr, tipo, nombreDe) {
    if (!prevArr) return [];
    const prevPorId = new Map(prevArr.map((x) => [x.id, x]));
    const currIds = new Set(currArr.map((x) => x.id));
    const eventos = [];
    currArr.forEach((x) => {
      const p = prevPorId.get(x.id);
      if (!p) eventos.push({ accion: "creado", nombre: nombreDe(x) });
      else if (JSON.stringify(p) !== JSON.stringify(x)) eventos.push({ accion: "editado", nombre: nombreDe(x) });
    });
    prevArr.forEach((p) => {
      if (!currIds.has(p.id)) eventos.push({ accion: "eliminado", nombre: nombreDe(p) });
    });
    return eventos.map((e) => ({ ts: Date.now(), tipo, ...e }));
  }

  function abrirDefinicion(escuelaId, termino, tipo) {
    const hit = buscarEnGlosario(escuelaId, termino);
    if (hit) {
      setDefinicionModal({ termino, tipo, escuelaId, encontrado: true, definicion: hit.definicion, funcion: hit.funcion, contextos: hit.contextos, fuente: hit.fuente });
    } else {
      setDefinicionModal({
        termino,
        tipo,
        escuelaId,
        encontrado: false,
        mensajePendiente:
          "Este término aún no tiene una definición verificada en el glosario de esta primera tanda. Se está ampliando por iteraciones: puedes pedir que se priorice este término en la próxima ronda.",
      });
    }
  }

  function irADiccionario(escuelaId, termino) {
    setFocoGlosario({ escuelaId, termino, ts: Date.now() });
    const nombreEscuela = escuelas.find((e) => e.id === escuelaId)?.nombre || escuelaId;
    setTab("diccionario", termino ? `${termino} (${nombreEscuela})` : nombreEscuela, { tipo: "diccionario", escuelaId, termino });
  }

  function irAEscuela(id) {
    setFocoEscuela({ id, ts: Date.now() });
    const nombreEscuela = escuelas.find((e) => e.id === id)?.nombre || id;
    setTab("fundamentos", nombreEscuela, { tipo: "escuela", id });
  }

  function irAProtocolo(escuelaId) {
    setFocoPlanificador({ escuelaId, ts: Date.now() });
    const nombreEscuela = escuelas.find((e) => e.id === escuelaId)?.nombre || escuelaId;
    setTab("planificador", nombreEscuela, { tipo: "protocolo", escuelaId });
  }

  // Navegación "atrás": restaura la pestaña Y la entidad concreta (escuela,
  // término, protocolo) del paso anterior del recorrido, sin volver a
  // empujar una entrada nueva al historial (evita que "atrás" genere a su
  // vez una entrada "adelante" indistinguible).
  function volverAtras() {
    setHistorialNav((prev) => {
      if (prev.length < 2) return prev;
      const recortado = prev.slice(0, -1);
      const destino = recortado[recortado.length - 1];
      setTabRaw(destino.id);
      const r = destino.restaurar;
      if (r?.tipo === "escuela") setFocoEscuela({ id: r.id, ts: Date.now() });
      else if (r?.tipo === "diccionario") setFocoGlosario({ escuelaId: r.escuelaId, termino: r.termino, ts: Date.now() });
      else if (r?.tipo === "protocolo") setFocoPlanificador({ escuelaId: r.escuelaId, ts: Date.now() });
      return recortado;
    });
  }

  // Salta directamente a cualquier paso del recorrido (no solo el inmediato
  // anterior), reconstruyendo el historial hasta ese punto.
  function irAPasoDelHistorial(indice) {
    setHistorialNav((prev) => {
      if (indice < 0 || indice >= prev.length) return prev;
      const recortado = prev.slice(0, indice + 1);
      const destino = recortado[recortado.length - 1];
      setTabRaw(destino.id);
      const r = destino.restaurar;
      if (r?.tipo === "escuela") setFocoEscuela({ id: r.id, ts: Date.now() });
      else if (r?.tipo === "diccionario") setFocoGlosario({ escuelaId: r.escuelaId, termino: r.termino, ts: Date.now() });
      else if (r?.tipo === "protocolo") setFocoPlanificador({ escuelaId: r.escuelaId, ts: Date.now() });
      return recortado;
    });
  }


function fusionarEscuelasConSemilla(guardadas, semilla) {
  if (!guardadas) return semilla;
  const porId = new Map(semilla.map((x) => [x.id, x]));
  // Si la escuela guardada NUNCA fue editada manualmente por el usuario (sin marca
  // "_editado"), se refresca por completo con la versión más reciente de la semilla
  // del código — así, actualizaciones de contenido (conceptos, técnicas, protocolos,
  // clasificación filosófica, etc.) hechas en iteraciones posteriores de la app llegan
  // a sesiones con datos ya guardados, en vez de quedar "congeladas" en la versión
  // antigua. Si la escuela SÍ fue editada por el usuario, se preservan sus ediciones
  // tal cual, solo resincronizando el campo "perspectiva" (taxonomía estructural) para
  // que una reclasificación hecha en el código no quede desactualizada.
  const actualizadas = guardadas.map((g) => {
    const s = porId.get(g.id);
    if (!s) return g;
    if (!g._editado) return s;
    return s.perspectiva !== g.perspectiva ? { ...g, perspectiva: s.perspectiva } : g;
  });
  const idsGuardadas = new Set(guardadas.map((x) => x.id));
  const faltantes = semilla.filter((x) => !idsGuardadas.has(x.id));
  return faltantes.length > 0 ? [...actualizadas, ...faltantes] : actualizadas;
}

  useEffect(() => {
    (async () => {
      const datos = await cargarDatos();
      if (datos) {
        setEscuelas(fusionarEscuelasConSemilla(datos.escuelas, ESCUELAS_SEED));
        setEnlaces(fusionarConSemilla(datos.enlaces, ENLACES_SEED));
        setEnlacesTecnicas(fusionarConSemilla(datos.enlacesTecnicas, ENLACES_TECNICAS_SEED));
        // BUGFIX: antes se hacía setPlanes(datos.planes) sin fusionar con PLANES_SEED,
        // por lo que cualquier plan nuevo añadido en el código (p. ej. pl29-pl33) quedaba
        // invisible en cualquier sesión que ya tuviera datos guardados en window.storage.
        // Se aplica el mismo criterio que en enlaces: se preservan los planes guardados
        // (el usuario puede haberlos editado o creado) y se añaden los de la semilla que
        // aún no existan en el storage.
        if (datos.planes) setPlanes(fusionarConSemilla(datos.planes, PLANES_SEED));
        if (datos.ultimaEdicion) setUltimaEdicion(datos.ultimaEdicion);
        if (datos.historial) setHistorial(datos.historial);
      }
      // Evita que el efecto de autoguardado (más abajo) se dispare inmediatamente
      // después de cargar y reescriba el storage con un timestamp "ultimaEdicion"
      // falso y entradas de historial espurias, aun cuando el usuario no cambió nada.
      acabaDeCargarRef.current = true;
      setCargado(true);
    })();
  }, []);

  useEffect(() => {
    if (!cargado) return;
    if (acabaDeCargarRef.current) {
      acabaDeCargarRef.current = false;
      prevSnapshotRef.current = { escuelas, enlaces, enlacesTecnicas, planes };
      return;
    }
    setGuardando(true);
    const t = setTimeout(async () => {
      const ahora = new Date().toISOString();
      const prev = prevSnapshotRef.current;
      const nuevos = prev
        ? [
            ...registrarCambios(prev.escuelas, escuelas, "escuela", (x) => x.nombre),
            ...registrarCambios(prev.enlaces, enlaces, "enlace conceptual", (x) => `${x.conceptoA?.nombre} ↔ ${x.conceptoB?.nombre}`),
            ...registrarCambios(prev.enlacesTecnicas, enlacesTecnicas, "enlace de técnica", (x) => `${x.conceptoA?.nombre} ↔ ${x.conceptoB?.nombre}`),
            ...registrarCambios(prev.planes, planes, "plan de sesión", (x) => x.presentacionNativa || x.id),
          ]
        : [];
      const historialActualizado = nuevos.length > 0 ? [...nuevos, ...historial].slice(0, 300) : historial;
      if (nuevos.length > 0) setHistorial(historialActualizado);
      prevSnapshotRef.current = { escuelas, enlaces, enlacesTecnicas, planes };

      const exito = await guardarDatos({ escuelas, enlaces, enlacesTecnicas, planes, ultimaEdicion: ahora, historial: historialActualizado });
      setGuardando(false);
      if (exito) {
        setUltimaEdicion(ahora);
        setMensaje("Guardado");
      } else {
        setMensaje("Error al guardar — reintenta o exporta un respaldo en JSON");
      }
      setTimeout(() => setMensaje(""), exito ? 1500 : 4000);
    }, 600);
    return () => clearTimeout(t);
  }, [escuelas, enlaces, enlacesTecnicas, planes, cargado]);

  function exportarJSON() {
    const blob = new Blob([JSON.stringify({ escuelas, enlaces, enlacesTecnicas, planes }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "psicoterapias-datos.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importarJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const datos = JSON.parse(ev.target.result);
        const camposValidos = ["escuelas", "enlaces", "enlacesTecnicas", "planes"].filter(
          (campo) => campo in datos
        );
        if (camposValidos.length === 0 || camposValidos.some((campo) => !Array.isArray(datos[campo]))) {
          setMensaje("El archivo no tiene el formato esperado de esta app.");
          setTimeout(() => setMensaje(""), 3000);
          return;
        }
        // Mismo tratamiento que al cargar desde storage: las escuelas del archivo
        // importado que el usuario nunca editó manualmente se refrescan con la
        // semilla vigente del código, para que un respaldo antiguo no reintroduzca
        // contenido desactualizado (conceptos, protocolos, clasificación filosófica).
        if (datos.escuelas) setEscuelas(fusionarEscuelasConSemilla(datos.escuelas, ESCUELAS_SEED));
        if (datos.enlaces) setEnlaces(fusionarConSemilla(datos.enlaces, ENLACES_SEED));
        if (datos.enlacesTecnicas) setEnlacesTecnicas(fusionarConSemilla(datos.enlacesTecnicas, ENLACES_TECNICAS_SEED));
        if (datos.planes) setPlanes(fusionarConSemilla(datos.planes, PLANES_SEED));
        setMensaje("Importado");
        setTimeout(() => setMensaje(""), 1500);
      } catch (err) {
        setMensaje("El archivo no es un JSON válido de esta app.");
        setTimeout(() => setMensaje(""), 3000);
      }
    };
    reader.onerror = () => {
      setMensaje("No se pudo leer el archivo.");
      setTimeout(() => setMensaje(""), 3000);
    };
    reader.readAsText(file);
    e.target.value = null;
  }

  // Borra por completo el storage y recarga desde la semilla del código (ESCUELAS_SEED,
  // ENLACES_SEED, ENLACES_TECNICAS_SEED, PLANES_SEED). Existe porque el mecanismo normal
  // de fusión con la semilla (fusionarEscuelasConSemilla / fusionarConSemilla) preserva
  // deliberadamente los datos ya guardados para no perder ediciones legítimas del
  // usuario; en sesiones muy antiguas o con datos corruptos, esto puede hacer que
  // contenido nuevo del código no se note. Este botón da una vía explícita de escape.
  async function restablecerDeFabrica() {
    const confirma = window.confirm(
      "¿Restablecer TODOS los datos a la versión de fábrica del código?\n\n" +
        "Esto borrará permanentemente cualquier escuela, enlace, plan o edición que hayas " +
        "guardado en este navegador y los reemplazará por el contenido más reciente incluido " +
        "en el archivo .jsx. Esta acción no se puede deshacer (puedes exportar tus datos antes con el botón de descarga)."
    );
    if (!confirma) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* la clave puede no existir; no es un error real */
    }
    setEscuelas(ESCUELAS_SEED);
    setEnlaces(ENLACES_SEED);
    setEnlacesTecnicas(ENLACES_TECNICAS_SEED);
    setPlanes(PLANES_SEED);
    setHistorial([]);
    setUltimaEdicion(null);
    setMensaje("Restablecido de fábrica");
    setTimeout(() => setMensaje(""), 1500);
  }

  function formatearFecha(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div
      style={{
        background: "transparent",
        minHeight: "100%", width: "100%", maxWidth: "100vw", boxSizing: "border-box",
        fontFamily: "var(--f-text)", color: COLORS.ink, textAlign: "left",
        transition: "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      <style>{`
        /* Reset defensivo: si esta app se incrusta en un proyecto que trae
           un boilerplate con centrado global (p. ej. el App.css por
           defecto de "npm create vite" trae text-align:center y el
           index.css trae place-items:center en <body>), esas reglas
           heredadas descentran y desalinean toda la app. Este bloque
           neutraliza esa herencia en el punto de entrada, sin necesidad
           de que quien despliegue la app edite manualmente esos archivos. */
        #root, body, html { text-align: left; display: block; place-items: normal; }
        * { box-sizing: border-box; }
        /* Mejoras tipográficas globales: renderizado más nítido de las
           fuentes (sobre todo notable en la serif de los párrafos largos
           de fundamentación/evidencia), interlineado base más cómodo para
           lectura extensa, y un espaciado vertical uniforme entre
           párrafos sueltos que antes dependía de si cada componente
           recordaba poner margin-bottom o no. */
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        p { line-height: 1.6; }
        p + p { margin-top: 0.5em; }
        ::selection { background: rgba(139, 105, 20, 0.25); }
        @media (max-width: 720px) {
          .psq-side-grid { grid-template-columns: 1fr !important; }
          .psq-2col-grid { grid-template-columns: 1fr !important; }
          .psq-modal { padding: 16px !important; max-height: 90vh !important; }
          .psq-cabecera-fila { flex-wrap: wrap !important; }
        }
        @media (max-width: 480px) {
          .psq-modal { padding: 12px !important; }
        }
        /* Mejoras específicas de tablet/celular: la barra de pestañas ya
           tenía overflow-x:auto, pero le faltaba inercia táctil suave
           (scroll-snap) y quedaba con "bordes duros" al desplazarse; las
           tablas de datos (protocolos, comparación) necesitan seguir
           siendo desplazables horizontalmente sin depender de que el
           usuario sepa que puede hacerlo, así que se les añade una
           sombra lateral sutil que indica que hay más contenido. */
        [role="tablist"] { scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch; }
        [role="tab"] { scroll-snap-align: start; }
        @media (max-width: 640px) {
          h2 { font-size: 18px !important; }
          table { font-size: 11.5px !important; }
        }
        @media (hover: none) {
          /* En pantallas táctiles no hay :hover real, así que los
             elementos que dependían de pasar el cursor para revelar una
             acción (p. ej. algún botón secundario) deben quedar visibles
             siempre; esta regla es un respaldo general de bajo riesgo. */
          [title]:active { opacity: 0.7; }
          /* Objetivo táctil mínimo (~40px) SOLO para los botones de zoom
             del mapa/línea de tiempo, los más pequeños y aislados de la
             app (26px en escritorio) — se amplía su área clicable real
             solo en pantallas táctiles, sin tocar ningún otro botón/chip
             del resto de la interfaz (pensados para ser compactos). */
          .psq-zoom-btn { min-width: 40px; min-height: 40px; }
        }
        /* Transiciones sutiles: entrada de contenido al cambiar de pestaña
           (remonta por el key={tab}, lo que reinicia la animación cada
           vez) y suavizado de color/fondo en tarjetas y botones al
           cambiar de tema, sin animar layout (solo opacidad/color, barato
           en rendimiento y sin producir mareo). */
        @keyframes psqFadeIn {
          from { opacity: 0; transform: translateY(14px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .psq-fade { animation: psqFadeIn 0.32s cubic-bezier(0.22, 1, 0.36, 1); }
        .psq-fade * { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
        @media (prefers-reduced-motion: reduce) {
          .psq-fade { animation: none; }
          .psq-fade * { transition: none !important; }
        }
      `}</style>
      {/* Cabecera — versión sobria: identidad + búsqueda + tema en una fila,
          cifras y controles avanzados ocultos detrás de desplegables para
          no competir visualmente con el contenido. */}
      <div className="psq-cabecera" style={{ background: COLORS.primaryDark, padding: "14px clamp(14px, 4vw, 24px)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", rowGap: 10 }}>
        <button
          onClick={() => setStatsAbiertas((v) => !v)}
          aria-expanded={statsAbiertas}
          title="Mostrar u ocultar el detalle del contenido de esta aplicación"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            textAlign: "left",
            minWidth: 0,
            flex: "1 1 auto",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontFamily: "var(--f-display)",
              fontSize: "clamp(21px, 5vw, 30px)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Psico<i style={{ color: "var(--c-gold)", fontStyle: "inherit" }}>nautas</i>
          </span>
          <ChevronDown
            size={13}
            style={{
              color: "rgba(255,255,255,0.45)",
              transform: statsAbiertas ? "rotate(180deg)" : "none",
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
          />
        </button>

        <div className="psn-cab-der" style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <button
            type="button"
            className="psn-buscar-btn"
            aria-label="Abrir el buscador de esta página"
            aria-expanded={buscadorMovil}
            onClick={() => { setBuscadorMovil((v) => !v); setTimeout(() => inputBuscadorRef.current && inputBuscadorRef.current.focus(), 30); }}
            style={{ alignItems: "center", justifyContent: "center", width: 42, height: 42, border: "none", borderRadius: "50%", color: "rgba(255,255,255,0.85)", background: buscadorMovil ? "rgba(255,255,255,0.16)" : "transparent", cursor: "pointer" }}
          >
            <Search size={18} />
          </button>
          <div className="psn-buscar" data-abierto={buscadorMovil ? "1" : "0"} style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.55)", pointerEvents: "none" }} />
            <input
              ref={inputBuscadorRef}
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  ev.preventDefault();
                  irACoincidencia(ev.shiftKey ? -1 : 1);
                }
              }}
              placeholder="Buscar en Psiconautas"
              aria-label="Buscar y resaltar coincidencias en la página actual. Atajo: tecla oblicua. Enter: siguiente, Shift+Enter: anterior."
              style={{
                padding: coincidenciasPagina.soportado && filtro.trim().length >= 2 ? "7px 64px 7px 30px" : "7px 12px 7px 30px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontFamily: "var(--f-text)",
                fontSize: 13,
                width: "min(200px, 38vw)",
                outline: "none",
              }}
              onFocus={(ev) => { ev.currentTarget.style.background = "rgba(255,255,255,0.14)"; ev.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
              onBlur={(ev) => { ev.currentTarget.style.background = "rgba(255,255,255,0.08)"; ev.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
            />
            {coincidenciasPagina.soportado && filtro.trim().length >= 2 && (
              <div style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 1 }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "rgba(255,255,255,0.65)", marginRight: 2, whiteSpace: "nowrap" }}>
                  {coincidenciasPagina.total ? `${coincidenciasPagina.indice + 1}/${coincidenciasPagina.total}` : "0"}
                </span>
                <button
                  type="button"
                  onClick={() => irACoincidencia(-1)}
                  disabled={!coincidenciasPagina.total}
                  aria-label="Coincidencia anterior en esta página"
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: coincidenciasPagina.total ? "pointer" : "default", padding: 2, opacity: coincidenciasPagina.total ? 1 : 0.35 }}
                >
                  <ChevronRight size={11} style={{ transform: "rotate(180deg)" }} />
                </button>
                <button
                  type="button"
                  onClick={() => irACoincidencia(1)}
                  disabled={!coincidenciasPagina.total}
                  aria-label="Siguiente coincidencia en esta página"
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: coincidenciasPagina.total ? "pointer" : "default", padding: 2, opacity: coincidenciasPagina.total ? 1 : 0.35 }}
                >
                  <ChevronRight size={11} />
                </button>
              </div>
            )}
          </div>
          {filtro.trim().length >= 2 && coincidenciasPagina.soportado && coincidenciasPagina.total === 0 && (
            <button
              onClick={() => { setTerminoBuscadorGlobal(filtro.trim()); setTab("buscador"); }}
              className="psq-fade-in"
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                color: "#fff",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 20,
                padding: "5px 10px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              title="No hay coincidencias visibles en este módulo — buscar en toda la aplicación"
            >
              sin resultados aquí — ver en Buscador global →
            </button>
          )}

          {modoEstudio && <span className="psn-estudio-pill" title="Modo estudio activo">● Modo estudio</span>}
          <button
            onClick={() => cambiarTema(tema === "claro" ? "oscuro" : "claro")}
            title={`Tema: ${tema}. Clic para cambiar a ${tema === "claro" ? "oscuro" : "claro"}.`}
            aria-label="Cambiar tema visual (claro / oscuro)"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 30, height: 30, border: "none", borderRadius: "50%",
              color: "rgba(255,255,255,0.8)", background: "transparent", cursor: "pointer",
            }}
            onMouseEnter={(ev) => { ev.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(ev) => { ev.currentTarget.style.background = "transparent"; }}
          >
            {tema === "claro" ? <span style={{ fontSize: 14 }}>☀︎</span> : <span style={{ fontSize: 14 }}>☾</span>}
          </button>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMasOpcionesAbierto((v) => !v)}
              aria-label="Más opciones"
              aria-expanded={masOpcionesAbierto}
              title="Más opciones"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, border: "none", borderRadius: "50%",
                color: "rgba(255,255,255,0.8)", background: masOpcionesAbierto ? "rgba(255,255,255,0.16)" : "transparent", cursor: "pointer",
              }}
              onMouseEnter={(ev) => { if (!masOpcionesAbierto) ev.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(ev) => { if (!masOpcionesAbierto) ev.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>⋯</span>
            </button>
            {masOpcionesAbierto && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 1200 }} onClick={() => setMasOpcionesAbierto(false)} />
                <div
                  className="psq-fade-in"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    zIndex: 1201,
                    background: COLORS.cardBg,
                    border: `1px solid ${COLORS.line}`,
                    borderRadius: 10,
                    boxShadow: "0 14px 34px rgba(0,0,0,0.28)",
                    minWidth: 240,
                    padding: 6,
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <MenuOpcion
                    icon={modoEstudio ? <Sello color={COLORS.gold}>on</Sello> : null}
                    label="Modo estudio"
                    detalle="Recorre el contenido con las flechas ← →"
                    onClick={() => { setModoEstudio((v) => !v); setMasOpcionesAbierto(false); }}
                    activo={modoEstudio}
                  />
                  <MenuOpcion
                    icon={<span style={{ width: 7, height: 7, borderRadius: "50%", background: integridad.ok ? STATUS_COLORS.ok : STATUS_COLORS.error, display: "inline-block" }} />}
                    label="Salud de los datos"
                    detalle={integridad.ok ? "Sin problemas detectados" : `${integridad.problemas.length} problema(s) de referencias`}
                    onClick={() => { setPanelIntegridadAbierto(true); setMasOpcionesAbierto(false); }}
                  />
                  <div style={{ height: 1, background: COLORS.line, margin: "4px 2px" }} />
                  <MenuOpcion
                    icon={<Download size={14} />}
                    label="Exportar datos a JSON"
                    onClick={() => { exportarJSON(); setMasOpcionesAbierto(false); }}
                  />
                  <label style={{ cursor: "pointer" }}>
                    <input
                      type="file"
                      accept="application/json"
                      onChange={(e) => { importarJSON(e); setMasOpcionesAbierto(false); }}
                      aria-label="Importar datos desde un archivo JSON"
                      style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
                    />
                    <span style={{ display: "block" }}>
                      <MenuOpcion icon={<Upload size={14} />} label="Importar datos desde JSON" as="span" />
                    </span>
                  </label>
                  {ultimaEdicion && (
                    <MenuOpcion
                      icon={<span style={{ fontSize: 13 }}>✎</span>}
                      label="Historial de ediciones"
                      detalle={`editado ${formatearFecha(ultimaEdicion)} · ${historial.length} cambio(s)`}
                      onClick={() => { setHistorialAbierto(true); setMasOpcionesAbierto(false); }}
                    />
                  )}
                  <div style={{ height: 1, background: COLORS.line, margin: "4px 2px" }} />
                  <MenuOpcion
                    icon={<RotateCcw size={14} color={COLORS.garnet} />}
                    label="Restablecer de fábrica"
                    detalle="Borra tus ediciones guardadas en este navegador"
                    tono={COLORS.garnet}
                    onClick={() => { restablecerDeFabrica(); setMasOpcionesAbierto(false); }}
                  />
                  <div style={{ padding: "6px 10px 2px", fontFamily: "var(--f-mono)", fontSize: 9.5, color: COLORS.inkSoft }}>
                    {guardando ? "guardando…" : mensaje || "todos los cambios se guardan automáticamente"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {destello.n > 0 && <div key={destello.n} className={"psn-estudio-flash " + (destello.entra ? "entra" : "sale")} aria-hidden="true"><span>{destello.entra ? "Modo estudio" : "Fin del modo estudio"}</span></div>}
      {statsAbiertas && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 1100 }} onClick={() => setStatsAbiertas(false)} />
          <div
            className="psn-menu-expedicion"
            role="dialog"
            aria-label="Menú"
            onKeyDown={(ev) => { if (ev.key === "Escape") setStatsAbiertas(false); }}
          >
            <p className="psn-menu-lema">Un mismo sufrimiento, siete maneras de nombrarlo.</p>
            <ul className="psn-menu-lista">
              {[
                ["intro", "Introducción", "Las siete perspectivas en una página"],
                ["fundamentos", "Escuelas", `${escuelas.length} escuelas con su ficha completa`],
                ["planificador", "Protocolos y técnicas", "Qué se hace, sesión por sesión, y con qué fuente"],
                ["diccionario", "Diccionario y traductor", `${GLOSARIO.filter((g) => g.tipo === "concepto").length} conceptos que se pueden traducir entre escuelas`],
                ["comparacion", "Comparación", "Dos escuelas frente a frente"],
                ["buscador", "Buscador global", "Todo el contenido en un solo lugar"],
              ].map(([id, nombre, detalle]) => (
                <li key={id}>
                  <button onClick={() => { setTab(id); setStatsAbiertas(false); }} className={tab === id ? "on" : ""}>
                    <strong>{nombre}</strong>
                    <span>{detalle}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="psn-menu-pie">
              <button onClick={() => { setModoEstudio(!modoEstudio); setStatsAbiertas(false); }}>{modoEstudio ? "Salir del modo estudio" : "Entrar al modo estudio"}</button>
              <button onClick={() => { setPanelIntegridadAbierto(true); setStatsAbiertas(false); }}>Salud de los datos</button>
            </div>
          </div>
        </>
      )}

      {/* Pestañas de carpeta */}
      <div style={{ position: "relative" }}>
        <div
          role="tablist"
          aria-label="Módulos de la aplicación"
          className="psq-tabs" style={{ display: "flex", background: COLORS.paperDark, borderBottom: `1px solid ${COLORS.line}`, padding: "0 12px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}
        >
        {TABS.map((t) => {
          const Icon = t.icono;
          const activo = tab === t.id;
          return (
            <div
              key={t.id}
              role="tab"
              aria-selected={activo}
              tabIndex={0}
              onClick={() => setTab(t.id)}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  setTab(t.id);
                }
              }}
              style={{
                padding: "13px 16px 11px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontFamily: "var(--f-mono)",
                fontSize: 11.5,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                borderRadius: 0,
                background: activo ? `${COLORS.primary}18` : "transparent",
                border: "none",
                borderBottom: activo ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                boxShadow: activo ? `0 10px 18px -14px ${COLORS.primary}` : "none",
                fontWeight: activo ? 700 : 500,
                color: activo ? COLORS.ink : COLORS.inkSoft,
                whiteSpace: "nowrap",
                flexShrink: 0,
                outline: "none",
              }}
              onFocus={(ev) => { ev.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}`; }}
              onBlur={(ev) => { ev.currentTarget.style.boxShadow = "none"; }}
            >
              <Icon size={13} />
              {t.label}
            </div>
          );
        })}
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 2,
            width: 28,
            background: `linear-gradient(to right, transparent, ${COLORS.paperDark})`,
            pointerEvents: "none",
          }}
        />
      </div>

      {panelIntegridadAbierto && (
        <div style={{ padding: "10px 24px", background: integridad.ok ? "#f0f7f2" : "#fbeeec", borderBottom: `1px solid ${COLORS.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: integridad.problemas.length || integridad.advertencias.length ? 8 : 0 }}>
            <span style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 13 }}>
              Salud de los datos
            </span>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: COLORS.inkSoft }}>
              recalculado en vivo tras cada cambio · {escuelas.length} escuelas · {enlaces.length + enlacesTecnicas.length} enlaces
            </span>
            <button
              onClick={() => setPanelIntegridadAbierto(false)}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: COLORS.inkSoft }}
              aria-label="Cerrar panel de salud de los datos"
            >
              <X size={13} />
            </button>
          </div>

          {integridad.problemas.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, fontWeight: 700, color: STATUS_COLORS.error, textTransform: "uppercase", marginBottom: 4 }}>
                ✗ {integridad.problemas.length} problema(s) — referencias rotas, requieren corrección
              </div>
              {integridad.problemas.map((p, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (p.escuela) irAEscuela(p.escuela);
                    else if (p.modulo === "diccionario") setTab("diccionario");
                    else if (p.modulo === "planificador") setTab("planificador");
                    setPanelIntegridadAbierto(false);
                  }}
                  style={{ fontFamily: "ui-serif,Georgia,serif", fontSize: 12, color: COLORS.ink, padding: "3px 0", cursor: "pointer", textDecoration: "underline", textDecorationColor: "rgba(184,67,61,0.35)" }}
                >
                  {p.detalle}
                </div>
              ))}
            </div>
          )}

          {integridad.advertencias.length > 0 && (
            <div>
              <div
                onClick={() => setMostrarAdvertenciasIntegridad(!mostrarAdvertenciasIntegridad)}
                style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, fontWeight: 700, color: STATUS_COLORS.advertencia, textTransform: "uppercase", marginBottom: 4, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                {mostrarAdvertenciasIntegridad ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                ⚠ {integridad.advertencias.length} advertencia(s) — contenido opcional aún no sembrado (no son errores)
              </div>
              {mostrarAdvertenciasIntegridad &&
                integridad.advertencias.map((a, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      irAEscuela(a.escuela);
                      setPanelIntegridadAbierto(false);
                    }}
                    style={{ fontFamily: "ui-serif,Georgia,serif", fontSize: 11.5, color: COLORS.inkSoft, padding: "2px 0", cursor: "pointer" }}
                  >
                    {a.detalle}
                  </div>
                ))}
            </div>
          )}

          <RefsIncompletas />

          {integridad.ok && integridad.advertencias.length === 0 && (
            <p style={{ margin: 0, fontFamily: "ui-serif,Georgia,serif", fontSize: 12.5, color: STATUS_COLORS.ok }}>
              ✓ Todas las referencias entre escuelas, enlaces, planes y glosario son válidas, y todas las escuelas tienen citas, protocolo y glosario propios.
            </p>
          )}
        </div>
      )}

      {/* Barra de orientación: antes mostraba el historial COMPLETO de la
          sesión como una lista de enlaces subrayados que se desbordaba a
          2-3 líneas ("un larguero de información insulsa"). Ahora muestra
          solo los últimos 4 pasos ÚNICOS (colapsando repeticiones
          consecutivas del mismo módulo), como chips compactos con el
          paso actual resaltado — sigue permitiendo saltar a cualquiera
          de ellos, pero cabe en una sola línea en pantallas normales. */}
      {historialNav.length > 1 && (() => {
        const pasosColapsados = [];
        historialNav.forEach((h, i) => {
          const prev = pasosColapsados[pasosColapsados.length - 1];
          if (prev && prev.h.id === h.id && prev.h.detalle === h.detalle) {
            prev.i = i; // conserva el índice más reciente de ese paso repetido
          } else {
            pasosColapsados.push({ h, i });
          }
        });
        const visibles = pasosColapsados.slice(-4);
        const hayOcultos = pasosColapsados.length > visibles.length;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 24px", background: COLORS.cardBg, borderBottom: `1px solid ${COLORS.line}`, overflowX: "auto" }}>
            <button
              onClick={volverAtras}
              title="Volver al paso anterior del recorrido"
              style={{
                display: "flex", alignItems: "center", gap: 3, flexShrink: 0,
                background: COLORS.paperDark, border: `1px solid ${COLORS.line}`, borderRadius: 20,
                padding: "3px 10px", cursor: "pointer", fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 700, color: COLORS.ink,
              }}
            >
              ‹ atrás
            </button>
            {hayOcultos && <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft, flexShrink: 0 }}>…</span>}
            {visibles.map(({ h, i }, k) => {
              const tDef = TABS.find((x) => x.id === h.id);
              const esActual = i === historialNav.length - 1;
              return (
                <span key={h.ts} style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  {k > 0 && <ChevronRight size={11} style={{ opacity: 0.35, flexShrink: 0 }} />}
                  <button
                    onClick={() => irAPasoDelHistorial(i)}
                    title={h.detalle ? `${tDef?.label || h.id} · ${h.detalle}` : tDef?.label || h.id}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                      cursor: esActual ? "default" : "pointer", border: "none",
                      background: esActual ? COLORS.paperDark : "transparent",
                      borderRadius: 14, padding: "3px 9px",
                      fontFamily: FONT_MONO, fontSize: 10.5,
                      color: esActual ? COLORS.ink : COLORS.inkSoft,
                      fontWeight: esActual ? 700 : 400,
                    }}
                  >
                    {tDef?.label || h.id}
                    {h.detalle && (
                      <span style={{ fontFamily: "var(--f-text)", fontStyle: "italic", fontSize: 9.5, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis" }}>
                        · {h.detalle}
                      </span>
                    )}
                  </button>
                </span>
              );
            })}
          </div>
        );
      })()}

      <div ref={contenidoRef} key={tab} className="psq-fade psq-hoja" style={{ padding: "26px clamp(14px, 4vw, 34px) 48px", maxWidth: 1180, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {tab === "intro" && <ModuloIntroduccion irA={setTab} modoEstudio={modoEstudio} setModoEstudio={setModoEstudio} escuelas={escuelas} onIrAEscuela={irAEscuela} enlaces={enlaces} />}
        {tab === "buscador" && (
          <ModuloBuscador
            escuelas={escuelas}
            enlaces={enlaces}
            enlacesTecnicas={enlacesTecnicas}
            planes={planes}
            onIrAEscuela={irAEscuela}
            onIrADiccionario={irADiccionario}
            irA={setTab}
            modoEstudio={modoEstudio}
            terminoInicial={terminoBuscadorGlobal}
          />
        )}
        {tab === "fundamentos" && (
          <ModuloPerspectivas
            escuelas={escuelas}
            setEscuelas={setEscuelas}
            filtro={filtro}
            setFiltro={setFiltro}
            onAbrirDefinicion={abrirDefinicion}
            onIrADiccionario={irADiccionario}
            enlaces={enlaces}
            setEnlaces={setEnlaces}
            planes={planes}
            setPlanes={setPlanes}
            focoEscuela={focoEscuela}
            integridad={integridad}
            modoEstudio={modoEstudio}
            setModoEstudio={setModoEstudio}
          />
        )}
        {tab === "planificador" && !protocolosCargados() && <p className="psn-vacio">Cargando protocolos y técnicas…</p>}
        {tab === "planificador" && protocolosCargados() && (
          <ModuloPlanificador irA={setTab} escuelas={escuelas} foco={focoPlanificador} modoEstudio={modoEstudio} setModoEstudio={setModoEstudio} onIrAEscuela={irAEscuela} enlaces={enlaces} />
        )}
        {tab === "diccionario" && (
          <ModuloDiccionario
            escuelas={escuelas}
            enlaces={enlaces}
            setEnlaces={setEnlaces}
            enlacesTecnicas={enlacesTecnicas}
            setEnlacesTecnicas={setEnlacesTecnicas}
            filtro={filtro}
            focoInicial={focoGlosario}
            onIrAEscuela={irAEscuela}
            modoEstudio={modoEstudio}
            setModoEstudio={setModoEstudio}
          />
        )}
        {tab === "comparacion" && <ModuloComparacion escuelas={escuelas} onIrAEscuela={irAEscuela} modoEstudio={modoEstudio} enlaces={enlaces} />}
      </div>

      <ModalDefinicion dato={definicionModal} onCerrar={() => setDefinicionModal(null)} onIrAProtocolo={irAProtocolo} onIrAEscuela={irAEscuela} />
      {historialAbierto && <PanelHistorial historial={historial} onCerrar={() => setHistorialAbierto(false)} />}
    </div>
  );
}

/* ============================================================
   EXPORTS NOMBRADOS PARA PRUEBAS AUTOMATIZADAS
   No cambian el comportamiento de la app (el runtime de artefactos y
   cualquier bundler estándar siguen usando el `export default` de más
   arriba); solo permiten que /tests importe los datos semilla y las
   funciones puras del módulo para verificarlos sin duplicar código ni
   reimplementar la lógica en el arnés de pruebas.
   ============================================================ */
export {
  ESCUELAS_SEED,
  ENLACES_SEED,
  ENLACES_TECNICAS_SEED,
  PLANES_SEED,
  GLOSARIO,
  AUTORES_TEORICOS,
  CITAS_AMPLIADAS,
  RELACION_INFO,
  PERSPECTIVA_COLOR,
  NOMBRE_CORTO_PERSPECTIVA,
  PERSPECTIVA_ID_POR_NOMBRE,
  PROTOCOLOS_SEED,
  TEXTOS_FUNDAMENTALES,
  SUBVARIANTES_ESCUELA,
  PROCEDIMIENTOS_CLINICOS,
  FILOSOFIA_ESCUELA,
  normalizarTermino,
  buscarEnGlosario,
  enlacesDeConcepto,
  escuelasFundamentadasPor,
  fusionarConSemilla,
  calcularIntegridad,
};
