import {
  createHmac,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

export const ADMIN_COOKIE_NAME = "moneyva_admin_session";
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

function safeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const configuredUsername = process.env.MONEYVA_ADMIN_USERNAME;
  const encodedHash = process.env.MONEYVA_ADMIN_PASSWORD_HASH;

  if (!configuredUsername || !encodedHash || !password) {
    return false;
  }

  const [scheme, salt, expectedHash, ...extra] = encodedHash.split("$");

  if (
    scheme !== "scrypt" ||
    extra.length !== 0 ||
    !salt ||
    !/^[a-f0-9]{32}$/i.test(salt) ||
    !expectedHash ||
    !/^[a-f0-9]{128}$/i.test(expectedHash)
  ) {
    return false;
  }

  try {
    const actualHash = scryptSync(password, Buffer.from(salt, "hex"), 64);
    const expectedBuffer = Buffer.from(expectedHash, "hex");
    const usernameMatches = safeEqual(
      Buffer.from(username),
      Buffer.from(configuredUsername)
    );
    const passwordMatches = safeEqual(actualHash, expectedBuffer);

    return usernameMatches && passwordMatches;
  } catch {
    return false;
  }
}

function signPayload(payload: string) {
  const secret = process.env.MONEYVA_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("Admin session secret is not configured correctly.");
  }

  return createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
}

export function createAdminSession(username: string) {
  const payload = Buffer.from(
    JSON.stringify({
      sub: username,
      exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
    })
  ).toString("base64url");

  return `${payload}.${signPayload(payload)}`;
}

export function verifyAdminSession(
  token: string | undefined
): { username: string } | null {
  if (!token || token.length > 2048) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;

  try {
    const expectedSignature = signPayload(payload);
    const signatureMatches = safeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!signatureMatches) return null;

    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { sub?: unknown; exp?: unknown };

    if (
      typeof parsed.sub !== "string" ||
      parsed.sub !== process.env.MONEYVA_ADMIN_USERNAME ||
      typeof parsed.exp !== "number" ||
      parsed.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return { username: parsed.sub };
  } catch {
    return null;
  }
}

export function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;

  return new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://moneyva.in",
    "https://www.moneyva.in",
    "https://admin.moneyva.in",
  ]).has(origin);
}
