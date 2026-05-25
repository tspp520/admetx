from abc import ABC, abstractmethod
from typing import ClassVar

from app.schemas import PredictItemResult


class BasePredictor(ABC):
    name: ClassVar[str]

    @abstractmethod
    def predict_batch(self, smiles_list: list[str]) -> list[PredictItemResult]:
        ...
