import axios, { AxiosError } from 'axios';
import type { Author, Book, BookPayload, PaginatedResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

function toApiError(error: unknown): Error {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { error?: string } | undefined)?.error;
    return new Error(message ?? error.message);
  }
  return error instanceof Error ? error : new Error('Неизвестная ошибка сети');
}

export async function fetchAuthors(limit: number, offset: number): Promise<PaginatedResponse<Author>> {
  try {
    const response = await api.get<PaginatedResponse<Author>>('/authors', {
      params: { limit, offset },
    });
    return response.data;
  } catch {
    return {
      total: 0,
      limit,
      offset,
      items: [],
    };
  }
}

export async function fetchBooksByAuthor(authorId: number): Promise<PaginatedResponse<Book>> {
  try {
    const response = await api.get<PaginatedResponse<Book>>('/books', {
      params: { limit: 100, offset: 0, author_id: authorId },
    });
    return response.data;
  } catch {
    return {
      total: 0,
      limit: 100,
      offset: 0,
      items: [],
    };
  }
}

export async function createBook(payload: BookPayload): Promise<Book> {
  try {
    const response = await api.post<Book>('/books', payload);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateBook(id: number, payload: BookPayload): Promise<Book> {
  try {
    const response = await api.put<Book>(`/books/${id}`, payload);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteBook(id: number): Promise<void> {
  try {
    await api.delete(`/books/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
