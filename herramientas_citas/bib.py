import re,unicodedata,json,collections,sys,os
SRC="/Users/nicolasayasandoval/Downloads/psicoterapias-app/src/"
A=open(SRC+"App.jsx").read()+open(SRC+"datos/protocolos.js").read()+open(SRC+"autores.js").read()

def todas():
    """Todas las cadenas con aspecto de cita, sin repetir."""
    out=set()
    for m in re.finditer(r'fuente"?:\s*"((?:[^"\\]|\\.)*)"',A): out.add(m.group(1))
    for blk in re.findall(r'referencias:\s*\[(.*?)\n\s*\],',A,re.S):
        for x in re.findall(r'"((?:[^"\\]|\\.)*)"',blk): out.add(x)
    i=A.index("const CITAS_AMPLIADAS"); j=A.index("\n};\n",i)
    for x in re.findall(r'"((?:[^"\\]|\\.)*)"',A[i:j]): out.add(x)
    return sorted(out)

def norm(s): return re.sub(r'[^a-z]','',unicodedata.normalize('NFD',s.lower()).encode('ascii','ignore').decode())

# ---------- diccionario para pasar títulos en inglés a mayúscula de oración ----------
DICT=set()
try:
    for w in open("/usr/share/dict/words"):
        w=w.strip()
        if w and w[0].islower(): DICT.add(w)
except Exception: pass
DOMINIO=set("""mindfulness psychotherapy psychotherapies psychoanalysis psychoanalytic psychodynamic psychosynthesis psychological psychology psychologist psychologists psychiatric psychiatry psychopathology psychosis psychotic psychosocial behavior behaviors behavioral behaviour behavioural cognitive cognition neurosis neurotic transference countertransference intersubjective intersubjectivity existential existentialism humanistic transpersonal integrative eclectic multimodal systemic systems schizophrenia schizophrenic depression depressive anxiety trauma traumatic posttraumatic abuse addiction addictions alcoholism alcoholics therapist therapists therapeutic therapy therapies counseling counselling clinician clinicians clinical interventions intervention assessments assessment inventory questionnaire questionnaires online internet digital meta-analysis metaanalysis meta-analytic randomized controlled trial trials outcome outcomes efficacy effectiveness empirically evidence-based manualized manual guide handbook textbook casebook workbook primer anthology dialectical logotherapy logotherapeutic phenomenology phenomenological phenomenologically relational dialogic gestalt-therapy self-psychology intersubjectivity attachment narcissism narcissistic borderline personality adolescent adolescents children's parenting couple couples marital marriage family families posttraumatic well-being wellbeing flourish flourishing optimism hope hopeful gratitude savoring resilience compassion compassionate acceptance commitment contextual third-wave wave radical radically open overcontrol undercontrol reinforcement punishment extinction conditioning conditioned operant respondent contingency contingencies modeling shaping prompting fading desensitization exposure flooding implosive aversion aversive covert imagery relaxation biofeedback assertiveness assertion""".split())
PROPIOS=set("""Gestalt Freud Freudian Jung Jungian Adler Adlerian Rogers Rogerian Beck Ellis Skinner Pavlov Bandura Wolpe Linehan Lazarus Maslow Frankl Perls Yalom Bowen Minuchin Haley Satir Milton Erickson Ericksonian Kohut Klein Kleinian Winnicott Bion Lacan Lacanian Fairbairn Kernberg Wilber Washburn Assagioli Grof English American Americans European British Chinese Spanish Latin Jewish Christian Buddhist Buddhism Zen Eastern Western Indian Greek DSM ICD PTSD CBT DBT ACT EMDR MBSR MBCT Harvard Oxford Cambridge Stanford Yale Chicago Columbia Milan Milwaukee Vienna Viennese Berlin Paris London York Philadelphia California Texas Hispanic Latino Black African Asian Mexico Peru Colombia Argentina Chile Spain Palo Alto Rogers' Rorschach Socratic Socrates Aristotle Plato Kant Hegel Heidegger Husserl Sartre Nietzsche Kierkegaard Buber Jaspers Binswanger Boss Laing May Fromm Horney Sullivan Erikson Piaget Vygotsky Luria Watson Thorndike Hull Tolman Wundt James Dewey Darwin Marx Lewin Moreno Reich Rank Ferenczi Balint Winnicott Guntrip Mitchell Stolorow Atwood Orange Benjamin Aron Fonagy Bateman Target Gergen Berger Luckmann Foucault Derrida Bakhtin Vygotsky Whitaker Epston White Selvini Boscolo Cecchin Prata Madanes Weakland Watzlawick Jackson Fisch Segal Shazer Berg Nardone Seligman Csikszentmihalyi Peterson Snyder Tedeschi Calhoun Fredrickson Ryff Fava Rashid Parks Linley Joseph Kabat-Zinn Teasdale Williams Hayes Strosahl Wilson Twohig Levin Ong Gilbert Kolts Lynch Young Klosko Weishaar Martell Dimidjian Jacobson Christensen Doss Kohlenberg Tsai Kanter Cautela Stampfl Levis Salter Ayllon Azrin Lovaas Meichenbaum Goldfried Maultsby Suinn Nezu D'Zurilla Rehm Prochaska DiClemente Norcross Miller Rollnick Beutler Clarkin Stricker Messer Wachtel Zinker Polster Joyce Sills Yontef Jacobs Naranjo Rennie Cain Gendlin Greenberg Elliott Watson Timulak Längle Lukas Crumbaugh Wong Spinelli Deurzen Cooper Schneider Krug Cortright Wellings Welwood Hastings Vaughan Walsh Boorstein Tart Maslow Sutich Ferrucci Kalff Ruiz Díaz Villalobos Labrador Cruzado Muñoz Gavino Olivares Echeburúa Corral Ortiz Moreno Martínez Bandler Grinder Sperry Binensztok Leichsenring Steinert Busch Rudden Shapiro Yeomans Caligor McCullough Fisch""".split())

def oracion(titulo):
    """Mayúscula de oración (APA) para títulos en inglés escritos en Title Case."""
    if not re.search(r"[A-Za-z]",titulo): return titulo
    palabras=re.findall(r"[A-Za-z]+",titulo)
    cap=sum(1 for w in palabras if len(w)>3 and w[0].isupper())
    larg=sum(1 for w in palabras if len(w)>3)
    if larg==0 or cap/larg<0.6: return titulo   # ya está en mayúscula de oración
    # solo para inglés: debe contener palabras funcionales inglesas
    if not ingles_probable(titulo): return titulo
    def f(m_text, inicio):
        out=[]
        for k,tok in enumerate(re.split(r"(\s+|[:?—–])",m_text)):
            if not tok or re.match(r"^(\s+|[:?—–])$",tok): out.append(tok); continue
            sub=tok.split("-")
            nuevo=[]
            for j,w in enumerate(sub):
                base=re.sub(r"[^A-Za-z']","",w)
                if not base: nuevo.append(w); continue
                if base.isupper() and len(base)>1: nuevo.append(w); continue
                if re.search(r"\d",w): nuevo.append(w); continue
                if base in PROPIOS or base.rstrip("'s") in PROPIOS: nuevo.append(w); continue
                if base.lower() in DICT or base.lower() in DOMINIO or (base.lower().rstrip("s") in DICT):
                    nuevo.append(w.lower() if not (inicio and k==0 and j==0) else w[0].upper()+w[1:].lower())
                else: nuevo.append(w)
            out.append("-".join(nuevo))
        return "".join(out)
    # primera palabra de título y de subtítulo (tras «:» o «?») conserva mayúscula
    partes=re.split(r"(:\s+|\?\s+)",titulo)
    res=[]
    for i,p in enumerate(partes):
        if i%2==1: res.append(p); continue
        t=f(p,True)
        t=t[0].upper()+t[1:] if t else t
        res.append(t)
    return "".join(res)

if __name__=="__main__":
    for t in ["The Practice of Multimodal Therapy","Behavioral Activation for Depression: A Clinician's Guide","Gestalt Therapy Verbatim","Reason and Emotion in Psychotherapy","Cognitive Therapy of Depression","Narrative Means to Therapeutic Ends","Psychotherapy by Reciprocal Inhibition","Mindfulness-Based Cognitive Therapy for Depression","Principles of Therapeutic Change That Work","El Tratamiento del Duelo","Acceptance and Commitment Therapy"]:
        print(oracion(t))

# ---------------- análisis de una referencia ----------------
AUT=re.compile(r"(?:(?:De|Van|Von|Di|Da|Le|La|Mac|Mc|D'|de|van|von|der|del|di|da|ter|den)\s?)*[A-ZÁÉÍÓÚÑÖÄÜÅ][\w'’\-áéíóúñÁÉÍÓÚÑÖÄÜÅ]+(?:\s(?:de\s|del\s)?[A-ZÁÉÍÓÚÑÖÄÜÅ][\w'’\-áéíóúñ]+)?,\s*(?:[A-ZÁÉÍÓÚÑ][a-z]?\.\s?-?)+(?:\s?(?:Jr\.|III))?")
def autores_de(txt):
    t=re.sub(r"\s*&\s*"," y ",txt).replace(";",",")
    t=re.sub(r"\s+"," ",t).strip()
    m=AUT.findall(t)
    if not m: return None
    resto=AUT.sub("",t)
    resto=re.sub(r"[,\s.]|\by\b|\bet al\b","",resto)
    if resto: return None
    return [re.sub(r"\.\s-",".-",x).strip() for x in m]
def unir_aut(l):
    if len(l)<=1: return l[0] if l else ""
    if len(l)==2: return f"{l[0]}, y {l[1]}"
    return ", ".join(l[:-1])+", y "+l[-1]
LOC=re.compile(r"(?:[,.;]\s*|\s+)\(?((?:[Pp]{1,2}\.\s*\d[\d–\-, y.]*|cap(?:ítulo)?s?\.\s*[\dIVXivx]+(?:[–\-]\d+)?|parte\s+[IVX]+)(?:\s*\([^)]*\))?(?:\s*(?:y|,)\s*(?:cap\.|p+\.)[^.]*)?)\)?\.?\s*$")
YEAR=r"(\d{4}[a-z]?(?:\s?[/–-]\s?\d{4}[a-z]?)?|s\.\s?f\.)"
def trocea(raw):
    """Divide una cadena con varias obras («A (1980). Título. Ed.; B (1999). …»)."""
    s=re.sub(r"\s+"," ",raw).strip()
    partes=re.split(r";\s+(?:véase(?: también)?\s+)?(?=(?:De |Van |Von |Di |Mac|Mc)?[A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+(?:\s[A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+)?(?:,|\s+y\s|\s+&\s|\s+et al\.|\s*\())",s)
    return [p.strip() for p in partes if p.strip()]

def parse_ref(raw):
    s=re.sub(r"\s+"," ",raw).strip()
    citado=None
    cm=re.search(r"[.,;]?\s*(?:[Cc]itado en|[Cc]itada en|tal como se cita en|tal como lo describe)\s+(.+)$",s)
    if cm and re.search(r"\d{4}",s[:cm.start()]): citado=cm.group(1).rstrip("."); s=s[:cm.start()]
    notas=[]
    def nota(m): notas.append(m.group(1).rstrip(".")); return ""
    s=re.sub(r"\s*\[([^\]]+)\]\.?",nota,s)
    s=re.sub(r";\s*(?:véase|retomado|incorporado|fuente primaria|ampliado|reproducido|citad[oa]s?|complementada|la fuente)\b.*$","",s,flags=re.I)
    consult=None
    v=re.match(r"^(.*?)\.?\s*Verificado en:\s*(.+)$",s)
    if v: consult=v.group(2); s=v.group(1)
    cuerpo=(consult or s).strip()
    cuerpo=re.sub(r"\s*\(((?:edición|cita indirecta|se cita|paginación|sin paginación|orig\.|obra original|Obra original)[^)]*)\)\.?\s*$",lambda m:(notas.append(m.group(1)) or ""),cuerpo,flags=re.I)
    loc=None
    lm=LOC.search(cuerpo)
    if lm: loc=lm.group(1).strip(); cuerpo=cuerpo[:lm.start()].rstrip(",; ")
    ym=re.match(r"^(.*?)\s*\("+YEAR+r"\)\.?\s*(.*)$",cuerpo)
    if not ym: return None
    aut,anio,resto=ym.group(1),ym.group(2),ym.group(3)
    if resto.lstrip().startswith((",",";")) or re.match(r"^en\s",resto): return None
    anio=re.sub(r"\s","",anio)
    if re.match(r"^s\.?f\.?$",anio,re.I): anio="s. f."
    rol=""
    rm=re.match(r"^(.*?)\s*\((Eds?\.|Comps?\.|Coords?\.|Dirs?\.)\)\.?\s*$",aut)
    if rm: aut,rol=rm.group(1),rm.group(2)
    lista=autores_de(aut)
    if not lista: return None
    return dict(autores=lista,rol=rol,anio=anio,resto=resto.strip(),loc=loc,notas=notas,consultada=bool(consult),orig=(v.group(1) if v else None),citado=citado)

def ingles_probable(t):
    pal=[w.lower() for w in re.findall(r"[A-Za-z']+",t)]
    if len(pal)<2: return False
    if re.search(r"[áéíóúñ¿¡]",t,re.I): return False
    if re.search(r"\b(el|la|los|las|del|de|y|en|para|con|una|un|su|sus|por|al|sobre|entre)\b",t.lower()): return False
    en=sum(1 for w in pal if w in DICT or w in DOMINIO or w.rstrip("s") in DICT)
    return en/len(pal)>=0.7
def es_espanol(t):
    return bool(re.search(r"\b(el|la|los|las|del|de la|para|con|una|y|en|su|sus)\b",t)) and not re.search(r"\b(the|of|and|for|with)\b",t)

def sent_es(t):
    pal=re.findall(r"[A-Za-zÁÉÍÓÚáéíóúñÑ]+",t)
    larg=[w for w in pal if len(w)>3]
    if not larg or sum(1 for w in larg if w[0].isupper())/len(larg)<0.6: return t
    partes=re.split(r"(:\s+|\?\s+|¿)",t); res=[]
    for i,p in enumerate(partes):
        if i%2==1: res.append(p); continue
        toks=re.split(r"(\s+)",p); o=[]
        for k,w in enumerate(toks):
            b=re.sub(r"[^A-Za-zÁÉÍÓÚáéíóúñÑ]","",w)
            if not b or w.isspace(): o.append(w); continue
            if k==0 or b in PROPIOS or (b.isupper() and len(b)>1): o.append(w[0].upper()+w[1:] if k==0 else w)
            else: o.append(w.lower())
        res.append("".join(o))
    return "".join(res)

def titulo_oracion(t):
    t=t.strip()
    return sent_es(t) if es_espanol(t) else oracion(t)

REV={"JEAB":"Journal of the Experimental Analysis of Behavior","JCCP":"Journal of Consulting and Clinical Psychology","JABA":"Journal of Applied Behavior Analysis","JCP":"Journal of Clinical Psychology","BRT":"Behaviour Research and Therapy","JAP":"Journal of Abnormal Psychology"}
def limpia_cola(r):
    """Quita de la cola localizadores y notas que no pertenecen a la referencia."""
    r=re.sub(r"\s*\((?:edición|copia|cita indirecta|versión|se cita|el ejemplar|folio|trabajo original|obra original|original:)[^)]*\)\.?","",r,flags=re.I)
    r=re.sub(r",\s*cap\.?\s*\d+(?=\))","",r)
    r=re.sub(r"\s*\(cap\.[^)]*\)","",r)
    r=re.sub(r"[,;.]\s*(?:cap(?:ítulo)?s?\.?|pp?\.|índice|prólogo|prefacio|parte|folio|apartados?|introducción|véase)\b.*$","",r,flags=re.I)
    r=r.replace(" & "," y ")
    r=re.sub(r"\((\d)ª ed\.","(\\1.ª ed.",r)
    return r.strip().rstrip(",; ")

def formatea_resto(resto):
    doi=None
    dm=re.search(r"\s*(https?://\S+?)\.?\s*$",resto)
    if dm: doi=dm.group(1).rstrip("."); resto=resto[:dm.start()]
    t,inc=_formatea_resto(resto)
    if doi: t=t.rstrip()+" "+doi; inc=False
    return t,inc
def _parte_final(titulo):
    """Separa del título los paréntesis finales de edición/traducción/volumen/páginas."""
    m=re.match(r"^(.*?)((?:\s*\((?:[^()]*(?:ed\.|Trad|trad|Vol\.|vols?\.|pp?\.|reimpr|Ed\.|Eds\.|Comp)[^()]*)\))+)$",titulo)
    if m: return m.group(1).rstrip(),m.group(2).strip()
    return titulo,""
def _cuida_parentesis(p):
    p=re.sub(r",\s*cap\.?\s*\d+","",p)
    p=p.replace("ª ed","ª ed").replace("-","–") if re.search(r"pp?\.",p) else p
    return p
def separa_titulo_editorial(s):
    s=s.strip().rstrip(".")
    pos=[m.start() for m in re.finditer(r"\.\s+",s) if not re.search(r"(?:^|[\s(])[A-ZÁÉÍÓÚ]$",s[:m.start()])]
    for idx in reversed(pos):
        pub=s[idx:].lstrip(". ").strip()
        if pub and len(pub)<=80 and re.match(r"^[A-ZÁÉÍÓÚÑ]",pub) and pub.count("(")==pub.count(")") and not re.search(r"[?!:]$",pub) and len(pub.split())<=7:
            return s[:idx].strip(),pub
    return s,""
def _formatea_resto(resto):
    r=limpia_cola(resto)
    r=re.sub(r"\s*\([^)]*(?:obra original|edición|ejemplar|folio|escaneada|original:)[^)]*\)\.?","",r,flags=re.I)
    r=re.sub(r"\.?\s*[Vv]éase también:.*$","",r)
    if not r.strip(): return "",True
    # obra completa:  Título. Obras completas, Vol. 12. Editorial
    om=re.match(r"^(.*?)\.\s+(Obras? [Cc]ompletas?),\s*(Vol\.\s*[\d/I]+)\.?\s*(.*)$",r)
    if om:
        tit,obra,vol,pub=om.groups()
        out=f"{titulo_oracion(tit)}. En *{obra[0].upper()+obra[1:].lower()}* ({vol})."
        if pub.strip(): out+=f" {pub.strip().rstrip('.')}."
        return out,not pub.strip()
    # capítulo
    m=re.match(r"^(.*?)\.\s+(En|In)\s+(.+)$",r)
    if m and not re.match(r"^[A-ZÁÉÍÓÚ][^.]*?,\s*\d+",m.group(3)):
        tit,en,tail=m.groups()
        em=re.match(r"^(.+?\((?:Eds?|Comps?|Coords?|Dirs?)\.\)),\s*(.*)$",tail)
        if em:
            eds,t2=em.groups()
            libro_pub=t2
        else:
            eds,libro_pub="",tail
        titulo_pub,pub=separa_titulo_editorial(libro_pub)
        libro,par=_parte_final(titulo_pub)
        par=_cuida_parentesis(par)
        out=f"{titulo_oracion(tit)}. {en} "+(eds+", " if eds else "")+f"*{titulo_oracion(libro)}*"+(f" {par}" if par else "")+"."
        if pub: out+=f" {pub}."
        return out,not pub
    # artículo
    m=re.match(r"^(.*?[?!.])\s+([A-ZÁÉÍÓÚ][^.?!]*?),\s*(\d+(?:\(\S+?\))?)(?:,\s*([\d–\-]+|[A-Za-z0-9.\-]+))?\s*$",r)
    if m and not re.match(r"^\d{4}$",m.group(3)) and not re.search(r"(?:Press|Books|Publishers|Editorial|Ediciones|Verlag|Routledge|Wiley|Springer|Guilford|Paidós|Herder)",m.group(2)):
        tit,rev,vol,pag=m.groups()
        tit=tit.rstrip(".")
        vm=re.match(r"^(\d+)(\(.*\))?$",vol)
        volx=f"{vm.group(1)}*"+(vm.group(2) or "") if vm else vol+"*"
        rev=REV.get(rev,rev)
        out=f"{titulo_oracion(tit)}{'' if tit[-1] in '?!' else '.'} *{rev}, {volx}"
        out+=f", {pag.replace('-','–')}." if pag else "."
        return out, pag is None
    # libro
    titulo_pub,pub=separa_titulo_editorial(r)
    titulo,par=_parte_final(titulo_pub)
    par=_cuida_parentesis(par)
    out=f"*{titulo_oracion(titulo)}*"+(f" {par}" if par else "")+"."
    if pub: out+=f" {pub}."
    return out,not pub
def solo_revista(resto):
    r=resto.strip().rstrip(".")
    return bool(re.match(r"^[A-ZÁÉÍÓÚ][^.]*?,\s*\d+(\(\S+?\))?(,\s*[\d–\-]+)?$",r)) and not re.search(r"[.?!]\s",r)
def apa(rec):
    a=unir_aut(rec["autores"])+(f" ({rec['rol']})" if rec["rol"] else "")
    r,inc=formatea_resto(rec["resto"])
    a=a if a.endswith(".") else a+"."
    out=f"{a} ({rec['anio']}). {r}".strip().replace(" & "," y ")
    out=re.sub(r"\.\.+",".",out)
    return out,inc

def apellidos(l):
    ap=[x.split(",")[0] for x in l]
    return ap[0] if len(ap)==1 else (f"{ap[0]} y {ap[1]}" if len(ap)==2 else f"{ap[0]} et al.")

def clave(rec):
    pal=re.findall(r"[A-Za-zÁÉÍÓÚáéíóúñ]{4,}",rec["resto"])
    return (norm(rec["autores"][0].split(",")[0]), re.sub(r"[a-z]$","",rec["anio"].split("/")[0]), norm(pal[0]) if pal else "")
