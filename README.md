# Expense Management System - Django Backend

A comprehensive Django REST API backend for the expense management system with advanced features including JWT authentication, approval workflows, analytics, and notifications.

## Features

- **User Management**: Custom user model with roles (Admin, Manager, Employee)
- **Company Management**: Multi-tenant support with company-specific settings
- **Expense Management**: Complete expense lifecycle with receipt handling
- **Approval Workflows**: Configurable approval rules and workflows
- **Notifications**: Real-time notifications with multiple delivery methods
- **Analytics**: Comprehensive reporting and analytics dashboard
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Receipt and document management
- **API Documentation**: Auto-generated API documentation

## Project Structure

```
backend/
├── expense_management/          # Django project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/                        # Django applications
│   ├── accounts/               # User management
│   ├── companies/              # Company and organization management
│   ├── expenses/               # Expense management
│   ├── approvals/              # Approval workflows
│   ├── notifications/          # Notification system
│   └── analytics/              # Analytics and reporting
├── manage.py
├── requirements.txt
└── README.md
```

## Installation

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Redis (for Celery)
- Node.js (for frontend)

### Setup

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE expense_management;
   CREATE USER expense_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE expense_management TO expense_user;
   ```

6. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Load initial data (optional)**
   ```bash
   python manage.py loaddata initial_data.json
   ```

9. **Start the development server**
   ```bash
   python manage.py runserver
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings
DB_NAME=expense_management
DB_USER=expense_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Email Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Celery Settings
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/change-password/` - Change password
- `POST /api/auth/password-reset-request/` - Request password reset
- `POST /api/auth/password-reset-confirm/` - Confirm password reset

### Users
- `GET /api/auth/users/` - List users
- `POST /api/auth/users/` - Create user
- `GET /api/auth/users/{id}/` - Get user details
- `PUT /api/auth/users/{id}/` - Update user
- `DELETE /api/auth/users/{id}/` - Delete user
- `GET /api/auth/profile/` - Get current user profile
- `PUT /api/auth/profile/` - Update current user profile

### Companies
- `GET /api/companies/` - List companies
- `POST /api/companies/` - Create company
- `GET /api/companies/{id}/` - Get company details
- `PUT /api/companies/{id}/` - Update company
- `GET /api/companies/settings/` - Get company settings
- `PUT /api/companies/settings/` - Update company settings

### Expenses
- `GET /api/expenses/` - List expenses
- `POST /api/expenses/` - Create expense
- `GET /api/expenses/{id}/` - Get expense details
- `PUT /api/expenses/{id}/` - Update expense
- `DELETE /api/expenses/{id}/` - Delete expense
- `POST /api/expenses/submit/` - Submit expense for approval

### Approvals
- `GET /api/approvals/workflows/` - List approval workflows
- `POST /api/approvals/workflows/` - Create approval workflow
- `GET /api/approvals/workflows/{id}/` - Get workflow details
- `PUT /api/approvals/workflows/{id}/` - Update workflow
- `POST /api/approvals/bulk/` - Bulk approval operations

### Notifications
- `GET /api/notifications/` - List notifications
- `GET /api/notifications/{id}/` - Get notification details
- `POST /api/notifications/mark-read/` - Mark notifications as read
- `GET /api/notifications/preferences/` - Get notification preferences
- `PUT /api/notifications/preferences/` - Update notification preferences

### Analytics
- `GET /api/analytics/expenses/` - Expense analytics
- `GET /api/analytics/categories/` - Category analytics
- `GET /api/analytics/employees/` - Employee analytics
- `GET /api/analytics/approvals/` - Approval analytics
- `GET /api/analytics/dashboard/` - Dashboard data
- `GET /api/analytics/reports/` - List reports
- `POST /api/analytics/reports/generate/` - Generate report

## Database Models

### Core Models
- **User**: Custom user model with roles and company association
- **Company**: Organization/company information
- **Expense**: Individual expense records
- **ApprovalWorkflow**: Approval process steps
- **Notification**: System notifications

### Supporting Models
- **UserProfile**: Extended user information
- **CompanySettings**: Company-specific configurations
- **Department**: Organizational departments
- **ExpenseCategory**: Expense categorization
- **ApprovalRule**: Automated approval rules
- **ExpenseReceipt**: Receipt attachments
- **ExpenseComment**: Comments on expenses

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Permissions

- **Admin**: Full access to all resources
- **Manager**: Access to team expenses and approvals
- **Employee**: Access to own expenses and basic company info

## File Uploads

Receipts and documents are stored in the `media/` directory. Configure your web server to serve media files in production.

## Celery Tasks

Background tasks for:
- Email notifications
- Report generation
- Analytics calculations
- File processing

Start Celery worker:
```bash
celery -A expense_management worker -l info
```

## Testing

Run tests:
```bash
python manage.py test
```

## Production Deployment

1. Set `DEBUG=False` in settings
2. Configure proper database and Redis
3. Set up static file serving
4. Configure email settings
5. Set up SSL certificates
6. Configure CORS for your frontend domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
