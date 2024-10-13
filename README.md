### Development
- [backend README](backend/README.md)
- [frontend README](frontend/README.md)

### Production
Build:
```shell
docker compose -f compose-master.yml -f compose-local.yml build
```

Start:
```shell
docker compose -f compose-master.yml -f compose-local.yml up -d
```

**NOTE:** [example-compose-local.yml](example-compose-local.yml) file is an example how [compose-local.yml](compose-local.yml) file should look like.
