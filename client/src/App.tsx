import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { LibraryPage } from './components/library/LibraryPage';
import styles from './App.module.scss';

const DASHBOARD_MENU = ['Библиотека', 'Аналитика', 'Пользователи'];

function App() {
  const [activeMenu, setActiveMenu] = useState('Библиотека');

  return (
    <div className={styles.layout}>
      <Sidebar menuItems={DASHBOARD_MENU} activeItem={activeMenu} onSelect={setActiveMenu} />

      <main className={styles.main}>
        {activeMenu === 'Библиотека' ? (
          <LibraryPage />
        ) : (
          <section className={styles.placeholder}>
            <header>
              <h1>{activeMenu}</h1>
              <p>Демонстрационный раздел Dashboard.</p>
            </header>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
