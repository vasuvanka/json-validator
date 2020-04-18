import { findType, validate } from "../src/validator"


describe('findType', () => {
    it('String # validate string', () => {
        const type = findType('hello world')
        expect(type).toBe('string')
    })
    it('Number # validate number', () => {
        const type = findType(100)
        expect(type).toBe('number')
    })
    it('Boolean # validate boolean', () => {
        const type = findType(true)
        expect(type).toBe('boolean')
    })
    it('Date string # validate date', () => {
        const date = new Date().toDateString()
        const type = findType(date)
        expect(type).toBe('date')
    })
    it('Date object # validate date', () => {
        const date = new Date()
        const type = findType(date)
        expect(type).toBe('date')
    })
    it('Null # validate null', () => {
        const type = findType(null)
        expect(type).toBe('null')
    })
    it('Array # validate array', () => {
        const type = findType(['hello', 'world'])
        expect(type).toBe('array')
    })
    it('object # validate object', () => {
        const type = findType({ 'name': 'hello' })
        expect(type).toBe('object')
    })
    it('undefined # validate undefined', () => {
        const type = findType(undefined)
        expect(type).toBe('undefined')
    })
    it('Number primitive # validate Number', () => {
        const type = findType(Number)
        expect(type).toBe('number')
    })
    it('String primitive # validate string', () => {
        const type = findType(String)
        expect(type).toBe('string')
    })
    it('Boolean primitive # validate Boolean', () => {
        const type = findType(Boolean)
        expect(type).toBe('boolean')
    })
    it('Array primitive # validate Array', () => {
        const type = findType(Array)
        expect(type).toBe('array')
    })
    it('Object primitive # validate Object', () => {
        const type = findType(Object)
        expect(type).toBe('object')
    })
    it('Number primitive # validate Number', () => {
        const type = findType(new Number(123))
        expect(type).toBe('number')
    })
    it('String primitive # validate string', () => {
        const type = findType(new String('hello'))
        expect(type).toBe('string')
    })
    it('Boolean primitive # validate Boolean', () => {
        const type = findType(new Boolean(''))
        expect(type).toBe('boolean')
    })
    it('Array primitive # validate Array', () => {
        const type = findType(new Array(1, 2, 3))
        expect(type).toBe('array')
    })
    it('Object primitive # validate Object', () => {
        const type = findType(new Object())
        expect(type).toBe('object')
    })
})

describe('validate', () => {
    it('success validation', () => {
        const bodySchema = {
            'name': {
                type: String,
                default: "helo"
            },
            'phone': { type: Number },
            'isLoggedIn': { type: Boolean },
            'address': {
                line: {
                    add: [{ type: Number }]
                },
                street: { type: String },
                city: { type: String },
                pincode: { type: Number },
            },
            list: [{ type: String }],
            createdAt: { type: Date}
        }
        const body = {
            name: 'vasu',
            phone: 8801810010,
            address: {
                line: {
                    add: [1]
                },
                street: "streetlk111",
                city: "city",
                pincode: 500005
            },
            isLoggedIn: false,
            list: ['hello', 'world'],
            createdAt: new Date()
        }
        expect(validate(body,bodySchema)).toBe(null)
    })

    it('should return error for string',()=>{
        const body = {
            name: 10
        };
        const bodySchema = {
            'name': {
                type: String,
            }
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("required type 'string' for value '10' but found 'number' at path name")
    })

    it('should return error for number',()=>{
        const error = validate({
            phone: "880something89"
        },{
            'phone': {
                type: Number,
            }
        })
        expect(error).not.toBe(null)
        expect(error).toBe("required type 'number' for value '\"880something89\"' but found 'string' at path phone")
    })

    it('should return error for boolean',()=>{
        const body = {
            isValid: "hello"
        };
        const bodySchema = {
            'isValid': {
                type: Boolean,
            }
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("required type 'boolean' for value '\"hello\"' but found 'string' at path isValid")
    })

    it('should return error for array',()=>{
        const body = {
            list: "hello"
        };
        const bodySchema = {
            'list': [{
                type: Boolean,
            }]
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("required type 'array' for value '\"hello\"' but found 'string' at path list")
    })

    it('should return error for invalid date',()=>{
        const body = {
            createdAt: "test"
        };
        const bodySchema = {
            createdAt: {
                type: Date
            }
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("required type 'date' for value '\"test\"' but found 'string' at path createdAt")
    })

    it('should return error for object',()=>{
        const body = {
            address: {
                line:"test street 150"
            }
        };
        const bodySchema = {
            address: [{
                type: String
            }]
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("required type 'array' for value '{\"line\":\"test street 150\"}' but found 'object' at path address")
    })

    it('should return error for empty object',()=>{
        const body = {
            address: {
                line:"test street 150"
            }
        };
        const bodySchema = {
            address: {}
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("found 'object' for value '{\"line\":\"test street 150\"}' but no schema definition found : address")
    })

    it('should return error for empty array',()=>{
        const body = {
            address: {
                line:"test street 150"
            }
        };
        const bodySchema = {
            address: []
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("found 'object' for value '{\"line\":\"test street 150\"}' but no schema definition found : address")
    })

    it('should return error for no schema definition at object',()=>{
        const bodySchema = {
            'name': {
                type: String,
                default: "helo"
            },
            'phone': { type: Number },
            'isLoggedIn': { type: Boolean },
            'address': {
                line: {
                    add: [{ type: Number }]
                },
                city: { type: String },
                pincode: { type: Number },
            },
            list: [{ type: String }],
            createdAt: { type: Date}
        }
        const body = {
            name: 'vasu',
            phone: 8801810010,
            address: {
                line: {
                    add: [1]
                },
                street: "streetlk111",
                city: "city",
                pincode: 500005
            },
            isLoggedIn: false,
            list: ['hello', 'world'],
            createdAt: new Date()
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("no schema definition found for value \"streetlk111\" : address.street")
    })

    it('should return error for array definiton',()=>{
        const body = {
            address: ["hello world"]
        };
        const bodySchema = {
            address: {type: String}
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("required type 'object' for value '[\"hello world\"]' but found 'array' at path address")
    })

    it('should return error for array definiton with empty declaration',()=>{
        const body = {
            address: ["hello world"]
        };
        const bodySchema = {
            address: []
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("no schema definition found for value [\"hello world\"] at path address")
    })

    it('should return error for array definiton with invalid declaration',()=>{
        const body = {
            address: ["hello world"]
        };
        const bodySchema = {
            address: [{type: Number}]
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("required type 'number' for value '\"hello world\"' but found 'string' at path address.[0]")
    })

    it('should return error no schema definiton',()=>{
        class Student{
            name: string
            constructor(name: string){
                this.name = name
            }
        }
        const body = {
            name: new Student('test')
        };
        const bodySchema = {
            name: [{type: Number}]
        }
        const error = validate(body,bodySchema)
        expect(error).not.toBe(null)
        expect(error).toBe("required type 'array' for value '{\"name\":\"test\"}' but found 'object' at path name")
    })
})