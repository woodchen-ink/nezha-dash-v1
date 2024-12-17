import { useQuery } from "@tanstack/react-query"
import React, {  useEffect } from "react"
import { useTranslation } from "react-i18next"
import {InjectContext} from "./lib/inject"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import Footer from "./components/Footer"
import Header from "./components/Header"
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
  const { i18n } = useTranslation()


  useEffect(() => {
    if (settingData?.data?.custom_code) {
      InjectContext(settingData?.data?.custom_code)
    }
  }, [settingData?.data?.custom_code])

  if (error) {
    return <ErrorPage code={500} message={error.message} />
  }

  if (!settingData) {
    return null
  }

  if (settingData?.data?.language && !localStorage.getItem("language")) {
    i18n.changeLanguage(settingData?.data?.language)
  }

  const customBackgroundImage =
    // @ts-expect-error ShowNetTransfer is a global variable
    (window.CustomBackgroundImage as string) !== "" ? window.CustomBackgroundImage : undefined

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div
        className={cn(
          "flex min-h-screen w-full flex-col bg-cover bg-no-repeat bg-center bg-fixed",
          {
            "bg-background": !customBackgroundImage,
          },
        )}
        style={{
          backgroundImage: customBackgroundImage ? `url(${customBackgroundImage})` : undefined,
        }}
      >
        <main className="flex min-h-[calc(100vh-calc(var(--spacing)*16))] flex-1 flex-col gap-4 p-4 md:p-10 md:pt-8">
          <Header />
          <Routes>
            <Route path="/" element={<Server />} />
            <Route path="/server/:id" element={<ServerDetail />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  )
}

export default App
