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
    id: "aceptacion",
    titulo: "Aceptación y contención de lo difícil",
    pregunta: "¿Cuál es la actitud ante el malestar: combatirlo, sostenerlo o abrirse a él?",
    celdas: [
      { e: "h1", t: "Aceptación incondicional", matiz: "Actitud del terapeuta hacia la persona; es condición relacional del cambio." },
      { e: "p3", t: "Contención (Bion)", matiz: "El terapeuta recibe y transforma lo insoportable para devolverlo tolerable; la aceptación es función de procesamiento." },
      { e: "p3b", t: "Holding (Winnicott)", matiz: "Sostén del ambiente que permite existir sin angustia insoportable." },
      { e: "c5", t: "Aceptación radical", matiz: "Aceptar la realidad como paso previo al cambio; se entrena como habilidad." },
      { e: "c2", t: "Aceptación incondicional (de sí, de otros, de la vida)", matiz: "Antídoto filosófico frente a las exigencias absolutistas; se argumenta, no solo se siente." },
      { e: "c4", t: "Evitación experiencial", matiz: "Es el polo contrario: el problema es el control del malestar, no el malestar mismo." },
      { e: "t3", t: "Judo Psicológico (Técnica de Aceptación)", matiz: "Usar la emoción negativa como material de trabajo en lugar de combatirla." },
    ],
    diferencia: "Para unos la aceptación es una actitud del terapeuta (humanista, psicodinámico); para otros es una postura que la persona aprende frente a su experiencia (cognitivo-conductual, transpersonal).",
    falso: "«Aceptación incondicional» (Rogers) valora a la persona; «aceptación radical» acepta la realidad. No son intercambiables, aunque comparten la palabra.",
  },
  {
    id: "alianza",
    titulo: "Relación terapéutica y alianza",
    pregunta: "¿Qué vínculo entre terapeuta y consultante hace posible el trabajo?",
    celdas: [
      { e: "p2", t: "Alianza terapéutica", matiz: "Parte realista y colaborativa de la relación, distinta de la transferencia." },
      { e: "h4", t: "La Relación Terapéutica como Encuentro Curativo", matiz: "La relación misma es lo que cura, más que las interpretaciones." },
      { e: "s2", t: "Joining (acomodación)", matiz: "El terapeuta se acomoda al lenguaje y estilo de la familia como paso previo a reestructurar." },
      { e: "c3", t: "Empirismo colaborativo", matiz: "Terapeuta y paciente investigan juntos la validez de los pensamientos." },
      { e: "i1", t: "Alianza de trabajo", matiz: "Factor común con peso propio sobre el resultado, sea cual sea el modelo." },
      { e: "t2", t: "Contenedor seguro y presencia del terapeuta", matiz: "Crear un entorno protegido para que la experiencia se despliegue." },
    ],
    diferencia: "El psicodinámico la distingue de la transferencia; el humanista la hace el mecanismo central; el sistémico la entiende como acomodación al sistema; el cognitivo-conductual, como trabajo cooperativo.",
    falso: "«Alianza» no significa lo mismo en todas partes: en psicoanálisis es un aspecto de la relación; en la integradora, un factor común transversal.",
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
  {
    id: "supuestos",
    titulo: "Creencias de fondo sobre uno mismo y el mundo",
    pregunta: "¿Qué estructura previa organiza cómo la persona interpreta lo que vive?",
    celdas: [
      { e: "h5", t: "Perspectiva del mundo (Worldview)", matiz: "Concepción personal de la realidad, necesariamente parcial." },
      { e: "p4b", t: "Principios organizadores", matiz: "Esquemas prerreflexivos afectivo-relacionales de la primera infancia." },
      { e: "c3", t: "Creencias nucleares (core beliefs)", matiz: "Ideas absolutas y globales, más profundas que los pensamientos automáticos." },
      { e: "c16", t: "Cuberantes (operantes cubiertas) y conducta gobernada por reglas", matiz: "La conducta verbal se explica como operante encubierta y reglas." },
    ],
    diferencia: "Se pasa de lo prerreflexivo (psicodinámico) a lo explícito y discutible (cognitivo) o a la regla verbal (conductual). El humanista lo trata como horizonte de sentido personal.",
    falso: "«Creencia» es una proposición discutible para el cognitivo, pero para el relacional-psicodinámico lo nuclear no es proposicional: no se refuta, se revive y se reelabora.",
  },
];
