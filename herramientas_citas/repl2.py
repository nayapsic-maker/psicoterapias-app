import json,re
S=json.load(open("sin_now3.json"))
NEW={}
def put(i,n): NEW[S[i]]=n
# en -> forma que el motor resuelve
for i in (5,11): put(i,S[i].replace("Levine, T. (Ed.) (2012)","Levine, T. (2012)"))
put(10,"Clemmens, M., en Bar-Yoseph Levine, T. (2012), Gestalt therapy: Advances in theory and practice (capítulo sobre la sintonía).")
for i in (3,4): put(i,re.sub(r"^Beltrán Ortega,?(?: M\.,)? en ","",S[i]))
put(9,re.sub(r"^Caso «[^»]+», en ","",S[9]))
put(12,"Cohn, R. C. (1970/1973), citado en Fagan, J., Shepherd, I. L. (Comps.). (2005). Teoría y técnica de la psicoterapia guestáltica. Amorrortu.")
put(31,"Levitsky, A., Perls, F. (1970/1973), citado en Fagan, J., Shepherd, I. L. (Comps.). (2005). Teoría y técnica de la psicoterapia guestáltica. Amorrortu.")
put(13,"De Castro, A. (2011). Fundamentos de psicoterapia existencial en Norteamérica. En E. Martínez Ortiz (Comp.), Las psicoterapias existenciales. Manual Moderno.")
for i in (8,36,37,48,53): put(i,S[i].replace("De Castro, A. (2008)","De Castro, A. (2011)").replace("citado por De Castro","citado por De Castro").replace("citado en De Castro","citado en De Castro"))
put(50,"Signorelli, S. (2014). Las ideas de Binswanger. En E. Martínez Ortiz (Comp.), Las psicoterapias existenciales. Manual Moderno.")
put(33,"Martínez Ortiz, E. (Comp.). (2011). Las psicoterapias existenciales. Manual Moderno.")
put(34,"Martínez Ortiz, E. (Comp.). (2011). Las psicoterapias existenciales. Manual Moderno.")
put(44,"Philippson, P. (2001), citado en Bar-Yoseph Levine, T. (2012).")
put(19,"Freud, S. (1916-1917, p. 315). Conferencias de introducción al psicoanálisis (series complementarias).")
put(7,"Brown, L. S. (1994). Subversive dialogues: Theory in feminist therapy. Basic Books; Brown, L. S. (2018). Feminist therapy (2.ª ed.). American Psychological Association.")
put(14,"De Shazer, S. (1991). Putting difference to work. Norton; De Shazer, S. (1994). Words were originally magic. Norton.")
put(15,"Doss, B. D., Cicila, L. N., Georgia, E. J., Roddy, M. K., Nowlan, K. M., Benson, L. A., Christensen, A. (2016). A randomized controlled trial of the web-based OurRelationship program: Effects on relationship and individual functioning. Journal of Consulting and Clinical Psychology, 84(4), 285–296.")
put(22,"Hutzell, R. R., Peterson, T. J. (1985). An existential vacuum scale for the MMPI; Hutzell, R. R., Peterson, T. J. (1986). Use of the Life Purpose Questionnaire with alcoholic in-patients.")
put(38,"Mones, A., Schwartz, R. (2007). The functional hypothesis: A family systems contribution toward an understanding of the healing process of the common factors. Journal of Psychotherapy Integration, 17(4), 314–329.")
put(52,"Watson, J. C., Gordon, L. B., Stermac, L., Kalogerakos, F., Steckley, P. (2003). Comparing the effectiveness of process-experiential with cognitive-behavioral psychotherapy in the treatment of depression. Journal of Consulting and Clinical Psychology, 71(4), 773–781.")
put(43,"Perls, Hefferline y Goodman (1951).")
put(35,"Maslow, A. H. (1954/1970); Maslow, A. H. (1968).")
put(39,"National Autism Center (2015). Findings and conclusions: National standards project, phase 2.")
for i in (27,28): NEW[S[i]]=S[i].replace("1955-56","1955-1956")
json.dump(NEW,open("repl_map2.json","w"),ensure_ascii=False)
files=["/Users/nicolasayasandoval/Downloads/psicoterapias-app/src/App.jsx","/Users/nicolasayasandoval/Downloads/psicoterapias-app/src/datos/protocolos.js"]
tot=0
for f in files:
    t=open(f).read()
    for old,new in NEW.items():
        if old==new: continue
        pat=re.compile(r"\s+".join(re.escape(w) for w in old.split(" ")))
        t,n=pat.subn(lambda m:new.replace("\\","\\\\"),t); tot+=n
    open(f,"w").write(t)
print(len(NEW),tot)
