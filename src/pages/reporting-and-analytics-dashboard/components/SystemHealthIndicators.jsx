import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemHealthIndicators = ({ data, isLoading }) => {
  const [selectedSystem, setSelectedSystem] = useState(null);

  const systemData = data || {
    wingMC: {
      status: 'healthy',
      uptime: 99.8,
      lastSync: '2025-01-13 08:42:15',
      responseTime: 145,
      transactions: 1247,
      errors: 2
    },
    emailGateway: {
      status: 'healthy',
      uptime: 99.5,
      lastSync: '2025-01-13 08:41:30',
      responseTime: 89,
      emailsSent: 456,
      errors: 0
    },
    documentManagement: {
      status: 'warning',
      uptime: 98.2,
      lastSync: '2025-01-13 08:35:22',
      responseTime: 234,
      documentsProcessed: 189,
      errors: 5
    },
    database: {
      status: 'healthy',
      uptime: 99.9,
      lastSync: '2025-01-13 08:42:45',
      responseTime: 23,
      queries: 15678,
      errors: 1
    },
    apiGateway: {
      status: 'healthy',
      uptime: 99.7,
      lastSync: '2025-01-13 08:42:30',
      responseTime: 67,
      requests: 8934,
      errors: 3
    }
  };

  const systems = [
    {
      id: 'wingMC',
      name: 'Wing MC Integration',
      icon: 'Database',
      description: 'Core banking system integration',
      data: systemData?.wingMC
    },
    {
      id: 'emailGateway',
      name: 'Email Gateway',
      icon: 'Mail',
      description: 'Notification and email services',
      data: systemData?.emailGateway
    },
    {
      id: 'documentManagement',
      name: 'Document Management',
      icon: 'FileText',
      description: 'File upload and document processing',
      data: systemData?.documentManagement
    },
    {
      id: 'database',
      name: 'Database Cluster',
      icon: 'Server',
      description: 'Primary database and replicas',
      data: systemData?.database
    },
    {
      id: 'apiGateway',
      name: 'API Gateway',
      icon: 'Globe',
      description: 'External API and service mesh',
      data: systemData?.apiGateway
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'error': return 'text-error bg-error/10 border-error/20';
      case 'maintenance': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      case 'maintenance': return 'Settings';
      default: return 'Circle';
    }
  };

  const getResponseTimeColor = (responseTime) => {
    if (responseTime < 100) return 'text-success';
    if (responseTime < 200) return 'text-warning';
    return 'text-error';
  };

  const formatUptime = (uptime) => {
    return `${uptime?.toFixed(1)}%`;
  };

  const formatLastSync = (timestamp) => {
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - syncTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return `${Math.floor(diffMinutes / 60)}h ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={18} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">System Health</h3>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of integrated systems and services
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-muted-foreground">Live monitoring</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)]?.map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems?.map((system) => (
              <div
                key={system?.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-150 hover:shadow-sm ${
                  selectedSystem === system?.id ? 'ring-2 ring-primary/20' : ''
                } ${getStatusColor(system?.data?.status)}`}
                onClick={() => setSelectedSystem(selectedSystem === system?.id ? null : system?.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon name={system?.icon} size={20} className={
                      system?.data?.status === 'healthy' ? 'text-success' :
                      system?.data?.status === 'warning' ? 'text-warning' : 'text-error'
                    } />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{system?.name}</h4>
                      <p className="text-xs text-muted-foreground">{system?.description}</p>
                    </div>
                  </div>
                  <Icon 
                    name={getStatusIcon(system?.data?.status)} 
                    size={16} 
                    className={
                      system?.data?.status === 'healthy' ? 'text-success' :
                      system?.data?.status === 'warning' ? 'text-warning' : 'text-error'
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span className="font-medium text-foreground">
                      {formatUptime(system?.data?.uptime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Response:</span>
                    <span className={`font-medium ${getResponseTimeColor(system?.data?.responseTime)}`}>
                      {system?.data?.responseTime}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span className="font-medium text-foreground">
                      {formatLastSync(system?.data?.lastSync)}
                    </span>
                  </div>
                </div>

                {/* Uptime Progress Bar */}
                <div className="mt-3">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        system?.data?.uptime >= 99.5 ? 'bg-success' :
                        system?.data?.uptime >= 98 ? 'bg-warning' : 'bg-error'
                      }`}
                      style={{ width: `${system?.data?.uptime}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedSystem === system?.id && (
                  <div className="mt-4 pt-3 border-t border-border/50 space-y-2 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Transactions:</span>
                        <div className="font-medium text-foreground">
                          {system?.data?.transactions || system?.data?.emailsSent || system?.data?.documentsProcessed || system?.data?.queries || system?.data?.requests}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Errors:</span>
                        <div className={`font-medium ${system?.data?.errors > 0 ? 'text-error' : 'text-success'}`}>
                          {system?.data?.errors}
                        </div>
                      </div>
                    </div>
                    
                    {system?.data?.status === 'warning' && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-warning border-warning/30 hover:bg-warning/10"
                          iconName="AlertTriangle"
                          iconPosition="left"
                        >
                          View Issues
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overall System Status */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Server" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Overall System Status</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">All Systems Operational</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Average Uptime:</span>
                <span className="font-medium text-foreground">99.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Response Time:</span>
                <span className="font-medium text-foreground">112ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Connections:</span>
                <span className="font-medium text-foreground">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Errors:</span>
                <span className="font-medium text-foreground">11</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealthIndicators;