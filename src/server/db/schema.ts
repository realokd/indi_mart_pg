// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { StoredFile } from "@/types";
import { sql, relations } from "drizzle-orm";
import {
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
  pgEnum,
  integer,
  json,
  text
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const createTable = pgTableCreator((name) => `indi_mart_pg_${name}`);

export const statusEnum = pgEnum("status", ["INSERT", "DELETE", "UPDATE"]);
export const paymentEnum = pgEnum("paymentStatus", ["PAID", "NOT PAID"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 256 }),
  phone: varchar("phone", { length: 10 }).notNull().unique(),
  email: varchar("email", { length: 100 }).unique(),
  status: statusEnum("status").$default(() => "INSERT").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const userRelations = relations(users, ({ one, many }) => ({
  cart: one(carts, {
    fields: [users.id],
    references: [carts.userId],
  }),
  orders: many(orders),
  addresses: many(address),
}));

export const address = pgTable("addresses", {
  id: serial("id").primaryKey(),
  street: varchar("street", { length: 80 }).notNull(),
  city: varchar("city", { length: 30 }).notNull(),
  state: varchar("state", { length: 30 }).notNull(),
  pinCode: integer("pin_code").notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  status: statusEnum("status").$default(() => "INSERT").notNull(),
});

export const addressRelations = relations(address, ({ one, many }) => ({
  userId: one(users, {
    fields: [address.userId],
    references: [users.id],
  }),
}));

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 512 }),
  status: statusEnum("status").$default(() => "INSERT").notNull(),
});

// export const imageRelations = relations(images, ({ one, many }) => ({
//   userId: one(users, {
//     fields: [images.userId],
//     references: [users.id],
//   }),
//   categoryId: one(category, {
//     fields: [images.categoryId],
//     references: [category.id],
//     relationName: "category_images",
//   }),
//   productId: one(product, {
//     fields: [images.productId],
//     references: [product.id],
//     relationName: "product_images",
//   }),
// }));

export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  description: varchar("description", { length: 1000 }),
  image: text("image"),
  status: statusEnum("status").$default(() => "INSERT").notNull(),
});

export const categoryRelations = relations(category, ({ one, many }) => ({
  product: many(product, { relationName: "product_category" }),
  // images: many(images, { relationName: "category_images" }),
}));

export const product = pgTable("product", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 1000 }),
  images: json("images").$type<StoredFile[] | null>().default(null),
  video: text("video"),
  categoryId: integer("category_id").references(() => category.id, {
    onDelete: "cascade",
  }),
  price: integer("price").notNull().default(0),
  orignalPrice: integer("orignalPrice"),
  inventory: integer("inventory").$default(() => 0),
  status: statusEnum("status").$default(() => "INSERT").notNull(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
    relationName: "product_category",
  }),
  // images: many(images, { relationName: "product_images" }),
}));

// export const productPrice = pgTable("product_price", {
//   id: integer("id").primaryKey().autoincrement(),
//   // name: varchar("name", { length: 50 }),
//   productId: integer("product_id").references(() => dropdown.id),
//   price: integer("price"),
// });

// export const productPriceRelations = relations(
//   productPrice,
//   ({ one, many }) => ({
//     productId: one(dropdown, {
//       fields: [productPrice.productId],
//       references: [dropdown.id],
//     }),
//   }),
// );

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id),
  type: varchar("order_type", { length: 10 }),
  total: integer("total_value"),
  status: statusEnum("status").$default(() => "INSERT").notNull(),
  paymentStatus: paymentEnum('paymentStatus').$default(() => "NOT PAID"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  // updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const orderRelations = relations(orders, ({ one, many }) => ({
  customerId: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  details: many(orderDetails),
  payments: many(payments),
}));

export const orderDetails = pgTable("order_details", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => product.id),
  status: statusEnum("status").$default(() => "INSERT").notNull(),
  // productPrice: integer("product_price_id").references(() => productPrice.id),
  quantity: integer("quantity"),
});

export const orderDetailsRelations = relations(
  orderDetails,
  ({ one, many }) => ({
    orderId: one(orders, {
      fields: [orderDetails.orderId],
      references: [orders.id],
    }),
    productId: one(product, {
      fields: [orderDetails.productId],
      references: [product.id],
    }),
  }),
);

export const payments = pgTable('payments', {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  amount: integer('amount')
})

export const paymentsRelations = relations(
  payments,
  ({ one }) => ({
    orderId: one(orders, {
      fields: [payments.orderId],
      references: [orders.id],
    }),
  }),
);

export const carts = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  total: integer("total_value"),
  status: statusEnum("status").$default(() => "INSERT").notNull(),
});

export const cartRelations = relations(carts, ({ one, many }) => ({
  customerId: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
}));

export const cartDetails = pgTable("cart_details", {
  id: serial("id").primaryKey().notNull(),
  cartId: integer("cart_id").references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => product.id),
  // productPriceId: integer("product_price_id").references(() => productPrice.id),
  quantity: integer("quantity"),
  status: statusEnum("status").$default(() => "INSERT").notNull(),
});

export const cartDetailsRelations = relations(cartDetails, ({ one, many }) => ({
  cartId: one(orders, {
    fields: [cartDetails.cartId],
    references: [orders.id],
  }),
  productId: one(product, {
    fields: [cartDetails.productId],
    references: [product.id],
  }),
  // productPriceId: one(productPrice, {
  //   fields: [cartDetails.productPriceId],
  //   references: [productPrice.id],
  // }),
}));

