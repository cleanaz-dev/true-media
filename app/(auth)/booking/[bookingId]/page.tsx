interface Params {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function Page({ params }: Params) {
  const { bookingId } = await params;

  const isBookingPlublic = await checkIfPublic(bookingId)
  return;
}
