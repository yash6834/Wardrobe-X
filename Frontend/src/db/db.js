import { openDB } from "idb";

export const dbPromise = openDB("app-db", 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("cart")) {
      db.createObjectStore("cart", { keyPath: "id" });
    }

    if (!db.objectStoreNames.contains("products")) {
      db.createObjectStore("products", { keyPath: "_id" });
    }
  },
});