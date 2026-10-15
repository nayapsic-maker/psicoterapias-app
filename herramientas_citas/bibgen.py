import sys,json,collections,re
sys.path.insert(0,'.')
import bib
S=bib.todas()
cl=collections.defaultdict(list)
for s0 in S:
    for s in bib.trocea(s0):
        r=bib.parse_ref(s)
        if r and r["resto"] and not bib.solo_revista(r["resto"]): cl[bib.clave(r)].append((s,r))
rows=[]
for k,v in cl.items():
    cand=[]
    for s,r in v:
        a,inc=bib.apa(r)
        cand.append((inc,-len(a),a,s,r))
    cand.sort(key=lambda x:(x[0],x[1]))
    inc,_,a,s,r=cand[0]
    flags=[]
    if inc: flags.append("INC")
    if ";" in r["resto"] or len(a)>300: flags.append("RARO")
    if re.search(r"\)\.\s\*[,;]|\)\.\s\*\.",a) or a.count("*")%2: flags.append("BASURA")
    for seg in re.findall(r"\*([^*]*)\*",a):
        if len(seg)<6 or len(seg)>170 or seg.count("(")!=seg.count(")") or re.search(r"\b[A-Z]$",seg) or re.search(r"\b(?:Vol|pp?)$",seg): flags.append("REV"); break
    rows.append(dict(key="|".join(k),apa=a,flags=flags,n=len(v),first=r["autores"][0].split(",")[0],anio=r["anio"],raw=s))
rows.sort(key=lambda x:(bib.norm(x["first"]),x["anio"]))
json.dump(rows,open("bib_rows.json","w"),ensure_ascii=False,indent=0)
print(len(rows),sum(1 for r in rows if "INC" in r["flags"]),sum(1 for r in rows if "RARO" in r["flags"]))
