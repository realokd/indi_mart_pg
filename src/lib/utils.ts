import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  opts: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: opts.currency ?? "USD",
    notation: opts.notation ?? "compact",
    ...opts,
  }).format(Number(price))
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}


export function isMacOs() {
  if (typeof window === "undefined") return false

  return window.navigator.userAgent.includes("Mac")
}

export function encodeToBase64(data: object) {
  let bufferObj = Buffer.from(JSON.stringify(data), "utf8");
  return bufferObj.toString("base64")
}

export function decodeFromBase64(data: string) {
  let bufferObj = Buffer.from(data, "base64");
  return JSON.parse(bufferObj.toString("utf8"))
}