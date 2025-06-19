export interface Prompt {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptsStore {
  isLoading: boolean;
  error: string | null;
  prompts: Prompt[];
  fetchAllPrompts: () => Promise<void>;
  updateSystemPrompt: (name: string, newContent: string) => Promise<void>;
}
