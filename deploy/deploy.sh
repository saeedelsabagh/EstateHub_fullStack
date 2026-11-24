#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."

if [[ ! -e .env ]]; then
  port=${1:-18081}
  if [[ ! $port =~ ^[1-9][0-9]{3,4}$ ]] || (( port < 1024 || port > 65535 )); then
    printf 'Choose a port between 1024 and 65535.\n' >&2
    exit 1
  fi

  listeners=$(ss -H -ltn "sport = :$port")
  if [[ -n $listeners ]]; then
    printf 'Port %s is occupied. Pass a different port as the first argument.\n' "$port" >&2
    exit 1
  fi

  (
    set -C
    umask 077
    root_password=$(openssl rand -hex 32)
    db_password=$(openssl rand -hex 32)
    jwt_secret=$(openssl rand -hex 32)
    printf 'ESTATEHUB_PORT=%s\nDB_ROOT_PASSWORD=%s\nDB_PASSWORD=%s\nJWT_SECRET=%s\n' \
      "$port" "$root_password" "$db_password" "$jwt_secret" > .env
  )
fi

port=$(awk -F= '$1 == "ESTATEHUB_PORT" { print $2; exit }' .env)
port=${port:-18081}
if [[ -n ${1:-} && $1 != "$port" ]]; then
  printf 'The existing .env uses port %s. Update it and the Nginx upstream together.\n' "$port" >&2
  exit 1
fi
export ESTATEHUB_PORT="$port"

docker compose config --quiet
docker compose up -d --build
docker compose ps
curl --retry 20 --retry-delay 3 --retry-all-errors -fsS \
  "http://127.0.0.1:$port/api/property" > /dev/null
printf 'EstateHub API is responding on http://127.0.0.1:%s/api/property\n' "$port"
