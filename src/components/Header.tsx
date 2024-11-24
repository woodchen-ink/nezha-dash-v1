// import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchLoginUser } from "@/lib/nezha-api";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";

function Header() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <section className="flex items-center justify-between">
        <section className="flex items-center text-base font-medium">
          <div className="mr-1 flex flex-row items-center justify-start">
            <img
              width={40}
              height={40}
              alt="apple-touch-icon"
              src={"/apple-touch-icon.png"}
              className="relative m-0! border-2 border-transparent h-6 w-6 object-cover object-top p-0!"
            />
          </div>
          {"NEZHA"}
          <Separator
            orientation="vertical"
            className="mx-2 hidden h-4 w-[1px] md:block"
          />
          <p className="hidden text-sm font-medium opacity-40 md:block">
            哪吒监控
          </p>
        </section>
        <section className="flex items-center gap-2">
          <DashboardLink />
          {/* <LanguageSwitcher /> */}
          <ModeToggle />
        </section>
      </section>
      <Overview />
    </div>
  );
}

function DashboardLink() {
  const { data: userData } = useQuery({
    queryKey: ["login-user"],
    queryFn: () => fetchLoginUser(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (!userData?.data?.id) return null;

  return (
    <div className="flex items-center gap-2">
      <a
        href={"/dashboard"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm font-medium opacity-50 transition-opacity hover:opacity-100"
      >
        Dashboard
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
      <p className="text-base font-semibold">👋 Overview</p>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium opacity-50">where the time is</p>
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
