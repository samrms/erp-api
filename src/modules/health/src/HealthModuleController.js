export class HealthModuleController {
  constructor() {
    this.getHealth = (req, res) => res.json({ status: 'ok', modules: 'loaded' })
    this.getHealth = this.getHealth.bind(this)
  }
}
