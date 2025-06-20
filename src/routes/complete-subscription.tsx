import CompleteSubscriptionPage from "@/pages/CompleteSubscriptionPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/complete-subscription")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CompleteSubscriptionPage />;
}
