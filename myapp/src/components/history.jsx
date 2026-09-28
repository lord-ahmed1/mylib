import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate } from 'react-router-dom';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import RequestHandeler from '../post_get';
import Nav from './nav';

const baseUrl = process.env.REACT_APP_BASE_URL;
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function HistoryPage() {
  const [library, setLibrary] = useState([]);
  const navigate = useNavigate();
  const requestHandel = new RequestHandeler(baseUrl);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    requestHandel.get('/api/users/history', setLibrary, navigate);
  }, []);

  function onSelectBook(pdfUrl) {
    localStorage['chosenBook'] = pdfUrl;
    navigate('/book');
  }

  return (
    <div>
      <Nav />
      <div style={styles.container}>
        <h2>Library Catalog</h2>
        <h3 style={styles.fieldHeader}>History</h3>
        <div style={styles.grid}>
          {library.map((book) => {
            const pdfUrl = book.bookName;
            const currentPage = book.page || 1;

            const pdfSource = {
              url: pdfUrl,
              httpHeaders: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: false,
            };

            return (
              <div
                key={book.id || book._id}
                style={styles.card}
                onClick={() => onSelectBook(pdfUrl)}
              >
                <div style={styles.coverWrapper}>
                  <Document
                    file={pdfSource}
                    loading={<div style={styles.placeholder}>Loading...</div>}
                  >
                    <Page
                      pageNumber={1}
                      width={140}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>

                  {/* Dark Strip Badge for Last Read Page */}
                  <div style={styles.pageBadge}>
                    Page {currentPage}
                  </div>
                </div>
                <div style={styles.bookTitle}>{book.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' },
  fieldHeader: { textTransform: 'capitalize', borderBottom: '2px solid #ddd', paddingBottom: '8px', color: '#333' },
  grid: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '16px' },
  card: {
    width: '140px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'transform 0.2s ease',
  },
  coverWrapper: {
    position: 'relative', // Enables absolute positioning for the dark strip
    width: '140px',
    height: '190px',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pageBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(24, 28, 36, 0.88)', // Dark semi-transparent strip
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '600',
    textAlign: 'center',
    padding: '4px 0',
    backdropFilter: 'blur(2px)',
  },
  placeholder: { fontSize: '12px', color: '#6c757d' },
  bookTitle: {
    padding: '8px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};