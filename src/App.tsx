import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import { DashCommand } from "./components/DashCommand"
import ErrorBoundary from "./components/ErrorBoundary"
import Footer from "./components/Footer"
import Header, { RefreshToast } from "./components/Header"
import { useTheme } from "./hooks/use-theme"
import { InjectContext } from "./lib/inject"
import { fetchSetting } from "./lib/nezha-api"
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

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <div className="relative min-h-screen">
          {/* 固定定位的背景层 */}
          <div
            className="fixed inset-0 bg-cover bg-no-repeat bg-center dark:brightness-75"
            style={{ 
              backgroundImage: `url(https://random-api.czl.net/pic/normal)`,
              zIndex: -1
            }}
          />

          <main className="relative flex min-h-screen flex-col gap-2 p-2 md:p-6 md:pt-4 bg-transparent">
            <RefreshToast />
            <Header />
            <DashCommand />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Server />} />
                <Route path="/server/:id" element={<ServerDetail />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </main>
        </div>
      </ErrorBoundary>
    </Router>
  )
}

export default App
