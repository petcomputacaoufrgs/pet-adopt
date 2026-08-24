# PetAdopt — Agent Guide

## Project map

- `front/`: React 19, TypeScript, Vite, React Router, styled-components, Axios.
- `back/`: NestJS, TypeScript, MongoDB/Mongoose, Passport/JWT.
- `nginx/`: production reverse proxy configuration.
- `docker-compose-local.yml`: local environment (`front` on 5173, API on 3002).
- `docker-compose.yml`: production topology with Nginx and Cloudflare Tunnel.

## Getting started

1. Create `back/.env` with the required MongoDB, JWT, mail, port, and `FRONTEND_URL` settings. Never commit it.
2. Prefer the Docker local stack for end-to-end work:

   ```powershell
   docker compose -f docker-compose-local.yml up -d --build
   ```

3. Local URLs:
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:3002/api/v1`
   - Swagger: `http://localhost:3002/api`

## Commands

Run commands from their package directory.

```powershell
# front/
npm run build
npm run lint

# back/
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
```

Do not run backend lint with `--fix` unless the requested change includes formatting all affected files; its script mutates code.

## Backend conventions

- Keep domain logic in `back/src/domain/<domain>/`; controllers should stay thin.
- Use DTOs and `class-validator` for request payloads. Preserve global `ValidationPipe` whitelist behavior.
- Protect non-public endpoints with `JwtAuthGuard`, `RolesGuard`, and ownership guards when operating on NGO-owned data.
- Never expose password hashes, JWTs, refresh tokens, reset tokens, documents, or values from `.env`.
- Password changes must hash the new password through `EncryptionService`; do not update password fields through generic profile endpoints.
- Preserve refresh-token rotation, HTTP-only cookie handling, throttling, and token revocation when changing authentication.
- File uploads belong in `back/uploads/`, are ignored by Git, and must be validated before persistence.

## Frontend conventions

- Add routes in `front/src/App.tsx` and centralize public-route declarations in `front/src/constants/routes.ts`.
- Reuse `front/src/services/api.ts` for API calls so cookies, refresh handling, and common errors remain consistent.
- Do not store access or refresh tokens in `localStorage`; only store minimal display data for the authenticated user.
- Use loaders/actions for route data mutations where that pattern already exists.
- Keep TypeScript types in `front/src/types/` or component-local `types.ts`; avoid adding `any` in new code.
- Buttons inside forms must have deliberate `type` values to avoid duplicate submits.

## Verification

- Run the narrowest relevant checks before finishing.
- For authentication changes: build both packages, run backend unit tests, and manually verify login, refresh, logout, and protected-route behavior against the local Docker stack when credentials and MongoDB are available.
- Report external blockers honestly, such as a missing `.env`, unavailable MongoDB, or an E2E test database.

## Scope and safety

- Preserve existing user changes; inspect `git status` before edits.
- Do not commit generated `dist/`, `coverage/`, `node_modules/`, uploads, or environment files.
- Do not use destructive Git commands (`reset --hard`, forced checkout) unless explicitly requested.
- Keep changes focused. Do not refactor unrelated frontend lint debt during a feature or bug fix.
