import styles from './Sidebar.module.scss';

interface SidebarProps {
  menuItems: string[];
  activeItem: string;
  onSelect: (item: string) => void;
}

export function Sidebar({ menuItems, activeItem, onSelect }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Material Style Dashboard</div>
      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            className={item === activeItem ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
