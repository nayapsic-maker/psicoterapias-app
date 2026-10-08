import React, { useMemo, useState, useEffect } from "react";
import { analiza, semejantes, RIESGOS } from "./Deteccion.js";
import { slugsDeAutores, AUTORES } from "./Figuras.jsx";
import { norm, unir, oraciones, Mini, COLOR_REL, barajar, recortar } from "./Funciones.jsx";

/* ============================================================
   PSICONAUTAS — funciones diferenciales (parte 2)
   Caso en 7 miradas · Traductor de lenguaje clínico · Debate simulado
   · Tarjetas de repaso (modo estudio).
   Las síntesis por perspectiva son orientativas y de redacción propia;
   el detalle verificado de cada escuela está en su ficha.
   ============================================================ */

/* ------------------------------------------------------------ */
/*  CASO CLÍNICO EN 7 MIRADAS                                   */
/* ------------------------------------------------------------ */
const T = (n, por, temas = ["*"]) => ({ n, por, temas });

export const MIRADAS = {
  humanista: {
    problema: "Una desconexión de la propia experiencia y de los valores que dan sentido.",
    mira: "La experiencia vivida de la persona, su sentido y su autenticidad.",
    concepcion:
      "El malestar se entiende como incongruencia entre lo que la persona experimenta y la imagen de sí que ha tenido que sostener para ser aceptada. Si se dan condiciones de aceptación, empatía y autenticidad, se supone una tendencia actualizante que reorganiza el self. No se busca «arreglar» un síntoma sino recuperar contacto con la propia experiencia y con lo que importa.",
    rol: "Acompañar con presencia: empatía, aceptación incondicional y congruencia, sin dirigir ni interpretar desde fuera.",
    preguntas: ["¿Qué siente esta persona que no se permite ser o decir?", "¿Qué condiciones de valía ha tenido que cumplir para sentirse aceptada?", "¿Qué sentido o valor está en juego en lo que le ocurre?", "¿Qué haría si se permitiera ser plenamente quien es?"],
    tecnicas: [
      T("Escucha reflexiva y empatía", "Crea las condiciones de aceptación y congruencia en las que la persona puede explorar su experiencia sin sentirse juzgada."),
      T("Focusing (Gendlin)", "Ayuda a simbolizar la «sensación sentida» corporal cuando hay bloqueo, vacío o emociones que no logran nombrarse.", ["ansiedad", "trauma", "identidad y sentido"]),
      T("Diálogo de sillas / silla vacía (Gestalt)", "Hace presente un vínculo o un conflicto interno no resuelto para completarlo en el aquí y ahora.", ["duelo", "pareja y familia", "relaciones y personalidad"]),
      T("Diálogo socrático y derreflexión (logoterapia)", "Orienta la atención hacia el sentido y los valores cuando el malestar se centra en el vacío o en la hiperreflexión.", ["identidad y sentido", "estado de ánimo", "duelo"]),
      T("Intención paradójica (logoterapia)", "Rompe el círculo de la ansiedad anticipatoria al desear con humor lo que se teme.", ["ansiedad"]),
      T("Entrevista motivacional", "Resuelve la ambivalencia ante el cambio evocando las razones propias de la persona, sin confrontar.", ["adicciones", "alimentación"]),
    ],
    exito: "Mayor congruencia, autenticidad y sentido; no solo menos síntomas.",
    limites: "Puede ser insuficiente, por sí sola, ante conductas de riesgo que requieren estructura o protocolos específicos.",
  },
  psicodinamica: {
    problema: "Un conflicto inconsciente y patrones relacionales que se repiten desde la historia temprana.",
    mira: "El conflicto inconsciente, las defensas y los patrones relacionales de la historia temprana.",
    concepcion:
      "El síntoma es una formación de compromiso: expresa a la vez un deseo o una necesidad y la defensa contra la angustia que provoca. Las experiencias tempranas con figuras de cuidado dejan modelos de relación internalizados que se repiten (transferencia). Entender el significado inconsciente —no solo suprimir el síntoma— permite elaborarlo y ampliar la libertad psíquica.",
    rol: "Escuchar con atención flotante, interpretar con oportunidad y sostener un vínculo donde pueda observarse lo que se repite.",
    preguntas: ["¿Qué patrón relacional se repite, y desde cuándo?", "¿Qué defensas aparecen ante la angustia?", "¿Qué se evita sentir o decir en la sesión?", "¿Qué despierta en el vínculo terapéutico (transferencia)?"],
    tecnicas: [
      T("Asociación libre e interpretación", "Permite que emerja lo evitado y que el patrón se haga consciente y elaborable."),
      T("Análisis de la transferencia", "Lo que ocurre con el terapeuta reproduce el modo de relacionarse con figuras tempranas y lo vuelve observable.", ["pareja y familia", "relaciones y personalidad", "estado de ánimo"]),
      T("Clarificación y confrontación de defensas", "Muestra cómo se evita la angustia (negación, racionalización…) para flexibilizar esas defensas.", ["ansiedad", "estado de ánimo"]),
      T("Elaboración del duelo", "Reconoce el vínculo perdido y la ambivalencia hacia él, evitando que el duelo quede detenido.", ["duelo", "estado de ánimo"]),
      T("Mentalización (Fonagy)", "Recupera la capacidad de pensar estados mentales propios y ajenos en momentos de intensa emoción.", ["relaciones y personalidad", "trauma"]),
      T("Psicoterapia dinámica breve (foco)", "Trabaja un foco conflictivo acotado en pocas sesiones cuando el tiempo o los recursos son limitados.", ["ansiedad", "estado de ánimo"]),
    ],
    exito: "Insight, elaboración del conflicto y defensas más flexibles; relaciones menos repetitivas.",
    limites: "Es un proceso largo y poco estructurado; puede ser menos adecuado en crisis agudas o cuando se necesita un cambio conductual rápido.",
  },
  sistemica: {
    problema: "Un patrón de interacción que mantiene el síntoma dentro de un sistema de relaciones.",
    mira: "El sistema: pautas de interacción, reglas, jerarquías y la función del síntoma.",
    concepcion:
      "El problema no se ubica solo en una persona sino en la red de relaciones donde aparece. El síntoma puede cumplir una función (proteger, comunicar, equilibrar) y se mantiene por circuitos de retroalimentación. Cambiar una pauta de interacción, o la forma de narrar el problema, puede transformar el sistema entero; el terapeuta forma parte de lo que observa.",
    rol: "Intervenir en el sistema —o en su lectura—: preguntar, reencuadrar, convocar a otros y cuidar la alianza con todos.",
    preguntas: ["¿Quién más participa del problema, y cómo?", "¿Qué ocurre justo antes y justo después del síntoma?", "¿Qué función podría cumplir el síntoma en la familia?", "¿Qué cambiaría, para cada miembro, si el problema desapareciera?"],
    tecnicas: [
      T("Genograma", "Mapea varias generaciones para ver patrones, lealtades y eventos críticos que organizan el presente.", ["pareja y familia", "duelo", "estado de ánimo"]),
      T("Preguntas circulares (Milán)", "Revelan diferencias y relaciones («¿quién nota primero…?») y abren nuevas hipótesis sin culpabilizar.", ["pareja y familia", "ansiedad"]),
      T("Reencuadre y connotación positiva", "Ofrece otro significado del síntoma, menos culpabilizador, que abre opciones de cambio.", ["pareja y familia", "estado de ánimo", "adicciones"]),
      T("Pregunta del milagro y excepciones (centrada en soluciones)", "Dirige la atención hacia lo que ya funciona y hacia la vida sin el problema.", ["ansiedad", "estado de ánimo", "adicciones"]),
      T("Externalización del problema (narrativa)", "Separa a la persona del problema para reescribir su historia con otras posibilidades.", ["estado de ánimo", "trauma", "alimentación", "identidad y sentido"]),
      T("Reestructuración de límites y jerarquías (estructural)", "Modifica la organización familiar cuando hay límites difusos o rígidos o coaliciones disfuncionales.", ["pareja y familia"]),
    ],
    exito: "Cambio en las pautas de interacción y en la narrativa compartida; el síntoma pierde su función.",
    limites: "Exige poder convocar al sistema; puede perder de vista la vivencia individual o la gravedad de un trastorno que también requiere tratamiento propio.",
  },
  conductual: {
    problema: "Conductas aprendidas y mantenidas por sus consecuencias y por la evitación.",
    mira: "La conducta observable y sus contingencias: antecedentes, conducta y consecuencias.",
    concepcion:
      "Lo que se llama «problema» se entiende como conducta —incluidas respuestas emocionales y cognitivas— aprendida y mantenida por sus consecuencias. La evitación suele reducir el malestar a corto plazo y perpetuarlo a largo plazo. Se trabaja con evaluación funcional, objetivos operacionalizados y medición, cambiando contingencias o entrenando repertorios nuevos.",
    rol: "Analizar funcionalmente, diseñar el entrenamiento o la exposición y medir el progreso junto con la persona.",
    preguntas: ["¿Qué conducta exactamente, con qué frecuencia, duración e intensidad?", "¿Qué la precede y qué la sigue?", "¿Qué la mantiene hoy (refuerzo, evitación)?", "¿Qué conducta alternativa se puede reforzar?"],
    tecnicas: [
      T("Análisis funcional (A-B-C)", "Identifica qué mantiene la conducta antes de intervenir y orienta qué técnica elegir."),
      T("Exposición graduada / desensibilización sistemática", "Reduce evitación y ansiedad por habituación y contracondicionamiento ante estímulos temidos.", ["ansiedad", "trauma"]),
      T("Activación conductual", "Reconecta con actividades valiosas y reforzantes cuando la inactividad mantiene el ánimo bajo.", ["estado de ánimo", "duelo"]),
      T("Entrenamiento en habilidades (asertividad, resolución de problemas)", "Adquiere el repertorio que falta para afrontar conflictos y relaciones.", ["pareja y familia", "relaciones y personalidad", "ansiedad"]),
      T("Manejo de contingencias", "Refuerza de forma sistemática la conducta meta (p. ej., abstinencia o patrón alimentario).", ["adicciones", "alimentación"]),
      T("Relajación progresiva", "Reduce la activación fisiológica que acompaña a la ansiedad y facilita la exposición.", ["ansiedad"]),
    ],
    exito: "Cambio medible en la conducta objetivo y generalización a la vida cotidiana.",
    limites: "Puede dejar de lado el significado subjetivo y relacional si se aplica de forma estrictamente técnica.",
  },
  cognitivo: {
    problema: "Interpretaciones y creencias disfuncionales que median entre la situación y la emoción.",
    mira: "Los pensamientos automáticos, las creencias y los esquemas que median la emoción y la conducta.",
    concepcion:
      "Las emociones y conductas dependen en gran medida de cómo se interpreta la situación. Los pensamientos automáticos se apoyan en creencias intermedias y esquemas nucleares formados en la historia personal. La terapia colabora empíricamente: formula hipótesis sobre cómo se mantiene el problema, las contrasta con evidencia y experimentos, y entrena habilidades de afrontamiento.",
    rol: "Colaborar de forma estructurada: psicoeducar, formular, usar el cuestionamiento guiado y asignar experimentos entre sesiones.",
    preguntas: ["¿Qué pasó por tu mente en ese momento?", "¿Qué evidencia hay a favor y en contra de ese pensamiento?", "¿Qué creencia de fondo sostiene esta reacción?", "¿Qué experimento pondría a prueba esa creencia?"],
    tecnicas: [
      T("Registro de pensamientos y reestructuración cognitiva", "Identifica pensamientos automáticos y los contrasta con la evidencia para generar alternativas más ajustadas.", ["ansiedad", "estado de ánimo", "pareja y familia"]),
      T("Experimentos conductuales", "Pone a prueba las creencias en la realidad en vez de discutirlas solo con palabras.", ["ansiedad", "estado de ánimo"]),
      T("Flecha descendente", "Va de un pensamiento automático a la creencia nuclear que lo sostiene.", ["*"]),
      T("Terapia cognitiva centrada en el trauma", "Modifica interpretaciones sobre el evento y sobre sí mismo mientras se procesa el recuerdo.", ["trauma"]),
      T("Terapia de esquemas (Young)", "Trabaja esquemas desadaptativos tempranos con técnicas cognitivas, vivenciales y de relación.", ["relaciones y personalidad", "pareja y familia"]),
      T("Terapia cognitiva basada en mindfulness", "Previene recaídas depresivas al relacionarse de otro modo con los pensamientos.", ["estado de ánimo"]),
    ],
    exito: "Reducción de síntomas con evidencia y un pensamiento más flexible y ajustado a la realidad.",
    limites: "Puede subestimar el contexto relacional e histórico, y no siempre alcanza a quien no se beneficia de un enfoque muy estructurado.",
  },
  integradora: {
    problema: "Un conjunto de factores individuales que debe formularse y tratarse a medida.",
    mira: "La formulación individualizada, los factores comunes y el ajuste del tratamiento a la persona.",
    concepcion:
      "Ninguna escuela abarca por sí sola a todas las personas. Esta mirada formula el caso con un modelo que integra varios niveles (biológico, psicológico, social, relacional), se apoya en los factores comunes de la psicoterapia (alianza, expectativas, empatía) y elige técnicas de distintas escuelas según la persona, su fase de cambio y la evidencia disponible.",
    rol: "Formular, ajustar y monitorear: combinar enfoques con criterio y verificar si funciona.",
    preguntas: ["¿En qué fase del cambio está la persona?", "¿Cómo es la alianza terapéutica hoy?", "¿Qué técnicas de distintas escuelas encajan con esta formulación?", "¿Qué evidencia respalda ese ajuste?"],
    tecnicas: [
      T("Formulación de caso integrada", "Organiza los datos en un modelo común antes de elegir técnicas, y se revisa con el progreso."),
      T("Atención a los factores comunes", "Alianza, empatía y expectativas explican gran parte del resultado en cualquier enfoque."),
      T("Modelo transteórico (etapas del cambio)", "Ajusta la intervención a la etapa en que está la persona (precontemplación, preparación, acción…).", ["adicciones", "alimentación", "estado de ánimo"]),
      T("Selección sistemática de tratamiento", "Adapta el grado de directividad y el foco según el nivel de reactancia y la gravedad.", ["relaciones y personalidad", "estado de ánimo", "psicosis"]),
      T("Evaluación multimodal (BASIC ID)", "Explora siete modalidades (conducta, afecto, sensación, imagen, cognición, relaciones, biología) para no dejar áreas fuera.", ["*"]),
      T("Retroalimentación continua del progreso", "Monitorea resultados sesión a sesión para corregir el rumbo a tiempo.", ["*"]),
    ],
    exito: "Respuesta al tratamiento, alianza sólida y ajuste continuo según la evolución.",
    limites: "El riesgo es el eclecticismo sin criterio: sin una formulación clara, se acumulan técnicas sin dirección.",
  },
  transpersonal: {
    problema: "Una desconexión del sentido y de dimensiones más amplias de la identidad.",
    mira: "La dimensión espiritual y transpersonal: estados de conciencia, sentido trascendente e integración.",
    concepcion:
      "Además de lo biográfico y lo relacional, se reconoce una dimensión espiritual o transpersonal del ser humano. Algunos malestares se leen también como crisis de sentido, desconexión de esa dimensión o dificultades para integrar experiencias no ordinarias de conciencia. El crecimiento implica integrar partes de la personalidad y abrirse a una identidad más amplia, siempre con evaluación clínica cuidadosa.",
    rol: "Acompañar y facilitar la integración, con humildad respecto de las creencias de la persona y con atención al diagnóstico diferencial.",
    preguntas: ["¿Qué lugar tienen la espiritualidad o la trascendencia en su vida?", "¿Qué experiencias de conexión o expansión ha tenido?", "¿Cómo integra experiencias no ordinarias de conciencia?", "¿Qué parte de sí quiere desarrollarse?"],
    tecnicas: [
      T("Psicosíntesis: identificación de subpersonalidades", "Ayuda a observar partes en conflicto desde un «yo» central y a integrarlas.", ["identidad y sentido", "estado de ánimo", "relaciones y personalidad"]),
      T("Meditación y atención plena", "Entrena la observación de pensamientos y emociones sin fusionarse con ellos.", ["ansiedad", "estado de ánimo", "adicciones"]),
      T("Imaginería guiada y trabajo con sueños", "Accede a material simbólico que no aparece por la vía verbal.", ["identidad y sentido", "duelo", "trauma"]),
      T("Exploración de valores y sentido espiritual", "Conecta la pérdida o el cambio con el marco de sentido de la persona.", ["identidad y sentido", "duelo"]),
      T("Respiración holotrópica (Grof)", "Moviliza material emocional profundo en estado no ordinario de conciencia; requiere criterios estrictos de selección y contraindicaciones.", ["trauma", "identidad y sentido"]),
      T("Integración de experiencias espirituales", "Ayuda a dar lugar a experiencias intensas sin patologizarlas ni pasar por alto un cuadro clínico.", ["identidad y sentido", "psicosis"]),
    ],
    exito: "Integración de la experiencia y una identidad más amplia, con mayor sentido.",
    limites: "Exige un diagnóstico diferencial cuidadoso y evidencia aún menor que otros enfoques; algunas técnicas tienen contraindicaciones importantes.",
  },
};

const TEMAS = {
  ansiedad: ["ansied", "panico", "preocup", "miedo", "fobia", "nerv", "taquicardia", "evita", "insomnio", "duerme mal"],
  "estado de ánimo": ["deprim", "triste", "anhedonia", "desanim", "sin ganas", "llanto", "culpa", "apatia", "nada importa", "sin sentido"],
  trauma: ["trauma", "abuso", "violencia", "accidente", "flashback", "pesadilla", "agresion", "maltrato"],
  duelo: ["duelo", "perdida", "falleci", "muri", "muert", "separacion"],
  "pareja y familia": ["pareja", "familia", "madre", "padre", "hijo", "hija", "hermano", "matrimonio", "conflicto familiar", "casa", "padres"],
  adicciones: ["alcohol", "droga", "consumo", "adiccion", "sustancia", "juego", "bebe"],
  alimentación: ["comida", "atracon", "peso", "anorex", "bulim", "alimenta"],
  "identidad y sentido": ["sentido", "vacio", "identidad", "proposito", "existencial", "soledad", "para que vive"],
  psicosis: ["voces", "alucin", "delirio", "paranoi", "psicosis"],
  "relaciones y personalidad": ["impulsiv", "abandono", "inestable", "relaciones intensas", "limite", "borderline", "personalidad", "autolesion"],
};

const PENDIENTES = [
  "Seguridad: ideas de muerte o autolesión, riesgo para otros, situaciones de violencia.",
  "Curso: desde cuándo, qué lo desencadenó, qué lo mejora o empeora.",
  "Funcionamiento: sueño, trabajo o estudio, vida social, autocuidado.",
  "Salud y sustancias: enfermedades, medicación, alcohol y otras drogas.",
  "Historia: tratamientos previos, eventos vitales importantes, antecedentes familiares.",
  "Contexto y recursos: red de apoyo, fortalezas, cultura y creencias de la persona.",
  "Expectativas: qué espera de la terapia y cómo sabrá que ha cambiado.",
];

const CAMPOS = [
  { k: "motivo", t: "Motivo de consulta", ph: "¿Qué lo trae a consulta, con qué intensidad y desde cuándo?" },
  { k: "historia", t: "Historia relevante", ph: "Eventos, pérdidas, experiencias tempranas, tratamientos previos…" },
  { k: "contexto", t: "Contexto y relaciones", ph: "Pareja, familia, trabajo, red de apoyo…" },
  { k: "recursos", t: "Recursos y fortalezas", ph: "¿Qué le ha ayudado? ¿Qué valora de sí?" },
  { k: "meta", t: "Qué espera de la terapia", ph: "Objetivos de la persona y cómo reconocería el cambio." },
];

export const CASOS = [
  {
    t: "Marta, 34 años", av: "marta", sub: "Ansiedad desde un ascenso",
    c: {
      motivo: "Ansiedad desde hace ocho meses, tras un ascenso. Duerme mal, evita las reuniones y se critica por «no estar a la altura». Tiene palpitaciones antes de presentar.",
      historia: "Su padre era muy exigente; siempre sintió que debía ganarse el cariño con logros. En la adolescencia tuvo un periodo de perfeccionismo con notas muy altas.",
      contexto: "Vive con su pareja, con quien discute más y se aísla. Mantiene contacto semanal con su madre, que la compara con su hermana.",
      recursos: "Muy responsable, buena relación con una amiga cercana, hace deporte dos veces por semana.",
      meta: "Quiere dejar de sentir que «va a fallar» y poder disfrutar del trabajo sin agotarse.",
    },
  },
  {
    t: "Familia Rojas", av: "rojas", ancho: true, sub: "Adolescente que dejó el colegio",
    c: {
      motivo: "Los padres traen a Daniel, de 15 años, que dejó de ir al colegio y pasa el día en su habitación, jugando en línea. La madre habla por él y el padre casi no interviene.",
      historia: "Hace un año falleció el abuelo materno, con quien Daniel tenía mucho vínculo. Antes era buen alumno y tocaba la guitarra.",
      contexto: "Los padres discuten poco pero con tensión; la madre sostiene la casa y el padre trabaja viajando. Hay una hermana menor, que «hace de mediadora».",
      recursos: "Daniel es inteligente y creativo; la hermana lo busca; la familia consulta junta.",
      meta: "Los padres quieren que vuelva al colegio; Daniel dice que quiere «que lo dejen en paz».",
    },
  },
  {
    t: "Andrés, 47 años", av: "andres", sub: "Pérdida de empleo y vacío",
    c: {
      motivo: "Perdió su empleo hace seis meses. Siente vacío y falta de sentido, bebe más de lo habitual y repite que «ya nada importa». Duerme poco.",
      historia: "Siempre se definió por su trabajo. Se divorció hace tres años. Su padre falleció cuando tenía 20 y no pudo hablar de ello.",
      contexto: "Vive solo; ve poco a sus hijos adolescentes. Evita a sus antiguos compañeros por vergüenza.",
      recursos: "Fue un buen profesional, le gusta caminar y mantiene un amigo de la infancia.",
      meta: "Quisiera entender «para qué vive» y recuperar el vínculo con sus hijos.",
    },
  },
  {
    t: "Lucía, 19 años", av: "lucia", sub: "Autoexigencia y atracones",
    c: {
      motivo: "Estudiante universitaria de segundo año. Desde hace seis meses tiene atracones nocturnos seguidos de culpa y de restricción al día siguiente. Se siente «a punto de explotar» en época de exámenes.",
      historia: "Siempre fue la mejor de su clase y se sentía valorada por sus notas. A los 14 años hizo una dieta estricta tras un comentario sobre su cuerpo. No ha tenido tratamientos previos.",
      contexto: "Vive en una residencia lejos de su familia. Habla a diario con su madre, que le pregunta por sus notas y su peso. Tiene pocas amistades en la ciudad nueva.",
      recursos: "Es disciplinada, creativa (dibuja) y tiene una compañera de cuarto que la apoya.",
      meta: "Quiere dejar de sentir que pierde el control con la comida y vivir los estudios con más calma.",
    },
  },
  {
    t: "Rosa, 68 años", av: "rosa", sub: "Duelo y soledad",
    c: {
      motivo: "Enviudó hace ocho meses. Llora con frecuencia, dejó de ir al club de lectura y dice que «ya no tiene a quién cuidar». Duerme mal y ha perdido el apetito.",
      historia: "Estuvo casada 42 años y cuidó a su esposo durante una enfermedad larga. Fue maestra y se jubiló hace cinco años. Hace dos años perdió a su hermana.",
      contexto: "Vive sola. Su hijo vive en otro país y la llama los domingos; una vecina la visita a veces. Se siente una carga para los demás.",
      recursos: "Le gusta leer, tiene fe, recuerda con cariño muchas anécdotas de su vida y cuida un pequeño huerto.",
      meta: "Quiere sentirse menos sola y encontrar algo que le dé sentido sin su esposo.",
    },
  },
];

const BASE_IMG = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) || "/";
export const fotoCaso = (av) => `${BASE_IMG}img/casos/${av}.jpg`;

/* Galería de casos para practicar (cabecera de Protocolos y Técnicas). */
export function GaleriaCasos() {
  const abrir = (i) => window.dispatchEvent(new CustomEvent("psn-caso", { detail: i }));
  return (
    <aside className="psn-galeria psn-galeria-casos" aria-label="Casos para practicar">
      <span className="psn-galeria-titulo">Casos para practicar · toca uno para leerlo desde las 7 perspectivas</span>
      <ul>
        {CASOS.map((c, i) => (
          <li key={c.t}>
            <button onClick={() => abrir(i)} title={`Abrir el caso: ${c.t}`}>
              <img className={c.ancho ? "ancho" : ""} src={fotoCaso(c.av)} alt={`Retrato de ${c.t}`} width={c.ancho ? 110 : 64} height="64" loading="lazy" />
              <span>
                <strong>{c.t}</strong>
                <small>{c.sub}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function CasoSieteMiradas({ escuelas, perspectivas, colorDe, onIrAEscuela, idDe = () => null, modoEstudio = false, nudos = [], glosario = [] }) {
  const vacio = { motivo: "", historia: "", contexto: "", recursos: "", meta: "" };
  const [campos, setCampos] = useState(vacio);
  const [abierto, setAbierto] = useState(null);
  const [activo, setActivo] = useState(null);
  const ref = React.useRef(null);
  useEffect(() => {
    const h = (ev) => {
      const c = CASOS[ev.detail];
      if (!c) return;
      setCampos(c.c);
      setActivo(ev.detail);
      setAbierto(null);
      const d = ref.current && ref.current.closest("details");
      if (d) d.open = true;
      setTimeout(() => ref.current && ref.current.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    };
    window.addEventListener("psn-caso", h);
    return () => window.removeEventListener("psn-caso", h);
  }, []);
  const texto = Object.values(campos).join(" ");
  const q = norm(texto);
  const det = useMemo(() => analiza(texto), [texto]);
  const temasBase = Object.entries(TEMAS).filter(([, ks]) => ks.some((k) => q.includes(k))).map(([t]) => t);
  const temas = [...new Set([...temasBase, ...det.macros])];
  const porEscuela = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e])), [escuelas]);
  const conceptosDe = (p) => {
    const out = [];
    det.nociones.slice(0, 6).forEach((n) => {
      const nodo = nudos.find((x) => x.id === NOCION_NODO[n]);
      const y = nodo && nodo.porPerspectiva.find((z) => idDe(z.perspectiva) === p.id);
      if (y && !out.some((o) => o.termino === y.termino)) out.push({ ...y, nocion: nodo.nombre });
    });
    if (out.length < 2 && glosario.length) {
      semejantes(texto, glosario, (g) => { const E = porEscuela[g.escuela]; return E && idDe(E.perspectiva) === p.id && g.tipo !== "escuela"; }, 3 - out.length)
        .forEach((g) => { if (!out.some((o) => o.termino === g.termino)) out.push({ escuela: g.escuela, termino: g.termino, definicion: g.definicion, nocion: "semejanza con tu relato" }); });
    }
    return out.slice(0, 4);
  };
  const palabras = [...new Set(q.split(" ").filter((w) => w.length > 4))];
  const completos = Object.values(campos).filter((v) => v.trim().length > 10).length;
  const sugerencias = (p) =>
    escuelas
      .filter((e) => e.perspectiva === p.nombre || idDe(e.perspectiva) === p.id)
      .map((e) => {
        const t = norm([e.nombre, unir(e.psicopatologia), unir(e.presentaciones), unir(e.conceptos), unir(e.tecnicas)].join(" "));
        return { e, sc: palabras.reduce((s, w) => s + (t.includes(w.slice(0, 6)) ? 1 : 0), 0) };
      })
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 3);
  const tecnicasOrdenadas = (id) => {
    const lista = MIRADAS[id].tecnicas.map((t) => ({ ...t, encaja: t.temas.filter((x) => temas.includes(x)) }));
    return lista.sort((a, b) => b.encaja.length - a.encaja.length).slice(0, 5);
  };
  return (
    <section className="psn-caso" ref={ref}>
      <p className="psn-intro">
        Escribe o elige un caso (ficticio o anonimizado) y completa los campos que quieras: cuanto más material, más fino el análisis. La app lo lee desde cada una de las siete perspectivas: qué problema ve, cómo lo concibe, qué preguntaría, qué técnicas usaría y por qué, y qué escuelas revisar primero.
      </p>
      <div className="psn-caso-ejemplos">
        {CASOS.map((c, i) => (
          <button key={c.t} className={activo === i ? "on" : ""} onClick={() => { setCampos(c.c); setActivo(i); setAbierto(null); }}>
            <img src={fotoCaso(c.av)} alt="" width="26" height="26" style={{ objectFit: "cover" }} /> {c.t}
          </button>
        ))}
        <button onClick={() => { setCampos(vacio); setAbierto(null); setActivo(null); }}>Limpiar</button>
      </div>
      <div className="psn-caso-campos">
        {CAMPOS.map((c) => (
          <label key={c.k}>
            <span>{c.t}</span>
            <textarea value={campos[c.k]} onChange={(e) => setCampos({ ...campos, [c.k]: e.target.value })} rows={c.k === "motivo" ? 4 : 3} placeholder={c.ph} />
          </label>
        ))}
      </div>
      {det.riesgos.length > 0 && (
        <div className="psn-riesgo" role="alert">
          <strong>Señales de riesgo en el texto</strong>
          <ul>{det.riesgos.map((r) => <li key={r}>{RIESGOS[r]}</li>)}</ul>
        </div>
      )}
      {det.temas.length > 0 && (
        <div className="psn-temas">
          <span>Lo que se detectó en tu texto:</span>
          {det.temas.slice(0, 12).map((t) => (
            <span key={t.id} className="psn-chip" title={"Palabras: " + t.evidencia.join(", ")}>
              {t.t}
              <em>{t.evidencia.slice(0, 2).join(" · ")}</em>
            </span>
          ))}
          {det.negados.length > 0 && (
            <small>El texto niega o descarta: {det.negados.map((n) => n.t.toLowerCase()).join(", ")}.</small>
          )}
        </div>
      )}
      {det.temas.length === 0 && texto.trim().length > 80 && (
        <p className="psn-temas psn-temas-vacio">
          No reconocí temas clínicos habituales en este relato. Aun así, abajo verás conceptos del diccionario que se parecen a tus palabras; si añades síntomas, vínculos, hechos recientes o contexto, el análisis se afina.
        </p>
      )}
      {completos >= 1 && texto.trim().length > 25 && (
        <>
          {activo !== null && CASOS[activo] && (
            <div className="psn-caso-cab">
              <img className={CASOS[activo].ancho ? "ancho" : ""} src={fotoCaso(CASOS[activo].av)} alt={`Retrato de ${CASOS[activo].t}`} width={CASOS[activo].ancho ? 200 : 84} height={CASOS[activo].ancho ? 100 : 84} />
              <div>
                <strong>{CASOS[activo].t}</strong>
                <span>{CASOS[activo].sub}</span>
              </div>
            </div>
          )}
          <h5 className="psn-sub-h">Un mismo caso, siete problemas distintos</h5>
          <ul className="psn-resumen">
            {perspectivas.map((p) => (MIRADAS[p.id] ? (
              <li key={p.id} style={{ "--pc": colorDe(p.nombre) }}>
                <b>{p.nombre}</b>
                <span>{MIRADAS[p.id].problema}</span>
              </li>
            ) : null))}
          </ul>
          <div className="psn-miradas">
            {perspectivas.map((p) => {
              const m = MIRADAS[p.id];
              if (!m) return null;
              const col = colorDe(p.nombre);
              const abre = abierto === p.id;
              return (
                <article key={p.id} className={abre ? "on" : ""} style={{ "--pc": col }}>
                  <button className="psn-mirada-cab" onClick={() => setAbierto(abre ? null : p.id)} aria-expanded={abre}>
                    <h4>{p.nombre}</h4>
                    <span>{m.mira}</span>
                  </button>
                  {abre && (
                    <div className="psn-mirada-cuerpo">
                      <h5>Cómo lo concibe</h5>
                      <p>{m.concepcion}</p>
                      <h5>Rol del terapeuta</h5>
                      <p>{m.rol}</p>
                      {conceptosDe(p).length > 0 && (
                        <>
                          <h5>Conceptos de esta perspectiva que dialogan con tu caso</h5>
                          <ul className="psn-conc">
                            {conceptosDe(p).map((c) => (
                              <li key={c.termino}>
                                <button onClick={() => onIrAEscuela(c.escuela)} title="Abrir la escuela">{c.termino}</button>
                                <em>{c.nocion}</em>
                                <span>{String(c.definicion).split(" (")[0].slice(0, 170)}{String(c.definicion).length > 170 ? "…" : ""}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <h5>Preguntas que haría</h5>
                      <ul>{m.preguntas.map((x) => <li key={x}>{x}</li>)}</ul>
                      <h5>Técnicas que usaría, y por qué</h5>
                      <ul className="psn-tec">
                        {tecnicasOrdenadas(p.id).map((t) => (
                          <li key={t.n}>
                            <strong>{t.n}</strong>
                            {t.encaja.length > 0 && <em>encaja con: {t.encaja.join(", ")}</em>}
                            <span>{t.por}</span>
                          </li>
                        ))}
                      </ul>
                      <h5>Qué buscaría lograr</h5>
                      <p>{m.exito}</p>
                      <h5>Qué podría pasar por alto</h5>
                      <p>{m.limites}</p>
                      <h5>Escuelas para revisar primero</h5>
                      <div className="psn-mirada-esc">
                        {sugerencias(p).map(({ e }) => (
                          <button key={e.id} onClick={() => onIrAEscuela(e.id)}>{e.nombre}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          {modoEstudio && <RetoACiegas perspectivas={perspectivas} colorDe={colorDe} />}
          <h5 className="psn-sub-h">Para completar el caso, convendría preguntar</h5>
          <ul className="psn-pend">{PENDIENTES.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="psn-aviso">Ejercicio de estudio: no sustituye el juicio clínico, el diagnóstico ni la supervisión. Las preguntas, técnicas y metas sintetizan el enfoque general de cada perspectiva (redacción propia); el detalle verificado de cada escuela está en su ficha.</p>
        </>
      )}
    </section>
  );
}


/* Modo estudio: une cada formulación del problema con la perspectiva que la haría. */
function RetoACiegas({ perspectivas, colorDe }) {
  const items = useMemo(() => barajar(perspectivas.filter((p) => MIRADAS[p.id]).map((p) => ({ id: p.id, nombre: p.nombre, txt: MIRADAS[p.id].problema }))), [perspectivas]);
  const [resp, setResp] = useState({});
  const [ver, setVer] = useState(false);
  const aciertos = items.filter((x) => resp[x.id] === x.nombre).length;
  return (
    <div className="psn-ciegas">
      <h5 className="psn-sub-h">Modo estudio · reto a ciegas</h5>
      <p className="psn-nota">Cada línea es cómo una perspectiva formularía «el problema» de este caso. ¿Cuál es cuál?</p>
      {items.map((x) => (
        <div key={x.id} className="psn-ciegas-fila" style={{ "--pc": ver ? colorDe(x.nombre) : "var(--c-ink)" }}>
          <span>{x.txt}</span>
          <select value={resp[x.id] || ""} onChange={(e) => setResp({ ...resp, [x.id]: e.target.value })} disabled={ver}>
            <option value="">— perspectiva —</option>
            {perspectivas.map((p) => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
          </select>
          {ver && <b className={resp[x.id] === x.nombre ? "ok" : "mal"}>{resp[x.id] === x.nombre ? "✓" : `✗ era ${x.nombre}`}</b>}
        </div>
      ))}
      <div className="psn-ciegas-acc">
        <button className="psn-btn psn-btn-primario" onClick={() => setVer(true)} disabled={ver || Object.keys(resp).length < items.length}>Comprobar</button>
        {ver && <span className="psn-chip">{aciertos}/{items.length}</span>}
        {ver && <button className="psn-btn" onClick={() => { setResp({}); setVer(false); }}>Reintentar</button>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/*  TRADUCTOR DE LENGUAJE CLÍNICO                               */
/* ------------------------------------------------------------ */
const ORDEN = ["humanista", "psicodinamica", "sistemica", "conductual", "cognitivo", "integradora", "transpersonal"];
const N = (id, clave, nombre, ...f) => ({ id, claves: clave.split("|"), nombre, f });
const NOCIONES = [
  N("ansiedad", "ansied|angustia|miedo|panico|fobia", "Ansiedad",
    "Señal de que la experiencia no se vive con congruencia, o de que la libertad y la finitud abruman; se acompaña más que se corrige.",
    "Angustia-señal ante un peligro interno (impulso, conflicto) que activa defensas; se explora qué se teme sentir.",
    "Respuesta del sistema: ¿a qué relación o pauta protege? Se observa quién se alarma y cómo reacciona el entorno.",
    "Respuesta condicionada de miedo mantenida por evitación (refuerzo negativo); se trata con exposición graduada.",
    "Consecuencia de interpretar las situaciones como amenazantes (catastrofización); se contrastan esas predicciones.",
    "Se formula según factores mantenedores, etapa y preferencias; combina psicoeducación, exposición y trabajo cognitivo.",
    "Puede señalar resistencia a un cambio de identidad o una crisis de sentido; se acompaña con presencia y observación del yo."),
  N("depresion", "depres|deprim|tristeza|animo bajo|anhedonia|melanc|desanimo", "Depresión / ánimo bajo",
    "Pérdida de contacto con la propia valía y con el sentido; se busca recuperar la autenticidad y los valores.",
    "Pérdida de objeto con hostilidad vuelta contra sí mismo; autocrítica y culpa severas.",
    "Síntoma que ocurre dentro de relaciones: qué función cumple y cómo se reorganiza la familia o la pareja alrededor.",
    "Baja tasa de refuerzo positivo y evitación; se reactiva con activación conductual.",
    "Tríada cognitiva negativa (yo, mundo, futuro) y distorsiones del pensamiento; se reestructuran.",
    "Se evalúan factores biológicos, psicológicos y sociales; la técnica depende de la gravedad y de la respuesta.",
    "Puede vivirse como crisis de sentido; se explora esa dimensión sin dejar de hacer evaluación clínica."),
  N("sintoma", "sintoma|malestar|problema", "Síntoma",
    "Expresión de una experiencia que no encuentra espacio; tiene sentido personal.",
    "Formación de compromiso entre deseo y defensa; tiene un significado inconsciente.",
    "Comunicación dentro de un sistema; cumple una función en las pautas de interacción.",
    "Conducta o respuesta aprendida, mantenida por sus consecuencias.",
    "Efecto de pensamientos y creencias disfuncionales sobre la emoción y la conducta.",
    "Manifestación de múltiples factores; se ubica dentro de una formulación de caso.",
    "Puede ser una llamada al crecimiento o a la integración, no solo algo que eliminar."),
  N("resistencia", "resisten|reactanc|no coopera|abandona", "Resistencia",
    "Protección legítima ante lo amenazante; se respeta y se explora con empatía.",
    "Oposición inconsciente al avance del análisis; revela defensas.",
    "Homeostasis: el sistema se resiste a cambiar sus pautas conocidas.",
    "Falta de reforzadores para la conducta nueva o tarea mal graduada; se ajusta el plan.",
    "Creencias sobre el cambio o sobre la terapia; se tratan como hipótesis a contrastar.",
    "Reactancia: se ajusta la directividad y se trabaja la alianza (p. ej., entrevista motivacional).",
    "Apego a la identidad actual; se acompaña con presencia y se explora qué teme perder."),
  N("relacion", "alianza|relacion terapeutica|vinculo terapeutico", "Relación terapéutica",
    "Es el agente central del cambio: empatía, aceptación incondicional y congruencia del terapeuta.",
    "Campo donde se actualiza la transferencia; se usa para comprender lo que se repite.",
    "El terapeuta forma parte del sistema que observa; se cuida el «sistema terapéutico».",
    "Alianza de trabajo que permite colaborar y reforzar; es el contexto de la intervención.",
    "Empirismo colaborativo: terapeuta y paciente investigan juntos sus hipótesis.",
    "Factor común de mayor peso; se ajusta a las preferencias de cada persona.",
    "Encuentro entre presencias; el terapeuta como compañero de camino."),
  N("cambio", "cambio|mejora|transform|progreso", "Cambio terapéutico",
    "Surge al liberar la tendencia actualizante en una relación facilitadora.",
    "Insight y elaboración que modifican estructuras y relaciones internalizadas.",
    "Alteración de las pautas de interacción o de la narrativa (cambio de primer o segundo orden).",
    "Modificación de las contingencias que modifica la conducta.",
    "Reestructuración de creencias y aprendizaje de interpretaciones más ajustadas.",
    "Combinación de factores comunes y específicos, ajustada al caso y monitoreada.",
    "Transformación de la identidad y expansión de la conciencia."),
  N("trauma", "trauma|abuso|violencia|estres postraum", "Trauma",
    "Ruptura de la confianza en sí y en el mundo; se restaura en una relación segura.",
    "Experiencia que desborda las defensas; se elabora e integra en la historia personal.",
    "Afecta a todo el sistema; se atienden las pautas de protección y el apoyo disponible.",
    "Condicionamiento de miedo; se trabaja con exposición y extinción.",
    "Interpretaciones sobre el evento y sobre sí mismo; se reestructuran mientras se procesa el recuerdo.",
    "Terapia por fases: estabilización, procesamiento e integración.",
    "Puede fracturar el sentido; se integra con prácticas corporales y de sentido, con cuidado clínico."),
  N("apego", "apego|vinculo|abandono|dependencia", "Apego y vínculo",
    "Necesidad de relaciones de aceptación; base de la valía personal.",
    "Relaciones de objeto tempranas internalizadas que se repiten en el presente.",
    "Lealtades y vínculos familiares, a menudo multigeneracionales.",
    "Historia de reforzamiento social y de aprendizaje en las relaciones.",
    "Esquemas sobre sí y los otros formados en vínculos tempranos.",
    "Factor a considerar en la formulación y en la alianza terapéutica.",
    "Paso de la dependencia hacia una conexión más amplia."),
  N("autoestima", "autoestima|valia|inferioridad|autoconcepto", "Autoestima",
    "Valoración incondicional de sí; se cultiva con aceptación.",
    "Equilibrio narcisista y relación entre el yo y el superyó.",
    "Posición y reconocimiento dentro del sistema familiar o social.",
    "Historia de reforzamiento y habilidades disponibles.",
    "Creencias nucleares sobre la propia valía.",
    "Resultado de varios factores; se aborda según la formulación.",
    "Se funda en un yo más profundo, más allá de roles y logros."),
  N("culpa", "culpa|verguenza|remordimiento", "Culpa",
    "Incongruencia con los propios valores; se explora y se acepta.",
    "Tensión con el superyó y con los ideales internalizados.",
    "Lealtades y reglas familiares implícitas.",
    "Castigo condicionado y evitación de situaciones asociadas.",
    "Pensamientos de responsabilidad excesiva; se trabaja la reatribución.",
    "Distinguir la culpa adaptativa de la excesiva y tratarlas distinto.",
    "Reconciliación y perdón como camino."),
  N("duelo", "duelo|perdida|falleci|luto", "Duelo",
    "Proceso de dar sentido a la pérdida con acompañamiento.",
    "Trabajo de duelo: retirar progresivamente la inversión afectiva del objeto perdido.",
    "Reorganización del sistema tras la pérdida y de los roles.",
    "Cambio de contingencias sin la persona; reactivación de actividades.",
    "Creencias sobre la pérdida; se evita que el pensamiento quede atascado.",
    "Alternar entre afrontar la pérdida y reconstruir la vida.",
    "Ritual y sentido; continuidad simbólica del vínculo."),
  N("conflicto", "conflicto|ambivalenc|dilema", "Conflicto",
    "Incongruencia entre el self y la experiencia.",
    "Conflicto intrapsíquico entre deseo, defensa y moral.",
    "Conflicto relacional y de lealtades entre miembros del sistema.",
    "Contingencias en competencia (aproximación–evitación).",
    "Creencias o valoraciones contradictorias.",
    "Se ubica en la formulación (qué fuerzas se oponen y por qué).",
    "Choque entre el ego y un yo más profundo."),
  N("motivacion", "motivacion|ganas|voluntad|meta", "Motivación",
    "Tendencia actualizante y jerarquía de necesidades.",
    "Pulsiones y deseos, muchos de ellos inconscientes.",
    "Funciones del síntoma y equilibrios dentro del sistema.",
    "Reforzadores y operaciones motivacionales.",
    "Expectativas y valoraciones de la persona.",
    "Etapas del cambio y manejo de la ambivalencia.",
    "Búsqueda de sentido y de trascendencia."),
  N("sentido", "sentido|vacio existencial|proposito|valores", "Sentido",
    "Voluntad de sentido y valores como motor de la vida (Frankl).",
    "Significados inconscientes de la experiencia.",
    "Significado construido en la conversación y en la historia compartida.",
    "Valores entendidos como conducta guiada por reglas y consecuencias a largo plazo.",
    "Creencias sobre el significado de los hechos y de la propia vida.",
    "Se integra como parte de los objetivos del caso.",
    "Dimensión espiritual como fuente de sentido."),
  N("inconsciente", "inconscien|subconscien", "Inconsciente",
    "Experiencia organísmica aún no simbolizada ni admitida en la conciencia; se acompaña hasta que pueda ser vivida.",
    "Sede de deseos, recuerdos y defensas reprimidas que influyen sin saberlo; se accede por asociación, sueños y transferencia.",
    "Interesa menos como contenedor individual y más lo que no se dice: reglas y premisas implícitas del sistema.",
    "No se postula como causa; lo «inconsciente» son conductas controladas por contingencias que la persona no describe.",
    "Procesamiento automático: pensamientos automáticos y esquemas que operan fuera de la atención y se vuelven accesibles con registro.",
    "Se acepta de forma pragmática: procesos implícitos y explícitos que la formulación integra según su utilidad clínica.",
    "Se amplía a un inconsciente colectivo o a un superconsciente: fuente de recursos y de material transpersonal."),
  N("self", "self|identidad|autoconcepto|el yo", "Yo, self e identidad",
    "El self es una estructura fenoménica organizada de percepciones sobre sí; busca congruencia con la experiencia.",
    "El yo media entre pulsión, conciencia moral y realidad; el self (Kohut) se estructura en la relación con objetos del self.",
    "La identidad se construye en las relaciones y varía según el contexto; interesa la diferenciación respecto del sistema.",
    "Repertorio de conductas y reglas verbales sobre uno mismo; en ACT, «yo-como-contexto».",
    "Autoconcepto y esquemas sobre sí mismo que filtran la experiencia.",
    "Proceso integrado de varios niveles que se aborda según la formulación.",
    "El yo personal es solo una parte: un Yo integrador o transpersonal es la meta del desarrollo."),
  N("pensamiento", "pensamient|creenci|cognici", "Pensamiento y creencias",
    "Se atienden como parte de la experiencia vivida y de los valores, no como errores a corregir.",
    "Fantasías y pensamientos son derivados de conflictos; se distingue proceso primario y secundario.",
    "Creencias y premisas compartidas por la familia organizan las pautas; se examinan las narrativas dominantes.",
    "Conducta verbal privada («eventos privados») regida por contingencias.",
    "Eje central: pensamientos automáticos, creencias y esquemas determinan la emoción y la conducta.",
    "Se evalúan junto con emoción, conducta y relaciones; se usan técnicas cognitivas si la formulación lo indica.",
    "Se observan sin identificarse con ellos (desidentificación, atención plena)."),
  N("defensa", "defens|evita|evasi", "Defensa y evitación",
    "Distorsión o negación de experiencias amenazantes para el self.",
    "Mecanismos (represión, proyección, negación…) que protegen al yo de la angustia.",
    "Evitar el conflicto mediante triangulaciones o coaliciones que protegen al sistema.",
    "Evitación reforzada negativamente: reduce el malestar a corto plazo y mantiene el miedo.",
    "Conductas de seguridad y evitación que impiden desconfirmar las creencias.",
    "Se evalúa su función y se decide el abordaje (exploración, exposición, etc.).",
    "Defensas del ego ante lo transpersonal; evitación de experiencias profundas."),
  N("empatia", "empati|sintonia|comprension", "Empatía",
    "Condición central: comprender el marco de referencia interno de la otra persona como si fuera propio.",
    "Herramienta de comprensión (Kohut: introspección vicaria) que acompaña a la interpretación.",
    "Se expresa como validación de todos los miembros del sistema (multiparcialidad).",
    "Habilidad terapéutica que facilita la alianza y el reforzamiento de lo que se busca cambiar.",
    "Componente de la relación colaborativa que permite el cuestionamiento.",
    "Factor común asociado a los resultados en múltiples enfoques.",
    "Presencia compasiva que acompaña más allá de la técnica."),
  N("diagnostico", "diagnost|formulac|evaluac", "Diagnóstico y formulación",
    "Se desconfía de las etiquetas; interesa comprender a la persona concreta.",
    "Diagnóstico estructural y dinámico del funcionamiento (neurótico, límite, psicótico).",
    "Se evalúa el sistema: pautas, límites y jerarquías; se formula una hipótesis sistémica.",
    "Análisis funcional y evaluación conductual.",
    "Conceptualización del caso con creencias nucleares y mantenedores.",
    "Formulación integrada que orienta la selección del tratamiento.",
    "Incluye la dimensión espiritual y distingue una crisis espiritual de un trastorno."),
  N("meta", "objetivo|meta |logro|finalidad", "Meta de la terapia",
    "Mayor autenticidad, congruencia y autorrealización.",
    "Insight, elaboración y mayor libertad psíquica.",
    "Cambio de las pautas de interacción o de la narrativa compartida.",
    "Conducta meta operacionalizada y medible.",
    "Reducción del malestar y pensamiento más flexible.",
    "Metas negociadas y revisadas según el progreso.",
    "Integración y expansión de la conciencia."),
  N("cuerpo", "cuerpo|somat|corpor", "Cuerpo",
    "Fuente de la «sensación sentida» y de la sabiduría organísmica.",
    "Sede de las pulsiones; los síntomas pueden expresar conflictos (conversión).",
    "Los síntomas somáticos se leen como parte de las pautas del sistema.",
    "Respuestas fisiológicas condicionadas; se trabajan con relajación y exposición.",
    "Sensaciones corporales interpretadas de forma catastrófica.",
    "Dimensión biológica de la formulación.",
    "Puerta a estados de conciencia (respiración, movimiento, meditación)."),
  N("libertad", "libertad|responsab|elecci", "Libertad y responsabilidad",
    "Núcleo existencial: la persona es libre y responsable de lo que elige.",
    "La libertad está limitada por determinantes inconscientes; el análisis amplía su margen.",
    "Libertad dentro de los límites que impone el sistema.",
    "Se estudia como control por consecuencias; el autocontrol es una conducta aprendida.",
    "Responsabilidad sobre las propias interpretaciones y su revisión.",
    "Autonomía de la persona en las decisiones sobre su tratamiento.",
    "Libertad como liberación de identificaciones limitantes."),
  N("mindfulness", "mindful|atencion plena|meditac", "Atención plena",
    "Presencia y atención al momento presente.",
    "Atención flotante y escucha de lo que ocurre aquí y ahora.",
    "No es central; se presta atención al proceso en la sesión.",
    "Tercera ola: aceptación, defusión y habilidades de mindfulness (ACT, DBT).",
    "Terapia cognitiva basada en mindfulness para prevenir recaídas depresivas.",
    "Técnica compatible con varios enfoques según la formulación.",
    "Práctica contemplativa central en el desarrollo de la conciencia."),
  N("sueno", "sueno|onirico", "Sueños",
    "Mensaje existencial que se vive en el aquí y ahora (Gestalt).",
    "Vía de acceso al inconsciente (Freud) o compensación de la psique (Jung).",
    "Se usa poco; puede tratarse como relato compartido en la familia.",
    "No es objeto de trabajo, o se trata como evento privado.",
    "En pesadillas, técnicas como la reescritura con imaginería.",
    "Se usa si es útil para la formulación.",
    "Fuente de simbolismo y guía interior."),
  N("cultura", "cultur|diversidad|genero|social", "Cultura y diversidad",
    "Las terapias feministas y multiculturales sostienen que lo personal también es político.",
    "El contexto social moldea la conciencia moral y la identidad.",
    "El contexto cultural forma parte del sistema; se examinan las narrativas dominantes (narrativa).",
    "El aprendizaje ocurre en contextos culturales; se adaptan los tratamientos.",
    "Los esquemas se moldean por la cultura; hay adaptaciones culturales de los protocolos.",
    "La competencia cultural es un factor transversal.",
    "Las tradiciones espirituales y culturales se consideran parte del camino."),
  N("esperanza", "esperanza|expectativ|desmoraliz", "Esperanza y expectativas",
    "La fe en el potencial de la persona crea condiciones para el cambio.",
    "Se explora qué se espera y se teme del análisis y de sí mismo.",
    "Reencuadrar y ofrecer una narrativa más esperanzadora del problema.",
    "Las expectativas de refuerzo orientan lo que se intenta hacer.",
    "Predicciones y expectativas se ponen a prueba con evidencia.",
    "Remoralizar es un factor común (Frank): esperanza, relación y un marco que da sentido.",
    "Esperanza arraigada en el sentido y en la trascendencia."),
  N("emocion", "emocion|afecto|rabia|ira|tristeza", "Emoción",
    "Fuente de información sobre necesidades; se experimenta y se simboliza.",
    "Afecto ligado a representaciones; se hace consciente y se elabora.",
    "Se regula en el sistema (co-regulación) y comunica algo a los demás.",
    "Respuesta condicionada y operante; se modifica cambiando el aprendizaje.",
    "Producto de la valoración que se hace de la situación (appraisal).",
    "La regulación emocional es un objetivo transversal.",
    "Estados afectivos como puertas a niveles más profundos de experiencia."),
];

const NOCION_NODO = {
  ansiedad: "ansiedad", sintoma: "sintoma", resistencia: "resistencia", relacion: "relacion_terapeutica", cambio: "mecanismo_cambio",
  apego: "apego", culpa: "culpa", duelo: "muerte_finitud", inconsciente: "inconsciente", self: "self", motivacion: "motivacion",
  cuerpo: "cuerpo_somatico", libertad: "libertad_determinismo", emocion: "emocion", cultura: "contexto_social", meta: "criterio_cura",
  depresion: "depresion", trauma: "trauma", autoestima: "autoestima", conflicto: "conflicto", sentido: "sentido", pensamiento: "pensamiento", defensa: "defensa", empatia: "empatia", diagnostico: "diagnostico",
  mindfulness: "atencion_plena", sueno: "suenos", esperanza: "esperanza",
};

export function TraductorClinico({ escuelas, glosario, enlaces, colorDe, onIrAEscuela, perspectivas, perspectivasFund, idDe = () => null, nudos = [] }) {
  const [texto, setTexto] = useState("");
  const [elegido, setElegido] = useState(0);
  const porId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e])), [escuelas]);
  const q = norm(texto);
  const nociones = useMemo(() => (q.length < 3 ? [] : NOCIONES.filter((n) => n.claves.some((k) => q.includes(k) || (q.length >= 4 && k.startsWith(q))))), [q]);
  const glosarioDe = (n, perspId) =>
    glosario
      .filter((g) => { const E = porId[g.escuela]; return E && idDe(E.perspectiva) === perspId && g.tipo === "concepto" && n.claves.some((k) => norm(g.termino).includes(k.trim())); })
      .sort((a, b) => a.termino.length - b.termino.length)
      .slice(0, 2);
  const enlacesDe = (g) => {
    const nt = norm(g.termino);
    return enlaces.filter((l) => [l.conceptoA, l.conceptoB].some((c) => c.escuela === g.escuela && (norm(c.nombre).includes(nt) || nt.includes(norm(c.nombre)))));
  };
  const candidatos = useMemo(() => {
    if (q.length < 3) return [];
    const ordena = (lista) => lista.map((g) => ({ g, n: enlacesDe(g).length })).sort((a, b) => b.n - a.n).map((x) => x.g);
    const exactos = glosario.filter((g) => norm(g.termino).includes(q) || (norm(g.termino).length > 3 && q.includes(norm(g.termino))));
    if (exactos.length) return ordena(exactos).slice(0, 8);
    const ws = q.split(" ").filter((w) => w.length > 4);
    if (!ws.length) return [];
    return ordena(
      glosario
        .map((g) => ({ g, sc: ws.reduce((s, w) => s + (norm(g.termino + " " + g.definicion).includes(w.slice(0, 6)) ? 1 : 0), 0) }))
        .filter((x) => x.sc > 0)
        .sort((a, b) => b.sc - a.sc)
        .slice(0, 24)
        .map((x) => x.g)
    ).slice(0, 8);
  }, [q, glosario, enlaces]);
  useEffect(() => setElegido(0), [q]);
  const c = candidatos[elegido];
  const puentes = useMemo(() => {
    if (!c) return {};
    const nt = norm(c.termino);
    const out = {};
    enlaces.forEach((l) => {
      [[l.conceptoA, l.conceptoB], [l.conceptoB, l.conceptoA]].forEach(([yo, otro]) => {
        if (yo.escuela !== c.escuela) return;
        const ny = norm(yo.nombre);
        if (!(ny.includes(nt) || nt.includes(ny))) return;
        const E = porId[otro.escuela];
        if (!E) return;
        (out[E.perspectiva] = out[E.perspectiva] || []).push({ l, E, otro });
      });
    });
    return out;
  }, [c, enlaces, porId]);
  const origen = c ? porId[c.escuela] : null;
  const total = Object.values(puentes).reduce((s, a) => s + a.length, 0);
  const pidx = (nombre) => ORDEN.indexOf(perspectivasFund.find((p) => p.nombre === nombre || nombre.startsWith(p.nombre.split(" ")[0]))?.id);
  return (
    <section className="psn-trad">
      <p className="psn-intro">
        Escribe un término o una frase clínica. El traductor ofrece (1) una síntesis orientativa de cómo cada perspectiva nombra y entiende la noción, y (2) la definición del glosario con los puentes —y las pérdidas— que documenta el diccionario traslacional entre escuelas.
      </p>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej.: ansiedad, resistencia, apego, culpa, duelo, inconsciente, esquema…" aria-label="Término clínico a traducir" />
      {q.length < 3 && (
        <div className="psn-trad-cands">
          {NOCIONES.map((n) => (
            <button key={n.id} onClick={() => setTexto(n.nombre.split(" ")[0].toLowerCase())}>
              {n.nombre}
            </button>
          ))}
        </div>
      )}
      {nociones.length > 0 && (
        <div className="psn-trad-nociones">
          {nociones.slice(0, 3).map((n) => (
            <article key={n.id}>
              <h4>«{n.nombre}» en siete lenguajes <small>(síntesis orientativa, redacción propia)</small></h4>
              <div className="psn-trad-grid">
                {ORDEN.map((id, i) => {
                  const p = perspectivasFund.find((x) => x.id === id);
                  return (
                    <article key={id} style={{ "--pc": colorDe(p?.nombre) }}>
                      <h6>{p?.nombre}</h6>
                      <p>{n.f[i]}</p>
                      {(() => {
                        const nodo = nudos.find((x) => x.id === NOCION_NODO[n.id]);
                        const e = nodo && nodo.porPerspectiva.find((y) => idDe(y.perspectiva) === id);
                        if (e) {
                          return (
                            <p className="psn-glos psn-glos-ok" title="Término verificado del glosario">
                              <b>{e.termino}</b> · <span>{recortar(e.definicion, 150)}</span>
                              <button onClick={() => setTexto(e.termino)}>ver puentes</button>
                            </p>
                          );
                        }
                        const lex = glosarioDe(n, id);
                        if (lex.length) {
                          return lex.map((g) => (
                            <p key={g.escuela + g.termino} className="psn-glos" title={g.fuente}>
                              <b>{g.termino}</b> · <span>{recortar(g.definicion, 120)}</span>
                              <button onClick={() => setTexto(g.termino)}>ver puentes</button>
                            </p>
                          ));
                        }
                        return <p className="psn-glos psn-glos-hueco">Sin término verificado en el glosario para esta perspectiva todavía.</p>;
                      })()}
                    </article>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      )}
      {q.length >= 3 && candidatos.length === 0 && nociones.length === 0 && <p className="psn-vacio">No encontré ese término. Prueba con otra palabra más específica o con una de las nociones sugeridas.</p>}
      {candidatos.length > 0 && <h5 className="psn-sub-h">En el glosario y el diccionario traslacional</h5>}
      {candidatos.length > 1 && (
        <div className="psn-trad-cands" role="tablist" aria-label="Coincidencias">
          {candidatos.map((g, i) => (
            <button key={g.escuela + g.termino} className={i === elegido ? "on" : ""} onClick={() => setElegido(i)}>
              {g.termino}
              <small>{porId[g.escuela]?.nombre}</small>
            </button>
          ))}
        </div>
      )}
      {c && origen && (
        <div className="psn-trad-res">
          <article className="psn-trad-origen" style={{ "--pc": colorDe(origen.perspectiva) }}>
            <span className="psn-chip">{origen.perspectiva} · {origen.nombre}</span>
            <h4>{c.termino}</h4>
            <p>{c.definicion}</p>
            {c.fuente && <small className="psn-fuente">Fuente: {c.fuente}</small>}
          </article>
          <h5 className="psn-sub-h">Cómo se dice en las demás perspectivas ({total} {total === 1 ? "puente" : "puentes"})</h5>
          <div className="psn-trad-grid">
            {perspectivas.map((p) => {
              const lista = puentes[p] || [];
              return (
                <article key={p} style={{ "--pc": colorDe(p) }} className={lista.length ? "" : "vacia"}>
                  <h6>{p}</h6>
                  {lista.length === 0 ? (
                    <p className="psn-vacio">Sin puente documentado para este término.</p>
                  ) : (
                    lista.slice(0, 3).map(({ l, E, otro }) => (
                      <div key={l.id} className="psn-trad-puente">
                        <span className="psn-rel" style={{ background: COLOR_REL[l.relacion] || "#514D74" }}>{l.relacion}</span>
                        <strong>{otro.nombre}</strong>
                        <button onClick={() => onIrAEscuela(E.id)}>{E.nombre}</button>
                        <p>{oraciones(l.nota, 320)}</p>
                      </div>
                    ))
                  )}
                </article>
              );
            })}
          </div>
          <p className="psn-aviso"><b>Cómo leerlo:</b> «equivalente aproximado» y «análogo funcional» permiten traducir con poca pérdida; «falso amigo» advierte que la palabra se parece pero significa otra cosa; «inconmensurable» indica que no hay un criterio común para traducir.</p>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------ */
/*  DEBATE SIMULADO                                             */
/* ------------------------------------------------------------ */
const TEMAS_DEBATE = [
  { k: "psicopatologia", t: "¿Qué es el sufrimiento psíquico?" },
  { k: "ontologia", t: "¿Qué es una persona?" },
  { k: "epistemologia", t: "¿Cómo se conoce lo clínico?" },
  { k: "criterioVerdad", t: "¿Qué cuenta como verdad?" },
  { k: "metodologia", t: "¿Cómo se trabaja en terapia?" },
  { k: "tecnicas", t: "¿Qué produce el cambio?" },
  { k: "evidencia", t: "¿Qué evidencia respalda su práctica?" },
  { k: "contraindicaciones", t: "¿Qué límites y precauciones reconoce?" },
];

function dicho(e, k) {
  const v = e[k];
  if (k === "tecnicas" || k === "contraindicaciones") {
    if (Array.isArray(v)) {
      const lista = v.filter((x) => typeof x === "string").slice(0, k === "tecnicas" ? 4 : 3).map((x) => oraciones(x, 140).replace(/[.]+$/, ""));
      return (k === "tecnicas" ? "Para producir cambio recurre a: " : "Reconoce como límites o precauciones: ") + lista.join("; ") + ".";
    }
    return oraciones(v, 360);
  }
  const t = oraciones(v, 380);
  return t.length > 520 ? t.slice(0, 500).replace(/\s+\S*$/, "") + "…" : t;
}

const REL_CONTACTO = ["equivalente aproximado", "análogo funcional", "solapamiento parcial"];
const REL_CHOQUE = ["falso amigo", "inconmensurable", "reinterpretación asimilativa"];

/* Qué haría una escuela con un caso: técnicas y presentaciones de su ficha que mejor encajan con el texto. */
function conCaso(e, caso) {
  const q = norm(Object.values(caso.c).join(" "));
  const ws = [...new Set(q.split(" ").filter((w) => w.length > 4))];
  const puntua = (t) => ws.reduce((s, w) => s + (norm(t).includes(w.slice(0, 6)) ? 1 : 0), 0);
  const lista = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
  const tec = lista(e.tecnicas).map((t) => ({ t, sc: puntua(t) })).sort((a, b) => b.sc - a.sc);
  const pres = lista(e.presentaciones).map((t) => ({ t, sc: puntua(t) })).sort((a, b) => b.sc - a.sc);
  return {
    tecnicas: tec.slice(0, 3).map((x) => oraciones(x.t, 150).replace(/[.]+$/, "")),
    presentaciones: pres.filter((x) => x.sc > 0).slice(0, 2).map((x) => oraciones(x.t, 120).replace(/[.]+$/, "")),
    encaja: tec.some((x) => x.sc > 0),
  };
}

export function DebateSimulado({ escuelas, enlaces, colorDe, modoEstudio = false }) {
  const ordenadas = useMemo(() => [...escuelas].sort((a, b) => a.perspectiva.localeCompare(b.perspectiva) || a.nombre.localeCompare(b.nombre)), [escuelas]);
  const [ida, setIda] = useState("");
  const [idb, setIdb] = useState("");
  const [tema, setTema] = useState("psicopatologia");
  const [completa, setCompleta] = useState(false);
  const [idCaso, setIdCaso] = useState("");
  const [voto, setVoto] = useState("");
  const [nota, setNota] = useState("");
  const [abogado, setAbogado] = useState("");
  const [reveladoAb, setReveladoAb] = useState(false);
  const A = escuelas.find((e) => e.id === ida), B = escuelas.find((e) => e.id === idb);
  const clave = `psiconautas:debate:${ida}|${idb}`;
  useEffect(() => {
    try {
      const g = JSON.parse(localStorage.getItem(clave) || "{}");
      setVoto(g.voto || "");
      setNota(g.nota || "");
    } catch { setVoto(""); setNota(""); }
  }, [clave]);
  const guarda = (v, n) => { try { localStorage.setItem(clave, JSON.stringify({ voto: v, nota: n })); } catch { /* sin almacenamiento */ } };
  const puentes = A && B ? enlaces.filter((l) => (l.conceptoA.escuela === A.id && l.conceptoB.escuela === B.id) || (l.conceptoA.escuela === B.id && l.conceptoB.escuela === A.id)) : [];
  const contacto = puentes.filter((l) => REL_CONTACTO.includes(l.relacion));
  const choque = puentes.filter((l) => REL_CHOQUE.includes(l.relacion));
  const resumenRel = puentes.reduce((m, l) => ((m[l.relacion] = (m[l.relacion] || 0) + 1), m), {});
  const caso = idCaso !== "" ? CASOS[Number(idCaso)] : null;
  const veredicto = !A || !B ? "" : puentes.length === 0
    ? "Sin puentes documentados: probablemente comparten poco vocabulario y habría que construir la traducción desde cero."
    : choque.some((l) => l.relacion === "inconmensurable")
      ? "Distancia alta: al menos un punto es inconmensurable, es decir, no hay un criterio común para decidir quién tiene razón; conviene tratarlas como lenguajes distintos."
      : choque.length > contacto.length
        ? "Más choques que contactos: comparten palabras pero a menudo significan cosas distintas (falsos amigos o reinterpretaciones)."
        : "Convergencia razonable: hay equivalencias o solapamientos que permiten traducir con pocas pérdidas, aunque cada nota documenta lo que se pierde.";
  const elige = (valor, set) => (
    <select value={valor} onChange={(e) => set(e.target.value)}>
      <option value="">— elige una escuela —</option>
      {ordenadas.map((e) => (
        <option key={e.id} value={e.id} disabled={e.id === ida || e.id === idb}>
          {e.perspectiva.split("-")[0]} · {e.nombre}
        </option>
      ))}
    </select>
  );
  const Cabecera = ({ e }) => {
    const s = slugsDeAutores(e.autores)[0];
    return (
      <div className="psn-voz-id">
        {s ? <Mini slug={s} tam={56} /> : <i className="psn-tl-punto" />}
        <strong>{e.nombre}</strong>
        <small>{e.perspectiva}</small>
      </div>
    );
  };
  const Voz = ({ e, lado, k }) => (
    <div className={`psn-voz ${lado}`} style={{ "--pc": colorDe(e.perspectiva) }}>
      <Cabecera e={e} />
      <blockquote>{dicho(e, k) || "Esta ficha aún no desarrolla este punto."}</blockquote>
    </div>
  );
  const rondas = completa ? TEMAS_DEBATE : TEMAS_DEBATE.filter((x) => x.k === tema);
  const preguntas = A && B ? [
    `¿Qué tendría que concederle ${A.nombre} a ${B.nombre} para que la conversación fuera posible, y qué perdería al hacerlo?`,
    "Si una misma persona consultara a ambas escuelas, ¿qué cambiaría en lo que cada una considera «el problema»?",
    "¿Qué evidencia o experiencia haría que alguna de las dos revisara su postura?",
  ] : [];
  const Caja = ({ titulo, lista, cls }) => (
    <div className={`psn-contacto ${cls}`}>
      <h5>{titulo} ({lista.length})</h5>
      {lista.length === 0 && <p className="psn-vacio">Ninguno documentado.</p>}
      {lista.slice(0, 3).map((l) => (
        <div key={l.id}>
          <span className="psn-rel" style={{ background: COLOR_REL[l.relacion] || "#514D74" }}>{l.relacion}</span>
          <p><em>{l.conceptoA.nombre}</em> ↔ <em>{l.conceptoB.nombre}</em></p>
          <p className="psn-nota">{oraciones(l.nota, 300)}</p>
        </div>
      ))}
    </div>
  );
  return (
    <section className="psn-debate">
      <p className="psn-intro">Elige dos escuelas y un tema (o una ronda completa de ocho). La app arma el cruce con lo que dice la ficha de cada una —sin inventar argumentos—, separa los puntos de contacto de los de choque según el diccionario traslacional, puede llevar el debate a un caso concreto y cierra con un veredicto del moderador y tu propio juicio.</p>
      <div className="psn-debate-sel">
        <label>Escuela A {elige(ida, setIda)}</label>
        <label>Escuela B {elige(idb, setIdb)}</label>
        <label>
          Tema
          <select value={tema} onChange={(e) => setTema(e.target.value)} disabled={completa}>
            {TEMAS_DEBATE.map((x) => <option key={x.k} value={x.k}>{x.t}</option>)}
          </select>
        </label>
        <label>
          Caso en disputa (opcional)
          <select value={idCaso} onChange={(e) => setIdCaso(e.target.value)}>
            <option value="">— sin caso —</option>
            {CASOS.map((c, i) => <option key={c.t} value={i}>{c.t} · {c.sub}</option>)}
          </select>
        </label>
        <label className="psn-check">
          <input type="checkbox" checked={completa} onChange={(e) => setCompleta(e.target.checked)} /> Ronda completa (8 temas)
        </label>
      </div>
      {A && B ? (
        <div className="psn-debate-escena">
          <p className="psn-mod"><b>Moderación:</b> {A.nombre} ({A.perspectiva}) y {B.nombre} ({B.perspectiva}) responden a {completa ? "ocho preguntas de fondo" : `«${rondas[0].t}»`}.</p>
          {rondas.map((r, i) => (
            <React.Fragment key={r.k}>
              {completa && <p className="psn-ronda">Ronda {i + 1} · {r.t}</p>}
              <Voz e={A} lado="izq" k={r.k} />
              <Voz e={B} lado="der" k={r.k} />
            </React.Fragment>
          ))}
          <p className="psn-ronda">Puntos de contacto y de choque</p>
          <div className="psn-contactos">
            <Caja titulo="Contacto: se puede traducir" lista={contacto} cls="ok" />
            <Caja titulo="Choque: cuidado al traducir" lista={choque} cls="no" />
          </div>
          {puentes.length > 0 && <p className="psn-mod">Total: {puentes.length} {puentes.length === 1 ? "puente" : "puentes"} ({Object.entries(resumenRel).map(([r, n]) => `${n} ${r}`).join(", ")}).</p>}
          {caso && (
            <>
              <p className="psn-ronda">Caso en disputa · {caso.t}</p>
              <div className="psn-caso-cab">
                <img className={caso.ancho ? "ancho" : ""} src={fotoCaso(caso.av)} alt={`Retrato de ${caso.t}`} width={caso.ancho ? 160 : 72} height={caso.ancho ? 80 : 72} />
                <div><strong>{caso.t}</strong><span>{caso.c.motivo}</span></div>
              </div>
              <div className="psn-contactos">
                {[A, B].map((e) => {
                  const r = conCaso(e, caso);
                  return (
                    <div key={e.id} className="psn-contacto" style={{ "--pc": colorDe(e.perspectiva) }}>
                      <h5>{e.nombre}</h5>
                      {r.presentaciones.length > 0 && <p className="psn-nota"><b>Presentaciones que reconocería:</b> {r.presentaciones.join("; ")}.</p>}
                      <p className="psn-nota"><b>{r.encaja ? "Técnicas de su ficha que encajan con el caso:" : "Técnicas centrales de su ficha (ninguna coincide claramente con el caso):"}</b> {r.tecnicas.join("; ")}.</p>
                    </div>
                  );
                })}
              </div>
              <p className="psn-aviso">Cruce automático entre el texto del caso y las técnicas y presentaciones registradas en cada ficha; no es una indicación clínica.</p>
            </>
          )}
          <div className="psn-veredicto">
            <b>Veredicto del moderador</b>
            <p>{veredicto}</p>
            <p className="psn-nota">Criterios de verdad: {A.nombre} → «{oraciones(A.criterioVerdad, 110).replace(/[.]+$/, "")}»; {B.nombre} → «{oraciones(B.criterioVerdad, 110).replace(/[.]+$/, "")}».</p>
          </div>
          <div className="psn-preguntas">
            <b>Para pensar</b>
            <ol>{preguntas.map((x) => <li key={x}>{x}</li>)}</ol>
          </div>
          {modoEstudio && voto && (voto === "A" || voto === "B") && (() => {
            const otra = voto === "A" ? B : A;
            return (
              <div className="psn-abogado">
                <b>Modo estudio · abogado del diablo</b>
                <p>Elegiste a {voto === "A" ? A.nombre : B.nombre}. Ahora defiende lo mejor posible a <strong>{otra.nombre}</strong>: ¿qué diría su mejor argumento sobre «{rondas[0].t}»?</p>
                <textarea rows={3} value={abogado} onChange={(e) => setAbogado(e.target.value)} placeholder="Escribe en tres líneas el argumento más fuerte de la escuela que no elegiste…" />
                <button className="psn-btn" onClick={() => setReveladoAb(!reveladoAb)}>{reveladoAb ? "Ocultar" : "Comparar con su ficha"}</button>
                {reveladoAb && <blockquote>{dicho(otra, rondas[0].k) || "Su ficha no desarrolla este punto."}</blockquote>}
              </div>
            );
          })()}
          <div className="psn-juicio">
            <b>Tu juicio</b>
            <div role="radiogroup" aria-label="¿Quién te convenció?">
              {[["A", A.nombre], ["B", B.nombre], ["ambas", "Ambas, en distintos planos"], ["ninguna", "Ninguna todavía"]].map(([v, t]) => (
                <button key={v} className={voto === v ? "on" : ""} onClick={() => { setVoto(v); guarda(v, nota); }}>{t}</button>
              ))}
            </div>
            <textarea rows={3} value={nota} onChange={(e) => { setNota(e.target.value); guarda(voto, e.target.value); }} placeholder="¿Por qué? Anota aquí tu razonamiento (se guarda solo en este navegador)…" aria-label="Razonamiento del debate" />
          </div>
        </div>
      ) : (
        <p className="psn-vacio">Elige las dos escuelas para empezar el cruce.</p>
      )}
    </section>
  );
}


/* ------------------------------------------------------------ */
/*  ROSA DE EJES (Comparación): dial de ejes + pétalos          */
/* ------------------------------------------------------------ */
export function RosaDeEjes({ campos, perspectivas, colorDe, modoEstudio = false }) {
  const [ejeKey, setEjeKey] = useState(campos[0].key);
  const [abierto, setAbierto] = useState(null);
  const [duelo, setDuelo] = useState([]);
  const [ciego, setCiego] = useState(false);
  const [adivina, setAdivina] = useState({});
  const eje = campos.find((c) => c.key === ejeKey) || campos[0];
  const R = 128, cx = 160, cy = 160;
  const pos = (i, n, r) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), a];
  };
  const textos = useMemo(() => perspectivas.map((p) => ({ p, t: eje.get(p) || "" })), [eje, perspectivas]);
  const orden = useMemo(() => (ciego ? barajar(textos.map((_, i) => i)) : textos.map((_, i) => i)), [ciego, ejeKey]);
  const toggleDuelo = (id) => setDuelo((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d.slice(-1), id]));
  return (
    <section className="psn-rosa">
      <div className="psn-rosa-dial">
        <svg viewBox="0 0 320 320" role="img" aria-label="Dial de ejes de comparación">
          <circle cx={cx} cy={cy} r={R + 20} fill="none" stroke="var(--c-ink)" strokeOpacity=".18" strokeDasharray="2 6" />
          <circle cx={cx} cy={cy} r={R - 46} fill="var(--c-paperDark)" stroke="var(--c-ink)" strokeWidth="2.5" />
          {perspectivas.map((p, i) => {
            const [x, y] = pos(i, perspectivas.length, R - 74);
            return <circle key={p.id} cx={x} cy={y} r="7" fill={colorDe(p)} stroke="var(--c-ink)" strokeWidth="1.5" />;
          })}
          {campos.map((c, i) => {
            const [x, y] = pos(i, campos.length, R);
            const on = c.key === ejeKey;
            const fil = c.grupo === "filosofico";
            return (
              <g key={c.key} className="psn-eje-nodo" onClick={() => { setEjeKey(c.key); setAbierto(null); }} tabIndex={0} role="button" aria-label={c.label} onKeyDown={(e) => e.key === "Enter" && setEjeKey(c.key)}>
                <circle cx={x} cy={y} r={on ? 17 : 13} fill={on ? (fil ? "#2F4BB5" : "#D9402A") : "var(--c-cardBg)"} stroke="var(--c-ink)" strokeWidth="2.5" />
                <text x={x} y={y + 4} textAnchor="middle" style={{ font: "800 11px var(--f-mono)" }} fill={on ? "#fff" : "var(--c-ink)"}>{i + 1}</text>
              </g>
            );
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" style={{ font: "800 11px var(--f-display)" }} fill="var(--c-ink)">
            {eje.label.split(" ").slice(0, 2).join(" ")}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" style={{ font: "500 9px var(--f-mono)" }} fill="var(--c-inkSoft)">{eje.grupo === "filosofico" ? "coordenada filosófica" : "eje narrativo"}</text>
        </svg>
        <ol className="psn-rosa-leyenda">
          {campos.map((c, i) => (
            <li key={c.key} className={`${c.key === ejeKey ? "on" : ""} ${c.grupo}`}>
              <button onClick={() => { setEjeKey(c.key); setAbierto(null); }}><b>{i + 1}</b> {c.label}</button>
            </li>
          ))}
        </ol>
      </div>
      <div className="psn-rosa-petalos">
        <header>
          <h4>{eje.label}</h4>
          <span className="psn-chip">{eje.grupo === "filosofico" ? "coordenada filosófica" : "eje narrativo"}</span>
          {modoEstudio && (
            <button className={`psn-btn ${ciego ? "psn-btn-primario" : ""}`} onClick={() => { setCiego(!ciego); setAdivina({}); setAbierto(null); }}>
              {ciego ? "Mostrar nombres" : "Modo adivina"}
            </button>
          )}
        </header>
        {ciego && <p className="psn-nota">Modo adivina: lee cada respuesta y elige la perspectiva que la daría.</p>}
        <ul>
          {orden.map((i) => {
            const { p, t } = textos[i];
            const abre = abierto === p.id;
            const en = duelo.includes(p.id);
            const fin = adivina[p.id];
            return (
              <li key={p.id} className={`${abre ? "abre" : ""} ${en ? "duelo" : ""}`} style={{ "--pc": ciego && !fin ? "var(--c-ink)" : colorDe(p) }}>
                <button className="psn-petalo" onClick={() => setAbierto(abre ? null : p.id)} aria-expanded={abre}>
                  <strong>{ciego && !fin ? "¿Quién responde así?" : p.nombre}</strong>
                  <span>{abre ? "" : oraciones(t, 150) || "—"}</span>
                </button>
                {abre && <div className="psn-petalo-texto">{t || "Sin información registrada para este eje."}</div>}
                {ciego ? (
                  <select value={fin || ""} onChange={(e) => setAdivina({ ...adivina, [p.id]: e.target.value })}>
                    <option value="">— adivina —</option>
                    {perspectivas.map((q) => <option key={q.id} value={q.nombre}>{q.nombre}</option>)}
                  </select>
                ) : (
                  <label className="psn-duelo-check"><input type="checkbox" checked={en} onChange={() => toggleDuelo(p.id)} /> cara a cara</label>
                )}
                {ciego && fin && <b className={fin === p.nombre ? "ok" : "mal"}>{fin === p.nombre ? "✓ correcto" : `✗ era ${p.nombre}`}</b>}
              </li>
            );
          })}
        </ul>
        {!ciego && duelo.length === 2 && (
          <div className="psn-cara-cara">
            {duelo.map((id) => {
              const x = textos.find((y) => y.p.id === id);
              return (
                <article key={id} style={{ "--pc": colorDe(x.p) }}>
                  <h5>{x.p.nombre}</h5>
                  <p>{x.t || "—"}</p>
                </article>
              );
            })}
          </div>
        )}
        {!ciego && duelo.length < 2 && <p className="psn-nota">Marca dos perspectivas con «cara a cara» para ver sus textos completos lado a lado.</p>}
      </div>
    </section>
  );
}


/* ------------------------------------------------------------ */
/*  TORRE DE SUPUESTOS (coordenadas filosóficas)                */
/* ------------------------------------------------------------ */
const CAPAS = [
  { k: "ontologia", t: "Ontología", q: "¿Qué es lo que hay y qué es el psiquismo?" },
  { k: "relacionMenteCuerpo", t: "Mente y cuerpo", q: "¿Cómo se relacionan lo psíquico y lo corporal?" },
  { k: "epistemologia", t: "Epistemología", q: "¿Cómo se conoce lo clínico?" },
  { k: "metodologia", t: "Metodología", q: "¿Con qué método se investiga y se interviene?" },
  { k: "criterioVerdad", t: "Criterio de verdad", q: "¿Qué cuenta como verdadero?" },
  { k: "unidadAnalisis", t: "Unidad de análisis", q: "¿Qué es lo que se mira?" },
];
const raices = (t) => new Set(norm(unir(t)).split(" ").filter((w) => w.length > 4).map((w) => w.slice(0, 6)));
function similitud(a, b) {
  const A = raices(a), B = raices(b);
  if (!A.size || !B.size) return 0;
  let n = 0;
  A.forEach((x) => B.has(x) && n++);
  return n / (A.size + B.size - n);
}

export function TorreSupuestos({ perspectivas, colorDe }) {
  const [a, setA] = useState(perspectivas[0].id);
  const [b, setB] = useState("");
  const [abre, setAbre] = useState(null);
  const PA = perspectivas.find((p) => p.id === a);
  const PB = perspectivas.find((p) => p.id === b);
  const capas = [...CAPAS].reverse(); // la cima arriba, la ontología como cimiento
  const sims = PB ? Object.fromEntries(CAPAS.map((c) => [c.k, similitud(PA[c.k], PB[c.k])])) : {};
  const grieta = PB ? CAPAS.reduce((m, c) => (sims[c.k] < sims[m.k] ? c : m), CAPAS[0]) : null;
  const nivel = (s) => (s < 0.07 ? ["distantes", "mal"] : s < 0.14 ? ["parciales", "med"] : ["cercanas", "ok"]);
  const Bloque = ({ P, c }) => {
    const t = unir(P[c.k]);
    const id = P.id + c.k;
    const on = abre === id;
    return (
      <button className={`psn-ladrillo ${on ? "on" : ""}`} style={{ "--pc": colorDe(P) }} onClick={() => setAbre(on ? null : id)} aria-expanded={on}>
        <b>{c.t}</b>
        <span>{on ? t || "Sin información registrada." : oraciones(t, 120) || "—"}</span>
      </button>
    );
  };
  return (
    <section className="psn-torre">
      <p className="psn-intro">Cada perspectiva se apoya en seis supuestos filosóficos apilados: la ontología es el cimiento y la unidad de análisis, la cima. Elige una perspectiva para ver su torre; elige una segunda y la app compara capa por capa para mostrar <b>dónde se abre la grieta</b> entre ambas.</p>
      <div className="psn-torre-sel">
        <label>Torre A
          <select value={a} onChange={(e) => { setA(e.target.value); setAbre(null); }}>
            {perspectivas.filter((p) => p.id !== b).map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </label>
        <label>Comparar con
          <select value={b} onChange={(e) => { setB(e.target.value); setAbre(null); }}>
            <option value="">— solo una torre —</option>
            {perspectivas.filter((p) => p.id !== a).map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </label>
      </div>
      <div className={`psn-torre-cuerpo ${PB ? "dos" : ""}`}>
        <h5 style={{ "--pc": colorDe(PA) }}>{PA.nombre}</h5>
        {PB && <span />}
        {PB && <h5 style={{ "--pc": colorDe(PB) }}>{PB.nombre}</h5>}
        {capas.map((c) => (
          <React.Fragment key={c.k}>
            <Bloque P={PA} c={c} />
            {PB && (
              <div className={`psn-grieta ${nivel(sims[c.k])[1]} ${grieta && grieta.k === c.k ? "mayor" : ""}`} title={`${c.t}: ${nivel(sims[c.k])[0]}`}>
                <svg viewBox="0 0 60 40"><path d={nivel(sims[c.k])[1] === "ok" ? "M4 20 H56" : nivel(sims[c.k])[1] === "med" ? "M4 20 L20 12 L32 28 L44 14 L56 20" : "M4 20 L14 8 L22 32 L32 6 L42 34 L50 10 L56 20"} /></svg>
                <small>{c.t}</small>
                <em>{nivel(sims[c.k])[0]}</em>
              </div>
            )}
            {PB && <Bloque P={PB} c={c} />}
          </React.Fragment>
        ))}
      </div>
      {PB && grieta && <p className="psn-nota"><b>La grieta más grande está en «{grieta.t}»:</b> {grieta.q} Es la capa donde las dos perspectivas comparten menos vocabulario. (Medida orientativa por solapamiento de términos entre los textos de las fichas.)</p>}
    </section>
  );
}

/* ------------------------------------------------------------ */
/*  EXAMEN SIMULADO (modo estudio, final de Comparación)        */
/* ------------------------------------------------------------ */
export function ExamenSimulado({ escuelas, enlaces, perspectivas, colorDe }) {
  const [ronda, setRonda] = useState(0);
  const [resp, setResp] = useState({});
  const [fin, setFin] = useState(false);
  const [t0, setT0] = useState(Date.now());
  const [segs, setSegs] = useState(0);
  const preguntas = useMemo(() => {
    const qs = [];
    const nombres = perspectivas.map((p) => p.nombre);
    const opcionesP = (ok) => barajar([ok, ...barajar(nombres.filter((n) => n !== ok)).slice(0, 3)]);
    const campos = [["ontologia", "ontología del psiquismo"], ["epistemologia", "epistemología"], ["criterioVerdad", "criterio de verdad"], ["metodologia", "metodología"], ["relacionMenteCuerpo", "relación mente-cuerpo"], ["unidadAnalisis", "unidad de análisis"]];
    barajar(campos).slice(0, 3).forEach(([k, lab]) => {
      const p = perspectivas[Math.floor(Math.random() * perspectivas.length)];
      const t = recortar(p[k], 230);
      if (t) qs.push({ tipo: "Perspectiva", q: `¿Qué perspectiva sostiene esta ${lab}?`, cita: t, ok: p.nombre, ops: opcionesP(p.nombre), exp: `Es la ${lab} de la perspectiva ${p.nombre}.` });
    });
    const conTexto = escuelas.filter((e) => e.criterioVerdad && e.criterioVerdad.length > 60);
    barajar(conTexto).slice(0, 2).forEach((e) => {
      const otras = barajar(conTexto.filter((x) => x.perspectiva !== e.perspectiva)).slice(0, 3);
      qs.push({ tipo: "Escuela", q: "¿Qué escuela tiene este criterio de verdad?", cita: recortar(e.criterioVerdad, 230), ok: e.nombre, ops: barajar([e.nombre, ...otras.map((x) => x.nombre)]), exp: `Corresponde a ${e.nombre} (${e.perspectiva}).` });
    });
    const probl = perspectivas.filter((p) => MIRADAS[p.id]);
    barajar(probl).slice(0, 2).forEach((p) => {
      qs.push({ tipo: "Caso", q: "Ante un mismo caso, ¿qué perspectiva formularía el problema así?", cita: MIRADAS[p.id].problema, ok: p.nombre, ops: opcionesP(p.nombre), exp: `Así lo formula la perspectiva ${p.nombre}.` });
    });
    const porId = Object.fromEntries(escuelas.map((e) => [e.id, e]));
    const rels = ["equivalente aproximado", "análogo funcional", "solapamiento parcial", "falso amigo", "reinterpretación asimilativa", "inconmensurable"];
    barajar(enlaces.filter((l) => porId[l.conceptoA.escuela] && porId[l.conceptoB.escuela])).slice(0, 2).forEach((l) => {
      qs.push({ tipo: "Puente", q: `El diccionario traslacional relaciona «${l.conceptoA.nombre}» (${porId[l.conceptoA.escuela].nombre}) con «${l.conceptoB.nombre}» (${porId[l.conceptoB.escuela].nombre}). ¿Qué tipo de relación documenta?`, cita: "", ok: l.relacion, ops: barajar([l.relacion, ...barajar(rels.filter((r) => r !== l.relacion)).slice(0, 3)]), exp: oraciones(l.nota, 260) });
    });
    const con = Object.keys(AUTORES).filter((s) => AUTORES[s].s && AUTORES[s].foto !== false);
    const o = con[Math.floor(Math.random() * con.length)];
    qs.push({ tipo: "Autor", q: "¿Quién sostiene esta idea?", cita: AUTORES[o].s, ok: AUTORES[o].n, ops: barajar([AUTORES[o].n, ...barajar(con.filter((s) => s !== o)).slice(0, 3).map((s) => AUTORES[s].n)]), exp: `${AUTORES[o].n}: ${AUTORES[o].r}.` });
    return qs;
  }, [ronda]);
  useEffect(() => {
    if (fin) return;
    const id = setInterval(() => setSegs(Math.round((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
  }, [fin, t0]);
  const aciertos = preguntas.filter((p, i) => resp[i] === p.ok).length;
  const nota = Math.round((aciertos / preguntas.length) * 100);
  const mm = String(Math.floor(segs / 60)).padStart(2, "0");
  const ss = String(segs % 60).padStart(2, "0");
  return (
    <section className="psn-examen">
      <header>
        <h4>Modo estudio · examen simulado</h4>
        <span className="psn-chip">{preguntas.length} preguntas · {mm}:{ss}</span>
      </header>
      <p className="psn-nota">Mezcla perspectivas, escuelas, casos, puentes del diccionario y autores. Cada intento arma preguntas nuevas.</p>
      {preguntas.map((p, i) => (
        <fieldset key={i} className={fin ? (resp[i] === p.ok ? "ok" : "mal") : ""}>
          <legend><span className="psn-chip">{p.tipo}</span> {i + 1}. {p.q}</legend>
          {p.cita && <blockquote>{p.cita}</blockquote>}
          <div>
            {p.ops.map((o) => (
              <button key={o} disabled={fin} className={`${resp[i] === o ? "sel" : ""} ${fin && o === p.ok ? "correcta" : ""}`} onClick={() => setResp({ ...resp, [i]: o })}>{o}</button>
            ))}
          </div>
          {fin && <p className="psn-nota">{resp[i] === p.ok ? "✓ " : `✗ Respuesta: ${p.ok}. `}{p.exp}</p>}
        </fieldset>
      ))}
      <div className="psn-examen-acc">
        {!fin ? (
          <button className="psn-btn psn-btn-primario" onClick={() => setFin(true)} disabled={Object.keys(resp).length < preguntas.length}>Entregar ({Object.keys(resp).length}/{preguntas.length})</button>
        ) : (
          <>
            <span className="psn-nota-final">{aciertos}/{preguntas.length} · {nota}/100 · {mm}:{ss}</span>
            <button className="psn-btn" onClick={() => { setRonda(ronda + 1); setResp({}); setFin(false); setT0(Date.now()); setSegs(0); }}>Nuevo examen</button>
          </>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ */
/*  TARJETAS DE REPASO (modo estudio, repetición espaciada)     */
/* ------------------------------------------------------------ */
const CLAVE_REPASO = "psiconautas:repaso";
const INTERVALOS = [0, 1, 3, 7, 21]; // días por caja
const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE_REPASO) || "{}"); } catch { return {}; } };
const guardar = (o) => { try { localStorage.setItem(CLAVE_REPASO, JSON.stringify(o)); } catch { /* sin almacenamiento */ } };

export function TarjetasRepaso({ glosario, escuelas, colorDe }) {
  const [est, setEst] = useState(leer);
  const [ver, setVer] = useState(false);
  const [ronda, setRonda] = useState(0);
  const hoy = Math.floor(Date.now() / 86400000);
  const porId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e])), [escuelas]);
  const conDef = useMemo(() => glosario.filter((g) => g.definicion && g.definicion.length > 20 && g.tipo === "concepto"), [glosario]);
  const clave = (g) => g.escuela + "|" + g.termino;
  const carta = useMemo(() => {
    const vencidas = conDef.filter((g) => est[clave(g)] && est[clave(g)].due <= hoy);
    const nuevas = conDef.filter((g) => !est[clave(g)]);
    const pool = vencidas.length ? vencidas : nuevas;
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }, [ronda, conDef]);
  const resp = (sabia) => {
    const k = clave(carta);
    const caja = sabia ? Math.min((est[k]?.box ?? 0) + 1, INTERVALOS.length - 1) : 1;
    const n = { ...est, [k]: { box: caja, due: hoy + INTERVALOS[caja] } };
    setEst(n);
    guardar(n);
    setVer(false);
    setRonda((r) => r + 1);
  };
  const vistas = Object.keys(est).length;
  const dominadas = Object.values(est).filter((x) => x.box >= 3).length;
  const vencidas = Object.values(est).filter((x) => x.due <= hoy).length;
  const E = carta ? porId[carta.escuela] : null;
  return (
    <section className="psn-repaso">
      <header>
        <h4>Tarjetas de repaso</h4>
        <span>
          <i className="psn-chip">{vistas} vistas</i>
          <i className="psn-chip">{dominadas} dominadas</i>
          <i className="psn-chip">{vencidas} por repasar hoy</i>
        </span>
      </header>
      {carta && E ? (
        <article className="psn-carta" style={{ "--pc": colorDe(E.perspectiva) }}>
          <small>{E.perspectiva} · {E.nombre}</small>
          <h5>{carta.termino}</h5>
          {ver ? (
            <>
              <p>{carta.definicion}</p>
              <div className="psn-carta-acc">
                <button className="psn-btn" onClick={() => resp(false)}>Repasar pronto</button>
                <button className="psn-btn psn-btn-primario" onClick={() => resp(true)}>Lo sabía</button>
              </div>
            </>
          ) : (
            <button className="psn-btn" onClick={() => setVer(true)}>Ver definición</button>
          )}
        </article>
      ) : (
        <p className="psn-vacio">No quedan tarjetas pendientes por hoy.</p>
      )}
      <p className="psn-aviso">Repetición espaciada: lo que sabes reaparece cada vez más tarde (1, 3, 7 y 21 días); lo que no, vuelve mañana. Tu progreso se guarda solo en este navegador.</p>
    </section>
  );
}
