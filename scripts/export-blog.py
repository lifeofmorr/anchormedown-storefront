import json, subprocess, sys

Q = open('/tmp/blog-query.graphql').read()
OUT = sys.argv[1] if len(sys.argv) > 1 else 'scripts/blog-raw.json'

def call(query, variables):
    args = {"query": query, "variables": variables}
    r = subprocess.run(['/opt/hatch/bin/shopify','call-tool','--name','graphql_query','--arguments-json', json.dumps(args)],
                       capture_output=True, text=True)
    outer = json.loads(r.stdout)
    if not outer.get('ok'):
        raise SystemExit(f"connector call failed: {r.stdout[:500]}")
    for block in outer['result']['content']:
        t = block.get('text','')
        try:
            return json.loads(t)
        except Exception:
            continue
    raise SystemExit(f"unparseable result: {r.stdout[:500]}")

articles = []
cursor = None
while True:
    res = call(Q, {"cursor": cursor})
    if 'errors' in res:
        raise SystemExit(f"GraphQL errors: {json.dumps(res['errors'])[:800]}")
    conn = res['data']['blog']['articles']
    for e in conn['edges']:
        articles.append(e['node'])
    if conn['pageInfo']['hasNextPage']:
        cursor = conn['pageInfo']['endCursor']
    else:
        break

json.dump(articles, open(OUT,'w'), indent=1)
print(f"exported {len(articles)} articles -> {OUT}")
