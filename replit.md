# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── banque-van-breda/   # Banque Van Breda clone (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Banque Van Breda App

Frontend-only React + Vite application (mock navigable) reproducing banquevanbreda.be.

### Pages publiques
- `/` — Page d'accueil (hero, stats, services, news, testimonials, CTA)
- `/connexion` — Page de connexion avec authentification 2FA mock
- `/gestion-privee` — Service de gestion privée
- `/entrepreneur` — Services pour entrepreneurs
- `/assurances` — Produits d'assurance

### Espace client (protégé par auth mock)
- `/dashboard` — Tableau de bord principal (comptes, portefeuille, transactions)
- `/comptes` — Gestion des comptes et transactions
- `/cartes` — Gestion des cartes bancaires
- `/investissements` — Portefeuille d'investissements
- `/virements` — Formulaire de virement avec confirmation
- `/documents` — Bibliothèque de documents
- `/messages` — Messagerie avec le conseiller
- `/profil` — Profil utilisateur et paramètres

### Auth mock
- Credentials: n'importe quel email + mot de passe
- 2FA: cliquer "Valider le code" sans code
- Client mock: Alexandre Dubois, N° VB-2024-4892

### Colors (Van Breda brand)
- Primary green: `#2a7d6f`
- Navy: `#1a2744`
- Gold: `#c4a35a`
- Fonts: Playfair Display (serif) + Source Sans 3 (sans)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build`
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes in `src/routes/`.

### `artifacts/banque-van-breda` (`@workspace/banque-van-breda`)

React + Vite frontend-only. No backend calls — mock data only.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec + Orval codegen config.
Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks.
