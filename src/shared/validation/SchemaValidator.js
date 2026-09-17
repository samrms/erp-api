export class SchemaValidator {
  static validate(schema, data) {
    const errors = []
    for (const [key, rules] of Object.entries(schema)) {
      const value = data[key]
      if (
        rules.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push({ field: key, message: 'Required' })
        continue
      }
      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          errors.push({ field: key, message: `Expected ${rules.type}` })
        }
        if (rules.min !== undefined && value < rules.min) {
          errors.push({ field: key, message: `Min ${rules.min}` })
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push({ field: key, message: `Max ${rules.max}` })
        }
        if (
          rules.minLength !== undefined &&
          String(value).length < rules.minLength
        ) {
          errors.push({ field: key, message: `Min length ${rules.minLength}` })
        }
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push({ field: key, message: `Invalid value` })
        }
      }
    }
    if (errors.length) {
      const err = new Error('Validation failed')
      err.details = errors
      err.code = 'VALIDATION_ERROR'
      err.statusCode = 422
      throw err
    }
  }
}
