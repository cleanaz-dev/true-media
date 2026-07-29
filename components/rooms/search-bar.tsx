"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useHapio } from "@/context/hapio-contex"; // Make sure this path matches your project!

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useHapio(); // <-- Consume loading state

  const initialDateParam = searchParams.get("date");
  const initialDate = initialDateParam
    ? new Date(initialDateParam + "T00:00:00")
    : undefined;

  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      router.push(`/rooms?date=${formattedDate}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row items-center bg-white p-2 sm:p-3 rounded-2xl shadow-xl border border-gray-100 w-full max-w-3xl mx-auto relative z-20"
    >
      <div className="flex-grow w-full px-4 py-2 sm:border-r border-gray-100">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
          Check-in Date
        </label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-medium text-lg px-0 hover:bg-transparent hover:text-blue-600 transition-colors focus-visible:ring-0",
                !date && "text-gray-400 font-normal",
              )}
            >
              <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
              {date ? format(date, "PPP") : "Add a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate) setIsOpen(false); 
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full sm:w-auto p-2">
        <Button
          type="submit"
          disabled={!date || isLoading} // <-- Disable while loading
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-14 text-base font-semibold transition-all shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          {isLoading ? "Checking..." : "Check Availability"}
        </Button>
      </div>
    </form>
  );
}