import { PublicNoteData, cn } from "@/lib/utils"

export default function PlanInfo({ parsedData }: { parsedData: PublicNoteData }) {
  if (!parsedData || !parsedData.planDataMod) {
    return null
  }

  const extraList =
    parsedData.planDataMod.extra.split(",").length > 1
      ? parsedData.planDataMod.extra.split(",")
      : parsedData.planDataMod.extra.split(",")[0] === ""
        ? []
        : [parsedData.planDataMod.extra]

  return (
    <section className="flex gap-1 items-center flex-wrap mt-0.5">
      {parsedData.planDataMod.bandwidth !== "" && (
        <p className={cn("text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 w-fit rounded px-1.5 py-0.5 font-medium")}>
          {parsedData.planDataMod.bandwidth}
        </p>
      )}
      {parsedData.planDataMod.trafficVol !== "" && (
        <p className={cn("text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 w-fit rounded px-1.5 py-0.5 font-medium")}>
          {parsedData.planDataMod.trafficVol}
        </p>
      )}
      {parsedData.planDataMod.IPv4 === "1" && (
        <p
          className={cn("text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 w-fit rounded px-1.5 py-0.5 font-medium")}
        >
          IPv4
        </p>
      )}
      {parsedData.planDataMod.IPv6 === "1" && (
        <p className={cn("text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 w-fit rounded px-1.5 py-0.5 font-medium")}>
          IPv6
        </p>
      )}
      {parsedData.planDataMod.networkRoute && (
        <p className={cn("text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 w-fit rounded px-1.5 py-0.5 font-medium")}>
          {parsedData.planDataMod.networkRoute.split(",").map((route, index) => {
            return route + (index === parsedData.planDataMod!.networkRoute.split(",").length - 1 ? "" : "｜")
          })}
        </p>
      )}
      {extraList.map((extra, index) => {
        return (
          <p
            key={index}
            className={cn("text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 w-fit rounded px-1.5 py-0.5 font-medium")}
          >
            {extra}
          </p>
        )
      })}
    </section>
  )
}
