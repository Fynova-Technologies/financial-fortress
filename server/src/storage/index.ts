// exports storage instance + types

export * from "./types.js";
export { DatabaseStorage } from "./databaseStorage.js";
export { MemStorage } from "./memStorage.js";

import { DatabaseStorage } from "./databaseStorage.js";
import { MemStorage } from "./memStorage.js";

export const storage = process.env.NODE_ENV === "production"
  ? new DatabaseStorage()
  : new MemStorage();

export default storage;
