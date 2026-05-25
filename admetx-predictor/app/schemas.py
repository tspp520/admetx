from typing import Any
from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    smiles: list[str] = Field(min_length=1, max_length=200)
    predictor: str | None = None  # override; None = use server default


class PredictItemResult(BaseModel):
    idx: int
    smiles: str
    parsed_ok: bool
    indicators: dict[str, dict[str, Any]] | None = None
    error: str | None = None


class PredictResponse(BaseModel):
    predictor: str
    results: list[PredictItemResult]
