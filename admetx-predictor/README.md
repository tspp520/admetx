# admetx-predictor

ADMET prediction microservice for admetx. Provides placeholder predictions
backed by real RDKit physchem indicators + pseudorandom ADMET scores.

## Run

    python3.12 -m venv .venv && source .venv/bin/activate
    pip install -e ".[dev]" -i https://pypi.tuna.tsinghua.edu.cn/simple/
    uvicorn app.main:app --host 127.0.0.1 --port 8030

## Test

    pytest -v
