#!/bin/bash

publish() {
  registry=http://localhost:4873
  npm unpublish --force --registry $registry
  npm publish --registry $registry
}

if [ "$1" != '' ]; then
  cd "packages/$1" &&
  publish
else
  for package in packages/*; do
    cd "$package" &&
    publish &&
    cd ../.. || exit 1
  done
fi
