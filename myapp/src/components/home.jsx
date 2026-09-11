import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate } from 'react-router-dom';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import RequestHandeler from '../post_get'

const baseUrl = process.env.REACT_APP_BASE_URL;
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function HomePage() {
  const [library, setLibrary] = useState({});
  const navigate=useNavigate();
  const requestHandel= new RequestHandeler(baseUrl)
  const token = localStorage.getItem('accessToken'); // Retrieve your saved JWT



  useEffect(() => {
    requestHandel.get('/api/books',setLibrary,navigate)
  }, []);

function onSelectBook(pdfUrl){
  localStorage['chosenBook']=pdfUrl
  navigate('/book');
}

  return (
    <div style={styles.container}>
      <h2>Library Catalog</h2>
      {Object.entries(library).map(([field, books]) => (
        <div key={field} style={styles.section}>
          <h3 style={styles.fieldHeader}>{field}</h3>
          <div style={styles.grid}>
            {books.map((book) => {
              const pdfUrl = baseUrl+`/api/books/file?path=${book.id}`;

              const pdfSource = {
              url: pdfUrl,
              httpHeaders: {
                Authorization: `Bearer ${token}`
              },
              withCredentials: false
            };
              return (
                <div
                  key={book.id}
                  style={styles.card}
                  onClick={() => onSelectBook(pdfUrl)}
                >
                  <div style={styles.coverWrapper}>
                    <Document file={pdfSource} loading={<div style={styles.placeholder}>Loading...</div>}>
                      <Page
                        pageNumber={1}
                        width={140}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                  </div>
                  <div style={styles.bookTitle}>{book.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' },
  section: { marginBottom: '32px' },
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
    width: '140px',
    height: '190px',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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