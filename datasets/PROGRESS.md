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
