FROM node:14.15.0-alpine

WORKDIR /server

COPY package*.json ./

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development" ]; \
    then yarn install; \
    else yarn install --only=production; \
    fi

COPY . ./

EXPOSE 9000

CMD ["yarn", "start"]