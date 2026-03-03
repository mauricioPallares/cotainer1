FROM node:20-alpine

WORKDIR /usr/src/app

ENV NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NODE_ENV=development
ENV PORT=3001

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
