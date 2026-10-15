import sys,json,re,collections
sys.path.insert(0,'.')
import bib
from bib_over import OV,ALIAS,EXTRA
rows=json.load(open("bib_rows.json"))
REG={}; INC=[]
for r in rows:
    k=r["key"]
    if k in OV:
        if OV[k] is None: continue
        REG[k]=OV[k]
        if "(s. f.)" in OV[k] or not re.search(r"(?:\.\s+[A-ZÁÉÍÓÚ][^.]*\.|\d+\*?\(?\d*\)?,\s*[\d–]+|https://)",OV[k]): INC.append(k)
    else:
        REG[k]=r["apa"]
        if "INC" in r["flags"]: INC.append(k)
for k,v in ALIAS.items(): REG.pop(k,None)
for k,v in EXTRA.items(): REG[k]=v

# 2026-10-15: artículo con el título en cursiva -> cursiva en la revista (APA 7)
_pat=re.compile(r"^(.*?\(\d{4}[a-z]?\)\.) \*([^*]+)\*\. ([^*.][^*]*?), (\d+)(?:\((\d+)\))?, ((?:[A-Za-z]?\d+)(?:[–-][A-Za-z]?\d+)?)\.$")
_pat2=re.compile(r"^(.*?\(\d{4}[a-z]?\)\.) \*([^*]+?)\. ([^*]+?), (\d+)(?:\((\d+)\))?, ((?:\d+)(?:[–-]\d+)?)\*$")
def _fx(t):
    m=_pat.match(t)
    if m: return f"{m.group(1)} {m.group(2)}. *{m.group(3)}, {m.group(4)}*"+(f"({m.group(5)})" if m.group(5) else "")+f", {m.group(6)}."
    m=_pat2.match(t)
    if m: return f"{m.group(1)} {m.group(2)}. *{m.group(3)}, {m.group(4)}*"+(f"({m.group(5)})" if m.group(5) else "")+f", {m.group(6)}."
    return t
for _k in list(REG):
    if isinstance(REG[_k],str): REG[_k]=_fx(REG[_k])

STOP=set('Véase Verificado Tabla Fases La El Las Los Un Una Yo Documento Diccionario Logoanálisis Logotherapy Oxford American Routledge Transformations Attachment Understanding Percibiendo The Florecer Seminario Cap Editorial Cuatro Client-Centered Segal'.split())
def canon(k): return ALIAS.get(k,k)
byau=collections.defaultdict(list)
for k in REG:
    s,y,_=k.split("|"); byau[(s,y)].append(k)
def h32(s):
    h=5381
    for i in range(0,len(s.encode("utf-16-le")),2):
        c=int.from_bytes(s.encode("utf-16-le")[i:i+2],"little")
        h=((h<<5)+h+c)&0xFFFFFFFF
    return h
MEN=re.compile(r"((?:De |Van |Von |Di |Mac|Mc|Da )?[A-ZÁÉÍÓÚÑ][\wáéíóúñ'’\-]+(?:\s[A-ZÁÉÍÓÚÑ][\wáéíóúñ'’\-]+)?)(?:,\s*(?:[A-ZÁÉÍÓÚÑ]\.\s?)+)?(?:\s*(?:,|y|&|et al\.)\s*(?:[A-ZÁÉÍÓÚÑ][\wáéíóúñ'’\-]+(?:,\s*(?:[A-ZÁÉÍÓÚÑ]\.\s?)+)?)?)*[^()]{0,70}?\((\d{4}[a-z]?(?:\s?[/–-]\s?\d{4})?|s\. ?f\.)(?:,\s*(pp?\.\s*[\d–\-, y]+))?\)")
FU={}; sinref=0
def lookup(surname,year,ctx=""):
    y=re.sub(r"[a-z]$","",year.split("/")[0].split("–")[0].split("-")[0]) if year[0].isdigit() else year
    ks=byau.get((bib.norm(surname),y))
    if surname=="Martínez" and re.search(r"Martínez, E\.",ctx): ks=byau.get(("martinezortiz",y)) or ks
    if not ks:
        # apellido compuesto: probar con la última palabra
        ks=byau.get((bib.norm(surname.split()[-1]),y))
    if not ks: return None
    if len(ks)>1:
        nc=bib.norm(ctx)
        if surname=="Tart" and y=="1975" and "sciencestatesofconsciousness" in nc: return "tart|1975|science"
        if surname=="Freud" and y=="1912" and "notasobreelconceptodeloinconsciente" in nc: return "freud|1912|nota"
        sc=[(1 if (k.split("|")[2] and k.split("|")[2][:6] in nc) else 0, 0 if k in INC else 1) for k in ks]
        return ks[max(range(len(ks)),key=lambda i:sc[i])]
    return ks[0]
def cita(autores,anio,loc):
    return f"{autores}, {anio}"+(f", {loc}" if loc else "")
out={}
S=bib.todas()
for raw in S:
    refs=[]; cites=[]
    base=re.sub(r"\s+"," ",raw)
    cm=re.search(r"[.,;]?\s*(?:[Cc]itad[oa]s? en|tal como se cita en)\s+(.+)$",base)
    sec=None
    if cm:
        sec=cm.group(1)
        base=base[:cm.start()]
    for u in bib.trocea(base):
        rec=bib.parse_ref(u)
        if rec and rec["resto"]:
            k=canon(bib.clave(rec))
            if k in REG or k in ALIAS.values(): refs.append(k)
            else:
                # clave sin registro (descartada): buscar por autor-año
                kk=lookup(rec["autores"][0].split(",")[0],rec["anio"],u)
                if kk: refs.append(kk)
            cites.append(cita(bib.apellidos(rec["autores"]),rec["anio"],rec["loc"]))
            continue
        for m in MEN.finditer(u):
            ap=m.group(1); anio=m.group(2).replace(" ",""); loc=m.group(3)
            if ap.split()[0] in STOP: continue
            if re.match(r"^s\.?f\.?$",anio): anio="s. f."
            kk=lookup(ap,anio,u)
            if kk: refs.append(kk)
            texto=m.group(0)
            suf=" y "+re.search(r"(?:y|&)\s+([A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+)",texto).group(1) if re.search(r"\b(?:y|&)\s+[A-ZÁÉÍÓÚÑ]",texto.split("(")[0]) else (" et al." if "et al" in texto.split("(")[0] else "")
            if re.fullmatch(r"(?:(?:[A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+)(?:\s[A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+)?,\s*(?:[A-ZÁÉÍÓÚÑ]\.\s?)+[,;]?\s*)+",texto.split("(")[0]+" ") and len(re.findall(r"[A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+,\s*(?:[A-ZÁÉÍÓÚÑ]\.\s?)+",texto.split("(")[0]))>=3: suf=" et al."
            _m2=re.findall(r"((?:[A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+)(?:\s[A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+)?),\s*(?:[A-ZÁÉÍÓÚÑ]\.\s?)+",texto.split("(")[0])
            if len(_m2)==2 and suf=="" and re.fullmatch(r"(?:(?:[A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+)(?:\s[A-ZÁÉÍÓÚÑ][\w'’\-áéíóúñ]+)?,\s*(?:[A-ZÁÉÍÓÚÑ]\.\s?)+[,;]?\s*)+",texto.split("(")[0]+" "): suf=" y "+_m2[1]
            cites.append(cita(ap+suf,anio,loc))
    if sec:
        for m in MEN.finditer(sec):
            ap=m.group(1); anio=m.group(2).replace(" ",""); loc=m.group(3)
            if ap.split()[0] in STOP: continue
            kk=lookup(ap,anio)
            if kk: refs.append(kk)
            if cites: cites[-1]=cites[-1]+f", como se citó en {cita(ap,anio,loc)}"
            else: cites.append(f"como se citó en {cita(ap,anio,loc)}")
    refs=list(dict.fromkeys(refs))
    en="("+"; ".join(dict.fromkeys(cites))+")" if cites else ""
    if not refs: sinref+=1
    if refs and en:
        _r=REG.get(refs[0],"") if isinstance(REG.get(refs[0],""),str) else ""
        _ry=re.match(r"^[^(]*\((\d{4})\)",_r); _og=re.search(r"(?:Trabajo|Obra) original publicad[oa] en (\d{4})",_r)
        if _ry and _og and _ry.group(1)!=_og.group(1):
            en=re.sub(r"(?<![\d/])"+_og.group(1)+r"(?![\d/])",_og.group(1)+"/"+_ry.group(1),en,count=1)
    out[h32(raw)]=[en,refs]
# colisiones
hs=collections.Counter(h32(r) for r in S); print("colisiones",sum(1 for v in hs.values() if v>1))
print("cadenas",len(S),"sin referencia resuelta",sinref,"registro",len(REG),"incompletas",len(INC))
refs_js="export const REFS = "+json.dumps(REG,ensure_ascii=False,indent=0)+";\n"
fu_js="export const FUENTES = "+json.dumps({str(k):v for k,v in out.items()},ensure_ascii=False,separators=(",",":"))+";\n"
inc_js="export const REFS_INCOMPLETAS = "+json.dumps(sorted(set(k for k in INC if k in REG)),ensure_ascii=False)+";\n"
hdr="/* Generado a partir de las fuentes de la aplicación (ver scripts de revisión). Referencias en APA 7 con *cursivas*.\n   FUENTES: hash de la cadena original -> [cita en el texto, claves de referencia]. REFS_INCOMPLETAS: referencias a las que les falta editorial, páginas o título del artículo en la fuente. */\n"
open("/Users/nicolasayasandoval/Downloads/psicoterapias-app/src/datos/bibliografia.js","w").write(hdr+refs_js+inc_js+fu_js)
json.dump(out,open("fuentes_out.json","w"))
