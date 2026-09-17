import { Sale } from '../models/Sale.js'
import { SaleItem } from '../models/SaleItem.js'

export class SaleService {
  constructor(db, transactionManager, inventoryService) {
    this.db = db
    this.transactionManager = transactionManager
    this.inventoryService = inventoryService
  }

  async createSale(customerId, userId, items) {
    return await this.transactionManager.run(async (tx) => {
      // Validate customer exists and active
      const customerRes = await tx.query(
        'SELECT * FROM customers WHERE id = $1',
        [customerId],
      )
      if (!customerRes.rows[0]) throw new Error('Customer not found')
      if (!customerRes.rows[0].active) throw new Error('Customer inactive')

      let total = 0
      const saleItems = []
      for (const item of items) {
        const productRes = await tx.query(
          'SELECT * FROM products WHERE id = $1 FOR UPDATE',
          [item.productId],
        )
        if (!productRes.rows[0]) throw new Error('Product not found')
        if (!productRes.rows[0].active) throw new Error('Product inactive')

        const invRes = await tx.query(
          'SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE',
          [item.productId],
        )
        const currentQty = invRes.rows[0]
          ? parseInt(invRes.rows[0].quantity, 10)
          : 0
        if (currentQty < item.quantity)
          throw new Error('Insufficient inventory')

        const unitPrice = parseFloat(productRes.rows[0].price)
        const subtotal = unitPrice * item.quantity
        total += subtotal
        saleItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        })
      }

      const saleRes = await tx.query(
        'INSERT INTO sales (customer_id, user_id, total) VALUES ($1,$2,$3) RETURNING *',
        [customerId, userId || null, total],
      )
      const sale = saleRes.rows[0]

      for (const item of saleItems) {
        await tx.query(
          'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES ($1,$2,$3,$4,$5)',
          [
            sale.id,
            item.productId,
            item.quantity,
            item.unitPrice,
            item.subtotal,
          ],
        )
        await tx.query(
          'UPDATE inventory SET quantity = quantity - $1, updated_at = now() WHERE product_id = $2',
          [item.quantity, item.productId],
        )
        await tx.query(
          "INSERT INTO inventory_movements (product_id, type, quantity, reason, reference_id) VALUES ($1, 'OUT', $2, 'Sale', $3)",
          [item.productId, item.quantity, sale.id],
        )
      }

      return new Sale(sale)
    })
  }
}
