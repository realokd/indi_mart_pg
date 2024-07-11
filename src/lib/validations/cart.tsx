import * as z from "zod"


export const cartLineItemSchema = z.object({
    id: z.number(),
    name: z.string(),
    images: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          url: z.string(),
        })
      )
      .optional()
      .nullable(),
    category: z.string().optional().nullable(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/),
    inventory: z.number().default(0),
    quantity: z.number(),
  })

  export type CartLineItemSchema = z.infer<typeof cartLineItemSchema>
