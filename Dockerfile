FROM node

WORKDIR /usr/prg
COPY . /usr/prg

RUN npm install
RUN npm run build

EXPOSE 8001
CMD ["npm", "start"]
