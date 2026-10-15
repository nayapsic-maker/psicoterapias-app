import re,json
P="/Users/nicolasayasandoval/Downloads/psicoterapias-app/src/App.jsx"
A=open(P).read()
PARA={
("h4","Eterno Retorno"):"Prueba existencial de origen nietzscheano que Yalom adopta: invita a imaginar que cada elección, y cada acción omitida, habría que estar dispuesto a repetirla por toda la eternidad. Se usa para confrontar al paciente con el peso real de lo que decide y de lo que deja de hacer.",
("h4","Voluntad y Acción"):"Para Yalom el insight no basta: también hace falta esfuerzo y acción, porque hay un tiempo para pensar y analizar y otro para actuar (Yalom, 1999).",
("t4","Sistemas COEX (Sistemas de Experiencia Condensada)"):"Constelaciones dinámicas de recuerdos que se organizan en el psiquismo por capas, como las de una cebolla; condensan experiencias de distintos períodos de la vida (biográfico, perinatal y transpersonal) que comparten una misma carga emocional intensa.",
("t5","Proyecto Atman"):"Para Wilber el desarrollo es evolución y la evolución es trascendencia; su meta final es Atman, la conciencia de unidad esencial (Wilber, 1980).",
("p9","Narcisismo no defensivo"):"Kohut entendió el self como esencialmente no defensivo: un self que se desarrolla con normalidad y que simplemente queda detenido. Así el narcisismo pasa a ser una línea de desarrollo propia y no solo una defensa patológica (Gabbard, 2002).",
("h2","Experiencia de flujo (flow)"):"Estado que Csikszentmihalyi llama experiencia de flujo: la persona siente que flota o que la lleva la corriente de lo que hace, lo contrario de la entropía psíquica (Csikszentmihalyi, 1990).",
("h3","El salto creativo"):"Zinker valora que la terapia gestáltica permita ser fiel, desde una perspectiva fenomenológica, a lo que está presente y, a la vez, traducir las propias corazonadas creativas del terapeuta (Zinker, 1979).",
("h3","Ciclo de conciencia-excitación-contacto"):"Continuación del ciclo de conciencia, excitación y contacto desarrollado por el Instituto Gestalt de Cleveland: el proceso se mueve de la sensación a la conciencia, la movilización de energía, la acción, el contacto, la consumación y el retraimiento (Zinker, 1979).",
("h3","Estética de la psicoterapia"):"Zinker valora la belleza sencilla de los acontecimientos terapéuticos, que tienen temas, estructuras, desarrollos y resoluciones; cada encuentro terapéutico puede entenderse como una obra de arte en potencia (Zinker, 1994).",
("h3","Visión e intervención en el proceso"):"Es mirar el proceso: el terapeuta percibe metáforas sobre la persona que ella misma no alcanza a identificar porque está ocupada con su historia, y desde ahí interviene (Zinker, 1979).",
("h3","Proceso grupal guestáltico"):"Se rige por cuatro principios: la primacía de la experiencia grupal en curso, el desarrollo del proceso de conciencia grupal, la importancia del contacto activo y el uso de experimentos de interacción (Zinker, 1979).",
("h3","Campo yo/mundo (self/world field)"):"Bloom sostiene que reducir el campo de la terapia gestalt al par organismo/entorno es un reduccionismo biológico, y propone hablar de campo yo/mundo como el campo fenomenal del ser humano (Bloom, 2012).",
("h3","Campo interactivo encarnado (embodied interactive field)"):"Clemmens describe el acto de ayudar como algo que sucede a través de la presencia del terapeuta con la plenitud de sí mismo, que incluye pensamientos, sentimientos, sensaciones y movimientos (Clemmens, 2012).",
("h10","Patriarcado y hegemonía masculina"):"Para Burstow la civilización tal como la conocemos se funda en la violación y la dominación de los subordinados por las élites y en la hegemonía masculina, es decir, en ver, entender y nombrar el mundo desde un punto de vista masculino y elitista rígido (Burstow, 1992).",
("h10","Feminismo radical en terapia"):"El feminismo radical ve la opresión de las mujeres como conectada con las demás opresiones sistémicas, pero no reducible a ellas, y pone especial énfasis en la violación física de la mujer como cuerpo (Burstow, 1992).",
("h10","Malestar frente a psicopatología"):"La terapia feminista habla de malestar —la experiencia subjetiva de estar mal o de un bienestar mal ubicado— y no de psicopatología; la patología se atribuye al contexto cultural más amplio del patriarcado (Brown, 1994).",
("h10","Universo temático y temas de opresión"):"Los temas de opresión son las esperanzas y aspiraciones de la mujer junto con lo que concretamente las bloquea; el universo temático es el conjunto de todos esos temas, que se abren unos hacia otros (Burstow, 1992).",
("h6","Autodistanciamiento (Antagonismo Psiconoético Facultativo)"):"Capacidad de la dimensión espiritual de separarse de sus condicionamientos psicofísicos: la persona toma distancia de los instintos, no se identifica con ellos y desde esa distancia puede aceptarlos o rechazarlos (Frankl, 1987).",
("h6","Frustración Existencial"):"La persona puede malograr su voluntad de sentido, y la logoterapia habla entonces de frustración existencial. El término «existencial» tiene tres significados: la existencia misma, el sentido de la existencia y la voluntad de sentido (Frankl, 1946/2015).",
("h4","Las Cuatro Preocupaciones Supremas"):"Según Yalom, cuatro hechos de la existencia son especialmente relevantes para la psicoterapia: la muerte inevitable, la libertad de construir la propia vida, el aislamiento último y la ausencia de un significado o sentido evidente de la vida (Yalom, 2000).",
("h4","Aislamiento Existencial"):"Es el abismo que separa al yo de los demás, que subsiste incluso en relaciones interpersonales muy gratificantes y que incluye también el aislamiento respecto del mundo (Yalom, 2000).",
}
pat=re.compile(r'(\{ escuela: "(\w+)", termino: "((?:[^"\\]|\\.)*)", tipo: "\w+", definicion: ")((?:[^"\\]|\\.)*)(", fuente: ")((?:[^"\\]|\\.)*)(")')
sin=json.load(open("sin351.json")); clavesSin={(e,t,f) for e,t,tipo,d,f in sin}
hechos=set(); limp=0
def limpia(f):
    g=re.sub(r"\s*\[[^\]]*(?:escaneada|sin paginación)[^\]]*\]","",f)
    g=re.sub(r";?\s*sin página verificada\.?","",g)
    g=re.sub(r"\s*\((?:cita indirecta,\s*)?sin página\)","",g)
    g=re.sub(r"\s*\((?:[Ee]dición|[Vv]ersión) digital[^)]*\)","",g)
    g=re.sub(r"\s+\.",".",g); g=re.sub(r"\s{2,}"," ",g).strip()
    return g
def rep(m):
    global limp
    pre,e,t,d,mid,f,q=m.groups()
    tu=t.replace('\\"','"')
    d2=PARA.get((e,tu)); 
    if d2: hechos.add((e,tu)); d=d2.replace('"','\\"')
    if (e,tu,f.replace('\\"','"')) in clavesSin:
        f2=limpia(f)
        if f2!=f: limp+=1; f=f2
    return pre+d+mid+f+q
A2=pat.sub(rep,A); open(P,"w").write(A2)
print("paráfrasis aplicadas:",len(hechos),"de",len(PARA),[k for k in PARA if k not in hechos],"; fuentes limpiadas:",limp)
