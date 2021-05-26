FROM node:14-alpine
WORKDIR /usr/app/server
COPY package.json yarn.lock ./
COPY . .
RUN yarn install --frozen-lockfile
ENV NODE_ENV production
RUN yarn build
EXPOSE 8080
USER node
CMD ["yarn", "start"]