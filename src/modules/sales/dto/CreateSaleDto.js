export class CreateSaleDto {
  constructor({ customerId, items } = {}) {
    this.customerId = customerId;
    this.items = (items || []).map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  }
}
