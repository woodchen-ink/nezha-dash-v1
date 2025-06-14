import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import { DashCommand } from "./components/DashCommand"
import ErrorBoundary from "./components/ErrorBoundary"
import Footer from "./components/Footer"
import Header, { RefreshToast } from "./components/Header"
import { useBackground } from "./hooks/use-background"
import { useTheme } from "./hooks/use-theme"
import { InjectContext } from "./lib/inject"
import { fetchSetting } from "./lib/nezha-api"
import { cn } from "./lib/utils"
import ErrorPage from "./pages/ErrorPage"
import NotFound from "./pages/NotFound"
import Server from "./pages/Server"
import ServerDetail from "./pages/ServerDetail"

const App: React.FC = () => {
  const { data: settingData, error } = useQuery({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
  const { setTheme } = useTheme()
  const [isCustomCodeInjected, setIsCustomCodeInjected] = useState(false)
  const { backgroundImage: customBackgroundImage } = useBackground()

  useEffect(() => {
    if (settingData?.data?.config?.custom_code) {
      InjectContext(settingData?.data?.config?.custom_code)
      setIsCustomCodeInjected(true)
    }
  }, [settingData?.data?.config?.custom_code])

  // 检测是否强制指定了主题颜色
  const forceTheme =
    // @ts-expect-error ForceTheme is a global variable
    (window.ForceTheme as string) !== "" ? window.ForceTheme : undefined

  useEffect(() => {
    if (forceTheme === "dark" || forceTheme === "light") {
      setTheme(forceTheme)
    }
  }, [forceTheme])

  if (error) {
    return <ErrorPage code={500} message={error.message} />
  }

  if (!settingData) {
    return null
  }

  if (settingData?.data?.config?.custom_code && !isCustomCodeInjected) {
    return null
  }

  const customMobileBackgroundImage = window.CustomMobileBackgroundImage !== "" ? window.CustomMobileBackgroundImage : undefined

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        {/* 固定定位的背景层 */}
        {customBackgroundImage && (
          <div
            className={cn("fixed inset-0 z-0 bg-cover min-h-lvh bg-no-repeat bg-center dark:brightness-75", {
              "hidden sm:block": customMobileBackgroundImage,
            })}
            style={{ backgroundImage: `url(${customBackgroundImage})` }}
          />
        )}
        {customMobileBackgroundImage && (
          <div
            className={cn("fixed inset-0 z-0 bg-cover min-h-lvh bg-no-repeat bg-center sm:hidden dark:brightness-75")}
            style={{ backgroundImage: `url(${customMobileBackgroundImage})` }}
          />
        )}
        <div
          className={cn("flex min-h-screen w-full flex-col", {
            "bg-background": !customBackgroundImage,
          })}
        >
          <main className="flex z-20 min-h-[calc(100vh-calc(var(--spacing)*8))] flex-1 flex-col gap-2 p-2 md:p-6 md:pt-4">
            <RefreshToast />
            <Header />
            <DashCommand />
            <Routes>
              <Route path="/" element={<Server />} />
              <Route path="/server/:id" element={<ServerDetail />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </main>
        </div>
      </ErrorBoundary>
    </Router>
  )
}

export default App
