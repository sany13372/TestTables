import { create } from 'zustand';
import { createBook, deleteBook, fetchBooksByAuthor, updateBook } from '../api';
import type { Author, Book, BookPayload } from '../types';

interface DashboardState {
  selectedAuthor: Author | null;
  books: Book[];
  loadingBooks: boolean;
  errorMessage: string | null;
  setSelectedAuthor: (author: Author | null) => void;
  loadBooks: (authorId: number) => Promise<void>;
  addBook: (payload: BookPayload) => Promise<void>;
  editBook: (id: number, payload: BookPayload) => Promise<void>;
  removeBook: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  selectedAuthor: null,
  books: [],
  loadingBooks: false,
  errorMessage: null,

  setSelectedAuthor: (author) => {
    set({ selectedAuthor: author, books: [] });
    if (author !== null) {
      get().loadBooks(author.id);
    }
  },

  loadBooks: async (authorId) => {
    set({ loadingBooks: true, errorMessage: null });
    try {
      const data = await fetchBooksByAuthor(authorId);
      set({ books: data.items, loadingBooks: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить книги';
      set({ loadingBooks: false, errorMessage: message });
    }
  },

  addBook: async (payload) => {
    set({ errorMessage: null });
    try {
      await createBook(payload);
      await get().loadBooks(payload.author_id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось добавить книгу';
      set({ errorMessage: message });
      throw error;
    }
  },

  editBook: async (id, payload) => {
    set({ errorMessage: null });
    try {
      await updateBook(id, payload);
      await get().loadBooks(payload.author_id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось обновить книгу';
      set({ errorMessage: message });
      throw error;
    }
  },

  removeBook: async (id) => {
    const author = get().selectedAuthor;
    if (author === null) {
      return;
    }

    set({ errorMessage: null });
    try {
      await deleteBook(id);
      await get().loadBooks(author.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось удалить книгу';
      set({ errorMessage: message });
      throw error;
    }
  },

  clearError: () => set({ errorMessage: null }),
}));
