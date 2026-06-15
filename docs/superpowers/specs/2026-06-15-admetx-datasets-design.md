# admetx datasets 模块设计文档

- **日期**：2026-06-15
- **作者**：cpregister@chempartner.com + Claude (Fable 5)
- **状态**：设计稿（已与用户确认范围，待转 writing-plans）
- **关联**：[[2026-05-25-admetx-design]]（主平台设计）、predictor 服务（未来训练产物接入点）

---

## 1. 目标与范围

### 1.1 目标

在 `/export/projects/admetx/` 下新建 `datasets/` 模块，按 ADMET 属性收集**干净的公开数据集**，逐属性联网调研其监督学习类型（回归/分类）与数据可得性，把有干净公开数据的下载入库并配齐文档与可复现脚本。目的是为后续训练真实 ML 模型、替换 predictor 中的随机占位（`RandomPredictor`/`RDKitHybridPredictor` 的伪随机部分）铺好数据基础，赶在全员大会预发布平台第一版。

### 1.2 范围内（in-scope）

- 对 optADMET 140 个待预测属性逐一判定 ML 类型（回归/分类/多任务分类）与公开数据可得性，产出 `property_mapping.csv`。
- 以 TDC（PyTDC）为核心、MoleculeNet/ChEMBL 为辅，下载 ~25-30 个干净公开数据集，覆盖 30-40 个 optADMET 属性名。
- 统一清洗为 `smiles,label`（回归带 `unit`）标准格式，保留官方 train/valid/test 划分。
- 每个数据集配 `metadata.json` + 数据卡 `README.md`；模块级 `MANIFEST.json` + `PROGRESS.md` 留痕。
- 可复现下载/清洗脚本（`scripts/`）。
- 无干净公开数据的属性统一登记为"缺口 + 候选源"。

### 1.3 范围外（out-of-scope，用户下一步）

- 训练任何 ML 模型。
- 编写 `TorchPredictor` / 接入 predictor 服务。
- 模型上线、平台部署。
- 硬下载脏数据或自行从 ChEMBL 原始库做大规模清洗建集（仅登记候选源）。

### 1.4 成功标准

1. `property_mapping.csv` 覆盖全部 140 属性，每行有 ML 类型判定与数据可得性结论。
2. `datasets/` 下 ≥25 个数据集，每个含 `raw/`、`processed/`（带划分）、`metadata.json`、`README.md`。
3. 每个 processed 数据集：行数>0、列名规范、SMILES 经 RDKit canonical 化、记录解析成功率。
4. `MANIFEST.json` 可一览所有属性的状态（downloaded / gap）。
5. 下载/清洗脚本可重跑复现结果。
6. 全流程留痕：每阶段 PROGRESS 记录 + git commit。

---

## 2. 数据来源与映射策略

主源 **TDC（Therapeutics Data Commons / PyTDC）**：每集自带 scaffold 划分与明确回归/分类标注，最干净。辅源 **MoleculeNet**（ESOL/FreeSolv/Tox21 等直链 CSV）、**ChEMBL**（仅登记为候选源，不在本次清洗）。

### 2.1 初步映射表（候选）

| optADMET 属性 | ML 类型 | 候选数据集 |
|---|---|---|
| LogD | 回归 | Lipophilicity_AstraZeneca |
| Solubility / Sw | 回归 | Solubility_AqSolDB (+ESOL) |
| Caco-2 | 回归 | Caco2_Wang |
| hPPB | 回归 | PPBR_AZ |
| Vd | 回归 | VDss_Lombardo |
| BBB | 分类 | BBB_Martins |
| CYP1A2/2C9/2C19/2D6/3A4_Inhibitor | 分类 | CYP{1A2,2C9,2C19,2D6,3A4}_Veith |
| CYP2C9/2D6/3A4_Substrate | 分类 | CYP*_Substrate_CarbonMangels |
| hHEP_CLint | 回归 | Clearance_Hepatocyte_AZ |
| HLM/微粒体清除 | 回归 | Clearance_Microsome_AZ |
| Rat_LD50 | 回归 | LD50_Zhu |
| TA_*（Ames 致突变） | 分类 | AMES |
| hERG | 分类 | hERG / hERG_Karim |
| Skin_Sens | 分类 | Skin_Reaction |
| Pgp_Inhibitor | 分类 | Pgp_Broccatelli |

附赠入库（不在 140 但高价值，标注来源）：HIA_Hou、Bioavailability_Ma、PAMPA_NCATS、Half_Life_Obach、DILI、Tox21。

> 注：映射在阶段 3（属性调研）会被验证修订，本表为起点而非最终结论。

### 2.2 缺口属性（预期无干净公开训练集）

PKa、MDCK、多数转运体（BCRP/OATP1B1/OATP1B3/OAT1/OAT3/OCT1/OCT2/BSEP）、各 CYP 动力学参数（Km/Vmax/Ki/CLint 细分）、UGT 系列、血清生化（Ser_*）等。这些在 `property_mapping.csv` 标 `gap`，并尽量记录候选源（如 ChEMBL target id、文献）。

---

## 3. 目录结构

```
datasets/
├── README.md                # 模块说明 + optADMET 映射 + 用法
├── MANIFEST.json            # 总索引:属性→类型/源/状态/行数/许可证/划分
├── PROGRESS.md              # 留痕:每阶段进度日志
├── property_mapping.csv     # 140 属性全表:ML 类型 + 数据可得性
├── scripts/
│   ├── download_tdc.py      # 可复现下载
│   └── normalize.py         # 统一清洗
├── 01_理化_physicochemical/
│   └── <Property>/          # 如 Caco-2、LogD（ASCII 名）
│       ├── raw/
│       ├── processed/       # smiles,label[,unit] + split=train/valid/test
│       ├── metadata.json
│       └── README.md        # 数据卡
├── 02_代谢_metabolism/
├── 03_毒性_toxicity/
├── 04_转运体_transporter/
└── 05_分布排泄_distribution_excretion/
```

属性文件夹用 ASCII 名以便训练脚本引用，中文释义放各自 `README.md` 与 `property_mapping.csv`。

---

## 4. processed 标准格式

每个数据集清洗输出：

- 列：`smiles,label`；回归额外 `unit`；保留 TDC 官方划分，文件按 `train.csv` / `valid.csv` / `test.csv` 落盘。
- SMILES：RDKit canonical 化；剔除 RDKit 无法解析的行；去重。
- `metadata.json` 字段：`name, optadmet_props[], task_type(regression|binary_classification|multitask), source, source_url, license, n_total, n_train/valid/test, smiles_parse_rate, split_method(scaffold/random), download_date, notes`。

---

## 5. 分阶段执行计划（skill + 检查点 + 留痕）

| 阶段 | 内容 | 用的 skill / 工具 | 检查点 | 留痕 |
|---|---|---|---|---|
| 1 设计 spec | 本文档 | superpowers:brainstorming | 用户确认范围 | 本 spec + commit |
| 2 实施计划 | 拆任务 | superpowers:writing-plans | 计划自检 | plan 文件 + commit |
| 3 属性调研映射 | 140 属性判类型+可得性 | web_search/web_fetch + ADMET 知识 | 抽查判定正确性 | property_mapping.csv / MANIFEST + PROGRESS + commit |
| 4 目录骨架 | 建树 + 模板 | bash/Write | 结构核对 | commit |
| 5 下载+清洗 | PyTDC + 直链 → raw → processed | bash(PyTDC/RDKit) | 每批:行数>0、解析率、无空文件 | 每集 metadata + PROGRESS + 分批 commit |
| 6 验收+报告 | 清单总报告 | superpowers:verification-before-completion + superpowers:requesting-code-review | 全量核对成功标准 | 报告 + commit + si:remember |

阶段 3-6 由 `superpowers:executing-plans` 驱动（自带阶段间 review 检查点）。**每阶段完成后先检查、修正，再进下一阶段。**

---

## 6. 环境约束（已实测）

- 沙箱网络对 dataverse.harvard.edu、deepchemdata S3、ChEMBL EBI、PyPI 均可达（curl 实测 200），可直接 `pip install PyTDC` 并下载。
- RDKit 已装在 `admetx-predictor/.venv`，清洗可复用；如需独立环境，在 `datasets/.venv` 另建。
- 当前用户 aiuser；`datasets/` 在 admetx 下，aiuser 有写权限，无需额外授权。

---

## 7. 风险与对策

- **下载源偶发不稳**：脚本可重跑、幂等；失败记入 PROGRESS。
- **TDC 数据集名/划分变动**：metadata 记录 download_date 与版本，便于追溯。
- **属性映射判错**（回归当分类等）：阶段 3 设抽查检查点，并在 README 标注判定依据。
- **范围蔓延**（被诱导去做训练）：严守 §1.3，本次止于干净数据集。
