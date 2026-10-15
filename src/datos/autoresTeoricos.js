import { ESCUELAS_SEED } from "./escuelas.js";

export const AUTORES_TEORICOS = [
  {
    id: "pavlov-watson",
    nombre: "Condicionamiento clásico pavloviano y conductismo metodológico",
    autoresPrincipales: "Iván Pávlov (1849-1936); John B. Watson (1878-1958)",
    disciplina: "Fisiología experimental (Pávlov) y psicología experimental (Watson)",
    obraNuclear:
      "Pávlov, I. P. (1897/1902). The Work of the Digestive Glands; Pávlov, I. P. (1927). Conditioned Reflexes: An Investigation of the Physiological Activity of the Cerebral Cortex; Watson, J. B. (1913). Psychology as the Behaviorist Views It, Psychological Review, 20(2), 158-177 (el «manifiesto conductista»); Watson, J. B., & Rayner, R. (1920). Conditioned Emotional Reactions, Journal of Experimental Psychology, 3(1), 1.",
    aporteSintesis:
      "Pávlov, investigando originalmente la fisiología digestiva (por lo que recibió el Nobel de 1904, antes de sus estudios sobre condicionamiento), descubrió que un estímulo neutro emparejado repetidamente con un estímulo incondicionado llega a evocar por sí solo la respuesta —el reflejo condicionado—, y documentó sistemáticamente las leyes de adquisición, extinción, generalización y discriminación de ese aprendizaje asociativo. Watson tomó ese hallazgo de laboratorio animal y lo convirtió en programa fundacional para toda la psicología: en su «manifiesto conductista» de 1913 declaró que la psicología debía limitarse al estudio de relaciones observables entre estímulo y respuesta, descartando la introspección de «estados de conciencia» como método científico válido. En 1920, junto con Rosalie Rayner, demostró experimentalmente que una emoción humana —el miedo— podía instalarse por condicionamiento clásico (el caso del «pequeño Albert»), extendiendo el principio pavloviano de lo reflejo fisiológico a la esfera emocional humana, con clara relevancia clínica posterior para la comprensión de las fobias. Es, junto con Thorndike y Skinner, uno de los dos pilares de todo el conductismo clínico: fundamenta directamente el grupo 1 respondiente (`c1`, `c12`, `c13`, `c14`); a través de la arquitectura de Wolpe (jerarquía de exposición, contracondicionamiento), fundamenta también la sensibilización encubierta de Cautela (`c25`) y su Tríada del Autocontrol (`c28`); y, dado que toda técnica de exposición o contracondicionamiento hunde su raíz última en el reflejo condicionado, se cita también de forma directa —no solo por intermediación de Wolpe— en la Reestructuración Racional Sistemática (`c17`), la Terapia de Conducta Racional (`c18`, cuya propia ontología declara que el pensamiento está «regido por las leyes del condicionamiento clásico y operante») y el Entrenamiento en Manejo de la Ansiedad (`c21`, fundamentado explícitamente en «la ley de la inhibición recíproca de Wolpe»). La Teoría del Aprendizaje Social de Bandura (`c10`) lo cita como el extremo de la «primera generación» (condicionamiento clásico y operante estricto) frente al cual se define por contraste mediacional, una relación de fundamento-por-superación, no de mera comparación.",
    ontologia: "El organismo es un sistema de reflejos —innatos e incondicionados, o adquiridos y condicionados— cuya conducta se explica íntegramente por su historia de asociaciones estímulo-estímulo, sin necesidad de postular procesos mentales internos inaccesibles a la observación.",
    epistemologia: "Empirismo experimental estricto: solo cuenta como conocimiento científico lo que puede observarse, medirse y replicarse en condiciones controladas; la introspección queda excluida como método.",
    conceptosAportados: ["Reflejo condicionado / incondicionado", "Estímulo condicionado / incondicionado", "Adquisición, extinción, generalización y discriminación del estímulo", "Conductismo metodológico (el «manifiesto» de 1913)", "Condicionamiento de respuestas emocionales (miedo condicionado)"],
    fuentesVerificacion: "UKEssays (2025); Encyclopedia.com; SimplyPsychology; Structural Learning — todas citando directamente Pavlov (1897/1902, 1927) y Watson (1913, 1920), verificado julio 2026 con múltiples fuentes independientes.",
  },
  {
    id: "thorndikeskinner",
    nombre: "Aprendizaje instrumental y condicionamiento operante",
    autoresPrincipales: "Edward L. Thorndike (1874-1949); B. F. Skinner (1904-1990)",
    disciplina: "Psicología experimental / análisis experimental de la conducta",
    obraNuclear: "Thorndike, E. L. (1898/1911). Animal Intelligence: An Experimental Study of the Associative Processes in Animals (formulación de la ley del efecto); Skinner, B. F. (1938). The Behavior of Organisms: An Experimental Analysis; Skinner, B. F. (1953). Science and Human Behavior.",
    aporteSintesis:
      "Se agrupan deliberadamente en un solo nodo, no en dos: son la misma línea teórica en dos momentos históricos, no dos teorías independientes que coincidan en fundamentar las mismas escuelas. Thorndike, a partir de sus experimentos con gatos en cajas-problema, formuló la «ley del efecto»: las conductas seguidas de una consecuencia satisfactoria se fortalecen y tienden a repetirse; las seguidas de una consecuencia desagradable se debilitan. Skinner tomó ese principio como punto de partida explícito —lo cita como fundamento de su propio trabajo— y lo sistematizó en un programa experimental completo (la «caja de Skinner», los programas de reforzamiento, la distinción entre conducta respondiente y operante), estableciendo que la conducta voluntaria está controlada por sus consecuencias, no por los estímulos que la preceden. Ninguno de los dos administró una psicoterapia clínica propia con pacientes; su legado es un cuerpo de leyes del aprendizaje que otros aplicaron clínicamente después. Fundamenta directamente el grupo 2 de Análisis Conductual Aplicado (`c15`, `c16`, `c24`) y, junto con Bandura, el grupo 3 de Condicionamiento Encubierto (`c23`, `c25`, `c28`). Dentro de las Terapias Contextuales (grupo 4), tres declaran a Skinner por nombre en su propio texto: la DBT de Linehan (`c5`) sintetiza «el conductismo radical (Skinner) para el cambio»; la FAP de Kohlenberg y Tsai (`c6`) «traduce» la relación terapéutica «a principios del conductismo radical (Skinner)»; y la IBCT de Christensen y Jacobson (`c27`) construye su ontología sobre «la distinción skinneriana entre conducta gobernada por reglas... y conducta moldeada por contingencias». La Activación Conductual (`c26`) declara igualmente que «se nutre del conductismo radical y el análisis funcional de Ferster y Skinner». La ACT de Hayes (`c4`) y la Teoría del Aprendizaje Social de Bandura (`c10`) no nombran a Skinner en el mismo grado de detalle técnico, pero ambas son, por diseño, desarrollos directos de los principios del aprendizaje operante y respondiente —la primera como programa contextualista que hereda la tradición analítico-conductual de Skinner sobre la conducta verbal; la segunda como puente que se define explícitamente frente al «condicionamiento clásico y operante estricto» de la primera generación—, por lo que se incluyen aquí como fundamento aun cuando el nombre propio de Skinner no aparezca en cada línea. Excepción deliberada: el Análisis Contingencial o interconductismo (`c11`) NO se incluye pese a compartir el objeto de estudio, porque su propia ficha lo define como un modelo que «rechaza tanto el mentalismo como el mecanicismo E-R-C skinneriano»; ahí la relación con Skinner es de oposición declarada, no de fundamento, y forzarla violaría el mismo criterio que distingue contraste de construcción en el resto de la app.",
    ontologia: "La conducta voluntaria (operante) se explica íntegramente por su historia de consecuencias —reforzamiento y castigo—, no por estados mentales internos ni por estímulos antecedentes; el organismo «opera» sobre su ambiente y ese ambiente selecciona qué conductas persisten.",
    epistemologia: "Empirismo experimental radical: solo es admisible como explicación científica lo verificable en relaciones funcionales observables entre conducta y consecuencia, rechazando explícitamente cualquier variable mentalista inferida como causa.",
    conceptosAportados: ["Ley del efecto", "Condicionamiento operante", "Reforzamiento positivo y negativo", "Castigo", "Programas de reforzamiento", "Moldeamiento por aproximaciones sucesivas", "Conducta respondiente vs. operante"],
    fuentesVerificacion: "SimplyPsychology, OpenStax Psychology 2e, Structural Learning, Wikipedia (Law of Effect) — todas citando directamente Thorndike (1898, 1911) y Skinner (1938), verificado julio 2026 con múltiples fuentes independientes.",
  },
  {
    id: "ciberneticasistemas",
    nombre: "Cibernética y Teoría General de Sistemas",
    autoresPrincipales: "Gregory Bateson (1904-1980); Ludwig von Bertalanffy (1901-1972); Norbert Wiener (1894-1964)",
    disciplina: "Antropología / biología teórica / matemática aplicada",
    obraNuclear:
      "Wiener, N. (1948). Cybernetics: Or Control and Communication in the Animal and the Machine; von Bertalanffy, L. (1968). General System Theory: Foundations, Development, Applications (con artículos previos de 1945 y 1950 en alemán e inglés); Bateson, G. (1972). Steps to an Ecology of Mind (compila su trabajo desde los años 50, incluida la formulación del doble vínculo en Bateson, Jackson, Haley y Weakland, 1956, «Toward a Theory of Schizophrenia»).",
    aporteSintesis:
      "Tres corrientes convergentes, no una sola escuela, importadas a la clínica casi simultáneamente a mediados de siglo. Wiener acuñó «cibernética» para el estudio de los mecanismos de control y comunicación por retroalimentación (feedback), comunes a máquinas, organismos y sistemas sociales. Von Bertalanffy, biólogo, generalizó ese principio a una teoría formal de sistemas abiertos aplicable a cualquier disciplina, sosteniendo que existen leyes isomórficas —de estructura idéntica— que gobiernan sistemas de naturaleza muy distinta. Bateson tomó ambos marcos y los aplicó directamente a la comunicación humana y familiar: su formulación del «doble vínculo» (1956) explica la esquizofrenia como resultado de mensajes contradictorios sostenidos dentro de una relación de la que no se puede escapar, desplazando el foco causal del individuo aislado al patrón de comunicación del sistema completo. Es, con diferencia, la teoría fundante de mayor alcance de todas las revisadas hasta ahora en la app: sostiene, en mayor o menor medida, a las ocho escuelas de la perspectiva sistémica.",
    ontologia: "El objeto de estudio legítimo no es el individuo aislado sino el sistema de relaciones —familiar, comunicacional— regido por bucles de retroalimentación; el síntoma cobra sentido como función dentro de ese sistema, no como propiedad interna de una persona.",
    epistemologia: "Primera cibernética: el observador puede describir el sistema desde una posición relativamente externa y objetiva. (La «segunda cibernética» que corrige esta postura —Maturana, von Foerster— se trata como teoría fundante aparte, más abajo, por marcar una ruptura epistemológica real, no una simple continuación.)",
    conceptosAportados: ["Retroalimentación (feedback) positiva y negativa", "Sistema abierto", "Isomorfismo entre sistemas de distinta naturaleza", "Doble vínculo (double bind)", "Homeostasis del sistema"],
    fuentesVerificacion: "Amazon/editoriales originales (Braziller, MIT Press), ScienceDirect Topics, ResearchGate — fechas de publicación cruzadas contra múltiples fuentes independientes, julio 2026. Nota metodológica: la app ya citaba esta tríada a nivel de perspectiva completa en `FUNDAMENTOS_PERSPECTIVAS.sistemica`, pero no tenía ficha propia ni enlaces a escuelas individuales — vacío que corrige este nodo.",
  },
  {
    id: "segundacibernetica",
    nombre: "Segunda cibernética y constructivismo radical",
    autoresPrincipales: "Humberto Maturana (1928-2021); Heinz von Foerster (1911-2002)",
    disciplina: "Biología teórica (Maturana) / física e ingeniería de sistemas (von Foerster)",
    obraNuclear: "Maturana, H., & Varela, F. (1972). De máquinas y seres vivos: Autopoiesis, la organización de lo vivo; von Foerster, H. (1981). Observing Systems.",
    aporteSintesis:
      "Corrige desde dentro a la primera cibernética: si Wiener y von Bertalanffy aún suponían un observador que describe el sistema desde fuera, Maturana y von Foerster sostienen que el observador es parte inseparable de lo observado —«todo lo dicho es dicho por alguien» (von Foerster)—. Maturana aporta el concepto de autopoiesis: los sistemas vivos se autoproducen y autorregulan a sí mismos, cerrados operacionalmente, por lo que no pueden ser «instruidos» desde fuera, solo perturbados. Este giro epistemológico —de observar sistemas a observar sistemas observantes— es el que permite, en la propia terminología de tu `FUNDAMENTOS_PERSPECTIVAS`, el tránsito de Milán hacia el post-Milán, y de ahí hacia la terapia centrada en soluciones y la narrativa.",
    ontologia: "No existe una realidad familiar objetiva accesible desde fuera; solo hay narrativas y descripciones co-construidas entre el sistema y quien lo observa, incluido el terapeuta.",
    epistemologia: "Constructivismo radical: conocer es construir, no descubrir una realidad preexistente; el terapeuta no puede ocupar una posición neutral externa al sistema que interviene.",
    conceptosAportados: ["Autopoiesis", "Clausura operacional del sistema vivo", "El observador como parte del sistema observado", "Perturbación (en vez de instrucción) como forma de influencia"],
    fuentesVerificacion: "Verificado julio 2026 mediante conocimiento académico consolidado del campo (autopoiesis y segunda cibernética son hitos ampliamente documentados en la historiografía de la terapia sistémica); recomendable una verificación adicional dedicada en una futura iteración, dado que esta entrada se apoyó menos en búsqueda web directa que las demás de esta fase.",
  },
  {
    id: "fenomenologiaexistencial",
    nombre: "Fenomenología y analítica existencial",
    autoresPrincipales: "Edmund Husserl (1859-1938); Martin Heidegger (1889-1976)",
    disciplina: "Filosofía",
    obraNuclear: "Husserl, E. (1900-1901). Investigaciones lógicas; Husserl, E. (1913). Ideas relativas a una fenomenología pura; Heidegger, M. (1927). Ser y tiempo.",
    aporteSintesis:
      "Husserl funda la fenomenología como método riguroso para describir la experiencia vivida tal como se presenta a la conciencia, suspendiendo (epojé) los supuestos sobre su causa última —un método, no una clínica—. Heidegger, discípulo de Husserl, radicaliza ese proyecto hacia una analítica existencial del Dasein (el «ser-ahí» humano arrojado a un mundo, finito, orientado hacia la muerte), desplazando el foco de la conciencia pura hacia la existencia concreta. Ninguno de los dos trató pacientes: Husserl desarrolló un método filosófico de descripción de la experiencia; Heidegger, una ontología de la existencia humana. Son la base explícita del «método fenomenológico» que tu propio `FUNDAMENTOS_PERSPECTIVAS.humanista` declara como núcleo de la perspectiva, y del daseinsanálisis en particular (que aplica clínicamente la analítica heideggeriana), con un cruce documentado también hacia la terapia cognitiva de Beck.",
    ontologia: "La existencia humana (Dasein) se define por estar arrojada a un mundo, ser finita (orientada hacia la muerte) y constituirse en el tiempo, no por poseer una esencia fija previa a la experiencia.",
    epistemologia: "El conocimiento válido de lo humano procede de la descripción rigurosa de la experiencia vivida tal como se manifiesta (fenómeno), no de una explicación causal externa a ella.",
    conceptosAportados: ["Epojé / reducción fenomenológica", "Intencionalidad de la conciencia", "Dasein (ser-ahí)", "Ser-para-la-muerte", "Arrojamiento (Geworfenheit)"],
    fuentesVerificacion: "Hitos filosóficos de consenso académico amplio, verificados julio 2026 con múltiples fuentes independientes ya citadas en la propia app (`FUNDAMENTOS_PERSPECTIVAS.humanista`, `FILOSOFIA_ESCUELA.h11`).",
  },
  {
    id: "apego",
    nombre: "Teoría del apego",
    autoresPrincipales: "John Bowlby (1907-1990); Mary Ainsworth (1913-1999)",
    disciplina: "Psicoanálisis de orientación etológica (Bowlby) / psicología del desarrollo (Ainsworth)",
    obraNuclear: "Bowlby, J. (1969). Attachment and Loss, vol. 1: Attachment; Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). Patterns of Attachment: A Psychological Study of the Strange Situation.",
    aporteSintesis:
      "Bowlby, formado como psicoanalista, se distanció del modelo pulsional freudiano de la energía psíquica y propuso en su lugar una teoría de base etológica: el vínculo entre el infante y su cuidador es un sistema conductual con función evolutiva de supervivencia, no un derivado secundario de la gratificación oral. De esa relación temprana surgen «modelos operativos internos» —representaciones mentales de sí mismo y de los otros— que organizan las expectativas relacionales durante toda la vida. Ainsworth aportó el método empírico que faltaba: la «situación extraña», que permitió clasificar sistemáticamente los patrones de apego (seguro, evitativo, ambivalente, y más tarde desorganizado) y convertir la teoría en un programa de investigación verificable. Ninguno de los dos administra una psicoterapia propia; su teoría fundamenta directamente el psicoanálisis relacional e intersubjetivo, y su lenguaje —«base segura», modelos operativos internos— es citado explícitamente también en la psicoterapia integradora humanista.",
    ontologia: "El ser humano nace con un sistema conductual de apego, de base evolutiva, cuya función es mantener la proximidad con una figura protectora; las relaciones tempranas no son un telón de fondo sino el material con el que se construye la propia estructura psíquica.",
    epistemologia: "Combina la observación etológica sistemática (Ainsworth) con la reformulación teórica de conceptos psicoanalíticos (Bowlby) a la luz de la biología evolutiva, distanciándose de la introspección clínica no verificada como único método.",
    conceptosAportados: ["Sistema conductual de apego", "Modelos operativos internos", "Base segura", "Patrones de apego (seguro, evitativo, ambivalente, desorganizado)", "Situación extraña (método de Ainsworth)"],
    fuentesVerificacion: "Cambridge Core (BJPsych Advances), PMC, Open University, múltiples fuentes académicas independientes citando directamente Bowlby (1969) y Ainsworth et al. (1978), verificado julio 2026.",
  },
  {
    id: "estoicismo",
    nombre: "Estoicismo helenístico",
    autoresPrincipales: "Epicteto (c. 50-135 d.C.); Zenón de Citio (fundador de la escuela, c. 334-262 a.C.); Séneca; Marco Aurelio",
    disciplina: "Filosofía práctica (ética helenística)",
    obraNuclear: "Epicteto, Enquiridión y Disertaciones (compiladas por su discípulo Arriano, s. II d.C.).",
    aporteSintesis:
      "Único candidato de esta fase que no es un teórico científico del siglo XX sino una escuela filosófica de la Antigüedad. Su tesis central —formulada por Epicteto en la apertura del Enquiridión— es que «lo que perturba a los hombres no son las cosas, sino las opiniones que tienen de las cosas»: el sufrimiento no proviene directamente de los acontecimientos externos, sino del juicio evaluativo que la persona hace sobre ellos, sobre el cual sí tiene control. Esta distinción entre lo que depende de uno y lo que no —y la disciplina de examinar y corregir los propios juicios— es citada explícitamente como raíz filosófica declarada tanto por Ellis (TREC) como por Beck (terapia cognitiva) y por Maultsby (terapia de conducta racional), constituyendo el antecedente filosófico común más citado de toda la segunda generación cognitivo-conductual.",
    ontologia: "El ser humano tiene control absoluto solo sobre sus propios juicios, deseos e impulsos; todo lo demás (el cuerpo, la reputación, los eventos externos) escapa a su control directo y no debería ser fuente de perturbación si se comprende correctamente esta distinción.",
    epistemologia: "El conocimiento práctico relevante es el autoexamen racional de los propios juicios, no la acumulación de información sobre el mundo externo; la perturbación emocional es, en el fondo, un error de juicio corregible mediante razón.",
    conceptosAportados: ["Dicotomía de control (lo que depende de uno / lo que no)", "El juicio, no el evento, como causa de la perturbación", "Disciplina del asentimiento (examinar antes de aceptar una impresión como verdadera)", "Distinción entre impresión (phantasía) y juicio sobre la impresión"],
    fuentesVerificacion: "CBT Therapies College (2014), Academy of REBT (2026), y la propia bibliografía ya citada en `FILOSOFIA_ESCUELA` y `fundamentacion` de c2/c3/c18 dentro de esta app — verificado julio 2026 con fuentes independientes.",
  },

  /* ============================================================
     FASE 2 — CASOS HÍBRIDOS: autores que ya son dueños de una
     escuela propia en ESCUELAS_SEED (campo `esTambienEscuelaPropia`)
     pero que además fundamentan activamente otras escuelas. No se
     duplica aquí el contenido íntegro de su ficha clínica —eso ya
     vive en su escuela propia—: esta entrada es deliberadamente más
     breve, y remite a la escuela propia para la profundidad completa.
     ============================================================ */
  {
    id: "freud",
    nombre: "Psicoanálisis clásico (como teoría fundante transversal)",
    autoresPrincipales: "Sigmund Freud (1856-1939)",
    esTambienEscuelaPropia: "p1",
    disciplina: "Psicoanálisis",
    obraNuclear: "Freud, S. (1900). La interpretación de los sueños; Freud, S. (1917). Conferencias de introducción al psicoanálisis.",
    aporteSintesis:
      "Freud es, con diferencia, el caso híbrido más evidente de toda la app: no solo administra su propia escuela (`p1`, Psicoanálisis clásico, con ficha completa), sino que es el punto de partida —por adhesión o por ruptura explícita— del resto de la perspectiva psicodinámica. La Psicología del Yo (`p2`, Anna Freud, Hartmann) extiende directamente su modelo estructural; las Relaciones objetales kleinianas (`p3`) y la Escuela Independiente Británica (`p3b`) reformulan su teoría pulsional hacia lo vincular, esta última rechazando explícitamente el «reduccionismo biológico de la teoría pulsional freudiana» (Fairbairn, citado en Greenberg y Mitchell, 1983) —una ruptura declarada, no una mera coincidencia temática, que es el mismo criterio que ya justifica incluir a Adler y Jung pese a haber roto con él—; el Psicoanálisis Relacional (`p4`) hereda esa misma ruptura pulsional a través de las relaciones objetales británicas y la declara en su propio texto fundacional; la Psicología del Self de Kohut (`p9`) también reformula el legado pulsional hacia el narcisismo como línea de desarrollo propia; y tanto Adler (`p7`, Psicología Individual) como Jung (`p8`, Psicología Analítica) fundaron sus propias escuelas precisamente al romper con él. Dos fichas quedan deliberadamente fuera de `fundamentosTeoricos` pese a su parentesco evidente: la Teoría de los Sistemas Intersubjetivos (`p4b`) llega a Freud solo de forma indirecta, a través de Kohut (`p9`), sin engancharlo textualmente por nombre; y las Terapias Psicodinámicas Breves (`p5`) se comparan sistemáticamente contra «el psicoanálisis clásico» como método e institución, pero sin citar a Freud por nombre ni discutir sus conceptos específicos en su propia ficha —una dependencia genealógica innegable en la práctica clínica, pero no una dependencia textualmente declarada según el mismo criterio estricto que sí se aplica al resto. Ver la ficha completa de `p1` para su fundamentación, ontología y técnicas propias.",
    conceptosAportados: ["Inconsciente dinámico", "Represión y mecanismos de defensa", "Transferencia", "Pulsión", "Aparato psíquico (yo, ello, superyó)"],
    fuentesVerificacion: "Consenso histórico-académico amplio; ver también la propia ficha de p1 dentro de esta app.",
  },
  {
    id: "bandura",
    nombre: "Teoría del aprendizaje social / determinismo recíproco triádico (como teoría fundante transversal)",
    autoresPrincipales: "Albert Bandura (1925-2021)",
    esTambienEscuelaPropia: "c10",
    disciplina: "Psicología del aprendizaje",
    obraNuclear: "Bandura, A. (1977). Social Learning Theory; Bandura, A. (1977). Self-efficacy: Toward a Unifying Theory of Behavioral Change.",
    aporteSintesis:
      "Bandura administra su propia escuela (`c10`, Teoría del Aprendizaje Social, puente explícito entre la primera y la segunda generación conductual), pero su noción de agencia humana, autoeficacia y determinismo recíproco (persona-conducta-ambiente) reaparece como fundamento explícito en ACT (el «yo-como-contexto» y la flexibilidad psicológica presuponen un agente activo, no un receptor pasivo de contingencias), en la Tríada de Autocontrol de Kanfer y Rehm (que cita directamente la autoeficacia bandureana en la fase de autoevaluación) y en la Activación Conductual (que hereda de él la idea de que el ambiente y la conducta se determinan mutuamente, no en una sola dirección). Ver la ficha completa de `c10` para su fundamentación íntegra.",
    conceptosAportados: ["Determinismo recíproco triádico", "Autoeficacia percibida", "Aprendizaje vicario / observacional", "Capacidad de previsión (expectativas)"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de c10 dentro de esta app.",
  },
  {
    id: "maslow",
    nombre: "Jerarquía de necesidades y autorrealización (como teoría fundante transversal)",
    autoresPrincipales: "Abraham Maslow (1908-1970)",
    esTambienEscuelaPropia: "t1",
    disciplina: "Psicología humanista",
    obraNuclear: "Maslow, A. H. (1962/1968). Toward a Psychology of Being.",
    aporteSintesis:
      "Maslow administra su propia escuela transpersonal (`t1`, Psicología Trascendental / Cuarta Fuerza) y es coautor histórico de la propia perspectiva humanista (jerarquía de necesidades, autorrealización). Su giro tardío hacia las «metanecesidades» y la experiencia cumbre —más allá de la autorrealización— es el fundamento explícito que la Psicología Positiva de Seligman (`h2`) retoma y somete a medición empírica sistemática. Ver la ficha completa de `t1` para su fundamentación íntegra.",
    conceptosAportados: ["Jerarquía de necesidades", "Autorrealización", "Metanecesidades", "Experiencia cumbre (peak experience)"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de t1 dentro de esta app.",
  },
  {
    id: "watzlawick",
    nombre: "Pragmática de la comunicación humana (como teoría fundante transversal)",
    autoresPrincipales: "Paul Watzlawick (1921-2007)",
    esTambienEscuelaPropia: "s3",
    disciplina: "Comunicación humana / terapia sistémica",
    obraNuclear: "Watzlawick, P., Beavin, J. H., & Jackson, D. D. (1967). Pragmatics of Human Communication.",
    aporteSintesis:
      "Watzlawick administra su propia escuela (`s3`, Terapia Estratégica y MRI) y es, con Bateson, el puente entre la cibernética de primer orden y su aplicación clínica directa a la comunicación familiar. Sus axiomas de la comunicación («es imposible no comunicar», cambio 1 y cambio 2) reaparecen como referencia explícita en la Escuela de Milán —que parte del mismo marco pragmático antes de virar hacia la segunda cibernética— y en la Terapia Narrativa, que hereda de él la idea de que el problema no reside en el individuo sino en el patrón de comunicación que lo mantiene. Ver la ficha completa de `s3` para su fundamentación íntegra.",
    conceptosAportados: ["Axiomas de la comunicación humana", "Cambio de tipo 1 y tipo 2", "Soluciones intentadas como mantenedoras del problema"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de s3 dentro de esta app.",
  },
  {
    id: "jung",
    nombre: "Psicología analítica: inconsciente colectivo e individuación (como teoría fundante transversal)",
    autoresPrincipales: "Carl Gustav Jung (1875-1961)",
    esTambienEscuelaPropia: "p8",
    disciplina: "Psicoanálisis (rama disidente) / psicología profunda",
    obraNuclear: "Jung, C. G. (1921). Tipos psicológicos; Jung, C. G. Obra completa, vol. 9: Arquetipos e inconsciente colectivo.",
    aporteSintesis:
      "Jung administra su propia escuela psicodinámica (`p8`, Psicología Analítica), fundada precisamente al romper con Freud. De los tres candidatos transpersonales revisados (t2, t3, t4), solo uno resiste el mismo criterio estricto que se aplica al resto de la app: la Psicosíntesis de Assagioli (`t3`) sí lo cita textualmente y por nombre —su propia notaDistincion documenta que Assagioli «adopta explícitamente el Inconsciente Colectivo y los Arquetipos» (Ferrucci, 1982, citando a Jung)—, así que conserva `jung` en su `fundamentosTeoricos`. La Psicología Transpersonal general (`t2`) y el Enfoque Holotrópico de Grof (`t4`) no nombran a Jung en ningún punto de su propia ficha —su genealogía documentada pasa por Maslow, Sutich y Fadiman (t2) y por la investigación clínica con LSD y respiración holotrópica (t4)—, así que se retiró la cita de ambas: era una conexión plausible por parentesco de época y vocabulario (arquetipos, inconsciente colectivo), pero no una dependencia declarada en el propio texto, y por tanto no cumplía el estándar que sí exigimos en el resto de la app. Ver la ficha completa de `p8` para su fundamentación íntegra.",
    conceptosAportados: ["Inconsciente colectivo", "Arquetipo", "Individuación", "Numinoso", "Sincronicidad"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de p8 dentro de esta app. Conexión hacia t2/t3/t4 marcada como influencia documentada pero no verificada con la misma profundidad que los demás nodos — ver nota en Fase 4 de la hoja de ruta.",
  },
  /* ============================================================
     FASE 1 — TEORÍA FUNDANTE PURA AÑADIDA EN REVISIÓN POSTERIOR:
     autor sin escuela clínica propia administrada en esta app, en el
     mismo estatuto que pavlov-watson, thorndikeskinner,
     ciberneticasistemas, etc. Se detectó como vacío real: Meichenbaum
     cita explícitamente este marco en la fundamentación de `c19`
     dentro de la propia app, pero el marco en sí no tenía ficha.
     ============================================================ */
  {
    id: "vygotsky",
    nombre: "Internalización sociocultural del habla autorreguladora",
    autoresPrincipales: "Lev Vygotsky (1896-1934); Alexander Luria (1902-1977)",
    disciplina: "Psicología del desarrollo / neuropsicología soviética",
    obraNuclear:
      "Vygotsky, L. S. (1934/1962). Pensamiento y lenguaje (Thought and Language), MIT Press; Luria, A. R. (1961). The Role of Speech in the Regulation of Normal and Abnormal Behavior, Pergamon Press.",
    aporteSintesis:
      "Vygotsky, a diferencia de Piaget, sostuvo que el habla egocéntrica infantil (hablar en voz alta consigo mismo mientras se juega o se resuelve una tarea) no desaparece sin más con la edad, sino que se interioriza progresivamente en habla encubierta —pensamiento verbal— que pasa a regular la propia conducta desde dentro; el desarrollo cognitivo es, en este sentido, un proceso de internalización de herramientas culturales originalmente compartidas socialmente («toda función psíquica superior aparece dos veces: primero entre personas, luego dentro de la persona»). Luria extendió experimentalmente esta tesis, documentando cómo el habla adulta (la de un cuidador o instructor) regula primero la conducta motora del niño desde fuera, y cómo esa regulación se traslada gradualmente al propio habla del niño y, más tarde, a su habla interna silenciosa. Ninguno de los dos administró una psicoterapia clínica propiamente dicha; su legado llega a la clínica occidental sobre todo a través de Donald Meichenbaum, quien cita explícitamente este marco como el fundamento teórico de su Entrenamiento en Autoinstrucciones (`c19`) y, por extensión, del componente de adquisición de habilidades de la Inoculación de Estrés (`c20`).",
    ontologia: "La mente individual no es un sistema aislado que madura por sí solo, sino el resultado de la internalización de instrumentos culturales —y, ante todo, del lenguaje— originalmente proporcionados por otros en la interacción social; el pensamiento verbal maduro es habla internalizada, no una facultad innata que simplemente se despliega.",
    epistemologia: "Genético-evolutiva y culturalista: el método propio consiste en observar la transición longitudinal de una función psíquica desde su forma interpsíquica (compartida, entre personas) hacia su forma intrapsíquica (interiorizada), no en aislar variables estímulo-respuesta ni en la introspección de contenidos ya formados.",
    conceptosAportados: ["Internalización del habla (de la regulación externa al habla encubierta)", "Habla egocéntrica como paso intermedio del desarrollo", "Zona de desarrollo próximo", "Mediación por herramientas culturales (el lenguaje como instrumento psicológico)"],
    fuentesVerificacion: "Vygotsky (1934/1962) y Luria (1961) son hitos de amplio consenso académico en psicología del desarrollo; la cita explícita de este marco por Meichenbaum como fundamento de su Entrenamiento en Autoinstrucciones (`c19`) está documentada en la propia fundamentación de esa ficha dentro de esta app. Verificado julio 2026.",
  },
  /* ============================================================
     FASE 2 (continuación) — más casos híbridos detectados en revisión
     posterior: autores con escuela clínica propia en ESCUELAS_SEED
     cuyo vocabulario resultó, tras auditoría, citado explícitamente
     por seis o más fichas de otras escuelas — el mismo criterio que
     ya justificaba a freud, bandura, maslow, watzlawick y jung.
     ============================================================ */
  {
    id: "wolpe",
    nombre: "Inhibición recíproca y desensibilización sistemática (como teoría fundante transversal)",
    autoresPrincipales: "Joseph Wolpe (1915-1997)",
    esTambienEscuelaPropia: "c1",
    disciplina: "Psiquiatría conductual",
    obraNuclear: "Wolpe, J. (1958). Psychotherapy by Reciprocal Inhibition. Stanford University Press.",
    aporteSintesis:
      "Wolpe administra su propia escuela (`c1`, Desensibilización Sistemática), pero su arquitectura técnica —la jerarquía graduada de situaciones ansiógenas puntuada en Unidades Subjetivas de Ansiedad (USA), la respuesta incompatible como mecanismo de contracondicionamiento y el principio mismo de la inhibición recíproca— se convirtió en la plantilla estructural que otras escuelas conductuales y cognitivo-conductuales adoptaron, criticaron o reformularon explícitamente: la Reestructuración Racional Sistemática (`c17`) fusiona literalmente su arquitectura de jerarquía-exposición con el modelo ABC de Ellis; el Entrenamiento en Manejo de la Ansiedad (`c21`) nace de la insatisfacción explícita con las limitaciones de la DS clásica ante la ansiedad flotante sin estímulo delimitado; la Terapia Implosiva (`c12`) y la Sensibilización Encubierta (`c25`) invierten deliberadamente su lógica de exposición graduada por una de confrontación masiva o encubierta; y la Tríada del Autocontrol de Cautela (`c28`) retoma su escala USA como instrumento de monitoreo. Pocos autores de esta app son citados tan sistemáticamente, ya sea para continuar su modelo o para definirse en oposición a él.",
    conceptosAportados: ["Inhibición recíproca / contracondicionamiento", "Jerarquía de situaciones ansiógenas", "Escala de Unidades Subjetivas de Ansiedad (USA)", "Relajación muscular progresiva como respuesta incompatible"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de c1 dentro de esta app. Las cinco escuelas que lo citan explícitamente (c12, c17, c21, c25, c28) están documentadas en sus respectivas fundamentaciones. Corrección de auditoría: c14 (Salter) se mencionaba antes en esta lista, pero su propio texto aclara que Conditioned Reflex Therapy (1949) es «anterior incluso a la obra de Wolpe» (1958); la precedencia cronológica corre en sentido contrario, así que no es un caso de c14 citando a Wolpe como fundamento y se retiró de esta lista.",
  },
  {
    id: "ellis",
    nombre: "Terapia Racional Emotiva Conductual: el modelo A-B-C (como teoría fundante transversal)",
    autoresPrincipales: "Albert Ellis (1913-2007)",
    esTambienEscuelaPropia: "c2",
    disciplina: "Psicología clínica",
    obraNuclear: "Ellis, A. (1962). Reason and Emotion in Psychotherapy. Lyle Stuart.",
    aporteSintesis:
      "Ellis administra su propia escuela (`c2`, TREC), pero su modelo A-B-C —las creencias (B), no los acontecimientos activadores (A), determinan la consecuencia emocional (C)— es el molde explícito sobre el que se construyen o del que se distancian deliberadamente varias escuelas posteriores de la segunda generación cognitivo-conductual: la Terapia Cognitiva de Beck (`c3`) desarrolla en paralelo una arquitectura afín (con la que Ellis mismo compitió por prioridad histórica); la Reestructuración Racional Sistemática (`c17`) fusiona su ABC con la arquitectura conductual de Wolpe bajo el paradigma del autocontrol; y la Terapia de Conducta Racional de Maultsby (`c18`) nace de una colaboración directa con Ellis (coautores de la Imaginación Racional Emotiva) antes de escindirse en un modelo propio con un criterio de racionalidad biologicista en vez de filosófico. Wilber (`t5`) cita además explícitamente la Terapia Cognitiva —heredera del linaje de Ellis— como la modalidad de tratamiento asignada al Fulcro 4 en su Modelo Espectral.",
    conceptosAportados: ["Modelo A-B-C (Acontecimiento activador-Creencia-Consecuencia)", "Creencias irracionales absolutistas («debería», «tengo que»)", "Disputa (D) de creencias irracionales", "Aceptación incondicional (de uno mismo, de los demás, de la vida)"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de c2 dentro de esta app. La genealogía directa hacia c17 y c18 (incluida la colaboración histórica con Maultsby) está documentada en las fundamentaciones respectivas de esas fichas.",
  },
  {
    id: "beck",
    nombre: "Terapia cognitiva: tríada cognitiva y distorsiones del pensamiento (como teoría fundante transversal)",
    autoresPrincipales: "Aaron T. Beck (1921-2021)",
    esTambienEscuelaPropia: "c3",
    disciplina: "Psiquiatría cognitiva",
    obraNuclear: "Beck, A. T. (1967). Depression: Causes and Treatment. University of Pennsylvania Press; Beck, A. T., Rush, A. J., Shaw, B. F., Emery, G. (1979). Cognitive Therapy of Depression. Guilford Press.",
    aporteSintesis:
      "Además de administrar su propia escuela (`c3`), su vocabulario de «distorsiones cognitivas», «pensamientos automáticos» y «esquemas» es adoptado como fundamento genealógico directo por cuatro escuelas más, en un grado de dependencia lo bastante fuerte como para justificar la etiqueta de `fundamentosTeoricos` (no solo una mención comparativa): la Terapia de Esquemas (`c7`) —Young fue discípulo directo de Beck antes de fundar su propio modelo— extiende sus esquemas nucleares hacia el terreno de la personalidad; la MBCT (`c8`) nace de un encargo explícito para adaptar el mantenimiento de la propia terapia cognitiva de Beck a la prevención de recaídas; la Reestructuración Racional Sistemática (`c17`) lo agrupa, junto con Ellis, dentro de la «segunda generación» de reestructuración cognitiva que ella misma sintetiza; y la Activación Conductual (`c26`) surge literalmente de desmantelar el paquete de tratamiento de Beck en un estudio de componentes (Jacobson et al., 1996), aislando su parte conductual. Fuera de estas cuatro, el nombre de Beck aparece también como término de contraste crítico en otras fichas de la app (p. ej. ACT se define en parte por su distancia frente al «debate de contenidos» de estilo beckiano, y varias fichas psicodinámicas lo usan como punto de comparación epistemológica) — esas menciones se dejan deliberadamente fuera de `fundamentosTeoricos`, porque una oposición declarada no es un fundamento, por relevante que sea la comparación.",
    conceptosAportados: ["Tríada cognitiva (visión negativa de sí mismo, el mundo y el futuro)", "Distorsiones cognitivas", "Pensamientos automáticos", "Esquemas nucleares e intermedios", "Empirismo colaborativo y descubrimiento guiado"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de c3 dentro de esta app. Las once escuelas que lo citan explícita o comparativamente están documentadas en sus respectivas fundamentaciones, ontologías o notas de distinción.",
  },
  {
    id: "rogers",
    nombre: "Terapia centrada en la persona: condiciones necesarias y suficientes (como teoría fundante transversal)",
    autoresPrincipales: "Carl Rogers (1902-1987)",
    esTambienEscuelaPropia: "h1",
    disciplina: "Psicología humanista",
    obraNuclear: "Rogers, C. R. (1951). Client-Centered Therapy. Houghton Mifflin; Rogers, C. R. (1957). The necessary and sufficient conditions of therapeutic personality change. Journal of Consulting Psychology, 21(2).",
    aporteSintesis:
      "Rogers administra su propia escuela (`h1`) pero su tríada de condiciones terapéuticas —congruencia, consideración positiva incondicional y comprensión empática precisa— es el fundamento actitudinal que otras escuelas humanistas dan por establecido y del que parten para añadir componentes propios: la Terapia Feminista (`h10`) hereda de él el rechazo a la autoridad directiva del terapeuta antes de politizar esa postura; Maslow (`t1`), coautor histórico de la perspectiva humanista, comparte con Rogers la confianza en una fuerza motivacional innata hacia el crecimiento, aunque la desarrolla hacia una «cognición del ser» más específica y excepcional que la tendencia actualizante rogeriana ordinaria y continua. La Psicología Positiva de Seligman (`h2`) también declara esta dependencia de forma explícita y textual —adopta literalmente sus condiciones necesarias y suficientes como infraestructura relacional obligatoria antes de aplicar su propio protocolo manualizado (Seligman, 2011)—, pero solo en el plano actitudinal: en método, directividad y manualización h2 se define en franca oposición a h1, por lo que la cita debe leerse como fundamento parcial, no como parentesco general de escuela. Fuera de la perspectiva humanista, la propia Terapia Familiar Experiencial de Satir (`s7`) transpone directamente su noción de congruencia desde la díada individual hacia la comunicación familiar completa.",
    conceptosAportados: ["Tendencia actualizante", "Congruencia", "Consideración positiva incondicional", "Comprensión empática precisa", "Condiciones necesarias y suficientes del cambio terapéutico"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de h1 dentro de esta app.",
  },
  {
    id: "kohut",
    nombre: "Psicología del self: selfobjeto y empatía como método (como teoría fundante transversal)",
    autoresPrincipales: "Heinz Kohut (1913-1981)",
    esTambienEscuelaPropia: "p9",
    disciplina: "Psicoanálisis",
    obraNuclear: "Kohut, H. (1971). The Analysis of the Self. International Universities Press; Kohut, H. (1977). The Restoration of the Self. International Universities Press.",
    aporteSintesis:
      "Kohut administra su propia escuela (`p9`, Psicología del Self) pero su ruptura con el dualismo pulsional clásico —sustituir la agresión y la libido como motores primarios por la necesidad estructural de selfobjetos empáticos— es citada, adoptada o contrastada explícitamente en varias escuelas psicodinámicas más. Klein (`p3`) y Kohut comparten el interés por las fuerzas destructivas tempranas pero con estatus teórico opuesto (envidia primaria constitucional vs. rabia narcisista secundaria a una herida); Winnicott y Fairbairn (`p3b`) anticipan en parte su sensibilidad hacia el ambiente relacional temprano; la Teoría de los Sistemas Intersubjetivos de Stolorow (`p4b`) se declara heredera directa de su giro hacia la subjetividad del paciente y la falla empática como origen del sufrimiento —su propia notaDistincion la llama «heredera directa de la Psicología del Self de Kohut»—. El Psicoanálisis Relacional (`p4`) comparte con p9 el rechazo a la neutralidad clásica, pero su genealogía declarada pasa por Sullivan y las relaciones objetales británicas, no por Kohut: no se le atribuye este fundamento pese a la afinidad temática, siguiendo el mismo criterio ya usado para distinguir p4 de p4b en la propia notaDistincion de p4. Jung (`p8`), de una tradición distinta, comparte con Kohut la crítica a la frialdad de la neutralidad clásica, pero por una vía completamente independiente. Fuera de la perspectiva psicodinámica, la Terapia de Esquemas de Young (`c7`) adopta su lógica de «reparentalización limitada» como provisión parcial de necesidades no satisfechas.",
    conceptosAportados: ["Selfobjeto", "Empatía como método (introspección vicaria)", "Transferencias especular, gemelar e idealizadora", "Frustración óptima e internalización transmutadora", "Rabia narcisista (como secundaria, no pulsional primaria)"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de p9 dentro de esta app.",
  },
  {
    id: "kanfer",
    nombre: "Modelo cibernético de autorregulación en tres fases (como teoría fundante transversal)",
    autoresPrincipales: "Frederick H. Kanfer (1925-2002)",
    esTambienEscuelaPropia: "c23",
    disciplina: "Psicología conductual",
    obraNuclear: "Kanfer, F. H. (1970). Self-regulation: Research issues and speculations. En Advances in Behavior Modification; Kanfer, F. H., Karoly, P. (1972). Self-control: A behavioristic excursion into the lion's den. Behavior Therapy, 3.",
    aporteSintesis:
      "Kanfer extrajo de la tradición skinneriana un esqueleto cibernético de autorregulación en tres fases —autoobservación, autoevaluación y autorrefuerzo— que él mismo aplicó de forma general y que otros autores adaptaron a problemas específicos: Rehm (`c23`, donde Kanfer figura como coautor teórico) lo formalizó como modelo etiológico de la depresión unipolar; Cautela, trabajando en paralelo dentro del condicionamiento encubierto, empaquetó un procedimiento breve y distinto sobre la misma matriz (nota de deslinde ya documentada en la propia ficha de `c23`); Goldfried, colaborador directo de Kanfer en el paradigma de autocontrol, lo llevó hacia la Reestructuración Racional Sistemática (`c17`); y la Tríada del Autocontrol de Cautela (`c28`) comparte la misma secuencia de tres fases aplicada a impulsos específicos. Nota de alcance: aunque Goldfried coescribió más tarde con D'Zurilla el artículo fundacional de la Terapia de Solución de Problemas (`c22`), esa ficha no nombra a Kanfer en su propio texto —solo a D'Zurilla y Goldfried—, así que deliberadamente no se le atribuye este fundamento; es la biografía compartida de un autor, no una dependencia conceptual declarada en la propia ficha de c22.",
    conceptosAportados: ["Autorregulación en tres fases (autoobservación, autoevaluación, autorrefuerzo)", "Paradigma de autocontrol (self-control) conductual", "Déficits de autorregulación como etiología del malestar"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de c23 dentro de esta app, incluida su nota de deslinde histórico frente a Cautela (c28).",
  },
  {
    id: "pepper",
    nombre: "Contextualismo funcional (raíz filosófica de las Terapias Contextuales)",
    autoresPrincipales: "Stephen C. Pepper (1891-1972)",
    disciplina: "Filosofía de la ciencia",
    obraNuclear: "Pepper, S. C. (1942). World Hypotheses: A Study in Evidence. University of California Press.",
    aporteSintesis:
      "Pepper no fue psicólogo ni clínico: fue un filósofo de la ciencia que catalogó cuatro «hipótesis del mundo» o cosmovisiones raíz —formismo, mecanicismo, organicismo y contextualismo— cada una con su propia metáfora raíz y su propio criterio de verdad. El contextualismo toma como metáfora raíz el «acto-en-contexto» (act-in-context): un evento solo tiene sentido dentro de su textura histórica y situacional completa, nunca aislado en variables; y su criterio de verdad no es la correspondencia con una realidad fija, sino el éxito práctico (workability) de la acción dentro de ese contexto. Hayes y su equipo adoptaron explícitamente el contextualismo funcional pepperiano como la base filosófica de la Terapia de Aceptación y Compromiso (`c4`), cuya propia epistemología lo cita por nombre y año («derivado de la filosofía de Stephen Pepper, 1942»). El mismo lenguaje de «contextualismo funcional» reaparece, sin nombrar a Pepper directamente, como epistemología nuclear de las otras Terapias Contextuales: DBT (`c5`), FAP (`c6`), Activación Conductual (`c26`) e IBCT (`c27`) —comparten la misma raíz filosófica no reconocida en su propio texto, razón por la cual se incluye aquí como fundamento implícito y no explícito para estas cuatro.",
    ontologia: "La realidad no se compone de eventos discretos con propiedades fijas, sino de actos siempre insertos en un contexto histórico-situacional; separar el acto de su contexto para estudiarlo «en sí mismo» es una abstracción que traiciona su naturaleza.",
    epistemologia: "Pragmatista funcional: el criterio de verdad de un análisis psicológico no es su correspondencia con una realidad objetiva, sino su utilidad práctica (workability) para lograr los fines que el propio analista o el propio consultante se ha propuesto dentro de ese contexto.",
    conceptosAportados: ["Contextualismo funcional", "Metáfora raíz del «acto-en-contexto»", "Criterio de verdad pragmático (workability)", "Cuatro hipótesis del mundo (formismo, mecanicismo, organicismo, contextualismo)"],
    fuentesVerificacion: "Pepper (1942) es un clásico ampliamente reconocido en filosofía de la ciencia; su adopción explícita por nombre en la epistemología de ACT (`c4`) está documentada en la propia ficha dentro de esta app. La atribución implícita a c5, c6, c26 y c27 se basa en el lenguaje compartido de «contextualismo funcional» presente en sus propias epistemologías, sin cita textual directa a Pepper. Verificado julio 2026.",
  },
  {
    id: "mowrer",
    nombre: "Teoría bifactorial del aprendizaje (adquisición clásica + mantenimiento operante de la evitación)",
    autoresPrincipales: "O. Hobart Mowrer (1907-1982)",
    disciplina: "Psicología del aprendizaje",
    obraNuclear: "Mowrer, O. H. (1960). Learning Theory and Behavior. Wiley.",
    aporteSintesis:
      "Mowrer resolvió una paradoja que el condicionamiento clásico puro no explicaba bien: si el miedo se extingue al exponerse repetidamente al estímulo temido sin la consecuencia aversiva, ¿por qué las fobias no se autocorrigen con la vida cotidiana? Su teoría bifactorial responde combinando dos mecanismos en dos tiempos: (1) el miedo se ADQUIERE por condicionamiento clásico (un estímulo neutro se asocia con un evento aversivo); (2) la evitación se MANTIENE después por condicionamiento operante, al reforzarse negativamente la conducta de huida o evitación con el alivio inmediato que produce —y esa misma evitación impide que el sujeto compruebe alguna vez que el estímulo ya no predice peligro, bloqueando la extinción natural. Es la explicación etiológica implícita, aunque no siempre nombrada, detrás de casi todas las escuelas de condicionamiento clásico e instrumental de la app: la Terapia Implosiva de Stampfl y Levis (`c12`) la cita explícitamente por nombre como su fundamento etiológico central y diseña la prevención de respuesta precisamente para romper el segundo factor; la propia Desensibilización Sistemática de Wolpe (`c1`) describe el mismo mecanismo de dos tiempos en su psicopatología («la evitación —reforzada negativamente por el alivio inmediato— impide su extinción natural») sin nombrar a Mowrer; el Manejo de Contingencias (`c16`) describe la misma lógica de refuerzo negativo de la evitación aplicada a patrones interpersonales y adictivos; y tanto la Sensibilización Encubierta de Cautela (`c25`, que invierte la estructura para conductas de aproximación) como la Tríada del Autocontrol (`c28`, que su propio texto liga explícitamente «a la misma asimetría temporal de las contingencias que en c25») reutilizan la misma arquitectura de dos factores trasladada al plano encubierto. No fundamenta, en cambio, las terapias aversivas clásicas (`c13`): su propio texto se define explícitamente en contraste con «las terapias de evitación (fobias)», dirigiéndose en su lugar a trastornos de exceso de aproximación —el mecanismo opuesto al que Mowrer explica—, así que deliberadamente no se le atribuye aquí.",
    ontologia: "El miedo y la conducta de evitación no son fenómenos de una sola pieza, sino el producto secuencial de dos procesos de aprendizaje distintos y sucesivos: uno respondiente (adquisición del miedo) y uno operante (mantenimiento de la evitación), cada uno regido por sus propias leyes.",
    epistemologia: "Experimental conductista, en la tradición del aprendizaje animal de laboratorio: las leyes de adquisición y mantenimiento se infieren de diseños controlados de condicionamiento con animales y se extrapolan luego a la etiología clínica humana de fobias y conductas de evitación.",
    conceptosAportados: ["Teoría bifactorial (two-factor theory) de la evitación", "Adquisición clásica del miedo", "Mantenimiento operante por refuerzo negativo de la huida/evitación", "Bloqueo de la extinción natural por evitación crónica"],
    fuentesVerificacion: "Mowrer (1960) está profusamente documentado y citado por nombre dentro de la propia ficha de c12 en esta app (conceptos, psicopatología y referencias), incluida una entrada de GLOSARIO dedicada. La atribución a c1, c16, c25 y c28 es implícita, basada en la coincidencia estructural del mecanismo descrito en sus propios textos, no en una cita textual a Mowrer. La exclusión explícita de c13 se basa en el contraste declarado en su propia ficha. Verificado julio 2026.",
  },
  {
    id: "neisser",
    nombre: "Paradigma del procesamiento de la información",
    autoresPrincipales: "Ulric Neisser (1928-2012)",
    disciplina: "Psicología cognitiva experimental",
    obraNuclear: "Neisser, U. (1967). Cognitive Psychology. Appleton-Century-Crofts.",
    aporteSintesis:
      "Neisser bautizó y sistematizó en un solo libro el programa de investigación que pasaría a llamarse «psicología cognitiva»: la mente concebida como un sistema de capacidad limitada que recibe, codifica, almacena, transforma y recupera información, en explícita ruptura con el conductismo radical que se negaba a teorizar sobre procesos internos no observables. No administró ninguna psicoterapia clínica; su legado es el marco conceptual —el «ser humano como procesador de información»— que la segunda generación de la terapia de conducta adoptó para justificar teóricamente por qué intervenir sobre cogniciones, y no solo sobre conductas manifiestas, podía ser un blanco terapéutico legítimo y científicamente respetable. El Entrenamiento en Autoinstrucciones de Meichenbaum (`c19`) lo cita explícitamente por nombre y año («anclaje en la teoría del procesamiento de la información, Neisser, 1967») para justificar por qué las autoinstrucciones ocupan y dirigen el «canal atencional» de capacidad limitada. El resto de las citas son implícitas —el mismo paradigma sin el nombre propio—: la Terapia Cognitiva de Beck (`c3`) llega a él por la misma «revolución del procesamiento de la información», aunque su propio texto cita específicamente a Atkinson y Shiffrin (1968) en vez de a Neisser; la Inoculación de Estrés (`c20`) «hibrida la teoría del procesamiento de la información» sin nombrar a su fundador; la Reestructuración Racional Sistemática (`c17`) describe al ser humano como «organismo procesador de información» en su propia ontología; y la Terapia de Solución de Problemas (`c22`) describe su mecanismo de cambio como una «redirección del procesamiento» ejecutivo. No se incluyó en escuelas cognitivo-conductuales que carecen de este lenguaje en su propio texto (TREC `c2`, TCR `c18`, Terapia de Esquemas `c7`), ni en escuelas no cognitivo-conductuales revisadas sin evidencia textual de técnicas cognitivas explícitas (p. ej., la Psicoterapia Integradora Humanista, `h8`, cuyo propio arsenal de técnicas es gestáltico-experiencial, no cognitivo-reestructurador).",
    ontologia: "La mente es un sistema de procesamiento de información de capacidad limitada —análogo funcional, no literal, a una computadora— que atraviesa etapas de codificación, almacenamiento, transformación y recuperación; el comportamiento observable es la salida de ese procesamiento interno, no una respuesta directa e inmediata al estímulo.",
    epistemologia: "Cognitivista experimental: los procesos mentales, aunque no observables directamente, son inferibles y medibles mediante paradigmas experimentales controlados (tiempos de reacción, tareas de atención dividida, memoria), rompiendo con el rechazo conductista radical a teorizar sobre lo interno.",
    conceptosAportados: ["Procesamiento de la información como metáfora rectora de la mente", "Capacidad atencional limitada", "Codificación, almacenamiento y recuperación como etapas discretas", "Legitimación científica de las variables cognitivas como blanco terapéutico"],
    fuentesVerificacion: "Neisser (1967) es un hito de amplio consenso en la historia de la psicología cognitiva. Su cita explícita por nombre en c19 está documentada en la propia epistemología de esa ficha dentro de esta app. Las atribuciones implícitas a c3, c17, c20 y c22 se basan en el uso del mismo paradigma o vocabulario de «procesamiento» en sus propios textos, sin cita textual directa a Neisser; se dejaron fuera c2, c18, c7 y h8 por ausencia de ese lenguaje en sus fichas. Verificado julio 2026.",
  },
  {
    id: "klein",
    nombre: "Teoría kleiniana de las relaciones objetales (como teoría fundante transversal)",
    autoresPrincipales: "Melanie Klein (1882-1960); Wilfred R. Bion (1897-1979)",
    esTambienEscuelaPropia: "p3",
    disciplina: "Psicoanálisis",
    obraNuclear: "Klein, M. (1946). Notes on some schizoid mechanisms. International Journal of Psycho-Analysis, 27; Bion, W. R. (1962). Learning from Experience. Heinemann.",
    aporteSintesis:
      "Klein administra su propia escuela (`p3`) pero dos desarrollos posteriores la citan explícitamente como fundamento directo, cada uno tomando piezas distintas de su aparato conceptual. Bion es, según la propia notaDistincion de p3, «continuador directo de esta escuela kleiniana, no de la Independiente»: retoma la identificación proyectiva kleiniana pero la reformula de mecanismo de defensa primitivo a vehículo de comunicación preverbal entre la mente inmadura del bebé y la «capacidad de rêverie» de la madre (o, en la clínica, entre paciente y analista), añadiendo el concepto de contención (containment) y la distinción entre pensamientos que buscan un aparato para pensarlos (el «aparato para pensar los pensamientos»). Kernberg, en la Psicoterapia Centrada en la Transferencia (`p10`), «toma de esta ficha [p3] la escisión y la identificación proyectiva», según la propia notaDistincion de p3, pero las reencuadra dentro de un Diagnóstico Estructural (Neurótico/Límite/Psicótico) y una técnica de contrato terapéutico que Klein nunca formuló —no debe atribuirse a Klein el constructo de «Organización Límite de la Personalidad», acuñación posterior y específica de Kernberg (1967)—.",
    ontologia: "La mente del lactante está poblada desde el nacimiento por fantasías inconscientes pulsionales, organizadas en posiciones (esquizoparanoide, depresiva) que estructuran la relación con objetos internos escindidos en buenos y malos; el instinto de muerte, vuelto hacia afuera como envidia y agresión primarias, es una fuerza constitucional, no derivada del ambiente.",
    epistemologia: "Clínico-inferencial mediante la interpretación de la fantasía inconsciente en la transferencia, incluida la transferencia con niños pequeños vía juego (técnica del juego kleiniano), sin necesidad de validar o intervenir sobre el entorno real del paciente.",
    conceptosAportados: ["Posiciones esquizoparanoide y depresiva", "Identificación proyectiva", "Envidia primaria y objeto interno escindido", "Instinto de muerte vuelto hacia afuera"],
    fuentesVerificacion: "Klein (1946) y Bion (1962) son hitos de amplio consenso en la historiografía psicoanalítica. La cita de Bion como continuador directo de p3 y la de Kernberg tomando prestados sus constructos para p10 están documentadas, ambas, en la propia notaDistincion de la ficha de p3 dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "sullivan",
    nombre: "Psiquiatría interpersonal",
    autoresPrincipales: "Harry Stack Sullivan (1892-1949)",
    disciplina: "Psiquiatría psicoanalítica",
    obraNuclear: "Sullivan, H. S. (1953). The Interpersonal Theory of Psychiatry. Norton.",
    aporteSintesis:
      "Sullivan, formado en el William Alanson White Institute de Nueva York, sostuvo contra el aislacionismo pulsional freudiano que la personalidad «no puede aislarse jamás del complejo de relaciones interpersonales en que vive y se desarrolla el ser humano»: la ansiedad no nace de un conflicto intrapsíquico privado, sino que se transmite y se regula en la relación real con el otro (el concepto de «resonancia empática» o «contagio de la ansiedad» madre-hijo). No administra ninguna ficha propia en esta app —su psiquiatría interpersonal no se modeló como escuela independiente—, pero es citado como cofundador teórico directo, y por nombre, del Psicoanálisis Relacional de Mitchell (`p4`), cuya propia fundamentación lo describe como «la soldadura teórica entre el psicoanálisis interpersonal norteamericano (Sullivan) y la teoría de las relaciones objetales británica (Fairbairn, Winnicott)».",
    ontologia: "La personalidad no es una estructura intrapsíquica que luego se relaciona secundariamente con otros, sino que existe y se constituye únicamente en el campo de las relaciones interpersonales reales, presentes y pasadas; no hay «mente aislada» previa al vínculo.",
    epistemologia: "Clínico-observacional: el «participante-observador» (no el analista neutral) registra y describe los patrones interpersonales recurrentes tal como se manifiestan en la situación real de la entrevista, no interpretaciones inferidas sobre un aparato pulsional oculto.",
    conceptosAportados: ["Psiquiatría interpersonal", "Ansiedad como fenómeno transmitido/regulado interpersonalmente", "Participante-observador", "Rechazo de la «mente aislada»"],
    fuentesVerificacion: "Sullivan (1953) es un clásico de amplio consenso en la historiografía del psicoanálisis interpersonal norteamericano. Su cita explícita, por nombre, como cofundador de p4 está documentada en la propia fundamentación de esa ficha dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "fairbairnwinnicott",
    nombre: "Escuela Independiente Británica (como teoría fundante transversal)",
    autoresPrincipales: "W. Ronald D. Fairbairn (1889-1964); D. W. Winnicott (1896-1971); Michael Balint (1896-1970)",
    esTambienEscuelaPropia: "p3b",
    disciplina: "Psicoanálisis",
    obraNuclear: "Fairbairn, W. R. D. (1952). Psychoanalytic Studies of the Personality. Tavistock; Winnicott, D. W. (1965). The Maturational Processes and the Facilitating Environment. Hogarth Press.",
    aporteSintesis:
      "Fairbairn, Winnicott y Balint administran su propia escuela (`p3b`) pero su rechazo compartido al «modelo de conflicto pulsional» kleiniano-freudiano en favor de un «modelo de déficit ambiental» —la libido busca al objeto más que el placer (Fairbairn, 1952, p. 95; Greenberg y Mitchell, 1983)— es citado explícitamente, junto con el interpersonalismo de Sullivan, como la segunda mitad fundacional del Psicoanálisis Relacional de Mitchell (`p4`): su propia fundamentación describe la escuela como «la soldadura teórica entre el psicoanálisis interpersonal norteamericano (Sullivan) y la teoría de las relaciones objetales británica (Fairbairn, Winnicott)». Es, en ese sentido, un caso doble de fundamento parcial genuino: administra p3b íntegramente y cofundamenta p4 solo en su componente de rechazo al reduccionismo pulsional, no en la totalidad de su aparato clínico propio (holding, objeto transicional, Verdadero/Falso Self), que permanece exclusivo de p3b.",
    ontologia: "La patología no es el resultado de un conflicto pulsional interno del sujeto, sino el registro de un fallo real del ambiente en sostener (holding) un potencial de desarrollo ya presente desde el nacimiento; la libido busca primariamente el objeto, no la descarga de tensión.",
    epistemologia: "Clínico-vivencial: el terapeuta sostiene y valida activamente la experiencia del paciente como respuesta correctiva al fallo ambiental original, en vez de limitarse a interpretar fantasías inconscientes sin intervenir sobre la calidad real del vínculo terapéutico.",
    conceptosAportados: ["Rechazo del instinto de muerte kleiniano", "Modelo de déficit ambiental (frente a conflicto pulsional)", "Holding / sostén", "Verdadero Self / Falso Self", "Objeto transicional"],
    fuentesVerificacion: "Fairbairn (1952) y Winnicott (1965) son clásicos de amplio consenso en la historiografía psicoanalítica; ver además la ficha completa de p3b. Su cita explícita, junto a Sullivan, como cofundadores de p4 está documentada en la propia fundamentación de esa ficha dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "erikson",
    nombre: "Desarrollo psicosocial del Yo a lo largo del ciclo vital",
    autoresPrincipales: "Erik H. Erikson (1902-1994)",
    disciplina: "Psicoanálisis del desarrollo",
    obraNuclear: "Erikson, E. H. (1950). Childhood and Society. Norton.",
    aporteSintesis:
      "Erikson, formado psicoanalíticamente bajo la supervisión de Anna Freud en el Instituto Psicoanalítico de Viena, tomó el Yo adaptativo de la Psicología del Yo (Anna Freud, Hartmann) y lo extendió en dos direcciones que la escuela original, centrada casi exclusivamente en la infancia, no desarrollaba con el mismo detalle: (1) temporal, proponiendo ocho crisis psicosociales sucesivas que cubren la totalidad del ciclo vital, no solo los primeros años (confianza básica vs. desconfianza, autonomía vs. vergüenza, iniciativa vs. culpa, laboriosidad vs. inferioridad, identidad vs. difusión de rol, intimidad vs. aislamiento, generatividad vs. estancamiento, integridad vs. desesperación); y (2) social, insistiendo en que cada crisis se resuelve en la intersección entre la maduración biológica del Yo y las instituciones y expectativas culturales concretas de cada época, no solo en la dinámica intrapsíquica. No administra ninguna ficha propia en esta app; su extensión del modelo yoico está documentada ahora en la propia fundamentación de la Psicología del Yo (`p2`).",
    ontologia: "El desarrollo del Yo no se completa en la infancia ni se limita a la resolución de conflictos pulsionales tempranos: es un proceso que se despliega en ocho etapas sucesivas a lo largo de toda la vida, cada una definida por una tensión dialéctica entre una virtud psicosocial adaptativa y su polo desadaptativo correspondiente.",
    epistemologia: "Observacional-clínica con fuerte componente antropológico-comparativo: Erikson combinó el estudio de caso psicoanalítico con observación transcultural (incluyendo trabajo de campo con comunidades indígenas norteamericanas), buscando regularidades del desarrollo yoico que trascendieran un único contexto cultural sin dejar de reconocer la variación cultural concreta de cada resolución.",
    conceptosAportados: ["Ocho estadios psicosociales del desarrollo", "Crisis de identidad vs. difusión de rol (adolescencia)", "Moratoria psicosocial", "Virtud psicosocial como resolución adaptativa de cada crisis"],
    fuentesVerificacion: "Erikson (1950) es un clásico de amplio consenso en la historiografía de la psicología del desarrollo y del psicoanálisis. Su formación bajo Anna Freud y su extensión de la Psicología del Yo hacia el ciclo vital completo están documentadas ahora en la propia fundamentación de p2 dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "neofreudianosculturalistas",
    nombre: "Neofreudianos culturalistas (revuelta contra el biologicismo pulsional)",
    autoresPrincipales: "Karen Horney (1885-1952); Erich Fromm (1900-1980)",
    disciplina: "Psicoanálisis / Psicología social",
    obraNuclear: "Horney, K. (1937). The Neurotic Personality of Our Time. Norton; Fromm, E. (1941). Escape from Freedom. Farrar & Rinehart.",
    aporteSintesis:
      "Horney y Fromm, junto con Sullivan, formaron entre los años treinta y cuarenta en Nueva York el bloque «culturalista» del neofreudismo: rechazaron la biología pulsional freudiana (la libido como energía cuantificable, los estadios psicosexuales universales) como explicación suficiente de la neurosis, y la sustituyeron por determinantes interpersonales, sociales y culturales concretos —para Horney, la «ansiedad básica» generada por un entorno infantil de indiferencia u hostilidad disfrazada; para Fromm, la angustia existencial de la libertad moderna y su huida hacia mecanismos de sumisión autoritaria. Ninguno de los dos administra ficha propia en esta app, pero Greenberg y Mitchell —en *Object Relations in Psychoanalytic Theory* (1983), la fuente historiográfica fundacional ya citada por el Psicoanálisis Relacional (`p4`)— los sitúan explícitamente junto a Sullivan como el antecedente histórico directo del giro relacional; esa misma genealogía está ahora documentada en la propia fundamentación de p4 dentro de esta app.",
    ontologia: "El carácter neurótico no es la sedimentación de conflictos pulsionales universales fijados en estadios psicosexuales, sino la formación defensiva específica que un individuo concreto desarrolla frente a las condiciones reales —familiares, sociales, económicas— de su cultura y su época.",
    epistemologia: "Clínico-social: la comprensión del malestar psíquico exige situar al individuo dentro de su contexto cultural e histórico concreto, no aislarlo como un aparato pulsional universal y ahistórico.",
    conceptosAportados: ["Ansiedad básica (Horney)", "Miedo a la libertad y mecanismos de escape —autoritarismo, destructividad, conformismo automático— (Fromm)", "Determinantes interpersonales y culturales del carácter neurótico", "Rechazo del biologicismo pulsional freudiano"],
    fuentesVerificacion: "Horney (1937) y Fromm (1941) son clásicos de amplio consenso en la historiografía del psicoanálisis neofreudiano. Su agrupación junto a Sullivan como antecedente directo del giro relacional, citando a Greenberg y Mitchell (1983), está documentada ahora en la propia fundamentación de p4 dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "ferenczi",
    nombre: "Técnica activa y crítica temprana a la neutralidad analítica",
    autoresPrincipales: "Sándor Ferenczi (1873-1933)",
    disciplina: "Psicoanálisis",
    obraNuclear: "Ferenczi, S., Rank, O. (1924). The Development of Psychoanalysis. Nervous and Mental Disease Publishing.",
    aporteSintesis:
      "Ferenczi, miembro del círculo íntimo de Freud desde 1908, fue el primer disidente en cuestionar clínicamente —no solo teóricamente— la neutralidad y la abstinencia estrictas, experimentando con una postura más activa y cálida del analista años antes de que esa crítica se sistematizara en otras escuelas. No administra ficha propia en esta app, pero su huella está documentada de forma explícita en tres fichas distintas: coautoría directa con Freud de la «técnica activa» (excepción conductual para el tratamiento de fobias dentro del Psicoanálisis clásico, `p1`), que es la única indicación activa entre sesiones que ese modelo admite; formación clínica directa de Melanie Klein, quien la propia ficha de `p3` describe como alguien que «revolucionó la técnica clínica infantil desde su análisis con Ferenczi»; y magisterio directo de Michael Balint, cuyo concepto nuclear de «falta básica» —según la propia fundamentación de `p3b`— proviene explícitamente de haber sido «discípulo de Ferenczi».",
    ontologia: "La cura analítica no depende únicamente de la interpretación correcta de un contenido inconsciente reprimido, sino también de la calidad afectiva real del encuentro entre analista y paciente; una postura excesivamente fría o pasiva puede repetir, en vez de reparar, el trauma relacional original del paciente.",
    epistemologia: "Clínico-experimental: Ferenczi experimentó directamente con variaciones técnicas (mayor actividad, calidez, incluso análisis mutuo en sus últimos experimentos) y evaluó sus efectos en el curso del tratamiento, en vez de derivar la técnica exclusivamente de la teoría pulsional.",
    conceptosAportados: ["Técnica activa", "Crítica temprana a la neutralidad y la abstinencia estrictas", "Antecedente de la calidez terapéutica como variable técnica, no solo actitudinal", "Formación directa de Klein y Balint"],
    fuentesVerificacion: "La coautoría de la técnica activa con Freud está documentada en las propias `tecnicas` de p1; la formación de Klein con Ferenczi está documentada en la propia `fundamentacion` de p3; y el magisterio directo sobre Balint («discípulo de Ferenczi») está documentado en la propia `fundamentacion` de p3b — las tres, dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "grof",
    nombre: "Cartografía de la psique perinatal y transpersonal (Matrices Perinatales Básicas, Sistemas COEX)",
    autoresPrincipales: "Stanislav Grof (n. 1931); Christina Grof (1941-2014)",
    esTambienEscuelaPropia: "t4",
    disciplina: "Psiquiatría transpersonal",
    obraNuclear: "Grof, S. (1985). Beyond the Brain. State University of New York Press.",
    aporteSintesis:
      "Grof administra su propia escuela (`t4`, Enfoque Holotrópico) pero uno de sus constructos centrales viaja explícitamente más allá de ella: los Sistemas COEX (Sistemas de Experiencia Condensada) —constelaciones de memorias «estratificadas evolutivamente en el psiquismo como si se tratara de una cebolla», unidas por un mismo «sabor» emocional a través de capas biográficas, perinatales y transpersonales— son adoptados por Ken Wilber en la Psicología Integral (`t5`) como préstamo explícito y reconocido, según la propia notaDistincion de t5: «el Sistema COEX aparece en ambos, pero Wilber lo cita como préstamo explícito de Grof, no como constructo propio». La diferencia entre ambos usos es de validación, no de arquitectura: Grof detecta y resuelve el COEX mediante inducción experiencial de estados no ordinarios (respiración holotrópica, originalmente LSD), mientras que Wilber lo localiza mediante diagnóstico diferencial hermenéutico por fulcro, sin requerir necesariamente un estado alterado. No debe atribuirse a Wilber la autoría del constructo ni a Grof los «fulcros» estructurales de Wilber.",
    ontologia: "La psique incluye, además de lo biográfico postnatal freudiano, un dominio perinatal (organizado en cuatro Matrices Perinatales Básicas correspondientes a las fases del nacimiento biológico) y un dominio transpersonal genuino (experiencias que trascienden los límites habituales del yo, el espacio y el tiempo); estos tres dominios se organizan en Sistemas COEX transversales, no en capas aisladas.",
    epistemologia: "Empírico-experiencial mediante inducción de estados no ordinarios de conciencia (originalmente LSD, después respiración holotrópica y música evocativa): el material clínicamente relevante solo se vuelve accesible cuando se debilita la «válvula reductora» habitual de la conciencia de vigilia, no mediante asociación libre verbal.",
    conceptosAportados: ["Sistemas COEX (Sistemas de Experiencia Condensada)", "Matrices Perinatales Básicas (BPM I-IV)", "Cartografía ampliada de la psique (biográfico, perinatal, transpersonal)", "Emergencia espiritual (con Christina Grof)"],
    fuentesVerificacion: "Grof (1985) es un clásico de amplio consenso en la historiografía transpersonal. La cita explícita de Wilber a los Sistemas COEX como préstamo reconocido de Grof está documentada en la propia notaDistincion de t5 (y en la de t4) dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "englerbrown",
    nombre: "Estudios psicométricos sobre meditación avanzada y estructura evolutiva de la conciencia contemplativa",
    autoresPrincipales: "Jack Engler; Daniel P. Brown",
    disciplina: "Psicología clínica / investigación contemplativa",
    obraNuclear: "Brown, D., Engler, J. (1980). A Rorschach Study of the Stages of Mindfulness Meditation. Journal of Transpersonal Psychology, 12(2).",
    aporteSintesis:
      "Engler y Brown no administran ninguna ficha propia en esta app, pero son coautores directos, junto a Ken Wilber, del texto que sistematizó clínicamente la Psicología Integral (`t5`): Transformations of Consciousness (1986), donde se articulan los «fulcros» del desarrollo con sus psicopatologías y tratamientos correspondientes —la propia fundamentación de t5 lo dice explícitamente: «se sistematizó clínicamente... sobre todo en Transformations of Consciousness (1986), escrita junto a Jack Engler y Daniel P. Brown»—. Además, su propia investigación empírica constituye la base de evidencia citada por t5: el estudio Rorschach de Brown y Engler (1980) halló en meditadores avanzados una integración yoica superior y ausencia de regresión psicótica —contradiciendo la lectura psicoanalítica clásica de la meditación como retirada regresiva—, y el estudio fenomenológico de Maliszewski, Twemlow, Brown y Engler (1981) documentó una secuencia invariable de etapas contemplativas en poblaciones de práctica intensiva.",
    ontologia: "Los estados meditativos avanzados no son un continuo homogéneo ni una regresión patológica, sino una secuencia estructurada de etapas fenomenológicamente distinguibles, verificable con los mismos instrumentos psicométricos usados en la psicología clínica convencional (p. ej. el test de Rorschach).",
    epistemologia: "Psicométrico-comparativo: aplica instrumentos estandarizados de evaluación clínica (Rorschach, entrevista fenomenológica estructurada) a poblaciones de meditadores con distintos niveles de práctica, en vez de depender solo del reporte introspectivo no verificado o de la exégesis de textos contemplativos.",
    conceptosAportados: ["Integración yoica superior en meditadores avanzados (evidencia psicométrica)", "Secuencia fenomenológica invariable de etapas contemplativas", "Base empírica de los «fulcros» transpersonales superiores de Wilber"],
    fuentesVerificacion: "Brown y Engler (1980) y Maliszewski, Twemlow, Brown y Engler (1981) están citados íntegros, con referencia bibliográfica completa, en la propia ficha de t5 dentro de esta app, tanto en su fundamentación como en su evidencia. Verificado julio 2026.",
  },
  {
    id: "james",
    nombre: "Fenomenología empírica de la experiencia religiosa",
    autoresPrincipales: "William James (1842-1910)",
    disciplina: "Filosofía / Psicología",
    obraNuclear: "James, W. (1902). The Varieties of Religious Experience: A Study in Human Nature. Longmans, Green & Co.",
    aporteSintesis:
      "James, en sus Conferencias Gifford de 1901-1902, hizo algo que ningún psicólogo académico había hecho antes con seriedad: tratar los estados místicos y de conversión religiosa como fenómenos psicológicos legítimos, documentables y estudiables empíricamente a partir de reportes de primera persona, sin presuponer de antemano ni su verdad teológica ni su reducción automática a patología. No administra ninguna ficha propia en esta app —su obra es filosófico-psicológica, no una técnica clínica—, pero es el precursor histórico explícitamente reconocido del constructo nuclear de la Psicología Trascendental de Maslow (`t1`): la «experiencia cumbre» (peak experience) de Maslow se inscribe deliberadamente en la misma tradición de estudio empírico de la experiencia religiosa/mística que James había inaugurado medio siglo antes, según la propia fundamentación de t1.",
    ontologia: "Los estados místicos y religiosos no son meros epifenómenos de otros procesos (fisiológicos, patológicos, sociales) que deban explicarse reductivamente, sino un tipo de experiencia con estatuto propio, caracterizada por rasgos fenomenológicos reconocibles (inefabilidad, cualidad noética, transitoriedad, pasividad), susceptible de estudio psicológico riguroso en sus propios términos.",
    epistemologia: "Pragmatista y empírica de primera persona: James evalúa los estados religiosos por sus «frutos» prácticos en la vida del sujeto («by their fruits ye shall know them»), no por la verdad metafísica de las doctrinas que los acompañan, y los estudia a partir de testimonios y autobiografías espirituales recopilados sistemáticamente, no desde el dogma teológico.",
    conceptosAportados: ["Estados místicos como objeto psicológico legítimo", "Rasgos fenomenológicos del misticismo (inefabilidad, cualidad noética, transitoriedad, pasividad)", "Criterio pragmático de validación religiosa (\"by their fruits\")", "Precursor de la «experiencia cumbre» maslowiana"],
    fuentesVerificacion: "James (1902) es un clásico de amplio consenso, ampliamente citado como precursor fundacional en toda la historiografía de la psicología transpersonal. Su relación con la «experiencia cumbre» de Maslow está documentada ahora en la propia fundamentación de t1 dentro de esta app. Verificado julio 2026. Comprobado además en la edición de Península (1986) de la biblioteca: las cuatro características de los estados místicos —inefabilidad, cualidad de conocimiento (la «noética» de James), transitoriedad y pasividad— están en las conferencias XVI y XVII, «El misticismo» (James, 1986, pp. 179–180).",
  },
  {
    id: "piaget",
    nombre: "Estadios del desarrollo cognitivo (epistemología genética)",
    autoresPrincipales: "Jean Piaget (1896-1980)",
    disciplina: "Psicología del desarrollo / epistemología",
    obraNuclear: "Piaget, J. (1936). La naissance de l'intelligence chez l'enfant. Delachaux et Niestlé.",
    aporteSintesis:
      "Piaget documentó que la inteligencia infantil no es una versión reducida de la adulta, sino que atraviesa una secuencia invariante de estadios cualitativamente distintos (sensoriomotor, preoperacional, operaciones concretas, operaciones formales), cada uno con su propia lógica interna de organización del conocimiento. No administra ninguna ficha propia en esta app, pero sus estadios «concretas» y «formales» son la columna estructural de referencia occidental que Wilber retoma explícitamente para construir los fulcros «personales» (4 a 6) de la Psicología Integral (`t5`), antes de que el propio modelo los extienda hacia fulcros «transpersonales» que Piaget nunca postuló —según la propia fundamentación de t5.",
    ontologia: "El conocimiento no es una copia pasiva de la realidad externa ni una estructura innata que simplemente madura, sino el resultado activo de la interacción del organismo con su entorno a través de dos procesos complementarios: la asimilación (incorporar lo nuevo a esquemas ya existentes) y la acomodación (modificar los esquemas para ajustarse a lo nuevo).",
    epistemologia: "Genético-estructural: las categorías de conocimiento (espacio, tiempo, causalidad, número) no son fijas ni dadas de antemano, sino que se construyen progresivamente en una secuencia observable experimentalmente mediante tareas estandarizadas aplicadas a niños de distintas edades.",
    conceptosAportados: ["Estadios invariantes del desarrollo cognitivo", "Asimilación y acomodación", "Operaciones concretas y operaciones formales", "Epistemología genética"],
    fuentesVerificacion: "Piaget (1936) y su obra posterior son un hito de consenso absoluto en la historiografía de la psicología del desarrollo. Su uso explícito por Wilber como columna estructural de los fulcros personales está documentado ahora en la propia fundamentación de t5 dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "otto",
    nombre: "Fenomenología de lo sagrado (lo numinoso)",
    autoresPrincipales: "Rudolf Otto (1869-1937)",
    disciplina: "Filosofía de la religión / teología",
    obraNuclear: "Otto, R. (1917). Das Heilige (Lo Santo). Breslau.",
    aporteSintesis:
      "Otto aisló, dentro de la experiencia religiosa, una categoría que no se reduce ni a la razón ni a la moral: lo «numinoso» (das Numinose), un mysterium tremendum et fascinans —un misterio que sobrecoge y a la vez fascina— que se experimenta como radicalmente «otro» respecto de lo cotidiano. No administra ninguna ficha propia en esta app —su obra es filosófico-teológica, sin técnica clínica asociada—, pero su distinción cualitativa entre lo numinoso y la experiencia ordinaria es retomada medio siglo después, ahora bajo un marco psicológico y clínico, por la propia definición fundacional de «experiencia transpersonal» de la Psicología Transpersonal general (`t2`), según la fundamentación de esa ficha.",
    ontologia: "Existe una categoría de experiencia —lo sagrado o numinoso— irreducible a categorías racionales o éticas ordinarias: no es simplemente «lo bueno» intensificado ni «lo verdadero» intensificado, sino una cualidad experiencial sui generis que combina temor reverencial y fascinación simultáneos.",
    epistemologia: "Fenomenológica: lo numinoso se conoce por descripción directa de la estructura de la experiencia vivida (el «sentimiento de criatura», la sobrecogedora otredad), no por deducción racional ni por argumento moral; es un a priori de la conciencia religiosa, análogo a las categorías kantianas pero irreducible a ellas.",
    conceptosAportados: ["Lo numinoso (das Numinose)", "Mysterium tremendum et fascinans", "Sentimiento de criatura", "Distinción cualitativa entre experiencia sagrada y experiencia ordinaria"],
    fuentesVerificacion: "Otto (1917) es un clásico de amplio consenso en filosofía de la religión, frecuentemente citado como antecedente conceptual de la definición misma de «experiencia transpersonal». Su relación con la definición fundacional de t2 está documentada ahora en la propia fundamentación de esa ficha dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "washburn",
    nombre: "Modelo dinámico-dialéctico del desarrollo transpersonal (perspectiva alternativa a Wilber)",
    autoresPrincipales: "Michael Washburn (1943- )",
    disciplina: "Psicología transpersonal / teoría del desarrollo",
    esTambienEscuelaPropia: "t6",
    obraNuclear: "Washburn, M. (1988). The Ego and the Dynamic Ground: A Transpersonal Theory of Human Development. State University of New York Press.",
    aporteSintesis:
      "Washburn propuso, frente al modelo estructural-jerárquico de Wilber (`t5`), un modelo dinámico-dialéctico: el desarrollo no avanza linealmente «trascendiendo e incluyendo» niveles sucesivos, sino que consiste en un movimiento de espiral en tres tiempos —unión pre-egoica original con el «Fundamento Dinámico» inconsciente, represión/alienación de ese fundamento durante la construcción del ego (necesaria pero costosa), y un eventual «regreso al servicio de la trascendencia» en el que el ego adulto se reconecta con ese mismo fundamento ya no de forma regresiva sino integradora. Administra ahora su propia ficha de escuela (`t6`) dentro de la perspectiva Transpersonal, presentada explícitamente como rival teórico de Wilber (`t5`) y no como una variante o antecedente de su modelo — la propia literatura secundaria del campo documenta esta como una de las controversias centrales, no resuelta, de la disciplina.",
    ontologia: "El desarrollo humano no es una ascensión jerárquica lineal de estructuras sucesivas, sino un movimiento en espiral: un fundamento dinámico inconsciente y pre-egoico se pierde necesariamente durante la formación del ego y puede reencontrarse después, en la madurez, ya no como regresión sino como una nueva forma de integración consciente.",
    epistemologia: "Hermenéutico-comparada, en diálogo crítico explícito con el psicoanálisis (particularmente con Jung y con las teorías de las relaciones objetales) para reinterpretar la regresión y el inconsciente profundo como recursos potencialmente evolutivos, no solo patológicos.",
    conceptosAportados: ["Fundamento Dinámico (Dynamic Ground)", "Regresión al servicio de la trascendencia", "Modelo espiral (frente al modelo jerárquico-lineal)", "Alienación necesaria del ego respecto de su origen pre-egoico"],
    fuentesVerificacion: "Washburn (1988) es un clásico de consenso amplio en la historiografía de la psicología transpersonal, presentado habitualmente como la alternativa teórica principal al modelo de Wilber. No se encontró, tras revisión de las cinco fichas transpersonales de esta app, ninguna cita textual a Washburn en ninguna de ellas — nodo añadido como referencia general sin fundamentosTeoricos asociado. Verificado julio 2026.",
  },
  {
    id: "frankl",
    nombre: "Logoterapia y análisis existencial (como teoría fundante transversal)",
    autoresPrincipales: "Viktor E. Frankl (1905-1997)",
    esTambienEscuelaPropia: "h6",
    disciplina: "Psiquiatría existencial / «Tercera Escuela Vienesa de Psicoterapia»",
    obraNuclear: "Frankl, V. E. (1946). El hombre en busca de sentido; Frankl, V. E. (1994c). La voluntad de sentido.",
    aporteSintesis:
      "Frankl administra su propia escuela (`h6`, Logoterapia Clásica), pero su antropología dimensional (unitas multiplex bio-psico-espiritual) y su tesis de la voluntad de sentido como motivación primaria son fundamento explícito y textualmente declarado de dos desarrollos continuistas dentro de su misma subfamilia: el Logoanálisis norteamericano de Crumbaugh (`h6c`), que la traduce en un programa psicométrico-conductual de cinco pasos, y la Logoterapia Aplicada de Elisabeth Lukas (`h6e`), que la sistematiza en un proceso clínico estructurado de tres fases con instrumentos propios (Logotest). La Psicoterapia Centrada en el Sentido de Martínez (`h6d`) también construye explícitamente sobre la Ontología Dimensional frankliana, aunque integra además a Buber y Scheler. El Análisis Existencial Personal de Längle (`h6b`) comparte el tronco antropológico pero es, por declaración de ambas partes (Frankl renunció a la presidencia honoraria de la GLE en 1991; Längle, 2014, p. 75), una escisión y no una continuación: no se cita aquí como fundamentado por Frankl en el mismo sentido que h6c/h6d/h6e.",
    ontologia: "Ontología Dimensional o Unitas Multiplex: el ser humano es una unidad indivisible bio-psico-espiritual, cuya dimensión noética —sede de la libertad, la responsabilidad y el sentido— nunca enferma, aunque el cuerpo y la psique sí puedan hacerlo.",
    epistemologia: "Fenomenológica y antirreduccionista: rechaza el psicologismo y el pandeterminismo, reclamando una «psicología de las alturas» que valide las aspiraciones espirituales como fenómenos auténticos, no epifenómenos patológicos.",
    conceptosAportados: ["Voluntad de sentido", "Vacío existencial", "Autotrascendencia", "Autodistanciamiento", "Ontología Dimensional (Unitas Multiplex)", "Neurosis noógena"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de h6 dentro de esta app; relación de continuidad con h6c/h6d/h6e y de ruptura con h6b documentada en las notaDistincion cruzadas de ambas fichas.",
  },
  {
    id: "langle",
    nombre: "Análisis Existencial Personal (como teoría fundante propia, en escisión declarada de la Logoterapia Clásica)",
    autoresPrincipales: "Alfried Längle (n. 1951)",
    esTambienEscuelaPropia: "h6b",
    disciplina: "Psicoterapia fenomenológico-personal",
    obraNuclear: "Längle, A. (1993). Die 'Personale Existenzanalyse' (PEA) als therapeutisches Konzept. GLE; Längle, A. (2007). Análisis Existencial: La búsqueda de sentido y una afirmación de la vida.",
    aporteSintesis:
      "Längle administra su propia escuela (`h6b`), fundada precisamente al romper formalmente con Frankl en 1991 —el mismo estatuto que ya se aplica en esta app a Adler y Jung respecto de Freud—. A diferencia de Crumbaugh (`h6c`), Lukas (`h6e`) y Martínez (`h6d`), que declaran textualmente construir sobre la Logoterapia Clásica, ningún otro desarrollo de la subfamilia frankliana modelado actualmente en la app declara depender textualmente del AEP de Längle; se incluye como nodo propio para formalizar su estatuto teórico independiente dentro del diccionario traslacional y dejar preparado el enlace si una futura iteración incorpora un desarrollo que sí lo cite por nombre. Su aporte diferencial —el «giro personal» (emocionalidad, corporalidad, biografía) y las Cuatro Motivaciones Fundamentales— es, según su propio texto fundacional, una respuesta a la insuficiencia del antagonismo psiconoético clásico para pacientes con estructuras yoicas frágiles, no una mera expansión técnica de Frankl.",
    ontologia: "El ser humano es constitutivamente dialógico: la existencia no es el desarrollo aislado de un aparato intrapsíquico, sino un diálogo continuo entre el mundo subjetivo interno y el mundo objetivo externo, organizado en cuatro Motivaciones Fundamentales jerárquicas (Poder Ser, Gustar Vivir, Permitirse Ser Uno Mismo, Sentido y Devenir Activo).",
    epistemologia: "Fenomenología hermenéutica dialógica: el conocimiento clínico válido se verifica por el Consentimiento Interno (inner consent) del propio paciente en el diálogo, no por diagnóstico externo del terapeuta.",
    conceptosAportados: ["Cuatro Motivaciones Fundamentales", "Consentimiento Interno (inner consent)", "Análisis Existencial Personal (AEP, proceso de 4 pasos)", "Giro personal (emocionalidad, corporalidad, biografía)"],
    fuentesVerificacion: "Ver bibliografía completa ya citada en la propia ficha de h6b; relación de ruptura con Frankl documentada en las notaDistincion cruzadas de h6 y h6b.",
  },
  {
    id: "buber",
    nombre: "Filosofía dialógica del encuentro (Yo-Tú)",
    autoresPrincipales: "Martin Buber (1878-1965)",
    disciplina: "Filosofía existencial / teología dialógica",
    obraNuclear: "Buber, M. (1923). Ich und Du (Yo y Tú).",
    aporteSintesis:
      "Buber distingue dos modos radicalmente distintos de relación: el «Yo-Ello», que trata al otro como objeto de conocimiento, uso o análisis, y el «Yo-Tú», un encuentro directo, recíproco y no instrumental en el que ambos interlocutores se presentan como totalidades irreductibles. No administra ninguna ficha clínica propia —su obra es filosófica, sin técnica ni escuela asociada—, pero su distinción es citada textualmente como fundamento en al menos tres puntos de esta app: la Terapia Centrada en la Persona (`h1`) describe las condiciones facilitadoras rogerianas explícitamente como una «Relación Yo-Tú»; la Psicoterapia Centrada en el Sentido de Martínez (`h6d`) integra a Buber junto con Scheler y Husserl en su propia epistemología («filosofía dialógica del Yo-Tú»); y la Terapia Familiar Contextual de Boszormenyi-Nagy (`s8`) fundamenta su ética relacional dialógica —el reconocimiento del otro como sujeto de justicia relacional a través de generaciones, no como mero objeto de análisis estructural— directamente en el encuentro buberiano.",
    ontologia: "La realidad relacional no es reductible ni al individuo aislado ni a la suma de individuos: «en el principio es la relación». El Yo mismo solo se constituye plenamente en el encuentro Yo-Tú, nunca en el aislamiento del Yo-Ello.",
    epistemologia: "El conocimiento del otro como Tú no es objetivable ni analizable desde fuera —hacerlo lo convierte automáticamente en un Ello—; solo se accede a él en el encuentro presente, recíproco e irrepetible.",
    conceptosAportados: ["Relación Yo-Tú (encuentro dialógico)", "Relación Yo-Ello (instrumental/objetivante)", "El «entre» (das Zwischen) como lugar de lo relacional", "Reciprocidad e irreductibilidad del otro"],
    fuentesVerificacion: "Buber (1923/1937, trad. inglesa de R. G. Smith) es un clásico de consenso amplio en filosofía dialógica; su cita explícita y textual en h1, h6d y la tradición de Boszormenyi-Nagy está documentada en la bibliografía secundaria de terapia familiar contextual y en la propia fundamentación de h6d dentro de esta app. Verificado julio 2026.",
  },
  {
    id: "existencialismofilosofico",
    nombre: "Existencialismo filosófico (Kierkegaard, Nietzsche, Sartre, Tillich)",
    autoresPrincipales: "Søren Kierkegaard (1813-1855); Friedrich Nietzsche (1844-1900); Jean-Paul Sartre (1905-1980); Paul Tillich (1886-1965)",
    disciplina: "Filosofía existencial y teología existencial",
    obraNuclear: "Kierkegaard, S. (1844). El concepto de la angustia; Nietzsche, F. (1883-1885). Así habló Zaratustra; Sartre, J.-P. (1943). El ser y la nada; Tillich, P. (1952). The Courage to Be.",
    aporteSintesis:
      "A diferencia del nodo `fenomenologiaexistencial` (Husserl/Heidegger), que aporta el método fenomenológico y la analítica ontológica del Dasein, este nodo agrupa la tradición existencialista propiamente dicha: Kierkegaard distingue el miedo (ante un objeto definido) de la angustia (vértigo ante la propia libertad y posibilidad); Nietzsche deconstruye la moral heredada y propone el «eterno retorno» como prueba existencial de afirmación de la propia vida; Sartre radicaliza la libertad humana con la tesis «la existencia precede a la esencia» —el ser humano no tiene naturaleza previa, está «condenado a ser libre»—; Tillich, desde la teología existencial, formula el «coraje de ser» frente a la angustia de la finitud, el vacío y la culpa. La propia ficha de la Terapia Existencial americana (`h4`) cita textualmente a los cuatro como «precursores filosóficos» —Nietzsche y Kierkegaard en su epistemología, Tillich como acuñador literal del término «preocupaciones de base» que estructura las Cuatro Preocupaciones Supremas de Yalom, y la tesis sartreana de la existencia precediendo a la esencia en su propia ontología—, distinguiéndose así explícitamente de la vía fenomenológica husserliano-heideggeriana que nutre a la escuela inglesa (`h5`) y al Daseinsanálisis (`h11`).",
    ontologia: "El ser humano no posee una esencia o naturaleza fija previa a su existencia: se define y se constituye mediante sus elecciones libres, en confrontación permanente con la angustia, la finitud y la ausencia de garantías externas de sentido.",
    epistemologia: "El conocimiento existencial relevante no es teórico ni especulativo sino vivido en primera persona (Kierkegaard: «la verdad es subjetividad»); se accede a él mediante la confrontación directa con la propia libertad, la culpa y la finitud, no mediante el análisis objetivante de un observador externo.",
    conceptosAportados: ["Angustia como vértigo de la libertad (Kierkegaard)", "Eterno retorno (Nietzsche)", "La existencia precede a la esencia (Sartre)", "Coraje de ser (Tillich)", "Libertad radical y responsabilidad ineludible"],
    fuentesVerificacion: "Consenso histórico-filosófico amplio; citación textual explícita de los cuatro autores como «precursores filosóficos» en la propia fundamentación de h4 dentro de esta app, verificado julio 2026.",
  },
  {
    id: "lewin",
    nombre: "Teoría del campo (psicología topológica y dinámica de grupos)",
    autoresPrincipales: "Kurt Lewin (1890-1947)",
    disciplina: "Psicología social y de la Gestalt",
    obraNuclear: "Lewin, K. (1951). Field Theory in Social Science. Harper & Row.",
    aporteSintesis:
      "Lewin formuló la «teoría del campo»: la conducta (C) es función de la persona y su ambiente psicológico entendidos como un campo dinámico e interdependiente en un momento dado (C = f[P, A]), no de rasgos aislados ni de estímulos externos aislados. Acuñó además la noción de «dinámica de grupos» y participó activamente, junto con Bateson, Wiener, McCulloch y von Foerster, en las Conferencias Macy sobre cibernética (1946-1953) que consolidaron el vocabulario de sistema, retroalimentación y totalidad interdependiente que después migra a la terapia familiar. No administra ficha clínica propia —fue psicólogo social y experimental, no clínico—, pero su concepto de «campo» es citado textualmente como fuente directa de la Terapia Gestalt (`h3`), donde Perls, Hefferline y Goodman lo incorporan para sostener que ningún fenómeno psicológico se comprende aislado del campo organismo-entorno en que ocurre.",
    ontologia: "La conducta y la experiencia no son propiedades de un individuo aislado ni efectos de estímulos externos aislados, sino que emergen de un campo psicológico total e interdependiente que incluye a la persona y su situación percibida en el momento presente.",
    epistemologia: "El conocimiento válido de la conducta requiere describir la totalidad del campo vigente (método topológico), no aislar variables causales lineales fuera de su contexto situacional.",
    conceptosAportados: ["Teoría del campo (C = f[P, A])", "Espacio vital (life space)", "Dinámica de grupos", "Campo psicológico como totalidad interdependiente"],
    fuentesVerificacion: "Lewin (1951) es un clásico de consenso amplio en psicología social; su cita textual como fuente del concepto de «Campo» ya figura en el GLOSARIO de esta app (ficha h3) y en la fundamentación de la Terapia Gestalt. Su participación en las Conferencias Macy de cibernética es un hecho histórico documentado (Heims, S. J. (1991). The Cybernetics Group. MIT Press), citado aquí como contexto histórico, no como fundamento textualmente declarado por ninguna escuela sistémica de la app.",
  },
  {
    id: "ashby",
    nombre: "Cibernética de la regulación: homeostato y ley de variedad requerida",
    autoresPrincipales: "W. Ross Ashby (1903-1972)",
    disciplina: "Psiquiatría y cibernética",
    obraNuclear: "Ashby, W. R. (1952). Design for a Brain. Chapman & Hall; Ashby, W. R. (1956). An Introduction to Cybernetics. Chapman & Hall.",
    aporteSintesis:
      "Ashby, junto con Wiener y Maruyama, es uno de los fundadores de la cibernética de primer orden. Construyó el «homeostato», una máquina electromecánica que se autorregulaba ante perturbaciones externas, y formuló la Ley de la Variedad Requerida (solo la variedad puede absorber variedad: un sistema regulador necesita tanta variedad de respuestas como perturbaciones puede recibir del entorno). Es el origen técnico directo del concepto de «homeostasis familiar»: Don D. Jackson, cofundador del MRI de Palo Alto y de la escuela estratégica (`s3`), tituló y fundamentó explícitamente su artículo seminal «The Question of Family Homeostasis» (1957) en el modelo cibernético de Ashby, trasladando el homeostato de una máquina individual a la familia como sistema autorregulado. La «homeostasis rígida» que la Escuela de Milán (`s4`) hereda de la primera cibernética antes de su giro hacia la segunda cibernética proviene de este mismo linaje.",
    ontologia: "Todo sistema regulado (mecánico, biológico o social) tiende a mantener ciertas variables críticas dentro de un rango estable frente a perturbaciones externas, mediante mecanismos de retroalimentación negativa; la estabilidad no es pasividad sino un logro activo y continuo del sistema.",
    epistemologia: "El comportamiento regulador de un sistema se explica por su arquitectura de retroalimentación, no por una intención consciente ni por causas lineales externas; la capacidad reguladora de un sistema está matemáticamente limitada por su propia variedad interna (Ley de Variedad Requerida).",
    conceptosAportados: ["Homeostato", "Ley de la Variedad Requerida", "Retroalimentación negativa como mecanismo de estabilidad", "Homeostasis como logro activo del sistema"],
    fuentesVerificacion: "Ashby (1952, 1956) es un clásico fundacional de la cibernética de amplio consenso histórico. La cita explícita de Jackson (1957) a Ashby como fuente del concepto de homeostasis familiar está documentada en la historiografía estándar de la terapia familiar (p. ej. Nichols y Schwartz, Family Therapy: Concepts and Methods). Verificado julio 2026.",
  },
];

/* Índice inverso calculado, NO almacenado: qué escuelas declaran a
   este autor/teoría entre sus `fundamentosTeoricos`. */
