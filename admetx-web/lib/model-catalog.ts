// AUTO-GENERATED from datasets/property_mapping.csv — do not edit by hand.
// 重新生成: node datasets/scripts/gen_model_catalog.mjs datasets/property_mapping.csv admetx-web/lib/model-catalog.ts
export type ModelCard = {
  slug: string; name: string; category: string;
  type: 'classification' | 'regression';
  status: 'dataset' | 'placeholder'; datasetSource?: string; description: string;
};

export const MODELS: ModelCard[] = [
  {
    "slug": "mw",
    "name": "MW",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "分子量(RDKit可算)"
  },
  {
    "slug": "tpsa",
    "name": "TPSA",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "拓扑极性表面积(RDKit可算)"
  },
  {
    "slug": "pka",
    "name": "PKa",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "酸碱解离常数(候选OPERA)"
  },
  {
    "slug": "logp",
    "name": "LogP",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "脂水分配系数(RDKit Crippen可算)"
  },
  {
    "slug": "logd",
    "name": "LogD",
    "category": "理化",
    "type": "regression",
    "status": "dataset",
    "datasetSource": "TDC:Lipophilicity_AstraZeneca",
    "description": "pH7.4脂水分配系数"
  },
  {
    "slug": "diffcoef",
    "name": "DiffCoef",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "扩散系数"
  },
  {
    "slug": "sw",
    "name": "Sw",
    "category": "理化",
    "type": "regression",
    "status": "dataset",
    "datasetSource": "TDC:Solubility_AqSolDB",
    "description": "水溶解度"
  },
  {
    "slug": "solubility",
    "name": "Solubility",
    "category": "理化",
    "type": "regression",
    "status": "dataset",
    "datasetSource": "TDC:Solubility_AqSolDB",
    "description": "水溶解度logS"
  },
  {
    "slug": "fassgf",
    "name": "FaSSGF",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "模拟胃液溶解度"
  },
  {
    "slug": "fassif",
    "name": "FaSSIF",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "模拟肠液溶解度"
  },
  {
    "slug": "fessif",
    "name": "FeSSIF",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "进食态模拟肠液溶解度"
  },
  {
    "slug": "caco-2",
    "name": "Caco-2",
    "category": "理化",
    "type": "regression",
    "status": "dataset",
    "datasetSource": "TDC:Caco2_Wang",
    "description": "肠道渗透率代理指标"
  },
  {
    "slug": "mdck",
    "name": "MDCK",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "MDCK细胞渗透性(候选ChEMBL)"
  },
  {
    "slug": "peff",
    "name": "Peff",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "人空肠有效渗透率"
  },
  {
    "slug": "bbb",
    "name": "BBB",
    "category": "理化",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:BBB_Martins",
    "description": "血脑屏障穿透与否"
  },
  {
    "slug": "logbb",
    "name": "LogBB",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "脑血分配比(候选文献集)"
  },
  {
    "slug": "perm-cornea",
    "name": "Perm_Cornea",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "角膜渗透性"
  },
  {
    "slug": "fumic",
    "name": "Fumic",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "微粒体游离分数"
  },
  {
    "slug": "hppb",
    "name": "hPPB",
    "category": "理化",
    "type": "regression",
    "status": "dataset",
    "datasetSource": "TDC:PPBR_AZ",
    "description": "人血浆蛋白结合率"
  },
  {
    "slug": "rppb",
    "name": "rPPB",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "大鼠血浆蛋白结合率"
  },
  {
    "slug": "hrbp",
    "name": "hRBP",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "人血液血浆分配比"
  },
  {
    "slug": "rrbp",
    "name": "rRBP",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "大鼠血液血浆分配比"
  },
  {
    "slug": "vd",
    "name": "Vd",
    "category": "理化",
    "type": "regression",
    "status": "dataset",
    "datasetSource": "TDC:VDss_Lombardo",
    "description": "稳态分布容积"
  },
  {
    "slug": "rlm-stability",
    "name": "RLM_Stability",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "大鼠肝微粒体稳定性"
  },
  {
    "slug": "hlm-stability",
    "name": "HLM_Stability",
    "category": "理化",
    "type": "regression",
    "status": "dataset",
    "datasetSource": "TDC:Clearance_Microsome_AZ",
    "description": "人肝微粒体稳定性(微粒体清除代理)"
  },
  {
    "slug": "syn-accessibility",
    "name": "Syn_Accessibility",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "合成可及性(RDKit SA可算)"
  },
  {
    "slug": "stability",
    "name": "Stability",
    "category": "理化",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "综合代谢稳定性"
  },
  {
    "slug": "cyp1a2-inhibitor",
    "name": "CYP1A2_Inhibitor",
    "category": "代谢",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:CYP1A2_Veith",
    "description": "是否抑制CYP1A2"
  },
  {
    "slug": "cyp1a2-ki",
    "name": "CYP1A2_Ki",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP1A2抑制常数Ki"
  },
  {
    "slug": "cyp1a2-substrate",
    "name": "CYP1A2_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否为CYP1A2底物"
  },
  {
    "slug": "cyp1a2-km",
    "name": "CYP1A2_Km",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP1A2米氏常数Km"
  },
  {
    "slug": "cyp1a2-vmax",
    "name": "CYP1A2_Vmax",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP1A2最大反应速率"
  },
  {
    "slug": "cyp1a2-clint",
    "name": "CYP1A2_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP1A2内在清除率"
  },
  {
    "slug": "cyp2a6-inhibitor",
    "name": "CYP2A6_Inhibitor",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否抑制CYP2A6"
  },
  {
    "slug": "cyp2a6-ki",
    "name": "CYP2A6_Ki",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2A6抑制常数Ki"
  },
  {
    "slug": "cyp2a6-substrate",
    "name": "CYP2A6_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否为CYP2A6底物"
  },
  {
    "slug": "cyp2b6-inhibitor",
    "name": "CYP2B6_Inhibitor",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否抑制CYP2B6"
  },
  {
    "slug": "cyp2b6-substrate",
    "name": "CYP2B6_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否为CYP2B6底物"
  },
  {
    "slug": "cyp2c8-inhibitor",
    "name": "CYP2C8_Inhibitor",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否抑制CYP2C8"
  },
  {
    "slug": "cyp2c8-ki",
    "name": "CYP2C8_Ki",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2C8抑制常数Ki"
  },
  {
    "slug": "cyp2c8-substrate",
    "name": "CYP2C8_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否为CYP2C8底物"
  },
  {
    "slug": "cyp2c9-inhibitor",
    "name": "CYP2C9_Inhibitor",
    "category": "代谢",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:CYP2C9_Veith",
    "description": "是否抑制CYP2C9"
  },
  {
    "slug": "cyp2c9-ki",
    "name": "CYP2C9_Ki",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2C9抑制常数Ki"
  },
  {
    "slug": "cyp2c9-substrate",
    "name": "CYP2C9_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:CYP2C9_Substrate_CarbonMangels",
    "description": "是否为CYP2C9底物"
  },
  {
    "slug": "cyp2c9-km",
    "name": "CYP2C9_Km",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2C9米氏常数Km"
  },
  {
    "slug": "cyp2c9-vmax",
    "name": "CYP2C9_Vmax",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2C9最大反应速率"
  },
  {
    "slug": "cyp2c9-clint",
    "name": "CYP2C9_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2C9内在清除率"
  },
  {
    "slug": "cyp2c19-inhibitor",
    "name": "CYP2C19_Inhibitor",
    "category": "代谢",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:CYP2C19_Veith",
    "description": "是否抑制CYP2C19"
  },
  {
    "slug": "cyp2c19-ki",
    "name": "CYP2C19_Ki",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2C19抑制常数Ki"
  },
  {
    "slug": "cyp2c19-substrate",
    "name": "CYP2C19_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否为CYP2C19底物"
  },
  {
    "slug": "cyp2c19-km",
    "name": "CYP2C19_Km",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2C19米氏常数Km"
  },
  {
    "slug": "cyp2c19-vmax",
    "name": "CYP2C19_Vmax",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2C19最大反应速率"
  },
  {
    "slug": "cyp2c19-clint",
    "name": "CYP2C19_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2C19内在清除率"
  },
  {
    "slug": "cyp2d6-inhibitor",
    "name": "CYP2D6_Inhibitor",
    "category": "代谢",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:CYP2D6_Veith",
    "description": "是否抑制CYP2D6"
  },
  {
    "slug": "cyp2d6-ki",
    "name": "CYP2D6_Ki",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2D6抑制常数Ki"
  },
  {
    "slug": "cyp2d6-substrate",
    "name": "CYP2D6_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:CYP2D6_Substrate_CarbonMangels",
    "description": "是否为CYP2D6底物"
  },
  {
    "slug": "cyp2d6-km",
    "name": "CYP2D6_Km",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2D6米氏常数Km"
  },
  {
    "slug": "cyp2d6-vmax",
    "name": "CYP2D6_Vmax",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2D6最大反应速率"
  },
  {
    "slug": "cyp2d6-clint",
    "name": "CYP2D6_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP2D6内在清除率"
  },
  {
    "slug": "cyp2e1-inhibitor",
    "name": "CYP2E1_Inhibitor",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否抑制CYP2E1"
  },
  {
    "slug": "cyp2e1-substrate",
    "name": "CYP2E1_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "是否为CYP2E1底物"
  },
  {
    "slug": "cyp3a4-inhibitor",
    "name": "CYP3A4_Inhibitor",
    "category": "代谢",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:CYP3A4_Veith",
    "description": "是否抑制CYP3A4"
  },
  {
    "slug": "cyp3a4-ki",
    "name": "CYP3A4_Ki",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP3A4抑制常数Ki"
  },
  {
    "slug": "cyp3a4-substrate",
    "name": "CYP3A4_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:CYP3A4_Substrate_CarbonMangels",
    "description": "是否为CYP3A4底物"
  },
  {
    "slug": "cyp3a4-km",
    "name": "CYP3A4_Km",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP3A4米氏常数Km"
  },
  {
    "slug": "cyp3a4-vmax",
    "name": "CYP3A4_Vmax",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP3A4最大反应速率"
  },
  {
    "slug": "cyp3a4-clint",
    "name": "CYP3A4_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP3A4内在清除率"
  },
  {
    "slug": "cyp-clint",
    "name": "CYP_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "综合CYP内在清除率"
  },
  {
    "slug": "cyp3a4hlm-km",
    "name": "CYP3A4HLM_Km",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "3A4肝微粒体米氏常数"
  },
  {
    "slug": "cyp3a4hlm-vmax",
    "name": "CYP3A4HLM_Vmax",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "3A4肝微粒体最大速率"
  },
  {
    "slug": "cyp3a4hlm-clint",
    "name": "CYP3A4HLM_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "3A4肝微粒体内在清除"
  },
  {
    "slug": "cyphlm-clint",
    "name": "CYPHLM_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP肝微粒体清除(候选微粒体清除代理)"
  },
  {
    "slug": "cyprlm-clint",
    "name": "CYPRLM_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "CYP大鼠肝微粒体清除"
  },
  {
    "slug": "hhep-clint",
    "name": "hHEP_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "dataset",
    "datasetSource": "TDC:Clearance_Hepatocyte_AZ",
    "description": "人肝细胞内在清除率"
  },
  {
    "slug": "rhep-clint",
    "name": "rHEP_CLint",
    "category": "代谢",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "大鼠肝细胞内在清除率"
  },
  {
    "slug": "aox-substrate",
    "name": "AOX_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "醛氧化酶底物"
  },
  {
    "slug": "ugt1a1-substrate",
    "name": "UGT1A1_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "UGT1A1底物"
  },
  {
    "slug": "ugt1a3-substrate",
    "name": "UGT1A3_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "UGT1A3底物"
  },
  {
    "slug": "ugt1a4-substrate",
    "name": "UGT1A4_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "UGT1A4底物"
  },
  {
    "slug": "ugt1a6-substrate",
    "name": "UGT1A6_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "UGT1A6底物"
  },
  {
    "slug": "ugt1a8-substrate",
    "name": "UGT1A8_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "UGT1A8底物"
  },
  {
    "slug": "ugt1a9-substrate",
    "name": "UGT1A9_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "UGT1A9底物"
  },
  {
    "slug": "ugt1a10-substrate",
    "name": "UGT1A10_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "UGT1A10底物"
  },
  {
    "slug": "ugt2b7-substrate",
    "name": "UGT2B7_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "UGT2B7底物"
  },
  {
    "slug": "ugt2b15-substrate",
    "name": "UGT2B15_Substrate",
    "category": "代谢",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "UGT2B15底物"
  },
  {
    "slug": "ta-97-1537",
    "name": "TA_97&1537",
    "category": "毒性",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:AMES",
    "description": "Ames致突变(菌株级用整体代理)"
  },
  {
    "slug": "mta-97-1537",
    "name": "mTA_97&1537",
    "category": "毒性",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "代谢活化Ames致突变"
  },
  {
    "slug": "ta-98",
    "name": "TA_98",
    "category": "毒性",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:AMES",
    "description": "Ames致突变(菌株级用整体代理)"
  },
  {
    "slug": "mta-98",
    "name": "mTA_98",
    "category": "毒性",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "代谢活化Ames致突变"
  },
  {
    "slug": "ta-100",
    "name": "TA_100",
    "category": "毒性",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:AMES",
    "description": "Ames致突变(菌株级用整体代理)"
  },
  {
    "slug": "mta-100",
    "name": "mTA_100",
    "category": "毒性",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "代谢活化Ames致突变"
  },
  {
    "slug": "ta-102",
    "name": "TA_102",
    "category": "毒性",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:AMES",
    "description": "Ames致突变(菌株级用整体代理)"
  },
  {
    "slug": "mta-102",
    "name": "mTA_102",
    "category": "毒性",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "代谢活化Ames致突变"
  },
  {
    "slug": "ta-1535",
    "name": "TA_1535",
    "category": "毒性",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:AMES",
    "description": "Ames致突变(菌株级用整体代理)"
  },
  {
    "slug": "mta-1535",
    "name": "mTA_1535",
    "category": "毒性",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "代谢活化Ames致突变"
  },
  {
    "slug": "ta",
    "name": "TA",
    "category": "毒性",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:AMES",
    "description": "整体Ames致突变性"
  },
  {
    "slug": "chromosomal-aberr",
    "name": "Chromosomal_aberr",
    "category": "毒性",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "染色体畸变(候选文献集)"
  },
  {
    "slug": "herg",
    "name": "hERG",
    "category": "毒性",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:hERG",
    "description": "hERG钾通道抑制"
  },
  {
    "slug": "herg-ic50",
    "name": "HERG_IC50",
    "category": "毒性",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "hERG IC50(候选ChEMBL回归集)"
  },
  {
    "slug": "resp-sens",
    "name": "Resp_Sens",
    "category": "毒性",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "呼吸致敏"
  },
  {
    "slug": "skin-sens",
    "name": "Skin_Sens",
    "category": "毒性",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:Skin_Reaction",
    "description": "皮肤致敏"
  },
  {
    "slug": "rat-ld50",
    "name": "Rat_LD50",
    "category": "毒性",
    "type": "regression",
    "status": "dataset",
    "datasetSource": "TDC:LD50_Zhu",
    "description": "大鼠急性经口LD50"
  },
  {
    "slug": "rat-td50",
    "name": "Rat_TD50",
    "category": "毒性",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "大鼠致癌TD50"
  },
  {
    "slug": "mouse-td50",
    "name": "Mouse_TD50",
    "category": "毒性",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "小鼠致癌TD50"
  },
  {
    "slug": "phototoxicity",
    "name": "Phototoxicity",
    "category": "毒性",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "光毒性"
  },
  {
    "slug": "mrtd",
    "name": "MRTD",
    "category": "毒性",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "最大推荐治疗剂量(候选FDA MRTD)"
  },
  {
    "slug": "ser-alk",
    "name": "Ser_ALK",
    "category": "毒性",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "血清碱性磷酸酶"
  },
  {
    "slug": "ser-alt",
    "name": "Ser_ALT",
    "category": "毒性",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "血清丙氨酸转氨酶"
  },
  {
    "slug": "ser-ast",
    "name": "Ser_AST",
    "category": "毒性",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "血清天冬氨酸转氨酶"
  },
  {
    "slug": "ser-ggt",
    "name": "Ser_GGT",
    "category": "毒性",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "血清谷氨酰转移酶"
  },
  {
    "slug": "ser-ldh",
    "name": "Ser_LDH",
    "category": "毒性",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "血清乳酸脱氢酶"
  },
  {
    "slug": "pgp-substrate",
    "name": "Pgp_Substrate",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "P-gp底物(候选ChEMBL)"
  },
  {
    "slug": "pgp-inhibitor",
    "name": "Pgp_Inhibitor",
    "category": "转运体",
    "type": "classification",
    "status": "dataset",
    "datasetSource": "TDC:Pgp_Broccatelli",
    "description": "P-gp抑制剂"
  },
  {
    "slug": "bcrp-substrate",
    "name": "BCRP_Substrate",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "BCRP底物"
  },
  {
    "slug": "bcrp-inhibitor",
    "name": "BCRP_Inhibitor",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "BCRP抑制剂(候选ChEMBL)"
  },
  {
    "slug": "oatp1b1-substrate",
    "name": "OATP1B1_Substrate",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OATP1B1底物"
  },
  {
    "slug": "oatp1b1-inhibitor",
    "name": "OATP1B1_Inhibitor",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OATP1B1抑制剂"
  },
  {
    "slug": "oatp1b1-km",
    "name": "OATP1B1_Km",
    "category": "转运体",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OATP1B1米氏常数"
  },
  {
    "slug": "oatp1b3-substrate",
    "name": "OATP1B3_Substrate",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OATP1B3底物"
  },
  {
    "slug": "oatp1b3-inhibitor",
    "name": "OATP1B3_Inhibitor",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OATP1B3抑制剂"
  },
  {
    "slug": "oatp1b3-km",
    "name": "OATP1B3_Km",
    "category": "转运体",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OATP1B3米氏常数"
  },
  {
    "slug": "bsep-inhibitor",
    "name": "BSEP_Inhibitor",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "BSEP抑制剂(候选ChEMBL)"
  },
  {
    "slug": "bsep-ic50",
    "name": "BSEP_IC50",
    "category": "转运体",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "BSEP IC50"
  },
  {
    "slug": "oat1-substrate",
    "name": "OAT1_Substrate",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OAT1底物"
  },
  {
    "slug": "oat1-inhibitor",
    "name": "OAT1_Inhibitor",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OAT1抑制剂"
  },
  {
    "slug": "oat1-km",
    "name": "OAT1_Km",
    "category": "转运体",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OAT1米氏常数"
  },
  {
    "slug": "oat3-substrate",
    "name": "OAT3_Substrate",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OAT3底物"
  },
  {
    "slug": "oat3-inhibitor",
    "name": "OAT3_Inhibitor",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OAT3抑制剂"
  },
  {
    "slug": "oat3-km",
    "name": "OAT3_Km",
    "category": "转运体",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OAT3米氏常数"
  },
  {
    "slug": "oct1-substrate",
    "name": "OCT1_Substrate",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OCT1底物"
  },
  {
    "slug": "oct1-inhibitor",
    "name": "OCT1_Inhibitor",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OCT1抑制剂"
  },
  {
    "slug": "oct1-km",
    "name": "OCT1_Km",
    "category": "转运体",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OCT1米氏常数"
  },
  {
    "slug": "oct2-substrate",
    "name": "OCT2_Substrate",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OCT2底物"
  },
  {
    "slug": "oct2-inhibitor",
    "name": "OCT2_Inhibitor",
    "category": "转运体",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OCT2抑制剂"
  },
  {
    "slug": "oct2-km",
    "name": "OCT2_Km",
    "category": "转运体",
    "type": "regression",
    "status": "placeholder",
    "datasetSource": "",
    "description": "OCT2米氏常数"
  },
  {
    "slug": "",
    "name": "吸收风险",
    "category": "风险评估",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "派生指标综合吸收类预测"
  },
  {
    "slug": "-x",
    "name": "代谢风险",
    "category": "风险评估",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "派生指标综合代谢类预测"
  },
  {
    "slug": "-x-x",
    "name": "基因毒性风险",
    "category": "风险评估",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "派生指标综合遗传毒性预测"
  },
  {
    "slug": "-x-x-x",
    "name": "毒性风险",
    "category": "风险评估",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "派生指标综合毒性预测"
  },
  {
    "slug": "admet",
    "name": "ADMET总风险",
    "category": "风险评估",
    "type": "classification",
    "status": "placeholder",
    "datasetSource": "",
    "description": "派生指标全面综合评分"
  }
];
