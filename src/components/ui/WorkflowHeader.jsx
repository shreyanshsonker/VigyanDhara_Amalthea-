import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const WorkflowHeader = ({ 
  title = 'Workflow', 
  breadcrumbs = [], 
  actions = [],
  showBackButton = true,
  userRole = 'admin'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Close profile menu
    setIsProfileMenuOpen(false);
    
    // Navigate to login page
    navigate('/login');
  };

  const getUserInfo = () => {
    const email = localStorage.getItem('userEmail') || 'user@example.com';
    const role = localStorage.getItem('userRole') || userRole;
    return { email, role };
  };

  const getUserDisplayName = () => {
    const { email, role } = getUserInfo();
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBackClick = () => {
    const dashboardPath = userRole === 'admin' ? '/admin-dashboard' : 
                          userRole === 'manager' ? '/manager-dashboard' : 
                          userRole === 'employee' ? '/employee-dashboard' : '/dashboard';
    navigate(dashboardPath);
  };

  const getPageTitle = () => {
    switch (location?.pathname) {
      case '/approval-workflow':
        return 'Approval Workflow';
      case '/analytics-and-reports':
        return 'Analytics & Reports';
      case '/employee-dashboard':
        return 'Employee Dashboard';
      default:
        return title;
    }
  };

  const getDefaultBreadcrumbs = () => {
    const dashboardName = userRole === 'admin' ? 'Admin Dashboard' : 
                         userRole === 'manager' ? 'Manager Dashboard' : 
                         userRole === 'employee' ? 'Employee Dashboard' : 'Dashboard';
    
    const dashboardPath = userRole === 'admin' ? '/admin-dashboard' : 
                         userRole === 'manager' ? '/manager-dashboard' : 
                         userRole === 'employee' ? '/employee-dashboard' : '/dashboard';
    
    return [
      { label: dashboardName, path: dashboardPath },
      { label: getPageTitle(), path: location?.pathname }
    ];
  };

  const currentBreadcrumbs = breadcrumbs?.length > 0 ? breadcrumbs : getDefaultBreadcrumbs();

  const defaultActions = [
    {
      label: 'Export',
      icon: 'Download',
      variant: 'outline',
      onClick: () => console.log('Export data')
    },
    {
      label: 'Refresh',
      icon: 'RefreshCw',
      variant: 'ghost',
      onClick: () => window.location?.reload()
    }
  ];

  const currentActions = actions?.length > 0 ? actions : defaultActions;

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                iconName="ArrowLeft"
                iconPosition="left"
                className="text-muted-foreground hover:text-foreground"
              >
                Back
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Receipt" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-foreground">ExpenseFlow</span>
            </div>
          </div>

          {/* Center Section - Title */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {currentActions?.map((action, index) => (
                <Button
                  key={index}
                  variant={action?.variant || 'outline'}
                  size="sm"
                  onClick={action?.onClick}
                  iconName={action?.icon}
                  iconPosition="left"
                  disabled={action?.disabled}
                  className="hover-scale"
                >
                  {action?.label}
                </Button>
              ))}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getUserDisplayName().charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground capitalize">{getUserInfo().role}</p>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`text-muted-foreground transition-transform duration-200 ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{getUserInfo().email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{getUserInfo().role}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                iconName="MoreVertical"
              />
            </div>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="md:hidden pb-3">
          <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
        </div>

        {/* Breadcrumbs */}
        <div className="pb-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {currentBreadcrumbs?.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground mx-2" />
                  )}
                  {index === currentBreadcrumbs?.length - 1 ? (
                    <span className="text-foreground font-medium">{crumb?.label}</span>
                  ) : (
                    <button
                      onClick={() => navigate(crumb?.path)}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {crumb?.label}
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Mobile Actions Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="bg-card border border-border rounded-lg p-2 space-y-1">
              {currentActions?.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    action?.onClick();
                    setIsMenuOpen(false);
                  }}
                  iconName={action?.icon}
                  iconPosition="left"
                  disabled={action?.disabled}
                  fullWidth
                  className="justify-start"
                >
                  {action?.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                iconName="LogOut"
                iconPosition="left"
                fullWidth
                className="justify-start text-destructive hover:text-destructive"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default WorkflowHeader;