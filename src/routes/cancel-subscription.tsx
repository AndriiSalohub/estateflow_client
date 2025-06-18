import CancelSubscriptionPayment from "@/pages/CancelSubscriptionPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cancel-subscription")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CancelSubscriptionPayment />;
}
