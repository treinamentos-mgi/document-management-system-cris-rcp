---
description: Valida a entrega do DMS rodando os testes do backend, o build do frontend e conferindo a conformidade com a especificação.
name: validar-entrega
argument-hint: escopo opcional (ex. backend, frontend ou tudo)
agent: agent
---

# Validar entrega do DMS

Valide a entrega atual do projeto no escopo `${input:escopo:backend, frontend ou tudo}`.

Passos:

1. Execute `npm test` em `backend` e informe o total de testes, aprovados e falhas.
2. Execute `npm run build` em `frontend` e informe se o build passou.
3. Compare o código com [docs/specs/dms-spec.md](docs/specs/dms-spec.md) e verifique os endpoints `POST /upload`, `GET /documents` e `GET /documents/:id/download`, incluindo os códigos de status `400`, `401`, `404` e `413`.
4. Confirme que o backend não usa serviços externos de armazenamento e que os uploads vão para `backend/storage`.

Requisitos:

- Não altere arquivos. Apenas reporte.
- Liste cada divergência com link para o arquivo e a linha, no formato `[arquivo](arquivo#L10)`.
- Termine com um veredito: `Pronto` ou `Pendências`, seguido das pendências priorizadas.
