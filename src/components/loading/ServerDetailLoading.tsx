import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"

import { BackIcon } from "../Icon"

export function ServerDetailChartLoading() {
  return (
    <div>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3">
        <Skeleton className="h-[182px] w-full rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
        <Skeleton className="h-[182px] w-full rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
        <Skeleton className="h-[182px] w-full rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
        <Skeleton className="h-[182px] w-full rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
        <Skeleton className="h-[182px] w-full rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
        <Skeleton className="h-[182px] w-full rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
      </section>
    </div>
  )
}

export function ServerDetailLoading() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-5xl px-0">
      <div
        onClick={() => {
          navigate("/")
        }}
        className="flex flex-none cursor-pointer font-semibold leading-none items-center break-all tracking-tight gap-0.5 text-xl"
      >
        <BackIcon />
        <Skeleton className="h-[20px] w-24 rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
      </div>
      <Skeleton className="flex flex-wrap gap-2 h-[81px] w-1/2 mt-3 rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
    </div>
  )
}
