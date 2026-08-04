import { CheckoutView } from "@/components/checkout/checkout-view";


interface PageProps {
  params: {
    bookingId: string;
  };
}

export default function CheckoutPage({ params }: PageProps) {
  return <CheckoutView bookingId={params.bookingId} />;
}