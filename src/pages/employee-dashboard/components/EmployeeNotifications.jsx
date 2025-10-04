import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmployeeNotifications = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    const iconMap = {
      approval: 'CheckCircle',
      rejection: 'XCircle',
      comment: 'MessageSquare',
      reminder: 'Clock',
      system: 'Bell'
    };
    return iconMap[type] || 'Bell';
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      approval: 'text-success',
      rejection: 'text-error',
      comment: 'text-primary',
      reminder: 'text-warning',
      system: 'text-muted-foreground'
    };
    return colorMap[type] || 'text-muted-foreground';
  };

  const getNotificationBgColor = (type) => {
    const bgColorMap = {
      approval: 'bg-success/10 border-success/20',
      rejection: 'bg-error/10 border-error/20',
      comment: 'bg-primary/10 border-primary/20',
      reminder: 'bg-warning/10 border-warning/20',
      system: 'bg-muted/10 border-muted/20'
    };
    return bgColorMap[type] || 'bg-muted/10 border-muted/20';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    // Handle notification action (e.g., navigate to expense details)
    console.log('Notification clicked:', notification);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              iconName="Check"
              iconPosition="left"
            >
              Mark All as Read
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Stay updated with your expense approvals, rejections, and comments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-foreground">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-border rounded-md text-sm bg-background"
          >
            <option value="all">All ({notifications.length})</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="approval">Approvals</option>
            <option value="rejection">Rejections</option>
            <option value="comment">Comments</option>
            <option value="reminder">Reminders</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? "You don't have any notifications yet."
                : `No ${filter} notifications found.`
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-background border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-primary/50 ${
                notification.isRead 
                  ? 'border-border' 
                  : 'border-primary/30 bg-primary/5'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getNotificationBgColor(notification.type)}`}>
                  <Icon 
                    name={getNotificationIcon(notification.type)} 
                    size={20} 
                    className={getNotificationColor(notification.type)} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${notification.isRead ? 'text-foreground' : 'text-foreground'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.timestamp)}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 mt-3">
                    {notification.type === 'rejection' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Resubmit expense');
                        }}
                        iconName="RefreshCw"
                        iconPosition="left"
                      >
                        Resubmit
                      </Button>
                    )}
                    
                    {notification.type === 'comment' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View comments');
                        }}
                        iconName="MessageSquare"
                        iconPosition="left"
                      >
                        View Comments
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('View expense details');
                      }}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <div className="mt-8 bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Notification Settings</h3>
            <p className="text-sm text-muted-foreground">
              Manage your notification preferences
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Open notification settings')}
            iconName="Settings"
            iconPosition="left"
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeNotifications;
