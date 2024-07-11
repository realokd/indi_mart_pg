"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { db } from "@/server/db"
import { cartDetails, carts, category, product } from "@/server/db/schema"
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"

import { getErrorMessage } from "@/lib/handle-error"

export async function getCart(userId: number) {
  try {
    const cartId = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    })

    const cartItems = await db.select({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      inventory: product.inventory,
      quantity: cartDetails.quantity,
      category: category.name,
    })
      .from(cartDetails)
      .leftJoin(product, eq(product.id, cartDetails.productId))
      .leftJoin(category, eq(category.id, product.categoryId))
      .where(eq(carts.userId, userId))

    return cartItems
  } catch (err) {
    return []
  }
}
