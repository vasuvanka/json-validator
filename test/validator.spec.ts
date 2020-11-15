import { validate } from '../src';

describe("validate", (): void => {
  it("success validation", (): void => {
    const bodySchema = {
      name: {
        type: String,
        default: "helo",
      },
      phone: { type: Number },
      isLoggedIn: { type: Boolean },
      address: {
        line: {
          add: [{ type: Number }],
        },
        street: { type: String },
        city: { type: String },
        pincode: { type: Number },
      },
      list: [{ type: String }],
      createdAt: { type: Date },
    };
    const body = {
      name: "vasu",
      phone: 9876543210,
      address: {
        line: {
          add: [1],
        },
        street: "streetlk111",
        city: "city",
        pincode: 500005,
      },
      isLoggedIn: false,
      list: ["hello", "world"],
      createdAt: new Date(),
    };
    expect(validate(body, bodySchema)).toBe(null);
  });

  it("should return error for string", (): void => {
    const body = {
      name: 10,
    };
    const bodySchema = {
      name: {
        type: String,
      },
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "required type 'String' for value '10' at path name"
    );
  });

  it("should return error for number", (): void => {
    const error = validate(
      {
        phone: "880something89",
      },
      {
        phone: {
          type: Number,
        },
      }
    );
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "required type 'Number' for value '\"880something89\"' at path phone"
    );
  });

  it("should return error for boolean", () => {
    const body = {
      isValid: "hello",
    };
    const bodySchema = {
      isValid: {
        type: Boolean,
      },
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "required type 'Boolean' for value '\"hello\"' at path isValid"
    );
  });

  it("should return error for array", () => {
    const body = {
      list: "hello",
    };
    const bodySchema = {
      list: [
        {
          type: Boolean,
        },
      ],
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "required type 'Array' for value '\"hello\"' at path list"
    );
  });

  it("should return error for invalid date", () => {
    const body = {
      createdAt: "test",
    };
    const bodySchema = {
      createdAt: {
        type: Date,
      },
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "required type 'Date' for value '\"test\"' at path createdAt"
    );
  });

  it("should return error for object", () => {
    const body = {
      address: {
        line: "test street 150",
      },
    };
    const bodySchema = {
      address: [
        {
          type: String,
        },
      ],
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "required type 'Array' for value '{\"line\":\"test street 150\"}' at path address"
    );
  });

  it("should return error for empty object", (): void => {
    const body = {
      address: {
        line: "test street 150",
      },
    };
    const bodySchema = {
      address: {},
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      'no schema definition found for value \'{"line":"test street 150"}\' at path address'
    );
  });

  it("should return error for empty array", () => {
    const body = {
      address: {
        line: "test street 150",
      },
    };
    const bodySchema = {
      address: [],
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      'no schema definition found for value \'{"line":"test street 150"}\' at path address'
    );
  });

  it("should return error for no schema definition at object with allowunknown false", () => {
    const bodySchema = {
      name: {
        type: String,
      },
      phone: { type: Number },
      isLoggedIn: { type: Boolean },
      address: {
        line: {
          add: [{ type: Number }],
        },
        city: { type: String },
        pincode: { type: Number },
      },
      list: [{ type: String }],
      createdAt: { type: Date },
    };
    const body = {
      name: "vasu",
      phone: 9876543210,
      address: {
        line: {
          add: [1],
        },
        street: "streetlk111",
        city: "city",
        pincode: 500005,
      },
      isLoggedIn: false,
      list: ["hello", "world"],
      createdAt: new Date(),
    };
    const error = validate(body, bodySchema, { allowUnknown: false });
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "no schema definition found for value '\"streetlk111\"' at path address.street"
    );
  });

  it("should return error for no schema definition at object with allowunknown true", () => {
    const config = { allowUnknown: true };
    const bodySchema = {
      name: {
        type: String,
        default: "helo",
      },
      phone: { type: Number },
      isLoggedIn: { type: Boolean },
      address: {
        line: {
          add: [{ type: Number }],
        },
        city: { type: String },
        pincode: { type: Number },
      },
      list: [{ type: String }],
      createdAt: { type: Date },
    };
    const body = {
      name: "vasu",
      phone: 9876543210,
      address: {
        line: {
          add: [1],
        },
        street: "streetlk111",
        city: "city",
        pincode: 500005,
      },
      isLoggedIn: false,
      list: ["hello", "world"],
      createdAt: new Date(),
    };
    const error = validate(body, bodySchema, config);
    expect(error).toBe(null);
  });

  it("should return error for array definiton", () => {
    const body = {
      address: ["hello world"],
    };
    const bodySchema = {
      address: { type: String },
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "required type 'String' for value '[\"hello world\"]' at path address"
    );
  });

  it("should return error for array definiton with empty declaration", () => {
    const body = {
      address: ["hello world"],
    };
    const bodySchema = {
      address: [],
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "no schema definition found for value '[\"hello world\"]' at path address"
    );
  });

  it("should return error for array definiton with invalid declaration", () => {
    const body = {
      address: ["hello world"],
    };
    const bodySchema = {
      address: [{ type: Number }],
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "required type 'Number' for value '\"hello world\"' at path address[0]"
    );
  });

  it("should return error no schema definiton", () => {
    class Student {
      name: string;
      constructor(name: string) {
        this.name = name;
      }
    }
    const body = {
      name: new Student("test"),
    };
    const bodySchema = {
      name: [{ type: Number }],
    };
    const error = validate(body, bodySchema);
    expect(error).not.toBe(null);
    expect(error?.message).toBe(
      "required type 'Array' for value '{\"name\":\"test\"}' at path name"
    );
  });
});
