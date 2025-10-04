import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ApprovalTimeline = ({ workflow, currentStage }) => {
  const getStageStatus = (stage, index) => {
    if (index < currentStage) return 'completed';
    if (index === currentStage) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'current':
        return 'Clock';
      case 'pending':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success';
      case 'current':
        return 'text-warning bg-warning';
      case 'pending':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Approval Timeline</h3>
        <div className="text-sm text-muted-foreground">
          Stage {currentStage + 1} of {workflow?.length}
        </div>
      </div>
      <div className="space-y-6">
        {workflow?.map((stage, index) => {
          const status = getStageStatus(stage, index);
          const isLast = index === workflow?.length - 1;

          return (
            <div key={index} className="relative">
              {/* Timeline Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
              )}
              <div className="flex items-start space-x-4">
                {/* Status Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  status === 'completed' ? 'bg-success text-white' :
                  status === 'current'? 'bg-warning text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={getStatusIcon(status)} size={20} />
                </div>

                {/* Stage Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-card-foreground">
                        {stage?.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stage?.description}
                      </p>
                    </div>
                    
                    {stage?.completedAt && (
                      <div className="text-xs text-muted-foreground">
                        {formatDate(stage?.completedAt)}
                      </div>
                    )}
                  </div>

                  {/* Approver Info */}
                  {stage?.approver && (
                    <div className="flex items-center space-x-2 mt-3">
                      <Image
                        src={stage?.approver?.avatar}
                        alt={stage?.approver?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-card-foreground">
                        {stage?.approver?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({stage?.approver?.role})
                      </span>
                    </div>
                  )}

                  {/* Stage Comment */}
                  {stage?.comment && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-card-foreground">{stage?.comment}</p>
                    </div>
                  )}

                  {/* Current Stage Actions */}
                  {status === 'current' && (
                    <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={16} className="text-primary" />
                        <span className="text-sm font-medium text-primary">
                          Awaiting approval from {stage?.approver?.name || 'approver'}
                        </span>
                      </div>
                      {stage?.dueDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {formatDate(stage?.dueDate)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Progress Bar */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentStage) / workflow?.length) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentStage) / workflow?.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ApprovalTimeline;