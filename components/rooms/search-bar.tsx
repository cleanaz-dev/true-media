"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Initialize with the URL date if it exists
    const [date, setDate] = useState(searchParams.get("date") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (date) {
            // This updates the URL, triggering the server component to fetch Hapio data!
            router.push(`/rooms?date=${date}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex flex-col">
                <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-1">
                    Select Check-in Date
                </label>
                <input 
                    id="date"
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm p-2 text-black focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors mt-auto"
            >
                Check Availability
            </button>
        </form>
    );
}
