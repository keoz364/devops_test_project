#!/usr/bin/env bash
set -euo pipefail

REPO_SSH="git@github.com:keoz364/devops_test_project.git"
BASE="/opt/devops_test_project"
RELEASES="$BASE/releases"
SHARED="$BASE/shared"
CURRENT="$BASE/current"

echo "==> Checking shared environment"

if [[ ! -f "$SHARED/backend/.env" ]]; then
  echo "❌ ERROR: Missing $SHARED/backend/.env"
  echo "Aborting deploy."
  exit 1
fi

RELEASE_ID="$(date +%Y%m%d_%H%M%S)"
NEW_RELEASE="$RELEASES/$RELEASE_ID"

echo "==> Deploying release: $RELEASE_ID"

echo "==> Creating release dir"
mkdir -p "$NEW_RELEASE"

echo "==> Cloning repo"
# shallow clone for speed
git clone --depth 1 "$REPO_SSH" "$NEW_RELEASE/src"

echo "==> Preparing backend"
mkdir -p "$NEW_RELEASE/backend"
rsync -a --delete "$NEW_RELEASE/src/backend/" "$NEW_RELEASE/backend/"
chown -R app:app "$NEW_RELEASE/backend"

# link shared env
ln -sfn "$SHARED/backend/.env" "$NEW_RELEASE/backend/.env"

echo "==> Installing backend deps"
sudo -u app bash -lc "cd '$NEW_RELEASE/backend' && npm ci || npm install"

echo "==> Preparing frontend"
mkdir -p "$NEW_RELEASE/frontend"
rsync -a --delete "$NEW_RELEASE/src/frontend/" "$NEW_RELEASE/frontend/"
chown -R app:app "$NEW_RELEASE/frontend"

echo "==> Installing frontend deps + build"
sudo -u app bash -lc "cd '$NEW_RELEASE/frontend' && npm ci || npm install"
sudo -u app bash -lc "cd '$NEW_RELEASE/frontend' && npm run build"

# запомним предыдущий релиз для rollback
PREV="$(readlink -f "$CURRENT" || true)"

echo "==> Switching current symlink"
ln -sfn "$NEW_RELEASE" "$CURRENT"

echo "==> Restarting backend"
systemctl restart devops-backend

echo "==> Reloading nginx"
systemctl reload nginx

echo "==> Waiting for backend..."

sleep 2

if curl -fsS http://127.0.0.1/api/health >/dev/null; then
  echo "✅ Deploy OK"
else
  echo "❌ Healthcheck failed — rolling back"

  if [[ -n "${PREV:-}" && -d "$PREV" ]]; then
    ln -sfn "$PREV" "$CURRENT"
    systemctl restart devops-backend
    systemctl reload nginx
    echo "↩ Rolled back to: $PREV"
  fi

  exit 1
fi

echo "==> Cleanup: keep last 5 releases"
ls -1dt "$RELEASES"/* 2>/dev/null | tail -n +6 | xargs -r rm -rf
