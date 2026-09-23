import { describe, expect, it } from 'vitest';
import { expoCompatibilityAgeThresholdAnnouncement } from '../src/core/services/expoCompatibilityAgeAnnouncement';

describe('Expo compatibility age threshold announcements', () => {
  it('announces only the first transition beyond one minute', () => {
    const checkedAt = 1_000;
    expect(expoCompatibilityAgeThresholdAnnouncement(checkedAt + 59_000, checkedAt + 60_000, checkedAt, 'en-US')).toBe('Compatibility check is now more than one minute old.');
    expect(expoCompatibilityAgeThresholdAnnouncement(checkedAt + 60_000, checkedAt + 120_000, checkedAt, 'en-US')).toBeNull();
    expect(expoCompatibilityAgeThresholdAnnouncement(checkedAt + 59_000, checkedAt + 60_000, checkedAt, 'fr-FR')).toBe('La vérification de compatibilité date maintenant de plus d’une minute.');
  });

  it('falls back safely for unsupported locales and invalid times', () => {
    expect(expoCompatibilityAgeThresholdAnnouncement(1_000, 61_000, 1_000, 'xx-XX')).toBe('Compatibility check is now more than one minute old.');
    expect(expoCompatibilityAgeThresholdAnnouncement(Number.NaN, 61_000, 1_000, 'en-US')).toBeNull();
  });
});
