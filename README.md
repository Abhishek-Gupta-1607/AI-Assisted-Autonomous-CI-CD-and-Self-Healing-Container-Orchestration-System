# AI-Assisted Autonomous CI/CD and Self-Healing Container Orchestration System

## 1. Project Overview
This project is an advanced, intelligent DevOps platform designed to autonomously manage microservice deployments. By integrating AI-driven monitoring with a robust CI/CD pipeline, the system detects deployment risks, mitigates failures in real-time, and provides self-healing infrastructure capabilities.

## 2. Problem Statement
Traditional CI/CD pipelines lack contextual awareness. Deployments that pass unit tests and health checks may still degrade performance under load or suffer from resource leaks. Manual monitoring and rollbacks increase downtime and operational overhead.

## 3. Proposed Solution
An autonomous DevOps system that monitors infrastructure health, predicts deployment risk scores using AI, and automatically triggers rollbacks if the predicted confidence drops below a healthy threshold.

## 4. System Architecture
- **Microservices Layer**: Three interconnected Spring Boot services (`user`, `product`, `order`).
- **Data Layer**: Centralized MySQL database.
- **Orchestration Layer**: Docker Compose managing the lifecycle of all containers.
- **AI Monitoring Layer**: A Python Flask service evaluating real-time metrics to assign risk/confidence scores.
- **Pipeline Layer**: Jenkins pipeline coordinating the build, test, deploy, and AI-verification stages.
- **Observability Layer**: Prometheus and Grafana collecting and visualizing actuator metrics.

## 5. Tech Stack
- **Backend**: Java 17, Spring Boot, Maven
- **Database**: MySQL 8
- **AI Service**: Python 3.11, Flask, Pandas, Scikit-learn
- **DevOps**: Docker, Docker Compose, Jenkins
- **Monitoring**: Prometheus, Grafana

## 6. CI/CD Workflow
1. Code pushed to repository.
2. Jenkins pulls code, runs `mvn clean install` and unit tests.
3. Docker images are built and spun up via `docker-compose up --build -d`.
4. Jenkins waits for health checks to pass.
5. Jenkins triggers the AI Monitoring Service to evaluate the deployment context.
6. Based on AI response, Jenkins marks deployment as successful or automatically triggers a rollback (`docker-compose down`).

## 7. AI Monitoring Workflow
The `deployment-monitor-service` expects JSON payloads containing metrics like `cpu_usage`, `memory_usage`, `restart_count`, `response_time_ms`, and `failed_requests`.
It processes these using a mock machine learning rule-engine to calculate a `risk_score` (0-100) and `confidence_score` (0-100), outputting actionable recommendations like "Continue Deployment" or "Rollback Recommended".

## 8. Docker Setup
All services have optimized Dockerfiles using `openjdk:17-jdk-slim` and `python:3.11-slim`. A single `docker-compose.yml` ties the microservices, databases, AI engine, and monitoring tools together in a secure bridge network.

## 9. Jenkins Setup
The project contains a declarative `Jenkinsfile` structured into stages. To run:
1. Configure a Jenkins Pipeline job.
2. Point to this repository/directory.
3. Ensure Docker and Maven are available on the Jenkins agent.

## 10. API Endpoints
- **User Service (8081)**: `GET /users`, `POST /users`
- **Product Service (8082)**: `GET /products`, `POST /products`
- **Order Service (8083)**: `GET /orders`, `POST /orders`
- **AI Monitor (5000)**: `POST /analyze` (Body: `{"cpu_usage": 45, "restart_count": 0, ...}`)

## 11. Monitoring Setup
- **Prometheus (9090)**: Automatically scrapes `/actuator/prometheus` from Spring Boot services.
- **Grafana (3000)**: Pre-configured to read from Prometheus to visualize container health.

## 12. Patent Novelty
This project introduces several innovative concepts suitable for patent consideration:
- **AI-assisted deployment risk prediction**: Contextual analysis of system metrics post-deployment rather than relying strictly on binary health checks.
- **Self-healing container orchestration**: Reactive restart logic paired with AI-triggered rollbacks.
- **Intelligent rollback recommendation**: Automated pipeline decisions based on continuous confidence scoring.
- **Autonomous CI/CD monitoring**: CI/CD pipelines that do not finish once deployed, but wait for AI consensus on operational health.

## 13. Future Scope
- Integration of a robust Deep Learning model trained on historical deployment data.
- Transitioning from Docker Compose to Kubernetes (K8s) for enterprise scalability.
- Implementation of A/B deployment scoring and automated traffic shifting.
