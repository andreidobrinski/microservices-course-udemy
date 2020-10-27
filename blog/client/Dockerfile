FROM node:alpine

# workaround for create-react-app
ENV CI=true
stdin_open: true

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]