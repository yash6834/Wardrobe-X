import { dbPromise } from "../db/db";

export const addToCartOffline = async (item) => {
  const db = await dbPromise;
  const id = `${item.productId}-${item.size}`;

  // CHECK IF ITEM ALREADY EXISTS
  const existing = await db.get("cart", id);

  if (existing) {
    // INCREASE quantity
    existing.quantity += item.quantity;
    await db.put("cart", existing);
  } else {
    // CREATE NEW
    await db.put("cart", {
      id,
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
    });
  }
};

// NEW: Helper to get all items for syncing
export const getOfflineCart = async () => {
  const db = await dbPromise;
  return await db.getAll("cart");
};

// NEW: Helper to clear the store after syncing
export const clearOfflineCartStore = async () => {
  const db = await dbPromise;
  await db.clear("cart");
};