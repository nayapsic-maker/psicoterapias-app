import React from "react";

/* Identidad de la marca madre: Presencia Psicología.
   Los tokens --marca-* están en index.css y se ajustarán con el documento de identidad visual
   (colores, tipografía y logotipo); hasta entonces el logotipo es un wordmark de texto. */
export function Wordmark({ tam = "normal" }) {
  return (
    <span className={"psn-marca-wordmark " + tam} aria-label="Presencia Psicología">
      <span className="psn-marca-punto" aria-hidden="true" />
      <span>Presencia <b>Psicología</b></span>
    </span>
  );
}

export function FirmaMarca() {
  return (
    <footer className="psn-marca-pie">
      <span>Psiconautas es un proyecto de</span>
      <Wordmark />
      <small>Material educativo: no sustituye la formación ni la supervisión clínica.</small>
    </footer>
  );
}

export function SelloMarcaHero() {
  return (
    <p className="psn-marca-hero">
      <Wordmark tam="chico" />
    </p>
  );
}
