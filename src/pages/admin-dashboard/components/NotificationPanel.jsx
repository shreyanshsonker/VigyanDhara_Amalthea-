import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = ({ notifications, onMarkAsRead, onViewAll }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approval':
        return 'CheckCircle';
      case 'rejection':
        return 'XCircle';
      case 'submission':
        return 'FileText';
      case 'system':
        return 'Settings';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'approval':
        return 'text-success';
      case 'rejection':
        return 'text-error';
      case 'submission':
        return 'text-primary';
      case 'system':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          iconName="ExternalLink"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications?.map((notification) => (
              <div
                key={notification?.id}
                className={`p-4 hover:bg-muted/50 transition-colors duration-200 cursor-pointer ${
                  !notification?.read ? 'bg-muted/30' : ''
                }`}
                onClick={() => onMarkAsRead(notification?.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${getNotificationColor(notification?.type)}`}>
                    <Icon name={getNotificationIcon(notification?.type)} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        !notification?.read ? 'text-card-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification?.title}
                      </p>
                      {!notification?.read && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification?.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification?.timestamp)}
                      </p>
                      {notification?.actionRequired && (
                        <span className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded-full">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      {notifications?.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => notifications?.forEach(n => !n?.read && onMarkAsRead(n?.id))}
            className="text-center"
          >
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;