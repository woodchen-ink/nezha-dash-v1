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

  // 使用一个唯一的ID来确保各个组件的layoutId不会冲突
  const layoutIdPrefix = isCountrySwitch ? "country-switch-" : "tab-switch-"

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

  // 当tabs变化时更新tagRefs
  useEffect(() => {
    tagRefs.current = tabs.map(() => createRef<HTMLDivElement>())
  }, [tabs])

  // 处理选中标签的滚动逻辑
  useEffect(() => {
    const currentTagIndex = tabs.indexOf(currentTab)
    if (currentTagIndex === -1) return // 如果当前选中的标签不在tabs中，不执行滚动

    const currentTagRef = tagRefs.current[currentTagIndex]
    if (currentTagRef && currentTagRef.current) {
      currentTagRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [currentTab, tabs])

  const handleTabClick = (tab: string) => {
    if (tab === currentTab) return; // 如果点击的是当前选中的标签，不执行操作
    setCurrentTab(tab)
  }

  return (
    <div className={cn(
      "scrollbar-hidden z-50 flex flex-col items-start overflow-x-scroll rounded-[50px]",
      isCountrySwitch ? "border-l border-stone-200 dark:border-stone-700 ml-1 pl-1" : ""
    )} ref={scrollRef}>
      <div
        className={cn("flex items-center gap-1 rounded-[50px] bg-stone-100 p-[3px] dark:bg-stone-800", {
          "bg-stone-100/70 dark:bg-stone-800/70": customBackgroundImage,
        })}
      >
        {tabs.map((tab: string, index: number) => (
          <div
            key={isCountrySwitch ? `country-${tab}` : `group-${tab}`}
            ref={tagRefs.current[index]}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "relative cursor-pointer rounded-3xl px-2.5 py-[8px] text-[13px] font-[600] transition-all duration-500",
              currentTab === tab ? "text-black dark:text-white" : "text-stone-400 dark:text-stone-500",
            )}
          >
            {currentTab === tab && (
              <m.div
                layoutId={`${layoutIdPrefix}${isCountrySwitch ? 'country-' : 'group-'}${tab}`}
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
