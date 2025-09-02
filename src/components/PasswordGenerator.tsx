'use client';

import { useState, useCallback } from 'react';
import { generatePassword, validatePasswordStrength, getMinLengthForStrength, type PasswordConfig, type PasswordStrength } from '../utils/passwordGenerator';

interface PasswordGeneratorProps {
  className?: string;
}

export default function PasswordGenerator({ className = '' }: PasswordGeneratorProps) {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(12);
  const [strength, setStrength] = useState<PasswordStrength>('medium');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [validation, setValidation] = useState<any>(null);

  const minLength = getMinLengthForStrength(strength);

  const handleGeneratePassword = useCallback(async () => {
    setIsGenerating(true);
    try {
      const config: PasswordConfig = { length, strength };
      const newPassword = generatePassword(config);
      setPassword(newPassword);
      
      const validationResult = validatePasswordStrength(newPassword, strength);
      setValidation(validationResult);
    } catch (error) {
      console.error('Error generating password:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [length, strength]);

  const handleCopyPassword = useCallback(async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy password:', error);
      }
    }
  }, [password]);

  const handleStrengthChange = (newStrength: PasswordStrength) => {
    setStrength(newStrength);
    const newMinLength = getMinLengthForStrength(newStrength);
    if (length < newMinLength) {
      setLength(newMinLength);
    }
  };

  const getStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case 'low': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  };

  const getCharacterSetInfo = () => {
    const baseInfo = [
      '• Lowercase letters: a-z',
      '• Uppercase letters: A-Z',
      '• Numbers: 0-9'
    ];
    
    if (strength === 'medium') {
      baseInfo.push('• Basic symbols: !@#$%^&*');
    } else if (strength === 'high') {
      baseInfo.push('• Extended symbols: !@#$%^&*()_+-=[]{}|;:,.<>?');
    }
    
    return baseInfo;
  };

  return (
    <div className={`max-w-4xl mx-auto p-8 ${className}`}>
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          Secure Password Generator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create strong, secure passwords with customizable strength levels and real-time validation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              Password Strength
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as PasswordStrength[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleStrengthChange(level)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    strength === level
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-sm font-semibold capitalize text-gray-900">{level}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Min: {getMinLengthForStrength(level)} chars
                  </div>
                  <div className={`w-full h-1 rounded-full mt-2 ${
                    strength === level ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              Password Length
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-green-600">{length}</span>
                <span className="text-gray-500 ml-2">characters</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={minLength}
                  max={50}
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{minLength}</span>
                  <span>50</span>
                </div>
              </div>
              <div className="flex justify-center">
                <input
                  type="number"
                  min={minLength}
                  max={50}
                  value={length}
                  onChange={(e) => setLength(Math.max(minLength, parseInt(e.target.value) || minLength))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGeneratePassword}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Password
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {password && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                Generated Password
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm break-all text-gray-800">
                    {password}
                  </div>
                  <button
                    onClick={handleCopyPassword}
                    className="p-4 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all duration-200 transform hover:scale-105"
                    title="Copy password"
                  >
                    {copied ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                {copied && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Password copied to clipboard!
                  </div>
                )}
              </div>
            </div>
          )}

          {validation && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                Password Validation
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-900">Overall Strength</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStrengthColor(validation.details.strength)}`}>
                    {validation.details.strength.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Lowercase</span>
                    {getValidationIcon(validation.details.hasLowercase)}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Uppercase</span>
                    {getValidationIcon(validation.details.hasUppercase)}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Numbers</span>
                    {getValidationIcon(validation.details.hasNumbers)}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Symbols</span>
                    {getValidationIcon(validation.details.hasSymbols)}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg col-span-2">
                    <span className="text-sm font-medium text-gray-700">Length ({password.length} chars)</span>
                    {getValidationIcon(validation.details.meetsLength)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              Character Sets Used
            </h3>
            <div className="text-sm text-green-700 space-y-2">
              {getCharacterSetInfo().map((info, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                  {info}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}