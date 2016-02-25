FROM node:5.7.0
EXPOSE 3005
RUN apt-get update && apt-get -y upgrade && apt-get install -y pdftk
COPY ./ .
RUN cd . && NODE_ENV=development npm install
CMD ./node_modules/.bin/nodemon -L ./app.js
