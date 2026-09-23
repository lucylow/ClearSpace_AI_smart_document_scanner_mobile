import { describe, expect, it } from 'vitest';
import { recoveryPersistenceAnnouncement } from '../src/core/services/recoveryPersistenceAnnouncement';

describe('recoveryPersistenceAnnouncement', () => {
  it('returns localized success copy for each supported language', () => {
    expect(recoveryPersistenceAnnouncement('en-US', { status: 'saved' })).toBe('Settings saved.');
    expect(recoveryPersistenceAnnouncement('es-MX', { status: 'saved' })).toBe('Ajustes guardados.');
    expect(recoveryPersistenceAnnouncement('fr-CA', { status: 'saved' })).toBe('Réglages enregistrés.');
    expect(recoveryPersistenceAnnouncement('pt-BR', { status: 'saved' })).toBe('Configurações salvas.');
  });

  it('preserves localized failure detail for retry feedback', () => {
    expect(recoveryPersistenceAnnouncement('fr-FR', { status: 'failed', detail: 'Storage unavailable.' })).toBe(
      'Impossible d’enregistrer cette préférence. Storage unavailable.',
    );
  });

  it('falls back to English for unsupported locales', () => {
    expect(recoveryPersistenceAnnouncement('de-DE', { status: 'saved' })).toBe('Settings saved.');
  });
});
