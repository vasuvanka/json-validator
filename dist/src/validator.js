"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const trace = [];
const validatorConfig = { allowUnknown: true };
function validate(value, schema, options) {
    let err = ngValidate(value, schema, Object.assign(validatorConfig, options || {}));
    let newErr = null;
    if (err) {
        newErr = new Error(`${err} at path ${trace.join(".").replace(".[", "[").replace("].", "]")}`);
    }
    trace.length = 0;
    return newErr;
}
exports.validate = validate;
function getNoSchemaErrorMessage(value) {
    return `no schema definition found for value '${JSON.stringify(value)}'`;
}
function ngValidate(value, schema, options) {
    var _a, _b;
    let err = null;
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
        }
        else {
            if (!Array.isArray(schema)) {
                if (schema === null || schema === void 0 ? void 0 : schema.type) {
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
    }
    else {
        if (!(schema === null || schema === void 0 ? void 0 : schema.type)) {
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
        if (!Object.prototype.toString
            .call(value)
            .includes((_a = schema === null || schema === void 0 ? void 0 : schema.type) === null || _a === void 0 ? void 0 : _a.name.toString())) {
            return `required type '${(_b = schema === null || schema === void 0 ? void 0 : schema.type) === null || _b === void 0 ? void 0 : _b.name.toString()}' for value '${JSON.stringify(value)}'`;
        }
    }
    return err;
}
function getType(value) {
    return Object.prototype.toString
        .call(value === null || value === void 0 ? void 0 : value.name)
        .split(" ")[1]
        .replace("]", "");
}
function getErrorMessage(schema, value) {
    return `required type '${getType(schema === null || schema === void 0 ? void 0 : schema.type)}' for value '${JSON.stringify(value)}'`;
}
//# sourceMappingURL=validator.js.map