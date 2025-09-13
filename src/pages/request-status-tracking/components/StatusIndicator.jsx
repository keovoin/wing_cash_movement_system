import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusIndicator = ({ status, size = 'default', showText = true, className = '' }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          text: 'Pending Review'
        };
      case 'approved':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          text: 'Approved'
        };
      case 'rejected':
        return {
          icon: 'XCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          text: 'Rejected'
        };
      case 'in_progress':
        return {
          icon: 'RefreshCw',
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent/20',
          text: 'In Progress'
        };
      case 'completed':
        return {
          icon: 'CheckCircle2',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          text: 'Completed'
        };
      case 'cancelled':
        return {
          icon: 'Ban',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-muted',
          text: 'Cancelled'
        };
      case 'on_hold':
        return {
          icon: 'Pause',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          text: 'On Hold'
        };
      default:
        return {
          icon: 'Circle',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-muted',
          text: 'Unknown'
        };
    }
  };

  const getSizeConfig = (size) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 10,
          textClass: 'text-xs'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-base',
          icon: 18,
          textClass: 'text-base'
        };
      default:
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 14,
          textClass: 'text-sm'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const sizeConfig = getSizeConfig(size);

  if (!showText) {
    return (
      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${statusConfig?.bgColor} ${statusConfig?.borderColor} border ${className}`}>
        <Icon 
          name={statusConfig?.icon} 
          size={sizeConfig?.icon} 
          className={statusConfig?.color}
        />
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center ${sizeConfig?.container} rounded-full font-medium border ${statusConfig?.bgColor} ${statusConfig?.color} ${statusConfig?.borderColor} ${className}`}>
      <Icon 
        name={statusConfig?.icon} 
        size={sizeConfig?.icon} 
        className="mr-1.5"
      />
      <span className={sizeConfig?.textClass}>
        {statusConfig?.text}
      </span>
    </span>
  );
};

export default StatusIndicator;