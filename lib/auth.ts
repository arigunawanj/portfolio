import { SignJWT, jwtVerify } from "jose"

const COOKIE_NAME = "cms_session"
const ALG = "HS256"

function getSecretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("SESSION_SECRET is not set")
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as { username: string }
  } catch {
    return null
  }
}

export { COOKIE_NAME }
