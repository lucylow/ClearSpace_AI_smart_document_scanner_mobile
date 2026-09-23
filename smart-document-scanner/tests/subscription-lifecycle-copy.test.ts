import { describe, expect, it } from 'vitest';
import { subscriptionLifecyclePresentation } from '../src/monetization/subscription-lifecycle-copy';

const NOW = Date.UTC(2026, 7, 20, 12, 0, 0);

 describe('subscription lifecycle presentation', () => {
  it('presents active Pro without renewal metadata', () => {
    const result = subscriptionLifecyclePresentation('en-US', 'yearly', undefined, NOW);
    expect(result.title).toBe('Pro active');
    expect(result.tone).toBe('success');
    expect(result.accessibilityLabel).toContain('Pro active');
  });

  it('explains an upcoming renewal in Spanish with a localized date', () => {
    const renewalAt = NOW + 2 * 24 * 60 * 60 * 1000;
    const result = subscriptionLifecyclePresentation('es-ES', 'monthly', renewalAt, NOW);
    expect(result.title).toBe('Renovación próxima');
    expect(result.detail).toContain('Tu acceso Pro se renueva');
    expect(result.tone).toBe('warning');
  });

  it('escalates expired subscription access in French', () => {
    const result = subscriptionLifecyclePresentation('fr-FR', 'yearly', NOW - 1, NOW);
    expect(result.title).toContain('Actualisation');
    expect(result.detail).toContain('Restaurez');
    expect(result.tone).toBe('error');
  });

  it('makes lifetime plans explicit in Portuguese', () => {
    const result = subscriptionLifecyclePresentation('pt-BR', 'lifetime', undefined, NOW);
    expect(result.title).toBe('Pro vitalício ativo');
    expect(result.detail).toContain('renovações');
    expect(result.tone).toBe('success');
  });

  it('handles free and unsupported locales safely', () => {
    expect(subscriptionLifecyclePresentation('de-DE', 'free', undefined, NOW).title).toBe('Free plan');
    expect(subscriptionLifecyclePresentation('en-US', 'free', undefined, NOW).tone).toBe('neutral');
  });
});
