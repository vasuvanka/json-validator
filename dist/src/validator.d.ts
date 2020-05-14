export declare const type: {
    number: string;
    object: string;
    array: string;
    boolean: string;
    date: string;
    string: string;
    undefined: string;
    null: string;
    function: string;
};
interface IOptions {
    allowUnknown: boolean;
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
export declare function validate(value: any, schema: any, options?: IOptions): string | null;
/**
 * findType - will return type of given value
 * @param value : any
 * @returns string
 */
export declare function findType(value: any): string;
export {};
