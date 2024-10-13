### Development
Start application in development mode:
```shell
npm i
npm run dev
```

Migrate Prisma schema to the database:
```shell
npx prisma db push
```

**NOTE:** Fill the necessary environment variables in the [`.env`](.env) file. Example of the [`.env`](.env) file can be found in the [`example.env`](example.env) file.
