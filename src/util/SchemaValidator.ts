import { default as AjvConstructor, ErrorObject, ValidateFunction } from 'ajv'

class ValidationException extends Error {
    constructor(message: string, filename?: string) {
        if (filename) {
            super(`(at '${filename}') ${message}`)
        } else super(message)
    }
}

export default class SchemaValidator<S extends Record<string, unknown>> {
    private _validate: ValidateFunction

    constructor(schema: S) {
        this._validate = new AjvConstructor().compile(schema)
    }

    validate<T>(data: T, filename?: string): T {
        const valid = this._validate(data)

        if (!valid)
            throw new ValidationException(
                // CAST: If it's not valid, it's certainly ErrorObject[]
                (this._validate.errors as ErrorObject[]).join('\n'),
                filename
            )

        return data
    }
}
