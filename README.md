# EstateHub

EstateHub is a real estate portfolio demo. It includes property listings, agent workflows, favorites, and inquiries. The frontend uses React and Vite. The API uses Spring Boot, Spring Security, and MySQL.

[![Build and smoke test](https://github.com/saeedelsabagh/EstateHub_fullStack/actions/workflows/ci.yml/badge.svg)](https://github.com/saeedelsabagh/EstateHub_fullStack/actions/workflows/ci.yml)

## Deployment

The Compose project runs a static frontend, the API, and MySQL. It binds only the frontend to a host loopback port. Project-scoped networks isolate the containers, and named volumes persist the database and uploaded files. The demo uses the frontend's built-in property search rules.

### Start EstateHub

On a Linux server with Docker Compose, OpenSSL, and Nginx:

```sh
git clone https://github.com/saeedelsabagh/EstateHub_fullStack.git estatehub
cd estatehub
bash deploy/deploy.sh
```

The script checks port `18081`, generates a private `.env` on first run, builds the containers, and checks the API. If the port is occupied, run `bash deploy/deploy.sh 18082` with an unused port and use that port in the Nginx configuration. Keep the existing `.env` on updates. Frontend `VITE_*` variables are public build settings.

### Connect host Nginx

For Nginx installations using `sites-available` and `sites-enabled`, run the commands below from the checkout. If the domain already has a virtual host, update its upstream instead of adding another virtual host. On other installations, use the directory included by Nginx for virtual hosts.

```sh
sudo test ! -e /etc/nginx/sites-available/estatehub.conf &&
  sudo install -m 644 deploy/nginx.conf /etc/nginx/sites-available/estatehub.conf &&
  sudo ln -s /etc/nginx/sites-available/estatehub.conf /etc/nginx/sites-enabled/estatehub.conf &&
  sudo nginx -t &&
  sudo systemctl reload nginx
```

If you chose a different port, change the upstream in `deploy/nginx.conf` before copying it. Once the domain points to this host and port 80 is reachable, configure HTTPS with your existing certificate tooling. If Certbot and its Nginx plugin are already installed:

```sh
sudo certbot --nginx --cert-name estate-hub-1.duckdns.org -d estate-hub-1.duckdns.org --redirect
curl -fsS https://estate-hub-1.duckdns.org/api/property
```

### Update or inspect EstateHub

```sh
git pull --ff-only
bash deploy/deploy.sh
docker compose logs --tail=100 api
```

A fresh database starts empty. Use the demo interface to register an agent and add sample listings.
