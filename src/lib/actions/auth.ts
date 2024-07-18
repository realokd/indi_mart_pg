"use server"

import { db } from "@/server/db";
import { address, sessions, users } from "@/server/db/schema"
import bcrypt from "bcryptjs"
import type { UserInsert } from "@/server/db/types";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { buffer } from "stream/consumers";
import { decodeFromBase64, encodeToBase64 } from "../utils";
import { Phone } from "lucide-react";
import dayjs from "dayjs"

export async function signUp(data: Pick<UserInsert, "phone" | "password" | "fullName">) {
    const password = await bcrypt.hash(data.password, 10)

    const user = await db.query.users.findFirst({ columns: { id: true }, where: eq(users.phone, data.phone) })

    if (user) {
        throw new Error("User already exists.")
    }

    await db.insert(users).values({
        ...data,
        password
    })
}

export async function signIn(data: Pick<UserInsert, "phone" | "password">) {
    const user = await db.query.users
        .findFirst({ columns: { id: true, password: true }, where: eq(users.phone, data.phone) })
    if (!user) {
        throw new Error("User doesn't exist")
    }

    const userDetails = await db
        .select({
            fullName: users.fullName,
            phone: users.phone,
        })
        .from(users)
        .where(eq(users.id, user.id))

    let passwordMatched = false;
    bcrypt.compare(data.password, user?.password, (err, result) => {

        if (err) {
            return;
        }
        if (!result) {
            throw new Error("Invalid Credentials")
        }
        passwordMatched = result
        const encodedUser = encodeToBase64(userDetails)

        saveUserSession(encodedUser, user.id)

        cookies().set("sessionId", encodedUser)
    })

}

export async function logout(){
    const cookie = cookies().get("sessionId")?.value
    cookies().delete("sessionId")
    if (cookie)
      await db.delete(sessions).where(eq(sessions.sessionId, cookie))
}

async function saveUserSession(sessionId: string, userId: number) {
    try {        
        const session = await db.insert(sessions).values({
            sessionId: sessionId,
            expiryDate: dayjs().add(10, "seconds").toDate(),
            userId: userId,
        }).returning({ id: sessions.id });
        return session[0]?.id
    }
    catch (err) {
        throw new Error("Session cannot be saved")
    }
}