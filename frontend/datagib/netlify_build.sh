#!bin/bash
set -e
npm install -g yarn
yarn install
yarn run build
cp _redirects build/
