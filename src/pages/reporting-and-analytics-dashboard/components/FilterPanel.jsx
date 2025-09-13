import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ isOpen, filters, onFiltersChange, onSavePreset, onLoadPreset }) => {
  const [presetName, setPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);

  const branchOptions = [
    { value: 'all', label: 'All Branches' },
    { value: 'PP001', label: 'Phnom Penh Central' },
    { value: 'SR001', label: 'Siem Reap Branch' },
    { value: 'BB001', label: 'Battambang Branch' },
    { value: 'KP001', label: 'Kampong Cham Branch' },
    { value: 'CMC001', label: 'Cash Management Center' }
  ];

  const currencyOptions = [
    { value: 'all', label: 'All Currencies' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'KHR', label: 'Cambodian Riel (KHR)' }
  ];

  const requestTypeOptions = [
    { value: 'all', label: 'All Request Types' },
    { value: 'branch_to_cmc', label: 'Branch to CMC' },
    { value: 'cmc_to_branch', label: 'CMC to Branch' },
    { value: 'branch_to_branch', label: 'Branch to Branch' },
    { value: 'over_limit', label: 'Over Limit Approvals' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' }
  ];

  const savedPresets = [
    { id: 'daily_summary', name: 'Daily Summary', description: 'Today\'s transactions across all branches' },
    { id: 'weekly_branch', name: 'Weekly Branch Performance', description: 'Last 7 days branch comparison' },
    { id: 'monthly_executive', name: 'Monthly Executive Report', description: 'Monthly overview for executives' },
    { id: 'compliance_audit', name: 'Compliance Audit', description: 'Regulatory compliance metrics' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange?.({
      ...filters,
      [key]: value
    });
  };

  const handleSavePreset = () => {
    if (presetName?.trim()) {
      onSavePreset?.(presetName, filters);
      setPresetName('');
      setShowPresetInput(false);
    }
  };

  const handleClearFilters = () => {
    onFiltersChange?.({
      dateRange: 'last_7_days',
      branches: 'all',
      currency: 'all',
      requestType: 'all',
      status: 'all',
      amountMin: '',
      amountMax: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-muted/30 border-b border-border p-6 animate-slide-in">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Date Range</h3>
            <Select
              options={[
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'last_7_days', label: 'Last 7 Days' },
                { value: 'last_30_days', label: 'Last 30 Days' },
                { value: 'this_month', label: 'This Month' },
                { value: 'last_month', label: 'Last Month' },
                { value: 'this_quarter', label: 'This Quarter' },
                { value: 'custom', label: 'Custom Range' }
              ]}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
            
            {filters?.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  label="From"
                  value={filters?.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
                />
                <Input
                  type="date"
                  label="To"
                  value={filters?.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
                />
              </div>
            )}
          </div>

          {/* Branch & Currency */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Location & Currency</h3>
            <Select
              label="Branch"
              options={branchOptions}
              value={filters?.branches}
              onChange={(value) => handleFilterChange('branches', value)}
              searchable
            />
            <Select
              label="Currency"
              options={currencyOptions}
              value={filters?.currency}
              onChange={(value) => handleFilterChange('currency', value)}
            />
          </div>

          {/* Request Type & Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Request Details</h3>
            <Select
              label="Request Type"
              options={requestTypeOptions}
              value={filters?.requestType}
              onChange={(value) => handleFilterChange('requestType', value)}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>

          {/* Amount Range & Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Amount Range</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                label="Min Amount"
                placeholder="0"
                value={filters?.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
              />
              <Input
                type="number"
                label="Max Amount"
                placeholder="No limit"
                value={filters?.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                iconName="X"
                iconPosition="left"
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowPresetInput(!showPresetInput)}
                iconName="Save"
                iconPosition="left"
                className="flex-1"
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Save Preset */}
        {showPresetInput && (
          <div className="mt-6 p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <Input
                placeholder="Enter preset name"
                value={presetName}
                onChange={(e) => setPresetName(e?.target?.value)}
                className="flex-1"
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleSavePreset}
                disabled={!presetName?.trim()}
              >
                Save Preset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPresetInput(false)}
                iconName="X"
              />
            </div>
          </div>
        )}

        {/* Saved Presets */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Saved Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {savedPresets?.map((preset) => (
              <button
                key={preset?.id}
                onClick={() => onLoadPreset?.(preset)}
                className="p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors duration-150 text-left"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">{preset?.name}</h4>
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{preset?.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;