import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequestListPanel = ({ requests, selectedRequest, onRequestSelect, onBulkAction, userRole }) => {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-error/10 text-error border-error/20';
      case 'in_progress': return 'bg-accent/10 text-accent border-accent/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-muted text-muted-foreground border-muted';
      case 'on_hold': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'approved': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      case 'in_progress': return 'RefreshCw';
      case 'completed': return 'CheckCircle2';
      case 'cancelled': return 'Ban';
      case 'on_hold': return 'Pause';
      default: return 'Circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatAmount = (amount, currency) => {
    if (currency === 'USD') {
      return `$${amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `${amount?.toLocaleString('en-US')} ៛`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date?.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } else {
      return date?.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRequests(requests?.map(r => r?.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (requestId, checked) => {
    if (checked) {
      setSelectedRequests(prev => [...prev, requestId]);
    } else {
      setSelectedRequests(prev => prev?.filter(id => id !== requestId));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedRequests?.length > 0) {
      onBulkAction(action, selectedRequests);
      setSelectedRequests([]);
    }
  };

  const sortedRequests = [...requests]?.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'amount':
        aValue = a?.amount;
        bValue = b?.amount;
        break;
      case 'status':
        aValue = a?.status;
        bValue = b?.status;
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder?.[a?.priority] || 0;
        bValue = priorityOrder?.[b?.priority] || 0;
        break;
      default:
        aValue = a?.id;
        bValue = b?.id;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="w-full h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">
            Requests ({requests?.length})
          </h3>
          
          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm border border-border rounded-md px-2 py-1 bg-background"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <Icon name={sortOrder === 'asc' ? "ArrowUp" : "ArrowDown"} size={14} />
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {(userRole === 'manager' || userRole === 'cmc_supervisor') && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRequests?.length === requests?.length && requests?.length > 0}
                onChange={(e) => handleSelectAll(e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-muted-foreground">
                {selectedRequests?.length} selected
              </span>
            </div>
            
            {selectedRequests?.length > 0 && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  <Icon name="Download" size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('notify')}
                >
                  <Icon name="Bell" size={14} />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Request List */}
      <div className="flex-1 overflow-y-auto">
        {sortedRequests?.length > 0 ? (
          <div className="divide-y divide-border">
            {sortedRequests?.map((request) => (
              <div
                key={request?.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-150 ${
                  selectedRequest?.id === request?.id ? 'bg-primary/5 border-r-2 border-r-primary' : ''
                }`}
                onClick={() => onRequestSelect(request)}
              >
                <div className="flex items-start space-x-3">
                  {/* Selection Checkbox */}
                  {(userRole === 'manager' || userRole === 'cmc_supervisor') && (
                    <input
                      type="checkbox"
                      checked={selectedRequests?.includes(request?.id)}
                      onChange={(e) => {
                        e?.stopPropagation();
                        handleSelectRequest(request?.id, e?.target?.checked);
                      }}
                      className="mt-1 rounded border-border"
                    />
                  )}

                  {/* Request Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-foreground">
                          {request?.id}
                        </span>
                        {request?.priority && request?.priority !== 'medium' && (
                          <Icon 
                            name="AlertTriangle" 
                            size={12} 
                            className={getPriorityColor(request?.priority)}
                          />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(request?.createdAt)}
                      </span>
                    </div>

                    {/* Status and Type */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request?.status)}`}>
                        <Icon name={getStatusIcon(request?.status)} size={10} className="mr-1" />
                        {request?.status?.replace('_', ' ')?.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {request?.type?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </div>

                    {/* Amount and Branch Info */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono font-medium text-foreground">
                        {formatAmount(request?.amount, request?.currency)}
                      </span>
                      <div className="text-xs text-muted-foreground text-right">
                        <div>{request?.fromBranch}</div>
                        {request?.toBranch && (
                          <div className="flex items-center">
                            <Icon name="ArrowRight" size={10} className="mx-1" />
                            {request?.toBranch}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex-1 bg-muted rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all duration-300 ${
                            request?.status === 'completed' ? 'bg-success' :
                            request?.status === 'rejected' || request?.status === 'cancelled' ? 'bg-error' :
                            request?.status === 'in_progress' ? 'bg-accent' : 'bg-warning'
                          }`}
                          style={{ width: `${request?.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {request?.progress || 0}%
                      </span>
                    </div>

                    {/* Last Activity */}
                    <div className="text-xs text-muted-foreground">
                      <span>Last: {request?.lastActivity}</span>
                      {request?.nextAction && (
                        <span className="ml-2">• Next: {request?.nextAction}</span>
                      )}
                    </div>

                    {/* Notifications */}
                    {request?.hasUnreadUpdates && (
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                        <span className="text-xs text-primary font-medium">
                          New updates available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
            <p className="text-sm text-muted-foreground text-center">
              Try adjusting your search criteria or filters to find the requests you're looking for.
            </p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {sortedRequests?.length} of {requests?.length} requests
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Icon name="RefreshCw" size={12} />
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Download" size={12} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestListPanel;