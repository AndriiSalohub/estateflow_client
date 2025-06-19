import { create } from "zustand";
import { $api, API_URL } from "@/api/BaseUrl";
import type { PromptsStore } from "@/types/promptsTypes";

export const usePromptsStore = create<PromptsStore>((set) => ({
  isLoading: false,
  error: null,
  prompts: [],
  fetchAllPrompts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await $api.get(`${API_URL}/api/ai/system-prompts`);
      set({ prompts: response.data.prompts, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch prompts", isLoading: false });
    }
  },
  updateSystemPrompt: async (name: string, newContent: string) => {
    set({ isLoading: true, error: null });
    try {
      await $api.put(`${API_URL}/api/ai/system-prompt`, {
        name,
        newContent,
      });

      set((state) => ({
        prompts: state.prompts.map((prompt) =>
          prompt.name === name
            ? {
                ...prompt,
                content: newContent,
                updatedAt: new Date().toISOString(),
              }
            : prompt,
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      let errorMessage = "Failed to update prompt";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Missing required fields: name or newContent";
            break;
          case 403:
            errorMessage = "Only admins can update system prompts";
            break;
          case 404:
            errorMessage =
              error.response.data.message === "User not found"
                ? "User not found"
                : "System prompt not found";
            break;
          case 500:
            errorMessage = "Internal server error";
            break;
        }
      }
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
