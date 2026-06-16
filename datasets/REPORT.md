# 数据集总报告

> 生成: 2026-06-16T15:05:39 | 成功 29/29 | 全部 SMILES 解析率 1.0 | 划分 scaffold 70/10/20 (seed42)

## 已下载干净数据集 (29)

| 数据集 | 类型 | optADMET 属性 | train/valid/test | 合计 |
|---|---|---|---|---|
| hERG_Karim | 分类 | hERG | 9411/1344/2690 | 13445 |
| CYP2D6_Veith | 分类 | CYP2D6_Inhibitor | 9191/1313/2626 | 13130 |
| CYP2C19_Veith | 分类 | CYP2C19_Inhibitor | 8865/1266/2534 | 12665 |
| CYP1A2_Veith | 分类 | CYP1A2_Inhibitor | 8805/1257/2517 | 12579 |
| CYP3A4_Veith | 分类 | CYP3A4_Inhibitor | 8629/1232/2467 | 12328 |
| CYP2C9_Veith | 分类 | CYP2C9_Inhibitor | 8464/1209/2419 | 12092 |
| Solubility_AqSolDB | 回归 | Solubility, Sw | 6986/998/1996 | 9980 |
| LD50_Zhu | 回归 | Rat_LD50 | 5144/732/1466 | 7342 |
| AMES | 分类 | TA_97&1537, TA_98, TA_100, TA_102, TA_1535, TA | 5081/721/1453 | 7255 |
| Lipophilicity_AstraZeneca | 回归 | LogD | 2940/420/840 | 4200 |
| PAMPA_NCATS | 分类 | (附赠) | 1423/203/408 | 2034 |
| BBB_Martins | 分类 | BBB | 1383/198/394 | 1975 |
| PPBR_AZ | 回归 | hPPB | 1129/161/324 | 1614 |
| Pgp_Broccatelli | 分类 | Pgp_Inhibitor | 846/121/245 | 1212 |
| VDss_Lombardo | 回归 | Vd | 777/113/221 | 1111 |
| Clearance_Microsome_AZ | 回归 | HLM_Stability | 771/110/221 | 1102 |
| Clearance_Hepatocyte_AZ | 回归 | hHEP_CLint | 713/104/203 | 1020 |
| Caco2_Wang | 回归 | Caco-2 | 634/91/181 | 906 |
| CYP3A4_Substrate_CarbonMangels | 分类 | CYP3A4_Substrate | 466/67/134 | 667 |
| CYP2C9_Substrate_CarbonMangels | 分类 | CYP2C9_Substrate | 465/66/135 | 666 |
| Half_Life_Obach | 回归 | (附赠) | 465/66/134 | 665 |
| CYP2D6_Substrate_CarbonMangels | 分类 | CYP2D6_Substrate | 464/66/134 | 664 |
| hERG | 分类 | hERG | 456/64/128 | 648 |
| HydrationFreeEnergy_FreeSolv | 回归 | (附赠) | 449/41/152 | 642 |
| Bioavailability_Ma | 分类 | (附赠) | 448/64/128 | 640 |
| HIA_Hou | 分类 | (附赠) | 404/57/117 | 578 |
| DILI | 分类 | (附赠) | 332/47/96 | 475 |
| Skin_Reaction | 分类 | Skin_Sens | 282/40/82 | 404 |
| Carcinogens_Lagunin | 分类 | (附赠) | 195/28/55 | 278 |

合计样本: **122,317** 行(去重+canonical 后)。

## 缺口(无干净公开训练集, 见 property_mapping.csv has_dataset=no)

动力学细分(Km/Vmax/Ki/CLint)、UGT 系列、多数转运体(BCRP/OATP/OAT/OCT/BSEP)、血清生化(Ser_*)、风险评估派生指标、PKa/MDCK/LogBB 等;部分已标候选源(OPERA/ChEMBL/FDA MRTD/文献)。

## 下一步(本模块范围外)

按 processed/{train,valid,test}.csv 训练模型 → 写 TorchPredictor 接入 admetx-predictor → 替换随机占位。
