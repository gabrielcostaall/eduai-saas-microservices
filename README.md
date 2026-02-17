# EduAI SaaS – Microservices Architecture

EduAI is a SaaS-style educational AI platform built using a modern microservices architecture.

This project simulates the modernization of a legacy monolithic system into distributed services, focusing on scalability, modularization, and AI integration.

---

## Architecture

- **Gateway API** -> Node.js (Express)
- **AI Microservice** -> Python (FastAPI)
- **Database** -> MySQL
- **Containerization** -> Docker
- **Frontend** -> Next.js

## Architecture flow

Client
   │
   ▼
Gateway API (Node.js)
   │
   ▼
AI Microservice (FastAPI)
   │
   ▼
MySQL Database


## Services

### 1 - Gateway API (Node.js)
Central entry point for all client requests.
Responsible for:
- Routing
- Microservice communication
- Error handling

### 2 - AI Service (FastAPI)
- Handles AI requests
- Persists question history
- Integrates with OpenAI API

### 3 - Database (MySQL)
Stores:
- Questions
- Answers
- Timestamps

---

## Running Locally

```bash
docker-compose up --build
```

# Services available at:

- Gateway -> http://localhost:3000

- AI Docs -> http://localhost:8000/docs

# Project Goals

- Demonstrate microservices transition

- Implement AI integration in a modular architecture

- Simulate SaaS environment

- Apply Docker-based infrastructure

## Author

**Gabriel Costa**  
*Computer Science Student at CEFET/RJ* 
*Backend Developer | Microservices & API Design*


📍 Rio de Janeiro, Brazil  
🔗 LinkedIn: https://linkedin.com/in/gabrielcostaall

