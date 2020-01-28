FROM node:12
RUN apt-get update && apt-get install -y ffmpeg
ARG DISCORD_BOT_KEY
ARG AUDIO_PATH
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm ci
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
COPY . .
EXPOSE 8080
CMD [ "node", "src/index.js" ]