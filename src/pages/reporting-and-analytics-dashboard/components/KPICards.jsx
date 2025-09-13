import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICards = ({ data, isLoading }) => {
  const kpiData = [
    {
      id: 'total_requests',
      title: 'Total Requests',
      value: data?.totalRequests || '1,247',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'FileText',
      description: 'All cash transfer requests'
    },
    {
      id: 'pending_approvals',
      title: 'Pending Approvals',
      value: data?.pendingApprovals || '23',
      change: '-8.2%',
      changeType: 'positive',
      icon: 'Clock',
      description: 'Awaiting approval'
    },
    {
      id: 'total_volume',
      title: 'Total Volume',
      value: data?.totalVolume || '$2.4M',
      change: '+18.7%',
      changeType: 'positive',
      icon: 'DollarSign',
      description: 'Combined USD & KHR'
    },
    {
      id: 'avg_processing_time',
      title: 'Avg Processing Time',
      value: data?.avgProcessingTime || '2.3h',
      change: '-15.4%',
      changeType: 'positive',
      icon: 'Timer',
      description: 'Request to completion'
    },
    {
      id: 'approval_rate',
      title: 'Approval Rate',
      value: data?.approvalRate || '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'CheckCircle',
      description: 'Successful approvals'
    },
    {
      id: 'compliance_score',
      title: 'Compliance Score',
      value: data?.complianceScore || '98.5%',
      change: '+0.8%',
      changeType: 'positive',
      icon: 'Shield',
      description: 'Regulatory compliance'
    }
  ];

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {kpiData?.map((kpi) => (
        <div
          key={kpi?.id}
          className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow duration-150"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              kpi?.id === 'pending_approvals' ? 'bg-warning/10' :
              kpi?.id === 'compliance_score'? 'bg-success/10' : 'bg-primary/10'
            }`}>
              <Icon 
                name={kpi?.icon} 
                size={20} 
                className={
                  kpi?.id === 'pending_approvals' ? 'text-warning' :
                  kpi?.id === 'compliance_score'? 'text-success' : 'text-primary'
                }
              />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getChangeColor(kpi?.changeType)}`}>
              <Icon name={getChangeIcon(kpi?.changeType)} size={14} />
              <span className="font-medium">{kpi?.change}</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">{kpi?.title}</h3>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                kpi?.value
              )}
            </div>
            <p className="text-xs text-muted-foreground">{kpi?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;