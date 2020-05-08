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
export declare function validate(value: any, schema: any, options?: IOptions): string | null;
export declare function findType(value: any): string;
export {};
