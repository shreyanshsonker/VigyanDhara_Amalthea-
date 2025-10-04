import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const userRole = localStorage.getItem('userRole');
      const companyId = localStorage.getItem('companyId');

      if (!isAuthenticated || !userRole || !companyId) {
        // User not authenticated or missing required data
        localStorage.clear();
        navigate('/login');
        return;
      }

      // Check if user has required role
      if (requiredRole && userRole !== requiredRole) {
        // User doesn't have the required role, redirect to appropriate dashboard
        switch (userRole) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'manager':
            navigate('/manager-dashboard');
            break;
          case 'employee':
            navigate('/approval-workflow');
            break;
          default:
            navigate('/login');
        }
        return;
      }

      // Check if user has one of the allowed roles
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        // User doesn't have any of the allowed roles, redirect to appropriate dashboard
        switch (userRole) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'manager':
            navigate('/manager-dashboard');
            break;
          case 'employee':
            navigate('/approval-workflow');
            break;
          default:
            navigate('/login');
        }
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, requiredRole, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
