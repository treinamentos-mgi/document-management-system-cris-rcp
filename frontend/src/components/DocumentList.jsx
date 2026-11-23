import DownloadButton from './DownloadButton';

export default function DocumentList({ documents, userId }) {
  if (documents.length === 0) {
    return <p>Nenhum documento enviado.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Tipo</th>
          <th>Tamanho (bytes)</th>
          <th>Enviado em</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((metadata) => (
          <tr key={metadata.id}>
            <td>{metadata.originalName}</td>
            <td>{metadata.mimeType}</td>
            <td>{metadata.size}</td>
            <td>{new Date(metadata.uploadedAt).toLocaleString('pt-BR')}</td>
            <td>
              <DownloadButton metadata={metadata} userId={userId} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
