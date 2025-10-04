const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Mock data
const companies = [
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

const users = {
  1: [ // TechCorp users
    { id: 1, email: "admin@techcorp.com", first_name: "John", last_name: "Admin", role: "admin" },
    { id: 2, email: "manager@techcorp.com", first_name: "Sarah", last_name: "Manager", role: "manager" },
    { id: 3, email: "employee1@techcorp.com", first_name: "Mike", last_name: "Employee", role: "employee" },
    { id: 4, email: "employee2@techcorp.com", first_name: "Lisa", last_name: "Developer", role: "employee" }
  ],
  2: [ // FinanceFirst users
    { id: 5, email: "admin@financefirst.com", first_name: "Robert", last_name: "Admin", role: "admin" },
    { id: 6, email: "manager@financefirst.com", first_name: "Jennifer", last_name: "Manager", role: "manager" },
    { id: 7, email: "employee1@financefirst.com", first_name: "David", last_name: "Analyst", role: "employee" },
    { id: 8, email: "employee2@financefirst.com", first_name: "Emily", last_name: "Consultant", role: "employee" }
  ],
  3: [ // Global Manufacturing users
    { id: 9, email: "admin@globalmfg.com", first_name: "Michael", last_name: "Admin", role: "admin" },
    { id: 10, email: "manager@globalmfg.com", first_name: "Patricia", last_name: "Manager", role: "manager" },
    { id: 11, email: "employee1@globalmfg.com", first_name: "James", last_name: "Engineer", role: "employee" },
    { id: 12, email: "employee2@globalmfg.com", first_name: "Maria", last_name: "Technician", role: "employee" }
  ]
};

// Routes
app.get('/api/companies/login/companies/', (req, res) => {
  console.log('GET /api/companies/login/companies/');
  res.json(companies);
});

app.get('/api/companies/login/companies/:companyId/users/', (req, res) => {
  const companyId = parseInt(req.params.companyId);
  console.log(`GET /api/companies/login/companies/${companyId}/users/`);
  
  if (users[companyId]) {
    res.json(users[companyId]);
  } else {
    res.status(404).json({ error: 'Company not found' });
  }
});

app.post('/api/auth/login/', (req, res) => {
  const { email, password, company_id, role } = req.body;
  console.log('POST /api/auth/login/', { email, company_id, role });
  
  // Find user
  const companyUsers = users[company_id] || [];
  const user = companyUsers.find(u => u.email === email && u.role === role);
  
  // Check password based on role
  let validPassword = false;
  if (user) {
    if (user.role === 'admin' && password === 'admin123') {
      validPassword = true;
    } else if (user.role === 'manager' && password === 'manager123') {
      validPassword = true;
    } else if (user.role === 'employee' && password === 'employee123') {
      validPassword = true;
    }
  }
  
  if (user && validPassword) {
    // Mock successful login
    res.json({
      user: {
        ...user,
        company: company_id
      },
      tokens: {
        access: 'mock_access_token_' + Date.now(),
        refresh: 'mock_refresh_token_' + Date.now()
      }
    });
  } else {
    res.status(400).json({ 
      detail: 'Invalid credentials' 
    });
  }
});

app.post('/api/companies/', (req, res) => {
  const companyData = req.body;
  console.log('POST /api/companies/', companyData);
  
  const newCompany = {
    id: companies.length + 1,
    name: companyData.name,
    slug: companyData.name.toLowerCase().replace(/\s+/g, '-')
  };
  
  companies.push(newCompany);
  res.json(newCompany);
});

app.post('/api/auth/users/', (req, res) => {
  const userData = req.body;
  console.log('POST /api/auth/users/', userData);
  
  const newUser = {
    id: Date.now(),
    email: userData.email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    role: userData.role,
    company: userData.company
  };
  
  res.json(newUser);
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/companies/login/companies/');
  console.log('  GET  /api/companies/login/companies/:id/users/');
  console.log('  POST /api/auth/login/');
  console.log('  POST /api/companies/');
  console.log('  POST /api/auth/users/');
});
