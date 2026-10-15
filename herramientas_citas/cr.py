import json,urllib.request,urllib.parse,sys,re
def q(s,rows=2):
    u="https://api.crossref.org/works?rows=%d&query.bibliographic=%s&select=DOI,title,author,issued,container-title,volume,issue,page,publisher,type"%(rows,urllib.parse.quote(s))
    try:
        r=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={"User-Agent":"psiconautas-refs/1.0 (mailto:n.ayapsic@gmail.com)"}),timeout=20))
    except Exception as e: return [("ERR",str(e))]
    out=[]
    for it in r["message"]["items"]:
        au=", ".join(f'{a.get("family","")} {a.get("given","")[:1]}' for a in it.get("author",[])[:6])
        out.append((au,it.get("issued",{}).get("date-parts",[[None]])[0][0],(it.get("title") or [""])[0][:90],(it.get("container-title") or [""])[0][:50],it.get("volume"),it.get("issue"),it.get("page"),it.get("DOI"),it.get("publisher","")[:30]))
    return out
Q={
"Ablon":"Ablon Marci 2004 Psychological Bulletin 130 psychotherapy process missing link",
"Ascher":"Ascher Turner 1979 Paradoxical intention and insomnia Journal of Consulting and Clinical Psychology",
"Cuijpers":"Cuijpers van Straten Warmerdam 2007 Problem solving therapies for depression meta-analysis European Psychiatry",
"Dekeyser":"Dekeyser Prouty Elliott 2008 Person-Centered and Experiential Psychotherapies 7",
"Froján":"Froján-Parga de Prado-Gordillo Alvarez-Iglesias Alonso-Vega 2019 Functional Behavioral Assessment-based interventions",
"Gerz":"Gerz 1966 Experience with the logotherapeutic technique of paradoxical intention American Journal of Psychiatry 123",
"Howard":"Howard Sparkman Cohen Green Stanislaw 2005 comparison intensive behavior analytic eclectic treatments young children autism Research in Developmental Disabilities",
"Hutzell":"Hutzell Peterson 1986 Use of paradoxical intention logotherapy International Forum for Logotherapy",
"Kolden":"Kolden Wang Austin 2018 Congruence genuineness meta-analysis Psychotherapy 55",
"Krycka":"Krycka Ikemi 2016 Focusing-oriented experiential psychotherapy from research to practice",
"LevyBerg":"Levy Berg Sandell Sandahl 2009 Journal of Psychotherapy Integration 19",
"Mones":"Mones Schwartz 2007 Journal of Psychotherapy Integration 17 internal family systems",
"Paivio":"Paivio Holowaty Hall 2004 Psychotherapy Theory Research Practice Training 41 emotion-focused abuse",
"Pos":"Pos Greenberg Korman Goldman 2003 Emotional processing experiential therapy depression Journal of Consulting and Clinical Psychology 71",
"Project MATCH":"Project MATCH Research Group 1997 Matching alcoholism treatments to client heterogeneity Journal of Studies on Alcohol",
"Robinson":"Robinson Krentzman Webb Brower 2007 Journal of Studies on Alcohol and Drugs 68",
"vanderMeiden":"van der Meiden Noordegraaf van Ewijk 2018 How is contextual therapy applied today Contemporary Family Therapy",
"Watson":"Watson Gordon Stermac 2003 Comparing the effectiveness of process-experiential with cognitive-behavioral psychotherapy depression Journal of Consulting and Clinical Psychology 71",
"Öst":"Öst 2014 efficacy of acceptance and commitment therapy updated systematic review meta-analysis Behaviour Research and Therapy",
"Hutzell85":"Hutzell Peterson 1985 Journal of Clinical Psychology logotherapy",
}
for k,s in Q.items():
    print("##",k)
    for x in q(s): print("  ",x)
