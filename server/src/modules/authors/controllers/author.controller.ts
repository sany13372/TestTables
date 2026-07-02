import { Request, Response } from 'express';
import { AuthorModel, AuthorInput } from '../models/author.model';
import {
  parsePagination,
  parseId,
  requireString,
  requireNumber,
  requireDate,
} from '../../../utils/validation';

function buildAuthorInput(body: Record<string, unknown>): AuthorInput {
  return {
    full_name: requireString(body.full_name, 'full_name', 150),
    birth_date: requireDate(body.birth_date, 'birth_date'),
    rating: requireNumber(body.rating, 'rating', 0, 5),
  };
}

export async function getAuthors(req: Request, res: Response): Promise<void> {
  const { limit, offset } = parsePagination(req.query);
  const [items, total] = await Promise.all([
    AuthorModel.list(limit, offset),
    AuthorModel.count(),
  ]);
  res.json({ total, limit, offset, items });
}

export async function getAuthorById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  const author = await AuthorModel.getById(id);
  res.json(author);
}

export async function createAuthor(req: Request, res: Response): Promise<void> {
  const input = buildAuthorInput(req.body ?? {});
  const author = await AuthorModel.create(input);
  res.status(201).json(author);
}

export async function updateAuthor(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  const input = buildAuthorInput(req.body ?? {});
  const author = await AuthorModel.update(id, input);
  res.json(author);
}

export async function deleteAuthor(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  await AuthorModel.remove(id);
  res.status(204).send();
}
