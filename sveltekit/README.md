# SvelteKit App

Frontend for Morning Meeting. This app talks to PocketBase via `PUBLIC_POCKETBASE_URL`.

## Requirements

- Node/NPM LTS (tested with 22.14.0)

## Setup

```bash
cd sveltekit
cp .env.example .env
npm install
```

Update `sveltekit/.env` as needed:

```
PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

## Development

```bash
npm run dev
```

LAN dev server:

```bash
npm run devhost
```

## Build and Preview

```bash
npm run build
npm run preview
```

LAN preview:

```bash
npm run previewhost
```

## Useful Scripts

- `npm run lint`
- `npm run test`
