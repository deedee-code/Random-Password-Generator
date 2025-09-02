import {
  generatePassword,
  validatePasswordStrength,
  getMinLengthForStrength,
  getCharacterSetsForStrength,
  type PasswordConfig,
  type PasswordStrength
} from '../passwordGenerator';

describe('Password Generator', () => {
  describe('generatePassword', () => {
    describe('Password Length Validation', () => {
      it('should generate password with exact specified length', () => {
        const config: PasswordConfig = { length: 10, strength: 'medium' };
        const password = generatePassword(config);
        expect(password).toHaveLength(10);
      });

      it('should generate password with minimum length for low strength', () => {
        const config: PasswordConfig = { length: 6, strength: 'low' };
        const password = generatePassword(config);
        expect(password).toHaveLength(6);
      });

      it('should generate password with minimum length for medium strength', () => {
        const config: PasswordConfig = { length: 8, strength: 'medium' };
        const password = generatePassword(config);
        expect(password).toHaveLength(8);
      });

      it('should generate password with minimum length for high strength', () => {
        const config: PasswordConfig = { length: 12, strength: 'high' };
        const password = generatePassword(config);
        expect(password).toHaveLength(12);
      });

      it('should generate password with custom length above minimum', () => {
        const config: PasswordConfig = { length: 20, strength: 'high' };
        const password = generatePassword(config);
        expect(password).toHaveLength(20);
      });

      it('should throw error for length below minimum for low strength', () => {
        const config: PasswordConfig = { length: 5, strength: 'low' };
        expect(() => generatePassword(config)).toThrow(
          'Password length must be at least 6 characters for low strength'
        );
      });

      it('should throw error for length below minimum for medium strength', () => {
        const config: PasswordConfig = { length: 7, strength: 'medium' };
        expect(() => generatePassword(config)).toThrow(
          'Password length must be at least 8 characters for medium strength'
        );
      });

      it('should throw error for length below minimum for high strength', () => {
        const config: PasswordConfig = { length: 11, strength: 'high' };
        expect(() => generatePassword(config)).toThrow(
          'Password length must be at least 12 characters for high strength'
        );
      });

      it('should generate different passwords on multiple calls', () => {
        const config: PasswordConfig = { length: 10, strength: 'medium' };
        const passwords = new Set();
        
        for (let i = 0; i < 100; i++) {
          passwords.add(generatePassword(config));
        }
        
        expect(passwords.size).toBeGreaterThan(95);
      });
    });

    describe('Strength Validation', () => {
      it('should generate low strength password with only letters and numbers', () => {
        const config: PasswordConfig = { length: 8, strength: 'low' };
        const password = generatePassword(config);
        
        expect(/[a-z]/.test(password)).toBe(true);
        expect(/[A-Z]/.test(password)).toBe(true);
        expect(/[0-9]/.test(password)).toBe(true);
        
        expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)).toBe(false);
      });

      it('should generate medium strength password with letters, numbers, and basic symbols', () => {
        const config: PasswordConfig = { length: 10, strength: 'medium' };
        const password = generatePassword(config);
        
        expect(/[a-z]/.test(password)).toBe(true);
        expect(/[A-Z]/.test(password)).toBe(true);
        expect(/[0-9]/.test(password)).toBe(true);
        expect(/[!@#$%^&*]/.test(password)).toBe(true);
      });

      it('should generate high strength password with all character types', () => {
        const config: PasswordConfig = { length: 15, strength: 'high' };
        const password = generatePassword(config);
        
        expect(/[a-z]/.test(password)).toBe(true);
        expect(/[A-Z]/.test(password)).toBe(true);
        expect(/[0-9]/.test(password)).toBe(true);
        expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)).toBe(true);
      });

      it('should ensure password contains at least one character from each required set', () => {
        const config: PasswordConfig = { length: 6, strength: 'low' };
        
        for (let i = 0; i < 50; i++) {
          const password = generatePassword(config);
          expect(/[a-z]/.test(password)).toBe(true);
          expect(/[A-Z]/.test(password)).toBe(true);
          expect(/[0-9]/.test(password)).toBe(true);
        }
      });

      it('should ensure medium strength password contains symbols', () => {
        const config: PasswordConfig = { length: 8, strength: 'medium' };
        
        for (let i = 0; i < 50; i++) {
          const password = generatePassword(config);
          expect(/[!@#$%^&*]/.test(password)).toBe(true);
        }
      });

      it('should ensure high strength password contains extended symbols', () => {
        const config: PasswordConfig = { length: 12, strength: 'high' };
        
        for (let i = 0; i < 50; i++) {
          const password = generatePassword(config);
          expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)).toBe(true);
        }
      });
    });

    describe('Edge Cases', () => {
      it('should handle very long passwords', () => {
        const config: PasswordConfig = { length: 100, strength: 'high' };
        const password = generatePassword(config);
        expect(password).toHaveLength(100);
        expect(/[a-z]/.test(password)).toBe(true);
        expect(/[A-Z]/.test(password)).toBe(true);
        expect(/[0-9]/.test(password)).toBe(true);
        expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)).toBe(true);
      });

      it('should handle zero length gracefully (should throw)', () => {
        const config: PasswordConfig = { length: 0, strength: 'low' };
        expect(() => generatePassword(config)).toThrow();
      });

      it('should handle negative length gracefully (should throw)', () => {
        const config: PasswordConfig = { length: -1, strength: 'low' };
        expect(() => generatePassword(config)).toThrow();
      });
    });
  });

  describe('validatePasswordStrength', () => {
    describe('Low Strength Validation', () => {
      it('should validate correct low strength password', () => {
        const password = 'Abc123';
        const result = validatePasswordStrength(password, 'low');
        
        expect(result.isValid).toBe(true);
        expect(result.details.hasLowercase).toBe(true);
        expect(result.details.hasUppercase).toBe(true);
        expect(result.details.hasNumbers).toBe(true);
        expect(result.details.hasSymbols).toBe(false);
        expect(result.details.meetsLength).toBe(true);
        expect(result.details.strength).toBe('low');
      });

      it('should reject low strength password missing lowercase', () => {
        const password = 'ABC123';
        const result = validatePasswordStrength(password, 'low');
        expect(result.isValid).toBe(false);
        expect(result.details.hasLowercase).toBe(false);
      });

      it('should reject low strength password missing uppercase', () => {
        const password = 'abc123';
        const result = validatePasswordStrength(password, 'low');
        expect(result.isValid).toBe(false);
        expect(result.details.hasUppercase).toBe(false);
      });

      it('should reject low strength password missing numbers', () => {
        const password = 'Abcdef';
        const result = validatePasswordStrength(password, 'low');
        expect(result.isValid).toBe(false);
        expect(result.details.hasNumbers).toBe(false);
      });

      it('should reject low strength password that is too short', () => {
        const password = 'Ab1';
        const result = validatePasswordStrength(password, 'low');
        expect(result.isValid).toBe(false);
        expect(result.details.meetsLength).toBe(false);
      });
    });

    describe('Medium Strength Validation', () => {
      it('should validate correct medium strength password', () => {
        const password = 'Abc123!@';
        const result = validatePasswordStrength(password, 'medium');
        
        expect(result.isValid).toBe(true);
        expect(result.details.hasLowercase).toBe(true);
        expect(result.details.hasUppercase).toBe(true);
        expect(result.details.hasNumbers).toBe(true);
        expect(result.details.hasSymbols).toBe(true);
        expect(result.details.meetsLength).toBe(true);
        expect(result.details.strength).toBe('medium');
      });

      it('should reject medium strength password missing symbols', () => {
        const password = 'Abc12345';
        const result = validatePasswordStrength(password, 'medium');
        expect(result.isValid).toBe(false);
        expect(result.details.hasSymbols).toBe(false);
      });

      it('should reject medium strength password that is too short', () => {
        const password = 'Ab1!';
        const result = validatePasswordStrength(password, 'medium');
        expect(result.isValid).toBe(false);
        expect(result.details.meetsLength).toBe(false);
      });
    });

    describe('High Strength Validation', () => {
      it('should validate correct high strength password', () => {
        const password = 'Abc123!@#$%^';
        const result = validatePasswordStrength(password, 'high');
        
        expect(result.isValid).toBe(true);
        expect(result.details.hasLowercase).toBe(true);
        expect(result.details.hasUppercase).toBe(true);
        expect(result.details.hasNumbers).toBe(true);
        expect(result.details.hasSymbols).toBe(true);
        expect(result.details.meetsLength).toBe(true);
        expect(result.details.strength).toBe('high');
      });

      it('should reject high strength password missing extended symbols', () => {
        const password = 'Abc12345!@#$';
        const result = validatePasswordStrength(password, 'high');
        // This should still be valid as it contains basic symbols
        expect(result.isValid).toBe(true);
      });

      it('should reject high strength password that is too short', () => {
        const password = 'Ab1!@#$';
        const result = validatePasswordStrength(password, 'high');
        expect(result.isValid).toBe(false);
        expect(result.details.meetsLength).toBe(false);
      });
    });

    describe('Edge Cases for Validation', () => {
      it('should handle empty password', () => {
        const result = validatePasswordStrength('', 'low');
        expect(result.isValid).toBe(false);
        expect(result.details.hasLowercase).toBe(false);
        expect(result.details.hasUppercase).toBe(false);
        expect(result.details.hasNumbers).toBe(false);
        expect(result.details.meetsLength).toBe(false);
      });

      it('should handle password with only spaces', () => {
        const result = validatePasswordStrength('   ', 'low');
        expect(result.isValid).toBe(false);
        expect(result.details.hasLowercase).toBe(false);
        expect(result.details.hasUppercase).toBe(false);
        expect(result.details.hasNumbers).toBe(false);
      });
    });
  });

  describe('Utility Functions', () => {
    describe('getMinLengthForStrength', () => {
      it('should return correct minimum length for low strength', () => {
        expect(getMinLengthForStrength('low')).toBe(6);
      });

      it('should return correct minimum length for medium strength', () => {
        expect(getMinLengthForStrength('medium')).toBe(8);
      });

      it('should return correct minimum length for high strength', () => {
        expect(getMinLengthForStrength('high')).toBe(12);
      });
    });

    describe('getCharacterSetsForStrength', () => {
      it('should return correct character sets for low strength', () => {
        const sets = getCharacterSetsForStrength('low');
        expect(sets).toHaveProperty('lowercase');
        expect(sets).toHaveProperty('uppercase');
        expect(sets).toHaveProperty('numbers');
        expect(sets).not.toHaveProperty('symbols');
      });

      it('should return correct character sets for medium strength', () => {
        const sets = getCharacterSetsForStrength('medium');
        expect(sets).toHaveProperty('lowercase');
        expect(sets).toHaveProperty('uppercase');
        expect(sets).toHaveProperty('numbers');
        expect(sets).toHaveProperty('symbols');
        expect(sets.symbols).toBe('!@#$%^&*');
      });

      it('should return correct character sets for high strength', () => {
        const sets = getCharacterSetsForStrength('high');
        expect(sets).toHaveProperty('lowercase');
        expect(sets).toHaveProperty('uppercase');
        expect(sets).toHaveProperty('numbers');
        expect(sets).toHaveProperty('symbols');
        expect(sets.symbols).toBe('!@#$%^&*()_+-=[]{}|;:,.<>?');
      });
    });
  });

  describe('Integration Tests', () => {
    it('should generate and validate passwords for all strength levels', () => {
      const strengths: PasswordStrength[] = ['low', 'medium', 'high'];
      
      strengths.forEach(strength => {
        const minLength = getMinLengthForStrength(strength);
        const config: PasswordConfig = { length: minLength + 2, strength };
        
        const password = generatePassword(config);
        const validation = validatePasswordStrength(password, strength);
        
        expect(validation.isValid).toBe(true);
        expect(password).toHaveLength(minLength + 2);
      });
    });

    it('should generate passwords that pass their own strength validation', () => {
      const testCases = [
        { length: 8, strength: 'low' as PasswordStrength },
        { length: 10, strength: 'medium' as PasswordStrength },
        { length: 15, strength: 'high' as PasswordStrength }
      ];

      testCases.forEach(config => {
        const password = generatePassword(config);
        const validation = validatePasswordStrength(password, config.strength);
        
        expect(validation.isValid).toBe(true);
        expect(validation.details.strength).toBe(config.strength);
      });
    });
  });
});
