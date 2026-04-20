import { describe, it, expect } from 'vitest';
import { validateContentBanks } from '../utils/schema.js';

describe('validateContentBanks', () => {
  it('returns no hard errors for the shipped content banks', () => {
    const { errors } = validateContentBanks();
    expect(errors).toEqual([]);
  });
});
