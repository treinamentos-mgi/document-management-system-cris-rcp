# Especificação - Document Management System (DMS)

## 1. Objetivo

Entregar um sistema web que permita a usuários enviar, listar e baixar documentos, com armazenamento local à aplicação.

## 2. Escopo

### Dentro do escopo

- Upload de documentos (multipart/form-data, via `multer` com `diskStorage`)
- Listagem de documentos do usuário
- Download de documentos pelo identificador
- Gestão simples por usuário (dono do documento)
- Interface React para envio, listagem e download

### Fora do escopo

- Armazenamento externo ou em nuvem (S3, Drive etc.)
- Versionamento de documentos
- Autenticação completa (login, senha, tokens); o usuário é identificado de forma simples
- Edição, exclusão e compartilhamento de documentos
- Persistência em banco de dados (metadados ficam em memória nesta fase)
- TypeScript

## 3. Requisitos funcionais

| ID    | Requisito                                                          |
| ----- | ------------------------------------------------------------------ |
| RF-01 | O usuário pode enviar um documento                                 |
| RF-02 | O sistema registra nome original, tamanho, data de upload e dono   |
| RF-03 | O usuário pode listar os documentos que enviou                     |
| RF-04 | O usuário pode baixar um documento pelo identificador              |
| RF-05 | O sistema rejeita envio sem arquivo ou acima do limite configurado |
| RF-06 | O sistema rejeita download de documento inexistente (404)          |
| RF-07 | O frontend exibe erros de envio e download de forma compreensível  |

## 4. Requisitos não funcionais

| ID     | Requisito                                                                  |
| ------ | -------------------------------------------------------------------------- |
| RNF-01 | Arquivos gravados no filesystem local em `backend/storage` via `multer`    |
| RNF-02 | Metadados mantidos em memória nesta fase                                   |
| RNF-03 | Configuração via variáveis de ambiente (12-Factor)                         |
| RNF-04 | Backend em Node.js + Express (CommonJS); testes com `node:test`            |
| RNF-05 | Frontend em React + Vite (ESM), comunicação via `fetch` com prefixo `/api` |
| RNF-06 | Nenhum serviço externo de armazenamento ou upload de terceiros             |

## 5. Modelo de dados

### Metadados do documento

| Campo        | Tipo   | Descrição                                             |
| ------------ | ------ | ----------------------------------------------------- |
| id           | string | Identificador único (UUID)                            |
| originalName | string | Nome original do arquivo enviado                      |
| storedName   | string | Nome do arquivo gravado em `backend/storage`          |
| mimeType     | string | Tipo MIME informado no upload                         |
| size         | number | Tamanho em bytes                                      |
| uploadedAt   | string | Data/hora do upload (ISO 8601)                        |
| owner        | string | Identificador do usuário dono (cabeçalho `X-User-Id`) |

Observação: os metadados ficam em um `Map` no repositório; ao reiniciar o servidor, os registros são perdidos e os arquivos permanecem em disco.

## 6. Contratos de API

Prefixo público no frontend: `/api` (proxy do Vite). Identificação simples do usuário via cabeçalho `X-User-Id`.

### POST /upload

- Entrada: `multipart/form-data` com campo `file`
- Sucesso: `201 Created`

  ```json
  {
    "id": "b1c2...",
    "originalName": "contrato.pdf",
    "size": 20480,
    "mimeType": "application/pdf",
    "uploadedAt": "2026-11-23T12:00:00.000Z",
    "owner": "user-1"
  }
  ```

- Erros: `400` (sem arquivo), `413` (arquivo acima do limite), `401` (sem `X-User-Id`)

### GET /documents

- Saída: `200 OK` com array de metadados dos documentos do usuário
- Erros: `401` (sem `X-User-Id`)

### GET /documents/:id/download

- Saída: `200 OK` com o conteúdo binário, `Content-Type` do documento e `Content-Disposition: attachment; filename="..."`
- Erros: `404` (inexistente ou de outro usuário), `401` (sem `X-User-Id`)

### Formato de erro padrão

```json
{ "error": "Mensagem ao usuário em português" }
```

## 7. Decisões arquiteturais

- Clean Architecture simples no backend (`backend/src`):
  - `routes/`: definem endpoints e delegam aos controllers
  - `controllers/`: entrada/saída HTTP e validação básica
  - `services/`: regras de negócio (limites, ownership, geração de id)
  - `repositories/`: persistência (filesystem via multer e `Map` em memória)
  - Fluxo: `routes -> controllers -> services -> repositories`
- Configuração por variáveis de ambiente: porta, diretório de storage, tamanho máximo de upload
- Tratamento de erros nos limites: entrada HTTP e leitura/escrita de arquivos
- Frontend com componentes funcionais e Hooks, organizados em `components/`, `pages/`, `services/`
- Sem overengineering: sem ORM, sem autenticação completa, sem filas

## 8. Plano de execução

1. **Configuração base** - Definir variáveis de ambiente (porta, storage, limite de upload) e criar a pasta `backend/storage` no fluxo de inicialização.
2. **Repositório de documentos** - Implementar persistência em `Map` e gravação de arquivos com `multer` `diskStorage`. *Depende de 1.*
3. **Serviço de documentos** - Regras de upload, listagem por dono e obtenção para download. *Depende de 2.*
4. **Controllers e rotas** - Implementar `POST /upload`, `GET /documents` e `GET /documents/:id/download` com validação básica e tratamento de erros. *Depende de 3.*
5. **Testes do backend** - Cobrir upload, listagem, download, 404 e 401 com `node:test`. *Pode iniciar junto com 3 e 4.*
6. **Frontend: componentes base** - Criar componentes de upload e lista, e o serviço `fetch` com prefixo `/api`. *Paralelo ao backend, após 4 estar definido.*
7. **Frontend: páginas e fluxo** - Montar a página principal com envio, listagem e download, exibindo erros em português. *Depende de 6.*
8. **Verificação de integração** - Testar o fluxo completo pelo proxy do Vite e confirmar que os arquivos aparecem em `backend/storage`. *Depende de 4 e 7.*
9. **Documentação de execução** - Atualizar o README com comandos de instalação e execução. *Depende de 8.*

## Critérios de aceitação

- Upload, listagem e download funcionam pelo frontend e pela API
- Nenhum arquivo é enviado a serviços externos
- Testes `node:test` do backend passam
- Mensagens ao usuário e comentários em português; símbolos de código em inglês
