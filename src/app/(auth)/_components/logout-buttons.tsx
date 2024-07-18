"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {logout} from "@/lib/actions/auth"
export function LogOutButtons() {
  const router = useRouter()
  const mounted = useMounted()

  const logoutBtn = async () => {

    await logout()
    router.push("/")
  }

  return (
    <div className="flex w-full flex-col-reverse items-center gap-2 sm:flex-row">
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
      >
        Go back
        <span className="sr-only">Previous page</span>
      </Button>
      {mounted ? (
        // <SignOutButton
        //   redirectUrl={`${window.location.origin}/?redirect=false`}
        // >
        <Button size="sm" className="w-full" onClick={logoutBtn}>
          Log out
          <span className="sr-only">Log out</span>
        </Button>
      ) : (
      <Skeleton
        className={cn(
          buttonVariants({ size: "sm" }),
          "w-full bg-muted text-muted-foreground"
        )}
      >
        Log out
      </Skeleton>
      )}
    </div>
  )
}
