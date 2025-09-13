import React from 'react';
import Icon from '../../../components/AppIcon';

const QueueStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Pending',
      value: stats?.totalPending || 0,
      icon: 'Clock',
      color: 'text-warning bg-warning/10 border-warning/20',
      trend: stats?.pendingTrend || 0
    },
    {
      title: 'Urgent Requests',
      value: stats?.urgentRequests || 0,
      icon: 'AlertTriangle',
      color: 'text-error bg-error/10 border-error/20',
      trend: stats?.urgentTrend || 0
    },
    {
      title: 'SLA Breaches',
      value: stats?.slaBreaches || 0,
      icon: 'AlertCircle',
      color: 'text-error bg-error/10 border-error/20',
      trend: stats?.slaTrend || 0
    },
    {
      title: 'Processed Today',
      value: stats?.processedToday || 0,
      icon: 'CheckCircle',
      color: 'text-success bg-success/10 border-success/20',
      trend: stats?.processedTrend || 0
    },
    {
      title: 'Average Processing Time',
      value: `${stats?.avgProcessingTime || 0}h`,
      icon: 'Timer',
      color: 'text-accent bg-accent/10 border-accent/20',
      trend: stats?.timeTrend || 0
    },
    {
      title: 'My Queue',
      value: stats?.myQueue || 0,
      icon: 'User',
      color: 'text-primary bg-primary/10 border-primary/20',
      trend: stats?.myQueueTrend || 0
    }
  ];

  const formatTrend = (trend) => {
    if (trend === 0) return null;
    const isPositive = trend > 0;
    return (
      <div className={`flex items-center space-x-1 text-xs ${
        isPositive ? 'text-success' : 'text-error'
      }`}>
        <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={12} />
        <span>{Math.abs(trend)}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${stat?.color} transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-2">
            <Icon name={stat?.icon} size={20} />
            {formatTrend(stat?.trend)}
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold font-mono">{stat?.value}</p>
            <p className="text-sm opacity-80">{stat?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QueueStats;