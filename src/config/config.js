export class Config {
  constructor() {
    this.nodeEnv = process.env.NODE_ENV || 'development'
    this.port = parseInt(process.env.PORT || '3000', 10)
    this.databaseUrl = process.env.DATABASE_URL
    this.databaseUrlTest = process.env.DATABASE_URL_TEST
    this.jwtSecret = process.env.JWT_SECRET
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m'
    this.corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
    this.rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10)
    this.rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX || '100', 10)

    this.validate()
  }

  validate() {
    const required = ['jwtSecret', 'databaseUrl']
    for (const key of required) {
      if (!this[key]) {
        throw new Error(`Missing required config: ${key}`)
      }
    }
    if (this.jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters')
    }
  }
}
