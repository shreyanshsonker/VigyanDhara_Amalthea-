import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import WorkflowHeader from '../../components/ui/WorkflowHeader';

import ExpenseDetailsCard from './components/ExpenseDetailsCard';
import ApprovalTimeline from './components/ApprovalTimeline';
import CommentHistory from './components/CommentHistory';
import ApprovalActions from './components/ApprovalActions';
import SmartApprovalRules from './components/SmartApprovalRules';
import EmployeeContext from './components/EmployeeContext';
import ImageZoomModal from './components/ImageZoomModal';

const ApprovalWorkflow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentExpense, setCurrentExpense] = useState(null);
  const [comments, setComments] = useState([]);
  const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState('');
  const [userRole, setUserRole] = useState('manager');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for expense details
  const mockExpense = {
    id: "EXP-2024-001",
    amount: 124.50,
    currency: "USD",
    category: "Travel",
    description: "Business lunch with client - discussing Q4 partnership opportunities and contract negotiations",
    date: "2024-10-01",
    submittedAt: "2024-10-01T14:30:00Z",
    reviewedAt: "2024-10-02T09:15:00Z",
    status: "pending",
    receipt: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
    employee: {
      id: "EMP-001",
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      department: "Sales",
      role: "Senior Sales Manager",
      joinDate: "2022-03-15"
    },
    paymentMethod: "Corporate Credit Card",
    projectCode: "PROJ-2024-Q4",
    location: "New York, NY",
    merchant: "The Business Bistro",
    taxAmount: 12.45
  };

  // Mock workflow data
  const mockWorkflow = [
    {
      title: "Submitted",
      description: "Expense submitted by employee",
      approver: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        role: "Employee"
      },
      completedAt: "2024-10-01T14:30:00Z",
      comment: "Business lunch expense with receipt attached"
    },
    {
      title: "Manager Review",
      description: "Awaiting manager approval",
      approver: {
        name: "Michael Rodriguez",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        role: "Manager"
      },
      completedAt: null,
      comment: null,
      dueDate: "2024-10-05T17:00:00Z"
    },
    {
      title: "Finance Review",
      description: "Finance team final approval",
      approver: {
        name: "Jennifer Chen",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        role: "Finance Manager"
      },
      completedAt: null,
      comment: null
    }
  ];

  // Mock comments data
  const mockComments = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        role: "Employee"
      },
      content: "This was a business lunch with our potential Q4 partner. We discussed contract terms and partnership opportunities. The receipt is attached for verification.",
      type: "request",
      timestamp: "2024-10-01T14:35:00Z"
    },
    {
      id: 2,
      author: {
        name: "System",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        role: "System"
      },
      content: "Expense automatically routed to manager for approval based on amount threshold rules.",
      type: "system",
      timestamp: "2024-10-01T14:31:00Z"
    }
  ];

  // Mock approval rules
  const mockApprovalRules = [
    {
      id: 1,
      name: "Amount Threshold Rule",
      description: "Expenses over $100 require manager approval",
      type: "amount_threshold",
      threshold: 100,
      approvers: ["Manager"],
      escalationTime: 48
    },
    {
      id: 2,
      name: "Travel Category Rule",
      description: "All travel expenses require additional documentation",
      type: "category_specific",
      categories: ["Travel", "Transportation"],
      approvers: ["Manager", "Finance"],
      escalationTime: 24
    },
    {
      id: 3,
      name: "Sales Department Rule",
      description: "Sales team expenses have expedited approval process",
      type: "department_specific",
      departments: ["Sales"],
      approvers: ["Manager"],
      escalationTime: 24
    }
  ];

  // Mock employee expense history
  const mockExpenseHistory = [
    {
      id: "EXP-2024-002",
      amount: 89.25,
      category: "Meals",
      status: "approved",
      date: "2024-09-28"
    },
    {
      id: "EXP-2024-003",
      amount: 156.75,
      category: "Transportation",
      status: "approved",
      date: "2024-09-25"
    },
    {
      id: "EXP-2024-004",
      amount: 45.00,
      category: "Office Supplies",
      status: "approved",
      date: "2024-09-20"
    },
    {
      id: "EXP-2024-005",
      amount: 234.50,
      category: "Travel",
      status: "rejected",
      date: "2024-09-15"
    },
    {
      id: "EXP-2024-006",
      amount: 67.80,
      category: "Meals",
      status: "approved",
      date: "2024-09-10"
    }
  ];

  // Mock spending patterns
  const mockSpendingPatterns = {
    monthlyAverage: 1250.75,
    categories: [
      { name: "Travel", amount: 450.25, percentage: 36, color: "#2563EB" },
      { name: "Meals", amount: 320.50, percentage: 26, color: "#059669" },
      { name: "Transportation", amount: 280.00, percentage: 22, color: "#F59E0B" },
      { name: "Office Supplies", amount: 200.00, percentage: 16, color: "#EF4444" }
    ]
  };

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    
    // Redirect to login if not authenticated
    if (isAuthenticated !== 'true' || !role) {
      navigate('/login');
      return;
    }
    
    setUserRole(role);
    
    // Simulate loading expense data
    const expenseId = searchParams?.get('id');
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentExpense(mockExpense);
      setComments(mockComments);
      setIsLoading(false);
    }, 1000);
  }, [searchParams, navigate]);

  const handleApprove = async (expenseId) => {
    console.log('Approving expense:', expenseId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCurrentExpense(prev => ({ ...prev, status: 'approved' }));
    
    // Add approval comment
    const approvalComment = {
      id: Date.now(),
      author: {
        name: 'Current User',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: userRole === 'admin' ? 'Administrator' : 'Manager'
      },
      content: 'Expense approved. All documentation is in order.',
      type: 'approval',
      timestamp: new Date()?.toISOString()
    };
    
    setComments(prev => [...prev, approvalComment]);
  };

  const handleReject = async (expenseId, reason) => {
    console.log('Rejecting expense:', expenseId, 'Reason:', reason);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCurrentExpense(prev => ({ ...prev, status: 'rejected' }));
    
    // Add rejection comment
    const rejectionComment = {
      id: Date.now(),
      author: {
        name: 'Current User',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: userRole === 'admin' ? 'Administrator' : 'Manager'
      },
      content: reason,
      type: 'rejection',
      timestamp: new Date()?.toISOString()
    };
    
    setComments(prev => [...prev, rejectionComment]);
  };

  const handleOverride = async (expenseId, reason) => {
    console.log('Overriding expense decision:', expenseId, 'Reason:', reason);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCurrentExpense(prev => ({ ...prev, status: 'approved' }));
    
    // Add override comment
    const overrideComment = {
      id: Date.now(),
      author: {
        name: 'Current User',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'Administrator'
      },
      content: `Administrative override: ${reason}`,
      type: 'approval',
      timestamp: new Date()?.toISOString()
    };
    
    setComments(prev => [...prev, overrideComment]);
  };

  const handleAddComment = (comment) => {
    setComments(prev => [...prev, comment]);
  };

  const handleImageZoom = (imageUrl) => {
    setZoomedImageUrl(imageUrl);
    setIsImageZoomOpen(true);
  };

  const headerActions = [
    {
      label: 'Previous',
      icon: 'ChevronLeft',
      variant: 'outline',
      onClick: () => console.log('Previous expense')
    },
    {
      label: 'Next',
      icon: 'ChevronRight',
      variant: 'outline',
      onClick: () => console.log('Next expense')
    },
    {
      label: 'Export',
      icon: 'Download',
      variant: 'ghost',
      onClick: () => console.log('Export expense details')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <WorkflowHeader userRole={userRole} actions={headerActions} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading expense details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentExpense) {
    return (
      <div className="min-h-screen bg-background">
        <WorkflowHeader userRole={userRole} actions={headerActions} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Expense Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested expense could not be found.</p>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkflowHeader userRole={userRole} actions={headerActions} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Expense Details */}
            <ExpenseDetailsCard 
              expense={currentExpense}
              onImageZoom={handleImageZoom}
            />

            {/* Approval Timeline */}
            <ApprovalTimeline 
              workflow={mockWorkflow}
              currentStage={1}
            />

            {/* Comment History */}
            <CommentHistory 
              comments={comments}
              onAddComment={handleAddComment}
            />
          </div>

          {/* Right Column - Actions & Context */}
          <div className="space-y-8">
            {/* Approval Actions */}
            <ApprovalActions
              expense={currentExpense}
              userRole={userRole}
              onApprove={handleApprove}
              onReject={handleReject}
              onOverride={handleOverride}
              canOverride={userRole === 'admin'}
            />

            {/* Smart Approval Rules */}
            <SmartApprovalRules
              expense={currentExpense}
              rules={mockApprovalRules}
              userRole={userRole}
            />

            {/* Employee Context */}
            <EmployeeContext
              employee={currentExpense?.employee}
              expenseHistory={mockExpenseHistory}
              spendingPatterns={mockSpendingPatterns}
            />
          </div>
        </div>
      </div>
      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={isImageZoomOpen}
        imageUrl={zoomedImageUrl}
        onClose={() => setIsImageZoomOpen(false)}
      />
    </div>
  );
};

export default ApprovalWorkflow;