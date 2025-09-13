import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TimelineDetailPanel = ({ request, onAddComment, onDownloadDocument, userRole }) => {
  const [newComment, setNewComment] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);

  if (!request) {
    return (
      <div className="w-full h-full bg-card flex items-center justify-center">
        <div className="text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a Request</h3>
          <p className="text-sm text-muted-foreground">
            Choose a request from the list to view its detailed timeline and status information.
          </p>
        </div>
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'created': return 'Plus';
      case 'approved': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      case 'comment': return 'MessageSquare';
      case 'document': return 'Paperclip';
      case 'status_change': return 'RefreshCw';
      case 'assignment': return 'UserCheck';
      case 'notification': return 'Bell';
      case 'system': return 'Settings';
      default: return 'Circle';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'created': return 'text-accent';
      case 'approved': return 'text-success';
      case 'rejected': return 'text-error';
      case 'comment': return 'text-foreground';
      case 'document': return 'text-warning';
      case 'status_change': return 'text-accent';
      case 'assignment': return 'text-primary';
      case 'notification': return 'text-muted-foreground';
      case 'system': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => 
      prev?.includes(itemId) 
        ? prev?.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddComment = () => {
    if (newComment?.trim()) {
      onAddComment(request?.id, newComment?.trim());
      setNewComment('');
    }
  };

  const formatAmount = (amount, currency) => {
    if (currency === 'USD') {
      return `$${amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `${amount?.toLocaleString('en-US')} ៛`;
    }
  };

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

  return (
    <div className="w-full h-full bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Request {request?.id}
            </h3>
            <p className="text-sm text-muted-foreground">
              {request?.type?.replace('_', ' ')?.toUpperCase()} • {formatAmount(request?.amount, request?.currency)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request?.status)}`}>
              {request?.status?.replace('_', ' ')?.toUpperCase()}
            </span>
            <Button variant="ghost" size="sm">
              <Icon name="MoreVertical" size={16} />
            </Button>
          </div>
        </div>

        {/* Request Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">From:</span>
            <span className="ml-2 font-medium">{request?.fromBranch}</span>
          </div>
          {request?.toBranch && (
            <div>
              <span className="text-muted-foreground">To:</span>
              <span className="ml-2 font-medium">{request?.toBranch}</span>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Created:</span>
            <span className="ml-2 font-medium">{formatDateTime(request?.createdAt)?.date}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Priority:</span>
            <span className={`ml-2 font-medium ${
              request?.priority === 'urgent' ? 'text-error' :
              request?.priority === 'high' ? 'text-warning' :
              request?.priority === 'medium' ? 'text-accent' : 'text-muted-foreground'
            }`}>
              {request?.priority?.toUpperCase() || 'MEDIUM'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{request?.progress || 0}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                request?.status === 'completed' ? 'bg-success' :
                request?.status === 'rejected' || request?.status === 'cancelled' ? 'bg-error' :
                request?.status === 'in_progress' ? 'bg-accent' : 'bg-warning'
              }`}
              style={{ width: `${request?.progress || 0}%` }}
            />
          </div>
        </div>
      </div>
      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <h4 className="text-sm font-semibold text-foreground mb-4">Activity Timeline</h4>
        
        <div className="space-y-4">
          {request?.timeline?.map((event, index) => {
            const isExpanded = expandedItems?.includes(event?.id);
            const datetime = formatDateTime(event?.timestamp);
            
            return (
              <div key={event?.id} className="flex space-x-3">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center ${
                    event?.type === 'approved' ? 'bg-success' :
                    event?.type === 'rejected' ? 'bg-error' :
                    event?.type === 'created'? 'bg-accent' : 'bg-muted'
                  }`}>
                    <Icon 
                      name={getEventIcon(event?.type)} 
                      size={14} 
                      className={event?.type === 'approved' || event?.type === 'rejected' || event?.type === 'created' ? 'text-white' : getEventColor(event?.type)}
                    />
                  </div>
                  {index < request?.timeline?.length - 1 && (
                    <div className="w-0.5 h-8 bg-border mt-2" />
                  )}
                </div>
                {/* Event Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-foreground">
                        {event?.title}
                      </h5>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event?.description}
                      </p>
                      
                      {event?.details && (
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(event?.id)}
                            className="text-xs p-0 h-auto"
                          >
                            <Icon 
                              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                              size={12} 
                              className="mr-1" 
                            />
                            {isExpanded ? 'Hide' : 'Show'} details
                          </Button>
                          
                          {isExpanded && (
                            <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm">
                              {typeof event?.details === 'string' ? (
                                <p className="text-muted-foreground">{event?.details}</p>
                              ) : (
                                <div className="space-y-2">
                                  {Object.entries(event?.details)?.map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="text-muted-foreground capitalize">
                                        {key?.replace('_', ' ')}:
                                      </span>
                                      <span className="font-medium">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Attachments */}
                      {event?.attachments && event?.attachments?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {event?.attachments?.map((attachment, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Icon name="Paperclip" size={12} className="text-muted-foreground" />
                              <button
                                onClick={() => onDownloadDocument(attachment?.id)}
                                className="text-xs text-accent hover:underline"
                              >
                                {attachment?.name}
                              </button>
                              <span className="text-xs text-muted-foreground">
                                ({attachment?.size})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-muted-foreground text-right ml-4">
                      <div>{datetime?.date}</div>
                      <div>{datetime?.time}</div>
                      {event?.user && (
                        <div className="mt-1 font-medium">{event?.user}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Add Comment Section */}
      {(userRole === 'manager' || userRole === 'cmc_supervisor' || userRole === 'staff') && (
        <div className="p-4 border-t border-border">
          <h5 className="text-sm font-medium text-foreground mb-3">Add Comment</h5>
          <div className="space-y-3">
            <Input
              placeholder="Enter your comment or update..."
              value={newComment}
              onChange={(e) => setNewComment(e?.target?.value)}
              onKeyPress={(e) => {
                if (e?.key === 'Enter' && !e?.shiftKey) {
                  e?.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Icon name="Paperclip" size={14} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="AtSign" size={14} />
                </Button>
              </div>
              <Button
                onClick={handleAddComment}
                disabled={!newComment?.trim()}
                size="sm"
              >
                <Icon name="Send" size={14} className="mr-2" />
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineDetailPanel;