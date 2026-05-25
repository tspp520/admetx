from fastapi import FastAPI, HTTPException

from app.config import settings
from app.predictors.base import BasePredictor
from app.predictors.random_predictor import RandomPredictor
from app.predictors.rdkit_hybrid import RDKitHybridPredictor
from app.schemas import PredictRequest, PredictResponse


_REGISTRY: dict[str, type[BasePredictor]] = {
    "random": RandomPredictor,
    "rdkit_hybrid": RDKitHybridPredictor,
}


def _resolve(name: str | None) -> BasePredictor:
    key = name or settings.predictor_kind
    if key not in _REGISTRY:
        raise HTTPException(400, f"unknown predictor: {key}")
    return _REGISTRY[key]()


app = FastAPI(title="admetx-predictor", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "predictor": settings.predictor_kind}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    pred = _resolve(req.predictor)
    results = pred.predict_batch(req.smiles)
    return PredictResponse(predictor=pred.name, results=results)
