import { useCallback, useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { listDocuments } from './services/apiClient';

export default function App() {
  const [userId, setUserId] = useState('usuario-1');
  const [documents, setDocuments] = useState([]);
  const [loadError, setLoadError] = useState('');

  const loadDocuments = useCallback(async () => {
    try {
      setDocuments(await listDocuments(userId));
      setLoadError('');
    } catch (error) {
      setLoadError(error.message);
    }
  }, [userId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Document Management System</h1>

      <label>
        Usuário:{' '}
        <input value={userId} onChange={(event) => setUserId(event.target.value)} />
      </label>

      <section>
        <h2>Enviar documento</h2>
        <UploadComponent userId={userId} onUploaded={loadDocuments} />
      </section>

      <section>
        <h2>Documentos</h2>
        {loadError && <p role="alert">{loadError}</p>}
        <DocumentList documents={documents} userId={userId} />
      </section>
    </main>
  );
}
