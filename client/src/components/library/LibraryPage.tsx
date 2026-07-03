import { useState } from 'react';
import type { RowClickedEvent } from 'ag-grid-community';
import type { Author, Book, BookPayload } from '../../types';
import { useDashboardStore } from '../../store/dashboardStore';
import { AuthorsGrid } from '../authors/AuthorsGrid';
import { BooksGrid } from '../books/BooksGrid';
import { BookModal } from '../books/BookModal';
import styles from './LibraryPage.module.scss';

export function LibraryPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const {
    selectedAuthor,
    books,
    loadingBooks,
    errorMessage,
    setSelectedAuthor,
    addBook,
    editBook,
    removeBook,
  } = useDashboardStore();

  const onAuthorClick = (event: RowClickedEvent<Author>) => {
    setSelectedAuthor(event.data ?? null);
    setSelectedBook(null);
  };

  const openCreateModal = () => {
    setSelectedBook(null);
    setEditMode(false);
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedBook) {
      return;
    }
    setEditMode(true);
    setModalOpen(true);
  };

  const handleModalSubmit = async (payload: BookPayload, bookId?: number): Promise<void> => {
    if (isEditMode && bookId !== undefined) {
      await editBook(bookId, payload);
    } else {
      await addBook(payload);
    }
    setSelectedBook(null);
  };

  const handleDelete = async () => {
    if (!selectedBook) {
      return;
    }
    try {
      await removeBook(selectedBook.id);
      setSelectedBook(null);
    } catch {
      console.error('Ошибка удаления книги');
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div>
          <p>Главная таблица: авторы, связанная: книги выбранного автора.</p>
        </div>
        <div className={styles.statCards}>
          <div className={styles.statCard}>
            <span>Выбранный автор</span>
            <strong>{selectedAuthor ? selectedAuthor.full_name : '—'}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Книг в таблице</span>
            <strong>{books.length}</strong>
          </div>
        </div>
      </header>

      <div className={styles.gridStack}>
        <AuthorsGrid onRowClicked={onAuthorClick} />
        <BooksGrid
          selectedAuthor={selectedAuthor}
          books={books}
          loading={loadingBooks}
          errorMessage={errorMessage}
          onRowClick={setSelectedBook}
          onCreate={openCreateModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
          canEdit={selectedBook !== null}
        />
      </div>

      {isModalOpen && selectedAuthor && (
        <BookModal
          key={`${isEditMode ? 'edit' : 'create'}-${selectedBook?.id ?? 'new'}-${selectedAuthor.id}`}
          isOpen={isModalOpen}
          isEditMode={isEditMode}
          selectedAuthor={selectedAuthor}
          selectedBook={selectedBook}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
}
