export class SaleItem {
  constructor({ id, saleId, productId, quantity, unitPrice, subtotal }) {
    this.id = id
    this.saleId = saleId
    this.productId = productId
    this.quantity = quantity
    this.unitPrice = unitPrice
    this.subtotal = subtotal
  }
  getSubtotal() {
    return this.quantity * this.unitPrice
  }
}
