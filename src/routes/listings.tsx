import { createFileRoute } from "@tanstack/react-router";
import ListingsMainPage from "@/pages/ListingsPage";

export const Route = createFileRoute("/listings")({
  component: () => <ListingsMainPage />,
});
