#!bin/bash
set -e
yarn install
yarn run build
cp _redirects build/
