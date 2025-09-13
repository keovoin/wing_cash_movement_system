import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const UserProfileDropdown = ({ user, onProfileAction, onLogout, isOpen, onToggle }) => {
  const [activeSection, setActiveSection] = useState(null);

  const profileSections = [
    {
      id: 'account',
      label: 'Account',
      items: [
        { id: 'profile', label: 'Profile Settings', icon: 'User', description: 'Update your personal information' },
        { id: 'security', label: 'Security', icon: 'Shield', description: 'Password and security settings' },
        { id: 'preferences', label: 'Preferences', icon: 'Settings', description: 'Customize your experience' }
      ]
    },
    {
      id: 'support',
      label: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: 'HelpCircle', description: 'Get help and support' },
        { id: 'feedback', label: 'Send Feedback', icon: 'MessageSquare', description: 'Share your thoughts' },
        { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: 'Keyboard', description: 'View available shortcuts' }
      ]
    }
  ];

  const handleItemClick = (itemId) => {
    if (itemId === 'logout') {
      onLogout?.();
    } else {
      onProfileAction?.(itemId);
    }
    onToggle?.();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()?.slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-error';
      default: return 'bg-muted-foreground';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in">
      {/* User Info Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">
              {getInitials(user?.name)}
            </div>
            {user?.status && (
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${getStatusColor(user?.status)} rounded-full border-2 border-popover`} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-popover-foreground truncate">
              {user?.name || 'User Name'}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'user@wingbank.com'}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user?.role || 'Staff'}
              </span>
              {user?.department && (
                <span className="text-xs text-muted-foreground">
                  {user?.department}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {user?.sessionInfo && (
          <div className="mt-3 p-2 bg-muted/50 rounded-md">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Session expires in</span>
              <span className="font-mono">{user?.sessionInfo?.timeRemaining}</span>
            </div>
            {user?.sessionInfo?.location && (
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>Location</span>
                <span>{user?.sessionInfo?.location}</span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="p-2 border-b border-border">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => handleItemClick('profile')}
            className="flex flex-col items-center p-3 rounded-md hover:bg-muted transition-colors duration-150"
          >
            <Icon name="User" size={20} className="text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Profile</span>
          </button>
          <button
            onClick={() => handleItemClick('preferences')}
            className="flex flex-col items-center p-3 rounded-md hover:bg-muted transition-colors duration-150"
          >
            <Icon name="Settings" size={20} className="text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Settings</span>
          </button>
          <button
            onClick={() => handleItemClick('help')}
            className="flex flex-col items-center p-3 rounded-md hover:bg-muted transition-colors duration-150"
          >
            <Icon name="HelpCircle" size={20} className="text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Help</span>
          </button>
        </div>
      </div>
      {/* Menu Sections */}
      <div className="py-2">
        {profileSections?.map((section) => (
          <div key={section?.id} className="mb-2 last:mb-0">
            <div className="px-4 py-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {section?.label}
              </h4>
            </div>
            <div className="space-y-1 px-2">
              {section?.items?.map((item) => (
                <button
                  key={item?.id}
                  onClick={() => handleItemClick(item?.id)}
                  className="w-full flex items-center space-x-3 px-2 py-2 rounded-md text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                >
                  <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item?.label}</div>
                    {item?.description && (
                      <div className="text-xs text-muted-foreground">{item?.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Delegation Status */}
      {user?.delegation && (
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2">
            <Icon name="UserCheck" size={16} className="text-accent" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-popover-foreground">
                Acting as {user?.delegation?.role}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Delegated by {user?.delegation?.delegatedBy}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleItemClick('delegation')}
              className="text-xs"
            >
              Manage
            </Button>
          </div>
        </div>
      )}
      {/* Footer Actions */}
      <div className="p-2 border-t border-border">
        <div className="space-y-1">
          <button
            onClick={() => handleItemClick('activity')}
            className="w-full flex items-center space-x-3 px-2 py-2 rounded-md text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
          >
            <Icon name="Activity" size={16} className="text-muted-foreground" />
            <span>Activity Log</span>
          </button>
          <button
            onClick={() => handleItemClick('logout')}
            className="w-full flex items-center space-x-3 px-2 py-2 rounded-md text-sm text-error hover:bg-error/10 transition-colors duration-150"
          >
            <Icon name="LogOut" size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDropdown;