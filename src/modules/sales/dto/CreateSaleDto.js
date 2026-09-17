export class CreateSaleDto {
  constructor({ customerId, items }) {
    this.customerId = customerId; this.items = items;
  }
}
