import { ValidationError } from '../errors/httpErrors';

export function parsePagination(query: Record<string, unknown>): {
  limit: number;
  offset: number;
} {
  const limit = query.limit === undefined ? 10 : Number(query.limit);
  const offset = query.offset === undefined ? 0 : Number(query.offset);

  if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
    throw new ValidationError('Параметр limit должен быть целым числом от 1 до 100');
  }
  if (!Number.isInteger(offset) || offset < 0) {
    throw new ValidationError('Параметр offset должен быть целым неотрицательным числом');
  }
  return { limit, offset };
}

export function parseId(value: unknown): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('Идентификатор должен быть целым положительным числом');
  }
  return id;
}

export function requireString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(`Поле ${field} обязательно и должно быть непустой строкой`);
  }
  if (value.length > maxLength) {
    throw new ValidationError(`Поле ${field} не должно превышать ${maxLength} символов`);
  }
  return value;
}

export function requireNumber(
  value: unknown,
  field: string,
  min: number,
  max?: number
): number {
  const num = Number(value);
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw new ValidationError(`Поле ${field} должно быть числом`);
  }
  if (!Number.isFinite(num) || num < min) {
    throw new ValidationError(`Поле ${field} должно быть числом не меньше ${min}`);
  }
  if (max !== undefined && num > max) {
    throw new ValidationError(`Поле ${field} должно быть числом не больше ${max}`);
  }
  return num;
}

export function requireInteger(value: unknown, field: string, min: number): number {
  const num = Number(value);
  if (!Number.isInteger(num) || num < min) {
    throw new ValidationError(`Поле ${field} должно быть целым числом не меньше ${min}`);
  }
  return num;
}

export function requireDate(value: unknown, field: string): string {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new ValidationError(`Поле ${field} должно быть корректной датой (YYYY-MM-DD)`);
  }
  return value;
}
