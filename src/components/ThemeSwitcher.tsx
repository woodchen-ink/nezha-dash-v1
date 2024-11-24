import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { Theme } from "@/components/ThemeProvider";
import { useTheme } from "../hooks/use-theme";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const handleSelect = (e: Event, newTheme: Theme) => {
    e.preventDefault();
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full px-[9px] bg-white dark:bg-black"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-0.5" align="end">
        <DropdownMenuItem
          className={cn({ "gap-3 bg-muted": theme === "light" })}
          onSelect={(e) => handleSelect(e, "light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn({ "gap-3 bg-muted": theme === "dark" })}
          onSelect={(e) => handleSelect(e, "dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn({ "gap-3 bg-muted": theme === "system" })}
          onSelect={(e) => handleSelect(e, "system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
