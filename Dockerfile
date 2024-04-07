FROM node:16.16.0-alpine3.15

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE 3000

RUN npm run build


CMD [ "npm", "run", "start:prod" ]