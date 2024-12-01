FROM node:20

WORKDIR /backend

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build

ENTRYPOINT ["npm", "run", "start"]
