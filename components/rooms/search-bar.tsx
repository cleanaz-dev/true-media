"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react"; // <-- Import useTransition
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
import { useHapio } from "@/context/hapio-contex"; 

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useHapio(); 
  
  // <-- Add useTransition hook
  const [isPending, startTransition] = useTransition(); 

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
      
      // <-- Wrap router.push in startTransition to get INSTANT visual feedback
      startTransition(() => {
        router.push(`/rooms?date=${formattedDate}`);
      });
    }
  };

  // Combine both loading states: 
  // isPending catches the instant button click, isLoading catches the API fetch
  const showLoading = isPending || isLoading;

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
          disabled={!date || showLoading} // <-- use showLoading here
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-14 text-base font-semibold transition-all shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {showLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          {showLoading ? "Checking..." : "Check Availability"}
        </Button>
      </div>
    </form>
  );
}