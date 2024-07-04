import * as schema from "./schema"

export type Product = typeof schema.product.$inferSelect
export type Category = typeof schema.category.$inferSelect
