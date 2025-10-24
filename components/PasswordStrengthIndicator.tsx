'use client';

import { useState, useEffect } from 'react';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from '@/lib/utils/password-validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
}

export default function PasswordStrengthIndicator({ password, showDetails = true }: PasswordStrengthIndicatorProps) {
  const [validation, setValidation] = useState(validatePassword(password));

  useEffect(() => {
    setValidation(validatePassword(password));
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              validation.strength === 'weak' ? 'bg-red-500' :
              validation.strength === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ 
              width: validation.strength === 'weak' ? '33%' :
                     validation.strength === 'medium' ? '66%' : '100%'
            }}
          />
        </div>
        <span className={`text-sm font-medium ${getPasswordStrengthColor(validation.strength)}`}>
          {getPasswordStrengthText(validation.strength)}
        </span>
      </div>

      {/* Validation Details */}
      {showDetails && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1 h-1 bg-destructive rounded-full" />
              <span className="text-destructive">{error}</span>
            </div>
          ))}
          
          {validation.isValid && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-1 h-1 bg-success rounded-full" />
              <span className="text-success">Password meets all requirements</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
