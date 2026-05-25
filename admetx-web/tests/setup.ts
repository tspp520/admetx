// globalSetup: runs before any test module is imported — safe to set env here
export function setup() {
  process.env.JWT_SECRET ??= 'test-secret-32-bytes-test-secret-bytes';
  process.env.DATABASE_URL ??= 'postgresql://admetx:admetx_local@127.0.0.1:5436/admetx_dev';
}
