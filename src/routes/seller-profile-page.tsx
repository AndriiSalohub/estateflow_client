import { createFileRoute, useSearch } from "@tanstack/react-router";
import SellerProfilePage from "@/pages/SellerProfilePage";

export const Route = createFileRoute("/seller-profile-page")({
  validateSearch: (search: Record<string, unknown>) => {
    if (typeof search.userId !== "string") {
      throw new Error("Missing or invalid 'userId' in search params");
    }
    return {
      userId: search.userId,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const search = useSearch({ from: "/seller-profile-page" });

  return <SellerProfilePage userId={search.userId} />;
}
