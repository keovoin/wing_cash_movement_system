import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BranchPerformanceTable = ({ data, isLoading }) => {
  const [sortField, setSortField] = useState('totalVolume');
  const [sortDirection, setSortDirection] = useState('desc');

  const branchData = data || [
    {
      id: 'PP001',
      name: 'Phnom Penh Central',
      totalRequests: 156,
      totalVolume: 890000,
      avgProcessingTime: 2.1,
      approvalRate: 96.2,
      pendingRequests: 3,
      status: 'active',
      lastActivity: '2025-01-13 08:30:00'
    },
    {
      id: 'SR001',
      name: 'Siem Reap Branch',
      totalRequests: 89,
      totalVolume: 445000,
      avgProcessingTime: 2.4,
      approvalRate: 94.1,
      pendingRequests: 2,
      status: 'active',
      lastActivity: '2025-01-13 08:15:00'
    },
    {
      id: 'BB001',
      name: 'Battambang Branch',
      totalRequests: 67,
      totalVolume: 312000,
      avgProcessingTime: 1.9,
      approvalRate: 97.8,
      pendingRequests: 1,
      status: 'active',
      lastActivity: '2025-01-13 07:45:00'
    },
    {
      id: 'KP001',
      name: 'Kampong Cham Branch',
      totalRequests: 45,
      totalVolume: 234000,
      avgProcessingTime: 2.8,
      approvalRate: 91.5,
      pendingRequests: 4,
      status: 'warning',
      lastActivity: '2025-01-13 06:30:00'
    },
    {
      id: 'CMC001',
      name: 'Cash Management Center',
      totalRequests: 234,
      totalVolume: 1250000,
      avgProcessingTime: 1.6,
      approvalRate: 98.5,
      pendingRequests: 8,
      status: 'active',
      lastActivity: '2025-01-13 08:40:00'
    }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...branchData]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'error': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors duration-150"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground/50'}`}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`-mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground/50'}`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Building2" size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Branch Performance</h3>
            <p className="text-sm text-muted-foreground">
              Comparative performance metrics across all branches
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            iconPosition="left"
          >
            Filter
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)]?.map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30">
              <tr>
                <SortableHeader field="name">Branch</SortableHeader>
                <SortableHeader field="totalRequests">Requests</SortableHeader>
                <SortableHeader field="totalVolume">Volume</SortableHeader>
                <SortableHeader field="avgProcessingTime">Avg Time</SortableHeader>
                <SortableHeader field="approvalRate">Approval Rate</SortableHeader>
                <SortableHeader field="pendingRequests">Pending</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {sortedData?.map((branch) => (
                <tr key={branch?.id} className="hover:bg-muted/30 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-primary">
                          {branch?.id?.slice(-2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{branch?.name}</div>
                        <div className="text-xs text-muted-foreground">{branch?.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{branch?.totalRequests}</div>
                    <div className="text-xs text-muted-foreground">requests</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {formatCurrency(branch?.totalVolume)}
                    </div>
                    <div className="text-xs text-muted-foreground">total volume</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{branch?.avgProcessingTime}h</div>
                    <div className="text-xs text-muted-foreground">average</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-foreground">{branch?.approvalRate}%</div>
                      <div className={`ml-2 w-16 h-2 rounded-full bg-muted overflow-hidden`}>
                        <div 
                          className="h-full bg-success rounded-full transition-all duration-300"
                          style={{ width: `${branch?.approvalRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      branch?.pendingRequests > 3 ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                    }`}>
                      {branch?.pendingRequests}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(branch?.status)}`}>
                      <Icon name={getStatusIcon(branch?.status)} size={12} className="mr-1" />
                      {branch?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        className="text-muted-foreground hover:text-foreground"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MoreHorizontal"
                        className="text-muted-foreground hover:text-foreground"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BranchPerformanceTable;