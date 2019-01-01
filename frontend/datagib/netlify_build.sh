#!bin/bash
set -e
npm install yarn
yarn install
yarn run build
cp _redirects build/
