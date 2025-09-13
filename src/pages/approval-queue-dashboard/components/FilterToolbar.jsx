import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ filters, onFiltersChange, onSavePreset, savedPresets = [] }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  const requestTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'branch-to-cmc', label: 'Branch to CMC' },
    { value: 'cmc-to-branch', label: 'CMC to Branch' },
    { value: 'branch-to-branch', label: 'Branch to Branch' },
    { value: 'over-limit', label: 'Over Limit' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-review', label: 'In Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'escalated', label: 'Escalated' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Low' }
  ];

  const currencyOptions = [
    { value: 'all', label: 'All Currencies' },
    { value: 'USD', label: 'USD' },
    { value: 'KHR', label: 'KHR' }
  ];

  const branchOptions = [
    { value: 'all', label: 'All Branches' },
    { value: 'BR001', label: 'Phnom Penh Main' },
    { value: 'BR002', label: 'Siem Reap' },
    { value: 'BR003', label: 'Battambang' },
    { value: 'BR004', label: 'Kampong Cham' },
    { value: 'BR005', label: 'Preah Sihanouk' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSavePreset = () => {
    if (presetName?.trim()) {
      onSavePreset(presetName, filters);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const handleLoadPreset = (preset) => {
    onFiltersChange(preset?.filters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      requestType: 'all',
      status: 'all',
      priority: 'all',
      currency: 'all',
      branch: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
  };

  const activeFiltersCount = Object.values(filters)?.filter(value => 
    value && value !== 'all' && value !== ''
  )?.length;

  return (
    <div className="bg-card border-b border-border p-4 space-y-4">
      {/* Main Filter Row */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search by ID, submitter, or description..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Quick Filters */}
        <Select
          options={requestTypeOptions}
          value={filters?.requestType || 'all'}
          onChange={(value) => handleFilterChange('requestType', value)}
          placeholder="Request Type"
          className="w-48"
        />

        <Select
          options={statusOptions}
          value={filters?.status || 'all'}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Status"
          className="w-40"
        />

        <Select
          options={priorityOptions}
          value={filters?.priority || 'all'}
          onChange={(value) => handleFilterChange('priority', value)}
          placeholder="Priority"
          className="w-36"
        />

        {/* Advanced Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          Advanced
        </Button>

        {/* Filter Actions */}
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
              className="text-muted-foreground"
            >
              Clear ({activeFiltersCount})
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => setShowSavePreset(true)}
            iconName="Bookmark"
            iconPosition="left"
          >
            Save
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <Select
            label="Currency"
            options={currencyOptions}
            value={filters?.currency || 'all'}
            onChange={(value) => handleFilterChange('currency', value)}
          />

          <Select
            label="Branch"
            options={branchOptions}
            value={filters?.branch || 'all'}
            onChange={(value) => handleFilterChange('branch', value)}
            searchable
          />

          <Input
            label="Date From"
            type="date"
            value={filters?.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          />

          <Input
            label="Date To"
            type="date"
            value={filters?.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          />

          <Input
            label="Min Amount"
            type="number"
            placeholder="0.00"
            value={filters?.amountMin || ''}
            onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
          />

          <Input
            label="Max Amount"
            type="number"
            placeholder="999,999.00"
            value={filters?.amountMax || ''}
            onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
          />
        </div>
      )}
      {/* Saved Presets */}
      {savedPresets?.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Quick Filters:</span>
          {savedPresets?.map((preset, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleLoadPreset(preset)}
              className="text-xs"
            >
              {preset?.name}
            </Button>
          ))}
        </div>
      )}
      {/* Save Preset Modal */}
      {showSavePreset && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">Save Filter Preset</h3>
            <Input
              label="Preset Name"
              value={presetName}
              onChange={(e) => setPresetName(e?.target?.value)}
              placeholder="Enter preset name..."
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowSavePreset(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePreset}
                disabled={!presetName?.trim()}
              >
                Save Preset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;