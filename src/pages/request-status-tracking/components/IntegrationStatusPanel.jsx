import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationStatusPanel = ({ onRefresh }) => {
  const [integrationStatus, setIntegrationStatus] = useState({
    wingMC: { status: 'connected', lastSync: '2025-01-13T08:40:00Z', latency: 45 },
    emailGateway: { status: 'connected', lastSync: '2025-01-13T08:42:00Z', latency: 12 },
    documentSystem: { status: 'warning', lastSync: '2025-01-13T08:35:00Z', latency: 156 },
    ldap: { status: 'connected', lastSync: '2025-01-13T08:43:00Z', latency: 8 },
    database: { status: 'connected', lastSync: '2025-01-13T08:43:30Z', latency: 3 }
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'disconnected': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
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

  const getStatusBg = (status) => {
    switch (status) {
      case 'connected': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-error/10';
      case 'disconnected': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const formatLastSync = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  const getLatencyStatus = (latency) => {
    if (latency < 50) return 'excellent';
    if (latency < 100) return 'good';
    if (latency < 200) return 'fair';
    return 'poor';
  };

  const getLatencyColor = (latency) => {
    const status = getLatencyStatus(latency);
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-accent';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const integrationSystems = [
    {
      key: 'wingMC',
      name: 'Wing MC Core',
      description: 'Core banking system integration',
      critical: true
    },
    {
      key: 'emailGateway',
      name: 'Email Gateway',
      description: 'Notification delivery system',
      critical: false
    },
    {
      key: 'documentSystem',
      name: 'Document Management',
      description: 'File storage and retrieval',
      critical: false
    },
    {
      key: 'ldap',
      name: 'LDAP Directory',
      description: 'User authentication service',
      critical: true
    },
    {
      key: 'database',
      name: 'Database Cluster',
      description: 'Primary data storage',
      critical: true
    }
  ];

  const overallStatus = () => {
    const statuses = Object.values(integrationStatus)?.map(s => s?.status);
    if (statuses?.includes('error') || statuses?.includes('disconnected')) return 'error';
    if (statuses?.includes('warning')) return 'warning';
    return 'connected';
  };

  const criticalIssues = integrationSystems?.filter(system => 
    system?.critical && 
    (integrationStatus?.[system?.key]?.status === 'error' || integrationStatus?.[system?.key]?.status === 'disconnected')
  )?.length;

  const handleRefreshStatus = () => {
    // Simulate status refresh
    setIntegrationStatus(prev => ({
      ...prev,
      wingMC: { ...prev?.wingMC, lastSync: new Date()?.toISOString() },
      emailGateway: { ...prev?.emailGateway, lastSync: new Date()?.toISOString() },
      documentSystem: { ...prev?.documentSystem, lastSync: new Date()?.toISOString() },
      ldap: { ...prev?.ldap, lastSync: new Date()?.toISOString() },
      database: { ...prev?.database, lastSync: new Date()?.toISOString() }
    }));
    
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon 
            name={getStatusIcon(overallStatus())} 
            size={16} 
            className={getStatusColor(overallStatus())}
          />
          <h4 className="text-sm font-semibold text-foreground">System Status</h4>
          {criticalIssues > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-error text-error-foreground text-xs font-medium rounded-full">
              {criticalIssues} critical
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshStatus}
          >
            <Icon name="RefreshCw" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={12} />
          </Button>
        </div>
      </div>
      {/* Quick Status Overview */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {integrationSystems?.map(system => {
          const status = integrationStatus?.[system?.key];
          return (
            <div
              key={system?.key}
              className={`p-2 rounded-md text-center ${getStatusBg(status?.status)}`}
              title={`${system?.name}: ${status?.status}`}
            >
              <Icon 
                name={getStatusIcon(status?.status)} 
                size={12} 
                className={`mx-auto mb-1 ${getStatusColor(status?.status)}`}
              />
              <div className="text-xs font-medium text-foreground truncate">
                {system?.name?.split(' ')?.[0]}
              </div>
            </div>
          );
        })}
      </div>
      {/* Detailed Status */}
      {isExpanded && (
        <div className="space-y-3 pt-3 border-t border-border">
          {integrationSystems?.map(system => {
            const status = integrationStatus?.[system?.key];
            return (
              <div key={system?.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getStatusIcon(status?.status)} 
                    size={14} 
                    className={getStatusColor(status?.status)}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">
                        {system?.name}
                      </span>
                      {system?.critical && (
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-error/10 text-error text-xs font-medium rounded">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {system?.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-mono ${getLatencyColor(status?.latency)}`}>
                      {status?.latency}ms
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatLastSync(status?.lastSync)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* System Health Metrics */}
          <div className="pt-3 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-success">99.8%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-accent">2.3s</div>
                <div className="text-xs text-muted-foreground">Avg Response</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-warning">156</div>
                <div className="text-xs text-muted-foreground">Active Sessions</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Last Updated */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Last updated: {formatLastSync(new Date()?.toISOString())}
        </span>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
    </div>
  );
};

export default IntegrationStatusPanel;