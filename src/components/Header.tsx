import { ModeToggle } from "@/components/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchLoginUser, fetchSetting } from "@/lib/nezha-api";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useEffect, useRef, useState, useCallback } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: settingData, isLoading } = useQuery({
    queryKey: ["setting"],
    queryFn: () => fetchSetting(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const siteName = settingData?.data?.site_name;

  const InjectContext = useCallback((content: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    const handlers: { [key: string]: (element: HTMLElement) => void } = {
      SCRIPT: (element) => {
        const script = document.createElement("script");
        if ((element as HTMLScriptElement).src) {
          script.src = (element as HTMLScriptElement).src;
        } else {
          script.textContent = element.textContent;
        }
        document.body.appendChild(script);
      },
      STYLE: (element) => {
        const style = document.createElement("style");
        style.textContent = element.textContent;
        document.head.appendChild(style);
      },
      DEFAULT: (element) => {
        document.body.appendChild(element);
      },
    };

    Array.from(tempDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        (handlers[element.tagName] || handlers.DEFAULT)(element);
      } else if (node.nodeType === Node.TEXT_NODE) {
        document.body.appendChild(
          document.createTextNode(node.textContent || ""),
        );
      }
    });
  }, []);

  useEffect(() => {
    document.title = siteName || "NEZHA";
  }, [siteName]);

  useEffect(() => {
    if (settingData?.data?.custom_code) {
      InjectContext(settingData?.data?.custom_code);
    }
  }, [settingData?.data?.custom_code]);

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
              src={"/apple-touch-icon.png"}
              className="relative m-0! border-2 border-transparent h-6 w-6 object-cover object-top p-0!"
            />
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-20 rounded-[5px] bg-muted-foreground/10 animate-none" />
          ) : (
            siteName || "NEZHA"
          )}
          <Separator
            orientation="vertical"
            className="mx-2 hidden h-4 w-[1px] md:block"
          />
          <p className="hidden text-sm font-medium opacity-40 md:block">
            {t("nezha")}
          </p>
        </section>
        <section className="flex items-center gap-2">
          <DashboardLink />
          <LanguageSwitcher />
          <ModeToggle />
        </section>
      </section>
      <Overview />
    </div>
  );
}

function DashboardLink() {
  const { t } = useTranslation();
  const { data: userData } = useQuery({
    queryKey: ["login-user"],
    queryFn: () => fetchLoginUser(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

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
  );
}

// https://github.com/streamich/react-use/blob/master/src/useInterval.ts
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(() => {});
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [delay]);
};
function Overview() {
  const { t } = useTranslation();
  const [mouted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const timeOption = DateTime.TIME_SIMPLE;
  timeOption.hour12 = true;
  const [timeString, setTimeString] = useState(
    DateTime.now().setLocale("en-US").toLocaleString(timeOption),
  );
  useInterval(() => {
    setTimeString(DateTime.now().setLocale("en-US").toLocaleString(timeOption));
  }, 1000);
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
  );
}
export default Header;
