import json, subprocess, sys, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Q = open(os.path.join(BASE, 'scripts/queries/meta.graphql')).read()
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(BASE, 'scripts/meta-raw.json')

def call(query, variables):
    args = {"query": query, "variables": variables}
    r = subprocess.run(['/opt/hatch/bin/shopify','call-tool','--name','graphql_query','--arguments-json', json.dumps(args)],
                       capture_output=True, text=True)
    outer = json.loads(r.stdout)
    if not outer.get('ok'):
        raise SystemExit(f"connector call failed: {r.stdout[:500]}")
    # result content contains a text block with the GraphQL JSON
    for block in outer['result']['content']:
        t = block.get('text','')
        try:
            return json.loads(t)
        except Exception:
            continue
    raise SystemExit(f"unparseable result: {r.stdout[:500]}")

res = call(Q, {})
if 'errors' in res:
    raise SystemExit(f"GraphQL errors: {json.dumps(res['errors'])[:800]}")
meta = {'collections': res['data']['collections'], 'pages': res['data']['pages']}
json.dump(meta, open(OUT,'w'), indent=1)
print(f"exported {len(meta['collections']['edges'])} collections, {len(meta['pages']['edges'])} pages -> {OUT}")
