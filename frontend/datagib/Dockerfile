# base image
FROM node:10.13.0

COPY package.json /frontend/
WORKDIR /frontend/
RUN yarn install
ENV PATH /frontend/node_modules/.bin:$PATH

COPY . /frontend/datagib/
WORKDIR /frontend/datagib/

EXPOSE 3000

CMD yarn start
