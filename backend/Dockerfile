FROM node:20

WORKDIR /backend

COPY . .

RUN npm install && npm run build && npx prisma generate

ENTRYPOINT ["npm", "run", "start"]
