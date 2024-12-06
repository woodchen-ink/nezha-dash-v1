"use client";

import { ReactNode, useState } from "react";
import { FilterContext } from "./filter-context";

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<boolean>(false);

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
}
