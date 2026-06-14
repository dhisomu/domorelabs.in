# PROJECT.md — TEMPLATE

**Project:** dev.domorelabs.in
**Server:** OpsSim-Prod (domorelabs.in)
**Environment:** dev
**Last Updated:** 2026-06-14 11:31 UTC
**Status:** [Active | Maintenance | Deprecated]

> **This is a template. Copy to `/srv/second-brain/[domain]/[ServerN]/PROJECTS/[project]/PROJECT.md`**
> **and populate all `real project values` with real project values.**

---

# 1. Project Overview

DoMoreLabs operations portal for managing labs, user environments, and resources.

---

# 2. Live Locations

| Environment | Code Path                         | URL                        |
| ----------- | --------------------------------- | -------------------------- |
| Production  | `/srv/[domain]/[project]/prod/`   | `https://[domain]`         |
| Stage       | `/srv/[domain]/[project]/stage/`  | `https://stage.[domain]`   |
| Dev         | `/srv/[domain]/[project]/dev/`    | `https://dev.[domain]`     |
| LocalDev    | `/srv/[domain]/[project]/localdev/`| `http://localhost:[port]` |

---

# 3. Tech Stack

| Layer      | Technology       | Version  |
| ---------- | ---------------- | -------- |
| Backend    | [FastAPI/Django] | [X.Y]    |
| Frontend   | [Vanilla JS/React] | [X.Y]  |
| Database   | [PostgreSQL/MySQL] | [X.Y]  |
| Web Server | [Nginx/Traefik]  | [X.Y]    |
| Runtime    | [Python/Node]    | [X.Y]    |

---

# 4. Containers

| Container Name   | Image    | Environment | Purpose      |
| ---------------- | -------- | ----------- | ------------ |
| [project-prod-backend] | [img] | prod   | API server   |
| [project-prod-db]      | [img] | prod   | Database     |
| [project-prod-nginx]   | [img] | prod   | Reverse proxy|

---

# 5. Databases

| Name         | Container         | Volume           | Backup Location          |
| ------------ | ----------------- | ---------------- | ------------------------ |
| [db_name]    | [container-name]  | [volume-name]    | `/srv/[project]/backups/`|

**Credentials:** `/srv/[project]/[env]/.env`

---

# 6. Environment Variables

Document categories only — never paste actual values here.

```text
Required in .env:
  DATABASE_URL
  SECRET_KEY
  APP_ENV
  SMTP_HOST
  SMTP_PASSWORD
  [OTHER_VARS]
```

---

# 7. Deployment Procedure

```bash
# Pull latest
cd /srv/[project]/[env]
git pull origin [branch]

# Rebuild and restart
sudo docker compose up -d --build

# Verify
sudo docker compose ps
sudo docker logs [container] --tail 20
```

---

# 8. Backup Procedure

```bash
# Manual backup
sudo docker exec [db-container] pg_dump -U [user] [dbname] > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
ls -lh /srv/[project]/backups/
```

---

# 9. Restore Procedure

```bash
# Restore from backup
sudo docker exec -i [db-container] psql -U [user] [dbname] < backup_[DATE].sql
```

---

# 10. Monitoring & Health

```bash
# Health check
sudo docker exec [db-container] pg_isready
sudo docker logs [backend-container] --tail 20
```

---

# 11. Known Issues & Gotchas

- [Issue 1]: [Description and workaround]
- [Issue 2]: [Description and workaround]

---

# 12. Related Documentation

- [Architecture diagram](../system_architecture.md)
- [SERVER_GOVERNANCE.md](../SERVER_GOVERNANCE.md)
- [ACTIVE_TASK.md](./ACTIVE_TASK.md)

---

*Populate this template with real project values. Link from `second_brain_index.md`.*
