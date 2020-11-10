/**
 * author : vasu vanka
 * copyright @ 2019 - till date
 * MIT license
 */
import Types from './helper';

// trace - will trace error path
const trace: string[] = [];
// IOptions - validator configuration
interface IOptions {
  // allowUnknown - default to false
  allowUnknown: boolean;
}
// IOptions - which will allow to do strict check
let validatorConfig: IOptions = { allowUnknown: true };

/**
 * validateType - validates value and type
 * @param value - value
 * @param schema - schema
 * @param valueType - type of value
 * @param schemaType - type defined in schema
 * @returns string | null - if schema and value mismatch then it will return error message else null
 */
function validateType(
  value: any,
  schema: any,
  valueType: string,
  schemaType: string
): string | null {
  if (schemaType != Types.object || !schema.type) {
    return buildErrorMessage(value, valueType, schemaType);
  }
  const shType = findType(schema.type);
  if (valueType !== shType) {
    return buildErrorMessage(value, valueType, shType);
  }
  return null;
}
/**
 * buildErrorMessage - will constructs error message
 * @param value - any value
 * @param valueType - type of value
 * @param schemaType - schema type for value
 * @returns string - will return constructed error message
 */
function buildErrorMessage(
  value: any,
  valueType: string,
  schemaType: string
): string {
  return `required type '${schemaType}' for value '${JSON.stringify(
    value
  )}' but found '${valueType}' at path ${trace.join(".")}`;
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
export function validate(
  value: any,
  schema: any,
  options?: IOptions
): string | null {
  validatorConfig = Object.assign(validatorConfig, options || {});
  trace.length = 0;
  const error = validateData(value, schema);
  return error;
}
/**
 * validateData - validate json object aganist schema defined
 * @param value - json object
 * @param schema - schema definition
 * @returns string | null - if any schema fails it will return string otherwise null.
 */
function validateData(value: any, schema: any): string | null {
  const valueType = findType(value);
  const schemaType = findType(schema);
  let error = null;
  switch (valueType) {
    case Types.string:
      error = validateType(value, schema, valueType, schemaType);
      break;
    case Types.number:
      error = validateType(value, schema, valueType, schemaType);
      break;
    case Types.boolean:
      error = validateType(value, schema, valueType, schemaType);
      break;
    case Types.date:
      error = validateType(value, schema, valueType, schemaType);
      break;
    case Types.object:
      if (schemaType != Types.object) {
        error = buildErrorMessage(value, valueType, schemaType);
      }
      if (Object.keys(schema).length === 0) {
        error = `found '${valueType}' for value '${JSON.stringify(
          value
        )}' but no schema definition found : ${trace.join(".")}`;
      }
      if (!error) {
        const keys = Object.keys(value);
        for (const key of keys) {
          trace.push(key);
          if (!schema[key]) {
            if (validatorConfig.allowUnknown) {
              continue;
            } else {
              error = `no schema definition found for value ${JSON.stringify(
                value[key]
              )} : ${trace.join(".")}`;
            }
          }
          if (!error) {
            error = validateData(value[key], schema[key]);
            if (error != null) {
              break;
            }
          }
          trace.pop();
        }
      }
      break;
    case Types.array:
      if (findType(schema) !== Types.array) {
        error = buildErrorMessage(value, valueType, schemaType);
      }
      if (schema.length == 0) {
        error = `no schema definition found for value ${JSON.stringify(
          value
        )} at path ${trace.join(".")}`;
      }
      if (!error) {
        for (let index = 0; index < value.length; index++) {
          const subValue = value[index];
          trace.push(`[${index}]`);
          error = validateData(subValue, schema[0]);
          if (error != null) {
            break;
          }
          trace.pop();
        }
      }
      break;
    default:
      error = `no schema definition found for value ${JSON.stringify(
        value
      )} at path ${trace.join(".")}`;
      break;
  }
  return error;
}
/**
 * findType - will return type of given value
 * @param value : any
 * @returns string
 */
export function findType(value: any): string {
  // get object instance type
  Object.prototype.toString.call(value);
  const valueType = typeof value;
  if (valueType === Types.string) {
    if (!isNaN(Date.parse(value))) {
      return Types.date;
    }
    return valueType;
  }
  if (valueType === Types.object) {
    if (value instanceof Array && Array.isArray(value)) {
      return Types.array;
    } else if (value === null) {
      return Types.null;
    } else if (value instanceof Date) {
      return Types.date;
    } else if (value instanceof Number) {
      return Types.number;
    } else if (value instanceof String) {
      return Types.string;
    } else if (value instanceof Boolean) {
      return Types.boolean;
    }
    return valueType;
  }
  if (valueType === Types.function && value.name) {
    return value.name.toLowerCase();
  }
  return valueType;
}
