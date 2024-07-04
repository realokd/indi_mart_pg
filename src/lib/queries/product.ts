import "server-only"

import { category } from "@/server/db/schema"
import {
    unstable_cache as cache,
    unstable_noStore as noStore,
  } from "next/cache"
  import { desc } from "drizzle-orm"
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