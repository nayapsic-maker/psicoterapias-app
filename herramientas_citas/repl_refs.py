import json,re,glob
S=json.load(open("sin_now.json"))
NEW={}
def put(i,new): NEW[S[i]]=new
put(0,"Ablon, J. S., Marci, C. (2004). Psychotherapy process: The missing link: Comment on Westen, Novotny, and Thompson-Brenner (2004). Psychological Bulletin, 130(4), 664–668.")
put(3,"Turner, R. M., Ascher, L. M. (1979). Controlled comparison of progressive relaxation, stimulus control, and paradoxical intention therapies for insomnia. Journal of Consulting and Clinical Psychology, 47(3), 500–508.")
put(4,"Bannink, F. P. (2017). Positive CBT in practice. En C. Proctor (Ed.), Positive psychology interventions in practice (pp. 15–28). Springer.")
put(12,"Botella, C., Baños, R. M., Guillen, V. (2017). Positive technologies for improving health and well-being. En C. Proctor (Ed.), Positive psychology interventions in practice (pp. 219–234). Springer.")
put(17,"Castonguay, L. G., Beutler, L. E. (Eds.). (2006, p. 5). Principles of therapeutic change that work. Oxford University Press.")
put(21,"Cuijpers, P., van Straten, A., Warmerdam, L. (2007). Problem solving therapies for depression: A meta-analysis. European Psychiatry, 22(1), 9–15.")
put(24,"Dekeyser, M., Prouty, G., Elliott, R. (2008). Pre-therapy process and outcome: A review of research instruments and findings. Person-Centered and Experiential Psychotherapies, 7(1), 37–55.")
put(34,S[34].replace("Behaviour Research and Therapy, 120.","Behaviour Research and Therapy, 120, Artículo 103444.").replace("Alvarez-Iglesias","Álvarez-Iglesias").replace("de Prado-Gordillo","Núñez de Prado-Gordillo"))
put(35,"Gerz, H. O. (1966). Experience with the logotherapeutic technique of paradoxical intention in the treatment of phobic and obsessive-compulsive patients. American Journal of Psychiatry, 123(5), 548–553.")
put(37,"Howard, J. S., Sparkman, C. R., Cohen, H. G., Green, G., Stanislaw, H. (2005). A comparison of intensive behavior analytic and eclectic treatments for young children with autism. Research in Developmental Disabilities, 26(4), 359–383; Howard, J. S., Stanislaw, H., Green, G., Sparkman, C. R., Cohen, H. G. (2014). Comparison of behavior analytic and eclectic early interventions for young children with autism after three years. Research in Developmental Disabilities, 35(12), 3326–3344.")
put(36,"Hayes, S. C., Strosahl, K. D., Wilson, K. G. (1999/2012). Acceptance and Commitment Therapy. Guilford Press.")
put(41,"Kernberg, O. F. (1967). Borderline personality organization. Journal of the American Psychoanalytic Association, 15(3), 641–685; Kernberg, O. F. (1984). Severe personality disorders: Psychotherapeutic strategies. Yale University Press.")
put(42,"Kohut, H. (1972, p. 380). Thoughts on narcissism and narcissistic rage. The Psychoanalytic Study of the Child, 27(1), 360–400.")
for i in (43,44): put(i,"Kolden, G. G., Wang, C.-C., Austin, S. B., Chang, Y., Klein, M. H. (2018). Congruence/genuineness: A meta-analysis. Psychotherapy, 55(4), 424–433."+S[i].split("424–433.")[1] if "424–433." in S[i] and S[i].split("424–433.")[1].strip() else "Kolden, G. G., Wang, C.-C., Austin, S. B., Chang, Y., Klein, M. H. (2018). Congruence/genuineness: A meta-analysis. Psychotherapy, 55(4), 424–433.")
for i in (45,46,47,48): put(i,S[i].replace("Krycka, K. C. e Ikemi","Krycka, K. C., Ikemi"))
put(63,"Levy Berg, A., Sandell, R., Sandahl, C. (2009). Affect-focused body psychotherapy in patients with generalized anxiety disorder: Evaluation of an integrative method. Journal of Psychotherapy Integration, 19(1), 67–85.")
put(65,"Marlatt, G. A., Donovan, D. M. (Eds.). (2005). Relapse prevention: Maintenance strategies in the treatment of addictive behaviors (2.ª ed.). Guilford Press.")
put(82,"Paivio, S. C., Holowaty, K. A. M., Hall, I. E. (2004). The influence of therapist adherence and competence on client reprocessing of child abuse memories. Psychotherapy: Theory, Research, Practice, Training, 41(1), 56–68.")
put(88,"Pos, A. E., Greenberg, L. S., Goldman, R. N., Korman, L. M. (2003). Emotional processing during experiential treatment of depression. Journal of Consulting and Clinical Psychology, 71(6), 1007–1016.")
put(89,"Project MATCH Research Group (1993). Project MATCH: Rationale and methods for a multisite clinical trial matching patients to alcoholism treatment. Alcoholism: Clinical and Experimental Research, 17(6), 1130–1145; Project MATCH Research Group (1997). Matching alcoholism treatments to client heterogeneity: Project MATCH posttreatment drinking outcomes. Journal of Studies on Alcohol, 58(1), 7–29.")
put(90,"Robinson, E. A. R., Cranford, J. A., Webb, J. R., Brower, K. J. (2007). Six-month changes in spirituality, religiousness, and heavy drinking in a treatment-seeking sample. Journal of Studies on Alcohol and Drugs, 68(2), 282–290.")
put(98,"Van der Meiden, J., Noordegraaf, M., van Ewijk, H. (2018). How is contextual therapy applied today? An analysis of the practice of current contextual therapists. Contemporary Family Therapy, 41(1), 12–23.")
put(101,"Öst, L. G. (2014). The efficacy of acceptance and commitment therapy: An updated systematic review and meta-analysis. Behaviour Research and Therapy, 61, 105–121.")
put(29,"Frankl, V. E. (2010). The feeling of meaninglessness: A challenge to psychotherapy and philosophy. Marquette University Press.")
put(30,"Freud, S. (1912). Consejos al médico sobre el tratamiento psicoanalítico; Freud, S. (1913). Sobre la iniciación del tratamiento (Nuevos consejos sobre la técnica del psicoanálisis, I).")
put(1,"Vaihinger, H. (1924). The philosophy of 'as if'.")
for i in (20,62):
    put(i,S[i].replace("(1970/1973), en Fagan y Shepherd (Comps.),","(1970), en Fagan, J., Shepherd, I. L. (Comps.). (2005)."))
for i,s in enumerate(S):
    if s.startswith("Lacan, J. — ") and "Véase también: " in s: NEW[s]=s.split("Véase también: ",1)[1]
    if s.startswith("Binswanger, citado en Martínez Ortiz"): NEW[s]=s.replace("Binswanger, citado en ","")
    if s.startswith("Martínez Ortiz, E. (Comp.). Las psicoterapias existenciales. Manual Moderno (2011)"): NEW[s]=s.replace("Martínez Ortiz, E. (Comp.). Las psicoterapias existenciales. Manual Moderno (2011)","Martínez Ortiz, E. (Comp.). (2011). Las psicoterapias existenciales. Manual Moderno")
    m=re.match(r"Maultsby, M\. C\., Jr\. \((\d{4})\)\. (.*)$",s)
    if m: NEW[s]="Maultsby, M. C. (%s). %s"%(m.group(1),m.group(2))
put(71,"Maultsby, M. C. (1971). Systematic, written homework in psychotherapy. Psychotherapy: Theory, Research y Practice, 8(3), 195–198; Maultsby, M. C. (1975). Help yourself to happiness: Through rational self-counseling. Esplanade Books; Maultsby, M. C. (1984). Rational behavior therapy. Prentice-Hall.")
put(72,"Maultsby, M. C. (1971). Systematic, written homework in psychotherapy. Psychotherapy: Theory, Research y Practice, 8(3), 195–198; Maultsby, M. C. (1984). Rational behavior therapy. Prentice-Hall.")
for s in (S[51],S[52],S[54],S[53],S[49],S[50]):
    pass
json.dump(NEW,open("repl_map.json","w"),ensure_ascii=False)
print(len(NEW))
files=["/Users/nicolasayasandoval/Downloads/psicoterapias-app/src/App.jsx","/Users/nicolasayasandoval/Downloads/psicoterapias-app/src/datos/protocolos.js"]
tot=0
for f in files:
    t=open(f).read()
    for old,new in NEW.items():
        if old==new: continue
        body=r"\s+".join(re.escape(w) for w in old.split(" "))
        pat=re.compile(body)
        t,n=pat.subn(lambda m:new.replace("\\","\\\\"),t); tot+=n
    open(f,"w").write(t)
print("reemplazos",tot)
