import React from "react";

/* Presencia Psicología — identidad visual (manual de identidad).
   Símbolo: ojo con camino hacia el centro (vector del manual). Versión plana, un solo color (currentColor).
   Usos: el símbolo solo en espacios pequeños (cabecera, ícono); el logo principal (símbolo sobre
   PRESENCIA / PSICOLOGÍA) en el pie y en la presentación. Nunca en terracota; mínimo 32 px (símbolo) y 120 px (logo). */
const OJO = "M318.2,343.8 C296.3,326.7 276.9,307.6 260.1,285.8 C257.2,282.1 256.7,279.5 259.8,275.5 C294.6,230.3 338.6,197 391,174.6 C418.3,162.9 446.7,155.4 476.1,151.9 C507.9,148.2 539.5,149.3 571,155.3 C613,163.2 651.7,179 687.4,202.3 C717.9,222.3 744.4,246.6 766.5,275.8 C768.8,278.9 769.4,281.2 766.6,284.8 C722.8,341.6 666.2,379.4 597.5,399.4 C587.1,402.4 576.5,404.4 565.9,406.7 C561.9,407.6 560.2,406.6 559,402.8 C548.7,370.8 538.2,338.8 527.8,306.9 C525.5,299.9 523.3,293 521.2,286.4 C523.1,283.6 526.3,285.8 528.3,282.8 C523.6,279.6 518.8,276.4 514.1,273.2 C513.3,272.7 512.4,272.8 511.7,273.3 C507.2,276.3 502.8,279.4 498.4,282.4 C500,285.8 502.9,283.8 504.7,285.7 C505.2,288.3 503.6,290.9 502.8,293.4 C491.2,329.6 479.4,365.6 467.8,401.8 C466.4,406.4 464.4,407.5 459.6,406.6 C407.5,397.1 360.5,376.2 318.2,343.8 M614.9,296.5 C618.8,273 615,250.6 602.9,230.2 C580.7,192.8 547.3,174.4 504.1,177.7 C448.5,182.1 409.2,230 410,280.7 C410.5,315 424.8,342.3 451.6,363.2 C453.5,364.7 455.3,366.7 458.7,366.3 C461.7,358.2 464.5,349.9 467.7,341.7 C469.5,337.3 468.8,334.3 465.3,330.8 C448.6,314.5 441.2,294.6 444.6,271.5 C449,242.3 465.8,222.9 493.8,214.3 C520.4,206.2 544.1,213.2 563.3,232.8 C590.3,260.2 588.6,305.9 560.2,331.8 C557.8,334 556.8,336 558,339.2 C561,347.3 563.7,355.5 566.6,363.6 C567.6,366.5 569.2,367.1 571.9,365.2 C595.2,348.3 609.7,325.8 614.9,296.5 M394,335.3 C372.5,284.7 380,238 413.2,194.9 C410.8,193.4 409,194.5 407.2,195.3 C394.9,200.1 383.1,205.8 371.6,212.2 C341.8,228.9 315.5,249.9 292.9,275.5 C289.9,279 289.2,281.3 292.6,285.1 C300.1,293.4 308,301.2 316.2,308.8 C342.8,333.1 373,351.6 406.3,365.1 C408.3,365.9 410.4,367.4 413.7,365.9 C405.8,356.5 399.6,346.5 394,335.3 M731.1,273.4 C698.5,237.1 659.3,210.5 613.3,193.9 C655,252.1 655.3,309.6 612.3,367.1 C614.5,367.4 616.4,366.4 618.3,365.7 C648,354.3 674.8,338.1 699.3,318.1 C711.9,307.8 723.5,296.6 734.1,284.4 C736.7,281.5 737.1,279.1 734,276.4 C733.1,275.7 732.4,274.8 731.1,273.4 z";

export function Ojo({ tam = 32, color = "currentColor", titulo, className = "" }) {
  return (
    <svg className={className} width={tam} height={Math.round((tam * 270) / 520)} viewBox="250 142 526 270" role={titulo ? "img" : undefined} aria-label={titulo} aria-hidden={titulo ? undefined : true} focusable="false">
      <path d={OJO} fill={color} />
    </svg>
  );
}

/* Logo principal: símbolo sobre PRESENCIA / PSICOLOGÍA.
   tono="claro" → claros sobre salvia (principal); tono="positivo" → verdes sobre blanco o bruma. */
export function LogoPresencia({ tono = "claro", ancho = 150, className = "" }) {
  return (
    <span className={`psn-logo-pres ${tono} ${className}`} style={{ "--w": ancho + "px" }} role="img" aria-label="Presencia Psicología">
      <Ojo tam={Math.round(ancho * 0.46)} />
      <span className="psn-logo-pres-nombre">PRESENCIA</span>
      <span className="psn-logo-pres-sub">PSICOLOGÍA</span>
    </span>
  );
}

/* Versión horizontal de la web del manual: símbolo + PRESENCIA. */
export function LogoHorizontal({ tono = "positivo", className = "" }) {
  return (
    <span className={`psn-logo-hor ${tono} ${className}`} role="img" aria-label="Presencia Psicología">
      <Ojo tam={34} />
      <span>PRESENCIA <small>PSICOLOGÍA</small></span>
    </span>
  );
}

export function PieMarca() {
  return (
    <footer className="psn-pie-marca">
      <div className="psn-pie-marca-in">
        <LogoPresencia tono="claro" ancho={150} />
        <p>
          <b>Psiconautas</b> es un proyecto de Presencia Psicología.
          <br />
          Material educativo: no sustituye la formación ni la supervisión clínica.
        </p>
      </div>
    </footer>
  );
}
