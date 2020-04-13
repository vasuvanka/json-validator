export declare type defaultType = string | number | boolean | Date;
export declare type valueType = String | Number | Boolean | Date;
export declare type validateWith = (arg: any, body?: any) => any;
/**
 * valueSchema - represents a value and its rules
 */
export interface valueSchema {
    /**
     * type - type of value. it can be String,Number,Boolean,Date
     */
    type: valueType;
    /**
     * default - if there is no key exist this value will be set
     */
    default?: defaultType;
    /**
     * required - if required true it will check for existance, if not found will throw an error
     */
    required?: boolean;
    /**
     * pattern - Validate strings using regex
     */
    pattern?: string;
    /**
     * min - value should be grater than min
     */
    min?: number;
    /**
     * max - value should be less than max
     */
    max?: number;
    /**
     * length - length of string
     */
    length?: number;
    /**
     * validateWith - function will take 2 arguments one is value and other is body and return a value
     */
    validateWith?: validateWith;
}
/**
 * valueValidation - will validate value aganist schema
 */
export interface valueValidation {
    /**
     * key - key name of object
     */
    key: string;
    /**
     * value - value
     */
    value: defaultType;
    /**
     * schema - value schema
     */
    schema: valueSchema;
    /**
     * error - if value is not suits the schema defined then it will return error string or null
     */
    error: string | null;
}
export declare function validate(value: any, schema: any): string | null;
/**
 * findType - will return type of given value
 * @param value : any
 * @returns string
 */
export declare function findType(value: any): string;
export declare function buildValueObj(key: string, value: defaultType, schema: any): valueValidation;
export declare function compareTypes(valueObj: valueValidation): valueValidation;
//# sourceMappingURL=validator.d.ts.map