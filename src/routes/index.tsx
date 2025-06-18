import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/pages/HomePage";
import { useUserStore } from "@/store/userStore";
import PromptEditingPage from "@/pages/PromptEditingPage";
import StatisticsPage from "@/pages/StatisticsPage";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useUserStore();
  return (
    <>
      {user && user.role === "admin" ? (
        <PromptEditingPage />
      ) : user?.role === "moderator" ? (
        <StatisticsPage />
      ) : (
        <HomePage />
      )}
    </>
  );
}
