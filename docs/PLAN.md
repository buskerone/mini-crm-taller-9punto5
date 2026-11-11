# Plan del boilerplate — taller «Cursor a fondo» (9punto5)

Mini-CRM de una pyme de práctica: clientes, cotizaciones y cobros. Lo usan personas que dirigen agentes de Cursor durante 90 minutos, algunas sin experiencia programando. La especificación es la guía técnica del facilitador (material interno, no va en el repo); este plan resume cómo se construye y cómo se verifica.

Objetivo de hoy: `npm install` + `npm run dev` muestran el cascarón (badge «Datos: local», fecha de corte, espacio vacío para las tablas y los dos slots). Las tablas las construye cada participante.

## 1. Arquitectura

- **Next.js (App Router) + React + TypeScript estricto + Tailwind CSS v4 + shadcn/ui.** Una sola ruta: `/`. Sin login, sin escritura, sin rutas protegidas.
- **Una sola capa de datos: `getData()`** en `src/lib/data.ts`. Devuelve `{ source, data: { clients, quotes, invoices }, warning? }` con la misma forma en los dos modos.
  - `NEXT_PUBLIC_DATA_SOURCE=local` (por defecto, o variable ausente): lee `src/data/crm.json`.
  - `NEXT_PUBLIC_DATA_SOURCE=supabase`: lee las tres tablas con `@supabase/supabase-js` y la anon (o publishable) key.
  - Si faltan las variables de Supabase: usa lo local y devuelve un aviso visible. Si la consulta a Supabase falla: lanza el error y la página lo muestra en rojo (no hay fallback silencioso).
- **TanStack Query encima de `getData()`**, sin reemplazarla: el hook `useCrmData()` (`src/hooks/useCrmData.ts`) es `useQuery({ queryKey, queryFn: getData })`. La página lo llama una vez y pasa `data` por props a los slots. `retry: false` para que un error de Supabase se vea de inmediato.
- **La página es cliente** (`"use client"` en `src/app/page.tsx`), como permite la guía. El `QueryClientProvider` vive en `src/app/providers.tsx`.
- **Fechas:** los datos quedan en ISO (`YYYY-MM-DD`). En pantalla se muestran como `dd-mm-aaaa` con `formatDate()` de `src/lib/format.ts`, que corta el string sin pasar por `new Date()`. Todo cálculo relativo a fechas usa `REFERENCE_DATE` de `src/lib/reference-date.ts`.
- **Montos:** `formatCLP()` en `src/lib/format.ts` con `Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })`.
- **Zustand: no se agrega.** No hay estado de UI compartido: una sola ruta, sin filtros, pestañas, modales ni tema. Todo el estado es estado de servidor y ya lo maneja TanStack Query. Agregarlo sería una dependencia sin uso y un concepto más para principiantes. Si una tarjeta del sprint necesita estado local (por ejemplo, un mes elegido), alcanza con `useState` dentro de su hook.
- **Node 20 o 22** (lo que pide la guía): `@supabase/supabase-js` queda fijo en la 2.109.0, la última que declara soporte para Node 20 (desde la 2.110 exige Node 22). Las fuentes Geist vienen del paquete `geist` (archivos locales), así que el dev server no depende de Google Fonts si falla la red.
- **Instalación sin ruido para principiantes:** `npm install` termina con «found 0 vulnerabilities». El CLI de shadcn no es dependencia (se usa con `npx shadcn@latest add`) y un `overrides` acotado sube `minimatch` dentro de typescript-eslint, que solo se usa al lintear. Se puede quitar cuando `eslint-config-next` lo actualice.
- **`agentRules: false`** en `next.config.ts`: desde Next 16.4, `next dev` agrega su propio bloque a `AGENTS.md` cuando detecta un agente. Desactivado para que `AGENTS.md` tenga solo las reglas del taller y el árbol de git no se ensucie en cada máquina.

### Estructura por features

Pocas capas y nombres obvios:

| Carpeta                   | Qué va ahí                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/`                | Utilidades compartidas: tipos, `getData()`, cliente Supabase, `REFERENCE_DATE`, formatos.                                                                                |
| `src/hooks/`              | `useCrmData()`: TanStack Query encima de `getData()`.                                                                                                                    |
| `src/components/`         | El shell: encabezado, badge de fuente, espacio vacío de las tablas, slots y primitivos shadcn (`ui/`, incluido `Table`).                                                 |
| `src/components/widgets/` | Los dos puntos de montaje: `PorCobrarSlot` y `SprintSlot`. Ya están en la página y reciben `data` por props.                                                             |
| `src/features/<widget>/`  | **Cada widget nuevo**: un hook `use<Widget>.ts` (recibe `data`, devuelve lo que se muestra) y un componente `<Widget>Card.tsx` (la tarjeta). Se monta dentro de un slot. |

Ejemplo del patrón en `main`: `src/features/ultimas-altas/` (últimos clientes dados de alta). No calcula totales, sumas ni conteos y **no está montado** en la página, para que el estado inicial sea el del Figma. Sirve de molde y como demo de un «cambio chico» (montarlo en un slot y revertir).

Las métricas de negocio, cuando existan, van como funciones puras en `src/lib/metrics.ts` (no existe en `main`; aparece en las ramas de rescate).

### Diseño (Figma del taller)

shadcn/ui v4, tema **neutral**, modo claro, `--radius: 0.625rem`, Geist / Geist Mono. Se usa el estilo clásico `new-york` (base Radix): es el que replica el Figma (card con borde y sombra, `destructive` rojo sólido). Ajustes del Figma sobre los primitivos: filas de tabla de 44 px, badges de 14 px (nada de cuerpo bajo 14 px, pensado para proyectar), fondo de página `sidebar` (`oklch(0.985 0 0)`).

- Encabezado: logo «m», «mini-CRM», subtítulo, «Fecha de corte: dd-mm-aaaa» y `DataSourceBadge` («Datos: local» / «Datos: Supabase», con el punto del Figma).
- Sección «Widgets»: `PorCobrarSlot` (4 de 12 columnas) y **un solo** `SprintSlot` (8 de 12), con borde punteado.
- Sección «Datos»: empty state. Las tres tablas no vienen hechas; las construye cada participante (primero clientes, después el mismo patrón en las otras dos). El componente `Table` de shadcn sí está instalado.
- Las cifras del Figma son de ejemplo y no se copian.

## 2. Árbol (`main`)

```
/
├── README.md                  # qué es, cómo correrlo, estructura, dónde va cada widget
├── AGENTS.md                  # eco corto de las reglas (texto de la guía)
├── docs/PLAN.md               # este archivo
├── .cursor/
│   ├── mcp.json               # MCP hosted de Supabase (OAuth, sin PAT)
│   └── rules/
│       ├── taller.mdc         # reglas del taller (texto de la guía, tal cual)
│       └── estructura.mdc     # dónde va cada cosa
├── .env.example               # sin secretos
├── public/dot-local.svg, dot-supabase.svg   # puntos del DataSourceBadge (Figma)
├── scripts/generate-data.py   # origen único de crm.json + seed.sql (copiado sin editar)
├── supabase/schema.sql        # copiado sin editar
├── supabase/seed.sql          # copiado sin editar
└── src/
    ├── app/                   # layout.tsx, providers.tsx, page.tsx (shell), globals.css
    ├── components/
    │   ├── ui/                # shadcn: alert, badge, card, empty, select, separator, skeleton, table
    │   ├── SiteHeader.tsx, DataSourceBadge.tsx, EmptySlot.tsx, TablesEmptyState.tsx
    │   └── widgets/PorCobrarSlot.tsx, SprintSlot.tsx   # VACÍOS en main
    ├── features/ultimas-altas/  # ejemplo del patrón (hook + tarjeta), sin montar
    ├── hooks/useCrmData.ts
    ├── data/crm.json          # copiado sin editar
    └── lib/                   # types, data, supabase, reference-date, format, utils
```

Qué **no** trae `main` a propósito: las tres tablas (las arma cada participante), ningún total, suma, conteo por estado, marca de «vencido» ni `src/lib/metrics.ts`. El primitivo `Table` sí está en `src/components/ui/table.tsx`.

## 3. Ramas

Cada rama se construye sobre la anterior y pasa lint, typecheck y build.

| Rama                       | Contenido                                                                                                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main` (vía PR)            | El cascarón de arriba: sin las tres tablas, con el empty state en «Datos».                                                                                                                   |
| `rescue/hito-1-datos`      | El cascarón, más `docs/hito-1-manual.md` y las tres tablas ya hechas (resultado completo del hito 1, incluida la ruta manual sin agente).                                                    |
| `rescue/hito-2-por-cobrar` | Lo anterior + `src/lib/metrics.ts` con `porCobrar(invoices)` + `src/features/por-cobrar/` (hook + tarjeta) montado en `PorCobrarSlot`: monto y subtítulo «N cobros pendientes».              |
| `rescue/hito-3-sprint`     | Lo anterior + tarjeta **embudo de cotizaciones** en `SprintSlot` (`src/features/embudo/`): conteo y monto por estado y tasa de aceptación (aceptadas ÷ total, por cantidad, con un decimal). |

## 4. Verificación (en cada rama)

1. Instalación limpia: borrar `node_modules` y `.next`, `npm ci`.
2. `npm run lint`, `npm run typecheck`, `npm run format:check` y `npm run build`.
3. `npm run dev` y navegador headless. En `main`: badge «Datos: local», empty state y ninguna tabla renderizada. Desde `rescue/hito-1-datos`: las tres tablas con las filas de los datos locales.
4. Node 20 y Node 22, en local. (El workflow de CI se retiró: GitHub Actions no arranca en este repo.)
5. Datos: los archivos copiados son idénticos byte a byte a los entregados, y `generate-data.py` los regenera iguales.
6. `rescue/hito-2-por-cobrar`: el monto en pantalla coincide con la guía; al marcar temporalmente un cobro pendiente como pagado en `crm.json`, el monto baja a la cifra esperada; se revierte. Ninguna cifra queda escrita en el código.
7. `rescue/hito-3-sprint`: el embudo coincide con la guía.
8. Antes de cerrar: grep de todas las cifras de comprobación de la guía en archivos y mensajes de commit de todas las ramas.

Pendiente fuera de este entorno (se marca «ensayo pendiente»): modo `supabase` contra un proyecto real (OAuth del MCP, GRANT posterior al 30 oct 2026) e instalación en máquina limpia macOS/Windows.
