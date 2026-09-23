export function canConsumeCredit(isPro:boolean,credits:number){return isPro||credits>0}
export function consumeCredits(isPro:boolean,credits:number){if(isPro)return credits;return Math.max(0,credits-1)}
export function addCredits(credits:number,amount:number){return Math.max(0,credits+amount)}
