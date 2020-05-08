# json-validator
Json Validator - validates a json object against defined schema and written with zero dependencies.

## Install

```
npm install @vasuvanka/json-validator
```

## Docs

* API Documentation: https://vasuvanka.github.io/json-validator

## Example

```js
const {
  validate
} = require('@vasuvanka/json-validator');

const bodySchema = {
    'name': {
        type: String,
    },
    'phone':{ type: Number},
    'isLoggedIn':{type: Boolean},
    'address':{
        line: { 
            add : [{type: Number}]
        },
        street: {type: String},
        city: {type: String},
        pincode: { type: Number},
    },
    list: [{type:String}]
}

const body = {
    name: 'Hello',
    phone: 88010000000,
    address:{
        line: {
            add: [1]
        },
        street: "streetlk111",
        city: "some city",
        pincode: 453672
    },
    isLoggedIn: false,
    list: ['hello','world']

}
const error = validate(body,bodySchema)
console.log(error)
// add strict check option, default to strict
const error = validate(body,bodySchema, { allowUnkown:false})
console.log(error)
```
## LICENCE
MIT

## Free software,hell ya.