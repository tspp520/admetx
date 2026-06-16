# datasets 模块进度留痕

## 2026-06-15 Task1 属性映射（键石）

- 产出 `property_mapping.csv`：140 属性全覆盖。
- 类型判定：回归 73 / 二分类 67。
- 数据可得性：`has_dataset=yes` 27 项（映射到 ~22 个 TDC 干净集，部分 1 集对多属性如 Solubility/Sw、5 个 Ames 菌株→AMES）。
- 缺口：113 项无干净公开集（动力学 Km/Vmax/Ki/CLint 细分、UGT 系列、多数转运体、血清生化、风险评估派生指标等），部分标注候选源（OPERA/ChEMBL/FDA MRTD/文献）。
- 自检：行数/唯一数=140、列数全=8、yes 在区间、类型抽查 10 项正确。
- TDC 数据集名经 WebSearch 核验，Task4 下载时二次实证。
- 提交：见 git log（feat(datasets): 属性映射表）。

### 待办（后续 Task）
- Task2 目录骨架；Task3 下载配置+清洗函数+单测；Task4 实际下载清洗。
- Task5-7 由本表生成 model-catalog 并改造 /models。

## 2026-06-15 Task2-3 骨架与清洗函数

- Task2: 五大类别目录 + README + MANIFEST 骨架 + .gitignore（提交 246bbfd）。
- Task3: datasets_config.py（29 个下载条目: ADME 22 + Tox 7）、lib_normalize.py（canonical/dedup/解析率）、test_lib_normalize.py。
- 单测: 5 passed。config 自检: 目录唯一、可导入。

## 2026-06-16 Task4 下载+清洗

- 隔离环境: datasets/.venv (venv, 非 conda)。包源: 阿里云镜像(pip.conf 全局),非 pypi 官方。
- PyTDC 用 --no-deps 安装(规避 torch 888MB 等无关重依赖),只补 pandas/numpy/sklearn/rdkit。
- 下载清洗: 29/29 成功, 0 失败。所有集 SMILES 解析率=1.0。
- 落盘: 87 个 processed CSV(train/valid/test, scaffold 70/10/20) + 29 metadata.json + 29 数据卡 + MANIFEST.json。
- 大文件(raw/*_full.csv、_tdc_cache、.venv)已 gitignore。
- 检查点: 0 缺失 0 空文件。
