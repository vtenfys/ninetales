#!/bin/bash
set -e

registry=http://localhost:4873
package_name=$(node -e 'console.log(require("./package.json").name)')
package_version=$(node -e 'console.log(require("./package.json").version)')

npm unpublish "$package_name@$package_version" --registry $registry
npm publish --registry $registry
