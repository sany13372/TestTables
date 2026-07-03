import { useMemo, type ComponentType } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, RowClickedEvent } from 'ag-grid-community';
import type { Author, Book } from '../../types';
import styles from './BooksGrid.module.scss';

const AgGrid = AgGridReact as unknown as ComponentType<Record<string, unknown>>;

interface BooksGridProps {
  selectedAuthor: Author | null;
  books: Book[];
  loading: boolean;
  errorMessage: string | null;
  onRowClick: (book: Book | null) => void;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
}

export function BooksGrid({
  selectedAuthor,
  books,
  loading,
  errorMessage,
  onRowClick,
  onCreate,
  onEdit,
  onDelete,
  canEdit,
}: BooksGridProps) {
  const noRowsText = selectedAuthor ? 'Данных нет' : 'Выберите автора';

  const columnDefs = useMemo<ColDef<Book>[]>(
    () => [
      { headerName: 'ID', field: 'id', maxWidth: 90 },
      { headerName: 'Название', field: 'title', flex: 1, minWidth: 220 },
      { headerName: 'Дата издания', field: 'published_date', flex: 1, minWidth: 150 },
      { headerName: 'Цена', field: 'price', maxWidth: 120 },
      { headerName: 'Страницы', field: 'pages', maxWidth: 120 },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<Book>>(
    () => ({
      sortable: false,
    }),
    []
  );

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Книги</h2>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={onCreate} disabled={!selectedAuthor}>
            Добавить запись
          </button>
          <button type="button" onClick={onEdit} disabled={!canEdit}>
            Изменить
          </button>
          <button type="button" className={styles.danger} onClick={onDelete} disabled={!canEdit}>
            Удалить
          </button>
        </div>
      </div>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <div className={`${styles.grid} ag-theme-quartz-dark`}>
        <AgGrid
          theme="legacy"
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={books}
          loading={loading}
          overlayNoRowsTemplate={noRowsText}
          onRowClicked={(event: RowClickedEvent<Book>) => onRowClick(event.data ?? null)}
        />
      </div>
    </section>
  );
}
