import type { Message } from '@canva-web/src/models/message.model';
import { create } from 'zustand';
import { MessageService } from '@canva-web/src/services/message.service';

interface MessageStore {
  messages: Message[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  setMessages: (messages: Message[]) => void;
  setTotal: (total: number) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  fetchMessages: (status?: 'read' | 'unread') => Promise<void>;
  reset: () => void;
}

const initialState = {
  messages: [],
  total: 0,
  page: 1,
  pageSize: 10,
  isLoading: false,
  error: null,
};

export const useMessageStore = create<MessageStore>((set) => ({
  ...initialState,
  setMessages: (messages) => set({ messages }),
  setTotal: (total) => set({ total }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addMessage: (message) =>
    set((state) => ({
      messages: [message, ...state.messages],
      total: state.total + 1,
    })),
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.documentId !== id),
      total: state.total - 1,
    })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.documentId === id ? { ...msg, ...updates } : msg
      ),
    })),
  fetchMessages: async (status?: 'read' | 'unread') => {
    try {
      set({ isLoading: true, error: null });
      const response = await MessageService.getMessages({
        page: 1,
        pageSize: 50,
        status,
      });
      set({
        messages: response.data?.messages || [],
        total: response.data?.total || 0,
        isLoading: false,
      });
    } catch (err) {
      set({ error: 'Failed to load messages', isLoading: false });
      console.error('Failed to load messages:', err);
    }
  },
  reset: () => set(initialState),
}));
