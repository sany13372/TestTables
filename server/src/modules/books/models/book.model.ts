import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  QueryTypes,
  Op,
} from 'sequelize';
import { sequelize } from '../../../config/database';
import { AuthorModel } from '../../authors/models/author.model';
import { ConflictError, NotFoundError } from '../../../errors/httpErrors';

export interface BookInput {
  author_id: number;
  title: string;
  published_date: string;
  price: number;
  pages: number;
}

export class Book extends Model<
  InferAttributes<Book>,
  InferCreationAttributes<Book>
> {
  declare id: CreationOptional<number>;
  declare author_id: number;
  declare title: string;
  declare published_date: string;
  declare price: number;
  declare pages: number;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    published_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0,
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'books',
    timestamps: false,
  }
);

async function ensureAuthorExists(authorId: number): Promise<void> {
  const author = await AuthorModel.findById(authorId);
  if (author === null) {
    throw new NotFoundError(`Автор с id=${authorId} не существует`);
  }
}

export const BookModel = {
  async list(limit: number, offset: number, authorId?: number): Promise<Book[]> {
    return sequelize.query<Book>(
      `SELECT b.id,
              b.author_id,
              b.title,
              b.published_date,
              b.price,
              b.pages,
              a.full_name AS author_name
         FROM books b
         JOIN authors a ON a.id = b.author_id
        WHERE (:authorId::int IS NULL OR b.author_id = :authorId)
        ORDER BY b.id
        LIMIT :limit OFFSET :offset`,
      { replacements: { limit, offset, authorId: authorId ?? null }, type: QueryTypes.SELECT }
    );
  },

  async count(authorId?: number): Promise<number> {
    const rows = await sequelize.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total
         FROM books
        WHERE (:authorId::int IS NULL OR author_id = :authorId)`,
      { replacements: { authorId: authorId ?? null }, type: QueryTypes.SELECT }
    );
    return rows[0].total;
  },

  async findById(id: number): Promise<Book | null> {
    return Book.findByPk(id);
  },

  async getById(id: number): Promise<Book> {
    const book = await Book.findByPk(id);
    if (book === null) {
      throw new NotFoundError('Книга не найдена');
    }
    return book;
  },

  async existsByTitle(authorId: number, title: string, excludeId?: number): Promise<boolean> {
    const where: { author_id: number; title: string; id?: { [Op.ne]: number } } = {
      author_id: authorId,
      title,
    };
    if (excludeId !== undefined) {
      where.id = { [Op.ne]: excludeId };
    }
    const count = await Book.count({ where });
    return count > 0;
  },

  async create(data: BookInput): Promise<Book> {
    await ensureAuthorExists(data.author_id);

    if (await this.existsByTitle(data.author_id, data.title)) {
      throw new ConflictError('У этого автора уже есть книга с таким названием');
    }

    return Book.create(data);
  },

  async update(id: number, data: BookInput): Promise<Book> {
    const book = await Book.findByPk(id);
    if (book === null) {
      throw new NotFoundError('Книга не найдена');
    }

    await ensureAuthorExists(data.author_id);

    if (
      (data.author_id !== book.author_id || data.title !== book.title) &&
      await this.existsByTitle(data.author_id, data.title, id)
    ) {
      throw new ConflictError('У этого автора уже есть книга с таким названием');
    }

    return book.update(data);
  },

  async remove(id: number): Promise<void> {
    const deletedRows = await Book.destroy({ where: { id } });
    if (deletedRows === 0) {
      throw new NotFoundError('Книга не найдена');
    }
  },
};
