# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal finance management system built as a pnpm + Turborepo monorepo. The backend is NestJS microservices, the frontend is Next.js. Services communicate over TCP (for internal RPC) and HTTP (proxied through the API gateway).

**Runtime:** Node ≥ 18, pnpm 9, TypeScript 5.9  
**Backend:** NestJS 11, MikroORM 7 (PostgreSQL), CQRS (`@nestjs/cqrs`), Redis  
**Frontend:** Next.js (`apps/web`)

## Key Commands

All commands run from the repo root via Turborepo. Infrastructure (Postgres + Redis) is managed via Docker Compose.

```bash
# Start all services in dev mode (reads root .env)
pnpm dev

# Start a single service
pnpm dev --filter=finance-service

# Build all
pnpm build

# Lint all
pnpm lint

# Type-check all
pnpm check-types

# Format
pnpm format

# Infrastructure only
docker compose -f docker-compose.dev.yml up -d

# Database migrations (run from service dir or via turbo)
pnpm migration:up                                    # all services
pnpm --filter=finance-service migration:up           # single service
pnpm --filter=finance-service run migration:create   # generate new migration

# Run tests (from inside a service directory)
pnpm test
pnpm test:watch
pnpm test -- --testPathPattern=account              # single test file
```

## Architecture

### Service topology

```
Browser / API client
       │
   api-gateway          ← JWT validation, reverse proxy, injects x-internal-token + x-user-data headers
       │  HTTP proxy
  ┌────┴──────────────┐
auth-service      finance-service (+ user-service, etc.)
  └──────────────────┘
        TCP RPC (MicroserviceName enum)
```

**api-gateway** (`apps/api-gateway`) — no business logic. `GatewayModule` uses `http-proxy-middleware` to forward `/<service-prefix>/*` routes to each service after validating the JWT and encoding the decoded payload as a base64 `x-user-data` header.

**Downstream services** validate the request via `AppGuard` (from `@repo/nest-common`): they check for the `x-internal-token` header (shared `GATEWAY_SECRET`) and decode `x-user-data` back into `req.user`. Routes decorated with `@Public()` skip this check.

### Shared libraries

| Package | Path | Purpose |
|---|---|---|
| `@repo/nest-common` | `libs/nest-common` | DTOs, guards, filters, decorators, config factories, error constants |
| `@repo/nest-core` | `libs/nest-core` | `BaseEntity`, `BaseRepository`, `CommonCqrsBus`, `MicroserviceModule`, `RedisModule` |
| `@repo/typescript-config` | `libs/typescript-config` | Shared `tsconfig` bases |
| `@repo/ui` | `libs/ui` | Shared React components |

### CQRS pattern (finance-service and user-service)

Every feature module follows: **Controller → `CommonCqrsBus` → Command/Query Handler → Repository**.

- Controllers inject only `CommonCqrsBus` and dispatch commands/queries — no business logic.
- `CommonCqrsBus.executeCommand` / `executeQuery` wraps each call in a MikroORM `RequestContext` automatically.
- Handlers live under `commands/<action>/` or `queries/<action>/` subdirectories, each with a `<action>.command.ts`, `<action>.handler.ts`, and `index.ts`.
- Handlers receive the `EntityManager` and relevant repositories via constructor injection; they do not go through the controller or a service layer.

### Data access layer (finance-service)

Entities are defined with MikroORM's `defineEntity` / `p` schema builder (not decorators). Every entity extends `BaseSchema` from `@repo/nest-core`, which provides `id` (UUID v4), `createdAt`, `updatedAt`, `deletedAt`, and a global `softDelete` filter (automatically applied).

Domain model: `Account` → belongs to a `Category`; `Transaction` → has many `TransactionEntry` (double-entry bookkeeping). Transactions must balance (total debits = total credits).

Repositories extend `BaseRepository<T>` which adds a `paginate(queryBuilder, page, pageSize)` helper.

### Error handling

Throw `AppException` (from `@repo/nest-common`) with a constant from `ERROR_RESPONSE`. Never throw raw `HttpException`. The `AllExceptionFilter` is registered globally in each service's `AppModule`.

```ts
throw new AppException(ERROR_RESPONSE.ACCOUNT_NOT_FOUND);
```

New error codes go in `libs/nest-common/src/constants/error-response.constant.ts`.

### DTO pattern

Use `@DtoField(options)` (from `@repo/nest-common`) on DTO properties instead of composing `@ApiProperty`, `@Expose`, and class-validator decorators separately. It combines Swagger metadata, `class-transformer` exposure, and validation in one decorator.

## Coding Conventions

- **Naming:** kebab-case filenames, PascalCase classes, camelCase properties. Module folders match their NestJS module name (e.g., `account/`).
- **Entities:** defined with `defineEntity` + `p` (not class decorators). Always extend `BaseSchema`. Set the class with `Schema.setClass(ClassName)` after the class declaration.
- **Configs:** each service registers its env via `@nestjs/config` factories in `src/config/`. All shared config keys are in `libs/nest-common/src/config/`.
- **Microservice communication:** use `MicroserviceModule.registerAsync` and `MicroserviceName` enum. `MicroserviceFactory` is deprecated — do not use it.
- **Inter-service user data:** the gateway encodes the JWT payload as base64 JSON in `x-user-data`. Access it in handlers via `@User('userId')` (the `User` decorator from `@repo/nest-common`).

## Critical Guidelines

- **Do not add a service layer between controller and CQRS handlers.** The pattern is controller → bus → handler. Service classes are not used in the CQRS services.
- **Always wrap ORM operations in `RequestContext`** — `CommonCqrsBus` does this automatically when you go through it. Do not call `em.flush()` outside a request context.
- **Do not bypass `AppGuard`.** Adding `@Public()` to a microservice route exposes it without any auth — only use it for intentionally public endpoints.
- **Migrations are generated, not hand-written.** Run `migration:create` to let MikroORM diff the schema snapshot, then review the output before committing.
- **The `softDelete` filter is on by default** on all entities extending `BaseSchema`. Use `em.getReference` or disable the filter explicitly when you need to access deleted records.
- **All new error codes** must be added to `ERROR_RESPONSE` in `libs/nest-common` and thrown via `AppException` — never with a raw status code string.
