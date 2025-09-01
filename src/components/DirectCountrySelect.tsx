import { cn } from "@/lib/utils";
import ServerFlag from "@/components/ServerFlag";

type DirectCountrySelectProps = {
  countries: string[];
  currentCountry: string;
  onChange: (country: string) => void;
};

// 这是一个简单的直接选择组件，避免可能的事件传播问题
export default function DirectCountrySelect({
  countries,
  currentCountry,
  onChange
}: DirectCountrySelectProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(
            "px-4 py-2 text-sm rounded-lg transition-all border font-medium",
            currentCountry === "All" 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-card border-border hover:bg-muted"
          )}
          onClick={() => onChange("All")}
        >
          ALL
        </button>
        
        {countries.map((country) => (
          <button
            key={country}
            className={cn(
              "px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-all border font-medium",
              currentCountry === country 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card border-border hover:bg-muted"
            )}
            onClick={() => onChange(country)}
          >
            <ServerFlag country_code={country.toLowerCase()} className="text-sm" />
            {country}
          </button>
        ))}
      </div>
    </div>
  );
} 