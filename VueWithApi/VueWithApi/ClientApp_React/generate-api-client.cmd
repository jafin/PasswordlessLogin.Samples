REM Generate the api.
npx add-project-script -n "openapi" -v "openapi-generator-cli generate -i ./src/api/openapi.json -g typescript-axios -o ./src/api/generated