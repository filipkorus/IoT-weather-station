FROM node:20

WORKDIR /frontend

COPY . .

RUN npm install
RUN npm run build
RUN npm install -g serve

ENTRYPOINT ["serve", "-s", "dist"]
