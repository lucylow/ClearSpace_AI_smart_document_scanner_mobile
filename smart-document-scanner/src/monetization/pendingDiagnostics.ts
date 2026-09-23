import type { PendingOffer } from './pendingOfferPersistence'
export const PENDING_OFFER_MAX_AGE_MS=24*60*60*1000
export function isPendingOfferExpired(marker:PendingOffer,now:number,maxAgeMs=PENDING_OFFER_MAX_AGE_MS){return now-marker.startedAt>=maxAgeMs}
export type PendingOfferAgeLabels = {
  none: string;
  lessThanMinute: string;
  minutes: (count: number) => string;
};

const DEFAULT_PENDING_OFFER_AGE_LABELS: PendingOfferAgeLabels = {
  none: 'No pending purchase',
  lessThanMinute: 'Pending less than a minute',
  minutes: count => `Pending for ${count} minute${count === 1 ? '' : 's'}`,
};

export const PENDING_OFFER_AGE_LABELS_BY_LOCALE: Record<string, PendingOfferAgeLabels> = {
  es: {
    none: 'No hay ninguna compra pendiente',
    lessThanMinute: 'Pendiente desde hace menos de un minuto',
    minutes: count => `Pendiente desde hace ${count} minuto${count === 1 ? '' : 's'}`,
  },
};

function pendingOfferAgeLabelsForLocale(locale: string | undefined, labelsByLocale: Record<string, PendingOfferAgeLabels>) {
  const normalizedLocale = locale?.trim().toLowerCase();
  const language = normalizedLocale?.split('-')[0];
  return (normalizedLocale ? labelsByLocale[normalizedLocale] : undefined) ?? (language ? labelsByLocale[language] : undefined) ?? DEFAULT_PENDING_OFFER_AGE_LABELS;
}

export function pendingOfferAgeLabel(marker:PendingOffer|null,now:number){
  if(!marker)return DEFAULT_PENDING_OFFER_AGE_LABELS.none;
  const minutes=Math.max(0,Math.floor((now-marker.startedAt)/60000));
  return minutes<1?DEFAULT_PENDING_OFFER_AGE_LABELS.lessThanMinute:DEFAULT_PENDING_OFFER_AGE_LABELS.minutes(minutes);
}

export function pendingOfferAgeLabelForLocale(marker:PendingOffer|null,now:number,locale?:string,labelsByLocale:Record<string,PendingOfferAgeLabels>=PENDING_OFFER_AGE_LABELS_BY_LOCALE){
  const labels=pendingOfferAgeLabelsForLocale(locale,labelsByLocale);
  if(!marker)return labels.none;
  const minutes=Math.max(0,Math.floor((now-marker.startedAt)/60000));
  return minutes<1?labels.lessThanMinute:labels.minutes(minutes);
}
