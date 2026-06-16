# admetx 数据集模块 + /models 改造 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 admetx 下建 `datasets/` 模块：逐属性判定回归/分类与公开数据可得性、下载并清洗 ~25-30 个干净公开数据集；并由同一份映射表驱动 `/models` 页面改造为全 140 项、可折叠、可筛选的目录。

**Architecture:** `datasets/property_mapping.csv` 是唯一事实源（140 属性 → 类型/数据可得性）。数据集走 PyTDC 下载→RDKit 清洗→`processed/` 标准格式 + `metadata.json`。`/models` 的 `lib/model-catalog.ts` 由 CSV 生成脚本产出，前端改为折叠手风琴 + 工具条。本次**不含训练与模型上线**。

**Tech Stack:** Python 3 + PyTDC + RDKit（清洗，复用 `admetx-predictor/.venv`）；Next.js App Router + TypeScript + Tailwind（前端）；Node 脚本做 CSV→TS 生成。

**留痕约定:** 每个 Task 结束写 `datasets/PROGRESS.md` 一条 + git commit；每阶段完成先自检验收再进下一阶段。

---

## 文件结构总览

```
datasets/
├── README.md  MANIFEST.json  PROGRESS.md  property_mapping.csv
├── scripts/
│   ├── datasets_config.py     # 数据集→optADMET 映射配置(下载清单)
│   ├── download_clean.py      # 下载+清洗主脚本
│   ├── lib_normalize.py       # 纯函数:canonical/dedup/解析率(可测)
│   ├── test_lib_normalize.py  # 单测
│   └── gen_model_catalog.mjs  # property_mapping.csv → model-catalog.ts
├── 01_理化_physicochemical/<Prop>/{raw,processed,metadata.json,README.md}
├── 02_代谢_metabolism/...
├── 03_毒性_toxicity/...
├── 04_转运体_transporter/...
└── 05_分布排泄_distribution_excretion/...

admetx-web/
├── lib/model-catalog.ts        # 由 gen 脚本生成(140 条)
├── components/model-card.tsx    # 加状态徽章
└── app/(app)/models/page.tsx    # 改折叠手风琴+工具条(client)
```

---

## 阶段 1 / Task 1：属性映射研究 → `property_mapping.csv`（键石）

**Files:**
- Create: `datasets/property_mapping.csv`
- Create: `datasets/PROGRESS.md`
- Source of truth: `天智药成的产品截图/他们能预测的相关admet属性/待预测ADMET属性清单.md`

**CSV schema（表头固定）:**
```
optadmet_prop,category,subarea,task_type,has_dataset,dataset_source,split,notes
```
- `task_type` ∈ `regression | binary_classification`（连续值=回归；is-inhibitor/substrate/通过与否=分类）
- `has_dataset` ∈ `yes | no`；`yes` 必须填 `dataset_source`（如 `TDC:Caco2_Wang`）
- `category` ∈ `理化 | 代谢 | 毒性 | 转运体 | 风险评估`；`subarea` 细分（吸收/分布/排泄等，可空）

- [ ] **Step 1: 判类型规则落定**。回归：MW/TPSA/PKa/LogP/LogD/Sw/Solubility/各 *_Km/*_Vmax/*_CLint/*_Ki/*_IC50/Vd/PPB/RBP/LD50/TD50/MRTD/Ser_* 等连续量。分类：BBB/各 *_Inhibitor/*_Substrate/Ames TA_*/hERG(非IC50)/致敏/光毒/Pgp 等二分类。风险评估 5 项按分类（风险等级/是否高风险）。
- [ ] **Step 2: 标 has_dataset**。对照下表 seed 映射（阶段3下载清单），命中的属性标 `yes` + source；其余 `no`，能想到候选源写进 `notes`（如 `ChEMBL target CHEMBL...`）。
- [ ] **Step 3: 不确定项联网核验**。对拿不准类型/可得性的属性用 web_search 核验（如某属性 TDC 是否有、是回归还是分类）。每条核验结论写入 `notes`。
- [ ] **Step 4: 写满 140 行**。逐条覆盖清单全部属性（理化27/代谢58/毒性26/转运体24/风险5，自建模型 h/f 跳过）。
- [ ] **Step 5: 自检**。`awk -F, 'NR>1{print $1}' datasets/property_mapping.csv | sort -u | wc -l` 应=140；`grep -c ',yes,' ...` 落在 25-45 区间；抽查 10 行类型判定正确。
- [ ] **Step 6: 留痕+提交**。
```bash
cd /export/projects/admetx
printf '## %s Task1 属性映射\n- property_mapping.csv 完成,140 行,has_dataset=yes N 个\n\n' "$(date +%F)" >> datasets/PROGRESS.md
git add datasets/property_mapping.csv datasets/PROGRESS.md
git commit -m "feat(datasets): 140 属性回归/分类+数据可得性映射表"
```

**Seed 映射（下载清单，阶段3复用）:**

| dataset_source (TDC) | task_type | optadmet_prop | category/subarea |
|---|---|---|---|
| Lipophilicity_AstraZeneca | regression | LogD | 理化 |
| Solubility_AqSolDB | regression | Solubility,Sw | 理化 |
| Caco2_Wang | regression | Caco-2 | 理化/吸收 |
| HydrationFreeEnergy_FreeSolv | regression | (溶剂化能) | 理化 |
| PPBR_AZ | regression | hPPB | 理化/分布 |
| VDss_Lombardo | regression | Vd | 理化/分布 |
| BBB_Martins | binary_classification | BBB | 理化/分布 |
| CYP1A2_Veith | binary_classification | CYP1A2_Inhibitor | 代谢 |
| CYP2C9_Veith | binary_classification | CYP2C9_Inhibitor | 代谢 |
| CYP2C19_Veith | binary_classification | CYP2C19_Inhibitor | 代谢 |
| CYP2D6_Veith | binary_classification | CYP2D6_Inhibitor | 代谢 |
| CYP3A4_Veith | binary_classification | CYP3A4_Inhibitor | 代谢 |
| CYP2C9_Substrate_CarbonMangels | binary_classification | CYP2C9_Substrate | 代谢 |
| CYP2D6_Substrate_CarbonMangels | binary_classification | CYP2D6_Substrate | 代谢 |
| CYP3A4_Substrate_CarbonMangels | binary_classification | CYP3A4_Substrate | 代谢 |
| Clearance_Hepatocyte_AZ | regression | hHEP_CLint | 代谢/排泄 |
| Clearance_Microsome_AZ | regression | HLM_Stability(代理) | 代谢/排泄 |
| Half_Life_Obach | regression | (半衰期) | 排泄 |
| LD50_Zhu | regression | Rat_LD50 | 毒性 |
| AMES | binary_classification | TA_*（Ames 致突变） | 毒性 |
| hERG | binary_classification | hERG | 毒性 |
| hERG_Karim | binary_classification | hERG | 毒性 |
| Skin_Reaction | binary_classification | Skin_Sens | 毒性 |
| DILI | binary_classification | (肝毒) | 毒性 |
| Carcinogens_Lagunin | binary_classification | (致癌) | 毒性 |
| Pgp_Broccatelli | binary_classification | Pgp_Inhibitor | 转运体 |
| HIA_Hou | binary_classification | (人肠吸收) | 吸收 |
| Bioavailability_Ma | binary_classification | (口服生物利用度) | 吸收 |
| PAMPA_NCATS | binary_classification | (PAMPA 渗透) | 吸收 |

---

## 阶段 2 / Task 2：`datasets/` 骨架 + 模块文档

**Files:** Create `datasets/README.md`, `datasets/MANIFEST.json`, 五个类别目录。

- [ ] **Step 1: 建目录**
```bash
cd /export/projects/admetx/datasets
mkdir -p scripts 01_理化_physicochemical 02_代谢_metabolism 03_毒性_toxicity 04_转运体_transporter 05_分布排泄_distribution_excretion
```
- [ ] **Step 2: 写 `README.md`**（模块说明：目的、目录约定、processed 标准格式、与 `/models` 同源关系、如何重跑脚本）。内容覆盖 spec §3/§4。
- [ ] **Step 3: 写 `MANIFEST.json` 初始骨架** `{"generated": "", "datasets": []}`（Task4 回填）。
- [ ] **Step 4: 提交**
```bash
git add datasets/README.md datasets/MANIFEST.json datasets/.gitkeep 2>/dev/null; git add datasets/
git commit -m "feat(datasets): 模块目录骨架 + README + MANIFEST"
```

---

## 阶段 3 / Task 3：下载清单配置 + 清洗纯函数（含单测）

**Files:** Create `datasets/scripts/datasets_config.py`, `lib_normalize.py`, `test_lib_normalize.py`.

- [ ] **Step 1: 写 `datasets_config.py`**——把上面 seed 表落成 Python 列表：
```python
# (tdc_module, tdc_name, task_type, optadmet_props, category_dir, prop_dir)
DATASETS = [
    ("ADME", "Caco2_Wang", "regression", ["Caco-2"], "01_理化_physicochemical", "Caco-2"),
    ("ADME", "Lipophilicity_AstraZeneca", "regression", ["LogD"], "01_理化_physicochemical", "LogD"),
    ("ADME", "Solubility_AqSolDB", "regression", ["Solubility","Sw"], "01_理化_physicochemical", "Solubility"),
    ("ADME", "PPBR_AZ", "regression", ["hPPB"], "01_理化_physicochemical", "hPPB"),
    ("ADME", "VDss_Lombardo", "regression", ["Vd"], "01_理化_physicochemical", "Vd"),
    ("ADME", "BBB_Martins", "binary_classification", ["BBB"], "01_理化_physicochemical", "BBB"),
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
    ("ADME", "Half_Life_Obach", "regression", [], "05_分布排泄_distribution_excretion", "Half_Life"),
    ("ADME", "HIA_Hou", "binary_classification", [], "05_分布排泄_distribution_excretion", "HIA"),
    ("ADME", "Bioavailability_Ma", "binary_classification", [], "05_分布排泄_distribution_excretion", "Bioavailability"),
    ("ADME", "PAMPA_NCATS", "binary_classification", [], "01_理化_physicochemical", "PAMPA"),
    ("ADME", "HydrationFreeEnergy_FreeSolv", "regression", [], "01_理化_physicochemical", "FreeSolv"),
    ("ADME", "Pgp_Broccatelli", "binary_classification", ["Pgp_Inhibitor"], "04_转运体_transporter", "Pgp_Inhibitor"),
    ("Tox", "LD50_Zhu", "regression", ["Rat_LD50"], "03_毒性_toxicity", "LD50"),
    ("Tox", "AMES", "binary_classification", ["TA_97&1537","TA_98","TA_100","TA_102","TA_1535"], "03_毒性_toxicity", "AMES"),
    ("Tox", "hERG", "binary_classification", ["hERG"], "03_毒性_toxicity", "hERG"),
    ("Tox", "hERG_Karim", "binary_classification", ["hERG"], "03_毒性_toxicity", "hERG_Karim"),
    ("Tox", "Skin_Reaction", "binary_classification", ["Skin_Sens"], "03_毒性_toxicity", "Skin_Sensitization"),
    ("Tox", "DILI", "binary_classification", [], "03_毒性_toxicity", "DILI"),
    ("Tox", "Carcinogens_Lagunin", "binary_classification", [], "03_毒性_toxicity", "Carcinogens"),
]
```
- [ ] **Step 2: 写 `lib_normalize.py` 失败测试先行** `test_lib_normalize.py`：
```python
from lib_normalize import canonicalize, clean_frame
def test_canonicalize_valid():
    assert canonicalize("C(C)O") == "CCO"
def test_canonicalize_invalid_returns_none():
    assert canonicalize("not_a_smiles") is None
def test_clean_frame_dedup_and_drop_invalid():
    rows = [("CCO", 1.0), ("C(C)O", 2.0), ("xx", 3.0)]   # 后两个:重复/非法
    out, rate = clean_frame(rows)
    assert len(out) == 1 and out[0][0] == "CCO"
    assert 0.0 <= rate <= 1.0
```
- [ ] **Step 3: 跑测试确认失败** `cd datasets/scripts && ../../admetx-predictor/.venv/bin/python -m pytest test_lib_normalize.py -v` → FAIL（模块不存在）。
- [ ] **Step 4: 实现 `lib_normalize.py`**
```python
from rdkit import Chem
def canonicalize(smiles: str):
    m = Chem.MolFromSmiles(smiles) if smiles else None
    return Chem.MolToSmiles(m) if m else None
def clean_frame(rows):
    """rows: list[(smiles,label)] -> (cleaned_unique_rows, parse_rate)"""
    seen, out, ok = set(), [], 0
    for smi, label in rows:
        c = canonicalize(smi)
        if c is None: continue
        ok += 1
        if c in seen: continue
        seen.add(c); out.append((c, label))
    rate = ok / len(rows) if rows else 0.0
    return out, rate
```
- [ ] **Step 5: 跑测试确认通过**（同 Step3 命令）→ 3 passed。
- [ ] **Step 6: 提交**
```bash
git add datasets/scripts/datasets_config.py datasets/scripts/lib_normalize.py datasets/scripts/test_lib_normalize.py
git commit -m "feat(datasets): 下载清单配置 + 清洗纯函数(canonical/dedup) + 单测"
```

---

## 阶段 4 / Task 4：下载 + 清洗 + 数据卡 + MANIFEST 回填

**Files:** Create `datasets/scripts/download_clean.py`；各属性 `processed/{train,valid,test}.csv` + `metadata.json` + `README.md`；更新 `MANIFEST.json`、`PROGRESS.md`。

- [ ] **Step 1: 装 PyTDC** `../../admetx-predictor/.venv/bin/pip install PyTDC pandas`（RDKit 已在该 venv）。失败则 `python -m pip ... --break-system-packages`。
- [ ] **Step 2: 写 `download_clean.py`**
```python
import json, os, datetime
import pandas as pd
from tdc.single_pred import ADME, Tox
from lib_normalize import clean_frame
from datasets_config import DATASETS

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW_CACHE = os.path.join(ROOT, "scripts", "_tdc_cache")
CLS = {"ADME": ADME, "Tox": Tox}

def run_one(mod, name, task, props, cat_dir, prop_dir):
    data = CLS[mod](name=name, path=RAW_CACHE)
    sp = data.get_split(method="scaffold", seed=42, frac=[0.7,0.1,0.2])
    base = os.path.join(ROOT, cat_dir, prop_dir)
    proc = os.path.join(base, "processed"); raw = os.path.join(base, "raw")
    os.makedirs(proc, exist_ok=True); os.makedirs(raw, exist_ok=True)
    counts, rates = {}, []
    for split_name in ("train","valid","test"):
        df = sp[split_name]
        rows = list(zip(df["Drug"].tolist(), df["Y"].tolist()))
        cleaned, rate = clean_frame(rows); rates.append(rate)
        out = pd.DataFrame(cleaned, columns=["smiles","label"])
        out.to_csv(os.path.join(proc, f"{split_name}.csv"), index=False)
        counts[split_name] = len(out)
    data.get_data().to_csv(os.path.join(raw, f"{name}_full.csv"), index=False)
    meta = {
        "name": name, "optadmet_props": props, "task_type": task,
        "source": f"TDC:{name}", "source_url": "https://tdcommons.ai",
        "license": "CC BY 4.0 (见 TDC 各集说明)",
        "n_train": counts["train"], "n_valid": counts["valid"], "n_test": counts["test"],
        "n_total": sum(counts.values()),
        "smiles_parse_rate": round(min(rates), 4),
        "split_method": "scaffold", "seed": 42,
        "download_date": datetime.date.today().isoformat(),
    }
    json.dump(meta, open(os.path.join(base,"metadata.json"),"w"), ensure_ascii=False, indent=2)
    card = (f"# {name}\n\n- optADMET 属性: {', '.join(props) or '(附赠,无直接对应)'}\n"
            f"- 任务类型: {task}\n- 来源: TDC `{name}`\n- 划分: scaffold 70/10/20 (seed42)\n"
            f"- 行数: train {counts['train']} / valid {counts['valid']} / test {counts['test']}\n"
            f"- SMILES 解析率(最低分片): {meta['smiles_parse_rate']}\n\n"
            f"## 用法\n`processed/{{train,valid,test}}.csv` 列: `smiles,label`。\n")
    open(os.path.join(base,"README.md"),"w").write(card)
    return meta

def main():
    manifest = []
    for row in DATASETS:
        try:
            m = run_one(*row); manifest.append(m)
            print(f"OK  {row[1]:32s} total={m['n_total']:6d} rate={m['smiles_parse_rate']}")
        except Exception as e:
            print(f"ERR {row[1]:32s} {e}")
            manifest.append({"name": row[1], "error": str(e)})
    out = {"generated": datetime.datetime.now().isoformat(timespec="seconds"), "datasets": manifest}
    json.dump(out, open(os.path.join(ROOT,"MANIFEST.json"),"w"), ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
```
- [ ] **Step 3: 运行**（后台，因下载多个集）：`cd datasets/scripts && ../../admetx-predictor/.venv/bin/python download_clean.py 2>&1 | tee _run.log`
- [ ] **Step 4: 检查点**。`grep -c '^OK' datasets/scripts/_run.log` 应 ≥ 25；`grep '^ERR' _run.log` 逐条排查（源不稳定→重跑该集；名字变更→订正 config）。每个 processed/*.csv `wc -l` >1；解析率 <0.9 的在数据卡标注。
- [ ] **Step 5: 留痕+提交**
```bash
printf '## %s Task4 下载清洗\n- 成功 N 集, 失败 M 集(见 _run.log), MANIFEST 回填\n\n' "$(date +%F)" >> datasets/PROGRESS.md
git add datasets/ ':!datasets/scripts/_tdc_cache'
git commit -m "feat(datasets): 下载+清洗 N 个公开数据集(TDC), 含 metadata/数据卡/MANIFEST"
```
- [ ] **Step 6: 把 `_tdc_cache/` 和 `raw/*_full.csv` 大文件加 `.gitignore`**（避免巨型二进制入库；processed 保留）：在 `datasets/.gitignore` 写 `scripts/_tdc_cache/` 与 `scripts/_run.log`。

---

## 阶段 5 / Task 5：`property_mapping.csv` → `model-catalog.ts` 生成脚本

**Files:** Create `datasets/scripts/gen_model_catalog.mjs`; 生成 `admetx-web/lib/model-catalog.ts`。

- [ ] **Step 1: 写 `gen_model_catalog.mjs`**（Node，无新依赖，用内置 fs）：
```javascript
import fs from "node:fs";
const CSV = process.argv[2], OUT = process.argv[3];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const lines = fs.readFileSync(CSV,"utf8").trim().split(/\r?\n/);
const head = lines[0].split(",");
const idx = n => head.indexOf(n);
const rows = lines.slice(1).map(l => l.split(","));
const items = rows.map(r => ({
  slug: slug(r[idx("optadmet_prop")]),
  name: r[idx("optadmet_prop")],
  category: r[idx("category")],
  type: r[idx("task_type")] === "regression" ? "regression" : "classification",
  status: r[idx("has_dataset")] === "yes" ? "dataset" : "placeholder",
  datasetSource: r[idx("dataset_source")] || "",
  description: r[idx("notes")] || "",
}));
const ts = `// AUTO-GENERATED from datasets/property_mapping.csv — do not edit by hand.
export type ModelCard = {
  slug: string; name: string; category: string;
  type: 'classification' | 'regression';
  status: 'dataset' | 'placeholder'; datasetSource?: string; description: string;
};
export const MODELS: ModelCard[] = ${JSON.stringify(items, null, 2)};
`;
fs.writeFileSync(OUT, ts);
console.log(`wrote ${items.length} models -> ${OUT}`);
```
- [ ] **Step 2: 运行** `node datasets/scripts/gen_model_catalog.mjs datasets/property_mapping.csv admetx-web/lib/model-catalog.ts`，预期输出 `wrote 140 models`。
- [ ] **Step 3: 校验** `grep -c 'slug:' admetx-web/lib/model-catalog.ts` =140；`grep -c "status: 'dataset'"` 等于 CSV 里 `yes` 数。
- [ ] **Step 4: 提交** `git add datasets/scripts/gen_model_catalog.mjs admetx-web/lib/model-catalog.ts && git commit -m "feat(models): 由 property_mapping 生成 140 项 model-catalog"`

---

## 阶段 5 / Task 6：`model-card.tsx` 加状态徽章

**Files:** Modify `admetx-web/components/model-card.tsx`.

- [ ] **Step 1: 改写卡片**（保留 teal 风，加 status 徽章）：
```tsx
import Link from 'next/link';
import { ModelCard as M } from '@/lib/model-catalog';

export function ModelCard({ m }: { m: M }) {
  const hasData = m.status === 'dataset';
  return (
    <Link href={`/models/${m.slug}`}
      className="block bg-white border border-slate-200 rounded-md p-3.5 hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="text-sm text-slate-800 leading-snug">{m.name}</h3>
        <span className="shrink-0 text-[11px] text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">
          {m.type === 'classification' ? '分类' : '回归'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>{m.category}</span>
        <span className="text-slate-300">·</span>
        <span className="inline-flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-teal-500' : 'bg-slate-300'}`} />
          {hasData ? '数据就绪' : '占位'}
        </span>
      </div>
      {m.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{m.description}</p>}
    </Link>
  );
}
```
- [ ] **Step 2: 提交** `git add admetx-web/components/model-card.tsx && git commit -m "feat(models): 卡片加 有数据/占位 状态徽章"`

---

## 阶段 5 / Task 7：`/models` 折叠手风琴 + 工具条

**Files:** Modify `admetx-web/app/(app)/models/page.tsx`（改 client 组件）。

> **设计原则（贯穿 Task6/7，硬性）：简洁、无"AI 味"。** 禁止：emoji（⭐✨✓ 等）、渐变、彩色药丸徽章、夸张悬浮阴影/缩放、大圆角、过度强调色。要求：中性灰阶为主 + 单一克制强调色（teal 仅用于"激活/链接/数据就绪点"）、细边框分隔、紧凑密度、低对比层级，整体接近 optADMET 等专业药化工具的克制观感。状态用小圆点而非彩底标签，折叠用细 chevron 而非文字三角，筛选用下划线 tab 而非实心药丸。

- [ ] **Step 1: 重写 page.tsx**
```tsx
'use client';
import { useMemo, useState } from 'react';
import { MODELS } from '@/lib/model-catalog';
import { ModelCard } from '@/components/model-card';

const CATS = ['理化','代谢','毒性','转运体','风险评估'] as const;
type Filter = 'all' | 'dataset' | 'classification' | 'regression';

export default function ModelsPage() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<Record<string, boolean>>({ '__ready__': true });

  const list = useMemo(() => MODELS.filter(m => {
    if (q && !m.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === 'dataset') return m.status === 'dataset';
    if (filter === 'classification') return m.type === 'classification';
    if (filter === 'regression') return m.type === 'regression';
    return true;
  }), [q, filter]);

  const ready = list.filter(m => m.status === 'dataset');
  const nData = MODELS.filter(m => m.status === 'dataset').length;
  const byCat = (c: string) => list.filter(m => m.category === c);
  const toggle = (k: string) => setOpen(o => ({ ...o, [k]: !o[k] }));

  const chip = (f: Filter, label: string) => (
    <button onClick={() => setFilter(f)}
      className={`text-xs px-2.5 py-1 border-b-2 transition-colors ${
        filter === f ? 'border-teal-600 text-slate-800'
                     : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-1">模型库</h1>
      <p className="text-sm text-slate-500 mb-4">
        共 {MODELS.length} 项 · 有数据 {nData} · 占位 {MODELS.length - nData}。首版占位卡片，实际预测由后端 predictor 统一调度。
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {chip('all','全部')}{chip('dataset','有数据')}{chip('classification','分类')}{chip('regression','回归')}
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜索属性…"
          className="ml-auto text-sm border border-slate-200 rounded-md px-3 py-1.5 w-48 focus:outline-none focus:border-teal-400" />
      </div>

      {ready.length > 0 && (
        <Section title={`有公开数据集 · 首批可训练 (${ready.length})`}
          k="__ready__" open={open['__ready__']} onToggle={toggle} items={ready} />
      )}
      {CATS.map(c => {
        const items = byCat(c);
        if (!items.length) return null;
        return <Section key={c} title={`${c}参数 (${items.length})`} k={c}
          open={!!open[c]} onToggle={toggle} items={items} />;
      })}
      {list.length === 0 && <p className="text-sm text-slate-400 py-10 text-center">无匹配属性</p>}
    </div>
  );
}

function Section({ title, k, open, onToggle, items }: {
  title: string; k: string; open: boolean;
  onToggle: (k: string) => void; items: typeof MODELS;
}) {
  return (
    <section className="mb-2 border-b border-slate-200">
      <button onClick={() => onToggle(k)}
        className="w-full flex items-center gap-2 py-3 text-left group">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}>
          <path d="M9 6l6 6-6 6" />
        </svg>
        <span className="text-sm text-slate-700 group-hover:text-slate-900">{title}</span>
      </button>
      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-4">
          {items.map(m => <ModelCard key={m.slug + m.category} m={m} />)}
        </div>
      )}
    </section>
  );
}
```
- [ ] **Step 2: 类型检查** `cd admetx-web && npx tsc --noEmit`（或项目既有 lint 脚本）→ 无错。
- [ ] **Step 3: 构建** `npm run build` → 成功。
- [ ] **Step 4: 提交** `git add admetx-web/app/(app)/models/page.tsx && git commit -m "feat(models): /models 折叠手风琴+筛选+搜索, 全140项"`

---

## 阶段 6 / Task 8：跑起来验证（真实页面）

- [ ] **Step 1:** 用 `verify` 或 `run` skill 启动 dev（端口 3031）或访问 prod 构建预览。
- [ ] **Step 2:** 确认：默认只有"有数据"区展开；点类别能展开/收起；筛选 chips 与搜索生效；有数据项绿徽章；移动端窄屏不塌。截图留档到 `datasets/PROGRESS.md` 附近或 docs。
- [ ] **Step 3:** 发现问题→ `systematic-debugging` 修复并补测。

---

## 阶段 6 / Task 9：验收 + 总报告 + 记忆

- [ ] **Step 1:** 调 `superpowers:verification-before-completion` 逐条核对 spec §1.4 成功标准与 §8.5。
- [ ] **Step 2:** 调 `superpowers:requesting-code-review` 审 `download_clean.py`/`lib_normalize.py`/`gen_model_catalog.mjs`/前端改动。
- [ ] **Step 3:** 写 `datasets/README.md` 末尾"数据集清单总报告"（成功集、行数、缺口属性表）。
- [ ] **Step 4:** 调 `si:remember` 记入项目记忆：数据集模块路径、property_mapping 同源机制、PyTDC 下载方式、缺口清单。
- [ ] **Step 5:** 最终提交 + 按 `superpowers:finishing-a-development-branch` 决定合并/PR。

---

## Self-Review（计划自检结论）

- **Spec 覆盖**：§1.2 数据集→Task1-4；§3 目录→Task2；§4 processed 标准→Task3-4；§8 /models→Task5-7；§1.4/§8.5 验收→Task8-9。无遗漏。
- **占位扫描**：无 "TODO/TBD/handle edge cases"；研究类任务（Task1）给了判定规则+验收命令而非空泛措辞。
- **类型一致**：`ModelCard` 字段（slug/name/category/type/status/datasetSource/description）在 catalog 生成(Task5)、card(Task6)、page(Task7)三处一致；`status` 取值 `dataset|placeholder` 全程统一；`clean_frame`/`canonicalize` 跨 Task3/4 一致。
