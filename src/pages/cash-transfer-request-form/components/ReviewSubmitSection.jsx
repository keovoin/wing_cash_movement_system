import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReviewSubmitSection = ({ 
  formData, 
  onSubmit, 
  onSaveDraft,
  isSubmitting = false,
  isSavingDraft = false,
  disabled = false 
}) => {
  const [confirmations, setConfirmations] = useState({
    accuracy: false,
    authorization: false,
    compliance: false
  });

  const formatCurrency = (amount, currency) => {
    if (!amount || !currency) return 'N/A';
    
    const numValue = parseFloat(amount);
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      })?.format(numValue);
    } else {
      return new Intl.NumberFormat('km-KH')?.format(numValue) + ' KHR';
    }
  };

  const getRequestTypeLabel = (type) => {
    const types = {
      'branch-to-cmc': 'Branch Request Cash from CMC',
      'branch-to-cmc-transfer': 'Branch Transfer Cash to CMC',
      'branch-to-branch': 'Branch to Branch/Nostro Transfer'
    };
    return types?.[type] || type;
  };

  const getPriorityLabel = (priority) => {
    const priorities = {
      'normal': 'Normal',
      'urgent': 'Urgent',
      'critical': 'Critical'
    };
    return priorities?.[priority] || priority;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'urgent': return 'text-warning';
      default: return 'text-foreground';
    }
  };

  const handleConfirmationChange = (key, checked) => {
    setConfirmations(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const canSubmit = () => {
    return Object.values(confirmations)?.every(Boolean) && !disabled;
  };

  const generateRequestId = () => {
    const timestamp = new Date()?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0];
    const random = Math.random()?.toString(36)?.substring(2, 6)?.toUpperCase();
    return `CTR${timestamp}${random}`;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;
    
    const requestData = {
      ...formData,
      requestId: generateRequestId(),
      submittedAt: new Date()?.toISOString(),
      status: 'pending_approval'
    };
    
    onSubmit(requestData);
  };

  const handleSaveDraft = () => {
    const draftData = {
      ...formData,
      savedAt: new Date()?.toISOString(),
      status: 'draft'
    };
    
    onSaveDraft(draftData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="CheckCircle2" size={20} className="text-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Review & Submit</h3>
      </div>
      {/* Request Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Request Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Request Type
              </label>
              <p className="text-sm font-medium text-foreground mt-1">
                {getRequestTypeLabel(formData?.requestType)}
              </p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Branch
              </label>
              <p className="text-sm font-medium text-foreground mt-1">
                {formData?.branchName || 'Not selected'}
              </p>
              <p className="text-xs text-muted-foreground">
                Code: {formData?.branchCode || 'N/A'}
              </p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Priority
              </label>
              <p className={`text-sm font-medium mt-1 ${getPriorityColor(formData?.priority)}`}>
                {getPriorityLabel(formData?.priority)}
              </p>
            </div>
          </div>
          
          {/* Amount Information */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </label>
              <p className="text-lg font-semibold text-foreground mt-1 font-mono">
                {formatCurrency(formData?.amount, formData?.currency)}
              </p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Effective Date
              </label>
              <p className="text-sm font-medium text-foreground mt-1">
                {formData?.effectiveDate ? new Date(formData.effectiveDate)?.toLocaleDateString('en-GB') : 'Not set'}
              </p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Attachments
              </label>
              <p className="text-sm font-medium text-foreground mt-1">
                {formData?.attachments?.length || 0} file(s) attached
              </p>
            </div>
          </div>
        </div>
        
        {/* Reason */}
        <div className="mt-6">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Reason for Transfer
          </label>
          <p className="text-sm text-foreground mt-1 p-3 bg-muted/50 rounded-md">
            {formData?.reason || 'No reason provided'}
          </p>
        </div>
      </div>
      {/* Denomination Breakdown */}
      {formData?.denominations && Object.keys(formData?.denominations)?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">Denomination Breakdown</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(formData?.denominations)?.map(([value, count]) => {
              if (count === 0) return null;
              return (
                <div key={value} className="text-center p-3 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {formData?.currency === 'USD' ? `$${value}` : `${parseInt(value)?.toLocaleString()} KHR`}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(value * count, formData?.currency)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Attached Files */}
      {formData?.attachments && formData?.attachments?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">Attached Documents</h4>
          
          <div className="space-y-2">
            {formData?.attachments?.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-md">
                <Icon name="FileText" size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file?.size / 1024 / 1024)?.toFixed(2)} MB
                  </p>
                </div>
                <Icon name="ShieldCheck" size={16} className="text-success" />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Confirmations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Confirmations Required</h4>
        
        <div className="space-y-4">
          <Checkbox
            label="I confirm that all information provided is accurate and complete"
            description="All details have been verified and are correct to the best of my knowledge"
            checked={confirmations?.accuracy}
            onChange={(e) => handleConfirmationChange('accuracy', e?.target?.checked)}
            disabled={disabled}
          />
          
          <Checkbox
            label="I have proper authorization to submit this request"
            description="I am authorized to initiate cash transfer requests for this branch"
            checked={confirmations?.authorization}
            onChange={(e) => handleConfirmationChange('authorization', e?.target?.checked)}
            disabled={disabled}
          />
          
          <Checkbox
            label="I understand the compliance and audit requirements"
            description="This request will be subject to approval workflows and audit trails"
            checked={confirmations?.compliance}
            onChange={(e) => handleConfirmationChange('compliance', e?.target?.checked)}
            disabled={disabled}
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={disabled || isSavingDraft}
            loading={isSavingDraft}
            iconName="Save"
            iconPosition="left"
          >
            Save Draft
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <Icon name="Info" size={12} className="inline mr-1" />
            Drafts are auto-saved every 30 seconds
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => window.print()}
            disabled={disabled}
            iconName="Printer"
            iconPosition="left"
          >
            Print Summary
          </Button>
          
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!canSubmit() || isSubmitting}
            loading={isSubmitting}
            iconName="Send"
            iconPosition="left"
          >
            Submit Request
          </Button>
        </div>
      </div>
      {/* Submission Info */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Once submitted, this request will enter the approval workflow</p>
            <p>• You will receive email notifications for status updates</p>
            <p>• Request modifications may require re-approval</p>
            <p>• Processing time depends on amount and priority level</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitSection;