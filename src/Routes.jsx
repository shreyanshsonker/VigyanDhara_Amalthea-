import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import CompanyRegistration from './pages/company-registration';
import ManagerDashboard from './pages/manager-dashboard';
import AdminDashboard from './pages/admin-dashboard';
import EmployeeDashboard from './pages/employee-dashboard';
import LoginPage from './pages/login';
import AnalyticsAndReports from './pages/analytics-and-reports';
import ApprovalWorkflow from './pages/approval-workflow';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/company-registration" element={<CompanyRegistration />} />
        
        {/* Protected routes with role-based access */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager-dashboard" 
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee-dashboard" 
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics-and-reports" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <AnalyticsAndReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/approval-workflow" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
              <ApprovalWorkflow />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
