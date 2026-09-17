export function generateInventory(count = 10) { return Array.from({ length: count }, (_, i) => ({ id: i + 1 })); }
