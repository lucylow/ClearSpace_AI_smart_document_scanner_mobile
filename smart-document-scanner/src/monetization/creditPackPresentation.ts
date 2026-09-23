export type CreditPackCopy = {
  title: string;
  description: (credits: number, price: string) => string;
  purchased: (credits: number) => string;
};

const COPY_BY_LANGUAGE: Record<string, CreditPackCopy> = {
  en: {
    title: 'Extra export credits',
    description: (credits, price) => `${credits} export credits · ${price}`,
    purchased: credits => `${credits} export credits added.`,
  },
  es: {
    title: 'Créditos de exportación extra',
    description: (credits, price) => `${credits} créditos de exportación · ${price}`,
    purchased: credits => `Se añadieron ${credits} créditos de exportación.`,
  },
  fr: {
    title: "Crédits d’exportation supplémentaires",
    description: (credits, price) => `${credits} crédits d’exportation · ${price}`,
    purchased: credits => `${credits} crédits d’exportation ajoutés.`,
  },
  pt: {
    title: 'Créditos de exportação extras',
    description: (credits, price) => `${credits} créditos de exportação · ${price}`,
    purchased: credits => `${credits} créditos de exportação adicionados.`,
  },
};

function languageFor(locale?: string) {
  return locale?.trim().toLowerCase().split('-')[0] ?? 'en';
}

export function creditPackAmount(productId: string): number {
  if (productId === 'credits_50') return 50;
  if (productId === 'credits_10') return 10;
  return 0;
}

export function creditPackCopy(locale?: string): CreditPackCopy {
  return COPY_BY_LANGUAGE[languageFor(locale)] ?? COPY_BY_LANGUAGE.en;
}
