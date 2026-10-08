/* Detección de temas clínicos en el texto libre de un caso.
   Se apoya en un léxico amplio (síntomas, vínculos, contextos, riesgos), tolera variantes
   coloquiales, descarta negaciones inmediatas y devuelve la evidencia encontrada para que la
   persona pueda ver por qué se detectó cada tema. No diagnostica: solo orienta la lectura. */

export const normT = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* macro = clave de TEMAS_BASE (las que usan las técnicas de MIRADAS); nociones = ids del traductor. */
export const LEXICO = [
  { id: "ansiedad", t: "Ansiedad y tensión", macro: "ansiedad", nociones: ["ansiedad", "cuerpo"], k: ["ansied", "angusti", "nervios", "inquiet", "tensa", "tenso", "preocup", "agobi", "se me aprieta", "taquicard", "palpitac", "falta de aire", "ahogo", "temblor", "mareo", "desasosiego", "sobresalt", "hipervigil"] },
  { id: "panico", t: "Crisis de pánico", macro: "ansiedad", nociones: ["ansiedad", "cuerpo"], k: ["panico", "ataque de ansiedad", "ataques de ansiedad", "crisis de angustia", "siento que me muero", "miedo a morir", "miedo a volverme loc"] },
  { id: "evitacion", t: "Evitación y fobias", macro: "ansiedad", nociones: ["ansiedad", "defensa"], k: ["fobia", "agorafobia", "evito", "evita ", "evitar", "evitacion", "no me atrevo", "no puedo salir", "no puedo subir", "miedo a salir", "miedo a volar", "miedo a conducir", "miedo a los", "miedo a la "] },
  { id: "social", t: "Ansiedad social y vergüenza", macro: "ansiedad", nociones: ["autoestima", "culpa"], k: ["timid", "fobia social", "hablar en publico", "me juzgan", "que dirán", "que diran", "me bloqueo", "quedarme en blanco", "verguenza"] },
  { id: "obsesiones", t: "Obsesiones y compulsiones", macro: "ansiedad", nociones: ["pensamiento", "ansiedad"], k: ["obsesi", "compulsi", "toc ", "ritual", "reviso", "revisar", "lavarme", "me lavo", "orden ", "ordenar", "intrusiv", "contar "] },
  { id: "rumia", t: "Preocupación y rumiación", macro: "ansiedad", nociones: ["pensamiento", "mindfulness"], k: ["rumi", "dando vueltas", "no puedo parar de pensar", "le doy vueltas", "pensamientos negativos", "pensamientos repetitivos", "catastrof", "peor escenario", "y si "] },
  { id: "animo", t: "Ánimo bajo", macro: "estado de ánimo", nociones: ["depresion", "esperanza", "motivacion"], k: ["deprim", "triste", "anhedonia", "desanim", "sin ganas", "llanto", "lloro", "apati", "vacio", "nada me gusta", "nada me interesa", "me cuesta levantarme", "cansancio", "fatiga", "sin energia", "desesperanz", "inutil", "nada importa"] },
  { id: "autocritica", t: "Autocrítica y valoración de sí", macro: "estado de ánimo", nociones: ["autoestima", "culpa"], k: ["autocritic", "no me soporto", "no valgo", "fracasad", "fracaso", "autoestima", "inferior", "perfeccion", "autoexig", "me exijo", "no soy suficiente", "no soy capaz", "me odio"] },
  { id: "culpa", t: "Culpa", macro: "estado de ánimo", nociones: ["culpa"], k: ["culpa", "remordimiento", "me arrepiento", "me castigo"] },
  { id: "ira", t: "Ira y descontrol", macro: "relaciones y personalidad", nociones: ["emocion", "conflicto"], k: ["ira ", "rabia", "enojo", "enfado", "furia", "agresiv", "explosiv", "me descontrolo", "pierdo el control", "grito", "me grita", "me gritan", "insulto"] },
  { id: "suicidio", t: "Ideación o conducta suicida", macro: "estado de ánimo", nociones: ["esperanza", "sentido"], riesgo: "suicidio", k: ["suicid", "quitarme la vida", "quiero morir", "me quiero morir", "no quiero seguir", "no quiero vivir", "acabar con todo", "desaparecer", "mejor sin mi", "no vale la pena vivir", "pensamientos de muerte"] },
  { id: "autolesion", t: "Autolesión", macro: "relaciones y personalidad", nociones: ["emocion", "defensa"], riesgo: "autolesion", k: ["autolesion", "me corto", "cortarme", "cortes en", "me hago dano", "hacerme dano", "quemarme", "me quemo", "golpearme", "me golpeo"] },
  { id: "violencia", t: "Violencia o maltrato", macro: "trauma", nociones: ["trauma", "conflicto"], riesgo: "violencia", k: ["me pega", "me pegaba", "me golpea", "me golpeaba", "maltrat", "violencia", "me amenaza", "me amenazo", "me controla", "no me deja", "me humilla", "agresion", "agredi"] },
  { id: "abuso", t: "Abuso sexual o acoso", macro: "trauma", nociones: ["trauma"], riesgo: "abuso", k: ["abuso sexual", "abusaron", "abuso de", "violacion", "violaron", "tocamientos", "acoso sexual", "me tocaba", "me forzo"] },
  { id: "trauma", t: "Trauma y reexperimentación", macro: "trauma", nociones: ["trauma"], k: ["trauma", "accidente", "flashback", "pesadilla", "revivo", "reviv", "asalto", "secuestr", "guerra", "catastrofe", "terremoto", "incendio", "atentado", "me paralic"] },
  { id: "duelo", t: "Pérdidas y duelo", macro: "duelo", nociones: ["duelo"], k: ["duelo", "falleci", "murio", "muerte de", "perdi a", "luto", "echo de menos", "extrano a", "ruptura", "divorcio", "separacion", "me dejo", "me dejaron", "perdida"] },
  { id: "pareja", t: "Pareja y sexualidad", macro: "pareja y familia", nociones: ["conflicto", "apego"], k: ["pareja", "esposo", "esposa", "marido", "novio", "novia", "matrimonio", "pelea", "discut", "infiel", "engano", "celos", "deseo sexual", "libido", "disfuncion", "erecc", "orgasmo", "relaciones sexuales"] },
  { id: "familia", t: "Familia y crianza", macro: "pareja y familia", nociones: ["apego", "conflicto"], k: ["familia", "madre", "padre", "mama", "papa", "hijo", "hija", "hermano", "hermana", "suegr", "abuel", "crianza", "adolescente", "mis padres", "en casa"] },
  { id: "soledad", t: "Soledad y aislamiento", macro: "identidad y sentido", nociones: ["apego"], k: ["soledad", "me siento solo", "me siento sola", "aislad", "me aislo", "sin amigos", "nadie me", "rechaz"] },
  { id: "dependencia", t: "Dependencia emocional", macro: "relaciones y personalidad", nociones: ["apego", "autoestima"], k: ["dependenc", "no puedo estar sin", "miedo a quedarme sol", "me aferro", "necesito que", "miedo al abandono", "abandono"] },
  { id: "personalidad", t: "Relaciones intensas e inestabilidad", macro: "relaciones y personalidad", nociones: ["emocion", "apego", "defensa"], k: ["impulsiv", "inestable", "relaciones intensas", "vacio cronico", "borderline", "personalidad", "idealizo", "devaluo", "manipul", "cambios de humor", "cambio de humor"] },
  { id: "adicciones", t: "Consumo y adicciones", macro: "adicciones", nociones: ["defensa", "motivacion"], k: ["alcohol", "bebo", "borrach", "droga", "cocaina", "marihuana", "cannabis", "consumo", "adiccion", "sustancia", "apuesta", "ludopat", "pastillas", "benzodiac", "fumar", "tabaco", "pornograf", "videojuego"] },
  { id: "alimentacion", t: "Alimentación e imagen corporal", macro: "alimentación", nociones: ["cuerpo", "autoestima"], k: ["comida", "atracon", "vomit", "purg", "peso", "anorex", "bulim", "dieta", "me veo gord", "imagen corporal", "restrinjo", "no como"] },
  { id: "sueno", t: "Sueño", macro: "ansiedad", nociones: ["sueno", "cuerpo"], k: ["insomnio", "no duermo", "duermo mal", "duermo poco", "no puedo dormir", "no logro dormir", "me cuesta dormir", "me despierto", "sueno", "pesadillas"] },
  { id: "sentido", t: "Sentido, identidad y valores", macro: "identidad y sentido", nociones: ["sentido", "self"], k: ["sentido", "identidad", "proposito", "no se quien soy", "existencial", "rumbo", "valores", "vocacion", "para que vivo", "crisis de los", "vacio existencial"] },
  { id: "espiritual", t: "Espiritualidad y experiencias intensas", macro: "identidad y sentido", nociones: ["sentido", "mindfulness"], k: ["espiritual", "dios", "meditac", "experiencia mistica", "trascend", "religi", "fe "] },
  { id: "psicosis", t: "Experiencias psicóticas o manía", macro: "psicosis", nociones: ["diagnostico"], riesgo: "psicosis", k: ["voces", "alucin", "delir", "paranoi", "psicosis", "me siguen", "me vigilan", "me persiguen", "ideas de grandeza", "grandios", "euforia", "mania", "no necesito dormir"] },
  { id: "trabajo", t: "Trabajo, estudio y estrés", macro: "ansiedad", nociones: ["motivacion", "sentido"], k: ["trabajo", "jefe", "laboral", "despido", "burnout", "quemad", "estres", "desempleo", "examen", "universidad", "rendimiento", "carga de trabajo"] },
  { id: "procrastinacion", t: "Procrastinación y hábitos", macro: "estado de ánimo", nociones: ["motivacion", "pensamiento"], k: ["procrastin", "postergo", "dejo todo para", "no logro empezar", "no puedo empezar", "me cuesta empezar", "falta de motivacion"] },
  { id: "cultura", t: "Cultura, migración y discriminación", macro: "identidad y sentido", nociones: ["cultura"], k: ["migr", "extranjer", "discrimin", "racis", "cultura", "idioma", "desarraig", "clasismo", "xenofob"] },
  { id: "genero", t: "Género y orientación sexual", macro: "identidad y sentido", nociones: ["cultura", "self"], k: ["orientacion sexual", "gay", "lesbian", "bisexual", "identidad de genero", "salir del closet", "homofob", "transfob", "persona trans", "no binari"] },
  { id: "salud", t: "Salud física y dolor", macro: "ansiedad", nociones: ["cuerpo", "sintoma"], k: ["dolor", "cronic", "enfermedad", "cancer", "diagnostico medico", "cirugia", "diabetes", "fibromialgia", "somat", "colon irritable", "cefalea", "migrana"] },
  { id: "neurodesarrollo", t: "Atención y neurodesarrollo", macro: "ansiedad", nociones: ["diagnostico"], k: ["tdah", "hiperact", "autis", "asperger", "dislexia", "no puedo concentrar", "me distraigo", "falta de atencion"] },
  { id: "infancia", t: "Infancia y escuela", macro: "pareja y familia", nociones: ["apego", "conflicto"], k: ["rabietas", "berrinche", "bullying", "acoso escolar", "colegio", "escuela", "mi hijo no", "mi hija no", "ninez", "cuando era nino", "cuando era nina"] },
];

export const RIESGOS = {
  suicidio: "Aparecen palabras ligadas a ideación o conducta suicida: evaluar riesgo (ideación, plan, medios, intentos previos, factores protectores) antes de cualquier otra intervención.",
  autolesion: "Aparecen palabras ligadas a autolesión: valorar frecuencia, gravedad y función, y la seguridad inmediata.",
  violencia: "Aparecen palabras ligadas a violencia o maltrato: priorizar seguridad, evitar técnicas que expongan a la persona a más riesgo y revisar redes de apoyo y obligaciones de reporte.",
  abuso: "Aparecen palabras ligadas a abuso o acoso sexual: priorizar seguridad y confidencialidad, no presionar para relatar, y revisar protocolos de protección y reporte.",
  psicosis: "Aparecen palabras ligadas a experiencias psicóticas o maníacas: valorar derivación y evaluación psiquiátrica antes de elegir técnicas centradas en el insight.",
};

const NEG = new Set(["no", "ni", "sin", "nunca", "jamas", "niega", "descarta", "ningun", "ninguna", "ningunos", "tampoco"]);

function negado(tokens, pos) {
  for (let i = Math.max(0, pos - 3); i < pos; i++) if (NEG.has(tokens[i])) return true;
  return false;
}

/* Devuelve temas detectados (con evidencia), riesgos, macrotemas y nociones del traductor. */
export function analiza(texto) {
  const q = " " + normT(texto) + " ";
  const tokens = q.trim().split(" ");
  const idxPalabra = (k) => {
    const kk = k.trim();
    const completa = /\s$/.test(k) || kk.length <= 3;
    const needle = " " + kk + (completa ? " " : "");
    const out = [];
    let from = 0;
    for (;;) {
      const i = q.indexOf(needle, from);
      if (i < 0) break;
      out.push(i + 1);
      from = i + 1;
    }
    return out;
  };
  const posToken = (charIdx) => q.slice(0, charIdx).trim().split(" ").filter(Boolean).length;
  const temas = [];
  const negados = [];
  LEXICO.forEach((tm) => {
    const ev = new Set();
    const ne = new Set();
    tm.k.forEach((k) => {
      idxPalabra(k).forEach((ci) => {
        const p = posToken(ci);
        const palabra = k.trim();
        if (negado(tokens, p)) ne.add(palabra);
        else ev.add(palabra);
      });
    });
    if (ev.size) temas.push({ ...tm, evidencia: [...ev].slice(0, 6), score: ev.size });
    if (ne.size) negados.push({ id: tm.id, t: tm.t, evidencia: [...ne].slice(0, 4) });
  });
  temas.sort((a, b) => b.score - a.score);
  const macros = [...new Set(temas.map((t) => t.macro))];
  const nociones = [];
  temas.forEach((t) => t.nociones.forEach((n) => { if (!nociones.includes(n)) nociones.push(n); }));
  const riesgos = [...new Set(temas.filter((t) => t.riesgo).map((t) => t.riesgo))];
  return { temas, negados, macros, nociones, riesgos };
}

const STOP = new Set("para como pero porque cuando donde desde hasta entre sobre ante este esta estos estas esto algo aunque tambien mucho mucha muchos muchas siempre nunca ahora antes despues cada todo toda todos todas tiene tienen tenia tener hacer hace hacen puede pueden poder quiere quieren dice dijo bien muy mas menos solo sido estoy estamos estan estaba eran tengo tenemos desde hacia otros otras otro otra mismo misma ellos ellas nosotros vida vez veces cosa cosas persona personas dia dias mes meses anos tiempo".split(" "));

/* Semejanza léxica entre el relato y el glosario (para casos que el léxico no cubre). */
export function semejantes(texto, glosario, esDePerspectiva, k = 3) {
  const raices = [...new Set(normT(texto).split(" ").filter((w) => w.length > 4 && !STOP.has(w)).map((w) => w.slice(0, 6)))];
  if (!raices.length) return [];
  const sc = [];
  glosario.forEach((g) => {
    if (!esDePerspectiva(g)) return;
    const t = normT(g.termino);
    const d = normT(g.definicion).slice(0, 400);
    let s = 0;
    const usados = [];
    raices.forEach((r) => {
      if (t.includes(r)) { s += 3; usados.push(r); }
      else if (d.includes(r)) { s += 1; usados.push(r); }
    });
    if (s >= 3 && usados.length >= 2) sc.push({ g, s });
  });
  sc.sort((a, b) => b.s - a.s || a.g.termino.length - b.g.termino.length);
  return sc.slice(0, k).map((x) => x.g);
}
