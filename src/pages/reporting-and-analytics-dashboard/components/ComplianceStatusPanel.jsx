import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceStatusPanel = ({ data, isLoading }) => {
  const complianceData = data || {
    overallScore: 98.5,
    auditTrail: {
      status: 'compliant',
      lastAudit: '2025-01-10',
      nextAudit: '2025-04-10',
      findings: 2
    },
    dataRetention: {
      status: 'compliant',
      retentionPeriod: '7 years',
      archivedRecords: 45678,
      upcomingPurge: '2025-02-15'
    },
    segregationOfDuties: {
      status: 'compliant',
      violations: 0,
      lastReview: '2025-01-12'
    },
    transactionLimits: {
      status: 'warning',
      overLimitRequests: 12,
      pendingApprovals: 3,
      escalations: 1
    }
  };

  const complianceItems = [
    {
      id: 'audit_trail',
      title: 'Audit Trail Compliance',
      status: complianceData?.auditTrail?.status,
      score: 99.2,
      icon: 'FileSearch',
      description: `${complianceData?.auditTrail?.findings} minor findings from last audit`,
      details: [
        { label: 'Last Audit', value: complianceData?.auditTrail?.lastAudit },
        { label: 'Next Audit', value: complianceData?.auditTrail?.nextAudit },
        { label: 'Findings', value: complianceData?.auditTrail?.findings }
      ]
    },
    {
      id: 'data_retention',
      title: 'Data Retention Policy',
      status: complianceData?.dataRetention?.status,
      score: 100,
      icon: 'Database',
      description: `${complianceData?.dataRetention?.archivedRecords?.toLocaleString()} records archived`,
      details: [
        { label: 'Retention Period', value: complianceData?.dataRetention?.retentionPeriod },
        { label: 'Archived Records', value: complianceData?.dataRetention?.archivedRecords?.toLocaleString() },
        { label: 'Next Purge', value: complianceData?.dataRetention?.upcomingPurge }
      ]
    },
    {
      id: 'segregation_duties',
      title: 'Segregation of Duties',
      status: complianceData?.segregationOfDuties?.status,
      score: 98.8,
      icon: 'Users',
      description: `${complianceData?.segregationOfDuties?.violations} violations detected`,
      details: [
        { label: 'Violations', value: complianceData?.segregationOfDuties?.violations },
        { label: 'Last Review', value: complianceData?.segregationOfDuties?.lastReview },
        { label: 'Status', value: 'All controls active' }
      ]
    },
    {
      id: 'transaction_limits',
      title: 'Transaction Limit Controls',
      status: complianceData?.transactionLimits?.status,
      score: 94.5,
      icon: 'AlertTriangle',
      description: `${complianceData?.transactionLimits?.overLimitRequests} over-limit requests this month`,
      details: [
        { label: 'Over-Limit Requests', value: complianceData?.transactionLimits?.overLimitRequests },
        { label: 'Pending Approvals', value: complianceData?.transactionLimits?.pendingApprovals },
        { label: 'Escalations', value: complianceData?.transactionLimits?.escalations }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'non_compliant': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'non_compliant': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 98) return 'text-success';
    if (score >= 95) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={18} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Compliance Status</h3>
            <p className="text-sm text-muted-foreground">
              Regulatory compliance monitoring and audit readiness
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(complianceData?.overallScore)}`}>
              {complianceData?.overallScore}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="FileText"
            iconPosition="left"
          >
            Generate Report
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)]?.map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceItems?.map((item) => (
              <div
                key={item?.id}
                className={`p-4 rounded-lg border-2 ${getStatusColor(item?.status)} transition-all duration-150 hover:shadow-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon name={item?.icon} size={20} className={
                      item?.status === 'compliant' ? 'text-success' :
                      item?.status === 'warning' ? 'text-warning' : 'text-error'
                    } />
                    <h4 className="text-sm font-medium text-foreground">{item?.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${getScoreColor(item?.score)}`}>
                      {item?.score}%
                    </span>
                    <Icon 
                      name={getStatusIcon(item?.status)} 
                      size={16} 
                      className={
                        item?.status === 'compliant' ? 'text-success' :
                        item?.status === 'warning' ? 'text-warning' : 'text-error'
                      }
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{item?.description}</p>

                <div className="space-y-2">
                  {item?.details?.map((detail, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{detail?.label}:</span>
                      <span className="font-medium text-foreground">{detail?.value}</span>
                    </div>
                  ))}
                </div>

                {item?.status === 'warning' && (
                  <div className="mt-4 pt-3 border-t border-warning/20">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-warning border-warning/30 hover:bg-warning/10"
                      iconName="AlertTriangle"
                      iconPosition="left"
                    >
                      Review Issues
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Compliance Summary */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Info" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Compliance Summary</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Last updated: {new Date()?.toLocaleDateString()}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">SOX Compliance:</span>
                <span className="font-medium text-success">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Banking Regulations:</span>
                <span className="font-medium text-success">Compliant</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Data Protection:</span>
                <span className="font-medium text-success">Secured</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceStatusPanel;