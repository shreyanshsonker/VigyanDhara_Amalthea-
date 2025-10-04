import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationHeader from '../../components/ui/AuthenticationHeader';
import LoginHeader from './components/LoginHeader';
import CompanyRoleLoginForm from './components/CompanyRoleLoginForm';
import DebugLoginForm from './components/DebugLoginForm';
import SecurityIndicators from './components/SecurityIndicators';
import DemoCredentials from './components/DemoCredentials';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    console.log('Login Page - Auth Check:', { isAuthenticated, userRole });
    
    if (isAuthenticated === 'true' && userRole) {
      console.log('User already authenticated, redirecting to dashboard');
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'admin': 
          console.log('Redirecting to admin dashboard');
          navigate('/admin-dashboard');
          break;
        case 'manager': 
          console.log('Redirecting to manager dashboard');
          navigate('/manager-dashboard');
          break;
        case 'employee': 
          console.log('Redirecting to employee dashboard');
          navigate('/approval-workflow');
          break;
        default:
          console.log('Unknown role, clearing auth');
          // If role is not recognized, clear auth and stay on login
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userEmail');
      }
    } else {
      console.log('User not authenticated, showing login form');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Authentication Header */}
      <AuthenticationHeader onBackClick={() => navigate('/')} />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Login Header with Logo and Welcome */}
          <LoginHeader />
          
          {/* Login Form */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8">
            <CompanyRoleLoginForm />
            
            {/* Demo Credentials */}
            <DemoCredentials />
          </div>
          
          {/* Security Indicators */}
          <SecurityIndicators />
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default LoginPage;