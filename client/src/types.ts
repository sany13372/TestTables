export interface Author {
  id: number;
  full_name: string;
  birth_date: string;
  rating: number;
}

export interface Book {
  id: number;
  author_id: number;
  title: string;
  published_date: string;
  price: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  items: T[];
}

export interface BookPayload {
  author_id: number;
  title: string;
  published_date: string;
  price: number;
  pages: number;
}
