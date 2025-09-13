import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationStatusPanel = () => {
  const [connectionStatus, setConnectionStatus] = useState({});
  const [lastSync, setLastSync] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const integrationSystems = [
    {
      id: 'wing_mc',
      name: 'Wing MC Core Banking',
      description: 'Primary banking system integration',
      status: 'connected',
      lastSync: new Date(Date.now() - 120000), // 2 minutes ago
      version: 'v2.4.1',
      critical: true
    },
    {
      id: 'regulatory_db',
      name: 'Regulatory Reporting DB',
      description: 'NBC compliance database',
      status: 'connected',
      lastSync: new Date(Date.now() - 300000), // 5 minutes ago
      version: 'v1.8.3',
      critical: true
    },
    {
      id: 'document_mgmt',
      name: 'Document Management',
      description: 'Secure document storage system',
      status: 'connected',
      lastSync: new Date(Date.now() - 180000), // 3 minutes ago
      version: 'v3.1.0',
      critical: false
    },
    {
      id: 'notification_gateway',
      name: 'Notification Gateway',
      description: 'Email and SMS notification service',
      status: 'warning',
      lastSync: new Date(Date.now() - 900000), // 15 minutes ago
      version: 'v2.0.5',
      critical: false,
      message: 'High latency detected'
    },
    {
      id: 'audit_system',
      name: 'Audit Trail System',
      description: 'Transaction logging and audit',
      status: 'connected',
      lastSync: new Date(Date.now() - 60000), // 1 minute ago
      version: 'v1.5.2',
      critical: true
    },
    {
      id: 'ldap_auth',
      name: 'LDAP Authentication',
      description: 'User authentication service',
      status: 'error',
      lastSync: new Date(Date.now() - 1800000), // 30 minutes ago
      version: 'v4.2.1',
      critical: true,
      message: 'Connection timeout - using cached credentials'
    }
  ];

  const systemMetrics = {
    totalRequests: 1247,
    successfulRequests: 1198,
    failedRequests: 49,
    averageResponseTime: '245ms',
    uptime: '99.2%',
    lastIncident: new Date(Date.now() - 86400000 * 3) // 3 days ago
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'disconnected': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'connected': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-error/10';
      case 'disconnected': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle2';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'disconnected': return 'Circle';
      default: return 'Circle';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastSync(new Date());
    setIsRefreshing(false);
  };

  const criticalIssues = integrationSystems?.filter(system => 
    system?.critical && (system?.status === 'error' || system?.status === 'warning')
  );

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Activity" size={20} className="mr-2" />
            System Health
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshStatus}
            loading={isRefreshing}
            iconName="RefreshCw"
          >
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-success">
              {systemMetrics?.uptime}
            </div>
            <div className="text-xs text-muted-foreground">System Uptime</div>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {systemMetrics?.averageResponseTime}
            </div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Last updated: {formatTimeAgo(lastSync)}
        </div>
      </div>
      {/* Critical Issues Alert */}
      {criticalIssues?.length > 0 && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="AlertTriangle" size={20} className="text-error" />
            <h3 className="text-sm font-semibold text-error">
              Critical System Issues ({criticalIssues?.length})
            </h3>
          </div>
          
          <div className="space-y-2">
            {criticalIssues?.map((system) => (
              <div key={system?.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{system?.name}</span>
                <span className="text-error">{system?.message || system?.status}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-error/20">
            <p className="text-xs text-muted-foreground">
              Some features may be limited. Contact IT support if issues persist.
            </p>
          </div>
        </div>
      )}
      {/* Integration Systems Status */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={20} className="mr-2" />
          Integration Status
        </h3>
        
        <div className="space-y-3">
          {integrationSystems?.map((system) => (
            <div key={system?.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${getStatusBg(system?.status)}`}>
                <div className={`w-full h-full rounded-full ${getStatusColor(system?.status)} flex items-center justify-center`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground flex items-center">
                      {system?.name}
                      {system?.critical && (
                        <span className="ml-2 px-1.5 py-0.5 bg-error/10 text-error text-xs rounded">
                          Critical
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{system?.description}</p>
                    {system?.message && (
                      <p className={`text-xs mt-1 ${getStatusColor(system?.status)}`}>
                        {system?.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xs font-medium ${getStatusColor(system?.status)}`}>
                      {system?.status?.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(system?.lastSync)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {system?.version}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Performance Metrics */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Performance Metrics
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Requests (24h)</span>
            <span className="text-sm font-medium text-foreground">
              {systemMetrics?.totalRequests?.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Success Rate</span>
            <span className="text-sm font-medium text-success">
              {((systemMetrics?.successfulRequests / systemMetrics?.totalRequests) * 100)?.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Failed Requests</span>
            <span className="text-sm font-medium text-error">
              {systemMetrics?.failedRequests}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Incident</span>
            <span className="text-sm font-medium text-muted-foreground">
              {formatTimeAgo(systemMetrics?.lastIncident)}
            </span>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Settings" size={20} className="mr-2" />
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <Icon name="TestTube" size={16} className="mr-2" />
            Test Connections
          </Button>
          
          <Button variant="outline" size="sm" className="justify-start">
            <Icon name="Download" size={16} className="mr-2" />
            Download Logs
          </Button>
          
          <Button variant="outline" size="sm" className="justify-start">
            <Icon name="AlertCircle" size={16} className="mr-2" />
            Report Issue
          </Button>
          
          <Button variant="outline" size="sm" className="justify-start">
            <Icon name="HelpCircle" size={16} className="mr-2" />
            System Documentation
          </Button>
        </div>
      </div>
      {/* Connection Health Indicator */}
      <div className="bg-muted/30 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              All Critical Systems Operational
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Real-time monitoring active
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationStatusPanel;