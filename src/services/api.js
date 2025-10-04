import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fallback API for when Django server is not available
const fallbackApi = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password, companyId, role) => {
    try {
      // Ensure company ID is an integer
      const companyIdInt = parseInt(companyId, 10);
      
      // Validate that companyId is a valid number
      if (isNaN(companyIdInt)) {
        throw new Error('Invalid company selection');
      }
      
      // Log the data being sent for debugging
      console.log('Sending login request with data:', { 
        email, 
        password, 
        company_id: companyIdInt,
        role 
      });
      
      const response = await api.post('/auth/login/', { 
        email, 
        password, 
        company_id: companyIdInt,
        role: role
      });
      return response.data;
    } catch (error) {
      console.error('Django API failed, trying fallback:', error);
      try {
        // Ensure company ID is an integer
        const companyIdInt = parseInt(companyId, 10);
        
        // Validate that companyId is a valid number
        if (isNaN(companyIdInt)) {
          throw new Error('Invalid company selection');
        }
        
        const response = await fallbackApi.post('/auth/login/', { 
          email, 
          password, 
          company_id: companyIdInt,
          role: role
        });
        return response.data;
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        // Re-throw the original error to preserve error details
        throw error;
      }
    }
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/users/', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },
  
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword
    });
    return response.data;
  }
};

// Expenses API
export const expensesAPI = {
  getExpenses: async (params = {}) => {
    const response = await api.get('/expenses/', { params });
    return response.data;
  },
  
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses/', expenseData);
    return response.data;
  },
  
  updateExpense: async (id, expenseData) => {
    const response = await api.patch(`/expenses/${id}/`, expenseData);
    return response.data;
  },
  
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}/`);
    return response.data;
  },
  
  getExpense: async (id) => {
    const response = await api.get(`/expenses/${id}/`);
    return response.data;
  }
};

// Approvals API
export const approvalsAPI = {
  getPendingApprovals: async () => {
    const response = await api.get('/approvals/');
    return response.data;
  },
  
  approveExpense: async (id, data) => {
    const response = await api.post(`/approvals/${id}/approve/`, data);
    return response.data;
  },
  
  rejectExpense: async (id, data) => {
    const response = await api.post(`/approvals/${id}/reject/`, data);
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  getExpenseAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/expenses/', { params });
    return response.data;
  },
  
  getTeamAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/team/', { params });
    return response.data;
  }
};

// Companies API
export const companiesAPI = {
  getCompany: async () => {
    const response = await api.get('/companies/');
    return response.data;
  },
  
  updateCompany: async (companyData) => {
    const response = await api.patch('/companies/', companyData);
    return response.data;
  },
  
  createCompany: async (companyData) => {
    const response = await api.post('/companies/', companyData);
    return response.data;
  },
  
  getCompaniesForLogin: async () => {
    // Static fallback data that always works
    const fallbackCompanies = [
      {
        id: 1,
        name: "TechCorp Solutions",
        slug: "techcorp-solutions"
      },
      {
        id: 2,
        name: "FinanceFirst Inc",
        slug: "financefirst-inc"
      },
      {
        id: 3,
        name: "Global Manufacturing Co",
        slug: "global-manufacturing-co"
      }
    ];

    try {
      const response = await api.get('/companies/login/companies/');
      return response.data;
    } catch (error) {
      console.error('Django API failed, trying fallback:', error);
      try {
        const response = await fallbackApi.get('/companies/login/companies/');
        return response.data;
      } catch (fallbackError) {
        console.error('Fallback API also failed, using static data:', fallbackError);
        return fallbackCompanies;
      }
    }
  },
  
  getCompanyUsers: async (companyId) => {
    // Static fallback data based on company
    const getFallbackUsers = (companyId) => {
      const companyNames = {
        1: "techcorp",
        2: "financefirst", 
        3: "globalmfg"
      };
      const companyName = companyNames[companyId] || "company";
      
      return [
        {
          id: 1,
          email: `admin@${companyName}.com`,
          first_name: "Admin",
          last_name: "User",
          role: "admin"
        },
        {
          id: 2,
          email: `manager@${companyName}.com`,
          first_name: "Manager",
          last_name: "User",
          role: "manager"
        },
        {
          id: 3,
          email: `employee@${companyName}.com`,
          first_name: "Employee",
          last_name: "User",
          role: "employee"
        }
      ];
    };

    try {
      const response = await api.get(`/companies/login/companies/${companyId}/users/`);
      return response.data;
    } catch (error) {
      console.error('Django API failed, trying fallback:', error);
      try {
        const response = await fallbackApi.get(`/companies/login/companies/${companyId}/users/`);
        return response.data;
      } catch (fallbackError) {
        console.error('Fallback API also failed, using static data:', fallbackError);
        return getFallbackUsers(companyId);
      }
    }
  }
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async () => {
    const response = await api.get('/notifications/');
    return response.data;
  },
  
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/`, { is_read: true });
    return response.data;
  }
};

export default api;