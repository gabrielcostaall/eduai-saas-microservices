# EduAI – Microservices Architecture with AI Integration

EduAI is an educational AI assistant built with a modern microservices architecture. The project simulates the modernization of a legacy monolithic system into distributed services, focusing on scalability, modularization, and AI integration.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Gateway API | Node.js + Express |
| AI Microservice | Python + FastAPI |
| Database | MySQL |
| Containerization | Docker |

---

## Architecture Overview

```
Client (Next.js)
      │
      ▼
Gateway API (Node.js / Express)
      │
      ├── Auth & User Management
      ├── Conversation History (MySQL)
      └── AI Requests
            │
            ▼
      AI Microservice (FastAPI)
            │
            ▼
      OpenAI API
```

---

## Services

### Gateway API (Node.js)
Central entry point for all client requests. Handles routing, authentication (JWT), user management, conversation history, and communication with the AI microservice.

### AI Microservice (FastAPI)
Receives messages from the Gateway and processes them through the OpenAI API, returning responses to the client.

### Frontend (Next.js)
Chat interface where users can create accounts, start conversations with the AI, and review their conversation history.

---

## Running Locally

Make sure you have **Docker** and **Docker Compose** installed.

1. Clone the repository and navigate to the project root
2. Copy the environment file and fill in the variables:
```bash
cp .env.example .env
```
3. Start all services:
```bash
docker-compose up --build
```

### Services available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:3002 |
| Gateway API | http://localhost:3000 |
| Gateway Docs (Swagger) | http://localhost:3000/api-docs |
| AI Service Docs | http://localhost:8000/docs |

> **Recruiter access:** A demo account is available at the login screen. Click *"É um(a) recrutador(a)? Clique aqui"* to log in automatically. Conversation history is cleared on every login.

---

## Project Goals

- Demonstrate a microservices-based architecture in practice
- Integrate AI into a modular, scalable system
- Simulate a SaaS environment with JWT authentication
- Apply Docker-based infrastructure for local development

## Author

**Gabriel Costa**  
*Computer Science Student at CEFET/RJ* 
*Backend Developer | Microservices & API Design*


📍 Rio de Janeiro, Brazil  
🔗 LinkedIn: https://linkedin.com/in/gabrielcostaall

