import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AdminAccountSection = ({ formData, errors, onInputChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password?.length >= 8) score++;
    if (/[A-Z]/?.test(password)) score++;
    if (/[a-z]/?.test(password)) score++;
    if (/[0-9]/?.test(password)) score++;
    if (/[^A-Za-z0-9]/?.test(password)) score++;

    const levels = [
      { strength: 0, label: 'Very Weak', color: 'bg-error' },
      { strength: 1, label: 'Weak', color: 'bg-error' },
      { strength: 2, label: 'Fair', color: 'bg-warning' },
      { strength: 3, label: 'Good', color: 'bg-warning' },
      { strength: 4, label: 'Strong', color: 'bg-success' },
      { strength: 5, label: 'Very Strong', color: 'bg-success' }
    ];

    return levels?.[score];
  };

  const passwordStrength = getPasswordStrength(formData?.password);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Admin Account Setup</h2>
        <p className="text-muted-foreground">Create your administrator account</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={formData?.firstName}
            onChange={onInputChange}
            error={errors?.firstName}
            required
          />

          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={formData?.lastName}
            onChange={onInputChange}
            error={errors?.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="admin@company.com"
          value={formData?.email}
          onChange={onInputChange}
          error={errors?.email}
          required
          description="This will be your login email and primary contact"
        />

        <div className="space-y-2">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={formData?.password}
              onChange={onInputChange}
              error={errors?.password}
              required
              description="Must be at least 8 characters with mixed case, numbers, and symbols"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>

          {formData?.password && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength?.color}`}
                    style={{ width: `${(passwordStrength?.strength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {passwordStrength?.label}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData?.confirmPassword}
            onChange={onInputChange}
            error={errors?.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountSection;