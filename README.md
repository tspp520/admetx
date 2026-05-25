# admetx — 成药性预测平台 / ADMET Prediction Platform

[English](#english) · [中文](#中文)

---

## 中文

**admetx** 是一套内网部署的成药性预测平台，UI 与交互参考开源 optADMET 平台，模型层留有可插拔接口（首版用 RDKit 真算物化性质 + 其余指标伪随机，后续可平滑替换为真实 ADMET 模型）。

### 功能（首版）

- 多用户登录（bcrypt + JWT，启动时 seed `admin/admetx`）
- 预测：SMILES 输入 / Ketcher 绘分子 / 文件上传（TXT/SMI/CSV，最多 30 个）
- 异步任务 + 前端轮询，结果按用户隔离
- 模型库（占位卡片）：BBB、hERG、Solubility、AMES、CYP3A4 等
- 个人设置：修改密码、查看角色

### 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 + API | Next.js 16 (App Router, TypeScript) + Tailwind v4 + Drizzle ORM |
| 数据库 | PostgreSQL 16 (Docker) |
| 预测服务 | FastAPI + Python 3.12 + RDKit（HTTP 旁挂） |
| 部署 | Nginx 反代 + systemd + 通配证书 `*.chempartner.com` |

### 目录

```
admetx/
├── admetx-web/         Next.js 工程：页面、API、worker
├── admetx-predictor/   FastAPI 预测服务（pyproject.toml + requirements.txt）
├── scripts/            部署/启动/db-init 脚本 + nginx + systemd 模板
├── docs/               设计 spec、计划、端口/凭据/部署清单
└── 需要被复刻的网站的截图/
```

### 快速开始（开发）

前置：`pnpm` 11+、`python3.12`、Docker。

```bash
# 1. Postgres（docker，端口 5436）
bash scripts/db-init.sh

# 2. 预测服务
cd admetx-predictor
python3.12 -m venv .venv
.venv/bin/pip install -e ".[dev]" -i https://pypi.tuna.tsinghua.edu.cn/simple/
.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8030 &

# 3. Web
cd ../admetx-web
pnpm install
cp ../.env.example .env.local
# 编辑 .env.local 填入 DATABASE_URL 和 JWT_SECRET
pnpm db:migrate
pnpm db:seed
pnpm dev
```

访问 `http://localhost:3000`，登录 `admin` / `admetx`。

### 端口

| 用途 | prod | dev |
| --- | --- | --- |
| Next.js | 3030 | 3031 |
| FastAPI predictor | 8030 | 8031 |
| Postgres | 5436 | 5436（库不同） |

### 文档

- 完整设计：`docs/superpowers/specs/2026-05-25-admetx-design.md`
- 实施计划：`docs/superpowers/plans/2026-05-25-admetx.md`
- 部署清单：`docs/项目关键信息/部署清单.md`
- 凭据速查：`docs/项目关键信息/端口与域名.md`

---

## English

**admetx** is an intranet drug-likeness (ADMET) prediction platform whose UI and interaction model mirror the open-source optADMET site. The model layer keeps a pluggable interface — the first release uses RDKit for real physchem indicators and seeded-pseudorandom values for the remaining ADMET scores, so the wiring can be swapped for a real model later without changing the rest of the system.

### Features (v0)

- Multi-user auth (bcrypt + JWT; seeded `admin / admetx` on startup)
- Prediction: SMILES textarea / Ketcher canvas / file upload (TXT/SMI/CSV, ≤30 molecules)
- Async tasks + UI polling; results are owner-scoped
- Models library (placeholder cards): BBB, hERG, Solubility, AMES, CYP3A4, etc.
- Personal settings: change password, view role

### Stack

| Layer | Choice |
| --- | --- |
| Frontend + API | Next.js 16 (App Router, TypeScript) + Tailwind v4 + Drizzle ORM |
| Database | PostgreSQL 16 (Docker) |
| Predictor | FastAPI + Python 3.12 + RDKit (sidecar HTTP service) |
| Deployment | Nginx reverse proxy + systemd + `*.chempartner.com` wildcard cert |

### Layout

```
admetx/
├── admetx-web/         Next.js project: pages, API routes, in-process worker
├── admetx-predictor/   FastAPI prediction service (pyproject.toml + requirements.txt)
├── scripts/            deploy / start / db-init scripts + nginx + systemd templates
├── docs/               design spec, plan, ports/credentials/deployment checklists
└── 需要被复刻的网站的截图/  reference screenshots of the original optADMET UI
```

### Quick start (development)

Prerequisites: `pnpm` 11+, `python3.12`, Docker.

```bash
# 1. Postgres (docker, port 5436)
bash scripts/db-init.sh

# 2. Predictor service
cd admetx-predictor
python3.12 -m venv .venv
.venv/bin/pip install -e ".[dev]"
.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8030 &

# 3. Web
cd ../admetx-web
pnpm install
cp ../.env.example .env.local
# Edit .env.local — set DATABASE_URL and JWT_SECRET
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open `http://localhost:3000` and log in as `admin / admetx`.

### Ports

| Purpose | prod | dev |
| --- | --- | --- |
| Next.js | 3030 | 3031 |
| FastAPI predictor | 8030 | 8031 |
| Postgres | 5436 | 5436 (different database) |

### Documentation

- Full design spec: `docs/superpowers/specs/2026-05-25-admetx-design.md`
- Implementation plan: `docs/superpowers/plans/2026-05-25-admetx.md`
- Deployment checklist: `docs/项目关键信息/部署清单.md`
- Ports & credentials cheatsheet: `docs/项目关键信息/端口与域名.md`

---

## License

Internal use only. © 2026 ChemPartner.
