import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationBell = ({ 
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sample notifications for demo
  const defaultNotifications = [
    {
      id: 1,
      title: 'Expense Approved',
      message: 'Your expense report for $124.50 has been approved',
      time: '2 minutes ago',
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'New Expense Submitted',
      message: 'John Doe submitted an expense for review',
      time: '1 hour ago',
      type: 'info',
      read: false
    },
    {
      id: 3,
      title: 'Report Generated',
      message: 'Monthly expense report is ready for download',
      time: '3 hours ago',
      type: 'info',
      read: true
    },
    {
      id: 4,
      title: 'Expense Rejected',
      message: 'Expense report requires additional documentation',
      time: '1 day ago',
      type: 'warning',
      read: true
    }
  ];

  const currentNotifications = notifications?.length > 0 ? notifications : defaultNotifications;
  const currentUnreadCount = unreadCount > 0 ? unreadCount : currentNotifications?.filter(n => !n?.read)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    if (!notification?.read && onMarkAsRead) {
      onMarkAsRead(notification?.id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover-scale"
      >
        <Icon name="Bell" size={20} />
        {currentUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {currentUnreadCount > 9 ? '9+' : currentUnreadCount}
          </span>
        )}
      </Button>
      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal z-20 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-popover-foreground">Notifications</h3>
            {currentUnreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {currentNotifications?.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {currentNotifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer hover:bg-muted transition-colors duration-200 ${
                      !notification?.read ? 'bg-muted/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 ${getNotificationColor(notification?.type)}`}>
                        <Icon name={getNotificationIcon(notification?.type)} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification?.read ? 'text-popover-foreground' : 'text-muted-foreground'
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
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification?.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {currentNotifications?.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to notifications page
                }}
                className="text-center"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;