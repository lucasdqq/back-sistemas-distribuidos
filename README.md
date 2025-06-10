# 🗳️ Sistema Distribuído de Votação - Backend do Grupo

Este é o backend do grupo para o projeto de Sistemas Distribuídos, onde cada equipe desenvolve sua própria aplicação de votação. Todos os backends se comunicam com um sistema central (core) via RabbitMQ.

---

## 📦 Tecnologias utilizadas

- Node.js
- RabbitMQ (fila `core.votos`)
- Firebase Firestore (armazenamento dos votos)
- amqplib, firebase-admin, chalk, ora

---

## 🚀 Funcionalidades

- Envia votos para o core por RabbitMQ
- Armazena votos localmente no Firebase Firestore
- Scripts auxiliares com feedback no terminal

---

## 🛠️ Instalação

### Pré-requisitos:
- Node.js instalado
- RabbitMQ rodando localmente (porta padrão 5672)
- Conta no Firebase com Firestore habilitado
- Chave de conta de serviço (`firebase-config.json`) na raiz do projeto

### Instalar dependências:

```bash
npm install
```

---

## ▶️ Como executar

### Enviar um voto:

```bash
node coletor-voto-firebase.js 1
```

- Envia o voto `1` para o core
- Salva o mesmo voto no Firebase
- Aceita também `2` como argumento

---

## 🧪 Testes e scripts auxiliares

- `coletor-voto-visual-commonjs.js`: versão com feedback colorido no terminal
- `coletor-voto-firebase.js`: integração com Firebase
- `simulador.js`: (opcional) simula múltiplos votos

---

## 📁 Estrutura esperada

```
.
├── coletor-voto-firebase.js
├── coletor-voto-visual-commonjs.js
├── firebase-config.json
├── package.json
├── node_modules/
```

---

## 🧠 Observações

- A fila `core.votos` deve estar sendo consumida pelo core do projeto
- O Firestore criará automaticamente a coleção `votos`
- A pasta `node_modules` está no `.gitignore` e **não deve ser versionada**

---

## 👩‍💻 Desenvolvido por

Grupo X – Disciplina Sistemas Distribuídos