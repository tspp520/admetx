# admetx 设计文档

- **日期**：2026-05-25
- **作者**：cpreg@chempartner.com + Claude (Opus 4.7)
- **状态**：设计稿（待 writing-plans 转实施计划）
- **被复刻平台**：optADMET 成药性预测平台（`http://admet.chempartner.com:35432`，登录 admet/pharmwings）

---

## 1. 目标与范围

### 1.1 目标

在公司内网复刻一套外观与交互接近 optADMET 的"成药性预测"平台，作为公司自建版本 **admetx**。首版以 **可演示的全骨架** 为目标：所有侧栏页（预测/模型/任务/设置）都可点击访问，预测流程端到端打通，预测结果使用 **RDKit 真算 + 随机补全** 的占位实现，未来可平滑替换为真实 ADMET 模型。

### 1.2 首版范围（in-scope）

- 登录页（仿 optADMET 卡片式布局），多用户认证（启动 seed `admin/admetx`）
- 主框架：左侧四 Tab（预测 / 模型 / 任务 / 设置）+ 顶栏（操作视频/语言/铃铛/头像）
- 预测页：3 个 Tab — 输入 SMILES / 绘制分子 (Ketcher) / 上传文件 (.txt/.smi/.sdf/.csv)
- 异步任务：提交→入库 queued→worker 调 predictor→更新进度→前端轮询
- 任务页：列表（按用户隔离） + 详情（按分子展开各 ADMET 指标）
- 模型页：占位卡片（BBB、hERG、Solubility、AMES…），点击进详情 stub
- 设置页：修改密码 + 个人信息显示
- prod + dev 双环境（域名+端口分离）
- Nginx HTTPS 反代 + wildcard 证书复用
- IP+端口直连作为 DNS 绑定前的临时访问通道

### 1.3 不在首版范围（out-of-scope，留 TODO）

- 真实 ADMET 模型（占位为 RandomPredictor / RDKitHybridPredictor，接口预留）
- 分子库管理、批量下载报告 PDF
- 操作视频引导（顶栏入口先做空 Modal）
- 邮件通知 / SSO 集成
- CI/CD 流水线（手动 build + systemctl restart）

### 1.4 成功标准

1. 浏览器访问 `http://10.1.170.84:3030` 看到登录页，`admin/admetx` 登录成功
2. 提交 3 个合法 SMILES，2 秒内任务页看到结果落库，详情页每个分子 ≥10 项指标
3. 提交 1 个非法 SMILES，任务标 `partial_failed` 但其他分子正常
4. 改密码生效（重新登录可用新密码）
5. 重启服务器后 systemd 自动拉起 prod + dev 两套服务
6. 后续接入真模型只需新增 `predictors/torch_predictor.py` + 改 env，不动 Next.js

---

## 2. 总体架构

```
浏览器
  │  HTTPS 443 (DNS 配好后)
  │  或 HTTP IP:3030 (过渡期直连)
  ▼
Nginx  /etc/nginx/conf.d/admetx-chempartner.conf
  ├ admetx.chempartner.com      ──→ 127.0.0.1:3030 (Next.js prod)
  │                              │
  │                              └→ /api/predict/* ──→ 127.0.0.1:8030 (predictor prod)
  │
  └ admetx-dev.chempartner.com  ──→ 127.0.0.1:3031 (Next.js dev / Vite HMR)
                                 │
                                 └→ /api/predict/* ──→ 127.0.0.1:8031 (predictor dev)

Next.js (App Router, TypeScript)
  • 页面（登录、预测、任务、模型、设置）
  • API Routes（auth、tasks、upload）
  • 进程内队列消费者（lib/worker.ts）调 predictor
  • Drizzle ORM 操作 Postgres
                                 │
                                 ▼
admetx-predictor (FastAPI, Python)
  • POST /predict {smiles:[str]} → [{indicator:value,...}]
  • BasePredictor 接口
  • RandomPredictor (env=random)
  • RDKitHybridPredictor (env=rdkit_hybrid, 默认)
  • TorchPredictor (env=torch, 留 TODO)

Postgres :5436
  库 admetx_prod / admetx_dev
  users / tasks / task_items
```

### 2.1 为什么 Next.js + 旁挂 Python 服务

- **Next.js 全栈**：单仓库管前端、API、SSR，开发与部署模型对运维清晰；不需要单独的 React 构建链 + 单独的 Node API 服务。
- **Python 旁挂**：RDKit / 未来 torch / sklearn 模型在 Python 生态最成熟；Node 的 rdkit-js (WASM) 体积大且能力子集。HTTP 隔离让两边独立升级，符合现代药化 AI 平台常见架构。
- **Drizzle ORM**：TS 端类型友好，零运行时反射，schema-as-code 易做迁移。

---

## 3. 数据模型

### 3.1 表结构

```sql
-- users：用户表
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(128) NOT NULL,    -- bcrypt
  display_name  VARCHAR(128),
  role          VARCHAR(16) NOT NULL DEFAULT 'user',  -- 'admin' | 'user'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- tasks：一次预测提交 = 一行
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        INT NOT NULL REFERENCES users(id),
  name            VARCHAR(128) NOT NULL,         -- 用户填的 "任务名称"
  project         VARCHAR(128) NOT NULL,         -- 用户填的 "项目名称"
  status          VARCHAR(16) NOT NULL DEFAULT 'queued',
                   -- 'queued' | 'running' | 'succeeded' | 'partial_failed' | 'failed'
  predictor_name  VARCHAR(64) NOT NULL,          -- 'rdkit_hybrid' / 'random' / ...
  total_count     INT NOT NULL,
  finished_count  INT NOT NULL DEFAULT 0,
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at      TIMESTAMPTZ,
  finished_at     TIMESTAMPTZ
);
CREATE INDEX idx_tasks_owner_created ON tasks(owner_id, created_at DESC);
CREATE INDEX idx_tasks_status ON tasks(status);

-- task_items：任务里每个分子一行
CREATE TABLE task_items (
  id              SERIAL PRIMARY KEY,
  task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  idx             INT NOT NULL,           -- 提交内序号 0..N-1
  smiles          TEXT NOT NULL,
  parsed_ok       BOOLEAN NOT NULL DEFAULT FALSE,
  result          JSONB,                  -- {"LogP":1.23,"MW":234.1,"BBB":0.81,...}
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_items_task ON task_items(task_id, idx);
```

### 3.2 字段约定

- **result JSONB**：约定包含 `physicochemical` / `absorption` / `distribution` / `metabolism` / `excretion` / `toxicity` 六组指标（首版指标见 §4.2）。未来加指标只需更新 predictor 输出 + 前端展示映射，无需改 schema。
- **认证**：纯 stateless JWT（HS256），24h TTL；密码 bcrypt cost=10。无 sessions 表（简化首版）。

### 3.3 Seed 数据

启动时 `db/seed.ts` 检查 users 表是否为空，是则插入：

```
username = "admin"
password = "admetx"   (bcrypt 哈希)
role     = "admin"
```

---

## 4. 后端：admetx-predictor (Python / FastAPI)

### 4.1 目录与接口

```
admetx-predictor/
  app/
    main.py                  FastAPI app
    config.py                Settings (env via pydantic-settings)
    predictors/
      __init__.py
      base.py                BasePredictor ABC
      random_predictor.py    RandomPredictor
      rdkit_hybrid.py        RDKitHybridPredictor (default)
      # torch_predictor.py   TODO: 真模型
    schemas.py               PredictRequest / PredictResponse pydantic
  tests/
    test_rdkit_hybrid.py
    test_random.py
  pyproject.toml             fastapi uvicorn rdkit-pypi pydantic pydantic-settings pytest
  Dockerfile                 (可选，首版不强制)
```

**HTTP 接口**：

```
POST /predict
Body: {"smiles": ["CCO", "c1ccccc1"], "predictor": "rdkit_hybrid"}
Resp 200:
{
  "results": [
    {
      "idx": 0, "smiles": "CCO", "parsed_ok": true,
      "indicators": {
        "physicochemical": {"LogP": -0.31, "MW": 46.07, ...},
        "absorption": {"Caco2": 0.43, "HIA": 0.92, ...},
        ...
      }
    },
    {"idx": 1, "smiles": "bad", "parsed_ok": false, "error": "RDKit parse failed"}
  ]
}

GET /health  → {"status":"ok","predictor":"rdkit_hybrid"}
```

### 4.2 RDKitHybridPredictor 指标清单

**真算**（来自 RDKit）：

| 类别 | 指标 | 来源函数 |
| --- | --- | --- |
| Physicochem | LogP | `Crippen.MolLogP` |
| Physicochem | MW | `Descriptors.MolWt` |
| Physicochem | HBD | `Lipinski.NumHDonors` |
| Physicochem | HBA | `Lipinski.NumHAcceptors` |
| Physicochem | TPSA | `Descriptors.TPSA` |
| Physicochem | RotBonds | `Lipinski.NumRotatableBonds` |
| Physicochem | Lipinski通过 | 4 项规则推断 |

**占位随机**（带种子 `hash(smiles)` 保证同分子多次提交结果稳定）：

| 类别 | 指标 | 取值 |
| --- | --- | --- |
| Absorption | Caco2 / HIA / Pgp-substrate / Pgp-inhibitor | 0..1 浮点 |
| Distribution | BBB / PPB / VDss | BBB ∈ {0,1} 概率；PPB ∈ 0..1；VDss ∈ 0.04..20 |
| Metabolism | CYP2D6 / CYP3A4 / CYP2C9 / CYP1A2 / CYP2C19 (sub/inh × 5) | 0..1 概率 |
| Excretion | CL / T_half | CL ∈ 0.5..15；T_half ∈ 0.1..50 |
| Toxicity | hERG / AMES / DILI / Carcino / Skin | 0..1 概率 |

伪随机保证同 SMILES 同结果 → 用户重新提交体验稳定。

### 4.3 BasePredictor 接口

```python
class BasePredictor(ABC):
    name: ClassVar[str]
    @abstractmethod
    def predict_batch(self, smiles_list: list[str]) -> list[PredictResult]: ...
```

未来接真模型新增 `TorchPredictor(BasePredictor)`，环境变量 `PREDICTOR_KIND=torch` 即切换。

---

## 5. 前端：Next.js (App Router + TS + Tailwind + shadcn/ui)

### 5.1 目录

```
admetx-web/
  app/
    layout.tsx                  全局 html、字体、Toaster
    page.tsx                    根：未登录跳 /login，已登录跳 /predict
    (auth)/
      login/page.tsx            登录页（仿截图）
    (app)/
      layout.tsx                主框架 = SideNav + TopBar + <main>
      predict/page.tsx          预测页（3 Tab）
      tasks/page.tsx            任务列表
      tasks/[id]/page.tsx       任务详情
      models/page.tsx           模型卡片网格
      models/[slug]/page.tsx    模型详情 stub
      settings/page.tsx         修改密码 + 个人信息
    api/
      auth/login/route.ts
      auth/logout/route.ts
      auth/me/route.ts
      auth/password/route.ts
      tasks/route.ts            GET 列表 / POST 新建
      tasks/[id]/route.ts       GET 详情
      upload/route.ts           POST 解析文件 → SMILES[]
  components/
    side-nav.tsx
    top-bar.tsx
    logo.tsx
    smiles-textarea.tsx
    ketcher-canvas.tsx          <iframe src="/ketcher" />
    file-dropzone.tsx
    task-table.tsx
    task-detail-table.tsx
    model-card.tsx
  lib/
    auth.ts                     signJwt / verifyJwt / requireUser middleware
    db/
      client.ts                 drizzle client
      schema.ts                 users / tasks / task_items
      seed.ts                   seed admin
      migrate.ts
    predictor-client.ts         调 PREDICTOR_URL
    worker.ts                   进程内队列：startWorker() 在 instrumentation.ts 启动
    smiles.ts                   normalize / split / 基本格式校验
  public/
    ketcher/                    ketcher static (置于 /ketcher/index.html，iframe 引用)
  drizzle/                      迁移文件
  .env.local                    见 §6
  package.json
  tsconfig.json
  tailwind.config.ts
  next.config.mjs
  instrumentation.ts            Next.js 启动钩子，启动 worker
```

### 5.2 视觉风格

- 主色：`#0EA5A4`（teal-500 微调）— 按钮、激活态、logo 重点色
- 背景：纯白 `#FFFFFF`；卡片浅阴影 `shadow-sm` + 1px 边框 `#E5E7EB`
- 字体：系统中文 + Inter
- 顶栏右侧图标使用 lucide-react
- 不复制原版的青蓝渐变背景，符合用户"白底简单"的要求

### 5.3 分子绘制器 (Ketcher)

- 用官方 release 的 standalone build (`ketcher-standalone`)，放 `public/ketcher/`
- 组件用 `<iframe>` 嵌入，listen `message` 事件取 SMILES（Ketcher 提供 `postMessage` API）
- 取不到 SMILES 不阻塞，用户仍可切回 Tab1 手敲

### 5.4 文件上传解析

- 服务端解析（`/api/upload`），不在浏览器解析（避免 RDKit-JS 包体）
- 支持：
  - `.txt` / `.smi`：每行一个 SMILES
  - `.csv`：取第一列（或表头为 `smiles` 的列）
  - `.sdf`：调 Python predictor 的 `/parse-sdf` 辅助接口（首版可先支持前三种，SDF 列 TODO）
- 上传大小限制：5MB，最多 30 个分子（仿原平台）

### 5.5 任务流转

```
用户在 predict 页提交
  → POST /api/tasks (含 smiles[], name, project)
  → DB 插 tasks(status='queued') + task_items 各行
  → 返回 task_id
  → 跳 /tasks/{id}
  
后台 worker (lib/worker.ts, instrumentation.ts 启动)
  → 每 500ms 扫 queued 任务
  → 标 running, started_at = now
  → 调 PREDICTOR_URL /predict
  → 更新 task_items.result / finished_count
  → 全 OK → status='succeeded'
     部分失败 → 'partial_failed'
     全失败 → 'failed'
  → finished_at = now

前端 /tasks/{id}
  → 轮询 GET /api/tasks/{id} 每 2s
  → status ∈ {succeeded, failed, partial_failed} 停止轮询
  → 失败的分子标红，成功的展开指标 JSON
```

进程内 worker 足够首版：单个 Next.js 进程，预测调用是 HTTP 阻塞，可控并发 `MAX_CONCURRENCY=3`。未来 BullMQ + Redis 替换。

---

## 6. 部署 / 环境 / 端口

### 6.1 端口分配

| 用途 | prod | dev |
| --- | --- | --- |
| Next.js | 3030 | 3031 |
| admetx-predictor (FastAPI) | 8030 | 8031 |
| Postgres | 5436 | 5436 (库不同) |

已确认这五个端口当前未被监听，也不在任何 `/etc/nginx/conf.d/*.conf` 中出现。

### 6.2 目录布局（部署后）

```
/export/projects/admetx/
  docs/                              ← 现有 + 本设计
  需要被复刻的网站的截图/             ← 现有
  admetx-web/                        ← 新建 Next.js 工程
  admetx-predictor/                  ← 新建 FastAPI 工程
  scripts/
    start-prod.sh                    pm2/systemd 起 next.js + uvicorn
    start-dev.sh
    stop.sh
    db-init.sh                       createdb + drizzle migrate + seed
  logs/                              所有服务日志
  .env.prod                          (敏感，gitignore)
  .env.dev
```

### 6.3 环境变量

```ini
# .env.prod
DATABASE_URL=postgresql://admetx:<pw>@localhost:5436/admetx_prod
PREDICTOR_URL=http://127.0.0.1:8030
JWT_SECRET=<32-byte random>
NEXT_PORT=3030
PREDICTOR_KIND=rdkit_hybrid
NODE_ENV=production
```

dev 对应改成 `_dev` 后缀和 `3031/8031`。

### 6.4 Nginx 配置

文件：`/etc/nginx/conf.d/admetx-chempartner.conf`，结构仿 `molview-chempartner.conf`：

- `80 server` → 301 跳 `https`
- `443 server` for `admetx.chempartner.com`：
  - `/api/predict/` → `http://127.0.0.1:8030`
  - `/` → `http://127.0.0.1:3030`（含 WS upgrade，给 SSE 或 Next 内部用）
- `443 server` for `admetx-dev.chempartner.com`：
  - `/api/predict/` → `http://127.0.0.1:8031`
  - `/` → `http://127.0.0.1:3031`
- SSL 证书：`/etc/nginx/ssl/chempartner.com.fullchain.pem` + `chempartner.com.key`
- `client_max_body_size 10M`

### 6.5 DNS 绑定前的临时访问

DNS 配好前，您要本地测试用：

1. **直接 IP+端口**（首选）：`http://10.1.170.84:3030`
   - Next.js 启动加 `-H 0.0.0.0`
   - 防火墙开放 3030/3031（如 firewalld 启用）
2. **hosts + nginx**：本地 `hosts` 加 `10.1.170.84 admetx.chempartner.com`，访问 `https://admetx.chempartner.com`（wildcard 证书有效）

### 6.6 进程管理

systemd unit ×4：

```
/etc/systemd/system/
  admetx-web-prod.service        Next.js prod
  admetx-web-dev.service         Next.js dev
  admetx-predictor-prod.service  uvicorn prod
  admetx-predictor-dev.service   uvicorn dev
```

每个 unit：
- `Restart=on-failure`
- `WorkingDirectory=/export/projects/admetx/admetx-web` 或 predictor
- `User=aiuser`
- 日志重定向到 `/export/projects/admetx/logs/*.log`

如 systemd 暂时不便（需要 root），先用 `scripts/start-prod.sh` + `nohup`，systemd 化作为部署步骤的二阶段。

---

## 7. 安全

- bcrypt 密码哈希（cost=10）
- JWT HS256，secret 进 env 不进代码
- Next.js API Route 中间件 `requireUser()` 检查 JWT
- 用户只能看自己的 tasks（`WHERE owner_id = $userId`）
- nginx 限大小 10M
- predictor 服务只监听 `127.0.0.1`，不直接对外
- SQL 注入：全部走 Drizzle 参数化查询
- 上传文件类型白名单 + 大小校验
- bcrypt + JWT secret 不进 git；`.env*` 进 `.gitignore`

---

## 8. 测试策略

| 层 | 工具 | 关键用例 |
| --- | --- | --- |
| 单元（TS） | vitest | `lib/smiles.ts` 切分/校验、`predictor-client` 错误处理、JWT 签验 |
| 单元（Py） | pytest | `RDKitHybridPredictor.predict_batch` 真算指标、非法 SMILES 返回 `parsed_ok=False`、伪随机种子稳定性 |
| 集成（TS） | vitest + Drizzle 真库（dev 库 swap） | `POST /api/tasks → worker → GET /api/tasks/:id` 全流程 |
| E2E | Playwright | 登录 → 提交 3 SMILES → 任务页等到 succeeded → 看到指标 |
| 手测 | docs/项目关键信息/手测清单.md | 4 个侧栏页都能打开、Ketcher 加载成功、上传 CSV 解析、改密码、prod/dev 隔离 |

---

## 9. 里程碑（writing-plans 阶段细化）

1. **M0 — 基础骨架**：仓库结构、Next.js init、Postgres 建库、Drizzle schema + seed
2. **M1 — 后端 predictor**：FastAPI + RDKitHybrid + 单测
3. **M2 — 登录 + 主框架**：登录页、JWT、SideNav、TopBar、空 4 页
4. **M3 — 预测页 + 任务**：SMILES 输入 + 文件上传 + worker + 任务页
5. **M4 — Ketcher + 模型/设置页**：Ketcher 嵌入、模型卡片、改密码
6. **M5 — 部署 + Nginx**：systemd unit、nginx conf、端口验证、手测
7. **M6 — 交付前 code review**：`superpowers:code-reviewer` 走一次，按反馈修

---

## 10. 风险与缓解

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| Ketcher 嵌入 SMILES 提取 API 变化 | 绘制 Tab 体验受损 | iframe + postMessage，失败回退用户切回输入 Tab |
| RDKit 在 Python 3.12 + glibc 老版本兼容 | predictor 起不来 | 提前 `pip install rdkit-pypi` 验证；不行则退到 `random` |
| Next.js 进程内 worker 长任务阻塞 | 多用户并发慢 | `MAX_CONCURRENCY` 限流；首版任务规模小（≤30 分子）足够 |
| systemd 配置需要 root | 部署受阻 | 先 nohup 跑通，systemd 列入二阶段（需用户 ! sudo 协助） |
| 端口被其他项目临时抢占 | 服务起不来 | start 脚本里再扫一次确认；冲突即报错退出 |

---

## 11. 关键决策摘要（一句话回顾）

- **页面范围**：登录 + 预测 + 任务 + 模型 + 设置（全骨架）
- **认证**：多用户 + bcrypt + JWT，seed admin/admetx
- **预测**：RDKit 真算物化性质 + 其余指标伪随机；接口预留真模型替换点
- **绘分子**：Ketcher (iframe + postMessage)
- **任务**：异步 + 前端 2s 轮询
- **环境**：prod + dev 双跑
- **栈**：Next.js (App Router) + Postgres + 旁挂 FastAPI 预测服务
- **过渡访问**：IP+端口直连 + 后续 nginx + DNS
- **Code review**：交付前一次 `superpowers:code-reviewer`
