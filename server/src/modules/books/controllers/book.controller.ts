import { Request, Response } from 'express';
import { BookModel, BookInput } from '../models/book.model';
import {
  parsePagination,
  parseId,
  requireString,
  requireNumber,
  requireInteger,
  requireDate,
} from '../../../utils/validation';

function buildBookInput(body: Record<string, unknown>): BookInput {
  return {
    author_id: requireInteger(body.author_id, 'author_id', 1),
    title: requireString(body.title, 'title', 200),
    published_date: requireDate(body.published_date, 'published_date'),
    price: requireNumber(body.price, 'price', 0),
    pages: requireInteger(body.pages, 'pages', 1),
  };
}

export async function getBooks(req: Request, res: Response): Promise<void> {
  const { limit, offset } = parsePagination(req.query);
  const authorId = req.query.author_id === undefined ? undefined : parseId(req.query.author_id);
  const [items, total] = await Promise.all([
    BookModel.list(limit, offset, authorId),
    BookModel.count(authorId),
  ]);
  res.json({ total, limit, offset, items });
}

export async function getBookById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  const book = await BookModel.getById(id);
  res.json(book);
}

export async function createBook(req: Request, res: Response): Promise<void> {
  const input = buildBookInput(req.body ?? {});
  const book = await BookModel.create(input);
  res.status(201).json(book);
}

export async function updateBook(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  const input = buildBookInput(req.body ?? {});
  const book = await BookModel.update(id, input);
  res.json(book);
}

export async function deleteBook(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  await BookModel.remove(id);
  res.status(204).send();
}
