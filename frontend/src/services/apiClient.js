const API_PREFIX = '/api';

async function request(path, { userId, ...options } = {}) {
  const headers = { ...options.headers, 'X-User-Id': userId };

  let response;
  try {
    response = await fetch(`${API_PREFIX}${path}`, { ...options, headers });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response;
}

async function readErrorMessage(response) {
  try {
    const body = await response.json();
    return body.error || `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}

export async function uploadDocument(file, userId) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await request('/upload', { method: 'POST', body: formData, userId });
  return response.json();
}

export async function listDocuments(userId) {
  const response = await request('/documents', { userId });
  return response.json();
}

export async function downloadDocument(id, userId) {
  const response = await request(`/documents/${encodeURIComponent(id)}/download`, { userId });
  return response.blob();
}
