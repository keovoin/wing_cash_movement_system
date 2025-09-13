import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ notifications = [], onNotificationClick, onMarkAsRead, onMarkAllAsRead, onClearAll }) => {
  const [filter, setFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All', icon: 'Bell' },
    { value: 'approval', label: 'Approvals', icon: 'CheckCircle' },
    { value: 'success', label: 'Success', icon: 'CheckCircle2' },
    { value: 'warning', label: 'Warnings', icon: 'AlertTriangle' },
    { value: 'error', label: 'Errors', icon: 'AlertCircle' }
  ];

  const filteredNotifications = notifications?.filter(notification => 
    filter === 'all' || notification?.type === filter
  );

  const unreadCount = notifications?.filter(n => !n?.read)?.length;
  const unreadFilteredCount = filteredNotifications?.filter(n => !n?.read)?.length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approval': return 'Clock';
      case 'success': return 'CheckCircle2';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'approval': return 'text-warning';
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-accent';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification?.read && onMarkAsRead) {
      onMarkAsRead(notification?.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead(filter === 'all' ? null : filter);
    }
  };

  return (
    <div className="w-96 bg-card border border-border rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-error text-error-foreground rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {unreadFilteredCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-muted-foreground"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 p-2 border-b border-border bg-muted/30">
        {filterOptions?.map((option) => {
          const count = option?.value === 'all' 
            ? notifications?.length 
            : notifications?.filter(n => n?.type === option?.value)?.length;
          
          return (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
                filter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={option?.icon} size={12} />
              <span>{option?.label}</span>
              {count > 0 && (
                <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full ${
                  filter === option?.value
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications?.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredNotifications?.map((notification) => (
              <div
                key={notification?.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-150 ${
                  !notification?.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 ${getNotificationColor(notification?.type)}`}>
                    <Icon name={getNotificationIcon(notification?.type)} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-sm font-medium truncate ${
                        !notification?.read ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification?.title}
                      </h4>
                      <div className="flex items-center space-x-2 ml-2">
                        {!notification?.read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {getTimeAgo(notification?.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification?.message}
                    </p>
                    
                    {notification?.metadata && (
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        {notification?.metadata?.amount && (
                          <span className="font-mono">
                            {notification?.metadata?.currency} {notification?.metadata?.amount}
                          </span>
                        )}
                        {notification?.metadata?.requestId && (
                          <span>ID: {notification?.metadata?.requestId}</span>
                        )}
                        {notification?.metadata?.priority && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            notification?.metadata?.priority === 'high' ? 'bg-error/10 text-error' :
                            notification?.metadata?.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                          }`}>
                            {notification?.metadata?.priority}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {notification?.actions && notification?.actions?.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        {notification?.actions?.map((action, index) => (
                          <Button
                            key={index}
                            variant={action?.variant || 'outline'}
                            size="sm"
                            onClick={(e) => {
                              e?.stopPropagation();
                              action?.onClick(notification);
                            }}
                            className="text-xs"
                          >
                            {action?.icon && <Icon name={action?.icon} size={12} className="mr-1" />}
                            {action?.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-sm font-medium text-foreground mb-2">No notifications</h3>
            <p className="text-xs text-muted-foreground">
              {filter === 'all' ? "You're all caught up! No new notifications."
                : `No ${filter} notifications at the moment.`
              }
            </p>
          </div>
        )}
      </div>
      {/* Footer */}
      {filteredNotifications?.length > 0 && (
        <div className="p-3 border-t border-border bg-muted/30">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;