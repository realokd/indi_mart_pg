import "server-only"

import { category, product } from "@/server/db/schema"
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from "next/cache"
import { count, desc, eq } from "drizzle-orm"
import { db } from "@/server/db"

export async function getCategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: category.id,
          name: category.name,
          description: category.description,
          image: category.image,
        })
        .from(category)
        .orderBy(desc(category.name))
    },
    ["category"],
    {
      revalidate: 3600, // every hour
      tags: ["category"],
    }
  )()
}

export async function getAllProducts() {
  return await cache(
    async () => {
      return db
        .select({
          id: product.id,
          name: product.name,
          images: product.images,
          category: category.name,
          price: product.price,
          inventory: product.inventory,
        })
        .from(product)
        .limit(8)
        .leftJoin(category, eq(product.categoryId, category.id))
        .where(eq(product.status, "INSERT"))
        .groupBy(product.id, category.name)
      // .orderBy(
      //   desc(count(stores.stripeAccountId)),
      //   desc(count(product.images)),
      //   desc(product.createdAt)
      // )
    },
    ["product"],
    {
      revalidate: 3600, // every hour
      tags: ["featured-product"],
    }
  )()
}

export async function getProductCountByCategory({
  categoryId,
}: {
  categoryId: number
}) {
  return await cache(
    async () => {
      return db
        .select({
          count: count(product.id),
        })
        .from(product)
        .where(eq(product.categoryId, categoryId))
        .execute()
        .then((res) => res[0]?.count ?? 0)
    },
    [`product-count-${categoryId}`],
    {
      revalidate: 3600, // every hour
      tags: [`product-count-${categoryId}`],
    }
  )()
}