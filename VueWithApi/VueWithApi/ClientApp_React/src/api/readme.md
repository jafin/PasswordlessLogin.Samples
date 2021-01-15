# Issues with Swagger/Open API

There is an issue with the openapi-generator-cli and self referencing objects.
In our case, the issue is JToken with a collection array of JToken.
This breaks openapi-generator-cli (v5 tested).

(This can also be seen by pasting the openapi json into https://apitools.dev/swagger-parser/online/)
It will report `This API is valid, but it cannot be shown because it contains circular references
`


```json
 "JToken": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/JToken"
        }
```

to

```json
 "JToken": {
        "type": "array",
        "items": {
          "type": "object"
        }
```

This should then allow the cli to work 
If configured in the package.json then

`npm run openapi`  

will create the typescript files.

