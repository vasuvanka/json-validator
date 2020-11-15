"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngValidate = void 0;
const trace = [];
function ngValidate(value, schema, options) {
    let err = validate(value, schema, Object.assign({
        allowUnknown: true,
    }, options || {}));
    let newErr = null;
    if (err) {
        newErr = new Error(`${err} at path ${trace.join(".").replace(".[", "[").replace("].", "]")}`);
    }
    trace.length = 0;
    return newErr;
}
exports.ngValidate = ngValidate;
function validate(value, schema, options) {
    var _a, _b;
    let err = null;
    if (typeof value === "object") {
        const valueType = Array.isArray(value) ? "array" : "object";
        switch (valueType) {
            case "object":
                if (Object.keys(schema).length === 0) {
                    return `found '${valueType}' for value '${JSON.stringify(value)}' but no schema definition found`;
                }
                for (const key in value) {
                    trace.push(key);
                    err = validate(value[key], schema[key], options);
                    if (err) {
                        break;
                    }
                    trace.pop();
                }
                break;
            case "array":
                if (typeof schema !== "object" || !Array.isArray(schema)) {
                    return `required type ${typeof value} for value ${JSON.stringify(value)}`;
                }
                else {
                    if (!schema.length) {
                        return `no schema definition found for value ${JSON.stringify(value)}`;
                    }
                    let i = 0;
                    for (const v of value) {
                        trace.push(`[${i++}]`);
                        err = validate(v, schema[0], options);
                        if (err) {
                            break;
                        }
                        trace.pop();
                    }
                }
        }
    }
    else {
        const found = !!(schema === null || schema === void 0 ? void 0 : schema.type);
        if (!found) {
            if (!options.allowUnknown) {
                return `no schema definition found for value '${JSON.stringify(value)}'`;
            }
            return null;
        }
        if (!Object.prototype.toString
            .call(value)
            .includes((_a = schema === null || schema === void 0 ? void 0 : schema.type) === null || _a === void 0 ? void 0 : _a.name.toString())) {
            return `required type '${(_b = schema === null || schema === void 0 ? void 0 : schema.type) === null || _b === void 0 ? void 0 : _b.name.toString()}' for value '${JSON.stringify(value)}'`;
        }
    }
    return err;
}
//# sourceMappingURL=ngValidator.js.map