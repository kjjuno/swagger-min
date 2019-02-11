FROM node:10-alpine
WORKDIR /repo
COPY . .
RUN npm install
RUN npm link
ENTRYPOINT ["swagger-min"]
