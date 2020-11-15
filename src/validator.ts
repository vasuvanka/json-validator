/**
 * author : Vasu Vanka
 * copyright @ 2019 - till date
 * MIT license
 */

// IOptions - validator configuration
export interface IOptions {
  // allowUnknown - default to true
  allowUnknown: boolean;
}

// trace - will be used track validation path
const trace: string[] = [];

// IOptions - which will allow to do strict check
const validatorConfig: IOptions = { allowUnknown: true };

/**
 * validate - will compare json object and defined schema
 * @param value - json object
 * @param schema - schema definition
 * @param IOptions - Validator configuration object
 * @returns Error | null - if value aganist schema fails then return Error otherwise null.
 * <pre><code>
 * const { validate } = require('@vasuvanka/json-validator')
 * const jsonValue = { name : "hello world" };
 * const jsonSchema = { name: { type : String } };
 * const error = validate(json,jsonSchema, {allowUnkown:false})
 * if(error){
 *  console.log(`Got error : ${error.message}`)
 * }
 * </code></pre>
 * */
export function validate(
  value: any,
  schema: any,
  options?: IOptions
): Error | null {
  let err = ngValidate(
    value,
    schema,
    Object.assign(validatorConfig, options || {})
  );
  let newErr = null;
  if (err) {
    newErr = new Error(
      `${err} at path ${trace.join(".").replace(".[", "[").replace("].", "]")}`
    );
  }
  trace.length = 0;
  return newErr;
}

function getNoSchemaErrorMessage(value: any) {
  return `no schema definition found for value '${JSON.stringify(value)}'`;
}
/**
 * ngValidate - validate json object aganist schema defined
 * @param value - json object
 * @param schema - schema definition
 * @param options - Ioption config object
 * @returns string | null - if any schema fails it will return string otherwise null.
 */
function ngValidate(value: any, schema: any, options: IOptions): String | null {
  let err: String | null = null;
  if (typeof value === "object") {
    if (!Array.isArray(value)) {
      if (typeof schema == "object" && Object.keys(schema).length === 0) {
        return getNoSchemaErrorMessage(value);
      }
      if (typeof schema == "object" && Array.isArray(schema)) {
        return `required type '${Object.prototype.toString
          .call(schema)
          .split(" ")[1]
          .replace("]", "")}' for value '${JSON.stringify(value)}'`;
      }
      for (const key in value) {
        trace.push(key);
        if (!schema[key]) {
          if (!options.allowUnknown) {
            return getNoSchemaErrorMessage(value[key]);
          }
          trace.pop();
          continue;
        }
        err = ngValidate(value[key], schema[key], options);
        if (err) {
          break;
        }
        trace.pop();
      }
    } else {
      if (!Array.isArray(schema)) {
        if (schema?.type) {
          return getErrorMessage(schema, value);
        }
        return getNoSchemaErrorMessage(value);
      }
      if (schema.length == 0) {
        return getNoSchemaErrorMessage(value);
      }
      let i = 0;
      for (const v of value) {
        trace.push(`[${i++}]`);
        if (!schema[0] && !options.allowUnknown) {
          return `required type '${Object.prototype.toString
            .call(schema)
            .split(" ")[1]
            .replace("]", "")}' for value '${JSON.stringify(value)}'`;
        }
        err = ngValidate(v, schema[0], options);
        if (err) {
          break;
        }
        trace.pop();
      }
    }
  } else {
    if (!schema?.type) {
      if (typeof schema == "object" && Array.isArray(schema)) {
        return `required type '${Object.prototype.toString
          .call(schema)
          .split(" ")[1]
          .replace("]", "")}' for value '${JSON.stringify(value)}'`;
      }
      if (!options.allowUnknown) {
        return getNoSchemaErrorMessage(value);
      }
      return null;
    }

    if (
      !Object.prototype.toString
        .call(value)
        .includes(schema?.type?.name.toString())
    ) {
      return `required type '${schema?.type?.name.toString()}' for value '${JSON.stringify(
        value
      )}'`;
    }
  }
  return err;
}

function getType(value: any): string {
  return Object.prototype.toString
    .call(value?.name)
    .split(" ")[1]
    .replace("]", "");
}

function getErrorMessage(schema: any, value: any) {
  return `required type '${getType(schema?.type)}' for value '${JSON.stringify(
    value
  )}'`;
}
