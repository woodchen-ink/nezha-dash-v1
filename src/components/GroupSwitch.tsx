import { cn } from "@/lib/utils"
import { m } from "framer-motion"
import { createRef, useEffect, useRef, useState } from "react"
import ServerFlag from "@/components/ServerFlag"

export default function GroupSwitch({
  tabs,
  currentTab,
  setCurrentTab,
  isCountrySwitch = false
}: {
  tabs: string[]
  currentTab: string
  setCurrentTab: (tab: string) => void
  isCountrySwitch?: boolean
}) {
  const customBackgroundImage = (window.CustomBackgroundImage as string) !== "" ? window.CustomBackgroundImage : undefined
  const [isDarkMode, setIsDarkMode] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const tagRefs = useRef(tabs.map(() => createRef<HTMLDivElement>()))

  useEffect(() => {
    // 检测暗黑模式
    setIsDarkMode(document.documentElement.classList.contains('dark'))
    
    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const isOverflowing = container.scrollWidth > container.clientWidth
    if (!isOverflowing) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      container.scrollLeft += e.deltaY
    }

    container.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", onWheel)
    }
  }, [])

  useEffect(() => {
    const storageKey = isCountrySwitch ? "selectedCountry" : "selectedGroup"
    const savedValue = sessionStorage.getItem(storageKey)
    if (savedValue && tabs.includes(savedValue)) {
      setCurrentTab(savedValue)
    }
  }, [tabs, setCurrentTab, isCountrySwitch])

  useEffect(() => {
    const currentTagRef = tagRefs.current[tabs.indexOf(currentTab)]

    if (currentTagRef && currentTagRef.current) {
      currentTagRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [currentTab, tabs])

  return (
    <div ref={scrollRef} className="scrollbar-hidden z-50 flex flex-col items-start overflow-x-scroll rounded-[50px]">
      <div
        className={cn("flex items-center gap-1 rounded-[50px] bg-stone-100 p-[3px] dark:bg-stone-800", {
          "bg-stone-100/70 dark:bg-stone-800/70": customBackgroundImage,
        })}
      >
        {tabs.map((tab: string, index: number) => (
          <div
            key={tab}
            ref={tagRefs.current[index]}
            onClick={() => setCurrentTab(tab)}
            className={cn(
              "relative cursor-pointer rounded-3xl px-2.5 py-[8px] text-[13px] font-[600] transition-all duration-500",
              currentTab === tab ? "text-black dark:text-white" : "text-stone-400 dark:text-stone-500",
            )}
          >
            {currentTab === tab && (
              <m.div
                layoutId={isCountrySwitch ? "country-switch" : "tab-switch"}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  height: "100%",
                  width: "100%",
                  backgroundColor: isDarkMode ? "rgb(68 64 60)" : "white", // bg-stone-700 : white
                  boxShadow: isDarkMode ? "0 1px 3px 0 rgba(255, 255, 255, 0.05)" : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                  originY: "0px",
                  borderRadius: 46,
                }}
              />
            )}
            <div className="relative z-20 flex items-center gap-1">
              {isCountrySwitch && tab !== "All" && <ServerFlag country_code={tab.toLowerCase()} className="text-[10px]" />}
              <p className="whitespace-nowrap">{tab}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
