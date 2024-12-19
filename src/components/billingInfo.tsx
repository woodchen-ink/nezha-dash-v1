import { PublicNoteData, cn, getDaysBetweenDatesWithAutoRenewal } from "@/lib/utils"

import RemainPercentBar from "./RemainPercentBar"

export default function BillingInfo({ parsedData }: { parsedData: PublicNoteData }) {
  if (!parsedData || !parsedData.billingDataMod) {
    return null
  }

  let isNeverExpire = false
  let daysLeftObject = {
    days: 0,
    cycleLabel: "",
    remainingPercentage: 0,
  }

  if (parsedData?.billingDataMod?.endDate) {
    if (parsedData.billingDataMod.endDate.startsWith("0000-00-00")) {
      isNeverExpire = true
    } else {
      try {
        daysLeftObject = getDaysBetweenDatesWithAutoRenewal(parsedData.billingDataMod)
      } catch (error) {
        console.error(error)
        return <div className={cn("text-[10px] text-muted-foreground text-red-600")}>剩余时间: 计算出错</div>
      }
    }
  }

  return daysLeftObject.days >= 0 ? (
    <>
      <div className={cn("text-[10px] text-muted-foreground")}>剩余时间: {isNeverExpire ? "永久" : daysLeftObject.days + "天"}</div>
      {parsedData.billingDataMod.amount && parsedData.billingDataMod.amount !== "0" && parsedData.billingDataMod.amount !== "-1" ? (
        <p className={cn("text-[10px] text-muted-foreground ")}>
          价格: {parsedData.billingDataMod.amount}/{parsedData.billingDataMod.cycle}
        </p>
      ) : parsedData.billingDataMod.amount === "0" ? (
        <p className={cn("text-[10px] text-green-600 ")}>免费</p>
      ) : parsedData.billingDataMod.amount === "-1" ? (
        <p className={cn("text-[10px] text-pink-600 ")}>按量收费</p>
      ) : null}
      <RemainPercentBar className="mt-0.5" value={daysLeftObject.remainingPercentage * 100} />
    </>
  ) : (
    <>
      <p className={cn("text-[10px] text-muted-foreground text-red-600")}>已过期: {daysLeftObject.days * -1} 天</p>
      {parsedData.billingDataMod.amount && parsedData.billingDataMod.amount !== "0" && parsedData.billingDataMod.amount !== "-1" ? (
        <p className={cn("text-[10px] text-muted-foreground ")}>
          价格: {parsedData.billingDataMod.amount}/{parsedData.billingDataMod.cycle}
        </p>
      ) : parsedData.billingDataMod.amount === "0" ? (
        <p className={cn("text-[10px] text-green-600 ")}>免费</p>
      ) : parsedData.billingDataMod.amount === "-1" ? (
        <p className={cn("text-[10px] text-pink-600 ")}>按量收费</p>
      ) : null}
    </>
  )
}
