# DevOps Test Project

🇬🇧 [English](#english) | 🇷🇺 [Русский](#russian)

---

# English

## Overview

This project demonstrates a production-like DevOps environment for deploying a fullstack application.

The goal of the project is to simulate a real-world infrastructure setup including deployment automation, security hardening, containerization, and observability.

The project is built as a learning journey from a basic server deployment to a production-ready DevOps architecture.

---

## Architecture

Application stack:

* **Frontend** — React (Vite)
* **Backend** — Node.js API
* **Database** — PostgreSQL
* **Reverse Proxy** — Nginx
* **Server** — Ubuntu VPS

Deployment strategy:

* release-based deployments
* symlink switching (`current -> release`)
* systemd service management
* rollback support

---

## Security (Defense in Depth)

The project implements a layered security model.

### SSH Hardening

* password authentication disabled
* root login disabled
* SSH key authentication only

Protects against SSH brute-force attacks.

### Fail2Ban

Fail2Ban monitors authentication logs and automatically blocks IP addresses after repeated failed login attempts.

Prevents automated brute-force attacks.

### Nginx Rate Limiting

Nginx limits request rate per client IP:

* 5 requests per second limit
* excessive traffic receives `429 Too Many Requests`

Protects backend services from:

* API abuse
* request flooding
* basic DDoS attempts

---

## Docker (Work in Progress)

The application is being migrated to containers using:

* multi-stage Docker builds
* isolated runtime environments
* reproducible deployments

---

## Project Structure

```
devops_test_project/
│
├── backend/
├── frontend/
├── infra/
├── docs/
└── README.md
```

---

## Goals of the Project

* Learn real DevOps practices
* Build production-like infrastructure
* Understand security fundamentals
* Implement CI/CD pipelines
* Add monitoring and logging

---

## Planned Improvements

* Docker Compose orchestration
* GitHub Actions CI/CD
* HTTPS (Let's Encrypt)
* Monitoring (Prometheus + Grafana)
* Centralized logging

---

---

# Russian

## Описание проекта

Этот проект демонстрирует инфраструктуру, приближенную к production-среде, для развёртывания fullstack-приложения.

Цель проекта — пройти путь от простого деплоя приложения до полноценной DevOps-архитектуры с безопасностью, контейнерами и мониторингом.

---

## Архитектура

Стек приложения:

* **Frontend** — React (Vite)
* **Backend** — Node.js API
* **Database** — PostgreSQL
* **Reverse Proxy** — Nginx
* **Сервер** — Ubuntu VPS

Стратегия деплоя:

* релизная модель (`releases`)
* переключение симлинка (`current`)
* управление через systemd
* возможность rollback

---

## Безопасность (многоуровневая защита)

В проекте реализована модель Defense in Depth — несколько уровней защиты сервера и приложения.

### SSH Hardening

* отключён вход по паролю
* запрещён вход под root
* используется только SSH-аутентификация по ключу

Защищает сервер от brute-force атак.

### Fail2Ban

Fail2Ban анализирует логи SSH и автоматически блокирует IP-адреса после нескольких неудачных попыток входа.

Предотвращает автоматический подбор паролей.

### Nginx Rate Limiting

Nginx ограничивает количество запросов с одного IP:

* максимум 5 запросов в секунду
* лишние запросы получают ответ `429 Too Many Requests`

Защищает backend от:

* спама запросов
* brute-force API
* простых DDoS атак.

---

## Docker (в процессе)

Проект постепенно мигрирует на контейнерную архитектуру:

* multi-stage Docker build
* изолированное окружение выполнения
* воспроизводимые деплои

---

## Структура проекта

```
devops_test_project/
│
├── backend/
├── frontend/
├── infra/
├── docs/
└── README.md
```

---

## Цели проекта

* изучение практик DevOps
* построение production-подобной инфраструктуры
* понимание базовой безопасности серверов
* внедрение CI/CD
* добавление мониторинга и логирования

---

## Планируемые улучшения

* Docker Compose
* CI/CD через GitHub Actions
* HTTPS (Let's Encrypt)
* Prometheus + Grafana
* централизованные логи
