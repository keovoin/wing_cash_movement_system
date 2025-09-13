import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BulkActionPanel = ({ 
  selectedRequests = [], 
  onBulkApprove, 
  onBulkReject, 
  onBulkDelegate, 
  onClearSelection,
  availableDelegates = []
}) => {
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkComment, setBulkComment] = useState('');
  const [selectedDelegate, setSelectedDelegate] = useState('');

  const delegateOptions = availableDelegates?.map(delegate => ({
    value: delegate?.id,
    label: `${delegate?.name} (${delegate?.role})`,
    description: delegate?.department
  }));

  const handleBulkAction = (action) => {
    setBulkAction(action);
    setShowBulkForm(true);
  };

  const submitBulkAction = () => {
    const actionData = {
      requestIds: selectedRequests,
      comment: bulkComment?.trim(),
      timestamp: new Date()?.toISOString(),
      delegateId: selectedDelegate
    };

    switch (bulkAction) {
      case 'approve':
        onBulkApprove(actionData);
        break;
      case 'reject':
        onBulkReject(actionData);
        break;
      case 'delegate':
        onBulkDelegate(actionData);
        break;
    }

    resetForm();
  };

  const resetForm = () => {
    setShowBulkForm(false);
    setBulkAction('');
    setBulkComment('');
    setSelectedDelegate('');
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'approve': return 'Check';
      case 'reject': return 'X';
      case 'delegate': return 'UserCheck';
      default: return 'Settings';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'approve': return 'text-success';
      case 'reject': return 'text-error';
      case 'delegate': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  if (selectedRequests?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      {!showBulkForm ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {selectedRequests?.length} request{selectedRequests?.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleBulkAction('approve')}
                iconName="Check"
                iconPosition="left"
              >
                Bulk Approve
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('reject')}
                iconName="X"
                iconPosition="left"
              >
                Bulk Reject
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delegate')}
                iconName="UserCheck"
                iconPosition="left"
              >
                Bulk Delegate
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              iconPosition="left"
              className="text-muted-foreground"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Action Header */}
          <div className="flex items-center space-x-3">
            <Icon 
              name={getActionIcon(bulkAction)} 
              size={20} 
              className={getActionColor(bulkAction)} 
            />
            <h3 className="text-lg font-semibold text-foreground">
              Bulk {bulkAction?.charAt(0)?.toUpperCase() + bulkAction?.slice(1)}
            </h3>
            <span className="text-sm text-muted-foreground">
              ({selectedRequests?.length} request{selectedRequests?.length !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Selected Requests Preview */}
          <div className="bg-muted/30 rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-2">Selected Requests:</div>
            <div className="flex flex-wrap gap-1">
              {selectedRequests?.slice(0, 10)?.map((requestId) => (
                <span 
                  key={requestId}
                  className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-mono"
                >
                  {requestId}
                </span>
              ))}
              {selectedRequests?.length > 10 && (
                <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                  +{selectedRequests?.length - 10} more
                </span>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4">
            {bulkAction === 'delegate' && (
              <Select
                label="Delegate To"
                options={delegateOptions}
                value={selectedDelegate}
                onChange={setSelectedDelegate}
                placeholder="Select delegate..."
                required
                searchable
              />
            )}

            <Input
              label={`${bulkAction?.charAt(0)?.toUpperCase() + bulkAction?.slice(1)} Comment`}
              value={bulkComment}
              onChange={(e) => setBulkComment(e?.target?.value)}
              placeholder={`Enter reason for bulk ${bulkAction}...`}
              required
              description={`This comment will be applied to all ${selectedRequests?.length} selected requests`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant={bulkAction === 'approve' ? 'default' : bulkAction === 'reject' ? 'destructive' : 'outline'}
              onClick={submitBulkAction}
              disabled={
                !bulkComment?.trim() || 
                (bulkAction === 'delegate' && !selectedDelegate)
              }
              iconName={getActionIcon(bulkAction)}
              iconPosition="left"
            >
              Confirm Bulk {bulkAction?.charAt(0)?.toUpperCase() + bulkAction?.slice(1)}
            </Button>
            
            <Button
              variant="ghost"
              onClick={resetForm}
            >
              Cancel
            </Button>
          </div>

          {/* Warning Message */}
          <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Bulk Action Warning</p>
              <p className="text-warning/80 mt-1">
                This action will be applied to {selectedRequests?.length} request{selectedRequests?.length !== 1 ? 's' : ''} 
                and cannot be undone. Please ensure you have reviewed all selected requests.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionPanel;