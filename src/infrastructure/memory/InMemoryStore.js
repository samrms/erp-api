import { randomUUID } from "node:crypto";

export class InMemoryStore {
  constructor() {
    this.users = [];
    this.roles = [];
    this.permissions = [];
    this.userRoles = [];
    this.rolePermissions = [];
    this.products = [];
    this.customers = [];
    this.suppliers = [];
    this.inventory = [];
    this.inventoryMovements = [];
    this.sales = [];
    this.saleItems = [];
    this.jobs = [];
    this._idCounters = {};
  }

  _nextId(table) {
    this._idCounters[table] = (this._idCounters[table] || 0) + 1;
    return this._idCounters[table];
  }

  _uuid() {
    return randomUUID();
  }

  _now() {
    return new Date();
  }
}
