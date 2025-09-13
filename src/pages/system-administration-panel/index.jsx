import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserManagementTab from './components/UserManagementTab';
import RoleConfigurationTab from './components/RoleConfigurationTab';
import WorkflowSettingsTab from './components/WorkflowSettingsTab';
import SystemIntegrationTab from './components/SystemIntegrationTab';
import AuditControlsTab from './components/AuditControlsTab';

const SystemAdministrationPanel = () => {
  const [activeTab, setActiveTab] = useState('user_management');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const adminTabs = [
    {
      id: 'user_management',
      label: 'User Management',
      icon: 'Users',
      description: 'Manage user accounts, roles, and permissions',
      component: UserManagementTab
    },
    {
      id: 'role_configuration',
      label: 'Role Configuration',
      icon: 'Shield',
      description: 'Configure user roles and permission matrices',
      component: RoleConfigurationTab
    },
    {
      id: 'workflow_settings',
      label: 'Workflow Settings',
      icon: 'GitBranch',
      description: 'Configure approval workflows and thresholds',
      component: WorkflowSettingsTab
    },
    {
      id: 'system_integration',
      label: 'System Integration',
      icon: 'Zap',
      description: 'Monitor and manage external system connections',
      component: SystemIntegrationTab
    },
    {
      id: 'audit_controls',
      label: 'Audit Controls',
      icon: 'FileText',
      description: 'Audit trails and compliance monitoring',
      component: AuditControlsTab
    }
  ];

  const activeTabData = adminTabs?.find(tab => tab?.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  const systemStats = [
    {
      label: 'Active Users',
      value: '156',
      change: '+12',
      changeType: 'positive',
      icon: 'Users'
    },
    {
      label: 'System Health',
      value: '98.5%',
      change: '+0.3%',
      changeType: 'positive',
      icon: 'Activity'
    },
    {
      label: 'Daily Transactions',
      value: '2,847',
      change: '+156',
      changeType: 'positive',
      icon: 'TrendingUp'
    },
    {
      label: 'Compliance Score',
      value: '96.2%',
      change: '-1.1%',
      changeType: 'negative',
      icon: 'Shield'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                  <Icon name="Settings" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">System Administration</h1>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive system management and configuration
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => console.log('Refresh system status')}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={() => console.log('Export system report')}
              >
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* System Overview Stats */}
      <div className="px-6 py-4 bg-muted/30 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {systemStats?.map((stat, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={stat?.icon} size={20} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{stat?.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat?.value}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  stat?.changeType === 'positive' ? 'text-success' : 'text-error'
                }`}>
                  {stat?.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className={`bg-card border-r border-border transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-80'
        }`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h3 className="text-sm font-semibold text-foreground">Administration Modules</h3>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Icon name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
              </Button>
            </div>
          </div>
          
          <nav className="p-2">
            {adminTabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-150 mb-1 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={sidebarCollapsed ? tab?.label : undefined}
              >
                <Icon name={tab?.icon} size={20} />
                {!sidebarCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{tab?.label}</p>
                    <p className="text-xs opacity-75 line-clamp-2">{tab?.description}</p>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-border mt-4">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="UserPlus"
                  iconPosition="left"
                  className="w-full justify-start"
                  onClick={() => console.log('Add user')}
                >
                  Add User
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                  iconPosition="left"
                  className="w-full justify-start"
                  onClick={() => console.log('System settings')}
                >
                  System Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="AlertTriangle"
                  iconPosition="left"
                  className="w-full justify-start"
                  onClick={() => console.log('View alerts')}
                >
                  View Alerts
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="p-6">
            {/* Tab Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <Icon name={activeTabData?.icon} size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">{activeTabData?.label}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{activeTabData?.description}</p>
            </div>

            {/* Tab Content */}
            <div className="bg-background">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="bg-card border-t border-border px-6 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>System Administration Panel</span>
            <span>•</span>
            <span>Last updated: {new Date()?.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Wing Bank © {new Date()?.getFullYear()}</span>
            <Button
              variant="ghost"
              size="sm"
              iconName="HelpCircle"
              onClick={() => console.log('Help')}
            >
              Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdministrationPanel;