/* Paralelos entre perspectivas: cada uno agrupa términos del glosario que responden a la
   misma pregunta clínica. Los términos se resuelven contra el glosario (definición y fuente
   salen de allí); «matiz», «diferencia» y «falso» son síntesis orientativa de redacción propia. */
export const PARALELOS = [
  {
    id: "distancia",
    titulo: "Tomar distancia de la propia experiencia",
    pregunta: "¿Cómo se ayuda a la persona a no quedar pegada a un pensamiento, emoción o rol?",
    celdas: [
      { e: "h6", t: "Autodistanciamiento (Antagonismo Psiconoético Facultativo)", matiz: "Es una capacidad de la persona espiritual: se distancia de lo psicofísico para tomar postura. Se apoya en el sentido, no en una técnica." },
      { e: "t3", t: "Desidentificación", matiz: "Ejercicio de reconocer que se tiene un contenido sin ser reducible a él; el horizonte es la identidad más amplia." },
      { e: "c4", t: "Defusión", matiz: "Técnica para cambiar la relación con el pensamiento sin discutir su contenido; criterio de éxito: la utilidad, no la verdad." },
      { e: "c8", t: "Descentramiento (decentering)", matiz: "Observar los pensamientos como eventos mentales; suele medirse como mecanismo de cambio." },
      { e: "s6", t: "Externalización", matiz: "La distancia es conversacional y se dirige al problema: la persona no es el problema." },
      { e: "p4", t: "Mentalización", matiz: "Pensar los estados mentales propios y ajenos como representaciones; se desarrolla en la relación de apego." },
    ],
    diferencia: "Humanista y transpersonal lo plantean como capacidad o identidad más amplia; el cognitivo-conductual como habilidad entrenable; el sistémico como operación del lenguaje; el psicodinámico como función del desarrollo.",
    falso: "«Distancia» no es disociación ni evitación: en todos los casos se busca más contacto con la experiencia, no menos.",
  },
  {
    id: "ciclos",
    titulo: "Patrones que se repiten",
    pregunta: "¿Por qué la persona vuelve una y otra vez a la misma dificultad?",
    celdas: [
      { e: "p1", t: "Compulsión a la repetición", matiz: "Repetición de lo doloroso explicada desde fuerzas pulsionales." },
      { e: "p5", t: "Patrón Cíclico Desadaptativo (CMP)", matiz: "Guion relacional rígido, de origen temprano, que se reedita incluso con el terapeuta." },
      { e: "i3", t: "Psicodinámica cíclica", matiz: "El patrón se mantiene porque provoca respuestas que confirman el temor: círculo vicioso." },
      { e: "c7", t: "Esquemas desadaptativos tempranos", matiz: "Patrones de memoria, emoción y cognición formados en la infancia que se reactivan." },
      { e: "c26", t: "Círculo vicioso de evitación (TRAP/TRAC)", matiz: "La evitación reduce el contacto con reforzadores y mantiene el problema." },
      { e: "s4", t: "Juego familiar", matiz: "Reglas relacionales implícitas en las que el síntoma cumple una función." },
    ],
    diferencia: "La explicación cambia: pulsión (Freud), relación temprana (CMP, esquemas), aprendizaje (TRAP) o función en el sistema (juego familiar). La clínica coincide en que el patrón se sostiene a sí mismo.",
    falso: "«Esquema» no es igual en psicodinámica y cognitivo: aquí es una estructura de cognición y memoria; allá, una organización relacional.",
  },
];

/* Matices que se agregan a temas transversales ya existentes (mismo tema, no se duplica). */
export const EXTRAS = {
  relacion_terapeutica: { diferencia: "El psicodinámico la distingue de la transferencia; el humanista la hace el mecanismo central; el sistémico la entiende como acomodación al sistema; el cognitivo-conductual, como trabajo cooperativo.", falso: "«Alianza» no significa lo mismo en todas partes: en psicoanálisis es un aspecto de la relación; en la integradora, un factor común transversal." },
  atencion_plena: { diferencia: "Para unos la aceptación es una actitud del terapeuta (humanista, psicodinámico); para otros es una postura que la persona aprende frente a su experiencia (cognitivo-conductual, transpersonal).", falso: "«Aceptación incondicional» (Rogers) valora a la persona; «aceptación radical» acepta la realidad. No son intercambiables, aunque comparten la palabra." },
  pensamiento: { diferencia: "Se pasa de lo prerreflexivo (psicodinámico) a lo explícito y discutible (cognitivo) o a la regla verbal (conductual). El humanista lo trata como horizonte de sentido personal.", falso: "«Creencia» es una proposición discutible para el cognitivo, pero para el relacional-psicodinámico lo nuclear no es proposicional: no se refuta, se revive y se reelabora." },
};
