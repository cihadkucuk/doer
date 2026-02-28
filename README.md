# doermusic - Dokploy Deployment

Bu proje Dokploy uzerinde Docker ile calisacak sekilde hazirlandi.

## Lokal test

```bash
npm ci
npm run build
npm run start
```

Uygulama varsayilan olarak `http://localhost:3000` adresinde acilir.

## Docker ile lokal test

```bash
docker build -t doermusic .
docker run --rm -p 3000:3000 \
  -e TELEGRAM_BOT_TOKEN=your_bot_token \
  -e TELEGRAM_CHAT_ID=your_chat_id \
  doermusic
```

## Docker Compose ile lokal test

```bash
cp .env.example .env
# .env icine TELEGRAM_BOT_TOKEN ve TELEGRAM_CHAT_ID degerlerini gir
docker compose up --build -d
docker compose logs -f
docker compose down
```

Not: `docker-compose.yml` icinde `ports` degil `expose: 3000` kullaniliyor. Bu yapi Dokploy reverse proxy ile calismak icin uygundur; lokalde hosttan dogrudan `localhost:3000` erisimi vermez.

## Dokploy ayarlari

Dokploy'da yeni bir uygulama olustururken:

1. `Deployment Type`: `Dockerfile`
2. `Dockerfile Path`: `./Dockerfile`
3. `Internal Port`: `3000`
4. `Healthcheck Path`: `/api/health`
5. Environment Variables:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

Alternatif olarak `docker-compose.yml` ile deploy edeceksen:

1. `Deployment Type`: `Docker Compose`
2. `Compose File`: `./docker-compose.yml`
3. `Service`: `web`
4. `Internal Port`: `3000`
5. `Healthcheck Path`: `/api/health`
6. Environment Variables:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

Gerekli environment degiskenleri:

- `NODE_ENV=production`
- `PORT=3000`
- `TELEGRAM_BOT_TOKEN=<your_bot_token>`
- `TELEGRAM_CHAT_ID=<your_chat_id>`

Hazir sablon: `.env.example`

## Notlar

- `next.config.mjs` dosyasi `output: "standalone"` olarak ayarlandi.
- Backend saglik kontrolu icin `GET /api/health` endpoint'i eklendi.
- Contact form backend'i `POST /api/contact` endpoint'ine baglandi.
- `POST /api/contact` Telegram mesaji gondermek icin `TELEGRAM_BOT_TOKEN` ve `TELEGRAM_CHAT_ID` environment degiskenlerini kullanir.
- `docker-compose.yml` dosyasi eklendi.
