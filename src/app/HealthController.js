export class HealthController {
  constructor() {
    this.check = (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() })
    }
  }
}
