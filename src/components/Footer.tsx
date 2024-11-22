// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 lg:px-0 pb-4">
      <section className="flex flex-col">
        <section className="mt-1 flex items-center gap-2 text-[13px] font-light tracking-tight text-neutral-600/50 dark:text-neutral-300/50">
          ©2020-{new Date().getFullYear()}{" "}
          <a href={"https://nezha.wiki"} target="_blank">
            Nezha
          </a>
        </section>
      </section>
    </footer>
  );
};

export default Footer;
