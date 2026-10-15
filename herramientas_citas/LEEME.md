# Herramientas de citas y referencias (Psiconautas)

Scripts en Python que generan `src/datos/bibliografia.js` (referencias APA 7, citas en el texto y referencias incompletas) a partir de las cadenas de fuente de la app.

Orden de uso (ejecutar desde esta carpeta; ajustar la ruta del proyecto dentro de `bib.py`/`bibfinal.py` si cambia):
1. `python3 bibgen.py` — lee las fuentes de `src/App.jsx`, `src/datos/*.js` y `protocolos.js`, y escribe `bib_rows.json` (una fila por obra).
2. `python3 bibfinal.py` — aplica `bib_over.py` (OV = texto APA corregido; EXTRA = obras nuevas; ALIAS = claves equivalentes) y escribe `src/datos/bibliografia.js`.
3. `npx vite build` desde la raíz del proyecto.

Claves de referencia: `apellido|año|palabra` (p. ej. `lacan|1955|seminario3`). Para corregir una referencia, añadir su texto a `bib_over.py` (diccionario al final, con fecha) y repetir 2–3.

Otros: `cr.py` consulta Crossref (DOI, volumen, páginas); `vq.py`/`gp.py` buscan un pasaje en los PDF de la biblioteca y dan la página impresa; `mk_pend.py` genera el Word de referencias pendientes; `repl_refs.py`/`repl2.py` ejemplos de reescritura masiva de cadenas de fuente; `parafrasis.py` y `par2_*.py` contienen las paráfrasis aplicadas.

Notas: los PDF epub sin folios no sirven para verificar páginas; las páginas dadas por NotebookLM resultaron poco fiables (desfases de 1 a 20 páginas), por lo que se cita por capítulo o se verifica contra el PDF.
