import { create } from "zustand";
import { $api, API_URL } from "@/api/BaseUrl";
import uuid from "react-uuid";
import type { AiStore, Message, MessageResponse } from "@/types/aiTypes";

export const aiStore = create<AiStore>((set, get) => ({
  messages: [],
  isLoading: false,
  isInitializing: false,
  newMessage: "",
  setNewMessage: (message: string) => set({ newMessage: message }),
  sendMessage: async () => {
    const { newMessage, messages } = get();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: uuid(),
      createdAt: new Date(),
      content: newMessage,
      index: messages.length,
      sender: "user",
    };

    set({
      messages: [...messages, userMessage],
      newMessage: "",
      isLoading: true,
    });

    try {
      const response = await $api.post<MessageResponse>(
        `${API_URL}/api/ai/conversations/messages`,
        { message: newMessage },
      );

      if (response.data.aiResponse.content) {
        const aiMessage: Message = {
          id: response.data.aiResponse.id,
          createdAt: new Date(response.data.aiResponse.createdAt),
          content: response.data.aiResponse.content,
          index: messages.length + 1,
          sender: "ai",
        };
        set((state) => ({
          messages: [...state.messages, aiMessage],
          isLoading: false,
        }));
      }
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== userMessage.id),
        isLoading: false,
      }));
    }
  },
  initializeConversation: async () => {
    set({ isInitializing: true });
    try {
      const historyResponse = await $api.get(
        `${API_URL}/api/ai/conversations/visible-history`,
      );
      const visibleHistory = historyResponse.data.messages.messages || [];

      set({ messages: visibleHistory, isInitializing: false });
    } catch (error: any) {
      if (error.response?.status === 404) {
        const createResponse = await $api.post(
          `${API_URL}/api/ai/conversations`,
          { title: "EstateFlow AI chat" },
        );

        if (createResponse.status === 201) {
          const newHistoryResponse = await $api.get(
            `${API_URL}/api/ai/conversations/visible-history`,
          );
          set({
            messages: newHistoryResponse.data.messages.messages || [],
            isInitializing: false,
          });
        }
      } else if (error.response?.status === 409) {
        const historyResponse = await $api.get(
          `${API_URL}/api/ai/conversations/visible-history`,
        );
        set({
          messages: historyResponse.data.messages.messages || [],
          isInitializing: false,
        });
      } else {
        set({ isInitializing: false });
      }
    }
  },
}));
