"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
// import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { showErrorToast } from "@/lib/handle-error"
import { authSchema, signInSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { PasswordInput } from "@/components/password-input"
import { signIn } from "@/lib/actions/auth"

type Inputs = z.infer<typeof signInSchema>

export function SignInForm() {
  const router = useRouter()
  // const { isLoaded, signIn, setActive } = useSignIn()
  const [loading, setLoading] = React.useState(false)

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  })

  async function onSubmit(data: Inputs) {

    setLoading(true)

    try {
      const result = await signIn({
        phone: data.phone,
        password: data.password,
      })
      router.replace(`${window.location.origin}/?redirect=false`)
      // if (result.status === "complete") {
      //   // await setActive({ session: result.createdSessionId })

      //   router.push(`${window.location.origin}/`)
      // } else {
      //   /*Investigate why the login hasn't completed */
      //   console.log(result)
      // }
    } catch (err) {
      showErrorToast(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="rodneymullen180@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={false}>
          {loading && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form >
  )
}
