# o2o eml reader

Internal o2o tool to read and display the content of an EML file (e-mail message).
Everything is processed locally in the browser — no e-mail data leaves the device.

This is o2o's fork of [matiboux/eml-reader](https://github.com/matiboux/eml-reader),
restyled to the o2o house style and hardened against malicious e-mails.

## Security

E-mail bodies are untrusted input, so the rendered HTML body is isolated:

- **Sandboxed iframe** — the body renders in an `<iframe sandbox="">` (no
  `allow-scripts`), so any `<script>` or inline event handler in an `.eml` file
  cannot execute and cannot reach the parent page.
- **Content-Security-Policy** — a strict policy (`script-src 'self'` + build-time
  hashes, no `unsafe-inline`) is emitted per page via Astro's built-in CSP support
  as defense-in-depth. External `img`/`font`/`connect` are blocked, which also
  stops e-mail tracking pixels from loading.
- **Reverse proxy headers** — `frame-ancestors`, `X-Content-Type-Options`,
  `Referrer-Policy` and `Permissions-Policy` are set at the Coolify/Traefik layer
  (see Deployment).

## Getting started

### Development

```sh
docker compose watch
# or: docker compose up -d
```

With `watch`, file changes are synced & rebuilt automatically.
The site is available at [http://localhost:8080](http://localhost:8080).

Without Docker, you can run the Astro app directly (Node 20+ / pnpm):

```sh
cd app/app
pnpm install
pnpm dev            # dev server
pnpm build && pnpm preview   # production build, served like prod
```

### Production (local)

```sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

The site is available at [http://localhost:8080](http://localhost:8080).

## Deployment

Deployed on Coolify (server `coolify-it`) at <https://eml.o2o.bike>:

- Build pack: **Dockerfile**
- Dockerfile: `app/Dockerfile`, build context: `app/`, target: `app_prod`
- Port: `8080`

Recommended response headers to set on the Coolify service (Traefik):

```
Content-Security-Policy: (adds) frame-ancestors 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## License

Based on [eml-reader](https://github.com/matiboux/eml-reader) by
[Matiboux](https://matiboux.me), Copyright (c) 2024-2025, licensed under the
[MIT License](https://opensource.org/license/MIT) — see the [LICENSE](LICENSE) file.
