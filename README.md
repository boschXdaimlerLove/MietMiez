# MietMiez
A platform to rent pets

## Deployment
This tutorial expects a running and tls configured traefik instance with a docker socket provider configured

1. To deploy, first clone the git repository and cd into it

```bash
git clone https://github.com/boschxdaimlerlove/mietmiez mietmiez && cd mietmiez
```

2. change passwords and keys in the .*.env files in configs/ and change the url in the labels of each container to a domain you own
for further details look into [configs/README.md](configs/README.md)

3a. after that, spin up backend, frontend, postgres and minio with docker
```bash
docker compose up -d --build
```

3b. or podman-compose
```bash
podman-compose up -d --build
```

LINKS:
-----
Frontend: [localhost:3000](http://localhost:3000)

Backend: [localhost:8080](http://localhost:8080)

Minio Admin: [localhost:9001](http://localhost:9001)

