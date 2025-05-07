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
      <div className="flex flex-wrap gap-1.5 pb-1">
        <button
          className={cn(
            "px-3 py-1.5 text-xs rounded-md transition-all border",
            currentCountry === "All" 
              ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600 shadow-sm" 
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          onClick={() => onChange("All")}
        >
          ALL
        </button>
        
        {countries.map((country) => (
          <button
            key={country}
            className={cn(
              "px-3 py-1.5 text-xs rounded-md flex items-center gap-1.5 transition-all border",
              currentCountry === country 
                ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600 shadow-sm" 
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
            onClick={() => onChange(country)}
          >
            <ServerFlag country_code={country.toLowerCase()} className="text-[12px]" />
            {country}
          </button>
        ))}
      </div>
    </div>
  );
} 