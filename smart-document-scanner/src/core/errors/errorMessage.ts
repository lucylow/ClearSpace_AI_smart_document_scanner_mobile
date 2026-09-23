const SENSITIVE_FIELD=/\b(token|secret|password|receipt|transaction(?:Id|ID)?|authorization)\s*[:=]\s*[^\s,;]+/gi
export function safeErrorMessage(error:unknown,fallback='Something went wrong. Please try again.'){if(!(error instanceof Error)||!error.message.trim())return fallback;const sanitized=error.message.replace(SENSITIVE_FIELD,(_,field)=>`${field}: [redacted]`).replace(/\s+/g,' ').trim();return sanitized.slice(0,180)||fallback}
export function isAbortError(error:unknown){return error instanceof Error&&/abort|cancel/i.test(error.message)}
