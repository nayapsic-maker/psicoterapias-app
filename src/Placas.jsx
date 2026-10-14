/* Láminas de archivo: reproducciones de dominio público (Wikimedia Commons) con un único tratamiento
   (escala de grises con tinte cálido, ver .psn-placa en index.css). Cada una lleva su crédito. */
const PLACAS = {
  psicodinamica: { f: "psicodinamica", t: "Brouillet, Una lección clínica en la Salpêtrière (1887)", n: "Charcot muestra a su paciente ante los alumnos: la escena de la que sale buena parte del interés por el inconsciente.", c: "André Brouillet, 1887. Dominio público." },
  humanista: { f: "humanista", t: "Friedrich, El caminante sobre el mar de nubes (c. 1818)", n: "Una figura sola frente a lo abierto: la pregunta por la libertad y el sentido, antes de que existiera la psicología.", c: "Caspar David Friedrich, c. 1818. Dominio público." },
  sistemica: { f: "sistemica", t: "Bruegel el Viejo, Juegos de niños (1560)", n: "Ochenta juegos a la vez en una plaza: nadie se entiende fuera de lo que ocurre entre todos.", c: "Pieter Bruegel el Viejo, 1560. Dominio público." },
  conductual: { f: "conductual", t: "Thorndike, caja problema (1898)", n: "El aparato con el que Thorndike observó cómo un gato aprende por ensayo, error y consecuencia.", c: "E. L. Thorndike, 1898. Dominio público." },
  cognitivo: { f: "cognitivo", t: "Rafael, La escuela de Atenas (1509-1511)", n: "Argumentar, preguntar y poner a prueba lo que se cree: el método socrático que la terapia cognitiva retoma.", c: "Rafael Sanzio, 1509-1511. Dominio público." },
  integradora: { f: "integradora", t: "Bruegel el Viejo, La torre de Babel (1563)", n: "Muchas lenguas y una sola obra: el problema de entenderse entre enfoques que no comparten vocabulario.", c: "Pieter Bruegel el Viejo, 1563. Dominio público." },
  transpersonal: { f: "transpersonal", t: "Cuatro mandalas de la serie Vajravali (Tíbet central, s. XV)", n: "Un mapa de lo interior pensado para recorrerse con el cuerpo y la atención.", c: "Escuela Sakya, Tíbet central. Dominio público." },
  mesmer: { f: "mesmer", t: "Tratamiento en el baquet de Mesmer (grabado, s. XVIII)", n: "Antes de las escuelas: el magnetismo animal, de donde parten la sugestión y la hipnosis.", c: "Autor desconocido, s. XVIII. Dominio público." },
  descartes: { f: "descartes", t: "Descartes, el reflejo (L'Homme, 1664)", n: "Un estímulo, un trayecto y una respuesta: el esquema que abre la tradición conductual.", c: "René Descartes, 1664. Dominio público." },
};
const URL = (f) => `${import.meta.env.BASE_URL}img/archivo/${f}.jpg`;

export function Placa({ id, ancho, alto }) {
  const p = PLACAS[id];
  if (!p) return null;
  return (
    <figure className="psn-placa">
      <img src={URL(p.f)} alt={p.t} loading="lazy" decoding="async" width={ancho} height={alto} />
      <figcaption><b>{p.t}</b> {p.n} <small>{p.c}</small></figcaption>
    </figure>
  );
}

export function FranjaArchivo() {
  const ids = ["mesmer", "psicodinamica", "humanista", "transpersonal"];
  return (
    <div className="psn-franja" aria-label="Láminas de archivo">
      {ids.map((id) => <Placa key={id} id={id} />)}
    </div>
  );
}
