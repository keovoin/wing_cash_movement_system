import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequestDataGrid = ({ 
  requests = [], 
  selectedRequests = [], 
  onSelectionChange, 
  onRequestClick, 
  sortConfig, 
  onSort,
  currentUser 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const columns = [
    { key: 'select', label: '', width: '40px', sortable: false },
    { key: 'id', label: 'Request ID', width: '120px', sortable: true },
    { key: 'type', label: 'Type', width: '140px', sortable: true },
    { key: 'submitter', label: 'Submitter', width: '160px', sortable: true },
    { key: 'amount', label: 'Amount', width: '120px', sortable: true },
    { key: 'currency', label: 'Currency', width: '80px', sortable: true },
    { key: 'priority', label: 'Priority', width: '100px', sortable: true },
    { key: 'slaTimer', label: 'SLA Timer', width: '100px', sortable: true },
    { key: 'stage', label: 'Current Stage', width: '140px', sortable: true },
    { key: 'submitted', label: 'Submitted', width: '120px', sortable: true },
    { key: 'actions', label: 'Actions', width: '120px', sortable: false }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(requests?.map(r => r?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRequest = (requestId, checked) => {
    if (checked) {
      onSelectionChange([...selectedRequests, requestId]);
    } else {
      onSelectionChange(selectedRequests?.filter(id => id !== requestId));
    }
  };

  const formatAmount = (amount, currency) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'KHR' ? 0 : 2
    });
    return formatter?.format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error bg-error/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'normal': return 'text-foreground bg-muted';
      case 'low': return 'text-muted-foreground bg-muted/50';
      default: return 'text-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning/10';
      case 'in-review': return 'text-accent bg-accent/10';
      case 'approved': return 'text-success bg-success/10';
      case 'rejected': return 'text-error bg-error/10';
      case 'escalated': return 'text-error bg-error/20';
      default: return 'text-foreground bg-muted';
    }
  };

  const getSLAStatus = (slaMinutes) => {
    if (slaMinutes <= 0) return { color: 'text-error', icon: 'AlertTriangle' };
    if (slaMinutes <= 30) return { color: 'text-warning', icon: 'Clock' };
    return { color: 'text-success', icon: 'CheckCircle' };
  };

  const formatSLATime = (minutes) => {
    if (minutes <= 0) return 'Overdue';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const isAllSelected = requests?.length > 0 && selectedRequests?.length === requests?.length;
  const isPartiallySelected = selectedRequests?.length > 0 && selectedRequests?.length < requests?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-muted-foreground">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={input => {
                if (input) input.indeterminate = isPartiallySelected;
              }}
              onChange={(e) => handleSelectAll(e?.target?.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
            />
          </div>
          {columns?.slice(1)?.map((column) => (
            <div 
              key={column?.key} 
              className={`${
                column?.key === 'id' ? 'col-span-1' :
                column?.key === 'type' ? 'col-span-1' :
                column?.key === 'submitter' ? 'col-span-2' :
                column?.key === 'amount' || column?.key === 'currency' ? 'col-span-1' :
                column?.key === 'priority' || column?.key === 'slaTimer' ? 'col-span-1' :
                column?.key === 'stage' ? 'col-span-1' :
                column?.key === 'submitted'? 'col-span-1' : 'col-span-1'
              } flex items-center space-x-1`}
            >
              <span>{column?.label}</span>
              {column?.sortable && (
                <button
                  onClick={() => onSort(column?.key)}
                  className="hover:text-foreground transition-colors"
                >
                  <Icon 
                    name={
                      sortConfig?.key === column?.key 
                        ? sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown' :'ChevronsUpDown'
                    } 
                    size={14} 
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Data Rows */}
      <div className="max-h-96 overflow-y-auto">
        {requests?.map((request) => {
          const isSelected = selectedRequests?.includes(request?.id);
          const slaStatus = getSLAStatus(request?.slaMinutes);
          
          return (
            <div
              key={request?.id}
              className={`grid grid-cols-12 gap-4 p-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer ${
                isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''
              } ${
                request?.isNew ? 'animate-pulse bg-accent/5' : ''
              }`}
              onMouseEnter={() => setHoveredRow(request?.id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => onRequestClick(request)}
            >
              {/* Select */}
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e?.stopPropagation();
                    handleSelectRequest(request?.id, e?.target?.checked);
                  }}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
              </div>
              {/* Request ID */}
              <div className="col-span-1 flex items-center">
                <span className="text-sm font-mono text-foreground">{request?.id}</span>
                {request?.isUrgent && (
                  <Icon name="AlertTriangle" size={14} className="ml-1 text-error" />
                )}
              </div>
              {/* Type */}
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-foreground">{request?.type}</span>
              </div>
              {/* Submitter */}
              <div className="col-span-2 flex items-center">
                <div>
                  <div className="text-sm font-medium text-foreground">{request?.submitter}</div>
                  <div className="text-xs text-muted-foreground">{request?.branch}</div>
                </div>
              </div>
              {/* Amount */}
              <div className="col-span-1 flex items-center">
                <span className="text-sm font-mono text-foreground">
                  {formatAmount(request?.amount, request?.currency)}
                </span>
              </div>
              {/* Currency */}
              <div className="col-span-1 flex items-center">
                <span className="text-sm font-medium text-foreground">{request?.currency}</span>
              </div>
              {/* Priority */}
              <div className="col-span-1 flex items-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request?.priority)}`}>
                  {request?.priority}
                </span>
              </div>
              {/* SLA Timer */}
              <div className="col-span-1 flex items-center space-x-1">
                <Icon name={slaStatus?.icon} size={14} className={slaStatus?.color} />
                <span className={`text-sm font-mono ${slaStatus?.color}`}>
                  {formatSLATime(request?.slaMinutes)}
                </span>
              </div>
              {/* Current Stage */}
              <div className="col-span-1 flex items-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request?.status)}`}>
                  {request?.currentStage}
                </span>
              </div>
              {/* Submitted */}
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-muted-foreground">{request?.submittedDate}</span>
              </div>
              {/* Actions */}
              <div className="col-span-1 flex items-center space-x-1">
                {hoveredRow === request?.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onRequestClick(request);
                      }}
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MessageSquare"
                      className="h-8 w-8 p-0"
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="bg-muted/30 border-t border-border p-3 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {requests?.length} requests
          {selectedRequests?.length > 0 && (
            <span className="ml-2 text-primary">
              • {selectedRequests?.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>Auto-refresh in 30s</span>
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default RequestDataGrid;