import { Author } from './authors/models/author.model';
import { Book } from './books/models/book.model';

Author.hasMany(Book, { foreignKey: 'author_id', as: 'books' });
Book.belongsTo(Author, { foreignKey: 'author_id', as: 'author' });

export { Author, Book };
export { AuthorModel, AuthorInput } from './authors/models/author.model';
export { BookModel, BookInput } from './books/models/book.model';
