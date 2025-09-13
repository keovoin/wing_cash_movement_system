import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const BranchSelector = ({ 
  selectedBranch, 
  onBranchChange, 
  requestType, 
  disabled = false,
  error 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock branch data
  const branches = [
    { value: 'BR001', label: 'Phnom Penh Main Branch', code: 'BR001', region: 'Phnom Penh', status: 'active' },
    { value: 'BR002', label: 'Siem Reap Branch', code: 'BR002', region: 'Siem Reap', status: 'active' },
    { value: 'BR003', label: 'Battambang Branch', code: 'BR003', region: 'Battambang', status: 'active' },
    { value: 'BR004', label: 'Kampong Cham Branch', code: 'BR004', region: 'Kampong Cham', status: 'active' },
    { value: 'BR005', label: 'Preah Sihanouk Branch', code: 'BR005', region: 'Preah Sihanouk', status: 'active' },
    { value: 'BR006', label: 'Kandal Branch', code: 'BR006', region: 'Kandal', status: 'active' },
    { value: 'BR007', label: 'Takeo Branch', code: 'BR007', region: 'Takeo', status: 'active' },
    { value: 'BR008', label: 'Kampot Branch', code: 'BR008', region: 'Kampot', status: 'active' },
    { value: 'CMC001', label: 'Cash Management Center', code: 'CMC001', region: 'Phnom Penh', status: 'active' }
  ];

  const getFilteredBranches = () => {
    let filtered = branches;
    
    // Filter based on request type
    if (requestType === 'branch-to-cmc' || requestType === 'branch-to-cmc-transfer') {
      filtered = branches?.filter(branch => branch?.code !== 'CMC001');
    } else if (requestType === 'branch-to-branch') {
      filtered = branches?.filter(branch => branch?.code !== 'CMC001');
    }
    
    return filtered?.map(branch => ({
      value: branch?.value,
      label: `${branch?.label} (${branch?.code})`,
      description: `Region: ${branch?.region}`
    }));
  };

  const getFieldLabel = () => {
    switch (requestType) {
      case 'branch-to-cmc':
        return 'Requesting Branch';
      case 'branch-to-cmc-transfer':
        return 'Source Branch';
      case 'branch-to-branch':
        return 'Source Branch';
      default:
        return 'Branch';
    }
  };

  const getFieldDescription = () => {
    switch (requestType) {
      case 'branch-to-cmc':
        return 'Select the branch requesting cash from CMC';
      case 'branch-to-cmc-transfer':
        return 'Select the branch transferring cash to CMC';
      case 'branch-to-branch':
        return 'Select the source branch for the transfer';
      default:
        return 'Select a branch';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Building2" size={20} className="text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Branch Information</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-warning animate-pulse' : 'bg-success'}`} />
          <span className="text-xs text-muted-foreground">
            {isLoading ? 'Syncing...' : 'Registry Synced'}
          </span>
        </div>
      </div>
      <Select
        label={getFieldLabel()}
        description={getFieldDescription()}
        options={getFilteredBranches()}
        value={selectedBranch}
        onChange={onBranchChange}
        placeholder="Search and select branch..."
        searchable
        clearable
        disabled={disabled}
        error={error}
        required
        className="mb-4"
      />
      {selectedBranch && (
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Branch Code
              </label>
              <p className="text-sm font-mono text-foreground mt-1">
                {branches?.find(b => b?.value === selectedBranch)?.code || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Region
              </label>
              <p className="text-sm text-foreground mt-1">
                {branches?.find(b => b?.value === selectedBranch)?.region || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="mt-3 flex items-center space-x-2">
            <Icon name="CheckCircle2" size={16} className="text-success" />
            <span className="text-xs text-success">Branch validated and active</span>
          </div>
        </div>
      )}
      {/* Destination Branch for Branch-to-Branch transfers */}
      {requestType === 'branch-to-branch' && selectedBranch && (
        <div className="mt-6">
          <Select
            label="Destination Branch"
            description="Select the destination branch or Nostro account"
            options={[
              ...getFilteredBranches()?.filter(b => b?.value !== selectedBranch),
              { value: 'NOSTRO001', label: 'Nostro Account - USD', description: 'Foreign currency account' },
              { value: 'NOSTRO002', label: 'Nostro Account - EUR', description: 'Foreign currency account' }
            ]}
            value=""
            onChange={() => {}}
            placeholder="Search and select destination..."
            searchable
            clearable
            disabled={disabled}
            required
            className="mb-4"
          />
        </div>
      )}
    </div>
  );
};

export default BranchSelector;