# Sistema de Votação Distribuído

Sistema de votação distribuído desenvolvido em TypeScript com Node.js, utilizando RabbitMQ para comunicação entre serviços e WebSocket para atualizações em tempo real.

## 🏗️ Arquitetura

O projeto segue uma arquitetura baseada em microsserviços com as seguintes características:

- **API REST**: Endpoints para receber votos
- **RabbitMQ**: Sistema de mensageria para comunicação entre serviços
- **WebSocket**: Atualizações em tempo real para clientes
- **TypeScript**: Tipagem estática para maior segurança

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── app.config.ts          # Configurações da aplicação
├── core/
│   ├── MessageSender.ts       # Envio de mensagens para RabbitMQ
│   └── MessageReceiver.ts     # Recebimento de mensagens do RabbitMQ
├── controllers/
│   └── MessageController.ts   # Controlador de votação
├── routes/
│   └── votacao.routes.ts      # Rotas da API
├── types/
│   └── message.types.ts       # Tipos TypeScript
├── websocket/
│   └── WebSocketHandler.ts    # Gerenciamento de WebSocket
└── app.ts                     # Arquivo principal da aplicação
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```env
# Configurações do Servidor
PORT=4012

# Configurações do RabbitMQ
RABBITMQ_HOST=chimpanzee.rmq.cloudamqp.com
RABBITMQ_PORT=5671
RABBITMQ_USERNAME=edxgujmk
RABBITMQ_PASSWORD=Wm1vy2ea99LIfZh-ZZyl3DhWlLDlNcdH
RABBITMQ_VIRTUAL_HOST=edxgujmk
RABBITMQ_SSL_ENABLED=true

# Configurações do Core
CORE_QUEUE=lotes_de_dados

# Configurações do Ambiente
NODE_ENV=development
```

### 3. Compilar o Projeto

```bash
npm run build
```

### 4. Executar a Aplicação

**Desenvolvimento:**

```bash
npm run dev
```

**Produção:**

```bash
npm start
```

## 📡 API Endpoints

### POST /api/votar/candidato/:id

Endpoint para registrar um voto para um candidato específico.

**Parâmetros:**

- `id` (path): ID do candidato

**Body:**

```json
{
  "type": "voto",
  "objectIdentifier": "candidato-123",
  "valor": 1,
  "datetime": "2024-01-15T10:30:00.000Z"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso",
  "batchId": "uuid-do-batch"
}
```

### GET /api/votar

Endpoint de health check da API.

**Resposta:**

```json
{
  "success": true,
  "message": "Backend de votação funcionando!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔌 WebSocket

O sistema suporta conexões WebSocket para atualizações em tempo real.

**URL:** `ws://localhost:4012`

**Eventos:**

- `connection`: Cliente conectado
- `message`: Mensagem recebida
- `close`: Cliente desconectado

## 🔧 Scripts Disponíveis

- `npm run build`: Compila o projeto TypeScript
- `npm run dev`: Executa em modo desenvolvimento com hot reload
- `npm start`: Executa em modo produção
- `npm test`: Executa os testes

## 🐳 Docker

Para executar com Docker:

```bash
# Construir a imagem
docker build -t sistema-votacao .

# Executar o container
docker run -p 4012:4012 --env-file .env sistema-votacao
```

## 📊 Monitoramento

O sistema inclui logs detalhados para monitoramento:

- ✅ Conexões bem-sucedidas
- ❌ Erros de conexão
- 📤 Mensagens enviadas
- 📥 Mensagens recebidas
- 🗳️ Votos processados

## 🔒 Segurança

- CORS configurado para origens específicas
- Validação de entrada nos endpoints
- Tratamento de erros robusto
- Graceful shutdown implementado

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
