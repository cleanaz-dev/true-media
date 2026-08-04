// lib/hapio/index.ts

const HAPIO_URL = process.env.HAPIO_URL ?? "https://eu-central-1.hapio.net/v1";
const HAPIO_KEY = process.env.HAPIO_KEY!;

// Hardcoded — single location, single service for the whole app
export const HAPIO_LOCATION_ID = "705cc639-ed36-4169-bf2b-cab8be5c7f93";
export const HAPIO_SERVICE_ID = "d8fcf10f-fef7-4f23-ab16-b0b621fa37c8";

async function hapioFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${HAPIO_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${HAPIO_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Hapio API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

type HapioSlot = {
  starts_at: string;
  ends_at: string;
  buffer_starts_at: string;
  buffer_ends_at: string;
  resources: { id: string; name: string }[];
};

// --- Bookable slots for a specific room ---
export async function getBookableSlots(params: {
  resourceId: string; // maps to Room.hapioResourceId
  from: string; // ISO string with offset
  to: string;
}) {
  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
    location: HAPIO_LOCATION_ID,
  });

  const res = await hapioFetch<{ data: HapioSlot[] }>(
    `/services/${HAPIO_SERVICE_ID}/bookable-slots?${query.toString()}`
  );

  // Hapio returns slots for ALL linked resources at once — filter to just this room
  return res.data.filter((slot) =>
    slot.resources.some((r) => r.id === params.resourceId)
  );
}

// --- Create booking ---
export async function createHapioBooking(params: {
  resourceId: string;
  startsAt: string;
  endsAt: string;
  isTemporary: boolean
}) {
  return hapioFetch<{ id: string; [key: string]: unknown }>(`/bookings`, {
    method: "POST",
    body: JSON.stringify({
      location_id: HAPIO_LOCATION_ID,
      service_id: HAPIO_SERVICE_ID,
      resource_id: params.resourceId,
      starts_at: params.startsAt,
      ends_at: params.endsAt,
      is_temporary: params.isTemporary
    }),
  });
}

// --- Cancel booking ---
export async function cancelHapioBooking(hapioBookingId: string) {
  return hapioFetch(`/bookings/${hapioBookingId}`, {
    method: "DELETE",
  });
}

// --- Confirm temporary booking (Remove temporary hold) ---
export async function confirmHapioBooking(hapioBookingId: string) {
  return hapioFetch(`/bookings/${hapioBookingId}`, {
    method: "PATCH",
    body: JSON.stringify({
      is_temporary: false,
    }),
  });
}