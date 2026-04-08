# Request Lab

HTTP testing playground for multipart/form-data uploads and request inspection.

## Endpoints

### POST /upload
Accept multipart/form-data file uploads. Returns file metadata (filename, size, mime-type, SHA256 hash).

### GET /headers
Returns all incoming request headers (useful for debugging).

### GET /echo
Echoes back query params and request body.

### GET /
Lists available endpoints.

## Tech Stack

- Node.js + Express (or Fastify)
- Docker

## Development

```bash
yarn install
yarn dev
```

## License

MIT
