import * as schema from "./schema"

export type Product = typeof schema.product.$inferSelect
export type Category = typeof schema.category.$inferSelect
export type User = typeof schema.users.$inferSelect
export type UserInsert = typeof schema.users.$inferInsert
