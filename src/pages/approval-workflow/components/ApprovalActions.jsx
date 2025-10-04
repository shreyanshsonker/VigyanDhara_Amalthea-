import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ApprovalActions = ({ 
  expense, 
  userRole, 
  onApprove, 
  onReject, 
  onOverride, 
  canOverride = false 
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(expense?.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectComment?.trim()) return;
    
    setIsProcessing(true);
    try {
      await onReject(expense?.id, rejectComment?.trim());
      setRejectComment('');
      setShowRejectForm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOverride = async () => {
    if (!overrideReason?.trim()) return;
    
    setIsProcessing(true);
    try {
      await onOverride(expense?.id, overrideReason?.trim());
      setOverrideReason('');
      setShowOverrideForm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const canApprove = expense?.status === 'pending' && (userRole === 'manager' || userRole === 'admin');
  const canReject = expense?.status === 'pending' && (userRole === 'manager' || userRole === 'admin');

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">Approval Actions</h3>
      {/* Current Status Info */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-card-foreground">Current Status</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {expense?.status === 'pending' 
            ? `This expense is awaiting approval. Amount: $${expense?.amount}`
            : `This expense has been ${expense?.status}.`
          }
        </p>
        {expense?.status === 'pending' && (
          <p className="text-xs text-muted-foreground mt-1">
            Submitted {new Date(expense.submittedAt)?.toLocaleDateString()} by {expense?.employee?.name}
          </p>
        )}
      </div>
      {/* Primary Actions */}
      {canApprove && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={handleApprove}
              loading={isProcessing}
              disabled={isProcessing}
              iconName="CheckCircle"
              iconPosition="left"
              className="flex-1 bg-success hover:bg-success/90 text-white"
            >
              Approve Expense
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowRejectForm(!showRejectForm)}
              disabled={isProcessing}
              iconName="XCircle"
              iconPosition="left"
              className="flex-1 border-error text-error hover:bg-error hover:text-white"
            >
              Reject Expense
            </Button>
          </div>

          {/* Reject Form */}
          {showRejectForm && (
            <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
              <h4 className="text-sm font-medium text-error mb-3">Rejection Reason</h4>
              <Input
                type="text"
                placeholder="Please provide a reason for rejection..."
                value={rejectComment}
                onChange={(e) => setRejectComment(e?.target?.value)}
                className="mb-3"
                required
              />
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectComment('');
                  }}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReject}
                  loading={isProcessing}
                  disabled={!rejectComment?.trim() || isProcessing}
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Override Actions (Admin Only) */}
      {canOverride && userRole === 'admin' && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Shield" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Administrator Override</span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowOverrideForm(!showOverrideForm)}
            disabled={isProcessing}
            iconName="ShieldCheck"
            iconPosition="left"
            className="border-warning text-warning hover:bg-warning hover:text-white"
          >
            Override Decision
          </Button>

          {/* Override Form */}
          {showOverrideForm && (
            <div className="mt-4 p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <h4 className="text-sm font-medium text-warning mb-3">Override Justification</h4>
              <Input
                type="text"
                placeholder="Please provide justification for override..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e?.target?.value)}
                className="mb-3"
                required
              />
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowOverrideForm(false);
                    setOverrideReason('');
                  }}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={handleOverride}
                  loading={isProcessing}
                  disabled={!overrideReason?.trim() || isProcessing}
                >
                  Confirm Override
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Action History */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Recent Actions</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Submitted</span>
            <span className="text-card-foreground">{new Date(expense.submittedAt)?.toLocaleDateString()}</span>
          </div>
          {expense?.reviewedAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Reviewed</span>
              <span className="text-card-foreground">{new Date(expense.reviewedAt)?.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="MessageCircle"
            iconPosition="left"
            onClick={() => console.log('Request more info')}
          >
            Request Info
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Download receipt')}
          >
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="History"
            iconPosition="left"
            onClick={() => console.log('View history')}
          >
            View History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalActions;