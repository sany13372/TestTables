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
import { ConflictError, NotFoundError } from '../../../errors/httpErrors';

export interface AuthorInput {
  full_name: string;
  birth_date: string;
  rating: number;
}

export class Author extends Model<
  InferAttributes<Author>,
  InferCreationAttributes<Author>
> {
  declare id: CreationOptional<number>;
  declare full_name: string;
  declare birth_date: string;
  declare rating: number;
}

Author.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'authors',
    timestamps: false,
  }
);

export const AuthorModel = {
  async list(limit: number, offset: number): Promise<Author[]> {
    return sequelize.query<Author>(
      `SELECT id, full_name, birth_date, rating
         FROM authors
        ORDER BY id
        LIMIT :limit OFFSET :offset`,
      { replacements: { limit, offset }, type: QueryTypes.SELECT }
    );
  },

  async count(): Promise<number> {
    const rows = await sequelize.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM authors`,
      { type: QueryTypes.SELECT }
    );
    return rows[0].total;
  },

  async findById(id: number): Promise<Author | null> {
    return Author.findByPk(id);
  },

  async getById(id: number): Promise<Author> {
    const author = await Author.findByPk(id);
    if (author === null) {
      throw new NotFoundError('Автор не найден');
    }
    return author;
  },

  async existsByName(full_name: string, excludeId?: number): Promise<boolean> {
    const where: { full_name: string; id?: { [Op.ne]: number } } = { full_name };
    if (excludeId !== undefined) {
      where.id = { [Op.ne]: excludeId };
    }
    const count = await Author.count({ where });
    return count > 0;
  },

  async create(data: AuthorInput): Promise<Author> {
    if (await this.existsByName(data.full_name)) {
      throw new ConflictError('Автор с таким именем уже существует');
    }
    return Author.create(data);
  },

  async update(id: number, data: AuthorInput): Promise<Author> {
    const author = await Author.findByPk(id);
    if (author === null) {
      throw new NotFoundError('Автор не найден');
    }

    if (data.full_name !== author.full_name && await this.existsByName(data.full_name, id)) {
      throw new ConflictError('Автор с таким именем уже существует');
    }

    return author.update(data);
  },

  async remove(id: number): Promise<void> {
    const deletedRows = await Author.destroy({ where: { id } });
    if (deletedRows === 0) {
      throw new NotFoundError('Автор не найден');
    }
  },
};
