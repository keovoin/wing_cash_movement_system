import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AuditControlsTab = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'sarah.chen', label: 'Sarah Chen' },
    { value: 'michael.rodriguez', label: 'Michael Rodriguez' },
    { value: 'sophea.phan', label: 'Sophea Phan' },
    { value: 'david.kim', label: 'David Kim' }
  ];

  const actionOptions = [
    { value: 'all', label: 'All Actions' },
    { value: 'login', label: 'User Login' },
    { value: 'approval', label: 'Request Approval' },
    { value: 'config_change', label: 'Configuration Change' },
    { value: 'user_management', label: 'User Management' },
    { value: 'system_access', label: 'System Access' }
  ];

  const auditLogs = [
    {
      id: 1,
      timestamp: '2025-01-13 08:45:23',
      user: 'Sarah Chen',
      action: 'Approved cash transfer request',
      resource: 'Request #CT-2025-0113-001',
      ipAddress: '192.168.1.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
      details: 'USD 25,000 transfer from Phnom Penh Central to CMC'
    },
    {
      id: 2,
      timestamp: '2025-01-13 08:42:15',
      user: 'David Kim',
      action: 'Modified user permissions',
      resource: 'User: michael.rodriguez@wingbank.com',
      ipAddress: '192.168.1.12',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
      details: 'Added bulk_operations permission'
    },
    {
      id: 3,
      timestamp: '2025-01-13 08:38:47',
      user: 'Michael Rodriguez',
      action: 'Failed login attempt',
      resource: 'Authentication System',
      ipAddress: '192.168.1.78',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'failed',
      details: 'Invalid password - 3rd attempt'
    },
    {
      id: 4,
      timestamp: '2025-01-13 08:35:12',
      user: 'Sophea Phan',
      action: 'Exported audit report',
      resource: 'Audit System',
      ipAddress: '192.168.1.89',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
      details: 'Monthly compliance report for December 2024'
    },
    {
      id: 5,
      timestamp: '2025-01-13 08:30:05',
      user: 'Sarah Chen',
      action: 'Updated approval threshold',
      resource: 'Workflow Configuration',
      ipAddress: '192.168.1.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success',
      details: 'Changed USD threshold from $50,000 to $75,000'
    }
  ];

  const complianceMetrics = [
    {
      category: 'Data Retention',
      status: 'compliant',
      score: 100,
      details: 'All audit logs retained for required 7-year period'
    },
    {
      category: 'Access Controls',
      status: 'compliant',
      score: 98,
      details: 'Role-based access properly implemented with minor exceptions'
    },
    {
      category: 'Transaction Monitoring',
      status: 'compliant',
      score: 95,
      details: 'All transactions logged with complete audit trail'
    },
    {
      category: 'User Activity Tracking',
      status: 'warning',
      score: 87,
      details: 'Some user sessions not properly logged during peak hours'
    },
    {
      category: 'System Changes',
      status: 'compliant',
      score: 100,
      details: 'All configuration changes properly documented and approved'
    }
  ];

  const getStatusBadge = (status) => {
    const colors = {
      success: 'bg-success/10 text-success',
      failed: 'bg-error/10 text-error',
      warning: 'bg-warning/10 text-warning',
      compliant: 'bg-success/10 text-success'
    };
    return `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors?.[status] || 'bg-muted text-muted-foreground'}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': case'compliant': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      default: return 'Circle';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-success';
    if (score >= 85) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Audit Controls</h3>
          <p className="text-sm text-muted-foreground">
            Monitor system activity and compliance status
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Export audit report')}
          >
            Export Report
          </Button>
          <Button
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={() => console.log('Refresh audit data')}
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {complianceMetrics?.map((metric, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name={getStatusIcon(metric?.status)} size={20} className={
                metric?.status === 'compliant' ? 'text-success' :
                metric?.status === 'warning' ? 'text-warning' : 'text-error'
              } />
              <span className={getStatusBadge(metric?.status)}>
                {metric?.status}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{metric?.category}</p>
            <p className={`text-2xl font-bold ${getScoreColor(metric?.score)}`}>
              {metric?.score}%
            </p>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {metric?.details}
            </p>
          </div>
        ))}
      </div>
      {/* Audit Log Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Select
            label="Time Range"
            options={timeRangeOptions}
            value={selectedTimeRange}
            onChange={setSelectedTimeRange}
            className="w-48"
          />
          <Select
            label="User"
            options={userOptions}
            value={selectedUser}
            onChange={setSelectedUser}
            className="w-48"
          />
          <Select
            label="Action Type"
            options={actionOptions}
            value={selectedAction}
            onChange={setSelectedAction}
            className="w-48"
          />
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search audit logs..."
              className="w-full"
            />
          </div>
        </div>
      </div>
      {/* Audit Logs Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Audit Trail</h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {auditLogs?.length} entries found
              </span>
              <Button
                variant="outline"
                size="sm"
                iconName="Filter"
                onClick={() => console.log('Advanced filters')}
              >
                Filters
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-foreground">Timestamp</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Action</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Resource</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
                <th className="text-right p-4 text-sm font-medium text-foreground">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs?.map((log) => (
                <tr key={log?.id} className="hover:bg-muted/30 transition-colors duration-150">
                  <td className="p-4">
                    <div className="text-sm font-mono text-foreground">
                      {new Date(log.timestamp)?.toLocaleDateString()}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {new Date(log.timestamp)?.toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {log?.user?.split(' ')?.map(n => n?.[0])?.join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{log?.user}</p>
                        <p className="text-xs text-muted-foreground font-mono">{log?.ipAddress}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{log?.action}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-mono text-foreground">{log?.resource}</p>
                  </td>
                  <td className="p-4">
                    <span className={getStatusBadge(log?.status)}>
                      {log?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <p className="text-sm text-muted-foreground max-w-xs truncate">
                        {log?.details}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => console.log('View details', log?.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Audit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {auditLogs?.length?.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {auditLogs?.filter(log => log?.status === 'success')?.length}
              </p>
              <p className="text-sm text-muted-foreground">Successful Actions</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="XCircle" size={20} className="text-error" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {auditLogs?.filter(log => log?.status === 'failed')?.length}
              </p>
              <p className="text-sm text-muted-foreground">Failed Actions</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-accent" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {new Set(auditLogs.map(log => log.user))?.size}
              </p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
        </div>
      </div>
      {/* Compliance Actions */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-medium text-foreground">Compliance Actions</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Quick actions for regulatory compliance
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => console.log('Generate SOX report')}
            >
              <Icon name="Shield" size={24} className="mb-2" />
              <span>SOX Compliance Report</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => console.log('Export audit trail')}
            >
              <Icon name="Download" size={24} className="mb-2" />
              <span>Export Audit Trail</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => console.log('Schedule compliance check')}
            >
              <Icon name="Calendar" size={24} className="mb-2" />
              <span>Schedule Review</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditControlsTab;