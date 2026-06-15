# 待预测 ADMET 属性清单（竞品参考：天智药成 optADMET）

> 来源：天智药成产品「计算 optADMET 参数」勾选弹窗（本目录 1.png ~ 4.png 的上下滚动截图）。
> 用途：admetx 待预测属性范围参考。
> 统计：标准待预测属性 **140** 个，分 5 大类；另含「自建模型」占位 2 个（非标准属性）。

| 分类 | 数量 |
|------|------|
| 理化参数 | 27 |
| 代谢参数 | 58 |
| 毒性参数 | 26 |
| 转运体参数 | 24 |
| 风险评估 | 5 |
| 自建模型（占位，非标准属性） | 2 |
| **合计（不含自建模型）** | **140** |

---

## 1. 理化参数（27）

| # | 属性名 | # | 属性名 | # | 属性名 |
|---|--------|---|--------|---|--------|
| 1 | MW | 10 | FaSSIF | 19 | hPPB |
| 2 | TPSA | 11 | FeSSIF | 20 | rPPB |
| 3 | PKa | 12 | Caco-2 | 21 | hRBP |
| 4 | LogP | 13 | MDCK | 22 | rRBP |
| 5 | LogD | 14 | Peff | 23 | Vd |
| 6 | DiffCoef | 15 | BBB | 24 | RLM_Stability |
| 7 | Sw | 16 | LogBB | 25 | HLM_Stability |
| 8 | Solubility | 17 | Perm_Cornea | 26 | Syn_Accessibility |
| 9 | FaSSGF | 18 | Fumic | 27 | Stability |

---

## 2. 代谢参数（58）

### 2.1 CYP 酶（按亚型）

| 酶亚型 | 相关属性 |
|--------|----------|
| CYP1A2 | Inhibitor、Ki、Substrate、Km、Vmax、CLint |
| CYP2A6 | Inhibitor、Ki、Substrate |
| CYP2B6 | Inhibitor、Substrate |
| CYP2C8 | Inhibitor、Ki、Substrate |
| CYP2C9 | Inhibitor、Ki、Substrate、Km、Vmax、CLint |
| CYP2C19 | Inhibitor、Ki、Substrate、Km、Vmax、CLint |
| CYP2D6 | Inhibitor、Ki、Substrate、Km、Vmax、CLint |
| CYP2E1 | Inhibitor、Substrate |
| CYP3A4 | Inhibitor、Ki、Substrate、Km、Vmax、CLint |

### 2.2 CYP 综合 / 肝微粒体 / 肝细胞清除率

CYP_CLint、CYP3A4HLM_Km、CYP3A4HLM_Vmax、CYP3A4HLM_CLint、CYPHLM_CLint、CYPRLM_CLint、hHEP_CLint、rHEP_CLint

### 2.3 其他代谢酶

AOX_Substrate

### 2.4 UGT 系列（_Substrate）

UGT1A1、UGT1A3、UGT1A4、UGT1A6、UGT1A8、UGT1A9、UGT1A10、UGT2B7、UGT2B15

---

## 3. 毒性参数（26）

### 3.1 Ames 致突变（TA / mTA 各菌株）

TA_97&1537、mTA_97&1537、TA_98、mTA_98、TA_100、mTA_100、TA_102、mTA_102、TA_1535、mTA_1535、TA

### 3.2 遗传 / 心脏 / 致敏 / 光毒性

Chromosomal_aberr、hERG、HERG_IC50、Resp_Sens、Skin_Sens、Phototoxicity

### 3.3 急性 / 慢性毒性

Rat_LD50、Rat_TD50、Mouse_TD50、MRTD

### 3.4 血清生化指标（Ser_）

Ser_ALK、Ser_ALT、Ser_AST、Ser_GGT、Ser_LDH

---

## 4. 转运体参数（24）

| 转运体 | 相关属性 |
|--------|----------|
| Pgp | Substrate、Inhibitor |
| BCRP | Substrate、Inhibitor |
| OATP1B1 | Substrate、Inhibitor、Km |
| OATP1B3 | Substrate、Inhibitor、Km |
| BSEP | Inhibitor、IC50 |
| OAT1 | Substrate、Inhibitor、Km |
| OAT3 | Substrate、Inhibitor、Km |
| OCT1 | Substrate、Inhibitor、Km |
| OCT2 | Substrate、Inhibitor、Km |

---

## 5. 风险评估（5）

吸收风险、代谢风险、基因毒性风险、毒性风险、ADMET总风险

---

## 6. 自建模型（2，占位，非标准待预测属性）

h、f

> 说明：截图中「自建模型」分组下的 `h`、`f` 看起来是用户自建模型的占位/示例条目，不属于天智药成内置的标准待预测属性，仅作记录。

---

*整理依据：1.png（理化参数、代谢参数前段）、2.png（代谢参数后段、毒性参数前段）、3.png（毒性参数、转运体参数前段）、4.png（转运体参数后段、风险评估、自建模型）。*
