export type BillingTier='free'|'monthly'|'yearly'|'lifetime'
export type Entitlement='unlimited_exports'|'ocr'|'cloud_backup'|'watermark_free'|'priority_support'
export type PaywallReason='credits_exhausted'|'premium_feature'|'cloud_quota'|'restore_needed'|'winback'
export type OfferKind='subscription'|'lifetime'|'credit_pack'|'trial'|'winback'
export interface CatalogProduct{id:string;kind:OfferKind;tier:BillingTier;priceMicros:number;currency:string;interval?:'month'|'year';intro?:{priceMicros:number;durationDays:number}}
export interface EntitlementState{tier:BillingTier;active:Set<Entitlement>;credits:number;renewalAt?:number;source:'store'|'promo'|'legacy'}
export interface PaywallContext{reason:PaywallReason;feature?:Entitlement;exportPages?:number;source?:string}
export const PRODUCT_CATALOG:CatalogProduct[]=[{id:'pro_monthly',kind:'subscription',tier:'monthly',priceMicros:5990000,currency:'USD',interval:'month'},{id:'pro_yearly',kind:'subscription',tier:'yearly',priceMicros:39990000,currency:'USD',interval:'year',intro:{priceMicros:0,durationDays:7}},{id:'pro_lifetime',kind:'lifetime',tier:'lifetime',priceMicros:69990000,currency:'USD'},{id:'credits_10',kind:'credit_pack',tier:'free',priceMicros:1990000,currency:'USD'},{id:'credits_50',kind:'credit_pack',tier:'free',priceMicros:5990000,currency:'USD'}]
export const findProduct=(id:string)=>PRODUCT_CATALOG.find(product=>product.id===id)
export const sortCatalog=(items=PRODUCT_CATALOG)=>[...items].sort((a,b)=>a.priceMicros-b.priceMicros)
export const paywallOffers=(items=PRODUCT_CATALOG)=>{const offers=sortCatalog(items.filter(product=>product.tier!=='free'));const featured=offers.find(product=>product.id==='pro_yearly');return featured?[featured,...offers.filter(product=>product.id!==featured.id)]:offers}
export const featuredPaywallOffer=(items=PRODUCT_CATALOG)=>paywallOffers(items).find(product=>product.id==='pro_yearly')??paywallOffers(items)[0]
export const formatMoney=(micros:number,currency='USD',locale='en-US')=>new Intl.NumberFormat(locale,{style:'currency',currency}).format(micros/1000000)
export const monthlyEquivalent=(micros:number,interval:'month'|'year'='month')=>interval==='year'?micros/12:micros
export const discountPercent=(full:number,sale:number)=>full<=0?0:Math.max(0,Math.round((1-sale/full)*100))
const tierEntitlements:Record<BillingTier,Entitlement[]>={free:[],monthly:['unlimited_exports','ocr','cloud_backup','watermark_free'],yearly:['unlimited_exports','ocr','cloud_backup','watermark_free'],lifetime:['unlimited_exports','ocr','cloud_backup','watermark_free','priority_support']}
export const deriveEntitlements=(tier:BillingTier,credits=5,source:EntitlementState['source']='store'):EntitlementState=>({tier,active:new Set(tierEntitlements[tier]),credits,source})
export const hasEntitlement=(state:EntitlementState,entitlement:Entitlement)=>state.active.has(entitlement)
export interface GuardResult{allowed:boolean;reason:'ok'|'premium'|'credits'}
export const guardAccess=(state:EntitlementState,feature?:Entitlement,cost=0):GuardResult=>feature&&!state.active.has(feature)?{allowed:false,reason:'premium'}:cost>0&&state.tier==='free'&&state.credits<cost?{allowed:false,reason:'credits'}:{allowed:true,reason:'ok'}
export const PAYWALL_RULES={unlimited_exports:{reason:'credits_exhausted',cta:'Upgrade to Pro'},ocr:{reason:'premium_feature',cta:'Unlock OCR'},cloud_backup:{reason:'cloud_quota',cta:'Enable Cloud Backup'},watermark_free:{reason:'premium_feature',cta:'Remove watermark'},priority_support:{reason:'premium_feature',cta:'Get Priority Support'}} as const
export const contextFor=(feature:Entitlement):PaywallContext=>({reason:PAYWALL_RULES[feature].reason as PaywallReason,feature})
