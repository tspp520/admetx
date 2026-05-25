import math
from app.predictors.rdkit_hybrid import RDKitHybridPredictor


def test_real_logp_for_caffeine():
    # caffeine
    smi = "Cn1cnc2c1c(=O)n(C)c(=O)n2C"
    [r] = RDKitHybridPredictor().predict_batch([smi])
    assert r.parsed_ok
    physchem = r.indicators["physicochemical"]
    # known: caffeine MW ~194; LogP ~ -0.07 (varies by predictor)
    assert math.isclose(physchem["MW"], 194.19, abs_tol=0.5)
    assert -1.5 < physchem["LogP"] < 1.5
    assert physchem["HBA"] >= 3
    assert physchem["HBD"] == 0


def test_invalid_smiles_marked_unparsed():
    [r] = RDKitHybridPredictor().predict_batch(["NOT_A_MOLECULE"])
    assert r.parsed_ok is False
    assert r.indicators is None
    assert r.error is not None


def test_lipinski_pass_for_ethanol():
    [r] = RDKitHybridPredictor().predict_batch(["CCO"])
    assert r.indicators["physicochemical"]["LipinskiPass"] is True


def test_random_categories_present_for_valid_smiles():
    [r] = RDKitHybridPredictor().predict_batch(["CCO"])
    for cat in ("absorption", "distribution", "metabolism", "excretion", "toxicity"):
        assert cat in r.indicators
