/* Citas en APA 7 (español) a partir de las cadenas «fuente» de la aplicación.
   Una fuente se descompone en: referencia (la entrada de la lista de referencias, sin localizador),
   localizador (páginas o capítulo, que en APA pertenecen a la cita en el texto) y notas (p. ej. «edición digital»).
   Marcas de cursiva: *texto*  (títulos de libros y nombre/volumen de revistas). */

const AUT = /[A-ZÁÉÍÓÚÑ][\p{L}'’\-. ]*?,\s*(?:[A-ZÁÉÍÓÚÑ][a-z]?\.\s?-?)+(?:\s?(?:Jr\.|III))?/gu;
const MESES = "(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)";

const quita = (s) => s.replace(/\s+/g, " ").trim();

/* «Apellido, I., Apellido, J. y Apellido, K.» -> lista APA con «, y» antes del último autor. */
export function unirAutores(lista) {
  if (lista.length <= 1) return lista[0] || "";
  if (lista.length === 2) return `${lista[0]}, y ${lista[1]}`;
  return `${lista.slice(0, -1).join(", ")}, y ${lista[lista.length - 1]}`;
}

/* Extrae los autores con formato «Apellido, I. I.»; null si el texto no es una lista de personas reconocible. */
export function autoresDe(txt) {
  const t = quita(txt.replace(/\s*&\s*/g, " y ").replace(/;/g, ","));
  const m = t.match(AUT);
  if (!m) return null;
  const lista = m.map((x) => quita(x).replace(/\.\s?-/g, ".-"));
  // Todo el texto debe quedar explicado por los autores y los conectores.
  const resto = t.replace(AUT, "").replace(/[,\s.]|\by\b|\bet al\b/g, "");
  if (resto.length > 0) return null;
  return lista;
}

/* Localizadores al final: «, pp. 340», «, p. 12 (cap. 3)», «(pp. 43–46)», «cap. 4». */
const LOC = /(?:[,.;]\s*|\s+)\(?((?:[Pp]{1,2}\.\s*\d[\d–\-, y.]*|cap(?:ítulo)?s?\.\s*[\dIVXivx]+(?:[–\-]\d+)?)(?:\s*\((?:cap\.|cap[ií]tulo)[^)]*\))?)\)?\.?\s*$/;

export function parseFuente(raw) {
  let s = quita(String(raw || ""));
  const notas = [];
  // notas entre corchetes
  s = s.replace(/\s*\[([^\]]+)\]\.?/g, (_, n) => { notas.push(n.replace(/\.$/, "")); return ""; });
  // «Verificado en: X» -> la edición consultada es X
  let consultada = null;
  const v = s.match(/^(.*?)\.?\s*Verificado en:\s*(.+)$/);
  if (v) { consultada = v[2]; s = v[1]; }
  const base = consultada || s;
  // localizador final
  let loc = null;
  let cuerpo = quita(base);
  // notas entre paréntesis al final (edición digital, cita indirecta…)
  cuerpo = cuerpo.replace(/\s*\(((?:edición|cita indirecta|se cita|paginación|sin paginación|orig\.)[^)]*)\)\.?\s*$/i, (_, n) => { notas.push(n); return ""; });
  const lm = cuerpo.match(LOC);
  if (lm) { loc = quita(lm[1]).replace(/^pp?\./i, (x) => x.toLowerCase()); cuerpo = cuerpo.slice(0, lm.index).replace(/[,;\s]+$/, ""); }
  // autores y año
  const ym = cuerpo.match(/^(.*?)\s*\((\d{4}[a-z]?(?:\s?[/–-]\s?\d{4}[a-z]?)?|s\.\s?f\.)\)\.?\s*(.*)$/);
  if (!ym) return { ok: false, raw: s, notas, loc };
  let [, aut, anio, resto] = ym;
  anio = anio.replace(/\s/g, "").replace(/^s\.?f\.?$/i, "s. f.");
  // «(Eds.)» / «(Comp.)» después de los autores
  let rol = "";
  const rm = aut.match(/^(.*?)\s*\((Eds?\.|Comps?\.|Coords?\.|Dirs?\.)\)\.?\s*$/);
  if (rm) { aut = rm[1]; rol = rm[2]; }
  const lista = autoresDe(aut);
  const detalle = { anio, resto: quita(resto), loc, notas, consultada: !!consultada };
  if (!lista) return { ok: false, raw: s, ...detalle, autoresTxt: quita(aut), rol };
  return { ok: true, autores: lista, rol, ...detalle, original: consultada ? v[1] : null };
}

/* Apellidos para la cita en el texto: (Linehan, 2015), (Twohig et al., 2021), (Hycner y Jacobs, 1995). */
export function apellidos(autores) {
  const ap = autores.map((a) => a.split(",")[0]);
  if (ap.length === 1) return ap[0];
  if (ap.length === 2) return `${ap[0]} y ${ap[1]}`;
  return `${ap[0]} et al.`;
}

const PALABRAS_MIN = new Set(("the of and for in on to a an with from by at as or into about between toward towards through under over how what when why who whom is are be been it its their our your his her this that these those not no new non more most one two three first second case cases book guide manual handbook treatment treatments therapy therapies therapist therapists psychotherapy psychotherapies clinical clinician clinicians approach approaches practice practices theory theories science sciences human behavior behaviour behavioral behavioural cognitive emotion emotions emotional personality disorder disorders depression anxiety trauma change changes process processes relationship relationships family families couple couples patient patients client clients self mind body life living world research study studies model models method methods technique techniques principles foundations essentials introduction understanding using use used based focused centered centred brief short long term skills skill training development developmental dialectical radically open acceptance commitment mindfulness compassion schema psychodynamic psychoanalytic psychoanalysis analytic existential humanistic positive integrative integration eclectic systematic selection prescriptive structural strategic solution narrative social learning conditioning modification therapy's thinking thought thoughts belief beliefs rational reality inner outer great good best better care healing health mental illness wellbeing well-being happiness meaning purpose growth spiritual transpersonal consciousness states experience experiences experiential dynamic dynamics group groups children child adolescents adults adult older people persons person individual individuals interpersonal intensive advanced applied general special essential complete comprehensive practical critical clinical's its works work working worked way ways").split());
const PALABRAS_ES = /^(el|la|los|las|un|una|de|del|y|en|con|para|por|a|al|o|su|sus|que|se|como|desde|hacia|sobre|entre)$/i;

/* Pasa un título en inglés de «Title Case» a mayúscula inicial de oración (APA); respeta nombres propios y siglas. */
export function oracionIngles(t) {
  if (!/[A-Za-z]/.test(t) || !/\b(the|of|and|for|with|in)\b/i.test(t) || PALABRAS_ES.test(t.split(" ")[0]) && /\b(el|la|los|las|de|del|y)\b/i.test(t)) return t;
  const partes = t.split(/(:\s+|\?\s+|—\s*)/);
  return partes.map((p, k) => {
    if (k % 2 === 1) return p;
    return p.split(" ").map((w, i) => {
      if (/^[A-Z]{2,}$/.test(w) || /\d/.test(w)) return w;
      const bajo = w.toLowerCase().replace(/[^a-z'’-]/g, "");
      if (i === 0) return w[0].toUpperCase() + w.slice(1);
      if (/^[A-Z][a-z]/.test(w) && PALABRAS_MIN.has(bajo)) return w.toLowerCase();
      return w;
    }).join(" ");
  }).join("");
}

/* Cursiva para libros: el título hasta el primer punto que cierra el título (antes de la editorial). */
function conCursiva(resto) {
  if (!resto) return resto;
  // En capítulo de libro: «Título del capítulo. En A. Autor (Ed.), *Título del libro* (pp. 1–9). Editorial.»
  const cap = resto.match(/^(.*?\.\s+En\s+[^()]*?\((?:Eds?\.|Comps?\.|Coords?\.)\),\s*)([^().]*?)(\s*\((?:pp?\.|\d+\.ª ed\.)[^)]*\).*)$/);
  if (cap) return `${cap[1]}*${cap[2]}*${cap[3]}`;
  // Artículo: «Título. Revista, 12(3), 45–67.»
  const art = resto.match(/^(.*?\.\s+)([A-ZÁÉÍÓÚ][^.,]*?,\s*\d+(?:\(\S+\))?)(,\s*[\d–\-]+.*)$/);
  if (art) return `${art[1]}*${art[2]}*${art[3]}`;
  // Libro: «Título (2.ª ed.). Editorial.»  o «Título. Editorial.»
  const lib = resto.match(/^([^.]*?(?:[?!]|\.(?=\s+[A-ZÁÉÍÓÚ][^.]*\.?$)))?(\s*(?:\([^)]*(?:ed\.|trad\.|Trad\.)[^)]*\))*)\.?\s*(.*)$/);
  const t = resto.match(/^(.+?)(\s*(?:\((?:\d+\.ª ed\.|[^)]*[Tt]rad\.[^)]*|\d+\.ª ed\.;[^)]*)\))*)\.\s+(.+)$/);
  if (t && t[3].length < 90) return `*${t[1]}*${t[2]}. ${t[3]}`;
  void lib;
  return resto;
}

/* Referencia APA en español, con cursivas marcadas con asterisco. */
export function referenciaAPA(raw) {
  const p = parseFuente(raw);
  if (!p.ok) return { texto: p.raw, ok: false, enTexto: null, loc: p.loc || null, notas: p.notas || [] };
  const resto = conCursiva(oracionIngles(p.resto));
  const aut = unirAutores(p.autores) + (p.rol ? ` (${p.rol})` : "");
  const sinFin = (x) => (x && !/[.?!]$/.test(x) ? x + "." : x);
  const texto = sinFin(`${aut} (${p.anio}). ${resto}`.replace(/\.\.$/, ".").replace(/\s+\./g, "."));
  const en = p.rol ? null : `${apellidos(p.autores)}, ${p.anio}${p.loc ? ", " + p.loc : ""}`;
  return { texto, ok: true, enTexto: en ? `(${en})` : null, enTextoNarrativa: en ? `${apellidos(p.autores)} (${p.anio}${p.loc ? ", " + p.loc : ""})` : null, loc: p.loc || null, notas: p.notas || [] };
}

export const sinMarcas = (t) => String(t || "").replace(/\*/g, "");

/* ---------- Bibliografía generada (carga diferida) ---------- */
let BIB = null;
let PROM = null;
export function cargarBibliografia() {
  if (!PROM) PROM = import("./datos/bibliografia.js").then((m) => { BIB = m; return m; });
  return PROM;
}
export const bibliografiaLista = () => !!BIB;
export const bibliografiaModulo = () => BIB;
const h32 = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 33) + s.charCodeAt(i)) >>> 0; return h; };
const yaEsAPA = (s) => /\*/.test(s) && /\(\d{4}[a-z]?(?:\/\d{4})?\)\./.test(s);

/* Resumen listo para mostrar: referencia(s) APA, cita en el texto y localizador. */
export function citaDe(fuente) {
  const raw = String(fuente || "");
  if (BIB) {
    const e = BIB.FUENTES[h32(raw)];
    if (e) {
      const refs = e[1].map((k) => BIB.REFS[k]).filter(Boolean);
      const lm = raw.match(LOC);
      return { referencia: refs[0] || null, referencias: refs, enTexto: e[0] || null, loc: lm ? quita(lm[1]) : null, ok: true, notas: [], registrada: true };
    }
  }
  if (yaEsAPA(raw)) return { referencia: raw, referencias: [raw], enTexto: null, loc: null, ok: true, notas: [], registrada: false };
  const r = referenciaAPA(raw);
  return { referencia: r.ok ? r.texto : null, referencias: r.ok ? [r.texto] : [], enTexto: r.enTexto, loc: r.loc, ok: r.ok, notas: r.notas, registrada: false };
}
export const esIncompleta = (clave) => !!(BIB && BIB.REFS_INCOMPLETAS.includes(clave));
