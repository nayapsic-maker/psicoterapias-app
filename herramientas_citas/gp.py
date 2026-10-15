import sys,re,glob,os
import fitz
B=os.path.expanduser("~/Library/CloudStorage/GoogleDrive-n.ayapsic@gmail.com/Mi unidad/Biblioteca Psicología/Perspectivas Psicoterapéuticas/")
f=glob.glob(B+"**/"+sys.argv[1]+"*.pdf",recursive=True)
print(f[:1])
d=fitz.open(f[0]); pat=re.compile(sys.argv[2],re.I); n=0
for i,p in enumerate(d):
    t=p.get_text()
    for m in pat.finditer(t):
        s=t[max(0,m.start()-150):m.end()+200].replace("\n"," ")
        print(f"[pdf {i+1}] ...{s}...\n"); n+=1
        if n>=int(sys.argv[3] if len(sys.argv)>3 else 5): sys.exit()
