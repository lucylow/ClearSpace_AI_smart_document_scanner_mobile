import type { BillingTier } from './core';

export type SubscriptionLifecycleTone = 'neutral' | 'success' | 'warning' | 'error';

export type SubscriptionLifecyclePresentation = {
  title: string;
  detail: string;
  accessibilityLabel: string;
  tone: SubscriptionLifecycleTone;
};

type LifecycleLocale = 'en' | 'es' | 'fr' | 'pt';

const languageFor = (locale?: string): LifecycleLocale => {
  const language = (locale ?? 'en').toLowerCase().split(/[-_]/)[0];
  return language === 'es' || language === 'fr' || language === 'pt' ? language : 'en';
};

const formatDate = (locale: LifecycleLocale, timestamp: number) =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(timestamp);

const DAYS_7 = 7 * 24 * 60 * 60 * 1000;

export function subscriptionLifecyclePresentation(
  locale: string | undefined,
  tier: BillingTier,
  renewalAt?: number,
  now = Date.now(),
): SubscriptionLifecyclePresentation {
  const language = languageFor(locale);
  const date = renewalAt ? formatDate(language, renewalAt) : '';
  const upcoming = renewalAt !== undefined && renewalAt > now && renewalAt - now <= DAYS_7;
  const expired = renewalAt !== undefined && renewalAt <= now;

  if (language === 'es') {
    if (tier === 'free') return { title: 'Plan gratuito', detail: 'Tienes créditos de exportación disponibles.', accessibilityLabel: 'Estado de suscripción: plan gratuito', tone: 'neutral' };
    if (tier === 'lifetime') return { title: 'Pro vitalicio activo', detail: 'No hay renovaciones recurrentes.', accessibilityLabel: 'Estado de suscripción: Pro vitalicio activo, sin renovación', tone: 'success' };
    if (expired) return { title: 'Hay que actualizar el acceso Pro', detail: 'Restaura las compras para confirmar tu suscripción.', accessibilityLabel: 'Estado de suscripción: el acceso Pro necesita una actualización', tone: 'error' };
    if (upcoming) return { title: 'Renovación próxima', detail: `Tu acceso Pro se renueva el ${date}.`, accessibilityLabel: `Estado de suscripción: renovación próxima el ${date}`, tone: 'warning' };
    return { title: 'Pro activo', detail: renewalAt ? `Tu acceso Pro se renueva el ${date}.` : 'Tu acceso Pro está activo.', accessibilityLabel: 'Estado de suscripción: Pro activo', tone: 'success' };
  }
  if (language === 'fr') {
    if (tier === 'free') return { title: 'Offre gratuite', detail: 'Vous disposez de crédits d’exportation.', accessibilityLabel: 'État de l’abonnement : offre gratuite', tone: 'neutral' };
    if (tier === 'lifetime') return { title: 'Pro à vie actif', detail: 'Aucun renouvellement récurrent.', accessibilityLabel: 'État de l’abonnement : Pro à vie actif, sans renouvellement', tone: 'success' };
    if (expired) return { title: 'Actualisation de l’accès Pro nécessaire', detail: 'Restaurez vos achats pour confirmer votre abonnement.', accessibilityLabel: 'État de l’abonnement : actualisation de l’accès Pro nécessaire', tone: 'error' };
    if (upcoming) return { title: 'Renouvellement prochain', detail: `Votre accès Pro sera renouvelé le ${date}.`, accessibilityLabel: `État de l’abonnement : renouvellement prochain le ${date}`, tone: 'warning' };
    return { title: 'Pro actif', detail: renewalAt ? `Votre accès Pro sera renouvelé le ${date}.` : 'Votre accès Pro est actif.', accessibilityLabel: 'État de l’abonnement : Pro actif', tone: 'success' };
  }
  if (language === 'pt') {
    if (tier === 'free') return { title: 'Plano gratuito', detail: 'Você tem créditos de exportação disponíveis.', accessibilityLabel: 'Status da assinatura: plano gratuito', tone: 'neutral' };
    if (tier === 'lifetime') return { title: 'Pro vitalício ativo', detail: 'Não há renovações recorrentes.', accessibilityLabel: 'Status da assinatura: Pro vitalício ativo, sem renovação', tone: 'success' };
    if (expired) return { title: 'Atualize o acesso Pro', detail: 'Restaure as compras para confirmar sua assinatura.', accessibilityLabel: 'Status da assinatura: o acesso Pro precisa ser atualizado', tone: 'error' };
    if (upcoming) return { title: 'Renovação próxima', detail: `Seu acesso Pro será renovado em ${date}.`, accessibilityLabel: `Status da assinatura: renovação próxima em ${date}`, tone: 'warning' };
    return { title: 'Pro ativo', detail: renewalAt ? `Seu acesso Pro será renovado em ${date}.` : 'Seu acesso Pro está ativo.', accessibilityLabel: 'Status da assinatura: Pro ativo', tone: 'success' };
  }
  if (tier === 'free') return { title: 'Free plan', detail: 'Export credits are available.', accessibilityLabel: 'Subscription status: free plan', tone: 'neutral' };
  if (tier === 'lifetime') return { title: 'Lifetime Pro active', detail: 'There are no recurring renewals.', accessibilityLabel: 'Subscription status: Lifetime Pro active, no renewal', tone: 'success' };
  if (expired) return { title: 'Pro access needs an update', detail: 'Restore purchases to confirm your subscription.', accessibilityLabel: 'Subscription status: Pro access needs an update', tone: 'error' };
  if (upcoming) return { title: 'Renewal coming up', detail: `Your Pro access renews on ${date}.`, accessibilityLabel: `Subscription status: renewal coming up on ${date}`, tone: 'warning' };
  return { title: 'Pro active', detail: renewalAt ? `Your Pro access renews on ${date}.` : 'Your Pro access is active.', accessibilityLabel: 'Subscription status: Pro active', tone: 'success' };
}
