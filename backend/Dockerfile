FROM node:14
WORKDIR /backend/
COPY package*.json /backend/
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "npm", "run", "start" ]