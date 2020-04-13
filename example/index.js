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
    name: "vasu vanka",
    phone: 8801810010,
    address:{
        line: {
            add: [1]
        },
        street: "streetlk111",
        city: 89483,
        pincode: 500005
    },
    isLoggedIn: false,
    list: ['hello','world']

}
const error = validate(body,bodySchema)
console.log(error)



