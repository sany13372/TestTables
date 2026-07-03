
DROP DATABASE IF EXISTS library;
CREATE DATABASE library;

\connect library

DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
    id           SERIAL       PRIMARY KEY,        
    full_name    VARCHAR(150) NOT NULL,           
    birth_date   DATE         NOT NULL,           
    rating       NUMERIC(3, 2) NOT NULL DEFAULT 0
);

CREATE TABLE books (
    id             SERIAL        PRIMARY KEY,      
    author_id      INTEGER       NOT NULL,         
    title          VARCHAR(200)  NOT NULL,         
    published_date DATE          NOT NULL,         
    price          NUMERIC(8, 2) NOT NULL DEFAULT 0,
    pages          INTEGER       NOT NULL DEFAULT 0,
    CONSTRAINT fk_books_author
        FOREIGN KEY (author_id)
        REFERENCES authors (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_books_author_id ON books (author_id);

INSERT INTO authors (full_name, birth_date, rating) VALUES
    ('Лев Толстой',        '1828-09-09', 9.80),
    ('Фёдор Достоевский',  '1821-11-11', 9.60),
    ('Антон Чехов',        '1860-01-29', 9.20),
    ('Михаил Булгаков',    '1891-05-15', 9.40),
    ('Александр Пушкин',   '1799-06-06', 9.90);

INSERT INTO books (author_id, title, published_date, price, pages) VALUES
    (1, 'Война и мир',            '1869-01-01', 1200.00, 1225),
    (1, 'Анна Каренина',          '1878-01-01',  850.50,  864),
    (2, 'Преступление и наказание','1866-01-01', 780.00,  671),
    (2, 'Идиот',                  '1869-01-01',  690.00,  640),
    (3, 'Вишнёвый сад',           '1904-01-01',  320.00,  120),
    (4, 'Мастер и Маргарита',     '1967-01-01',  950.00,  480),
    (5, 'Евгений Онегин',         '1833-01-01',  540.00,  240);

INSERT INTO authors (full_name, birth_date, rating)
SELECT
  'Тестовый автор #' || gs,
  DATE '1950-01-01' + ((gs * 13) % 20000),
  ROUND((1 + (gs % 5) + (gs % 100) / 100.0)::numeric, 2)
FROM generate_series(6, 260) AS gs;

INSERT INTO books (author_id, title, published_date, price, pages)
SELECT
  a.id,
  'Книга ' || n.num || ' автора #' || a.id,
  DATE '1990-01-01' + ((a.id * n.num * 7) % 12000),
  ROUND((150 + ((a.id * n.num) % 2500))::numeric, 2),
  100 + ((a.id * n.num) % 900)
FROM authors a
JOIN LATERAL (
  SELECT gs AS num
  FROM generate_series(1, CASE WHEN a.id % 3 = 0 THEN 4 ELSE 2 END) AS gs
) AS n ON true
WHERE a.id >= 6;