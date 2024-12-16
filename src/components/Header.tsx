import { ModeToggle } from "@/components/ThemeSwitcher"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchLoginUser, fetchSetting } from "@/lib/nezha-api"
import { useQuery } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { LanguageSwitcher } from "./LanguageSwitcher"

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: settingData, isLoading } = useQuery({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  const siteName = settingData?.data?.site_name

  // @ts-expect-error CustomLogo is a global variable
  const customLogo = window.CustomLogo || "/apple-touch-icon.png"

  // @ts-expect-error CustomDesc is a global variable
  const customDesc = window.CustomDesc || t("nezha")

  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link")
    // @ts-expect-error set link.type
    link.type = "image/x-icon"
    // @ts-expect-error set link.rel
    link.rel = "shortcut icon"
    // @ts-expect-error set link.href
    link.href = customLogo
    document.getElementsByTagName("head")[0].appendChild(link)
  }, [customLogo])

  useEffect(() => {
    document.title = siteName || "哪吒监控 Nezha Monitoring"
  }, [siteName])

  return (
    <div className="mx-auto w-full max-w-5xl">
      <section className="flex items-center justify-between">
        <section
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center text-base font-medium"
        >
          <div className="mr-1 flex flex-row items-center justify-start">
            <img
              width={40}
              height={40}
              alt="apple-touch-icon"
              src={customLogo}
              className="relative m-0! border-2 border-transparent h-6 w-6 object-cover object-top p-0!"
            />
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-20 rounded-[5px] bg-muted-foreground/10 animate-none" />
          ) : (
            siteName || "NEZHA"
          )}
          <Separator orientation="vertical" className="mx-2 hidden h-4 w-[1px] md:block" />
          <p className="hidden text-sm font-medium opacity-40 md:block">{customDesc}</p>
        </section>
        <section className="flex items-center gap-2">
          <DashboardLink />
          <LanguageSwitcher />
          <ModeToggle />
        </section>
      </section>
      <Overview />
    </div>
  )
}

function DashboardLink() {
  const { t } = useTranslation()
  const { data: userData } = useQuery({
    queryKey: ["login-user"],
    queryFn: () => fetchLoginUser(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  return (
    <div className="flex items-center gap-2">
      <a
        href={"/dashboard"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm font-medium opacity-50 transition-opacity hover:opacity-100"
      >
        {!userData?.data?.id && t("login")}
        {userData?.data?.id && t("dashboard")}
      </a>
    </div>
  )
}

// https://github.com/streamich/react-use/blob/master/src/useInterval.ts
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(() => {})
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current(), delay || 0)
      return () => clearInterval(interval)
    }
    return undefined
  }, [delay])
}
function Overview() {
  const { t } = useTranslation()
  const [mouted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const timeOption = DateTime.TIME_SIMPLE
  timeOption.hour12 = true
  const [timeString, setTimeString] = useState(
    DateTime.now().setLocale("en-US").toLocaleString(timeOption),
  )
  useInterval(() => {
    setTimeString(DateTime.now().setLocale("en-US").toLocaleString(timeOption))
  }, 1000)
  return (
    <section className={"mt-10 flex flex-col md:mt-16"}>
      <p className="text-base font-semibold">👋 {t("overview")}</p>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium opacity-50">{t("whereTheTimeIs")}</p>
        {mouted ? (
          <p className="text-sm font-medium">{timeString}</p>
        ) : (
          <Skeleton className="h-[20px] w-[50px] rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
        )}
      </div>
    </section>
  )
}
export default Header
