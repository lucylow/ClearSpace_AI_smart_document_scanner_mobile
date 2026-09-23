import { describe, expect, it } from 'vitest';
import { recoveryRepairDismissLabel, recoveryRepairNotice } from '../src/core/services/recoveryRepairNotice';

describe('recovery repair notice', () => {
  it('returns no notice for empty or invalid counts', () => {
    expect(recoveryRepairNotice(0, 'en-US')).toBe('');
    expect(recoveryRepairNotice(Number.NaN, 'en-US')).toBe('');
  });

  it('localizes count-aware repair feedback without record details', () => {
    expect(recoveryRepairNotice(1, 'en-US')).toContain('1 recovery entry was skipped');
    expect(recoveryRepairNotice(2, 'fr-FR')).toContain('2 entrées de récupération');
    expect(recoveryRepairNotice(2, 'pt-BR')).toContain('2 entradas de recuperação');
  });

  it('localizes the accessible dismissal action', () => {
    expect(recoveryRepairDismissLabel('en-US')).toBe('Dismiss');
    expect(recoveryRepairDismissLabel('es-MX')).toBe('Descartar');
    expect(recoveryRepairDismissLabel('fr-FR')).toBe('Fermer');
    expect(recoveryRepairDismissLabel('pt-BR')).toBe('Dispensar');
  });

  it('falls back to English for unsupported locales', () => {
    expect(recoveryRepairNotice(1, 'xx-XX')).toContain('recovery entry was skipped');
  });
});
