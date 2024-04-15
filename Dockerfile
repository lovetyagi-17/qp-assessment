FROM node:16.13.1-alpine3.14

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm cache clean --force
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE 8080

RUN npm run build


CMD [ "npm", "run", "start" ]