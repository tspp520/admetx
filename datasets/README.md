# admetx datasets 模块

按 ADMET 属性收集**干净的公开数据集**，供后续训练真实 ML 模型、替换 predictor 中的随机占位。

设计文档：`docs/superpowers/specs/2026-06-15-admetx-datasets-design.md`
实施计划：`docs/superpowers/plans/2026-06-15-admetx-datasets-and-models.md`

## 单一事实源

`property_mapping.csv` 是唯一事实源：optADMET 140 属性 → 监督学习类型（回归/分类）+ 有无干净公开数据集。
- 数据集下载清单（Task3 `scripts/datasets_config.py`）由它派生。
- 前端 `/models` 的 `admetx-web/lib/model-catalog.ts` 由它生成（Task5 `scripts/gen_model_catalog.mjs`）。
- 两条线共享，避免双份维护漂移。

字段：`optadmet_prop,category,subarea,task_type,has_dataset,dataset_source,split,notes`
（字段内不得含逗号——生成脚本按逗号分列。）

## 目录约定

```
<NN_类别_english>/<Property>/
├── raw/                 # 原始下载文件(大文件,gitignore)
├── processed/           # 清洗后: train.csv / valid.csv / test.csv
├── metadata.json        # 源/许可证/行数/类型/划分/解析率/日期
└── README.md            # 数据卡
```

类别目录：`01_理化_physicochemical`、`02_代谢_metabolism`、`03_毒性_toxicity`、`04_转运体_transporter`、`05_分布排泄_distribution_excretion`。
属性目录用 ASCII 名（训练脚本好引用），中文释义在各自 README 与 `property_mapping.csv`。

## processed 标准格式

- 列：`smiles,label`（回归值或 0/1 分类标签）。
- SMILES：RDKit canonical 化；剔除无法解析行；去重。
- 划分：沿用 TDC scaffold 70/10/20（seed 42），分别落 `train.csv`/`valid.csv`/`test.csv`。

## 复现

```bash
# 依赖(复用 predictor venv,内含 RDKit)
../admetx-predictor/.venv/bin/pip install PyTDC pandas
# 下载+清洗
cd scripts && ../../admetx-predictor/.venv/bin/python download_clean.py
# 由映射生成前端目录
node gen_model_catalog.mjs ../property_mapping.csv ../../admetx-web/lib/model-catalog.ts
```

## 范围边界

本模块只交付**干净数据集 + 文档 + 可复现脚本**。模型训练、`TorchPredictor` 接入、上线属于后续工作，不在此。

进度见 `PROGRESS.md`，数据集总索引见 `MANIFEST.json`。
