# Hito 1 por la ruta manual (sin agente)

Para quien tiene red y una cuenta de Supabase, pero el MCP no autenticó. El resultado es el mismo que con el agente: las tablas `clients`, `quotes` e `invoices` en **tu** proyecto y la app leyendo desde ahí.

Usa el proyecto vacío del taller (`cursor-taller`), nunca uno de producción ni con datos personales.

## 1. Crear las tablas

1. Abre tu proyecto en https://supabase.com/dashboard y entra a **SQL Editor** → **New query**.
2. Abre `supabase/schema.sql` en Cursor, copia **todo** el contenido, pégalo y presiona **Run**.

   Crea las tres tablas, activa RLS y agrega la policy de lectura y el `GRANT SELECT` para la anon key. Se puede volver a correr sin problema.

## 2. Cargar los datos

1. **New query** otra vez.
2. Copia **todo** `supabase/seed.sql`, pégalo y presiona **Run**.

   Vacía y recarga solo esas tres tablas, con las mismas filas que `src/data/crm.json`. También se puede volver a correr.

3. En **Table Editor** tienen que aparecer `clients`, `quotes` e `invoices`, con RLS activo y las mismas filas que muestra la app en modo local.

No edites los SQL ni pegues solo una parte: si algo falla, vuelve a correr el archivo completo. Si el SQL Editor advierte de una operación destructiva (el `drop policy if exists` del esquema o el `truncate` del seed), confírmala: solo afecta a las tres tablas del taller.

## 3. Conectar la app

1. Copia la **Project URL** desde el botón **Connect** del dashboard. Tiene la forma `https://<project_ref>.supabase.co`.
2. Copia la clave pública desde **Settings → API Keys**: la **Publishable key** (`sb_publishable_…`) o, en la pestaña **Legacy API Keys**, la **anon** (`eyJ…`). **Nunca** la `service_role` ni una `sb_secret_…`.
3. En la raíz del repo, copia `.env.example` a `.env.local` y complétalo:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<project_ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable o anon key>
   NEXT_PUBLIC_DATA_SOURCE=supabase
   ```

4. Reinicia el dev server (Ctrl+C y `npm run dev` de nuevo): las variables se leen al arrancar.

`.env.local` no se commitea: ya está en `.gitignore`.

## 4. Comprobar

- El badge dice **«Datos: Supabase»** y no hay texto rojo.
- Las tablas muestran las mismas filas que en modo local.

| Qué ves                                     | Qué hacer                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Badge «Datos: local» con aviso de variables | Revisa las tres variables de `.env.local` y reinicia `npm run dev`.                                     |
| Error rojo `42501 permission denied`        | Falta el `GRANT SELECT`: vuelve a correr `supabase/schema.sql` completo.                                |
| Sin error, pero tablas vacías               | Falta la policy de lectura: vuelve a correr `supabase/schema.sql` completo.                             |
| Error de red o proyecto «paused»            | Restaura el proyecto en el dashboard. Si no se puede, vuelve a `NEXT_PUBLIC_DATA_SOURCE=local` y sigue. |
