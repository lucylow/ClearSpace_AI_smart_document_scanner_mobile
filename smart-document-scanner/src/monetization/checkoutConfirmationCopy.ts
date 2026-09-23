import type { CatalogProduct } from './core';

export type CheckoutConfirmationCopy = {
  title: string;
  message: string;
  confirm: string;
  cancel: string;
  accessibilityLabel: string;
};

function languageFor(locale?: string) {
  return locale?.trim().toLowerCase().split('-')[0] ?? 'en';
}

export function checkoutConfirmationCopy(product: CatalogProduct, price: string, locale?: string): CheckoutConfirmationCopy {
  const amount = product.id === 'credits_50' ? 50 : product.id === 'credits_10' ? 10 : 0;
  const language = languageFor(locale);
  if (language === 'es') {
    return product.kind === 'credit_pack'
      ? { title: 'Confirmar compra', message: `Añadir ${amount} créditos de exportación por ${price}.`, confirm: 'Comprar', cancel: 'Cancelar', accessibilityLabel: `Confirmar compra de ${amount} créditos por ${price}` }
      : { title: 'Confirmar suscripción', message: `Activar ${product.tier === 'yearly' ? 'Pro anual' : product.tier === 'lifetime' ? 'Pro de por vida' : 'Pro mensual'} por ${price}.`, confirm: 'Continuar', cancel: 'Cancelar', accessibilityLabel: `Confirmar suscripción Pro por ${price}` };
  }
  if (language === 'fr') {
    return product.kind === 'credit_pack'
      ? { title: 'Confirmer l’achat', message: `Ajouter ${amount} crédits d’exportation pour ${price}.`, confirm: 'Acheter', cancel: 'Annuler', accessibilityLabel: `Confirmer l’achat de ${amount} crédits pour ${price}` }
      : { title: 'Confirmer l’abonnement', message: `Activer ${product.tier === 'yearly' ? 'Pro annuel' : product.tier === 'lifetime' ? 'Pro à vie' : 'Pro mensuel'} pour ${price}.`, confirm: 'Continuer', cancel: 'Annuler', accessibilityLabel: `Confirmer l’abonnement Pro pour ${price}` };
  }
  if (language === 'pt') {
    return product.kind === 'credit_pack'
      ? { title: 'Confirmar compra', message: `Adicionar ${amount} créditos de exportação por ${price}.`, confirm: 'Comprar', cancel: 'Cancelar', accessibilityLabel: `Confirmar compra de ${amount} créditos por ${price}` }
      : { title: 'Confirmar assinatura', message: `Ativar ${product.tier === 'yearly' ? 'Pro anual' : product.tier === 'lifetime' ? 'Pro vitalício' : 'Pro mensal'} por ${price}.`, confirm: 'Continuar', cancel: 'Cancelar', accessibilityLabel: `Confirmar assinatura Pro por ${price}` };
  }
  return product.kind === 'credit_pack'
    ? { title: 'Confirm purchase', message: `Add ${amount} export credits for ${price}.`, confirm: 'Buy', cancel: 'Cancel', accessibilityLabel: `Confirm purchase of ${amount} credits for ${price}` }
    : { title: 'Confirm subscription', message: `Activate ${product.tier === 'yearly' ? 'annual Pro' : product.tier === 'lifetime' ? 'Lifetime Pro' : 'monthly Pro'} for ${price}.`, confirm: 'Continue', cancel: 'Cancel', accessibilityLabel: `Confirm Pro subscription for ${price}` };
}
