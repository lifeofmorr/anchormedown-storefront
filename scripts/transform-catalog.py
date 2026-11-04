"""Transform the raw Shopify GraphQL export into the storefront's typed data module.
GSM rule (hard): a GSM value is claimed ONLY when it appears in the product's own
live Shopify description text — never invented, never inferred from product type.
This reproduces the verified GSM register exactly (425 tees / 400 / 380 / 190 / none).
"""
import json, re, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw = json.load(open(os.path.join(BASE, 'scripts/catalog-raw.json')))
meta = json.load(open(os.path.join(BASE, 'scripts/meta-raw.json')))

def numeric(gid): return gid.rsplit('/', 1)[-1]

products = []
for p in raw:
    desc = p['description'] or ''
    m = re.search(r'(\d{3})\s*GSM', desc)
    gsm = int(m.group(1)) if m else None
    images = []
    for e in p['media']['edges']:
        n = e['node']
        if n['mediaContentType'] == 'IMAGE' and n.get('image'):
            img = n['image']
            images.append({'url': img['url'], 'width': img.get('width'), 'height': img.get('height'),
                           'alt': img.get('altText') or n.get('alt') or p['title']})
    variants = []
    for e in p['variants']['edges']:
        v = e['node']
        variants.append({
            'id': numeric(v['id']),
            'title': v['title'],
            'price': float(v['price']),
            'compareAtPrice': float(v['compareAtPrice']) if v.get('compareAtPrice') else None,
            'availableForSale': v['availableForSale'],
            'options': {o['name']: o['value'] for o in v['selectedOptions']},
        })
    products.append({
        'id': numeric(p['id']),
        'handle': p['handle'],
        'title': p['title'],
        'productType': p['productType'],
        'tags': p['tags'],
        'description': desc,
        'descriptionHtml': p['descriptionHtml'],
        'gsm': gsm,
        'priceMin': float(p['priceRangeV2']['minVariantPrice']['amount']),
        'priceMax': float(p['priceRangeV2']['maxVariantPrice']['amount']),
        'options': [{'name': o['name'], 'values': o['values']} for o in p['options']],
        'images': images,
        'variants': variants,
        'collections': [e['node']['handle'] for e in p['collections']['edges']],
    })

by_handle = {p['handle']: p for p in products}
collections = []
for e in meta['collections']['edges']:
    c = e['node']
    handles = [pe['node']['handle'] for pe in c['products']['edges']]
    collections.append({
        'handle': c['handle'], 'title': c['title'], 'description': c['description'] or '',
        'image': c['image']['url'] if c.get('image') else None,
        'productHandles': [h for h in handles if h in by_handle],
    })

pages = {}
for e in meta['pages']['edges']:
    pg = e['node']
    if pg['handle'] in ('black-friday', 'giveaway'):
        pages[pg['handle']] = {'title': pg['title'], 'handle': pg['handle'], 'bodyHtml': pg['body'],
                               'isPublished': pg['isPublished']}

out = {'products': products, 'collections': collections, 'pages': pages,
       'exportedFrom': 'Shopify Admin GraphQL (live store anchor-me-down-apparel)'}
os.makedirs(os.path.join(BASE, 'data'), exist_ok=True)
json.dump(out, open(os.path.join(BASE, 'data/catalog.json'), 'w'), indent=1)
print(f"products={len(products)} collections={len(collections)} pages={list(pages)}")
gsm_counts = {}
for p in products: gsm_counts[p['gsm']] = gsm_counts.get(p['gsm'], 0) + 1
print("GSM distribution:", gsm_counts)
