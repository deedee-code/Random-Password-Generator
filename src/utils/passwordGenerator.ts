export type PasswordStrength = 'low' | 'medium' | 'high';

export interface PasswordConfig {
  length: number;
  strength: PasswordStrength;
}

const CHARACTER_SETS = {
  low: {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789'
  },
  medium: {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*'
  },
  high: {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }
};

const MIN_LENGTHS = {
  low: 6,
  medium: 8,
  high: 12
};

/**
 * Generates a random password based on the specified configuration
 * @param config - Password configuration object
 * @returns Generated password string
 * @throws Error if length is below minimum for the strength level
 */
export function generatePassword(config: PasswordConfig): string {
  const { length, strength } = config;
  
  if (length < MIN_LENGTHS[strength]) {
    throw new Error(
      `Password length must be at least ${MIN_LENGTHS[strength]} characters for ${strength} strength`
    );
  }

  const charSets = CHARACTER_SETS[strength];
  const allChars = Object.values(charSets).join('');
  
  let password = '';
  const requiredSets = Object.values(charSets);
  
  requiredSets.forEach(charSet => {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    password += charSet[randomIndex];
  });
  
  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }
  
  return shuffleString(password);
}

/**
 * Shuffles a string using Fisher-Yates algorithm
 * @param str - String to shuffle
 * @returns Shuffled string
 */
function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

/**
 * Validates if a password meets the requirements for a given strength level
 * @param password - Password to validate
 * @param strength - Expected strength level
 * @returns Object with validation result and details
 */
export function validatePasswordStrength(password: string, strength: PasswordStrength): {
  isValid: boolean;
  details: {
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
    meetsLength: boolean;
    strength: PasswordStrength;
  };
} {
  const charSets = CHARACTER_SETS[strength];
  const minLength = MIN_LENGTHS[strength];
  
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = strength !== 'low' && /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  const meetsLength = password.length >= minLength;
  
  const isValid = hasLowercase && hasUppercase && hasNumbers && 
    (strength === 'low' || hasSymbols) && meetsLength;
  
  return {
    isValid,
    details: {
      hasLowercase,
      hasUppercase,
      hasNumbers,
      hasSymbols,
      meetsLength,
      strength
    }
  };
}

/**
 * Gets the minimum length requirement for a given strength level
 * @param strength - Password strength level
 * @returns Minimum length required
 */
export function getMinLengthForStrength(strength: PasswordStrength): number {
  return MIN_LENGTHS[strength];
}

/**
 * Gets all available character sets for a given strength level
 * @param strength - Password strength level
 * @returns Object containing character sets
 */
export function getCharacterSetsForStrength(strength: PasswordStrength): Record<string, string> {
  return CHARACTER_SETS[strength];
}
