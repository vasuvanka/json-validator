const {
    validate
} = require('../dist')


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
    name: "Hello",
    phone: 880000000,
    address:{
        line: {
            add: [1]
        },
        street: "streetlk111",
        city: "some city",
        pincode: 500005,
        help:'needed'
    },
    isLoggedIn: false,
    list: ['hello','world']

}
const error = validate(body,bodySchema)
console.log(error)

const err = validate(body,bodySchema, {allowUnknown: false})
console.log(err)

const json = {
    list: "hello",
  };
  const jsonSchema = {
    list: [
      {
        type: Boolean,
      },
    ],
  };
console.log(validate(json,jsonSchema,{allowUnknown: false}))
