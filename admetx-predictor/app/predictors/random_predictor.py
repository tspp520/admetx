import hashlib
import random
from typing import ClassVar

from app.predictors.base import BasePredictor
from app.schemas import PredictItemResult


_INDICATOR_BUCKETS: dict[str, list[str]] = {
    "absorption": ["Caco2", "HIA", "Pgp_substrate", "Pgp_inhibitor", "F20", "F30"],
    "distribution": ["BBB", "PPB", "VDss"],
    "metabolism": [
        "CYP1A2_inhibitor", "CYP1A2_substrate",
        "CYP2C9_inhibitor", "CYP2C9_substrate",
        "CYP2C19_inhibitor", "CYP2C19_substrate",
        "CYP2D6_inhibitor", "CYP2D6_substrate",
        "CYP3A4_inhibitor", "CYP3A4_substrate",
    ],
    "excretion": ["CL", "T_half"],
    "toxicity": ["hERG", "AMES", "DILI", "Carcinogenicity", "SkinSensitization"],
}


def _seeded_rng(smiles: str, salt: str = "") -> random.Random:
    h = hashlib.sha256(f"{salt}|{smiles}".encode()).digest()
    return random.Random(int.from_bytes(h[:8], "big"))


def _generate_indicators(smiles: str) -> dict[str, dict[str, float]]:
    rng = _seeded_rng(smiles)
    out: dict[str, dict[str, float]] = {}
    for category, names in _INDICATOR_BUCKETS.items():
        cat_out: dict[str, float] = {}
        for name in names:
            if name == "CL":
                cat_out[name] = round(rng.uniform(0.5, 15.0), 2)
            elif name == "T_half":
                cat_out[name] = round(rng.uniform(0.1, 50.0), 2)
            elif name == "VDss":
                cat_out[name] = round(rng.uniform(0.04, 20.0), 2)
            else:
                cat_out[name] = round(rng.random(), 3)
        out[category] = cat_out
    return out


class RandomPredictor(BasePredictor):
    name: ClassVar[str] = "random"

    def predict_batch(self, smiles_list: list[str]) -> list[PredictItemResult]:
        results: list[PredictItemResult] = []
        for idx, smi in enumerate(smiles_list):
            results.append(PredictItemResult(
                idx=idx, smiles=smi, parsed_ok=True,
                indicators=_generate_indicators(smi),
            ))
        return results
