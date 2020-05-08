"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = {
    'number': 'number',
    'object': 'object',
    'array': 'array',
    'boolean': 'boolean',
    'date': 'date',
    'string': 'string',
    'undefined': 'undefined',
    'null': 'null',
    'function': 'function'
};
var trace = [];
var options = { allowUnknown: false };
function validateType(value, schema, valueType, schemaType) {
    if (schemaType != exports.type.object || !schema.type) {
        return buildErrorMessage(value, valueType, schemaType);
    }
    var shType = findType(schema.type);
    if (valueType !== shType) {
        return buildErrorMessage(value, valueType, shType);
    }
    return null;
}
function buildErrorMessage(value, valueType, schemaType) {
    return "required type '" + schemaType + "' for value '" + JSON.stringify(value) + "' but found '" + valueType + "' at path " + trace.join('.');
}
function validate(value, schema, options) {
    trace.length = 0;
    options = Object.assign(options, (options || {}));
    var error = validateData(value, schema);
    return error;
}
exports.validate = validate;
function validateData(value, schema) {
    var valueType = findType(value);
    var schemaType = findType(schema);
    var error = null;
    switch (valueType) {
        case exports.type.string:
            error = validateType(value, schema, valueType, schemaType);
            break;
        case exports.type.number:
            error = validateType(value, schema, valueType, schemaType);
            break;
        case exports.type.boolean:
            error = validateType(value, schema, valueType, schemaType);
            break;
        case exports.type.date:
            error = validateType(value, schema, valueType, schemaType);
            break;
        case exports.type.object:
            if (schemaType != exports.type.object) {
                error = buildErrorMessage(value, valueType, schemaType);
            }
            if (Object.keys(schema).length === 0) {
                error = "found '" + valueType + "' for value '" + JSON.stringify(value) + "' but no schema definition found : " + trace.join('.');
            }
            if (!error) {
                var keys = Object.keys(value);
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    trace.push(key);
                    if (!schema[key] && !options.allowUnknown) {
                        error = "no schema definition found for value " + JSON.stringify(value[key]) + " : " + trace.join('.');
                    }
                    if (!error) {
                        error = validateData(value[key], schema[key]);
                        if (error != null) {
                            break;
                        }
                    }
                    trace.pop();
                }
            }
            break;
        case exports.type.array:
            if (findType(schema) !== exports.type.array) {
                error = buildErrorMessage(value, valueType, schemaType);
            }
            else if (schema.length == 0) {
                error = "no schema definition found for value " + JSON.stringify(value) + " at path " + trace.join('.');
            }
            if (!error) {
                for (var index = 0; index < value.length; index++) {
                    var subValue = value[index];
                    trace.push("[" + index + "]");
                    error = validateData(subValue, schema[0]);
                    if (error != null) {
                        break;
                    }
                    trace.pop();
                }
            }
            break;
        default:
            error = "no schema definition found for value " + JSON.stringify(value) + " at path " + trace.join('.');
            break;
    }
    return error;
}
function findType(value) {
    var valueType = typeof value;
    if (valueType === exports.type.string) {
        if (!isNaN(Date.parse(value))) {
            return exports.type.date;
        }
        return valueType;
    }
    if (valueType === exports.type.object) {
        if (value instanceof Array && Array.isArray(value)) {
            return exports.type.array;
        }
        if (value === null) {
            return exports.type.null;
        }
        if (value instanceof Date) {
            return exports.type.date;
        }
        if (value instanceof Number) {
            return exports.type.number;
        }
        if (value instanceof String) {
            return exports.type.string;
        }
        if (value instanceof Boolean) {
            return exports.type.boolean;
        }
        return valueType;
    }
    if (valueType === exports.type.function) {
        if (value.name) {
            return value.name.toLowerCase();
        }
    }
    return valueType;
}
exports.findType = findType;
