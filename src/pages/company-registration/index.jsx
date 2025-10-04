import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import CompanyInfoSection from './components/CompanyInfoSection';
import AdminAccountSection from './components/AdminAccountSection';
import ConfigurationSection from './components/ConfigurationSection';
import ProgressIndicator from './components/ProgressIndicator';
import TrustSignals from './components/TrustSignals';
import { companiesAPI, authAPI } from '../../services/api';

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    country: '',
    currency: '',
    companySize: '',
    
    // Admin Account
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Configuration
    timezone: 'UTC+00:00',
    approvalWorkflow: 'simple',
    expenseCategories: ['travel', 'meals', 'office'],
    enableTwoFactor: true,
    requireReceipts: true,
    enableOCR: true,
    emailNotifications: true
  });

  const [errors, setErrors] = useState({});

  // Mock countries data (simulating restcountries API)
  useEffect(() => {
    const mockCountries = [
      { value: 'US', label: 'United States', currency: 'USD' },
      { value: 'GB', label: 'United Kingdom', currency: 'GBP' },
      { value: 'CA', label: 'Canada', currency: 'CAD' },
      { value: 'AU', label: 'Australia', currency: 'AUD' },
      { value: 'DE', label: 'Germany', currency: 'EUR' },
      { value: 'FR', label: 'France', currency: 'EUR' },
      { value: 'JP', label: 'Japan', currency: 'JPY' },
      { value: 'IN', label: 'India', currency: 'INR' },
      { value: 'SG', label: 'Singapore', currency: 'SGD' },
      { value: 'NL', label: 'Netherlands', currency: 'EUR' },
      { value: 'SE', label: 'Sweden', currency: 'SEK' },
      { value: 'CH', label: 'Switzerland', currency: 'CHF' },
      { value: 'NO', label: 'Norway', currency: 'NOK' },
      { value: 'DK', label: 'Denmark', currency: 'DKK' },
      { value: 'FI', label: 'Finland', currency: 'EUR' }
    ];
    setCountries(mockCountries);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCountryChange = (value) => {
    const selectedCountry = countries?.find(c => c?.value === value);
    setFormData(prev => ({
      ...prev,
      country: value,
      currency: selectedCountry ? selectedCountry?.currency : ''
    }));
    
    if (errors?.country) {
      setErrors(prev => ({
        ...prev,
        country: ''
      }));
    }
  };

  const handleCheckboxChange = (field, value, checked) => {
    if (field === 'expenseCategories') {
      setFormData(prev => ({
        ...prev,
        expenseCategories: checked 
          ? [...prev?.expenseCategories, value]
          : prev?.expenseCategories?.filter(cat => cat !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: checked
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.companyName?.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData?.country) {
        newErrors.country = 'Please select a country';
      }
    }

    if (step === 2) {
      if (!formData?.firstName?.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData?.lastName?.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 3) {
      if (!formData?.timezone) {
        newErrors.timezone = 'Please select a timezone';
      }
      if (!formData?.approvalWorkflow) {
        newErrors.approvalWorkflow = 'Please select an approval workflow';
      }
      if (formData?.expenseCategories?.length === 0) {
        newErrors.expenseCategories = 'Please select at least one expense category';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    
    try {
      // Create company first
      const companyData = {
        name: formData.companyName,
        country: formData.country,
        currency: formData.currency,
        company_size: formData.companySize,
        timezone: formData.timezone,
        is_active: true,
        is_verified: true
      };

      const companyResponse = await companiesAPI.createCompany(companyData);
      const companyId = companyResponse.id;

      // Create admin user
      const userData = {
        email: formData.email,
        username: formData.email.split('@')[0], // Use email prefix as username
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
        role: 'admin',
        company: companyId,
        is_active: true,
        is_verified: true
      };

      const userResponse = await authAPI.register(userData);
      
      // Login the user automatically
      const loginResponse = await authAPI.login(
        formData.email, 
        formData.password, 
        companyId, 
        'admin'
      );

      const { user, tokens } = loginResponse;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('companyId', user.company);
      localStorage.setItem('companyName', formData.companyName);
      localStorage.setItem('isNewCompany', 'true'); // Flag to show fresh dashboard
      
      setIsLoading(false);
      // Navigate to admin dashboard after successful registration
      navigate('/admin-dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: error.response?.data?.detail || 'Registration failed. Please try again.'
      });
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyInfoSection
            formData={formData}
            errors={errors}
            countries={countries}
            onInputChange={handleInputChange}
            onCountryChange={handleCountryChange}
          />
        );
      case 2:
        return (
          <AdminAccountSection
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <ConfigurationSection
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Receipt" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ExpenseFlow</h1>
                <p className="text-sm text-muted-foreground">Company Registration</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="p-6 sm:p-8">
            <ProgressIndicator currentStep={currentStep} totalSteps={3} />
            
            <div className="max-w-2xl mx-auto">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <div>
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      iconName="ArrowLeft"
                      iconPosition="left"
                      disabled={isLoading}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">
                    Step {currentStep} of 3
                  </span>
                  
                  {currentStep < 3 ? (
                    <Button
                      variant="default"
                      onClick={handleNext}
                      iconName="ArrowRight"
                      iconPosition="right"
                      disabled={isLoading}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={handleSubmit}
                      loading={isLoading}
                      iconName="Check"
                      iconPosition="left"
                    >
                      {isLoading ? 'Creating Account...' : 'Complete Registration'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <TrustSignals />
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>© {new Date()?.getFullYear()} ExpenseFlow</span>
              <button className="hover:text-foreground transition-colors">Privacy Policy</button>
              <button className="hover:text-foreground transition-colors">Terms of Service</button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-xs text-muted-foreground">Secure Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Headphones" size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyRegistration;