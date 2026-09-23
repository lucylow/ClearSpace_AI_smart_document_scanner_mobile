import { EventBus } from '../events/EventBus'
export interface AnalyticsProvider{track(name:string,properties?:Record<string,unknown>):void}
export class ConsoleAnalytics implements AnalyticsProvider{track(name:string,properties?:Record<string,unknown>){if(typeof __DEV__!=='undefined'&&__DEV__)console.log('[analytics]',name,properties)}}
export function wireAnalytics(provider:AnalyticsProvider){return EventBus.on(event=>provider.track(event.type,event.payload))}
