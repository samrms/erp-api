import express from 'express'

export class HttpServer {
  constructor(app, port) {
    this.app = app
    this.port = port
    this.server = null
  }

  start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        resolve()
      })
    })
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => resolve())
      } else {
        resolve()
      }
    })
  }
}
