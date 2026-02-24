📦 DevOps Test Project

Production-like fullstack application deployed on Ubuntu Server with Nginx, systemd and release-based zero-downtime deploy strategy.

🏗 Architecture

Stack:

Ubuntu 20.04

Node.js 20

PostgreSQL

React (Vite build)

Nginx (reverse proxy + static)

systemd service (backend)

Release-based deployment with rollback

🌐 Production Topology
Internet
   │
   ▼
Nginx (port 80)
   ├── /        → static frontend (React build)
   └── /api     → reverse proxy → Node.js backend
                           │
                           ▼
                      PostgreSQL
🚀 Deployment Strategy

Production deploy is implemented using a release-based directory structure:

/opt/devops_test_project
  ├── releases/
  │     ├── 20250609_120101
  │     ├── 20250609_121532
  │     └── ...
  ├── shared/
  │     └── backend/.env
  └── current -> releases/<active_release>
Deploy Flow

Clone repository into new release directory

Install backend dependencies

Build frontend (Vite production build)

Atomically switch current symlink

Restart backend via systemd

Healthcheck /api/health

If failed → automatic rollback to previous release

Keep only last 5 releases

Deployment is triggered by:

sudo /opt/devops_test_project/shared/deploy.sh
🔁 Rollback Mechanism

If healthcheck fails:

current symlink switches back

backend is restarted

nginx is reloaded

previous stable release is restored automatically

🧰 Service Management

Backend runs as a systemd service:

sudo systemctl status devops-backend
sudo journalctl -u devops-backend -f

Nginx validation:

sudo nginx -t
sudo systemctl reload nginx
🔐 Security & Separation of Concerns

Production .env is stored outside repository

Deploy SSH key is configured as GitHub Deploy Key

Application runs under dedicated system user (app)

No secrets stored in Git

🧪 Healthcheck

Backend exposes:

GET /api/health

Used by:

deployment validation

rollback trigger

manual monitoring

📈 What This Project Demonstrates

Linux server administration

Reverse proxy configuration

systemd service management

Zero-downtime deploy pattern

Atomic symlink switching

Automated rollback

Environment separation

Production debugging via logs

🔮 Next Steps

Dockerization (multi-stage builds)

CI/CD via GitHub Actions

HTTPS (Let's Encrypt)

Monitoring (Prometheus / Grafana)

Log aggregation

👨‍💻 Author

Valerii keoz364 Levchenko — aspiring DevOps Engineer
