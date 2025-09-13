import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const CurrencyAmountForm = ({ 
  currency, 
  onCurrencyChange, 
  amount, 
  onAmountChange, 
  denominations, 
  onDenominationsChange,
  disabled = false,
  errors = {}
}) => {
  const [showDenominations, setShowDenominations] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)', description: 'United States Dollar' },
    { value: 'KHR', label: 'Cambodian Riel (KHR)', description: 'Cambodian Riel' }
  ];

  // USD denominations
  const usdDenominations = [
    { value: 100, label: '$100', count: 0 },
    { value: 50, label: '$50', count: 0 },
    { value: 20, label: '$20', count: 0 },
    { value: 10, label: '$10', count: 0 },
    { value: 5, label: '$5', count: 0 },
    { value: 1, label: '$1', count: 0 }
  ];

  // KHR denominations
  const khrDenominations = [
    { value: 100000, label: '100,000 KHR', count: 0 },
    { value: 50000, label: '50,000 KHR', count: 0 },
    { value: 20000, label: '20,000 KHR', count: 0 },
    { value: 10000, label: '10,000 KHR', count: 0 },
    { value: 5000, label: '5,000 KHR', count: 0 },
    { value: 2000, label: '2,000 KHR', count: 0 },
    { value: 1000, label: '1,000 KHR', count: 0 },
    { value: 500, label: '500 KHR', count: 0 }
  ];

  const getCurrentDenominations = () => {
    return currency === 'USD' ? usdDenominations : khrDenominations;
  };

  const formatCurrency = (value, curr = currency) => {
    if (!value) return curr === 'USD' ? '$0.00' : '0 KHR';
    
    const numValue = parseFloat(value);
    if (curr === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      })?.format(numValue);
    } else {
      return new Intl.NumberFormat('km-KH')?.format(numValue) + ' KHR';
    }
  };

  const calculateDenominationTotal = () => {
    const currentDenoms = getCurrentDenominations();
    const total = currentDenoms?.reduce((sum, denom) => {
      const count = denominations?.[denom?.value] || 0;
      return sum + (denom?.value * count);
    }, 0);
    setCalculatedTotal(total);
    return total;
  };

  const handleDenominationChange = (denominationValue, count) => {
    const newDenominations = {
      ...denominations,
      [denominationValue]: parseInt(count) || 0
    };
    onDenominationsChange(newDenominations);
  };

  const autoCalculateFromAmount = () => {
    if (!amount || amount <= 0) return;
    
    const targetAmount = parseFloat(amount);
    const currentDenoms = getCurrentDenominations();
    const newDenominations = {};
    let remaining = targetAmount;
    
    // Greedy algorithm for denomination breakdown
    for (const denom of currentDenoms) {
      const count = Math.floor(remaining / denom?.value);
      newDenominations[denom.value] = count;
      remaining = Math.round((remaining - (count * denom?.value)) * 100) / 100;
    }
    
    onDenominationsChange(newDenominations);
  };

  const clearDenominations = () => {
    const currentDenoms = getCurrentDenominations();
    const clearedDenominations = {};
    currentDenoms?.forEach(denom => {
      clearedDenominations[denom.value] = 0;
    });
    onDenominationsChange(clearedDenominations);
  };

  useEffect(() => {
    calculateDenominationTotal();
  }, [denominations, currency]);

  useEffect(() => {
    // Clear denominations when currency changes
    if (currency) {
      clearDenominations();
    }
  }, [currency]);

  const getAmountThresholdWarning = () => {
    if (!amount || !currency) return null;
    
    const numAmount = parseFloat(amount);
    const thresholds = {
      USD: { warning: 50000, critical: 100000 },
      KHR: { warning: 200000000, critical: 400000000 }
    };
    
    const threshold = thresholds?.[currency];
    if (numAmount >= threshold?.critical) {
      return { type: 'critical', message: 'Amount requires executive approval' };
    } else if (numAmount >= threshold?.warning) {
      return { type: 'warning', message: 'Amount requires manager approval' };
    }
    return null;
  };

  const thresholdWarning = getAmountThresholdWarning();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="DollarSign" size={20} className="text-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Currency & Amount</h3>
      </div>
      {/* Currency Selection */}
      <Select
        label="Currency"
        description="Select the currency for this transfer"
        options={currencyOptions}
        value={currency}
        onChange={onCurrencyChange}
        placeholder="Select currency..."
        disabled={disabled}
        error={errors?.currency}
        required
        className="mb-4"
      />
      {/* Amount Input */}
      <Input
        label="Transfer Amount"
        type="number"
        placeholder={currency === 'USD' ? '0.00' : '0'}
        value={amount}
        onChange={(e) => onAmountChange(e?.target?.value)}
        disabled={disabled || !currency}
        error={errors?.amount}
        description={`Enter the total amount in ${currency || 'selected currency'}`}
        required
        min="0"
        step={currency === 'USD' ? '0.01' : '1'}
        className="mb-4"
      />
      {/* Amount Threshold Warning */}
      {thresholdWarning && (
        <div className={`p-3 rounded-md border ${
          thresholdWarning?.type === 'critical' ?'bg-error/10 border-error/20 text-error' :'bg-warning/10 border-warning/20 text-warning'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon 
              name={thresholdWarning?.type === 'critical' ? 'AlertTriangle' : 'AlertCircle'} 
              size={16} 
            />
            <span className="text-sm font-medium">{thresholdWarning?.message}</span>
          </div>
        </div>
      )}
      {/* Denomination Breakdown */}
      {currency && amount && parseFloat(amount) > 0 && (
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground">Denomination Breakdown</h4>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={autoCalculateFromAmount}
                disabled={disabled}
                iconName="Calculator"
                iconPosition="left"
              >
                Auto Calculate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDenominations}
                disabled={disabled}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getCurrentDenominations()?.map((denom) => (
              <div key={denom?.value} className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  {denom?.label}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={denominations?.[denom?.value] || ''}
                  onChange={(e) => handleDenominationChange(denom?.value, e?.target?.value)}
                  disabled={disabled}
                  min="0"
                  className="text-center"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {formatCurrency((denominations?.[denom?.value] || 0) * denom?.value)}
                </p>
              </div>
            ))}
          </div>

          {/* Calculation Summary */}
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Calculated Total:</span>
              <span className="text-sm font-mono font-medium text-foreground">
                {formatCurrency(calculatedTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">Entered Amount:</span>
              <span className="text-sm font-mono font-medium text-foreground">
                {formatCurrency(amount)}
              </span>
            </div>
            {Math.abs(calculatedTotal - parseFloat(amount || 0)) > 0.01 && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-error">Difference:</span>
                <span className="text-sm font-mono font-medium text-error">
                  {formatCurrency(Math.abs(calculatedTotal - parseFloat(amount || 0)))}
                </span>
              </div>
            )}
          </div>

          {/* Validation Status */}
          <div className="mt-3 flex items-center space-x-2">
            {Math.abs(calculatedTotal - parseFloat(amount || 0)) <= 0.01 ? (
              <>
                <Icon name="CheckCircle2" size={16} className="text-success" />
                <span className="text-xs text-success">Denomination breakdown matches amount</span>
              </>
            ) : (
              <>
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <span className="text-xs text-warning">Denomination breakdown does not match amount</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyAmountForm;