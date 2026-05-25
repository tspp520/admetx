from pydantic import BaseModel, Field


class VerifyRequest(BaseModel):
    username: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=1, max_length=256)


class UserAttrs(BaseModel):
    upn: str | None = None              # userPrincipalName, e.g. CP12398@CP.shangpharma.com
    sam: str | None = None              # sAMAccountName, lowercased
    display_name: str | None = None     # pinyin name, e.g. "Tan Xinping"
    description: str | None = None      # Chinese name, e.g. "谭鑫平"
    department: str | None = None
    title: str | None = None
    mail: str | None = None


class VerifyResponse(BaseModel):
    ok: bool
    attrs: UserAttrs | None = None
    # On failure
    error: str | None = None            # 'invalid_credentials' | 'locked' | 'unreachable' | 'config_error'
    locked: bool = False
    remaining_secs: int = 0
    attempts_left: int = 0
