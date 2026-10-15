import json,sys,re
sys.path.insert(0,".")
import vq
R=json.load(open("vq_items.json")); out=[]
for r in R:
    h=vq.find([r["au"],"("+r["yr"]+")"],r["q"]) or vq.find([r["au"]],r["q"])
    fol=[ (x[0][:30],x[1],x[2]) for x in h[:3]]
    ok=None
    nums=[f for x in h for f in x[2]]
    if nums: ok=r["claim"] in nums
    print(r["persp"][:8],"|",r["obra"][:35],"| claim",r["claim"],"| hits",fol,"| OK" if ok else ("| MISMATCH" if ok is False else "| ?"),flush=True)
    out.append({**r,"hits":fol,"ok":ok})
json.dump(out,open("vq_res.json","w"),ensure_ascii=False)
