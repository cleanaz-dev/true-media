"use client";

import { Clock } from "lucide-react";

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  rawStartsAt: string;
  rawEndsAt: string;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
  isLoading?: boolean;
  selectedDate?: string | null;
}

function formatTime(timeStr: string) {
  return timeStr.replace(":00", "").replace(" ", "");
}

export function TimeSlotPicker({
  slots,
  selectedSlots,
  onChange,
  isLoading,
  selectedDate,
}: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    if (selectedDate) {
      return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
          No available time slots on this date.
        </div>
      );
    }
    return null;
  }

  // 1. SMART CHECK: Are there gaps in the day? (e.g. someone already booked 12-1PM)
  // If there are gaps, we cannot offer a "Full Day" button because it's impossible.
  let hasGaps = false;
  for (let i = 0; i < slots.length - 1; i++) {
    if (new Date(slots[i].rawEndsAt).getTime() !== new Date(slots[i + 1].rawStartsAt).getTime()) {
      hasGaps = true;
      break;
    }
  }

  const firstAvailableSlot = slots[0];
  const lastAvailableSlot = slots[slots.length - 1];
  const isFullDay = selectedSlots.length === slots.length && slots.length > 0;

  const handleToggleSlot = (slot: TimeSlot) => {
    // If nothing selected yet, just select it
    if (selectedSlots.length === 0) {
      onChange([slot]);
      return;
    }

    const slotStart = new Date(slot.rawStartsAt).getTime();
    const slotEnd = new Date(slot.rawEndsAt).getTime();

    // Sort current selection chronologically to get the bounds
    const sortedSelected = [...selectedSlots].sort(
      (a, b) => new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime()
    );

    const firstSelected = sortedSelected[0];
    const lastSelected = sortedSelected[sortedSelected.length - 1];
    
    const firstStart = new Date(firstSelected.rawStartsAt).getTime();
    const lastEnd = new Date(lastSelected.rawEndsAt).getTime();

    const isAlreadySelected = sortedSelected.some((s) => s.id === slot.id);

    if (isAlreadySelected) {
      if (slot.id === firstSelected.id || slot.id === lastSelected.id) {
        // If clicking the very edges of the selection block, just remove that single slot
        onChange(selectedSlots.filter((s) => s.id !== slot.id));
      } else {
        // Trimming: If they click a slot in the middle, truncate the block up to that point
        onChange(sortedSelected.filter((s) => new Date(s.rawStartsAt).getTime() < slotStart));
      }
      return;
    }

    // It's a new slot. Is it adjacent to the currently selected block?
    const isAdjacentBefore = slotEnd === firstStart;
    const isAdjacentAfter = slotStart === lastEnd;

    if (isAdjacentBefore || isAdjacentAfter) {
      // It perfectly touches the existing selection, extend the block!
      onChange([...selectedSlots, slot]);
    } else {
      // Disjointed! They clicked a completely separate time. Reset to just this slot.
      onChange([slot]);
    }
  };

  const handleToggleFullDay = () => {
    if (isFullDay) {
      onChange([]); // Deselect all
    } else {
      onChange([...slots]); // Select all
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlots.some((s) => s.id === slot.id);

          return (
            <button
              key={slot.id}
              onClick={() => handleToggleSlot(slot)}
              aria-pressed={isSelected}
              className={`cursor-pointer rounded-xl border px-2 py-2.5 text-sm font-semibold transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </button>
          );
        })}
      </div>

      {/* Only render Full Day if there are more than 1 slot AND no bookings breaking up the day */}
      {!hasGaps && slots.length > 1 && (
        <div className="mt-2 border-t border-slate-100 pt-2">
          <button
            onClick={handleToggleFullDay}
            aria-pressed={isFullDay}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
              isFullDay
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-600 hover:bg-blue-50"
            }`}
          >
            <Clock className="h-4 w-4" />
            Full Day ({formatTime(firstAvailableSlot.startTime)} - {formatTime(lastAvailableSlot.endTime)})
          </button>
        </div>
      )}
    </div>
  );
}