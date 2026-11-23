import { useState } from 'react';
import { uploadDocument } from '../services/apiClient';

export default function UploadComponent({ userId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!file) {
      setMessage('Selecione um arquivo antes de enviar.');
      return;
    }

    setIsUploading(true);
    setMessage('');
    try {
      await uploadDocument(file, userId);
      form.reset();
      setFile(null);
      setMessage('Documento enviado com sucesso.');
      onUploaded();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(event) => setFile(event.target.files[0] || null)}
        disabled={isUploading}
      />
      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Enviando...' : 'Enviar'}
      </button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}
