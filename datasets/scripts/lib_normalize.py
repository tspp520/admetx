"""清洗纯函数：RDKit canonical 化 / 去非法 / 去重 / 解析率。无副作用，可单测。"""
from rdkit import Chem
from rdkit import RDLogger

RDLogger.DisableLog("rdApp.*")  # type: ignore[attr-defined]  # 静音 RDKit 解析告警(存根缺该函数)


def canonicalize(smiles):
    """返回 canonical SMILES；空串或无法解析返回 None。"""
    if not smiles:
        return None
    mol = Chem.MolFromSmiles(smiles)
    return Chem.MolToSmiles(mol) if mol is not None else None


def clean_frame(rows):
    """rows: list[(smiles, label)] -> (cleaned_unique_rows, parse_rate)

    - canonical 化，丢弃无法解析行
    - 按 canonical SMILES 去重（保留首次出现）
    - parse_rate = 可解析行数 / 总行数（去重前），空输入为 0.0
    """
    seen, out, ok = set(), [], 0
    for smi, label in rows:
        c = canonicalize(smi)
        if c is None:
            continue
        ok += 1
        if c in seen:
            continue
        seen.add(c)
        out.append((c, label))
    rate = ok / len(rows) if rows else 0.0
    return out, rate
