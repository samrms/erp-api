export class RateLimiter {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs * 60 * 1000 // minutes to ms
    this.maxRequests = maxRequests
    this.store = new Map()
  }

  middleware(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown'
    const now = Date.now()
    const key = ip + req.path
    const record = this.store.get(key) || {
      count: 0,
      resetTime: now + this.windowMs,
    }
    if (now > record.resetTime) {
      record.count = 1
      record.resetTime = now + this.windowMs
    } else {
      record.count += 1
    }
    this.store.set(key, record)
    if (record.count > this.maxRequests) {
      return res
        .status(429)
        .json({
          error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' },
        })
    }
    next()
  }
}
