import { BaseService } from '../../../shared/http/BaseService.js'
import { BusinessRuleError } from '../../../shared/errors/BusinessRuleError.js'
export class SaleService extends BaseService {
  constructor(saleRepo, inventoryRepo, transactionManager, productRepo) {
    super()
    this.saleRepo = saleRepo
    this.inventoryRepo = inventoryRepo
    this.transactionManager = transactionManager
    this.productRepo = productRepo
  }

  async create({ customerId, items }) {
    return this.transactionManager.run(async (client) => {
      let total = 0
      for (const item of items) {
        const product = await this.productRepo.findById(item.productId)
        if (!product)
          throw new BusinessRuleError(`Product ${item.productId} not found`)
        const stock = await this.inventoryRepo.getStock(item.productId)
        if (stock < item.quantity)
          throw new BusinessRuleError(`Insufficient stock for ${product.name}`)
        await this.inventoryRepo.deductStock(
          item.productId,
          item.quantity,
          client,
        )
        const subtotal = item.quantity * Number(product.price)
        total += subtotal
        await this.inventoryRepo.createMovement(
          {
            productId: item.productId,
            quantity: -item.quantity,
            movementType: 'sale',
            reason: `Sale item`,
          },
          client,
        )
      }
      const sale = await this.saleRepo.create(
        { customerId, totalAmount: total },
        client,
      )
      for (const item of items) {
        const product = await this.productRepo.findById(item.productId)
        await this.saleRepo.createItem(
          {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
            subtotal: item.quantity * Number(product.price),
          },
          client,
        )
      }
      return sale
    })
  }

  async findById(id) {
    return this.saleRepo.findById(id)
  }
  async findAll(query) {
    return this.saleRepo.findAll(query)
  }
}
