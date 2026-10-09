const DB_NAME = "ember-offline";
const DB_VERSION = 1;

type Table = "journal_entries" | "check_ins" | "chat_messages";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("journal_entries")) {
        db.createObjectStore("journal_entries", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("check_ins")) {
        db.createObjectStore("check_ins", { keyPath: "date" });
      }
      if (!db.objectStoreNames.contains("chat_messages")) {
        db.createObjectStore("chat_messages", { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function cacheRows(table: Table, rows: Record<string, unknown>[]): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await openDB();
    const tx = db.transaction(table, "readwrite");
    const store = tx.objectStore(table);
    store.clear();
    for (const row of rows) store.put(row);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* offline cache is best-effort */
  }
}

export async function getCachedRows<T>(table: Table): Promise<T[]> {
  if (typeof indexedDB === "undefined") return [];
  try {
    const db = await openDB();
    const tx = db.transaction(table, "readonly");
    const store = tx.objectStore(table);
    const result = await new Promise<T[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return result;
  } catch {
    return [];
  }
}

export async function appendCachedRow(table: Table, row: Record<string, unknown>): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await openDB();
    const tx = db.transaction(table, "readwrite");
    tx.objectStore(table).put(row);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* best-effort */
  }
}

export async function clearCachedTable(table: Table): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await openDB();
    const tx = db.transaction(table, "readwrite");
    tx.objectStore(table).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* best-effort */
  }
}

export async function isOnline(): Promise<boolean> {
  return navigator.onLine;
}
