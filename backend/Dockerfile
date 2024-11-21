FROM node:20

WORKDIR /backend

COPY . .

RUN npm install
RUN npm run build
RUN npx prisma generate

ENTRYPOINT ["npm", "run", "start"]
