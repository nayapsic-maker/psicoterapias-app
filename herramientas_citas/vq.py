import fitz,glob,os,re,json,unicodedata,sys
B=os.path.expanduser("~/Library/CloudStorage/GoogleDrive-n.ayapsic@gmail.com/Mi unidad/Biblioteca Psicología/Perspectivas Psicoterapéuticas/")
def nrm(s):
    s=unicodedata.normalize("NFKD",s.lower()); s="".join(c for c in s if not unicodedata.combining(c))
    s=re.sub(r"-\s*\n\s*","",s); return re.sub(r"[^a-z0-9]+"," ",s).strip()
CACHE={}
def pages(path):
    if path not in CACHE:
        d=fitz.open(path); CACHE[path]=[(p.get_text()) for p in d]
    return CACHE[path]
def files(kw):
    return [f for f in glob.glob(B+"**/*.pdf",recursive=True) if all(k.lower() in os.path.basename(f).lower() for k in kw)]
def folio(txt):
    L=[l.strip() for l in txt.split("\n") if l.strip()]
    c=[]
    for l in L[:3]+L[-3:]:
        if re.fullmatch(r"\d{1,4}",l): c.append(l)
        m=re.match(r"^(\d{1,4})\s+\D",l) or re.search(r"\D\s(\d{1,4})$",l)
        if m and len(l)<80: c.append(m.group(1))
    return c[:2]
def find(kw,quote,k=7):
    q=nrm(re.sub(r"\[\.\.\.\]|\.\.\.|…|«|»|\"","  ",quote)); w=q.split()
    if len(w)<k: return []
    wins=[" ".join(w[i:i+k]) for i in range(0,len(w)-k+1,max(1,(len(w)-k)//4 or 1))][:5]
    hits=[]
    for f in files(kw):
        for i,t in enumerate(pages(f)):
            n=nrm(t)
            for wn in wins:
                if wn in n:
                    hits.append((os.path.basename(f)[:50],i+1,folio(t),wn[:40])); break
    return hits
if __name__=="__main__":
    kw=sys.argv[1].split("+"); print(find(kw,sys.argv[2]))
