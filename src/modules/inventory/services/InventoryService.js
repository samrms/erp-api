export class InventoryService {
  constructor(db, transactionManager) {
    this.db = db
    this.transactionManager = transactionManager
  }

  async adjust(productId, quantityChange, reason, referenceId) {
    return await this.transactionManager.run(async (tx) => {
      const inv = await tx.query(
        'SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE',
        [productId],
      )
      const current = inv.rows[0] ? parseInt(inv.rows[0].quantity, 10) : 0
      const newQty = current + quantityChange
      if (newQty < 0) throw new Error('Inventory cannot go negative')
      if (inv.rows[0]) {
        await tx.query(
          'UPDATE inventory SET quantity = $1, updated_at = now() WHERE product_id = $2',
          [newQty, productId],
        )
      } else {
        await tx.query(
          'INSERT INTO inventory (product_id, quantity) VALUES ($1, $2)',
          [productId, newQty],
        )
      }
      const type = quantityChange > 0 ? 'IN' : 'OUT'
      await tx.query(
        'INSERT INTO inventory_movements (product_id, type, quantity, reason, reference_id) VALUES ($1,$2,$3,$4,$5)',
        [
          productId,
          type,
          Math.abs(quantityChange),
          reason,
          referenceId || null,
        ],
      )
      return { productId, quantity: newQty }
    })
  }
}
