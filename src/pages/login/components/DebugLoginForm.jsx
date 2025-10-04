import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/CheckBox';
import Icon from '../../../components/AppIcon';
import { authAPI, companiesAPI } from '../../../services/api';

const DebugLoginForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyId: '',
    role: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [companies, setCompanies] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Load companies on component mount
  useEffect(() => {
    loadCompanies();
  }, []);

  // Load users when company is selected
  useEffect(() => {
    if (formData.companyId) {
      loadCompanyUsers(formData.companyId);
    }
  }, [formData.companyId]);

  const loadCompanies = async () => {
    try {
      setDebugInfo('Loading companies...');
      const companiesData = await companiesAPI.getCompaniesForLogin();
      setCompanies(companiesData);
      setDebugInfo(`Loaded ${companiesData.length} companies successfully`);
      setErrors({}); // Clear any previous errors
    } catch (error) {
      console.error('Error loading companies:', error);
      setDebugInfo(`Error loading companies: ${error.message}. Using fallback data.`);
      // Don't set error state since we have fallback data
    }
  };

  const loadCompanyUsers = async (companyId) => {
    try {
      setDebugInfo(`Loading users for company ${companyId}...`);
      const usersData = await companiesAPI.getCompanyUsers(companyId);
      setCompanyUsers(usersData);
      setDebugInfo(`Loaded ${usersData.length} users for company ${companyId}`);
    } catch (error) {
      console.error('Error loading company users:', error);
      setDebugInfo(`Error loading users: ${error.message}. Using fallback data.`);
      // Don't set error state since we have fallback data
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.companyId) {
        newErrors.companyId = 'Please select a company';
      }
    } else if (stepNumber === 2) {
      if (!formData.role) {
        newErrors.role = 'Please select your role';
      }
    } else if (stepNumber === 3) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    setDebugInfo('Attempting login...');
    
    try {
      const response = await authAPI.login(
        formData.email, 
        formData.password, 
        formData.companyId, 
        formData.role
      );
      
      setDebugInfo('Login successful!');
      const { user, tokens } = response;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('companyId', user.company);
      
      // Clear any previous new company flag
      localStorage.removeItem('isNewCompany');
      
      // Navigate based on role
      switch (user.role) {
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
      
    } catch (error) {
      console.error('Login error:', error);
      setDebugInfo(`Login error: ${error.message}`);
      setErrors({
        general: error.response?.data?.detail || 'Login failed. Please check your credentials and try again.'
      });
    }
    
    setIsLoading(false);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Select Your Company';
      case 2: return 'Select Your Role';
      case 3: return 'Enter Your Credentials';
      default: return 'Login';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Choose the company you work for to continue';
      case 2: return 'Select your role within the company';
      case 3: return 'Enter your login credentials to access your account';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{getStepTitle()}</h2>
        <p className="text-muted-foreground">{getStepDescription()}</p>
      </div>

      {/* Debug Information */}
      <div className="mb-4 p-3 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-2">Debug Info:</h3>
        <p className="text-xs text-muted-foreground">{debugInfo}</p>
        <p className="text-xs text-muted-foreground">Companies: {companies.length}</p>
        <p className="text-xs text-muted-foreground">Users: {companyUsers.length}</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step > stepNumber ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors.general && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        )}

        {/* Step 1: Company Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <Select
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleInputChange}
              error={errors.companyId}
              required
            >
              <option value="">Select a company...</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            
            {/* Create Company Option */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Don't see your company?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/company-registration')}
                iconName="Plus"
                iconPosition="left"
                className="w-full"
              >
                Create New Company
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Role Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              error={errors.role}
              required
            >
              <option value="">Select your role...</option>
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </Select>
            
            {/* Show available users for the selected role */}
            {formData.role && companyUsers.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Available {formData.role}s in this company:
                </p>
                <div className="space-y-2">
                  {companyUsers
                    .filter(user => user.role === formData.role)
                    .map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="User" size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Credentials */}
        {step === 3 && (
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex space-x-3">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              type="button"
              variant="default"
              onClick={handleNext}
              disabled={isLoading || (step === 1 && !formData.companyId) || (step === 2 && !formData.role)}
              className="flex-1"
            >
              Next
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              iconName="LogIn"
              iconPosition="right"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DebugLoginForm;
