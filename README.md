# EstateHub

EstateHub is a real estate portfolio demo. It includes property listings, agent workflows, favorites, and inquiries. The frontend uses React and Vite. The API uses Spring Boot, Spring Security, and MySQL.

[![Build and smoke test](https://github.com/saeedelsabagh/EstateHub_fullStack/actions/workflows/ci.yml/badge.svg)](https://github.com/saeedelsabagh/EstateHub_fullStack/actions/workflows/ci.yml)

## Deployment

The Compose project runs a static frontend, the API, and MySQL. It binds only the frontend to a host loopback port. Project-scoped networks isolate the containers, and named volumes persist the database and uploaded files. The demo uses the frontend's built-in property search rules.

### Start EstateHub

Run these commands on a Linux host with Docker Compose, OpenSSL, and host Nginx. Publish the deployment changes to GitHub before cloning.

```sh
git clone https://github.com/saeedelsabagh/EstateHub_fullStack.git estatehub
cd estatehub

# Set an unused port and check it before continuing.
estatehub_port=18081
ss -ltn "sport = :$estatehub_port"

# First install only. Keep the existing .env on subsequent deployments.
(
  set -euC
  umask 077
  root_password=$(openssl rand -hex 32)
  db_password=$(openssl rand -hex 32)
  jwt_secret=$(openssl rand -hex 32)
  printf 'ESTATEHUB_PORT=%s\nDB_ROOT_PASSWORD=%s\nDB_PASSWORD=%s\nJWT_SECRET=%s\n' \
    "$estatehub_port" "$root_password" "$db_password" "$jwt_secret" > .env
)

docker compose config --quiet
docker compose up -d --build
docker compose ps
curl --retry 12 --retry-delay 5 --retry-all-errors -fsS "http://127.0.0.1:$estatehub_port/api/property"
```

Use `.env.example` as the environment variable reference. Keep `.env` on the server with owner-only permissions. Frontend `VITE_*` variables are public build settings.

### Connect host Nginx

In the Nginx directory this server includes for virtual hosts, create a file dedicated to EstateHub, such as `estatehub.conf`. Match the port to `ESTATEHUB_PORT`.

```nginx
server {
    listen 80;
    server_name estate-hub-1.duckdns.org;
    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:18081;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable that file if your distribution separates available and enabled virtual hosts, then validate and reload. Configure HTTPS for this subdomain with your server's existing certificate workflow before sharing the demo. Keep the same `location` block in the HTTPS virtual host.

```sh
sudo nginx -t && sudo systemctl reload nginx
curl -fsS https://estate-hub-1.duckdns.org/api/property
```

### Update or inspect EstateHub

From the EstateHub checkout, run:

```sh
git pull --ff-only
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 api
```

A fresh database starts empty. Use the demo interface to register an agent and add sample listings.
