import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const RequestDetailsForm = ({ formData, onFormChange, onSubmit, isSubmitting }) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'KHR', label: 'Cambodian Riel (KHR)' }
  ];

  const requestTypeOptions = [
    { value: 'cash_withdrawal', label: 'Cash Withdrawal Over Limit' },
    { value: 'transfer_outgoing', label: 'Outgoing Transfer Over Limit' },
    { value: 'transfer_incoming', label: 'Incoming Transfer Over Limit' },
    { value: 'foreign_exchange', label: 'Foreign Exchange Over Limit' },
    { value: 'loan_disbursement', label: 'Loan Disbursement Over Limit' },
    { value: 'other', label: 'Other Transaction Type' }
  ];

  const priorityOptions = [
    { value: 'normal', label: 'Normal Priority' },
    { value: 'urgent', label: 'Urgent (Same Day)' },
    { value: 'emergency', label: 'Emergency (Immediate)' }
  ];

  const branchOptions = [
    { value: 'BR001', label: 'Phnom Penh Main Branch' },
    { value: 'BR002', label: 'Siem Reap Branch' },
    { value: 'BR003', label: 'Battambang Branch' },
    { value: 'BR004', label: 'Kampong Cham Branch' },
    { value: 'BR005', label: 'Sihanoukville Branch' }
  ];

  const complianceTemplates = [
    {
      id: 'aml_check',
      title: 'Anti-Money Laundering Compliance',
      description: `This transaction has been reviewed for AML compliance.\nCustomer identity verified through standard KYC procedures.\nTransaction purpose documented and justified.\nNo suspicious activity indicators identified.`
    },
    {
      id: 'regulatory_approval',
      title: 'Regulatory Approval Request',
      description: `Request for regulatory approval of over-limit transaction.\nCompliance with NBC guidelines maintained.\nRisk assessment completed and documented.\nAll required documentation attached.`
    },
    {
      id: 'emergency_justification',
      title: 'Emergency Transaction Justification',
      description: `Emergency transaction requiring immediate processing.\nBusiness justification: Critical operational requirement.\nRisk mitigation measures implemented.\nPost-transaction review scheduled.`
    }
  ];

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleTemplateSelect = (template) => {
    handleInputChange('justification', template?.description);
  };

  const calculateApprovalLevel = () => {
    const amount = parseFloat(formData?.amount) || 0;
    if (amount <= 50000) return 'Branch Level';
    if (amount <= 200000) return 'Regional Level';
    if (amount <= 500000) return 'Head Office Level';
    return 'Executive Level';
  };

  const isHighValue = parseFloat(formData?.amount) > 200000;

  return (
    <div className="space-y-6">
      {/* Request Information */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="FileText" size={20} className="mr-2" />
          Request Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Request Type"
            description="Select the type of over-limit transaction"
            options={requestTypeOptions}
            value={formData?.requestType}
            onChange={(value) => handleInputChange('requestType', value)}
            required
          />
          
          <Select
            label="Branch"
            description="Select requesting branch"
            options={branchOptions}
            value={formData?.branch}
            onChange={(value) => handleInputChange('branch', value)}
            required
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Select
              label="Currency"
              options={currencyOptions}
              value={formData?.currency}
              onChange={(value) => handleInputChange('currency', value)}
              required
            />
            
            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              value={formData?.amount}
              onChange={(e) => handleInputChange('amount', e?.target?.value)}
              required
              className="font-mono"
            />
          </div>
          
          <Select
            label="Priority Level"
            description="Select processing priority"
            options={priorityOptions}
            value={formData?.priority}
            onChange={(value) => handleInputChange('priority', value)}
            required
          />
        </div>

        {/* Amount Threshold Indicator */}
        {formData?.amount && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Approval Level Required:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isHighValue ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
              }`}>
                {calculateApprovalLevel()}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Customer Information */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="User" size={20} className="mr-2" />
          Customer Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Customer Name"
            type="text"
            placeholder="Enter customer full name"
            value={formData?.customerName}
            onChange={(e) => handleInputChange('customerName', e?.target?.value)}
            required
          />
          
          <Input
            label="Account Number"
            type="text"
            placeholder="Enter account number"
            value={formData?.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e?.target?.value)}
            required
            className="font-mono"
          />
          
          <Input
            label="Customer ID"
            type="text"
            placeholder="Enter customer ID"
            value={formData?.customerId}
            onChange={(e) => handleInputChange('customerId', e?.target?.value)}
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+855 XX XXX XXX"
            value={formData?.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
            required
          />
        </div>
      </div>
      {/* Transaction Details */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CreditCard" size={20} className="mr-2" />
          Transaction Details
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Transaction Reference"
              type="text"
              placeholder="Auto-generated"
              value={formData?.transactionRef || `OLA-${Date.now()?.toString()?.slice(-8)}`}
              onChange={(e) => handleInputChange('transactionRef', e?.target?.value)}
              disabled
              className="font-mono"
            />
            
            <Input
              label="Effective Date"
              type="date"
              value={formData?.effectiveDate}
              onChange={(e) => handleInputChange('effectiveDate', e?.target?.value)}
              required
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Justification *
            </label>
            <div className="mb-2">
              <div className="flex flex-wrap gap-2">
                {complianceTemplates?.map((template) => (
                  <Button
                    key={template?.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTemplateSelect(template)}
                    className="text-xs"
                  >
                    {template?.title}
                  </Button>
                ))}
              </div>
            </div>
            <textarea
              className="w-full min-h-32 p-3 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y"
              placeholder="Provide detailed justification for this over-limit transaction..."
              value={formData?.justification}
              onChange={(e) => handleInputChange('justification', e?.target?.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 50 characters required for compliance
            </p>
          </div>
        </div>
      </div>
      {/* Risk Assessment (High Value Transactions) */}
      {isHighValue && (
        <div className="bg-card rounded-lg border p-6 border-warning/20 bg-warning/5">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Shield" size={20} className="mr-2 text-warning" />
            Risk Assessment Checklist
            <span className="ml-2 px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
              Required for High-Value
            </span>
          </h3>
          
          <div className="space-y-3">
            <Checkbox
              label="Customer identity verified through enhanced due diligence"
              checked={formData?.riskChecks?.identityVerified}
              onChange={(e) => handleInputChange('riskChecks', {
                ...formData?.riskChecks,
                identityVerified: e?.target?.checked
              })}
            />
            
            <Checkbox
              label="Transaction purpose documented and reasonable"
              checked={formData?.riskChecks?.purposeDocumented}
              onChange={(e) => handleInputChange('riskChecks', {
                ...formData?.riskChecks,
                purposeDocumented: e?.target?.checked
              })}
            />
            
            <Checkbox
              label="Source of funds verified and legitimate"
              checked={formData?.riskChecks?.fundsVerified}
              onChange={(e) => handleInputChange('riskChecks', {
                ...formData?.riskChecks,
                fundsVerified: e?.target?.checked
              })}
            />
            
            <Checkbox
              label="No suspicious activity indicators present"
              checked={formData?.riskChecks?.noSuspiciousActivity}
              onChange={(e) => handleInputChange('riskChecks', {
                ...formData?.riskChecks,
                noSuspiciousActivity: e?.target?.checked
              })}
            />
            
            <Checkbox
              label="Regulatory compliance requirements met"
              checked={formData?.riskChecks?.complianceMet}
              onChange={(e) => handleInputChange('riskChecks', {
                ...formData?.riskChecks,
                complianceMet: e?.target?.checked
              })}
            />
          </div>
        </div>
      )}
      {/* Advanced Options */}
      <div className="bg-card rounded-lg border p-6">
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Settings" size={20} className="mr-2" />
            Advanced Options
          </h3>
          <Icon 
            name="ChevronDown" 
            size={20} 
            className={`transition-transform duration-200 ${showAdvancedOptions ? 'rotate-180' : ''}`}
          />
        </button>
        
        {showAdvancedOptions && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Delegation Authority"
                type="text"
                placeholder="Enter delegated approver (if applicable)"
                value={formData?.delegationAuthority}
                onChange={(e) => handleInputChange('delegationAuthority', e?.target?.value)}
              />
              
              <Input
                label="External Reference"
                type="text"
                placeholder="External system reference"
                value={formData?.externalRef}
                onChange={(e) => handleInputChange('externalRef', e?.target?.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Internal Notes
              </label>
              <textarea
                className="w-full min-h-20 p-3 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y"
                placeholder="Internal notes for approvers (not visible to customer)..."
                value={formData?.internalNotes}
                onChange={(e) => handleInputChange('internalNotes', e?.target?.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Checkbox
                label="Rush processing required"
                checked={formData?.rushProcessing}
                onChange={(e) => handleInputChange('rushProcessing', e?.target?.checked)}
              />
              
              <Checkbox
                label="Notify customer of approval status"
                checked={formData?.notifyCustomer}
                onChange={(e) => handleInputChange('notifyCustomer', e?.target?.checked)}
              />
            </div>
          </div>
        )}
      </div>
      {/* Submit Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Save" size={16} />
          <span>Auto-saved 2 minutes ago</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" disabled={isSubmitting}>
            Save Draft
          </Button>
          
          <Button 
            onClick={onSubmit}
            loading={isSubmitting}
            iconName="Send"
            iconPosition="right"
          >
            Submit for Approval
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsForm;