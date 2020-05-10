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
/**
 * validate - will compare json object and defined schema
 * @param value - json object
 * @param schema - schema definition
 * @returns string | null - if any schema fails it will return string otherwise null.
 */
export declare function validate(value: any, schema: any): string | null;
/**
 * findType - will return type of given value
 * @param value : any
 * @returns string
 */
export declare function findType(value: any): string;
