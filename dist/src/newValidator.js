"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngValidate = void 0;
const trace = [];
function ngValidate(value, schema, options) {
    let err = null;
    err = validate(value, schema, Object.assign({
        allowUnknown: true,
    }, options || {}));
    if (err) {
        let msg = err.message + " at path " + trace.join(".");
        msg = msg.replace(".[", "[").replace("].", "]");
        err = new Error(msg);
    }
    return err;
}
exports.ngValidate = ngValidate;
function validate(value, schema, options) {
    var _a, _b;
    let err = null;
    if (typeof value === "object") {
        const valueType = Array.isArray(value) ? "array" : "object";
        switch (valueType) {
            case "object":
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
                    err = new Error(`schema definition mismatch for value ${JSON.stringify(value)}`);
                }
                else {
                    if (!schema.length) {
                        err = new Error("schema error []");
                    }
                    else {
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
    }
    else {
        if (!Object.prototype.toString
            .call(value)
            .includes((_a = schema === null || schema === void 0 ? void 0 : schema.type) === null || _a === void 0 ? void 0 : _a.name.toString())) {
            err = new Error(`required type '${(_b = schema === null || schema === void 0 ? void 0 : schema.type) === null || _b === void 0 ? void 0 : _b.name.toString()}' for value '${JSON.stringify(value)}'`);
        }
    }
    return err;
}
