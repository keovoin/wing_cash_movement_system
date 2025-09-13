import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RequestDetailPanel = ({ request, onApprove, onReject, onDelegate, onClose }) => {
  const [comment, setComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [actionType, setActionType] = useState(null);

  if (!request) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No Request Selected</p>
          <p className="text-sm">Select a request from the list to view details</p>
        </div>
      </div>
    );
  }

  const handleAction = (type) => {
    setActionType(type);
    setShowCommentForm(true);
  };

  const submitAction = () => {
    const actionData = {
      requestId: request?.id,
      comment: comment?.trim(),
      timestamp: new Date()?.toISOString()
    };

    switch (actionType) {
      case 'approve':
        onApprove(actionData);
        break;
      case 'reject':
        onReject(actionData);
        break;
      case 'delegate':
        onDelegate(actionData);
        break;
    }

    setComment('');
    setShowCommentForm(false);
    setActionType(null);
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
      case 'urgent': return 'text-error bg-error/10 border-error/20';
      case 'high': return 'text-warning bg-warning/10 border-warning/20';
      case 'normal': return 'text-foreground bg-muted border-border';
      case 'low': return 'text-muted-foreground bg-muted/50 border-border';
      default: return 'text-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning/10 border-warning/20';
      case 'in-review': return 'text-accent bg-accent/10 border-accent/20';
      case 'approved': return 'text-success bg-success/10 border-success/20';
      case 'rejected': return 'text-error bg-error/10 border-error/20';
      case 'escalated': return 'text-error bg-error/20 border-error/30';
      default: return 'text-foreground bg-muted border-border';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">Request Details</h3>
          <span className="text-sm font-mono text-muted-foreground">{request?.id}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={onClose}
          className="h-8 w-8 p-0"
        />
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Status and Priority */}
        <div className="flex items-center space-x-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request?.status)}`}>
            {request?.currentStage}
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(request?.priority)}`}>
            {request?.priority} Priority
          </div>
          {request?.isUrgent && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error text-error-foreground">
              <Icon name="AlertTriangle" size={14} className="mr-1" />
              Urgent
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Request Information</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Request Type</label>
              <p className="text-sm font-medium text-foreground">{request?.type}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Submitted Date</label>
              <p className="text-sm font-medium text-foreground">{request?.submittedDate}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Amount</label>
              <p className="text-lg font-bold text-foreground font-mono">
                {formatAmount(request?.amount, request?.currency)}
              </p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Currency</label>
              <p className="text-sm font-medium text-foreground">{request?.currency}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <p className="text-sm text-foreground mt-1">{request?.description}</p>
          </div>
        </div>

        {/* Submitter Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Submitter Details</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <p className="text-sm font-medium text-foreground">{request?.submitter}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Role</label>
              <p className="text-sm font-medium text-foreground">{request?.submitterRole}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Branch</label>
              <p className="text-sm font-medium text-foreground">{request?.branch}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Contact</label>
              <p className="text-sm font-medium text-foreground">{request?.submitterContact}</p>
            </div>
          </div>
        </div>

        {/* Approval Workflow */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Approval Workflow</h4>
          
          <div className="space-y-3">
            {request?.approvalStages?.map((stage, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  stage?.status === 'completed' ? 'bg-success text-success-foreground' :
                  stage?.status === 'current' ? 'bg-accent text-accent-foreground' :
                  stage?.status === 'rejected' ? 'bg-error text-error-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {stage?.status === 'completed' ? (
                    <Icon name="Check" size={16} />
                  ) : stage?.status === 'current' ? (
                    <Icon name="Clock" size={16} />
                  ) : stage?.status === 'rejected' ? (
                    <Icon name="X" size={16} />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{stage?.role}</p>
                  <p className="text-xs text-muted-foreground">
                    {stage?.approver || 'Pending assignment'}
                  </p>
                  {stage?.completedAt && (
                    <p className="text-xs text-muted-foreground">
                      {stage?.completedAt} • {stage?.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attachments */}
        {request?.attachments && request?.attachments?.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Attachments</h4>
            
            <div className="space-y-2">
              {request?.attachments?.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-muted/30 rounded-md">
                  <Icon name="Paperclip" size={16} className="text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{attachment?.name}</p>
                    <p className="text-xs text-muted-foreground">{attachment?.size} • {attachment?.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    className="h-8 w-8 p-0"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLA Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">SLA Status</h4>
          
          <div className="p-3 bg-muted/30 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Time Remaining</span>
              <span className={`text-sm font-mono font-medium ${
                request?.slaMinutes <= 0 ? 'text-error' :
                request?.slaMinutes <= 30 ? 'text-warning': 'text-success'
              }`}>
                {request?.slaMinutes <= 0 ? 'Overdue' : 
                 request?.slaMinutes > 60 ? `${Math.floor(request?.slaMinutes / 60)}h ${request?.slaMinutes % 60}m` :
                 `${request?.slaMinutes}m`}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  request?.slaMinutes <= 0 ? 'bg-error' :
                  request?.slaMinutes <= 30 ? 'bg-warning': 'bg-success'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (request?.slaMinutes / 240) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="border-t border-border p-4">
        {!showCommentForm ? (
          <div className="flex space-x-2">
            <Button
              variant="default"
              onClick={() => handleAction('approve')}
              iconName="Check"
              iconPosition="left"
              className="flex-1"
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction('reject')}
              iconName="X"
              iconPosition="left"
              className="flex-1"
            >
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAction('delegate')}
              iconName="UserCheck"
              iconPosition="left"
            >
              Delegate
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              label={`${actionType?.charAt(0)?.toUpperCase() + actionType?.slice(1)} Comment`}
              value={comment}
              onChange={(e) => setComment(e?.target?.value)}
              placeholder="Enter your comment..."
              required
            />
            <div className="flex space-x-2">
              <Button
                variant="default"
                onClick={submitAction}
                disabled={!comment?.trim()}
                className="flex-1"
              >
                Confirm {actionType?.charAt(0)?.toUpperCase() + actionType?.slice(1)}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentForm(false);
                  setComment('');
                  setActionType(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetailPanel;