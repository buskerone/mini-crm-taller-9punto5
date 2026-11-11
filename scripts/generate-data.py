#!/usr/bin/env python3
"""Origen único de los datos de práctica del mini-CRM (taller 9punto5).

Emite, desde las mismas listas:
  src/data/crm.json   (Plan B local / modo por defecto)
  supabase/seed.sql   (lo que el agente aplica por MCP)

Todos los nombres son inventados para el taller (pymes ficticias).
Uso: python3 generate.py  [directorio_salida, por defecto el de este script]
"""
import json
import os
import sys

# id, name, city, created_on
CLIENTS = [
    (1, "Panadería Los Aromos", "Valparaíso", "2026-08-01"),
    (2, "Taller Mecánico Cuatro Ruedas", "Santiago", "2026-08-03"),
    (3, "Florería Pétalo Austral", "Puerto Montt", "2026-08-06"),
    (4, "Ferretería El Clavo Firme", "Concepción", "2026-08-11"),
    (5, "Cafetería La Taza Inquieta", "Temuco", "2026-08-19"),
    (6, "Estudio Contable Balance Claro", "Santiago", "2026-08-24"),
    (7, "Lavandería Burbuja Norte", "Antofagasta", "2026-08-27"),
    (8, "Imprenta Tinta Viva", "La Serena", "2026-09-09"),
    (9, "Veterinaria Huella Sur", "Valdivia", "2026-09-16"),
    (10, "Pastelería Dulce Copihue", "Talca", "2026-09-30"),
]

# id, client_id, issued_on, amount_clp, status
QUOTES = [
    (1, 1, "2026-08-04", 1200000, "aceptada"),
    (2, 2, "2026-08-07", 850000, "aceptada"),
    (3, 3, "2026-08-12", 400000, "rechazada"),
    (4, 4, "2026-08-18", 2300000, "aceptada"),
    (5, 5, "2026-08-25", 600000, "aceptada"),
    (6, 6, "2026-09-02", 1500000, "aceptada"),
    (7, 7, "2026-09-08", 350000, "rechazada"),
    (8, 8, "2026-09-15", 950000, "aceptada"),
    (9, 9, "2026-09-22", 700000, "aceptada"),
    (10, 2, "2026-09-29", 2200000, "aceptada"),
    (11, 10, "2026-10-06", 500000, "enviada"),
    (12, 1, "2026-10-14", 900000, "rechazada"),
    (13, 3, "2026-10-21", 650000, "enviada"),
    (14, 6, "2026-10-28", 1800000, "enviada"),
    (15, 4, "2026-10-30", 750000, "enviada"),
]

# id, client_id, quote_id (None = servicio sin cotización), issued_on, due_on, amount_clp, paid
INVOICES = [
    (1, 1, 1, "2026-08-10", "2026-09-09", 1200000, True),
    (2, 2, 2, "2026-08-14", "2026-09-13", 850000, True),
    (3, 4, 4, "2026-08-20", "2026-09-19", 1150000, True),
    (4, 5, 5, "2026-08-28", "2026-09-27", 600000, False),
    (5, 7, None, "2026-08-31", "2026-09-30", 180000, True),
    (6, 6, 6, "2026-09-05", "2026-10-05", 750000, True),
    (7, 8, 8, "2026-09-18", "2026-10-18", 950000, True),
    (8, 4, 4, "2026-09-25", "2026-10-25", 1150000, True),
    (9, 9, 9, "2026-09-26", "2026-10-26", 700000, False),
    (10, 2, 10, "2026-10-02", "2026-11-01", 1100000, False),
    (11, 10, None, "2026-10-09", "2026-10-24", 220000, True),
    (12, 6, 6, "2026-10-15", "2026-11-14", 750000, False),
    (13, 3, None, "2026-10-22", "2026-11-21", 260000, True),
    (14, 2, 10, "2026-10-27", "2026-11-26", 1100000, False),
    (15, 5, None, "2026-10-30", "2026-11-29", 240000, True),
]


def check_coherence():
    clients = {c[0]: c for c in CLIENTS}
    quotes = {q[0]: q for q in QUOTES}
    assert len(CLIENTS) == 10 and len(QUOTES) == 15 and len(INVOICES) == 15
    for q in QUOTES:
        assert q[1] in clients and q[4] in ("enviada", "aceptada", "rechazada")
        assert q[2] >= clients[q[1]][3], f"quote {q[0]} antes de crear cliente"
        assert q[3] % 10000 == 0
    billed_by_quote = {}
    for i in INVOICES:
        iid, cid, qid, issued, due, amount, paid = i
        assert cid in clients and issued >= clients[cid][3]
        assert due > issued and amount % 10000 == 0
        assert "2026-08-01" <= issued <= "2026-11-30" and due <= "2026-11-30"
        if qid is not None:
            q = quotes[qid]
            assert q[4] == "aceptada", f"invoice {iid} ligado a cotización no aceptada"
            assert q[1] == cid, f"invoice {iid} con cliente distinto a su cotización"
            assert issued >= q[2]
            billed_by_quote[qid] = billed_by_quote.get(qid, 0) + amount
    for qid, total in billed_by_quote.items():
        assert total == quotes[qid][3], f"cotización {qid}: cobros {total} != {quotes[qid][3]}"


def as_json():
    return {
        "clients": [dict(id=a, name=b, city=c, created_on=d) for a, b, c, d in CLIENTS],
        "quotes": [dict(id=a, client_id=b, issued_on=c, amount_clp=d, status=e) for a, b, c, d, e in QUOTES],
        "invoices": [
            dict(id=a, client_id=b, quote_id=c, issued_on=d, due_on=e, amount_clp=f, paid=g)
            for a, b, c, d, e, f, g in INVOICES
        ],
    }


def dump_compact(obj):
    """JSON válido con un registro por línea (fácil de leer y de pegar en la guía)."""
    parts = []
    for key, rows in obj.items():
        body = ",\n".join("    " + json.dumps(r, ensure_ascii=False) for r in rows)
        parts.append(f'  "{key}": [\n{body}\n  ]')
    return "{\n" + ",\n".join(parts) + "\n}\n"


def sql_str(s):
    return "'" + s.replace("'", "''") + "'"


def as_seed_sql():
    out = [
        "-- supabase/seed.sql — GENERADO por crm-data/generate.py. No editar a mano.",
        "-- Mismas filas que src/data/crm.json. Datos inventados para el taller.",
        "-- Idempotente: se puede volver a correr; vacía solo las 3 tablas del taller.",

        "truncate table public.invoices, public.quotes, public.clients;",
        "",
        "insert into public.clients (id, name, city, created_on) values",
    ]
    out.append(",\n".join(f"  ({a}, {sql_str(b)}, {sql_str(c)}, '{d}')" for a, b, c, d in CLIENTS) + ";")
    out += ["", "insert into public.quotes (id, client_id, issued_on, amount_clp, status) values"]
    out.append(",\n".join(f"  ({a}, {b}, '{c}', {d}, '{e}')" for a, b, c, d, e in QUOTES) + ";")
    out += ["", "insert into public.invoices (id, client_id, quote_id, issued_on, due_on, amount_clp, paid) values"]
    out.append(
        ",\n".join(
            f"  ({a}, {b}, {'null' if c is None else c}, '{d}', '{e}', {f}, {'true' if g else 'false'})"
            for a, b, c, d, e, f, g in INVOICES
        )
        + ";"
    )
    out += [""]
    return "\n".join(out)


def main():
    check_coherence()
    base = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(base, "src/data"), exist_ok=True)
    os.makedirs(os.path.join(base, "supabase"), exist_ok=True)
    with open(os.path.join(base, "src/data/crm.json"), "w", encoding="utf-8") as f:
        f.write(dump_compact(as_json()))
    with open(os.path.join(base, "supabase/seed.sql"), "w", encoding="utf-8") as f:
        f.write(as_seed_sql())
    print("OK: src/data/crm.json y supabase/seed.sql generados en", base)


if __name__ == "__main__":
    main()
