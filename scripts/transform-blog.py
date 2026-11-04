import json, re, html, sys

raw = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'scripts/blog-raw.json'))
OUT = sys.argv[2] if len(sys.argv) > 2 else 'data/blog.json'

def strip_tags(s):
    if not s:
        return ""
    t = re.sub(r'<[^>]+>', ' ', s)
    return html.unescape(re.sub(r'\s+', ' ', t)).strip()

def clean_alt(s):
    """Language rule (Don 2026-11-03): no fabric-weight specs in customer-facing
    copy. A live-store article image altText survived the store sweep carrying
    a spec string ("... 425 GSM"); the app never renders weight specs, so the
    spec fragment is removed here — words untouched, data otherwise faithful.
    (The live residual itself is the parent lane's to fix at the source.)"""
    if not s:
        return s
    t = re.sub(r'\s*[—–-]?\s*\d{3}\s*gsm\b', '', s, flags=re.I)
    t = re.sub(r'\s*\bgsm\b', '', t, flags=re.I)
    t = re.sub(r'\s+', ' ', t).strip(' —–-')
    return t.strip()

articles = []
for a in raw:
    if not a.get('isPublished') or not a.get('publishedAt'):
        continue
    img = a.get('image')
    articles.append({
        "id": a['id'],
        "handle": a['handle'],
        "title": a['title'],
        "excerpt": strip_tags(a.get('summary'))[:300],
        "summaryHtml": a.get('summary') or "",
        "bodyHtml": a.get('body') or "",
        "publishedAt": a['publishedAt'],
        "updatedAt": a.get('updatedAt') or a['publishedAt'],
        "tags": a.get('tags') or [],
        "author": (a.get('author') or {}).get('name') or "Anchor Me Down",
        "image": ({"url": img['url'], "width": img.get('width'), "height": img.get('height'),
                   "alt": clean_alt(img.get('altText') or a['title'])} if img else None),
    })

articles.sort(key=lambda x: x['publishedAt'], reverse=True)
doc = {"blogHandle": "news", "blogTitle": "The Journal", "articles": articles,
       "exportedFrom": "Shopify Admin GraphQL — blog gid://shopify/Blog/57294787"}
json.dump(doc, open(OUT, 'w'), indent=1)
print(f"transformed {len(articles)} published articles -> {OUT}")
