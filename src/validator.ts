// type - object of types
export const type = {
    'number': 'number',
    'object': 'object',
    'array': 'array',
    'boolean': 'boolean',
    'date': 'date',
    'string': 'string',
    'undefined': 'undefined',
    'null': 'null',
    'function': 'function'
}
// trace - will trace error path
const trace: string[] = []
// IOptions - validator configuration 
interface IOptions {
    // allowUnknown - default to false
    allowUnknown: boolean
}
// IOptions - which will allow to do strict check
let options: IOptions = { allowUnknown: true }

/**
 * validateType - validates value and type
 * @param value - value
 * @param schema - schema
 * @param valueType - type of value
 * @param schemaType - type defined in schema
 * @returns string | null - if schema and value mismatch then it will return error message else null
 */
function validateType(value: any, schema: any, valueType: string, schemaType: string): string| null {
    if (schemaType != type.object || !schema.type) {
        return buildErrorMessage(value,valueType,schemaType)
       }
       const shType = findType(schema.type)
       if (valueType !== shType) {
           return buildErrorMessage(value,valueType,shType)
       }
    return null
}
/**
 * buildErrorMessage - will constructs error message
 * @param value - any value
 * @param valueType - type of value
 * @param schemaType - schema type for value
 * @returns string - will return constructed error message
 */
function buildErrorMessage(value: any,valueType: string,schemaType: string): string {
    return `required type '${schemaType}' for value '${JSON.stringify(value)}' but found '${valueType}' at path ${trace.join('.')}`
}

/**
 * validate - will compare json object and defined schema
 * @param value - json object
 * @param schema - schema definition
 * @param IOptions - Validator configuration object
 * @returns string | null - if any schema fails it will return string otherwise null.
 * <pre><code>
 * const { validate } = require('@vasuvanka/json-validator')
 * const json = { name : "hello world" };
 * const jsonSchema = { name: { type : String } };
 * // options is an optional parameter
 * const options = {allowUnkown:false}
 * const error = validate(json,jsonSchema, options)
 * if(error){
 *  console.log(`Got error : ${error}`)
 * }
 * </code></pre>
 * */
export function validate(value: any, schema: any): string | null {
    options = Object.assign(options,(options || {}))
    trace.length = 0
    const error = validateData(value,schema)
    return error
}
/**
 * validateData - validate json object aganist schema defined
 * @param value - json object
 * @param schema - schema definition
 * @returns string | null - if any schema fails it will return string otherwise null.
 */
function validateData(value: any, schema: any): string | null {
    const valueType = findType(value)
    const schemaType = findType(schema)
    let error = null
    switch (valueType) {
        case type.string:
            error = validateType(value,schema,valueType,schemaType)
            break;
        case type.number: 
            error = validateType(value,schema,valueType,schemaType)
            break;
        case type.boolean:
            error = validateType(value,schema,valueType,schemaType)
            break;
        case type.date: 
            error = validateType(value,schema,valueType,schemaType)
            break;
        case type.object:
            if (schemaType != type.object) {
                error = buildErrorMessage(value,valueType,schemaType)
            }
            if (Object.keys(schema).length === 0) {
                error = `found '${valueType}' for value '${JSON.stringify(value)}' but no schema definition found : ${trace.join('.')}`
            }
            if(!error){
                const keys = Object.keys(value)
                for (const key of keys) {
                    trace.push(key)
                    if (!schema[key]) {
                        error = `no schema definition found for value ${JSON.stringify(value[key])} : ${trace.join('.')}`
                    }
                    if (!error) {
                        error = validateData(value[key], schema[key])
                        if (error != null) {
                            break
                        }
                    }
                    trace.pop()
                }
            }
            break
        case type.array:
            if (findType(schema) !== type.array) {
                error = buildErrorMessage(value,valueType,schemaType)
            } else if (schema.length == 0) {
                error = `no schema definition found for value ${JSON.stringify(value)} at path ${trace.join('.')}`
            }
            if(!error){
                for (let index = 0; index < value.length; index++) {
                    const subValue = value[index];
                    trace.push(`[${index}]`)
                    error = validateData(subValue, schema[0])
                    if (error != null) {
                        break
                    }
                    trace.pop()   
                }
            }
            break
        default:
            error = `no schema definition found for value ${JSON.stringify(value)} at path ${trace.join('.')}`
            break;
    }
    return error
}
/**
 * findType - will return type of given value
 * @param value : any
 * @returns string
 */
export function findType(value: any): string {
    const valueType = typeof value
    if (valueType === type.string) {
        if (!isNaN(Date.parse(value))) {
            return type.date
        }
        return valueType
    }
    if (valueType === type.object) {
        if (value instanceof Array && Array.isArray(value)) {
            return type.array
        }
        if (value === null) {
            return type.null
        }
        if (value instanceof Date) {
            return type.date
        }
        if (value instanceof Number) {
            return type.number
        }
        if (value instanceof String) {
            return type.string
        }
        if (value instanceof Boolean) {
            return type.boolean
        }
        return valueType
    }
    if (valueType === type.function) {
        if (value.name) {
            return value.name.toLowerCase()
        }
    }
    return valueType
}
