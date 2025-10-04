import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/CheckBox';
import Icon from '../../../components/AppIcon';
import { authAPI } from '../../../services/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different user roles
  const mockCredentials = {
    admin: { email: 'admin@expenseflow.com', password: 'admin123' },
    manager: { email: 'manager@expenseflow.com', password: 'manager123' },
    employee: { email: 'employee@expenseflow.com', password: 'employee123' }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Try real API first
      const response = await authAPI.login(formData.email, formData.password);
      const { access, refresh } = response;
      
      // Store tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      
      // Get user profile to determine role
      try {
        const profile = await authAPI.getProfile();
        const userRole = profile.role || 'employee'; // Default to employee if no role
        localStorage.setItem('userRole', userRole);
        
        // Clear any previous new company flag
        localStorage.removeItem('isNewCompany');
        
        // Navigate based on role
        switch (userRole) {
          case 'admin': 
            navigate('/admin-dashboard');
            break;
          case 'manager': 
            navigate('/manager-dashboard');
            break;
          case 'employee': 
            navigate('/employee-dashboard');
            break;
          default:
            navigate('/employee-dashboard');
        }
      } catch (profileError) {
        // If profile fetch fails, use default role
        localStorage.setItem('userRole', 'employee');
        navigate('/employee-dashboard');
      }
      
    } catch (apiError) {
      // If API fails, fall back to mock credentials for demo
      console.log('API login failed, falling back to mock credentials');
      
      // Check credentials against mock data
      let userRole = null;
      let isValidCredentials = false;
      
      Object.entries(mockCredentials)?.forEach(([role, credentials]) => {
        if (formData?.email === credentials?.email && formData?.password === credentials?.password) {
          userRole = role;
          isValidCredentials = true;
        }
      });
      
      if (isValidCredentials) {
        // Store user data in localStorage
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', formData?.email);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Clear any previous new company flag
        localStorage.removeItem('isNewCompany');
        
        // Navigate based on role
        switch (userRole) {
          case 'admin': 
            navigate('/admin-dashboard');
            break;
          case 'manager': 
            navigate('/manager-dashboard');
            break;
          case 'employee': 
            navigate('/employee-dashboard');
            break;
          default:
            // If role is not recognized, clear auth and show error
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            setErrors({
              general: 'Invalid user role. Please contact support.'
            });
            return;
        }
      } else {
        setErrors({
          general: 'Invalid email or password. Please check your credentials and try again.'
        });
      }
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset link would be sent to your email address.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors?.general && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
            <p className="text-sm text-error">{errors?.general}</p>
          </div>
        )}

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          disabled={isLoading}
        />

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="LogIn"
          iconPosition="right"
          className="mt-8"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Registration Link */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/company-registration')}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              Create your company account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;