# AGENTS.md — taller «Cursor a fondo» (mini-CRM)

Las reglas completas están en `.cursor/rules/taller.mdc`. Resumen:

1. Plan breve antes de editar; un cambio chico a la vez; al final, cómo comprobarlo.
2. Datos solo vía `getData()`. Nada de cifras escritas a mano ni de filas inventadas.
3. Fechas: usa `REFERENCE_DATE` (`src/lib/reference-date.ts`), nunca `new Date()`.
4. Montos con `formatCLP`. UI en español de Chile.
5. Secretos: nunca `service_role` ni `sb_secret_…`; `.env.local` solo con URL + anon key + fuente, y no se commitea.
6. MCP: solo el proyecto del taller; nunca `create_project` ni `create_branch`; ejecuta `schema.sql` y `seed.sql` tal cual.
7. Fuera de alcance: login, pagos, deploy, rutas nuevas, escritura desde la app.
8. Estructura: cada widget nuevo va en `src/features/<widget>/` (hook `use<Widget>.ts` + tarjeta `<Widget>Card.tsx`) y se monta en `PorCobrarSlot` o `SprintSlot`. Detalle en `.cursor/rules/estructura.mdc`.
9. Las tablas de la pantalla no vienen hechas. Primero la de clientes, en la sección «Datos» de `src/app/page.tsx`; después el mismo patrón en cotizaciones y en cobros.
