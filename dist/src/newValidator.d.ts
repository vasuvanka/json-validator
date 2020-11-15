export interface IOptions {
    allowUnknown: boolean;
}
export declare function ngValidate(value: any, schema: any, options?: IOptions): Error | null;
