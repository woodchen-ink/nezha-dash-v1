import { useRegisterSW } from "virtual:pwa-register/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

function ReloadPrompt() {
  const { t } = useTranslation();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl) {
      console.log(
        `SW Registered: ${swUrl} (Version: ${import.meta.env.VITE_GIT_HASH})`,
      );
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onOfflineReady() {
      toast.success(t("pwa.offlineReady"));
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  const update = () => {
    updateServiceWorker(true);
  };

  if (!needRefresh) {
    return null;
  }

  toast.message(`${t("pwa.newContent")} (${import.meta.env.VITE_GIT_HASH})`, {
    action: {
      label: t("pwa.reload"),
      onClick: () => update(),
    },
    onDismiss: close,
    duration: Infinity,
  });

  return null;
}

export default ReloadPrompt;
