import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/server/db"
import { product } from "@/server/db/schema"
import { count, countDistinct, eq } from "drizzle-orm"
import { resolve } from "path"
import { rejects } from "assert"
import { cookies } from "next/headers"
import { decodeFromBase64 } from "../utils"


/**
 * Cache is used with a data-fetching function like fetch to share a data snapshot between components.
 * It ensures a single request is made for multiple identical data fetches, with the returned data cached and shared across components during the server render.
 * @see https://react.dev/reference/react/cache#reference
 */
// export const getCachedUser = cache(currentUser)
export const getCachedUser = () => {
  const cookie = cookies().get("sessionId")?.value
  let user;
  if (cookie)
    user = decodeFromBase64(cookie)
  return Promise.resolve(user)
}


