import {
  createFileRoute,
  useSearch,
  useNavigate,
} from "@tanstack/react-router";
import AddListingPage from "@/pages/AddListingPage";
import { useUserStore } from "@/store/userStore";

export const Route = createFileRoute("/listing-form-to-add-page")({
  validateSearch: (search: Record<string, unknown>) => {
    if (typeof search.userId !== "string") {
      throw new Error("Missing or invalid 'propertyId'");
    }
    return {
      userId: search.userId,
    };
  },
  component: ListingRouteComponent,
});

function ListingRouteComponent() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  if (user && (user.role === "private_seller" || user.role === "agency")) {
    const search = useSearch({ from: "/listing-form-to-add-page" });
    return <AddListingPage userId={search.userId} />;
  } else {
    navigate({ to: "/" });
  }
}
