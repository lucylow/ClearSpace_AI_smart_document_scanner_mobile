import { describe, expect, it } from 'vitest';
import { getRecoveryStatusPresentation } from '../src/core/services/recoveryStatusPresentation';

describe('recovery status presentation', () => {
  const now = Date.UTC(2026, 0, 15, 13, 30);

  it('localizes available saved status and action labels', () => {
    const presentation = getRecoveryStatusPresentation('fr-CA', true, now - 30 * 60 * 1000, now);

    expect(presentation.cardLabel).toBe('État de la récupération locale');
    expect(presentation.title).toBe('Récupération locale');
    expect(presentation.savedLabel).toBe('Enregistré il y a moins d’une heure');
    expect(presentation.staleWarning).toBeNull();
    expect(presentation.restoreLabel).toBe('Restaurer');
    expect(presentation.deleteLabel).toBe('Supprimer');
    expect(presentation.refreshLabel).toBe('Actualiser');
  });

  it('exposes stale guidance and English fallback for unsupported locales', () => {
    const presentation = getRecoveryStatusPresentation('xx-XX', true, now - 8 * 24 * 60 * 60 * 1000, now);

    expect(presentation.cardLabel).toBe('Local recovery status');
    expect(presentation.savedLabel).toBe('Saved 8 days ago');
    expect(presentation.staleWarning).toContain('more than a week');
  });

  it('keeps unavailable recovery safe and still provides refresh accessibility copy', () => {
    const presentation = getRecoveryStatusPresentation('pt-BR', false, null, now);

    expect(presentation.savedLabel).toContain('Ainda não há');
    expect(presentation.staleWarning).toBeNull();
    expect(presentation.refreshLabel).toBe('Atualizar');
  });
});
