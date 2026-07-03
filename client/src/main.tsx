import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ClientSideRowModelModule,
  InfiniteRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './styles/global.scss';
import App from './App.tsx';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  InfiniteRowModelModule,
  ValidationModule,
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
