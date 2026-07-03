import { useCallback, useMemo, useState, type ComponentType } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
} from 'ag-grid-community';
import { fetchAuthors } from '../../api';
import type { Author } from '../../types';
import styles from './AuthorsGrid.module.scss';

const AgGrid = AgGridReact as unknown as ComponentType<Record<string, unknown>>;

const PAGE_SIZE = 20;

interface AuthorsGridProps {
  onRowClicked: (event: RowClickedEvent<Author>) => void;
}

export function AuthorsGrid({ onRowClicked }: AuthorsGridProps) {
  const [totalRows, setTotalRows] = useState<number | null>(null);

  const columnDefs = useMemo<ColDef<Author>[]>(
    () => [
      { headerName: 'ID', field: 'id', maxWidth: 90 },
      { headerName: 'Автор', field: 'full_name', flex: 1, minWidth: 180 },
      { headerName: 'Дата рождения', field: 'birth_date', flex: 1, minWidth: 150 },
      { headerName: 'Рейтинг', field: 'rating', maxWidth: 120 },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<Author>>(
    () => ({
      sortable: false,
    }),
    []
  );

  const datasource = useMemo<IDatasource>(
    () => ({
      getRows: async (params: IGetRowsParams) => {
        const limit = params.endRow - params.startRow;
        const offset = params.startRow;
        try {
          const result = await fetchAuthors(limit, offset);
          setTotalRows(result.total);
          params.successCallback(result.items, result.total);
        } catch {
          params.failCallback();
        }
      },
    }),
    []
  );

  const handleGridReady = useCallback(
    (event: GridReadyEvent<Author>) => {
      event.api.setGridOption('datasource', datasource);
    },
    [datasource]
  );

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Авторы</h2>
          <p className={styles.hint}>
            {totalRows !== null && `Всего записей: ${totalRows}`}
          </p>
        </div>
      </div>
      <div className={`${styles.grid} ag-theme-quartz-dark`}>
        <AgGrid
          theme="legacy"
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType="infinite"
          cacheBlockSize={PAGE_SIZE}
          infiniteInitialRowCount={PAGE_SIZE}
          maxBlocksInCache={5}
          maxConcurrentDatasourceRequests={1}
          overlayNoRowsTemplate="Данных нет"
          onGridReady={handleGridReady}
          onRowClicked={onRowClicked}
        />
      </div>
    </section>
  );
}
