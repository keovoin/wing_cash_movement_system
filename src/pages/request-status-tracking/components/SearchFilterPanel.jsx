import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SearchFilterPanel = ({ onFilterChange, savedSearches, onSaveSearch, onLoadSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [priority, setPriority] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchName, setSearchName] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'on_hold', label: 'On Hold' }
  ];

  const typeOptions = [
    { value: 'branch_to_cmc', label: 'Branch to CMC' },
    { value: 'cmc_to_branch', label: 'CMC to Branch' },
    { value: 'branch_to_branch', label: 'Branch to Branch' },
    { value: 'over_limit', label: 'Over Limit Approval' }
  ];

  const branchOptions = [
    { value: 'BR001', label: 'Phnom Penh Main Branch' },
    { value: 'BR002', label: 'Siem Reap Branch' },
    { value: 'BR003', label: 'Battambang Branch' },
    { value: 'BR004', label: 'Kampong Cham Branch' },
    { value: 'BR005', label: 'Sihanoukville Branch' },
    { value: 'CMC001', label: 'Cash Management Center' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'KHR', label: 'Cambodian Riel (KHR)' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  useEffect(() => {
    const filters = {
      searchText,
      dateRange,
      statuses: selectedStatuses,
      types: selectedTypes,
      branches: selectedBranches,
      currencies: selectedCurrencies,
      amountRange,
      priority
    };
    onFilterChange(filters);
  }, [searchText, dateRange, selectedStatuses, selectedTypes, selectedBranches, selectedCurrencies, amountRange, priority]);

  const handleStatusChange = (status, checked) => {
    if (checked) {
      setSelectedStatuses(prev => [...prev, status]);
    } else {
      setSelectedStatuses(prev => prev?.filter(s => s !== status));
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setDateRange({ start: '', end: '' });
    setSelectedStatuses([]);
    setSelectedTypes([]);
    setSelectedBranches([]);
    setSelectedCurrencies([]);
    setAmountRange({ min: '', max: '' });
    setPriority('');
  };

  const handleSaveSearch = () => {
    if (searchName?.trim()) {
      const searchConfig = {
        name: searchName,
        filters: {
          searchText,
          dateRange,
          statuses: selectedStatuses,
          types: selectedTypes,
          branches: selectedBranches,
          currencies: selectedCurrencies,
          amountRange,
          priority
        },
        createdAt: new Date()?.toISOString()
      };
      onSaveSearch(searchConfig);
      setSearchName('');
    }
  };

  const activeFilterCount = [
    searchText,
    dateRange?.start || dateRange?.end,
    selectedStatuses?.length > 0,
    selectedTypes?.length > 0,
    selectedBranches?.length > 0,
    selectedCurrencies?.length > 0,
    amountRange?.min || amountRange?.max,
    priority
  ]?.filter(Boolean)?.length;

  return (
    <div className="w-full h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Search & Filter</h3>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        
        {/* Quick Search */}
        <Input
          type="search"
          placeholder="Search requests, comments, IDs..."
          value={searchText}
          onChange={(e) => setSearchText(e?.target?.value)}
          className="mb-3"
        />

        {/* Saved Searches */}
        {savedSearches && savedSearches?.length > 0 && (
          <Select
            placeholder="Load saved search..."
            options={savedSearches?.map(search => ({
              value: search?.id,
              label: search?.name,
              description: `${search?.filters?.statuses?.length || 0} statuses, ${search?.filters?.types?.length || 0} types`
            }))}
            value=""
            onChange={(value) => onLoadSearch(value)}
            className="mb-3"
          />
        )}
      </div>
      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
          <div className="grid grid-cols-1 gap-2">
            <Input
              type="date"
              placeholder="Start date"
              value={dateRange?.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e?.target?.value }))}
            />
            <Input
              type="date"
              placeholder="End date"
              value={dateRange?.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e?.target?.value }))}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status ({selectedStatuses?.length} selected)
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {statusOptions?.map(status => (
              <Checkbox
                key={status?.value}
                label={status?.label}
                checked={selectedStatuses?.includes(status?.value)}
                onChange={(e) => handleStatusChange(status?.value, e?.target?.checked)}
              />
            ))}
          </div>
        </div>

        {/* Request Type */}
        <div>
          <Select
            label="Request Type"
            placeholder="All request types"
            multiple
            options={typeOptions}
            value={selectedTypes}
            onChange={setSelectedTypes}
          />
        </div>

        {/* Branch Filter */}
        <div>
          <Select
            label="Branch/Location"
            placeholder="All branches"
            multiple
            searchable
            options={branchOptions}
            value={selectedBranches}
            onChange={setSelectedBranches}
          />
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full justify-between"
        >
          <span>Advanced Filters</span>
          <Icon name={showAdvanced ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>

        {showAdvanced && (
          <div className="space-y-4 pt-2 border-t border-border">
            {/* Currency Filter */}
            <Select
              label="Currency"
              placeholder="All currencies"
              multiple
              options={currencyOptions}
              value={selectedCurrencies}
              onChange={setSelectedCurrencies}
            />

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount Range</label>
              <div className="grid grid-cols-1 gap-2">
                <Input
                  type="number"
                  placeholder="Minimum amount"
                  value={amountRange?.min}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, min: e?.target?.value }))}
                />
                <Input
                  type="number"
                  placeholder="Maximum amount"
                  value={amountRange?.max}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, max: e?.target?.value }))}
                />
              </div>
            </div>

            {/* Priority Filter */}
            <Select
              label="Priority Level"
              options={priorityOptions}
              value={priority}
              onChange={setPriority}
            />
          </div>
        )}
      </div>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Save Search */}
        <div className="flex space-x-2">
          <Input
            placeholder="Search name..."
            value={searchName}
            onChange={(e) => setSearchName(e?.target?.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSearch}
            disabled={!searchName?.trim()}
          >
            <Icon name="Save" size={14} />
          </Button>
        </div>

        {/* Clear Filters */}
        <Button
          variant="ghost"
          onClick={handleClearFilters}
          disabled={activeFilterCount === 0}
          className="w-full"
        >
          <Icon name="X" size={16} className="mr-2" />
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterPanel;