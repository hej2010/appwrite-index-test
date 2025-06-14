Reproducing the `AppwriteException: Invalid index attribute "" not found` error:

1. Use docker compose file from version 1.6.1: https://github.com/appwrite/website/blob/32968fefe76dc7c03c9854364cf759a559881136/static/install/compose and .env: https://github.com/appwrite/website/blob/32968fefe76dc7c03c9854364cf759a559881136/static/install/env
2. Add bun-1.1 to _APP_FUNCTIONS_RUNTIMES in .env
3. Start docker, create an organisation and project
4. Create a database with id `main`
5. Create a function manually, bun-1.1 runtime and upload these project files (uses https in the endpoint, change if required). Entrypoint `src/main.js`, install script `bun install`
6. Deploy it, give the function all Database scopes
7. Execute it, it will fail the first time with
```
AppwriteException: Attribute not available: iiiiiiiii
    at new AppwriteException (/usr/local/server/src/function/node_modules/node-appwrite/dist/client.mjs:8:5)
    at <anonymous> (/usr/local/server/src/function/node_modules/node-appwrite/dist/client.mjs:293:17)
    at processTicksAndRejections (:12:39)
```
8. Execute it again to finish creating all collections and indexes
9. Upgrade appwrite to version 1.6.2 and run the migration: https://appwrite.io/docs/advanced/self-hosting/update#install-next-version
```shell
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="upgrade" \
    appwrite/appwrite:1.6.2
```
```shell
cd appwrite/
docker compose exec appwrite migrate
```
Migration output: https://pastebin.com/XuDh9qij

10. Go to the database, Test collection, edit e.g. the `ccccccccccc` attribute and update the size to e.g. 129 and save. It will show an `AppwriteException: Invalid index attribute "" not found` error.
