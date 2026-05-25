from fastapi.testclient import TestClient
from app.main import app


def test_health():
    r = TestClient(app).get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_predict_default_predictor():
    r = TestClient(app).post("/predict", json={"smiles": ["CCO", "c1ccccc1"]})
    assert r.status_code == 200
    data = r.json()
    assert data["predictor"] == "rdkit_hybrid"
    assert len(data["results"]) == 2
    assert data["results"][0]["indicators"]["physicochemical"]["MW"] > 0


def test_predict_override_random():
    r = TestClient(app).post("/predict",
                              json={"smiles": ["CCO"], "predictor": "random"})
    assert r.status_code == 200
    assert r.json()["predictor"] == "random"


def test_predict_rejects_unknown_predictor():
    r = TestClient(app).post("/predict",
                              json={"smiles": ["CCO"], "predictor": "foobar"})
    assert r.status_code == 400


def test_predict_rejects_empty_smiles():
    r = TestClient(app).post("/predict", json={"smiles": []})
    assert r.status_code == 422
