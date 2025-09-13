import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReasonDateForm = ({ 
  reason, 
  onReasonChange, 
  effectiveDate, 
  onEffectiveDateChange, 
  priority,
  onPriorityChange,
  disabled = false,
  errors = {}
}) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [isBusinessDay, setIsBusinessDay] = useState(true);
  const [dateWarning, setDateWarning] = useState(null);

  const maxCharacters = 500;
  const minCharacters = 20;

  const priorityOptions = [
    { value: 'normal', label: 'Normal', description: 'Standard processing time' },
    { value: 'urgent', label: 'Urgent', description: 'Expedited processing required' },
    { value: 'critical', label: 'Critical', description: 'Immediate attention required' }
  ];

  const reasonTemplates = [
    { value: '', label: 'Select a template...', description: '' },
    { 
      value: 'Daily cash requirement for branch operations and customer withdrawals.', 
      label: 'Daily Operations', 
      description: 'Standard daily cash needs' 
    },
    { 
      value: 'ATM replenishment required due to high withdrawal volume.', 
      label: 'ATM Replenishment', 
      description: 'ATM cash shortage' 
    },
    { 
      value: 'Excess cash transfer to CMC due to large deposits received.', 
      label: 'Excess Cash Transfer', 
      description: 'Large deposit handling' 
    },
    { 
      value: 'Emergency cash requirement due to unexpected high demand.', 
      label: 'Emergency Request', 
      description: 'Urgent cash needs' 
    },
    { 
      value: 'End of day cash balancing and vault management.', 
      label: 'EOD Balancing', 
      description: 'Daily closing procedures' 
    }
  ];

  const isWeekend = (date) => {
    const day = new Date(date)?.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  const isHoliday = (date) => {
    // Mock holiday dates for Cambodia
    const holidays = [
      '2024-01-01', // New Year
      '2024-04-13', '2024-04-14', '2024-04-15', // Khmer New Year
      '2024-05-01', // Labor Day
      '2024-11-09', // Independence Day
    ];
    const dateStr = new Date(date)?.toISOString()?.split('T')?.[0];
    return holidays?.includes(dateStr);
  };

  const validateBusinessDay = (date) => {
    if (!date) return;
    
    const selectedDate = new Date(date);
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setDateWarning({ type: 'error', message: 'Effective date cannot be in the past' });
      setIsBusinessDay(false);
      return;
    }
    
    if (isWeekend(date)) {
      setDateWarning({ type: 'warning', message: 'Selected date is a weekend. Processing may be delayed.' });
      setIsBusinessDay(false);
      return;
    }
    
    if (isHoliday(date)) {
      setDateWarning({ type: 'warning', message: 'Selected date is a public holiday. Processing may be delayed.' });
      setIsBusinessDay(false);
      return;
    }
    
    const daysDiff = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));
    if (daysDiff > 30) {
      setDateWarning({ type: 'warning', message: 'Effective date is more than 30 days in the future' });
    } else {
      setDateWarning(null);
    }
    
    setIsBusinessDay(true);
  };

  const handleReasonChange = (value) => {
    setCharacterCount(value?.length);
    onReasonChange(value);
  };

  const handleTemplateSelect = (template) => {
    if (template) {
      handleReasonChange(template);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    return tomorrow?.toISOString()?.split('T')?.[0];
  };

  useEffect(() => {
    if (reason) {
      setCharacterCount(reason?.length);
    }
  }, [reason]);

  useEffect(() => {
    if (effectiveDate) {
      validateBusinessDay(effectiveDate);
    }
  }, [effectiveDate]);

  // Set default effective date to tomorrow
  useEffect(() => {
    if (!effectiveDate) {
      onEffectiveDateChange(getTomorrowDate());
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="FileText" size={20} className="text-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Request Details</h3>
      </div>
      {/* Priority Selection */}
      <Select
        label="Priority Level"
        description="Select the urgency level for this request"
        options={priorityOptions}
        value={priority}
        onChange={onPriorityChange}
        placeholder="Select priority..."
        disabled={disabled}
        error={errors?.priority}
        required
        className="mb-4"
      />
      {/* Reason Templates */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Quick Templates</label>
        <Select
          options={reasonTemplates}
          value=""
          onChange={handleTemplateSelect}
          placeholder="Choose a template to get started..."
          disabled={disabled}
          className="mb-2"
        />
      </div>
      {/* Reason Text Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Reason for Transfer <span className="text-error">*</span>
          </label>
          <span className={`text-xs ${
            characterCount < minCharacters 
              ? 'text-warning' 
              : characterCount > maxCharacters 
              ? 'text-error' :'text-muted-foreground'
          }`}>
            {characterCount}/{maxCharacters}
          </span>
        </div>
        
        <textarea
          value={reason}
          onChange={(e) => handleReasonChange(e?.target?.value)}
          placeholder="Provide a detailed reason for this cash transfer request. Include any relevant context, urgency factors, or special instructions..."
          disabled={disabled}
          maxLength={maxCharacters}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md text-sm resize-none transition-colors duration-150 ${
            errors?.reason 
              ? 'border-error focus:border-error focus:ring-error/20' :'border-border focus:border-primary focus:ring-primary/20'
          } ${disabled ? 'bg-muted cursor-not-allowed' : 'bg-background'}`}
        />
        
        {errors?.reason && (
          <p className="text-xs text-error mt-1">{errors?.reason}</p>
        )}
        
        {characterCount < minCharacters && (
          <p className="text-xs text-warning mt-1">
            Minimum {minCharacters} characters required ({minCharacters - characterCount} more needed)
          </p>
        )}
        
        <p className="text-xs text-muted-foreground">
          Provide clear justification for the transfer request. This will be reviewed by approvers.
        </p>
      </div>
      {/* Effective Date */}
      <div className="space-y-2">
        <Input
          label="Effective Date"
          type="date"
          value={effectiveDate}
          onChange={(e) => onEffectiveDateChange(e?.target?.value)}
          disabled={disabled}
          error={errors?.effectiveDate}
          description="Select the date when this transfer should be processed"
          required
          min={new Date()?.toISOString()?.split('T')?.[0]}
          className="mb-2"
        />
        
        {/* Business Day Validation */}
        <div className="flex items-center space-x-2">
          <Icon 
            name={isBusinessDay ? 'CheckCircle2' : 'AlertCircle'} 
            size={16} 
            className={isBusinessDay ? 'text-success' : 'text-warning'} 
          />
          <span className={`text-xs ${isBusinessDay ? 'text-success' : 'text-warning'}`}>
            {isBusinessDay ? 'Valid business day' : 'Non-business day selected'}
          </span>
        </div>
        
        {dateWarning && (
          <div className={`p-3 rounded-md border ${
            dateWarning?.type === 'error' ?'bg-error/10 border-error/20 text-error' :'bg-warning/10 border-warning/20 text-warning'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon 
                name={dateWarning?.type === 'error' ? 'AlertTriangle' : 'AlertCircle'} 
                size={16} 
              />
              <span className="text-sm">{dateWarning?.message}</span>
            </div>
          </div>
        )}
      </div>
      {/* Request Summary */}
      {reason && effectiveDate && priority && (
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Request Summary</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority:</span>
              <span className={`font-medium ${
                priority === 'critical' ? 'text-error' :
                priority === 'urgent' ? 'text-warning' : 'text-foreground'
              }`}>
                {priorityOptions?.find(p => p?.value === priority)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Effective Date:</span>
              <span className="font-medium text-foreground">
                {new Date(effectiveDate)?.toLocaleDateString('en-GB')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reason Length:</span>
              <span className="font-medium text-foreground">{characterCount} characters</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReasonDateForm;