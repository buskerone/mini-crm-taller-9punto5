-- supabase/seed.sql — GENERADO por crm-data/generate.py. No editar a mano.
-- Mismas filas que src/data/crm.json. Datos inventados para el taller.
-- Idempotente: se puede volver a correr; vacía solo las 3 tablas del taller.
truncate table public.invoices, public.quotes, public.clients;

insert into public.clients (id, name, city, created_on) values
  (1, 'Panadería Los Aromos', 'Valparaíso', '2026-08-01'),
  (2, 'Taller Mecánico Cuatro Ruedas', 'Santiago', '2026-08-03'),
  (3, 'Florería Pétalo Austral', 'Puerto Montt', '2026-08-06'),
  (4, 'Ferretería El Clavo Firme', 'Concepción', '2026-08-11'),
  (5, 'Cafetería La Taza Inquieta', 'Temuco', '2026-08-19'),
  (6, 'Estudio Contable Balance Claro', 'Santiago', '2026-08-24'),
  (7, 'Lavandería Burbuja Norte', 'Antofagasta', '2026-08-27'),
  (8, 'Imprenta Tinta Viva', 'La Serena', '2026-09-09'),
  (9, 'Veterinaria Huella Sur', 'Valdivia', '2026-09-16'),
  (10, 'Pastelería Dulce Copihue', 'Talca', '2026-09-30');

insert into public.quotes (id, client_id, issued_on, amount_clp, status) values
  (1, 1, '2026-08-04', 1200000, 'aceptada'),
  (2, 2, '2026-08-07', 850000, 'aceptada'),
  (3, 3, '2026-08-12', 400000, 'rechazada'),
  (4, 4, '2026-08-18', 2300000, 'aceptada'),
  (5, 5, '2026-08-25', 600000, 'aceptada'),
  (6, 6, '2026-09-02', 1500000, 'aceptada'),
  (7, 7, '2026-09-08', 350000, 'rechazada'),
  (8, 8, '2026-09-15', 950000, 'aceptada'),
  (9, 9, '2026-09-22', 700000, 'aceptada'),
  (10, 2, '2026-09-29', 2200000, 'aceptada'),
  (11, 10, '2026-10-06', 500000, 'enviada'),
  (12, 1, '2026-10-14', 900000, 'rechazada'),
  (13, 3, '2026-10-21', 650000, 'enviada'),
  (14, 6, '2026-10-28', 1800000, 'enviada'),
  (15, 4, '2026-10-30', 750000, 'enviada');

insert into public.invoices (id, client_id, quote_id, issued_on, due_on, amount_clp, paid) values
  (1, 1, 1, '2026-08-10', '2026-09-09', 1200000, true),
  (2, 2, 2, '2026-08-14', '2026-09-13', 850000, true),
  (3, 4, 4, '2026-08-20', '2026-09-19', 1150000, true),
  (4, 5, 5, '2026-08-28', '2026-09-27', 600000, false),
  (5, 7, null, '2026-08-31', '2026-09-30', 180000, true),
  (6, 6, 6, '2026-09-05', '2026-10-05', 750000, true),
  (7, 8, 8, '2026-09-18', '2026-10-18', 950000, true),
  (8, 4, 4, '2026-09-25', '2026-10-25', 1150000, true),
  (9, 9, 9, '2026-09-26', '2026-10-26', 700000, false),
  (10, 2, 10, '2026-10-02', '2026-11-01', 1100000, false),
  (11, 10, null, '2026-10-09', '2026-10-24', 220000, true),
  (12, 6, 6, '2026-10-15', '2026-11-14', 750000, false),
  (13, 3, null, '2026-10-22', '2026-11-21', 260000, true),
  (14, 2, 10, '2026-10-27', '2026-11-26', 1100000, false),
  (15, 5, null, '2026-10-30', '2026-11-29', 240000, true);
