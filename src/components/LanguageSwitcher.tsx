"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const locale = i18n.language;

  const handleSelect = (e: Event, newLocale: string) => {
    e.preventDefault(); // 阻止默认的关闭行为
    i18n.changeLanguage(newLocale);
  };

  const localeItems = [
    { name: t("language.zh-CN"), code: "zh-CN" },
    { name: t("language.zh-TW"), code: "zh-TW" },
    { name: t("language.en"), code: "en" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full px-[9px] bg-white dark:bg-black"
        >
          {localeItems.find((item) => item.code === locale)?.name}
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-0.5" align="end">
        {localeItems.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onSelect={(e) => handleSelect(e, item.code)}
            className={locale === item.code ? "bg-muted gap-3" : ""}
          >
            {item.name}{" "}
            {locale === item.code && <CheckCircleIcon className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}