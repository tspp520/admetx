from typing import ClassVar

from rdkit import Chem
from rdkit.Chem import Crippen, Descriptors, Lipinski

from app.predictors.base import BasePredictor
from app.predictors.random_predictor import _generate_indicators
from app.schemas import PredictItemResult


def _real_physchem(mol) -> dict[str, float | bool | int]:
    logp = round(Crippen.MolLogP(mol), 3)
    mw = round(Descriptors.MolWt(mol), 2)
    hbd = Lipinski.NumHDonors(mol)
    hba = Lipinski.NumHAcceptors(mol)
    tpsa = round(Descriptors.TPSA(mol), 2)
    rot = Lipinski.NumRotatableBonds(mol)
    # Lipinski Rule of 5: MW<=500, LogP<=5, HBD<=5, HBA<=10
    lipinski_ok = mw <= 500 and logp <= 5 and hbd <= 5 and hba <= 10
    return {
        "LogP": logp, "MW": mw, "HBD": hbd, "HBA": hba,
        "TPSA": tpsa, "RotBonds": rot, "LipinskiPass": lipinski_ok,
    }


class RDKitHybridPredictor(BasePredictor):
    name: ClassVar[str] = "rdkit_hybrid"

    def predict_batch(self, smiles_list: list[str]) -> list[PredictItemResult]:
        out: list[PredictItemResult] = []
        for idx, smi in enumerate(smiles_list):
            mol = Chem.MolFromSmiles(smi)
            if mol is None:
                out.append(PredictItemResult(
                    idx=idx, smiles=smi, parsed_ok=False,
                    error="RDKit could not parse SMILES",
                ))
                continue
            indicators = {"physicochemical": _real_physchem(mol)}
            # Append random ADMET categories using SMILES-seeded RNG
            rand = _generate_indicators(smi)
            indicators.update(rand)
            out.append(PredictItemResult(
                idx=idx, smiles=smi, parsed_ok=True,
                indicators=indicators,
            ))
        return out
