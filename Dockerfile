FROM node:9
WORKDIR /app/src
COPY package.json /app/src
RUN npm install --silent 
ADD . /app/src
CMD npm start