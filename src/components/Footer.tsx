// src/components/Footer.tsx
import React from "react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 lg:px-0 pb-4">
      <section className="flex flex-col">
        <section className="mt-1 flex items-center justify-between gap-2 text-[13px] font-light tracking-tight text-neutral-600/50 dark:text-neutral-300/50">
          <p>
            &copy;2020-{new Date().getFullYear()}{" "}
            <a href={"https://github.com/naiba/nezha"} target="_blank">
              Nezha
            </a>
          </p>
          <p>
            {t("footer.themeBy")}
            <a
              href={"https://github.com/hamster1963/nezha-dash"}
              target="_blank"
            >
              nezha-dash
            </a>
            {import.meta.env.VITE_GIT_HASH && (
              <span className="ml-1">({import.meta.env.VITE_GIT_HASH})</span>
            )}
          </p>
        </section>
      </section>
    </footer>
  );
};

export default Footer;
