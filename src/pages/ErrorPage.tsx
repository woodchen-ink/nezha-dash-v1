import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

interface ErrorPageProps {
  code?: string | number
  message?: string
}

export default function ErrorPage({ code = "500", message }: ErrorPageProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-semibold">{code}</h1>
        <p className="text-xl text-muted-foreground">{message || t("error.somethingWentWrong")}</p>
        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            {t("error.tryAgain")}
          </Button>
          <Button onClick={() => navigate("/")} className="mt-2">
            {t("error.backToHome")}
          </Button>
        </div>
      </div>
    </div>
  )
}
