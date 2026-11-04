"""Carry the verified INTERNAL gsm register forward across a re-export.

Why this exists: transform-catalog.py derives `gsm` from the product's own
live description text. Don's 2026-11-03 language ruling removed fabric-weight
numbers from ALL customer-facing copy (live store swept clean, verified
zero), so a fresh export's descriptions no longer carry the spec and the
derivation yields None for every product. The gsm VALUES themselves remain
verified internal truth (the Weight Room classes, THE HEAVIEST badge logic,
and /search?q=heaviest all run on them; they are never rendered as copy).

This step copies the register from the previous data/catalog.json, keyed by
product handle, into the new one — and asserts the class distribution and
the 13-product heavy line match the verified register exactly. Products with
no prior export entry (new to the store) keep gsm=None — no claim — until
their weight is verified at the source (PODpartner).
"""
import json, os, sys, collections

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD = sys.argv[1]  # path to previous data/catalog.json (pre-re-export backup)
NEW = os.path.join(BASE, 'data/catalog.json')

old = {p['handle']: p['gsm'] for p in json.load(open(OLD))['products']}
doc = json.load(open(NEW))
carried, fresh = 0, []
for p in doc['products']:
    if p['handle'] in old:
        p['gsm'] = old[p['handle']]
        carried += 1
    else:
        fresh.append(p['handle'])  # stays None — no verified weight, no claim

dist = collections.Counter(p['gsm'] for p in doc['products'])
expected = {425: 13, 400: 9, 380: 13, 190: 1}
for gsm, n in expected.items():
    assert dist.get(gsm) == n, f"register drift: gsm={gsm} expected {n}, got {dist.get(gsm)}"
heavy = sorted(p['handle'] for p in doc['products'] if p['gsm'] == 425)
expected_heavy = sorted(h for h, g in old.items() if g == 425)
assert heavy == expected_heavy, f"heavy line drift: {heavy} != {expected_heavy}"

json.dump(doc, open(NEW, 'w'), indent=1)
print(f"carried gsm for {carried} products; new-to-store (gsm=None): {fresh}")
print("distribution:", dict(dist))
print("heavy line (425):", len(heavy), "products — matches verified register")
