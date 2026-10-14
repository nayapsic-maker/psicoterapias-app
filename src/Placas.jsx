import { useState } from "react";

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

const ORDEN = ["humanista", "psicodinamica", "sistemica", "transpersonal", "conductual", "cognitivo", "integradora"];

/* Collage de portada: las siete láminas, una por perspectiva, pegadas con un filete mínimo.
   Gestalt: proximidad y semejanza (mismo tratamiento) las leen como una sola figura; el collage va al frente, como figura, no de fondo
   (de fondo perdería el contraste figura-fondo que sostiene el título). Al pulsar una lámina aparece su ficha. */
export function Collage() {
  const [abierta, setAbierta] = useState(null);
  return (
    <div className="psn-collage" role="group" aria-label="Láminas de las siete perspectivas">
      {ORDEN.map((id) => {
        const p = PLACAS[id];
        const on = abierta === id;
        return (
          <button key={id} type="button" className={`psn-col-${id}${on ? " on" : ""}`} onClick={() => setAbierta(on ? null : id)} aria-expanded={on} aria-label={p.t}>
            <img src={URL(p.f)} alt="" loading="lazy" decoding="async" />
            <span className="psn-col-ficha"><b>{p.t}</b>{p.n}<small>{p.c}</small></span>
          </button>
        );
      })}
    </div>
  );
}

/* Banda larga y difuminada al fondo de la cabecera de cada perspectiva. */
export function BandaPerspectiva({ id }) {
  const p = PLACAS[id];
  if (!p) return null;
  return (
    <div className="psn-banda" role="img" aria-label={p.t} title={`${p.t}. ${p.c}`}>
      <img src={URL(p.f)} alt="" loading="lazy" decoding="async" />
    </div>
  );
}
