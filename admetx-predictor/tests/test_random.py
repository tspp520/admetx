from app.predictors.random_predictor import RandomPredictor


def test_predicts_each_smiles():
    p = RandomPredictor()
    results = p.predict_batch(["CCO", "c1ccccc1"])
    assert len(results) == 2
    assert results[0].smiles == "CCO" and results[0].parsed_ok
    assert results[1].smiles == "c1ccccc1" and results[1].parsed_ok


def test_results_are_deterministic_per_smiles():
    p = RandomPredictor()
    a = p.predict_batch(["CCO"])[0].indicators
    b = p.predict_batch(["CCO"])[0].indicators
    assert a == b


def test_indicator_categories_present():
    p = RandomPredictor()
    r = p.predict_batch(["CCO"])[0]
    assert r.indicators is not None
    for cat in ("absorption", "distribution", "metabolism", "excretion", "toxicity"):
        assert cat in r.indicators
        assert len(r.indicators[cat]) > 0
