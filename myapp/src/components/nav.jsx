import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'History', path: '/history' },
    { label: 'Continue Reading', path: '/book' },
  ];

  return (
    <nav style={styles.navContainer}>
      <div style={styles.navBrand}>PDF Reader</div>
      <div style={styles.navLinks}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const styles = {
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: '12px 24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    fontFamily: 'sans-serif',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navBrand: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  navLinks: {
    display: 'flex',
    gap: '16px',
  },
  link: {
    textDecoration: 'none',
    color: '#555',
    fontWeight: '500',
    fontSize: '0.95rem',
    padding: '6px 12px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  activeLink: {
    color: '#007bff',
    backgroundColor: '#e7f1ff',
    fontWeight: 'bold',
  },
};