# swagger-min [![CircleCI](https://circleci.com/gh/kjjuno/swagger-min.svg?style=shield)](https://circleci.com/gh/kjjuno/swagger-min) [![Documentation Status](https://readthedocs.org/projects/swagger-min/badge/?version=latest)](https://swagger-min.readthedocs.io/en/latest/?badge=latest)

[![npm version](https://badge.fury.io/js/swagger-min.svg)](https://badge.fury.io/js/swagger-min)

Show only the parts of a swagger document that you are interested in

install swagger-min from npm
```
npm install -g swagger-min
```

download the petstore swagger (remote swagger pages not yet supported)
```
curl https://petstore.swagger.io/v2/swagger.json > swagger.json
```

show relevant swagger for POST /pet
```
swagger-min --file swagger.json --verb post --route /pet
```

```yaml
paths:
  /pet:
    post:
      tags:
        - pet
      summary: Add a new pet to the store
      description: ''
      operationId: addPet
      consumes:
        - application/json
        - application/xml
      produces:
        - application/xml
        - application/json
      parameters:
        - in: body
          name: body
          description: Pet object that needs to be added to the store
          required: true
          schema:
            $ref: '#/definitions/Pet'
      responses:
        '405':
          description: Invalid input
      security:
        - petstore_auth:
            - 'write:pets'
            - 'read:pets'
definitions:
  Pet:
    type: object
    required:
      - name
      - photoUrls
    properties:
      id:
        type: integer
        format: int64
      category:
        $ref: '#/definitions/Category'
      name:
        type: string
        example: doggie
      photoUrls:
        type: array
        xml:
          name: photoUrl
          wrapped: true
        items:
          type: string
      tags:
        type: array
        xml:
          name: tag
          wrapped: true
        items:
          $ref: '#/definitions/Tag'
      status:
        type: string
        description: pet status in the store
        enum:
          - available
          - pending
          - sold
    xml:
      name: Pet
  Category:
    type: object
    properties:
      id:
        type: integer
        format: int64
      name:
        type: string
    xml:
        name: Category
  Tag:
    type: object
    properties:
      id:
        type: integer
        format: int64
      name:
        type: string
    xml:
        name: Tag
```
