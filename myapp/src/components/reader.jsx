import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import RequestHandeler from '../post_get';
import { useNavigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const VIRTUAL_BUFFER = 2;
const baseUrl = process.env.REACT_APP_BASE_URL;

export default function PDFViewer() {
  const filePath = localStorage['chosenBook'];
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(100);
  const [inputPage, setInputPage] = useState('100');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );
  const [pageWidth, setPageWidth] = useState(window.innerWidth);

  const viewerContainerRef = useRef(null);
  const containerRef = useRef(null);
  const pageRefs = useRef({});
  const initialScrolledRef = useRef(false);

  const requestHandeler = useMemo(() => new RequestHandeler(baseUrl), []);
  const navigate = useNavigate();

  // Memoize pdfSource
  const pdfSource = useMemo(() => {
    const token = localStorage.getItem('accessToken');
    return {
      url: filePath,
      httpHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: false
    };
  }, [filePath]);

  // Fetch initial bookmark
  useEffect(() => {
    let isMounted = true;
    requestHandeler.get(
      "/api/users/history/bookmark",
      (res) => {
        if (!isMounted) return;
        // Accept res.page if backend returns an object, or res if number
        const pageNum = typeof res === 'object' ? res?.page : res;
        if (pageNum) {
          setCurrentPage(Number(pageNum));
          setInputPage(String(pageNum));
        }
      },
      navigate,
      { "bookName": filePath }
    ).then(() => {
      if (isMounted) setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [filePath, navigate, requestHandeler]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);

      if (landscape) {
        setPageWidth(window.innerWidth);
      } else {
        setPageWidth(Math.min(window.innerWidth * 0.95, 800));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Fullscreen Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Sync Input & Persist to Backend (Debounced)
  useEffect(() => {
    setInputPage(String(currentPage));
    if (!loading && initialScrolledRef.current) {
      const timer = setTimeout(() => {
        requestHandeler.post(
          '/api/users/history/update',
          { "bookName": filePath, "page": currentPage },
          () => {},
          navigate
        );
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentPage, loading, filePath, navigate, requestHandeler]);

  // Execute Initial Jump to `currentPage` when Document and Bookmark load
  useEffect(() => {
    if (!numPages || initialScrolledRef.current) return;

    const targetPage = Math.min(Math.max(currentPage, 1), numPages);
    const targetElement = pageRefs.current[targetPage];

    if (targetElement) {
      // Small timeout ensures virtual wrapper heights have populated in DOM
      const timer = setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        initialScrolledRef.current = true;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [numPages, loading, currentPage]);

  // IntersectionObserver for tracking current page during continuous scrolling
  useEffect(() => {
    if (!numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Block observer state changes until initial scroll to target page completes
        if (!initialScrolledRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = Number(entry.target.getAttribute('data-page-number'));
            if (pageNum) {
              setCurrentPage(pageNum);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.3,
      }
    );

    const currentRefs = pageRefs.current;
    Object.values(currentRefs).forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [numPages]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      if (viewerContainerRef.current?.requestFullscreen) {
        await viewerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handlePageSubmit(e) {
    e.preventDefault();
    const targetPage = parseInt(inputPage, 10);
    if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= numPages) {
      const pageElement = pageRefs.current[targetPage];
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    } else {
      setInputPage(String(currentPage));
    }
  }

  return (
    <div ref={viewerContainerRef} style={styles.container}>
      {!isLandscape ? (
        <div style={styles.toolbar}>
          <form onSubmit={handlePageSubmit} style={styles.form}>
            <span>Page </span>
            <input
              type="number"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              style={styles.input}
              min={1}
              max={numPages || 1}
            />
            <span> of {numPages || '--'}</span>
            <button type="submit" style={styles.goBtn}>
              Go
            </button>
          </form>

          <button onClick={toggleFullscreen} style={styles.fullscreenBtn}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      ) : (
        <div style={styles.landscapePageBadge}>
          {currentPage}
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          ...styles.pdfContainer,
          padding: isLandscape ? '0' : '16px 0',
        }}
      >
        <Document file={pdfSource} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages || 0), (_, index) => {
            const pageNum = index + 1;
            const shouldRender = Math.abs(pageNum - currentPage) <= VIRTUAL_BUFFER;

            return (
              <div
                key={pageNum}
                data-page-number={pageNum}
                ref={(el) => (pageRefs.current[pageNum] = el)}
                style={{
                  ...styles.pageWrapper,
                  margin: isLandscape ? '0 0 8px 0' : '0 auto 16px auto',
                  minHeight: pageWidth * 1.3,
                }}
              >
                {shouldRender ? (
                  <Page
                    pageNumber={pageNum}
                    width={pageWidth}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                ) : (
                  <div
                    style={{
                      width: pageWidth,
                      height: pageWidth * 1.3,
                      backgroundColor: '#1a1a1a',
                    }}
                  />
                )}
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '8px 16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    zIndex: 10,
    flexShrink: 0,
  },
  landscapePageBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 100,
    backgroundColor: 'rgba(240, 240, 240, 0.85)',
    color: '#333333',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    pointerEvents: 'none',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  input: {
    width: '55px',
    padding: '4px 6px',
    textAlign: 'center',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  goBtn: {
    padding: '4px 12px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  fullscreenBtn: {
    padding: '4px 12px',
    backgroundColor: '#6c757d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  pdfContainer: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
  },
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
};