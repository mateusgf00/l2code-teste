
FROM node:18


WORKDIR /usr/src/app


COPY . .


RUN npm install --legacy-peer-deps


EXPOSE 3000


ENV NODE_ENV=development
ENV PORT=3000
ENV JWT_SECRET=l2code-secret-key-for-local-development


CMD ["npm", "run", "start:dev"]
