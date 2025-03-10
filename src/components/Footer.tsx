import React from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { fetchSetting } from "../lib/nezha-api"

const Footer: React.FC = () => {
  const { t } = useTranslation()
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent)

  const { data: settingData } = useQuery({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  return (
    <footer className="mx-auto w-full max-w-screen-xl px-4 lg:px-0 pb-4 server-footer">
      <section className="flex flex-col">
        <section className="mt-1 flex items-center sm:flex-row flex-col justify-between gap-2 text-[13px] font-light tracking-tight text-neutral-600/50 dark:text-neutral-300/50 server-footer-name">
          <div className="flex items-center gap-1">
            &copy;2020-{new Date().getFullYear()}{" "}
            <a href={"https://czl.net"} target="_blank">
              CZL LTD
            </a>
          </div>
          <div className="server-footer-theme flex flex-col items-center sm:items-end">
            <p className="mt-1 text-[13px] font-light tracking-tight text-neutral-600/50 dark:text-neutral-300/50">
              <kbd className="pointer-events-none mx-1 inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </p>
            <p className="server-footer-theme">
           All Rights Reserved
            </p>
          </div>
        </section>
      </section>
    </footer>
  )
}

export default Footer
