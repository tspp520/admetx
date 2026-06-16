"""下载清单：派生自 ../property_mapping.csv 的 has_dataset=yes 项。
每条: (tdc_module, tdc_name, task_type, optadmet_props, category_dir, prop_dir)
prop_dir 用 ASCII 名,落在对应 category_dir 下。
"""

DATASETS = [
    # --- 理化 / 吸收 / 分布 / 排泄(物化口径) ---
    ("ADME", "Caco2_Wang", "regression", ["Caco-2"], "01_理化_physicochemical", "Caco-2"),
    ("ADME", "Lipophilicity_AstraZeneca", "regression", ["LogD"], "01_理化_physicochemical", "LogD"),
    ("ADME", "Solubility_AqSolDB", "regression", ["Solubility", "Sw"], "01_理化_physicochemical", "Solubility"),
    ("ADME", "PPBR_AZ", "regression", ["hPPB"], "01_理化_physicochemical", "hPPB"),
    ("ADME", "VDss_Lombardo", "regression", ["Vd"], "01_理化_physicochemical", "Vd"),
    ("ADME", "BBB_Martins", "binary_classification", ["BBB"], "01_理化_physicochemical", "BBB"),
    ("ADME", "HydrationFreeEnergy_FreeSolv", "regression", [], "01_理化_physicochemical", "FreeSolv"),
    ("ADME", "PAMPA_NCATS", "binary_classification", [], "01_理化_physicochemical", "PAMPA"),
    # --- 代谢 ---
    ("ADME", "CYP1A2_Veith", "binary_classification", ["CYP1A2_Inhibitor"], "02_代谢_metabolism", "CYP1A2_Inhibitor"),
    ("ADME", "CYP2C9_Veith", "binary_classification", ["CYP2C9_Inhibitor"], "02_代谢_metabolism", "CYP2C9_Inhibitor"),
    ("ADME", "CYP2C19_Veith", "binary_classification", ["CYP2C19_Inhibitor"], "02_代谢_metabolism", "CYP2C19_Inhibitor"),
    ("ADME", "CYP2D6_Veith", "binary_classification", ["CYP2D6_Inhibitor"], "02_代谢_metabolism", "CYP2D6_Inhibitor"),
    ("ADME", "CYP3A4_Veith", "binary_classification", ["CYP3A4_Inhibitor"], "02_代谢_metabolism", "CYP3A4_Inhibitor"),
    ("ADME", "CYP2C9_Substrate_CarbonMangels", "binary_classification", ["CYP2C9_Substrate"], "02_代谢_metabolism", "CYP2C9_Substrate"),
    ("ADME", "CYP2D6_Substrate_CarbonMangels", "binary_classification", ["CYP2D6_Substrate"], "02_代谢_metabolism", "CYP2D6_Substrate"),
    ("ADME", "CYP3A4_Substrate_CarbonMangels", "binary_classification", ["CYP3A4_Substrate"], "02_代谢_metabolism", "CYP3A4_Substrate"),
    ("ADME", "Clearance_Hepatocyte_AZ", "regression", ["hHEP_CLint"], "02_代谢_metabolism", "hHEP_CLint"),
    ("ADME", "Clearance_Microsome_AZ", "regression", ["HLM_Stability"], "02_代谢_metabolism", "Microsome_Clearance"),
    # --- 毒性 ---
    ("Tox", "LD50_Zhu", "regression", ["Rat_LD50"], "03_毒性_toxicity", "LD50"),
    ("Tox", "AMES", "binary_classification",
     ["TA_97&1537", "TA_98", "TA_100", "TA_102", "TA_1535", "TA"], "03_毒性_toxicity", "AMES"),
    ("Tox", "hERG", "binary_classification", ["hERG"], "03_毒性_toxicity", "hERG"),
    ("Tox", "hERG_Karim", "binary_classification", ["hERG"], "03_毒性_toxicity", "hERG_Karim"),
    ("Tox", "Skin_Reaction", "binary_classification", ["Skin_Sens"], "03_毒性_toxicity", "Skin_Sensitization"),
    ("Tox", "DILI", "binary_classification", [], "03_毒性_toxicity", "DILI"),
    ("Tox", "Carcinogens_Lagunin", "binary_classification", [], "03_毒性_toxicity", "Carcinogens"),
    # --- 转运体 ---
    ("ADME", "Pgp_Broccatelli", "binary_classification", ["Pgp_Inhibitor"], "04_转运体_transporter", "Pgp_Inhibitor"),
    # --- 分布排泄(附赠,无 optADMET 直接对应,标注用) ---
    ("ADME", "Half_Life_Obach", "regression", [], "05_分布排泄_distribution_excretion", "Half_Life"),
    ("ADME", "HIA_Hou", "binary_classification", [], "05_分布排泄_distribution_excretion", "HIA"),
    ("ADME", "Bioavailability_Ma", "binary_classification", [], "05_分布排泄_distribution_excretion", "Bioavailability"),
]
