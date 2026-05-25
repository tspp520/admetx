import logging

from fastapi import FastAPI

from app.config import settings
from app.ldap_authenticator import verify
from app.schemas import VerifyRequest, VerifyResponse, UserAttrs


logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(name)s %(levelname)s %(message)s')

app = FastAPI(title='admetx-auth', version='0.1.0')


@app.get('/health')
def health() -> dict[str, str]:
    return {
        'status': 'ok',
        'ldap_server': f'{settings.ldap_server}:{settings.ldap_bind_port}',
        'gc_port': str(settings.ldap_gc_port),
        'configured': 'yes' if settings.ldap_bind_password else 'no',
    }


@app.post('/verify', response_model=VerifyResponse)
def verify_endpoint(req: VerifyRequest) -> VerifyResponse:
    out = verify(req.username, req.password)
    return VerifyResponse(
        ok=out.ok,
        attrs=UserAttrs(**out.attrs) if out.attrs else None,
        error=out.error,
        locked=out.locked,
        remaining_secs=out.remaining_secs,
        attempts_left=out.attempts_left,
    )
