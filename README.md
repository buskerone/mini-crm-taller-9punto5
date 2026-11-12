# mini-CRM · taller «Cursor a fondo» (9punto5)

Mini-CRM de una pyme de práctica: clientes, cotizaciones y cobros. Todos los datos son inventados. La pantalla ya tiene el encabezado y dos espacios vacíos; las tablas las construyes tú, dirigiendo al agente de Cursor.

## Cómo correrlo

Necesitas Node 20 o 22 (`node -v`) y Git.

```bash
git clone <URL_DEL_REPO> cursor-a-fondo
cd cursor-a-fondo
npm install
npm run dev
```

Abre http://localhost:3000. Tiene que verse el badge «Datos: local», la fecha de corte, un espacio que dice «Aquí van tus tablas» y dos espacios vacíos (Por cobrar y sprint).

- Si el puerto 3000 está ocupado: `npx next dev -p 3001`.
- En Windows, abre el proyecto en una ruta sin caracteres raros y usa la terminal de Cursor.
- En Cursor → Settings → Tools & MCP aparece el server `supabase` (viene configurado en `.cursor/mcp.json`).

## Hito 1

1. Con el MCP de Supabase, carga los datos en tu proyecto: `supabase/schema.sql` y después `supabase/seed.sql`, tal cual están.
2. Pídele al agente la tabla de clientes.
3. Cuando se vea bien, pídele que repita el mismo patrón en cotizaciones y en cobros.

Los datos se leen con `getData()` (`src/lib/data.ts`): `local` (por defecto) usa `src/data/crm.json`; `supabase` usa tu proyecto. Para cambiar, copia `.env.example` a `.env.local`, completa la URL y la anon (o publishable) key, pon `NEXT_PUBLIC_DATA_SOURCE=supabase` y reinicia `npm run dev`. Nunca uses la `service_role` ni claves `sb_secret_…`. `.env.local` no se commitea.

## Estructura

```
src/
  app/page.tsx           la página: encabezado, espacios vacíos y dónde van las tablas
  components/            encabezado, badge de fuente y el espacio vacío de las tablas
  components/ui/         piezas de shadcn (Card, Table, Badge…). Table ya está instalado
  components/widgets/    PorCobrarSlot y SprintSlot: donde se montan tus widgets
  features/<widget>/     cada widget nuevo: un hook + una tarjeta
  hooks/useCrmData.ts    TanStack Query encima de getData()
  lib/                   getData(), REFERENCE_DATE, formatCLP, formatDate y tipos
  data/crm.json          datos locales
supabase/                schema.sql y seed.sql
.cursor/                 MCP de Supabase y reglas del agente
```

## Dónde va cada widget nuevo

1. Crea `src/features/<widget>/` con `use<Widget>.ts` (recibe `data` y calcula lo que se muestra) y `<Widget>Card.tsx` (la tarjeta).
2. Monta la tarjeta en `PorCobrarSlot.tsx` o `SprintSlot.tsx`: `<MiWidgetCard data={data} />`.

El ejemplo está en `src/features/ultimas-altas/` y no está en la página. Montos con `formatCLP`, fechas con `formatDate` y, si algo depende de una fecha, `REFERENCE_DATE` en vez de `new Date()`.

## Scripts

`npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm run format` y `npm run format:check`.
