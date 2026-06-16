"""下载 TDC 数据集 -> RDKit 清洗 -> processed/ + metadata.json + 数据卡 + MANIFEST。
用法: ../.venv/bin/python download_clean.py
幂等: 重跑覆盖 processed/metadata/README,可安全重试失败集。
"""
import os
import json
import datetime
import traceback

import pandas as pd
from tdc.single_pred import ADME, Tox

from lib_normalize import clean_frame
from datasets_config import DATASETS

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW_CACHE = os.path.join(os.path.dirname(__file__), "_tdc_cache")
CLS = {"ADME": ADME, "Tox": Tox}


def run_one(mod, name, task, props, cat_dir, prop_dir):
    data = CLS[mod](name=name, path=RAW_CACHE)
    sp = data.get_split(method="scaffold", seed=42, frac=[0.7, 0.1, 0.2])

    base = os.path.join(ROOT, cat_dir, prop_dir)
    proc = os.path.join(base, "processed")
    raw = os.path.join(base, "raw")
    os.makedirs(proc, exist_ok=True)
    os.makedirs(raw, exist_ok=True)

    counts, rates = {}, []
    for split_name in ("train", "valid", "test"):
        df = sp[split_name]
        rows = list(zip(df["Drug"].tolist(), df["Y"].tolist()))
        cleaned, rate = clean_frame(rows)
        rates.append(rate)
        pd.DataFrame(cleaned, columns=["smiles", "label"]).to_csv(
            os.path.join(proc, f"{split_name}.csv"), index=False)
        counts[split_name] = len(cleaned)

    # 原始全量(大文件,gitignore)
    data.get_data().to_csv(os.path.join(raw, f"{name}_full.csv"), index=False)

    meta = {
        "name": name,
        "optadmet_props": props,
        "task_type": task,
        "source": f"TDC:{name}",
        "source_url": "https://tdcommons.ai",
        "license": "见 TDC 各数据集说明(多为 CC BY 4.0)",
        "n_train": counts["train"],
        "n_valid": counts["valid"],
        "n_test": counts["test"],
        "n_total": sum(counts.values()),
        "smiles_parse_rate_min": round(min(rates), 4) if rates else 0.0,
        "split_method": "scaffold",
        "seed": 42,
        "download_date": datetime.date.today().isoformat(),
    }
    with open(os.path.join(base, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    props_str = ", ".join(props) if props else "(附赠,无 optADMET 直接对应)"
    card = (
        f"# {name}\n\n"
        f"- optADMET 属性: {props_str}\n"
        f"- 任务类型: {task}\n"
        f"- 来源: TDC `{name}` (https://tdcommons.ai)\n"
        f"- 划分: scaffold 70/10/20 (seed 42)\n"
        f"- 行数: train {counts['train']} / valid {counts['valid']} / test {counts['test']} "
        f"(合计 {meta['n_total']})\n"
        f"- SMILES 解析率(最低分片): {meta['smiles_parse_rate_min']}\n\n"
        f"## 用法\n`processed/{{train,valid,test}}.csv`，列 `smiles,label`。\n"
    )
    with open(os.path.join(base, "README.md"), "w", encoding="utf-8") as f:
        f.write(card)

    return meta


def main():
    manifest, ok, err = [], 0, 0
    for row in DATASETS:
        name = row[1]
        try:
            m = run_one(*row)
            manifest.append(m)
            ok += 1
            print(f"OK  {name:34s} total={m['n_total']:6d} rate={m['smiles_parse_rate_min']}")
        except Exception as e:
            err += 1
            manifest.append({"name": name, "error": str(e)})
            print(f"ERR {name:34s} {e}")
            traceback.print_exc()

    out = {
        "generated": datetime.datetime.now().isoformat(timespec="seconds"),
        "summary": {"ok": ok, "err": err, "total": len(DATASETS)},
        "datasets": manifest,
    }
    with open(os.path.join(ROOT, "MANIFEST.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"\nDONE ok={ok} err={err} / {len(DATASETS)}  -> MANIFEST.json")


if __name__ == "__main__":
    main()
