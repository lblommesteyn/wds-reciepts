## Development quickstart

1. Install dependencies once: `npm install`
2. Duplicate `.env.local` and provide real Supabase credentials (see below).
3. Run the dev server with `npm run dev` and navigate to `http://localhost:3000`.

## Environment

Set the following variables in `.env.local` (already gitignored):

```
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_RECEIPTS_BUCKET="receipts"
```

Create a `hello_world` Postgres function in Supabase so the connection test has something to call:

```sql
create or replace function public.hello_world()
returns text
language sql
security definer
set search_path = public
as $$
  select 'hello world'::text;
$$;
```

Once populated, hit `GET /api/supabase-test` to verify the client can reach Supabase. Errors are returned as JSON with `ok: false`.

## API routes

- `POST /api/ocr` – accepts a multipart `file` upload, saves it to Supabase Storage, and returns `{ rawText: "SAMPLE", message: "File uploaded successfully", storedPath, publicUrl }` as a stubbed OCR response.
- `GET /api/supabase-test` – executes the `hello_world` RPC against Supabase to confirm connectivity.
- `GET /api/openapi` – serves the generated OpenAPI 3.1 document that powers both docs experiences.

## Storage

- Provision a bucket in Supabase Storage (defaults to `receipts` via `SUPABASE_RECEIPTS_BUCKET`).
- Provide `SUPABASE_SERVICE_ROLE_KEY` so the server route can upload directly to Storage.
- Files are written under `uploads/YYYY-MM-DD/{uuid}.{ext}`. If the bucket is public, the returned `publicUrl` will be immediately accessible; otherwise treat it as a private path.

## API documentation

- Scalar reference UI: visit `/docs` for a dark-mode, searchable API explorer.
- Swagger UI: visit `/docs/swagger` for the classic Swagger experience with request builders.

## Local receipt storage

Structured receipts are persisted to `localStorage` under the `receipts_v1` key. The UI boots with sample data, hydrates from the cached list when available, and syncs every time the history changes so saved receipts survive browser refreshes.

## Available scripts

| Script        | Action            |
| ------------- | ----------------- |
| `npm run dev` | Start dev server  |
| `npm run build` | Create production build |
| `npm run start` | Launch production server |
| `npm run lint` | Run ESLint |
