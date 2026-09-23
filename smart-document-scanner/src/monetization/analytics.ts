import { CatalogProduct } from './core'
export interface RankContext{preferredTier?:'monthly'|'yearly'|'lifetime';annualizedValueBias?:number}
export const scoreOffer=(product:CatalogProduct,context:RankContext={})=>{let score=0;if(product.tier===context.preferredTier)score+=100;if(product.tier==='yearly')score+=20*(context.annualizedValueBias??1);if(product.kind==='lifetime')score+=8;return score-product.priceMicros/10000000}
export const rankOffers=(items:CatalogProduct[],context:RankContext={})=>[...items].sort((a,b)=>scoreOffer(b,context)-scoreOffer(a,context))
export interface TrialPolicy{enabled:boolean;durationDays:number;eligibleTiers:('monthly'|'yearly')[];cooldownDays:number}
export const DEFAULT_TRIAL_POLICY:TrialPolicy={enabled:true,durationDays:7,eligibleTiers:['yearly'],cooldownDays:90}
export const isTrialEligible=(lastTrialAt:number|undefined,policy=DEFAULT_TRIAL_POLICY,now=Date.now())=>policy.enabled&&(lastTrialAt===undefined||now-lastTrialAt>=policy.cooldownDays*86400000)
export interface PricePoint{productId:string;micros:number;currency:string;effectiveAt:number;source:'store'|'remote'|'default'}
export const choosePrice=(points:PricePoint[],now=Date.now())=>points.filter(point=>point.effectiveAt<=now).sort((a,b)=>b.effectiveAt-a.effectiveAt)[0]
export const priceDelta=(oldMicros:number,newMicros:number)=>(newMicros-oldMicros)/1000000
export type PaywallEvent='shown'|'offer_selected'|'purchase_started'|'purchase_success'|'purchase_failed'|'dismissed'|'restored'
export interface PaywallEventPayload{event:PaywallEvent;reason:string;variant:string;productId?:string;valueMicros?:number;timestamp:number}
export const paywallEvent=(event:PaywallEvent,reason:string,variant:string,extra:Partial<PaywallEventPayload>={}):PaywallEventPayload=>({event,reason,variant,timestamp:Date.now(),...extra})
export interface RevenueRecord{productId:string;grossMicros:number;refundMicros?:number;currency:string;timestamp:number;source:'store'|'promo'}
export const netRevenue=(record:RevenueRecord)=>Math.max(0,record.grossMicros-(record.refundMicros||0))
export const sumRevenue=(rows:RevenueRecord[])=>rows.reduce((sum,row)=>sum+netRevenue(row),0)
export const conversionRate=(numerator:number,denominator:number)=>denominator>0?numerator/denominator:0
