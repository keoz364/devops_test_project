# 📦 DevOps Test Project

Production-like fullstack application deployed on **Ubuntu Server** with
**Nginx**, **systemd**, and a **release-based zero-downtime deployment
strategy**.

------------------------------------------------------------------------

## 🏗 Architecture

### Stack

-   **Ubuntu 20.04**
-   **Node.js 20**
-   **PostgreSQL**
-   **React (Vite build)**
-   **Nginx** --- reverse proxy + static serving
-   **systemd service** (backend)
-   **Release-based deployment with rollback**

------------------------------------------------------------------------

## 🌐 Production Topology

    Internet
       │
       ▼
    Nginx (port 80)
       ├── /      → static frontend (React build)
       └── /api   → reverse proxy → Node.js backend
                               │
                               ▼
                          PostgreSQL

------------------------------------------------------------------------

## 🚀 Deployment Strategy

Production deploy uses a **release-based directory structure**:

    /opt/devops_test_project
    ├── releases/
    │   ├── 20260224_120101
    │   ├── 20260224_121532
    │   └── ...
    ├── shared/
    │   └── backend/.env
    └── current -> releases/<active_release>

### Deploy Flow

1.  Clone repository into new release directory
2.  Install backend dependencies
3.  Build frontend (Vite production build)
4.  Atomically switch `current` symlink
5.  Restart backend via `systemd`
6.  Healthcheck `/api/health`
7.  If failed → automatic rollback to previous release
8.  Keep only last **5 releases**

Deployment command:

``` bash
sudo /opt/devops_test_project/shared/deploy.sh
```

------------------------------------------------------------------------

## 🔁 Rollback Mechanism

If healthcheck fails:

-   `current` symlink switches back
-   backend is restarted
-   nginx is reloaded
-   previous stable release is restored automatically

------------------------------------------------------------------------

## 🧰 Service Management

### Backend (systemd)

``` bash
sudo systemctl status devops-backend
sudo journalctl -u devops-backend -f
```

### Nginx validation

``` bash
sudo nginx -t
sudo systemctl reload nginx
```

------------------------------------------------------------------------

## 🔐 Security & Separation of Concerns

-   Production `.env` stored **outside repository**
-   Deploy SSH key configured as **GitHub Deploy Key**
-   Application runs under dedicated system user (`app`)
-   No secrets stored in Git

------------------------------------------------------------------------

## 🧪 Healthcheck

Backend exposes:

    GET /api/health

Used for:

-   deployment validation
-   rollback trigger
-   manual monitoring

------------------------------------------------------------------------

## 📈 What This Project Demonstrates

-   Linux server administration
-   Reverse proxy configuration
-   systemd service management
-   Zero-downtime deploy pattern
-   Atomic symlink switching
-   Automated rollback
-   Environment separation
-   Production debugging via logs

------------------------------------------------------------------------

## 🔮 Next Steps

-   Dockerization (multi-stage builds)
-   CI/CD via GitHub Actions
-   HTTPS (Let's Encrypt)
-   Monitoring (Prometheus / Grafana)
-   Log aggregation

------------------------------------------------------------------------

## 👨‍💻 Author

**Valerii "keoz364" Levchenko** --- aspiring DevOps Engineer
