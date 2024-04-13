const invalidatedTokens = new Set();

export function addToInvalidatedTokens(token) {
  invalidatedTokens.add(token);
}

export function isTokenInvalid(token) {
  return invalidatedTokens.has(token);
}
