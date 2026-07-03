import { useState, type SyntheticEvent } from 'react';
import type { Author, Book, BookPayload } from '../../types';
import styles from './BookModal.module.scss';

type BookFormState = {
  title: string;
  published_date: string;
  price: string;
  pages: string;
};

type FormErrors = Partial<Record<keyof BookFormState, string>>;

interface BookModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  selectedAuthor: Author;
  selectedBook: Book | null;
  onClose: () => void;
  onSubmit: (payload: BookPayload, bookId?: number) => Promise<void>;
}

function toInitial(book: Book | null): BookFormState {
  if (book === null) {
    return { title: '', published_date: '', price: '', pages: '' };
  }
  return {
    title: book.title,
    published_date: book.published_date,
    price: String(book.price),
    pages: String(book.pages),
  };
}

function validate(form: BookFormState): FormErrors {
  const errors: FormErrors = {};
  if (form.title.trim().length === 0) {
    errors.title = 'Введите название книги';
  } else if (form.title.length > 200) {
    errors.title = 'Максимум 200 символов';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.published_date)) {
    errors.published_date = 'Дата должна быть в формате YYYY-MM-DD';
  }
  const price = Number(form.price);
  if (!Number.isFinite(price) || price < 0) {
    errors.price = 'Цена должна быть числом >= 0';
  }
  const pages = Number(form.pages);
  if (!Number.isInteger(pages) || pages < 1) {
    errors.pages = 'Страницы: целое число >= 1';
  }
  return errors;
}

export function BookModal({
  isOpen,
  isEditMode,
  selectedAuthor,
  selectedBook,
  onClose,
  onSubmit,
}: BookModalProps) {
  const [form, setForm] = useState<BookFormState>(() => toInitial(selectedBook));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    try {
      await onSubmit(
        {
          author_id: selectedAuthor.id,
          title: form.title.trim(),
          published_date: form.published_date,
          price: Number(form.price),
          pages: Number(form.pages),
        },
        selectedBook?.id
      );
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Ошибка сохранения');
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <h3>{isEditMode ? 'Изменение книги' : 'Добавление книги'}</h3>
        <p className={styles.subtitle}>Автор: {selectedAuthor.full_name}</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Название
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </label>
          <label>
            Дата издания
            <input
              type="date"
              value={form.published_date}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, published_date: event.target.value }))
              }
            />
            {errors.published_date && <span className={styles.error}>{errors.published_date}</span>}
          </label>
          <label>
            Цена
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            />
            {errors.price && <span className={styles.error}>{errors.price}</span>}
          </label>
          <label>
            Страницы
            <input
              type="number"
              min="1"
              step="1"
              value={form.pages}
              onChange={(event) => setForm((prev) => ({ ...prev, pages: event.target.value }))}
            />
            {errors.pages && <span className={styles.error}>{errors.pages}</span>}
          </label>
          {submitError && <p className={styles.submitError}>{submitError}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.ghost} onClick={onClose}>
              Отмена
            </button>
            <button type="submit">{isEditMode ? 'Сохранить' : 'Создать'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
