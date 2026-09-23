import { BillingTier } from './core'
export interface SubscriptionDiagnostics{tier:BillingTier;provider:'local'|'production';cache:'fresh'|'stale'|'missing';lastAction:'none'|'purchase'|'restore'|'refresh'}
export function formatSubscriptionDiagnostics(input:SubscriptionDiagnostics){return `tier=${input.tier}; provider=${input.provider}; cache=${input.cache}; lastAction=${input.lastAction}`}
