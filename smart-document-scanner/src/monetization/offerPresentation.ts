import { CatalogProduct } from './core'
export function annualSavingsPercent(yearly:CatalogProduct,monthly:CatalogProduct){const annualMonthly=monthly.priceMicros*12;return Math.max(0,Math.round((1-yearly.priceMicros/annualMonthly)*100))}
export function offerComparisonCopy(product:CatalogProduct,yearlySavings?:number){if(product.interval==='year')return yearlySavings?`Save ${yearlySavings}% versus monthly billing`:'Best value for regular scanning';if(product.tier==='lifetime')return 'One payment, no recurring renewal';return 'Flexible monthly access'}
export function trialCopy(product:CatalogProduct){return product.intro?.durationDays?`${product.intro.durationDays}-day introduction, then renews at the listed price`:'No introductory trial'}
