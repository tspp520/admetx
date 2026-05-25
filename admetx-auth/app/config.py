from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # AD server
    ldap_server: str = "10.1.1.56"
    ldap_bind_port: int = 389         # bind for credential verify
    ldap_gc_port: int = 3268          # global catalog for cross-domain search

    # Service account
    ldap_bind_user: str = "CN=administrator,CN=Users,DC=shangpharma,DC=com"
    ldap_bind_password: str = ""      # set in .env (never commit)

    # Forest root + UPN suffixes
    ldap_search_base: str = "DC=shangpharma,DC=com"
    ldap_upn_domains: str = "CP.shangpharma.com,CD-GW.shangpharma.com,CE.shangpharma.com,shangpharma.com"

    # Lockout
    lockout_max: int = 3
    lockout_secs: int = 300

    # Server
    port: int = 8032

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def upn_domain_list(self) -> list[str]:
        return [d.strip() for d in self.ldap_upn_domains.split(",") if d.strip()]


settings = Settings()
