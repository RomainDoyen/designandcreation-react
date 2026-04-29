/**
 * Next.js charge les .env avec expansion des `$VAR`.
 * Un hash bcrypt (`$2a$12$...`) est donc souvent corrompu dans ADMIN_PASSWORD_HASH.
 * Préférer ADMIN_PASSWORD_HASH_B64 (sortie de `npm run hash-admin-password`).
 */
const BCRYPT_PREFIX = /^\$2[aby]\$\d{2}\$/;

export function getAdminPasswordHashFromEnv() {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64?.trim();
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8").trim();
      if (BCRYPT_PREFIX.test(decoded)) return decoded;
    } catch {
      /* ignore */
    }
  }

  const direct = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (direct && BCRYPT_PREFIX.test(direct)) return direct;

  return null;
}

export function hasLegacyAdminPasswordHashEnv() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH?.trim());
}
