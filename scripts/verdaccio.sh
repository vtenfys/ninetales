#!/bin/bash

publish() {
  registry=http://localhost:4873
  package_name=$(node -e 'console.log(require("./package.json").name)')
  package_version=$(node -e 'console.log(require("./package.json").version)')

  npm unpublish "$package_name@$package_version" --registry $registry
  npm publish --registry $registry
}

if [ "$1" != '' ]; then
  cd "packages/$1" && publish && exit 0 || exit 1
fi

for package in packages/*; do
  cd "$package" && publish && cd ../.. || exit 1
done
