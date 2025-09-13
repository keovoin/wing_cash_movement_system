import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DashboardHeader = ({ 
  onRefresh, 
  onExport, 
  onFilterToggle, 
  isFilterOpen, 
  lastUpdated,
  isRefreshing 
}) => {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const exportOptions = [
    { id: 'pdf', label: 'Executive Summary (PDF)', icon: 'FileText' },
    { id: 'excel', label: 'Detailed Dataset (Excel)', icon: 'FileSpreadsheet' },
    { id: 'csv', label: 'Raw Data (CSV)', icon: 'Database' }
  ];

  const handleExport = (format) => {
    onExport?.(format);
    setExportDropdownOpen(false);
  };

  return (
    <div className="bg-card border-b border-border p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Reporting & Analytics Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive cash transfer operations analytics and performance metrics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Last Updated */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Last updated: {lastUpdated}</span>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            iconName={isRefreshing ? "Loader2" : "RefreshCw"}
            iconPosition="left"
            className={isRefreshing ? "animate-spin" : ""}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>

          {/* Filter Toggle */}
          <Button
            variant={isFilterOpen ? "default" : "outline"}
            size="sm"
            onClick={onFilterToggle}
            iconName="Filter"
            iconPosition="left"
          >
            Filters
          </Button>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              iconName="Download"
              iconPosition="left"
            >
              Export
              <Icon name="ChevronDown" size={14} className="ml-1" />
            </Button>

            {exportDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-popover border border-border rounded-md shadow-lg z-50 animate-fade-in">
                <div className="py-1">
                  {exportOptions?.map((option) => (
                    <button
                      key={option?.id}
                      onClick={() => handleExport(option?.id)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                    >
                      <Icon name={option?.icon} size={16} />
                      <span>{option?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;