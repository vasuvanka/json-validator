export interface IOptions {
    allowUnknown: boolean;
}
export declare function validate(value: any, schema: any, options?: IOptions): Error | null;
